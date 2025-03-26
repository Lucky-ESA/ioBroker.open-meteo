"use strict";

/*
 * Created with @iobroker/create-adapter v2.6.5
 */

// The adapter-core module gives you access to the core ioBroker functions
// you need to create an adapter
const utils = require("@iobroker/adapter-core");
const { find } = require("geo-tz");
const axios = require("axios");
const helper = require("./lib/helper");
const constants = require("./lib/constants");
const SunCalc = require("./lib/suncalc3");
const { RecurrenceRule, scheduleJob } = require("node-schedule");
let status = {
    countRequest: 0,
    countRequestMaxDay: 10000,
    countRequestMaxHour: 5000,
    countRequestMaxMinute: 600,
    timestamp: 0,
    timeISO: new Date(),
    countError: 0,
    error: "NoError",
    timestampError: 0,
    lastError: new Date(),
    timestampRestart: Date.now(),
    timeISORestart: new Date(),
    stopAdapter: 0,
};
let customer = "";
let countVal = 0;

class OpenMeteo extends utils.Adapter {
    /**
     * @param {Partial<utils.AdapterOptions>} [options={}]
     */
    constructor(options) {
        super({
            ...options,
            name: "open-meteo",
        });
        this.on("ready", this.onReady.bind(this));
        this.on("stateChange", this.onStateChange.bind(this));
        // this.on("objectChange", this.onObjectChange.bind(this));
        // this.on("message", this.onMessage.bind(this));
        this.createDataPoint = helper.createDataPoint;
        this.createObjectsStates = helper.createObjectsStates;
        this.createObjects = helper.createObjects;
        this.checkObjects = helper.checkObjects;
        this.createObjectsSunCalc = helper.createObjectsSunCalc;
        this.on("unload", this.onUnload.bind(this));
        this.requestClient = axios.create({
            withCredentials: true,
            timeout: 5000,
        });
        this.param = {};
        this.interval = null;
        this.lang = "de";
        this.stateCheck = [];
        this.conn = false;
        this.req = 0;
        this.clearCount = null;
        this.updateSun = null;
        this.intervalPosition = null;
        this.value = {};
        this.getHeader = {};
        this.timeArray = {};
    }

    /**
     * Is called when databases are connected and adapter received configuration.
     */
    async onReady() {
        const loadStatus = await this.getStateAsync("status");
        if (loadStatus && typeof loadStatus.val === "string" && loadStatus.val.includes("countRequestMaxDay")) {
            status = JSON.parse(loadStatus.val);
        }
        const actualTimestamp = Date.now() - status.stopAdapter;
        if (actualTimestamp > 86400000) {
            status.countRequest = 0;
        }
        status.countError = 0;
        status.countRequestMaxDay = this.config.maxRequest != null ? this.config.maxRequest : 100000;
        this.stateCheck.push(`${this.namespace}.info.connection`);
        this.setState("info.connection", false, true);
        this.subscribeStates("*");
        const obj = await this.getForeignObjectAsync("system.config");
        if (obj && obj.common && obj.common.language) {
            try {
                this.lang = obj.common.language === this.lang ? this.lang : obj.common.language;
            } catch (e) {
                this.log.error(`Error lang: ${e}`);
            }
        }
        const app_agent = constants.APP_AGENT[Math.floor(Math.random() * constants.APP_AGENT.length)];
        this.getHeader = {
            headers: {
                "User-Agent": app_agent,
                "Content-Type": "application/json;charset=utf-8",
                "Accept-Encoding": "gzip, deflate",
                Accept: "*/*",
                "Accept-Language": `${this.lang}-${this.lang.toUpperCase()},${this.lang};q=0.9`,
                Country: this.lang.toUpperCase(),
            },
        };
        if (typeof this.config.interval !== "number") {
            this.log.warn(`Set interval on 60!`);
            this.config.interval = 60;
        }
        if (this.config.interval < 15 || this.config.interval > 1440) {
            this.log.warn(`Set interval on 60!`);
            this.config.interval = 60;
        }
        const coo = await this.getCoordinate();
        const utc = await this.getUTC(coo);
        this.log.debug(JSON.stringify(coo));
        this.log.debug(utc);
        this.param.timezone = utc;
        this.param.latitude = coo[0];
        this.param.longitude = coo[1];
        this.param.models = "icon_seamless";
        this.log.info(`Create or update objects!`);
        await this.createObjects();
        await this.checkObjects();
        await this.createObjectsSunCalc();
        this.setIntervalData();
        this.setWeatherData();
        this.stateCheck = [];
        this.conn = true;
        this.setState("info.connection", true, true);
        this.setIntervalPosition();
        this.clearCounter();
        this.sunCalculation();
    }

    /**
     * Is called when adapter shuts down - callback has to be called under any circumstances!
     *
     * @param {() => void} callback
     */
    onUnload(callback) {
        try {
            status.stopAdapter = Date.now();
            this.setState("status", { val: JSON.stringify(status), ack: true });
            this.interval && this.clearInterval(this.interval);
            this.intervalPosition && this.clearInterval(this.intervalPosition);
            this.clearCount && this.clearCount.cancel();
            this.updateSun && this.updateSun.cancel();
            callback();
        } catch {
            callback();
        }
    }

    // If you need to react to object changes, uncomment the following block and the corresponding line in the constructor.
    // You also need to subscribe to the objects with `this.subscribeObjects`, similar to `this.subscribeStates`.
    // /**
    //  * Is called if a subscribed object changes
    //  * @param {string} id
    //  * @param {ioBroker.Object | null | undefined} obj
    //  */
    // onObjectChange(id, obj) {
    //     if (obj) {
    //         // The object was changed
    //         this.log.info(`object ${id} changed: ${JSON.stringify(obj)}`);
    //     } else {
    //         // The object was deleted
    //         this.log.info(`object ${id} deleted`);
    //     }
    // }

    /**
     * Is called if a subscribed state changes
     *
     * @param {string} id
     * @param {ioBroker.State | null | undefined} state
     */
    onStateChange(id, state) {
        if (state && !state.ack) {
            const command = id.split(".").pop();
            if (command === "update") {
                this.updateStates();
                this.setState(id, false, true);
            } else if (command === "param") {
                this.setOwnParam(state);
                this.setState(id, { ack: true });
            }
            this.log.info(`state ${id} changed: ${state.val} (ack = ${state.ack})`);
        }
    }

    // If you need to accept messages in your adapter, uncomment the following block and the corresponding line in the constructor.
    // /**
    //  * Some message was sent to this instance over message box. Used by email, pushover, text2speech, ...
    //  * Using this method requires "common.messagebox" property to be set to true in io-package.json
    //  * @param {ioBroker.Message} obj
    //  */
    // onMessage(obj) {
    //     if (typeof obj === "object" && obj.message) {
    //         if (obj.command === "send") {
    //             // e.g. send email or pushover or whatever
    //             this.log.info("send command");

    //             // Send response in callback if required
    //             if (obj.callback) this.sendTo(obj.from, obj.command, "Message received", obj.callback);
    //         }
    //     }
    // }

    async clearCounter() {
        const rule = new RecurrenceRule();
        rule.dayOfWeek = [0, 1, 2, 3, 4, 5, 6];
        rule.hour = 0;
        rule.minute = 1;
        this.clearCount = scheduleJob(rule, async () => {
            this.log.info("Clear request counter!");
            status.countRequest = 0;
            await this.setState("status", { val: JSON.stringify(status), ack: true });
        });
    }

    async sunCalculation() {
        const rule = new RecurrenceRule();
        rule.dayOfWeek = [0, 1, 2, 3, 4, 5, 6];
        rule.hour = 2;
        rule.minute = 1;
        this.updateSun = scheduleJob(rule, async () => {
            this.log.info("Update sun calculation!");
            this.setSunCalc();
        });
    }

    async setSunCalc() {
        const times = SunCalc.getSunTimes(new Date(), this.param.latitude, this.param.longitude);
        const sunriseStart =
            `${`0${times.sunriseStart.value.getHours()}`.slice(-2)}:` +
            `${`0${times.sunriseStart.value.getMinutes()}`.slice(-2)}`;
        await this.setState(`suncalc.sunriseStart`, { val: sunriseStart, ack: true });
        this.timeArray["sunriseStart"] = times.sunriseStart.value;
        const sunriseEnd =
            `${`0${times.sunriseEnd.value.getHours()}`.slice(-2)}:` +
            `${`0${times.sunriseEnd.value.getMinutes()}`.slice(-2)}`;
        await this.setState(`suncalc.sunriseEnd`, { val: sunriseEnd, ack: true });
        this.timeArray["sunriseEnd"] = times.sunriseEnd.value;
        const sunsetStart =
            `${`0${times.sunsetStart.value.getHours()}`.slice(-2)}:` +
            `${`0${times.sunsetStart.value.getMinutes()}`.slice(-2)}`;
        await this.setState(`suncalc.sunsetStart`, { val: sunsetStart, ack: true });
        this.timeArray["sunsetStart"] = times.sunsetStart.value;
        const sunsetEnd =
            `${`0${times.sunsetEnd.value.getHours()}`.slice(-2)}:` +
            `${`0${times.sunsetEnd.value.getMinutes()}`.slice(-2)}`;
        await this.setState(`suncalc.sunsetEnd`, { val: sunsetEnd, ack: true });
        this.timeArray["sunsetEnd"] = times.sunsetEnd.value;
        const solarNoon =
            `${`0${times.solarNoon.value.getHours()}`.slice(-2)}:` +
            `${`0${times.solarNoon.value.getMinutes()}`.slice(-2)}`;
        await this.setState(`suncalc.solarNoon`, { val: solarNoon, ack: true });
        this.timeArray["solarNoon"] = times.solarNoon.value;
        const goldenHourDuskStart =
            `${`0${times.goldenHourDuskStart.value.getHours()}`.slice(-2)}:` +
            `${`0${times.goldenHourDuskStart.value.getMinutes()}`.slice(-2)}`;
        await this.setState(`suncalc.goldenHourDuskStart`, { val: goldenHourDuskStart, ack: true });
        this.timeArray["goldenHourDuskStart"] = times.goldenHourDuskStart.value;
        const goldenHourDuskEnd =
            `${`0${times.goldenHourDuskEnd.value.getHours()}`.slice(-2)}:` +
            `${`0${times.goldenHourDuskEnd.value.getMinutes()}`.slice(-2)}`;
        await this.setState(`suncalc.goldenHourDuskEnd`, { val: goldenHourDuskEnd, ack: true });
        this.timeArray["goldenHourDuskEnd"] = times.goldenHourDuskEnd.value;
        const nadir =
            `${`0${times.nadir.value.getHours()}`.slice(-2)}:` + `${`0${times.nadir.value.getMinutes()}`.slice(-2)}`;
        await this.setState(`suncalc.nadir`, { val: nadir, ack: true });
        this.timeArray["nadir"] = times.nadir.value;
        const civilDusk =
            `${`0${times.civilDusk.value.getHours()}`.slice(-2)}:` +
            `${`0${times.civilDusk.value.getMinutes()}`.slice(-2)}`;
        await this.setState(`suncalc.civilDusk`, { val: civilDusk, ack: true });
        this.timeArray["civilDusk"] = times.civilDusk.value;
        const civilDawn =
            `${`0${times.civilDawn.value.getHours()}`.slice(-2)}:` +
            `${`0${times.civilDawn.value.getMinutes()}`.slice(-2)}`;
        await this.setState(`suncalc.civilDawn`, { val: civilDawn, ack: true });
        this.timeArray["civilDawn"] = times.civilDawn.value;
        const astronomicalDusk =
            `${`0${times.astronomicalDusk.value.getHours()}`.slice(-2)}:` +
            `${`0${times.astronomicalDusk.value.getMinutes()}`.slice(-2)}`;
        await this.setState(`suncalc.astronomicalDusk`, { val: astronomicalDusk, ack: true });
        this.timeArray["astronomicalDusk"] = times.astronomicalDusk.value;
        const astronomicalDawn =
            `${`0${times.astronomicalDawn.value.getHours()}`.slice(-2)}:` +
            `${`0${times.astronomicalDawn.value.getMinutes()}`.slice(-2)}`;
        await this.setState(`suncalc.astronomicalDawn`, { val: astronomicalDawn, ack: true });
        this.timeArray["astronomicalDawn"] = times.astronomicalDawn.value;
        const blueHourDawnStart =
            `${`0${times.blueHourDawnStart.value.getHours()}`.slice(-2)}:` +
            `${`0${times.blueHourDawnStart.value.getMinutes()}`.slice(-2)}`;
        await this.setState(`suncalc.blueHourDawnStart`, { val: blueHourDawnStart, ack: true });
        this.timeArray["blueHourDawnStart"] = times.blueHourDawnStart.value;
        const blueHourDawnEnd =
            `${`0${times.blueHourDawnEnd.value.getHours()}`.slice(-2)}:` +
            `${`0${times.blueHourDawnEnd.value.getMinutes()}`.slice(-2)}`;
        await this.setState(`suncalc.blueHourDawnEnd`, { val: blueHourDawnEnd, ack: true });
        this.timeArray["blueHourDawnEnd"] = times.blueHourDawnEnd.value;
        const blueHourDuskStart =
            `${`0${times.blueHourDuskStart.value.getHours()}`.slice(-2)}:` +
            `${`0${times.blueHourDuskStart.value.getMinutes()}`.slice(-2)}`;
        await this.setState(`suncalc.blueHourDuskStart`, { val: blueHourDuskStart, ack: true });
        this.timeArray["blueHourDuskStart"] = times.blueHourDuskStart.value;
        const blueHourDuskEnd =
            `${`0${times.blueHourDuskEnd.value.getHours()}`.slice(-2)}:` +
            `${`0${times.blueHourDuskEnd.value.getMinutes()}`.slice(-2)}`;
        await this.setState(`suncalc.blueHourDuskEnd`, { val: blueHourDuskEnd, ack: true });
        this.timeArray["blueHourDuskEnd"] = times.blueHourDuskEnd.value;
        const goldenHourDawnStart =
            `${`0${times.goldenHourDawnStart.value.getHours()}`.slice(-2)}:` +
            `${`0${times.goldenHourDawnStart.value.getMinutes()}`.slice(-2)}`;
        await this.setState(`suncalc.goldenHourDawnStart`, { val: goldenHourDawnStart, ack: true });
        this.timeArray["goldenHourDawnStart"] = times.goldenHourDawnStart.value;
        const goldenHourDawnEnd =
            `${`0${times.goldenHourDawnEnd.value.getHours()}`.slice(-2)}:` +
            `${`0${times.goldenHourDawnEnd.value.getMinutes()}`.slice(-2)}`;
        await this.setState(`suncalc.goldenHourDawnEnd`, { val: goldenHourDawnEnd, ack: true });
        this.timeArray["goldenHourDawnEnd"] = times.goldenHourDawnEnd.value;
        const nauticalDawn =
            `${`0${times.nauticalDawn.value.getHours()}`.slice(-2)}:` +
            `${`0${times.nauticalDawn.value.getMinutes()}`.slice(-2)}`;
        await this.setState(`suncalc.nauticalDawn`, { val: nauticalDawn, ack: true });
        this.timeArray["nauticalDawn"] = times.nauticalDawn.value;
        const nauticalDusk =
            `${`0${times.nauticalDusk.value.getHours()}`.slice(-2)}:` +
            `${`0${times.nauticalDusk.value.getMinutes()}`.slice(-2)}`;
        await this.setState(`suncalc.nauticalDusk`, { val: nauticalDusk, ack: true });
        this.timeArray["nauticalDusk"] = times.nauticalDusk.value;
        const amateurDawn =
            `${`0${times.amateurDawn.value.getHours()}`.slice(-2)}:` +
            `${`0${times.amateurDawn.value.getMinutes()}`.slice(-2)}`;
        await this.setState(`suncalc.amateurDawn`, { val: amateurDawn, ack: true });
        this.timeArray["amateurDawn"] = times.amateurDawn.value;
        const amateurDusk =
            `${`0${times.amateurDusk.value.getHours()}`.slice(-2)}:` +
            `${`0${times.amateurDusk.value.getMinutes()}`.slice(-2)}`;
        await this.setState(`suncalc.amateurDusk`, { val: amateurDusk, ack: true });
        this.timeArray["amateurDusk"] = times.amateurDusk.value;
        this.getPosition();
    }

    async getPosition() {
        const sunPosition = SunCalc.getPosition(new Date(), this.param.latitude, this.param.longitude);
        this.log.debug(JSON.stringify(sunPosition));
        const moonPosition = SunCalc.getMoonData(new Date(), this.param.latitude, this.param.longitude);
        this.log.debug(JSON.stringify(moonPosition));
        await this.setState(`suncalc.sunElevation`, { val: this.roundToTwo(sunPosition.azimuth), ack: true });
        await this.setState(`suncalc.sunAltitudeDegrees`, {
            val: this.roundToTwo(sunPosition.altitudeDegrees),
            ack: true,
        });
        await this.setState(`suncalc.sunAzimuthDegrees`, {
            val: this.roundToTwo(sunPosition.azimuthDegrees),
            ack: true,
        });
        await this.setState(`suncalc.moonElevation`, { val: this.roundToTwo(moonPosition.azimuth), ack: true });
        await this.setState(`suncalc.moonAltitudeDegrees`, {
            val: this.roundToTwo(moonPosition.altitudeDegrees),
            ack: true,
        });
        await this.setState(`suncalc.moonAzimuthDegrees`, {
            val: this.roundToTwo(moonPosition.azimuthDegrees),
            ack: true,
        });
        await this.setState(`suncalc.moonEmoji`, {
            val: moonPosition.illumination.phase.emoji,
            ack: true,
        });
        let diff = [];
        let timeJSON = {};
        this.log.debug(JSON.stringify(this.timeArray));
        for (const timeArray in this.timeArray) {
            const timestamp = new Date(this.timeArray[timeArray]).getTime() - new Date().getTime();
            timeJSON[timestamp] = timeArray;
            diff.push(timestamp);
        }
        const current = diff
            .sort((a, b) => {
                return b - a;
            })
            .find(x => x < 0);
        const next = diff
            .sort((a, b) => {
                return a - b;
            })
            .find(x => x > 0);
        this.log.debug(JSON.stringify(timeJSON));
        this.log.debug(JSON.stringify(diff));
        await this.setState(`suncalc.currentAstroTime`, {
            val: constants.ASTRO[timeJSON[current]][this.lang],
            ack: true,
        });
        await this.setState(`suncalc.nextAstroTime`, {
            val: constants.ASTRO[timeJSON[next]][this.lang],
            ack: true,
        });
        await this.setState(`suncalc.currentState`, {
            val: timeJSON[current],
            ack: true,
        });
        await this.setState(`suncalc.nextState`, {
            val: timeJSON[next],
            ack: true,
        });
    }

    setIntervalPosition() {
        this.log.debug(`Start position with ${this.intervalPosition} minute!`);
        this.intervalPosition && this.clearInterval(this.intervalPosition);
        this.intervalPosition = null;
        this.intervalPosition = this.setInterval(() => {
            this.getPosition();
        }, 60 * 1000);
    }

    roundToTwo(num) {
        return Math.round(num * 100) / 100;
    }

    calculateAPIrequest() {
        let count = 0;
        for (const config in this.config) {
            if (
                config.startsWith("h_") ||
                config.startsWith("d_") ||
                config.startsWith("c_") ||
                config.startsWith("m_")
            ) {
                if (this.config[config]) {
                    ++count;
                }
            }
        }
        this.req = Math.round(count * 1.7);
    }

    /**
     * Save status request JSON
     *
     * @param {number} val
     */
    async setStatusRequest(val) {
        status.countRequest += val;
        status.timestamp = new Date().getTime();
        status.timeISO = new Date();
        await this.setState("status", { val: JSON.stringify(status), ack: true });
    }

    /**
     * Save status error JSON
     *
     * @param {*} err
     */
    async setStatusError(err) {
        ++status.countError;
        status.error = err;
        status.timestampError = new Date().getTime();
        status.lastError = new Date();
        await this.setState("status", { val: JSON.stringify(status), ack: true });
    }

    async setOwnParam(state) {
        if (status.countRequest > status.countRequestMaxDay) {
            this.log.error(
                `The maximum number of queries of 10,000 has been reached! New queries will be possible again from 12:01 AM.`,
            );
            return;
        }
        let val;
        try {
            val = JSON.parse(state.val);
        } catch (e) {
            this.log.error(`Error: ${e}`);
            return;
        }
        // ToDo More request on days > 7 and model > 1 and past days
        const req = Math.round(Object.keys(val).length * 1.7);
        const data = await this.requestClient({
            method: "get",
            url: `https://${customer}api.open-meteo.com/v1/forecast`,
            params: val,
            ...this.getHeader,
        })
            .then(res => {
                if (!this.conn) {
                    this.setState("info.connection", true, true);
                }
                this.setStatusRequest(req);
                return res.data ? res.data : false;
            })
            .catch(error => {
                this.log.error(error);
                error.response && this.log.error(JSON.stringify(error.response.message));
                if (this.conn) {
                    this.setState("info.connection", false, true);
                }
                this.setStatusError(error);
                return false;
            });
        if (data) {
            this.log.debug(JSON.stringify(data));
            await this.setState(`result`, { val: JSON.stringify(data), ack: true });
        } else {
            this.log.error(`Cannot read data!`);
        }
    }

    async setWeatherData() {
        if (this.config.temperaturUnit !== "default") {
            this.param.temperature_unit = this.config.temperaturUnit;
        }
        if (this.config.windSpeedUnit !== "default") {
            this.param.wind_speed_unit = this.config.windSpeedUnit;
        }
        if (this.config.precipitationUnit !== "default") {
            this.param.precipitation_unit = this.config.precipitationUnit;
        }
        if (this.config.timeformat !== "default") {
            this.param.timeformat = this.config.timeformat;
        }
        for (const config in this.config) {
            if (config.startsWith("h_") && this.config[config]) {
                this.param.hourly = this.param.hourly
                    ? `${this.param.hourly},${config.replace("h_", "")}`
                    : config.replace("h_", "");
            } else if (config.startsWith("d_") && this.config[config]) {
                this.param.daily = this.param.daily
                    ? `${this.param.daily},${config.replace("d_", "")}`
                    : config.replace("d_", "");
            } else if (config.startsWith("c_") && this.config[config]) {
                this.param.current = this.param.current
                    ? `${this.param.current},${config.replace("c_", "")}`
                    : config.replace("c_", "");
            } else if (config.startsWith("m_") && this.config[config]) {
                this.param.minutely_15 = this.param.minutely_15
                    ? `${this.param.minutely_15},${config.replace("m_", "")}`
                    : config.replace("m_", "");
            }
        }
        if (
            this.param.hourly == null &&
            this.param.daily == null &&
            this.param.current == null &&
            this.param.minutely_15 == null
        ) {
            this.log.warn(`No variable set!`);
            return;
        }
        if (this.config.forecast != 7) {
            this.param.forecast_days = this.config.forecast;
        }
        if (this.config.apiKey && this.config.apiKey != "") {
            this.param.apikey = this.config.apiKey;
            customer = "customer-";
        }
        await this.setState(`param`, { val: JSON.stringify(this.param), ack: true });
        this.setSunCalc();
        this.calculateAPIrequest();
        this.updateStates();
    }

    async updateStates() {
        const data = await this.getWeatherData();
        if (data) {
            this.log.debug(JSON.stringify(data));
            await this.setState(`result`, { val: JSON.stringify(data), ack: true });
            this.setWeatherStates(data);
            this.setState("last_update", new Date().getTime(), true);
        } else {
            this.log.error(`Cannot read data!`);
        }
    }

    async setWeatherStates(val) {
        countVal = 0;
        const current = val.current;
        if (current) {
            for (const variable in current) {
                if (variable === "time") {
                    await this.setValue(`current.${variable}`, new Date(current.time).toString());
                } else if (variable === "interval") {
                    // skip
                } else if (variable === "weather_code") {
                    await this.setValue(`current.${variable}`, current.weather_code);
                    await this.setValue(
                        `current.${variable}_text`,
                        constants.WeatherCode[current.weather_code][this.lang],
                    );
                } else if (current[variable] != null) {
                    await this.setValue(`current.${variable}`, current[variable]);
                }
            }
        }
        const daily = val.daily;
        let count = 0;
        if (daily) {
            for (let i = 1; i < this.config.forecast + 1; i++) {
                const path2 = `daily.day${`0${i}`.slice(-2)}`;
                for (const variable in daily) {
                    if (variable === "time") {
                        await this.setValue(`${path2}.${variable}`, new Date(daily.time[count]).toString());
                    } else if (variable === "weather_code") {
                        await this.setValue(`${path2}.${variable}`, daily.weather_code[count]);
                        await this.setValue(
                            `${path2}.${variable}_text`,
                            constants.WeatherCode[daily.weather_code[count]][this.lang],
                        );
                    } else if (daily[variable][count] != null) {
                        await this.setValue(`${path2}.${variable}`, daily[variable][count]);
                    }
                }
                ++count;
            }
        }
        const hourly = val.hourly;
        if (hourly) {
            count = 0;
            for (let i = 1; i < this.config.forecast + 1; i++) {
                const path = `hourly.day${`0${i}`.slice(-2)}`;
                for (let a = 0; a < 24; a++) {
                    const path2 = `${path}.hour${`0${a}`.slice(-2)}`;
                    for (const variable in hourly) {
                        if (variable === "time") {
                            await this.setValue(`${path2}.${variable}`, new Date(hourly.time[count]).toString());
                        } else if (variable === "weather_code") {
                            await this.setValue(`${path2}.${variable}`, hourly.weather_code[count]);
                            await this.setValue(
                                `${path2}.${variable}_text`,
                                constants.WeatherCode[hourly.weather_code[count]][this.lang],
                            );
                        } else if (hourly[variable][count] != null) {
                            await this.setValue(`${path2}.${variable}`, hourly[variable][count]);
                        }
                    }
                    ++count;
                }
            }
        }
        const minutely_15 = val.minutely_15;
        if (minutely_15) {
            count = 0;
            const min = { 0: "00", 1: "15", 2: "30", 3: "45" };
            for (let i = 1; i < this.config.forecast + 1; i++) {
                const path = `minutely.day${`0${i}`.slice(-2)}`;
                for (let a = 0; a < 23 + 1; a++) {
                    const path2 = `${path}.hour${`0${a}`.slice(-2)}`;
                    for (let b = 0; b < 4; b++) {
                        const path3 = `${path2}.minute${min[b]}`;
                        for (const variable in minutely_15) {
                            if (variable === "time") {
                                await this.setValue(
                                    `${path3}.${variable}`,
                                    new Date(minutely_15.time[count]).toString(),
                                );
                            } else if (variable === "is_day") {
                                await this.setValue(`${path3}.${variable}`, minutely_15.is_day[count] ? true : false);
                            } else if (minutely_15[variable][count] != null) {
                                await this.setValue(`${path3}.${variable}`, minutely_15[variable][count]);
                            }
                        }
                    }
                }
            }
        }
        this.log.info(`${countVal} States have been updated!`);
    }

    async setValue(id, val) {
        if (!this.value[id] || this.value[id] != val) {
            this.value[id] = val;
            ++countVal;
            await this.setState(id, {
                val: val,
                ack: true,
            });
        }
    }

    async getWeatherData() {
        if (status.countRequest > status.countRequestMaxDay) {
            this.log.error(
                `The maximum number of queries of 10,000 has been reached! New queries will be possible again from 12:01 AM.`,
            );
            return false;
        }
        return await this.requestClient({
            method: "get",
            url: `https://${customer}api.open-meteo.com/v1/forecast`,
            params: this.param,
            ...this.getHeader,
        })
            .then(res => {
                if (!this.conn) {
                    this.setState("info.connection", true, true);
                }
                this.setStatusRequest(this.req);
                return res.data ? res.data : false;
            })
            .catch(error => {
                this.log.error(error);
                error.response && this.log.error(JSON.stringify(error.response.message));
                if (this.conn) {
                    this.setState("info.connection", false, true);
                }
                this.setStatusError(error);
                return false;
            });
    }

    setIntervalData() {
        this.log.debug(`Start interval with ${this.config.interval} minutes!`);
        this.interval && this.clearInterval(this.interval);
        this.interval = null;
        this.interval = this.setInterval(
            () => {
                this.updateStates();
            },
            this.config.interval * 60 * 1000,
        );
    }

    async getCoordinate() {
        if (this.config.coordinates) {
            const coo = this.config.coordinates.split(",");
            if (typeof coo[0] === "string" && typeof coo[1] === "string") {
                return [parseFloat(coo[0]), parseFloat(coo[1])];
            }
        }
        const obj = await this.getForeignObjectAsync("system.config");
        if (obj && obj.common && obj.common.latitude && obj.common.longitude) {
            const lat = obj.common.latitude;
            const long = obj.common.longitude;
            this.log.debug(`Got coordinates lat=${lat} long=${long}`);
            return [lat, long];
        }
        this.log.error("Could not read coordinates from system.config, using Berlins coordinates as fallback");
        return [52, 13];
    }

    async getUTC(coo) {
        const utc = find(coo[0], coo[1]);
        if (utc && utc[0]) {
            this.log.debug(JSON.stringify(utc));
            return utc[0];
        }
        return "Europe/Berlin";
    }
}

if (require.main !== module) {
    // Export the constructor in compact mode
    /**
     * @param {Partial<utils.AdapterOptions>} [options={}]
     */
    module.exports = options => new OpenMeteo(options);
} else {
    // otherwise start the instance directly
    new OpenMeteo();
}
