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
//const dummy = require("./lib/dummy_request");
const SVG = require("./lib/svgCreater");
const SunCalc = require("suncalc3");
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
const weather_code = {
    0: 100,
    1: 101,
    2: 102,
    3: 103,
    61: 161,
    63: 163,
    65: 165,
    66: 166,
    67: 167,
};

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
        this.createIconColor = helper.createIconColor;
        this.createHTML = helper.createHTML;
        this.on("unload", this.onUnload.bind(this));
        this.svg = new SVG(this);
        this.requestClient = axios.create({
            withCredentials: true,
            timeout: 5000,
        });
        this.param = {};
        this.param_second = {};
        this.interval = null;
        this.lang = "de";
        this.stateCheck = [];
        this.conn = false;
        this.req = 0;
        this.req_second = 0;
        this.clearCount = null;
        this.updateSun = null;
        this.intervalPosition = null;
        this.value = {};
        this.getHeader = {};
        this.timeArray = {};
        this.lastCurrent = "";
        this.own_color = {};
        this.html = {};
        this.images = {};
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
        this.param_second.timezone = utc;
        this.param_second.latitude = coo[0];
        this.param_second.longitude = coo[1];
        this.param_second.models = "best_match";
        if (this.config.model != "none") {
            this.param.models = this.config.model;
        }
        this.log.info(`Create or update objects!`);
        await this.createObjects();
        await this.createIconColor();
        await this.readColor();
        await this.setColor();
        await this.createObjectsSunCalc();
        this.setIntervalData();
        await this.setWeatherData(true);
        this.conn = true;
        this.setState("info.connection", true, true);
        this.clearCounter();
        if (
            this.param.current &&
            this.param.daily &&
            this.param.daily.includes("temperature_2m_max") &&
            this.param.daily.includes("temperature_2m_min")
        ) {
            await this.createHTML();
            await this.readHTML();
            this.updateHTML();
        } else {
            await this.delObjectAsync(`html`, { recursive: true });
        }
        this.sunCalculation();
        this.setIntervalPosition();
        await this.checkObjects();
        this.stateCheck = [];
        this.subscribeStates("*");
        await this.readAllFiles();
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
            } else if (command === "trigger") {
                this.html.trigger = state.val;
                this.updateHTML();
                this.setState(id, { ack: true });
            } else if (command === "trigger_hourly") {
                this.html.trigger_hourly = state.val;
                this.updateHTML();
                this.setState(id, { ack: true });
            } else if (this.html[command]) {
                this.log.debug(`HTML changed!`);
                this.html[command] = state.val;
                if (command && command.indexOf("compass") !== -1 && command.indexOf("color") !== -1) {
                    this.images = {};
                }
                this.updateHTML();
                this.setState(id, { ack: true });
            } else if (this.own_color[command]) {
                this.log.debug(`Icon color changed!`);
                this.own_color[command] = state.val;
                this.setColor();
                this.setState(id, { ack: true });
            }
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
            this.setSunCalc(false);
        });
    }

    async setSunCalc(first) {
        const times = SunCalc.getSunTimes(new Date(), this.param.latitude, this.param.longitude);
        const sunriseStart = this.timeCounting(times.sunriseStart.value);
        await this.setState(`suncalc.sunriseStart`, { val: sunriseStart, ack: true });
        this.timeArray["sunriseStart"] = times.sunriseStart.value;
        const sunriseEnd = this.timeCounting(times.sunriseEnd.value);
        await this.setState(`suncalc.sunriseEnd`, { val: sunriseEnd, ack: true });
        this.timeArray["sunriseEnd"] = times.sunriseEnd.value;
        const sunsetStart = this.timeCounting(times.sunsetStart.value);
        await this.setState(`suncalc.sunsetStart`, { val: sunsetStart, ack: true });
        this.timeArray["sunsetStart"] = times.sunsetStart.value;
        const sunsetEnd = this.timeCounting(times.sunsetEnd.value);
        await this.setState(`suncalc.sunsetEnd`, { val: sunsetEnd, ack: true });
        this.timeArray["sunsetEnd"] = times.sunsetEnd.value;
        const solarNoon = this.timeCounting(times.solarNoon.value);
        await this.setState(`suncalc.solarNoon`, { val: solarNoon, ack: true });
        this.timeArray["solarNoon"] = times.solarNoon.value;
        const goldenHourDuskStart = this.timeCounting(times.goldenHourDuskStart.value);
        await this.setState(`suncalc.goldenHourDuskStart`, { val: goldenHourDuskStart, ack: true });
        this.timeArray["goldenHourDuskStart"] = times.goldenHourDuskEnd.value;
        const goldenHourDuskEnd = this.timeCounting(times.amateurDawn.value);
        await this.setState(`suncalc.goldenHourDuskEnd`, { val: goldenHourDuskEnd, ack: true });
        this.timeArray["goldenHourDuskEnd"] = times.nadir.value;
        const nadir = this.timeCounting(times.amateurDawn.value);
        await this.setState(`suncalc.nadir`, { val: nadir, ack: true });
        this.timeArray["nadir"] = times.nadir.value;
        const civilDusk = this.timeCounting(times.civilDusk.value);
        await this.setState(`suncalc.civilDusk`, { val: civilDusk, ack: true });
        this.timeArray["civilDusk"] = times.civilDusk.value;
        const civilDawn = this.timeCounting(times.civilDawn.value);
        await this.setState(`suncalc.civilDawn`, { val: civilDawn, ack: true });
        this.timeArray["civilDawn"] = times.civilDawn.value;
        const astronomicalDusk = this.timeCounting(times.astronomicalDusk.value);
        await this.setState(`suncalc.astronomicalDusk`, { val: astronomicalDusk, ack: true });
        this.timeArray["astronomicalDusk"] = times.astronomicalDusk.value;
        const astronomicalDawn = this.timeCounting(times.astronomicalDawn.value);
        await this.setState(`suncalc.astronomicalDawn`, { val: astronomicalDawn, ack: true });
        this.timeArray["astronomicalDawn"] = times.astronomicalDawn.value;
        const blueHourDawnStart = this.timeCounting(times.blueHourDawnStart.value);
        await this.setState(`suncalc.blueHourDawnStart`, { val: blueHourDawnStart, ack: true });
        this.timeArray["blueHourDawnStart"] = times.blueHourDawnStart.value;
        const blueHourDawnEnd = this.timeCounting(times.blueHourDawnEnd.value);
        await this.setState(`suncalc.blueHourDawnEnd`, { val: blueHourDawnEnd, ack: true });
        this.timeArray["blueHourDawnEnd"] = times.blueHourDawnEnd.value;
        const blueHourDuskStart = this.timeCounting(times.blueHourDuskStart.value);
        await this.setState(`suncalc.blueHourDuskStart`, { val: blueHourDuskStart, ack: true });
        this.timeArray["blueHourDuskStart"] = times.blueHourDuskStart.value;
        const blueHourDuskEnd = this.timeCounting(times.blueHourDuskEnd.value);
        await this.setState(`suncalc.blueHourDuskEnd`, { val: blueHourDuskEnd, ack: true });
        this.timeArray["blueHourDuskEnd"] = times.blueHourDuskEnd.value;
        const goldenHourDawnStart = this.timeCounting(times.goldenHourDawnStart.value);
        await this.setState(`suncalc.goldenHourDawnStart`, { val: goldenHourDawnStart, ack: true });
        this.timeArray["goldenHourDawnStart"] = times.goldenHourDawnStart.value;
        const goldenHourDawnEnd = this.timeCounting(times.goldenHourDawnEnd.value);
        await this.setState(`suncalc.goldenHourDawnEnd`, { val: goldenHourDawnEnd, ack: true });
        this.timeArray["goldenHourDawnEnd"] = times.goldenHourDawnEnd.value;
        const nauticalDawn = this.timeCounting(times.nauticalDawn.value);
        await this.setState(`suncalc.nauticalDawn`, { val: nauticalDawn, ack: true });
        this.timeArray["nauticalDawn"] = times.nauticalDawn.value;
        const nauticalDusk = this.timeCounting(times.nauticalDusk.value);
        await this.setState(`suncalc.nauticalDusk`, { val: nauticalDusk, ack: true });
        this.timeArray["nauticalDusk"] = times.nauticalDusk.value;
        const amateurDawn = this.timeCounting(times.amateurDawn.value);
        await this.setState(`suncalc.amateurDawn`, { val: amateurDawn, ack: true });
        this.timeArray["amateurDawn"] = times.amateurDawn.value;
        const amateurDusk = this.timeCounting(times.amateurDusk.value);
        await this.setState(`suncalc.amateurDusk`, { val: amateurDusk, ack: true });
        this.timeArray["amateurDusk"] = times.amateurDusk.value;
        await this.setState(`suncalc.seasons`, { val: this.seasonalBackground(), ack: true });
        this.getPosition(first);
    }

    timeCounting(times) {
        if (this.config.am_pm === 12) {
            const now = new Date(times);
            const hours = now.getHours();
            const minutes = now.getMinutes();
            if (hours > 12) {
                return `0${hours % 12}:${`0${minutes}}`.slice(-2)} PM`;
            }
            return `0${hours % 12}:${`0${minutes}}`.slice(-2)} AM`;
        }
        return `${`0${times.getHours()}`.slice(-2)}:` + `${`0${times.getMinutes()}`.slice(-2)}`;
    }

    async getPosition(first) {
        const sunPosition = SunCalc.getPosition(new Date(), this.param.latitude, this.param.longitude);
        this.log.debug(JSON.stringify(sunPosition));
        const moonPosition = SunCalc.getMoonData(new Date(), this.param.latitude, this.param.longitude);
        this.log.debug(JSON.stringify(moonPosition));
        await this.setState(`suncalc.sunAltitude`, { val: this.roundToTwo(sunPosition.altitude), ack: true });
        await this.setState(`suncalc.sunAzimuth`, { val: this.roundToTwo(sunPosition.azimuth), ack: true });
        await this.setState(`suncalc.sunAltitudeDegrees`, {
            val: this.roundToTwo(sunPosition.altitudeDegrees),
            ack: true,
        });
        await this.setState(`suncalc.sunAzimuthDegrees`, {
            val: this.roundToTwo(sunPosition.azimuthDegrees),
            ack: true,
        });
        await this.setState(`suncalc.moonAltitude`, { val: this.roundToTwo(moonPosition.altitude), ack: true });
        await this.setState(`suncalc.moonAzimuth`, { val: this.roundToTwo(moonPosition.azimuth), ack: true });
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
        // Fix nadir all data negativ = 00:01
        if (next == null) {
            this.setSunCalc();
            return;
        }
        if (current == null) {
            const last_current = await this.getStateAsync(`suncalc.currentAstroTime`);
            this.lastCurrent =
                last_current != null && last_current.val != null ? last_current.val.toString() : "unknown";
        }
        this.log.debug(JSON.stringify(timeJSON));
        this.log.debug(JSON.stringify(diff));
        if (!constants.ASTRO[timeJSON[current]]) {
            this.log.info(`Current: ${JSON.stringify(this.timeArray)}`);
            this.log.info(`constants: ${this.lastCurrent}`);
        }
        await this.setState(`suncalc.currentAstroTime`, {
            val: constants.ASTRO[timeJSON[current]] ? constants.ASTRO[timeJSON[current]][this.lang] : this.lastCurrent,
            ack: true,
        });
        await this.setState(`suncalc.nextAstroTime`, {
            val: constants.ASTRO[timeJSON[next]] ? constants.ASTRO[timeJSON[next]][this.lang] : next,
            ack: true,
        });
        await this.setState(`suncalc.currentState`, {
            val: current != null ? timeJSON[current] : this.lastCurrent,
            ack: true,
        });
        await this.setState(`suncalc.nextState`, {
            val: timeJSON[next],
            ack: true,
        });
        if (
            this.param.current &&
            this.param.daily &&
            this.param.daily.includes("temperature_2m_max") &&
            this.param.daily.includes("temperature_2m_min") &&
            !first
        ) {
            await this.updateHTML();
        }
    }

    setIntervalPosition() {
        this.log.debug(`Start position with 1 minute!`);
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
        this.req = count;
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
        let count_variable = 0;
        if (val.current) {
            const split_current = val.current.split(",");
            count_variable = count_variable + split_current.length;
        }
        if (val.daily) {
            const split_daily = val.daily.split(",");
            count_variable = count_variable + split_daily.length;
        }
        if (val.hourly) {
            const split_hourly = val.hourly.split(",");
            count_variable = count_variable + split_hourly.length;
        }
        if (val.minutely_15) {
            const split_minutely_15 = val.minutely_15.split(",");
            count_variable = count_variable + split_minutely_15.length;
        }
        let req = Math.round(count_variable * 1.7);
        if (val.models) {
            const split_models = val.models.split(",");
            req = req * split_models.length;
        }
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

    async setWeatherData(first) {
        if (this.config.temperaturUnit !== "default") {
            this.param.temperature_unit = this.config.temperaturUnit;
            this.param_second.temperature_unit = this.config.temperaturUnit;
        }
        if (this.config.windSpeedUnit !== "default") {
            this.param.wind_speed_unit = this.config.windSpeedUnit;
            this.param_second.wind_speed_unit = this.config.windSpeedUnit;
        }
        if (this.config.precipitationUnit !== "default") {
            this.param.precipitation_unit = this.config.precipitationUnit;
            this.param_second.precipitation_unit = this.config.precipitationUnit;
        }
        if (this.config.timeformat !== "default") {
            this.param.timeformat = this.config.timeformat;
            this.param_second.timeformat = this.config.timeformat;
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
            this.param_second.forecast_days = this.config.forecast;
        }
        if (this.config.apiKey && this.config.apiKey != "") {
            this.param.apikey = this.config.apiKey;
            this.param_second.apikey = this.config.apiKey;
            customer = "customer-";
        }
        this.log.debug(`Param ${JSON.stringify(this.param)}`);
        await this.setState(`param`, { val: JSON.stringify(this.param), ack: true });
        await this.setSunCalc(first);
        this.calculateAPIrequest();
        await this.updateStates();
    }

    async updateStates() {
        const data = await this.getWeatherData(this.param);
        //const data = dummy.DUMMY_FOR_TESTING;
        if (data) {
            this.setStatusRequest(Math.round(this.req * 1.7));
            this.log.debug(JSON.stringify(data));
            await this.setState(`result`, { val: JSON.stringify(data), ack: true });
            await this.setWeatherStates(data);
            await this.setState("last_update", new Date().getTime(), true);
        } else {
            this.log.error(`Cannot read data!`);
        }
        if (this.config.model_second) {
            if (
                this.param_second.hourly != null ||
                this.param_second.daily != null ||
                this.param_second.current != null ||
                this.param_second.minutely_15 != null
            ) {
                const data = await this.getWeatherData(this.param_second);
                //const data = dummy.TESTINGUV;
                if (data) {
                    this.setStatusRequest(Math.round(this.req_second * 1.7));
                    this.log.debug(JSON.stringify(data));
                    await this.setState(`result_second`, { val: JSON.stringify(data), ack: true });
                    await this.setWeatherStates(data);
                } else {
                    this.log.error(`Cannot read second data!`);
                }
            }
        }
    }

    async setWeatherStates(val) {
        countVal = 0;
        const current = val.current;
        const times = new Date();
        let isDay = "night";
        if (times > new Date(this.timeArray["sunriseStart"]) && times < new Date(this.timeArray["civilDusk"])) {
            isDay = "day";
        }
        if (current) {
            this.checkResponse("current", val.current_units);
            for (const variable in current) {
                if (variable === "wind_speed_10m") {
                    await this.setValue(
                        `current.${variable}_animated`,
                        constants.Beaufort[this.msToBeaufort(current[variable])],
                    );
                }
                if (variable === "wind_direction_10m") {
                    const compass = await this.svg.windrose(current[variable], this.html);
                    if (!this.images[`grad${current[variable]}.svg`]) {
                        this.images[`grad${current[variable]}.svg`] = false;
                        await this.writeFileAsync(this.namespace, `grad${current[variable]}.svg`, compass);
                    }
                    await this.setValue(`current.${variable}_compass`, compass);
                    await this.setValue(`current.${variable}_name`, this.getDirectionName(current[variable]));
                }
                if (variable === "time") {
                    await this.setValue(`current.${variable}`, new Date(current.time).toString());
                } else if (variable === "interval") {
                    // skip
                } else if (variable === "weather_code") {
                    let code = current.weather_code;
                    if (
                        current.wind_speed_10m != null &&
                        current.wind_speed_10m > this.config.maxWind &&
                        weather_code[code]
                    ) {
                        code = weather_code[code];
                    }
                    if (!constants.WeatherCode[code]) {
                        code = 200;
                    }
                    const path = constants.WeatherCode[code][isDay].image;
                    const text = constants.WeatherCode[code][isDay].description[this.lang];
                    const svg = constants.WeatherCode[code][isDay].svg;
                    const animated = constants.WeatherCode[code][isDay].animated;
                    await this.setValue(`current.${variable}`, code);
                    await this.setValue(`current.${variable}_text`, text);
                    await this.setValue(`current.${variable}_path`, path);
                    await this.setValue(`current.${variable}_own`, svg);
                    await this.setValue(`current.${variable}_path_animated`, animated);
                } else if (current[variable] != null) {
                    await this.setValue(`current.${variable}`, current[variable]);
                }
            }
        }
        const daily = val.daily;
        let count = 0;
        if (daily) {
            this.checkResponse("daily", val.daily_units);
            for (let i = 1; i < this.config.forecast + 1; i++) {
                const path2 = `daily.day${`0${i}`.slice(-2)}`;
                for (const variable in daily) {
                    if (variable === "wind_speed_10m_max") {
                        await this.setValue(
                            `${path2}.${variable}_animated`,
                            constants.Beaufort[this.msToBeaufort(daily[variable][count])],
                        );
                    }
                    if (variable === "wind_direction_10m_dominant") {
                        const compass = await this.svg.windrose(daily[variable][count], this.html);
                        if (!this.images[`grad${current[variable]}.svg`]) {
                            this.images[`grad${daily[variable][count]}.svg`] = false;
                            await this.writeFileAsync(this.namespace, `grad${daily[variable][count]}.svg`, compass);
                        }
                        await this.setValue(`${path2}.${variable}_compass`, compass);
                        await this.setValue(`${path2}.${variable}_name`, this.getDirectionName(daily[variable][count]));
                    }
                    if (variable === "time") {
                        await this.setValue(`${path2}.${variable}`, new Date(daily.time[count]).toString());
                    } else if (variable === "weather_code") {
                        let code = daily.weather_code[count];
                        if (
                            daily.wind_speed_10m_max != null &&
                            daily.wind_speed_10m_max[count] != null &&
                            daily.wind_speed_10m_max[count] > this.config.maxWind &&
                            weather_code[code]
                        ) {
                            code = weather_code[code];
                        }
                        if (!constants.WeatherCode[code]) {
                            code = 200;
                        }
                        const path = constants.WeatherCode[code].day.image;
                        const text = constants.WeatherCode[code].day.description[this.lang];
                        const svg = constants.WeatherCode[code].day.svg;
                        const animated = constants.WeatherCode[code].day.animated;
                        await this.setValue(`${path2}.${variable}`, code);
                        await this.setValue(`${path2}.${variable}_text`, text);
                        await this.setValue(`${path2}.${variable}_path`, path);
                        await this.setValue(`${path2}.${variable}_own`, svg);
                        await this.setValue(`${path2}.${variable}_path_animated`, animated);
                    } else if (variable === "uv_index_clear_sky_max" && daily[variable][count] != null) {
                        let uv = Math.round(daily[variable][count]);
                        uv = uv < 12 ? uv : 11;
                        await this.setValue(`${path2}.${variable}_path`, constants.UV_INDEX[uv].image);
                        await this.setValue(`${path2}.${variable}_own`, constants.UV_INDEX[uv].svg);
                    } else if (variable === "uv_index_max" && daily[variable][count] != null) {
                        let uv = Math.round(daily[variable][count]);
                        uv = uv < 12 ? uv : 11;
                        await this.setValue(`${path2}.${variable}_path`, constants.UV_INDEX[uv].image);
                        await this.setValue(`${path2}.${variable}_own`, constants.UV_INDEX[uv].svg);
                    } else if (daily[variable][count] != null) {
                        await this.setValue(`${path2}.${variable}`, daily[variable][count]);
                    }
                }
                ++count;
            }
        }
        const hourly = val.hourly;
        if (hourly) {
            this.checkResponse("hourly", val.hourly_units);
            count = 0;
            for (let i = 1; i < this.config.forecast + 1; i++) {
                const path = `hourly.day${`0${i}`.slice(-2)}`;
                for (let a = 0; a < 24; a++) {
                    const path2 = `${path}.hour${`0${a}`.slice(-2)}`;
                    for (const variable in hourly) {
                        if (
                            variable === "wind_speed_10m" ||
                            variable === "wind_speed_80m" ||
                            variable === "wind_speed_120m" ||
                            variable === "wind_speed_180m"
                        ) {
                            await this.setValue(
                                `${path2}.${variable}_animated`,
                                constants.Beaufort[this.msToBeaufort(hourly[variable][count])],
                            );
                        }
                        if (
                            variable === "wind_direction_10m" ||
                            variable === "wind_direction_80m" ||
                            variable === "wind_direction_120m" ||
                            variable === "wind_direction_180m"
                        ) {
                            const compass = await this.svg.windrose(hourly[variable][count], this.html);
                            if (!this.images[`grad${current[variable]}.svg`]) {
                                this.images[`grad${hourly[variable][count]}.svg`] = false;
                                await this.writeFileAsync(
                                    this.namespace,
                                    `grad${hourly[variable][count]}.svg`,
                                    compass,
                                );
                            }
                            await this.setValue(`${path2}.${variable}_compass`, compass);
                            await this.setValue(
                                `${path2}.${variable}_name`,
                                this.getDirectionName(hourly[variable][count]),
                            );
                        }
                        if (variable === "time") {
                            await this.setValue(`${path2}.${variable}`, new Date(hourly.time[count]).toString());
                        } else if (variable === "weather_code") {
                            let code = hourly.weather_code[count];
                            if (
                                hourly.wind_speed_10m != null &&
                                hourly.wind_speed_10m[count] != null &&
                                hourly.wind_speed_10m[count] > this.config.maxWind &&
                                weather_code[code]
                            ) {
                                code = weather_code[code];
                            }
                            if (!constants.WeatherCode[code]) {
                                code = 200;
                            }
                            const dayNight = await this.isDayNight(new Date(hourly.time[count]));
                            const path = constants.WeatherCode[code][dayNight].image;
                            const text = constants.WeatherCode[code][dayNight].description[this.lang];
                            const svg = constants.WeatherCode[code][dayNight].svg;
                            const animated = constants.WeatherCode[code][dayNight].animated;
                            await this.setValue(`${path2}.${variable}`, code);
                            await this.setValue(`${path2}.${variable}_text`, text);
                            await this.setValue(`${path2}.${variable}_path`, path);
                            await this.setValue(`${path2}.${variable}_own`, svg);
                            await this.setValue(`${path2}.${variable}_path_animated`, animated);
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
            this.checkResponse("minutely_15", val.minutely_15_units);
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

    async checkResponse(resp, units) {
        if (!units) {
            return;
        }
        const check = this.param_second[resp] ? true : false;
        for (const unit in units) {
            if (units[unit] === "undefined") {
                if (check) {
                    this.log.warn(
                        `The variable ${unit} in "${resp}" has no value. Please disable it in the instance settings or select a different model.`,
                    );
                } else {
                    if (!this.config.model_second) {
                        this.log.warn(
                            `The second query is disabled. The variable ${unit} in ${resp} has no value and is deleted from the query.`,
                        );
                    }
                    this.param[resp] = this.param[resp].replace(`${unit},`, "").replace(`,${unit}`, "");
                    if (this.param[resp] === unit) {
                        delete this.param[resp];
                    }
                    --this.req;
                    ++this.req_second;
                    this.param_second[resp] = this.param_second[resp] ? `${this.param_second[resp]},${unit}` : unit;
                }
            }
        }
        if (this.config.model_second) {
            await this.setState(`param_second`, { val: JSON.stringify(this.param_second), ack: true });
        }
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

    async getWeatherData(param) {
        if (status.countRequest > status.countRequestMaxDay) {
            this.log.error(
                `The maximum number of queries of 10,000 has been reached! New queries will be possible again from 12:01 AM.`,
            );
            return false;
        }
        return await this.requestClient({
            method: "get",
            url: `https://${customer}api.open-meteo.com/v1/forecast`,
            params: param,
            ...this.getHeader,
        })
            .then(res => {
                if (!this.conn) {
                    this.setState("info.connection", true, true);
                }
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

    async readColor() {
        const colors = await this.getStatesAsync(`open-meteo.${this.instance}.iconcolor.*`);
        for (const color in colors) {
            const split = color.split(".");
            const state = split.pop();
            this.own_color[state] = colors[color].val;
        }
        if (this.own_color.sun_filled && this.own_color.sun_filled == "#000") {
            this.own_color.sun_filled == "none";
        }
        if (this.own_color.cloud_filled && this.own_color.cloud_filled == "#000") {
            this.own_color.cloud_filled == "none";
        }
        if (this.own_color.flash_filled && this.own_color.flash_filled == "#000") {
            this.own_color.flash_filled == "none";
        }
        if (this.own_color.lines_filled && this.own_color.lines_filled == "#000") {
            this.own_color.lines_filled == "none";
        }
        if (this.own_color.moon_filled && this.own_color.moon_filled == "#000") {
            this.own_color.moon_filled == "none";
        }
        if (this.own_color.unknown_filled && this.own_color.unknown_filled == "#000") {
            this.own_color.unknown_filled == "none";
        }
    }

    async setColor() {
        const old_code = JSON.parse(JSON.stringify(constants.WeatherCode));
        const width = 128;
        const height = 100;
        const WW_XML =
            '<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n';
        const WW_SVG1 = `<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="${width}" height="${height}" viewBox="-64 -50 128 100"><g stroke-width="3">`;
        const WW_SVG2 = "</g></svg>\n";
        let val = "";
        const icon_list = [
            [0, true, false, false, "clear-day", 0, "day"],
            [0, true, false, true, "clear-day-wind", 100, "day"],
            [0, false, true, false, "clear-night", 0, "night"],
            [0, false, true, true, "clear-night-wind", 100, "night"],
            [1, true, false, false, "mostly-clear-day", 1, "day"],
            [1, true, false, true, "mostly-clear-day-wind", 101, "day"],
            [1, false, true, false, "mostly-clear-night", 1, "night"],
            [1, false, true, true, "mostly-clear-night-wind", 101, "night"],
            [2, true, false, false, "partly-cloudy-day", 2, "day"],
            [2, true, false, true, "partly-cloudy-day-wind", 102, "day"],
            [2, false, true, false, "partly-cloudy-night", 2, "night"],
            [2, false, true, true, "partly-cloudy-night-wind", 102, "night"],
            [4, true, false, false, "cloudy", 3, "day"],
            [4, true, false, true, "cloudy-wind", 103, "day"],
            [4, false, true, false, "cloudy-night", 3, "night"],
            [4, false, true, true, "cloudy-night-wind", 103, "night"],
        ];
        for (const list of icon_list) {
            // @ts-expect-error // Nothing
            constants.WeatherCode[list[5]][list[6]].svg =
                WW_XML +
                WW_SVG1 +
                this.svg.bewoelkt(
                    list[0],
                    list[1],
                    list[2],
                    list[3],
                    this.own_color.sun,
                    this.own_color.sun_filled,
                    this.own_color.wind,
                    this.own_color.moon,
                    this.own_color.moon_filled,
                    this.own_color.cloud,
                    this.own_color.cloud_filled,
                ) +
                WW_SVG2;
        }
        val = WW_XML + WW_SVG1 + this.svg.nebel(this.hexToRGBA(this.own_color.fog, 90)) + WW_SVG2;
        constants.WeatherCode[45].day.svg = val;
        constants.WeatherCode[45].night.svg = val;
        constants.WeatherCode[48].day.svg = val;
        constants.WeatherCode[48].night.svg = val;
        val =
            WW_XML +
            WW_SVG1 +
            this.svg.niesel_gesamt(this.own_color.rain, this.own_color.cloud, this.own_color.cloud_filled) +
            WW_SVG2;
        constants.WeatherCode[51].day.svg = val;
        constants.WeatherCode[51].night.svg = val;
        constants.WeatherCode[53].day.svg = val;
        constants.WeatherCode[53].night.svg = val;
        constants.WeatherCode[55].day.svg = val;
        constants.WeatherCode[55].night.svg = val;
        val =
            WW_XML +
            WW_SVG1 +
            this.svg.gefrierender_nieselregen(
                this.own_color.cloud,
                this.own_color.cloud_filled,
                false,
                this.own_color.rain,
                this.own_color.lines,
                this.own_color.lines_filled,
                this.own_color.snow,
            ) +
            WW_SVG2;
        constants.WeatherCode[56].day.svg = val;
        constants.WeatherCode[56].night.svg = val;
        constants.WeatherCode[57].day.svg = val;
        constants.WeatherCode[57].night.svg = val;
        val =
            WW_XML +
            WW_SVG1 +
            this.svg.regen_gesamt(
                this.own_color.cloud,
                this.own_color.cloud_filled,
                this.own_color.rain,
                false,
                this.own_color.wind,
            ) +
            WW_SVG2;
        constants.WeatherCode[61].day.svg = val;
        constants.WeatherCode[61].night.svg = val;
        constants.WeatherCode[63].day.svg = val;
        constants.WeatherCode[63].night.svg = val;
        constants.WeatherCode[65].day.svg = val;
        constants.WeatherCode[65].night.svg = val;
        constants.WeatherCode[80].day.svg = val;
        constants.WeatherCode[80].night.svg = val;
        constants.WeatherCode[81].day.svg = val;
        constants.WeatherCode[81].night.svg = val;
        constants.WeatherCode[82].day.svg = val;
        constants.WeatherCode[82].night.svg = val;
        val =
            WW_XML +
            WW_SVG1 +
            this.svg.gefrierender_regen4(
                this.own_color.cloud,
                this.own_color.cloud_filled,
                this.own_color.lines,
                this.own_color.lines_filled,
                this.own_color.warning_triangle,
                this.own_color.warning_triangle_rand,
                false,
                this.own_color.wind,
            ) +
            WW_SVG2;
        constants.WeatherCode[66].day.svg = val;
        constants.WeatherCode[66].night.svg = val;
        constants.WeatherCode[67].day.svg = val;
        constants.WeatherCode[67].night.svg = val;
        val =
            WW_XML +
            WW_SVG1 +
            this.svg.gefrierender_regen4(
                this.own_color.cloud,
                this.own_color.cloud_filled,
                this.own_color.lines,
                this.own_color.lines_filled,
                this.own_color.warning_triangle,
                this.own_color.warning_triangle_rand,
                true,
                this.own_color.wind,
            ) +
            WW_SVG2;
        constants.WeatherCode[166].day.svg = val;
        constants.WeatherCode[166].night.svg = val;
        constants.WeatherCode[167].day.svg = val;
        constants.WeatherCode[167].night.svg = val;
        val =
            WW_XML +
            WW_SVG1 +
            this.svg.schneefall(this.own_color.cloud_filled, true, this.own_color.cloud, this.own_color.snow) +
            WW_SVG2;
        constants.WeatherCode[71].day.svg = val;
        constants.WeatherCode[71].night.svg = val;
        constants.WeatherCode[73].day.svg = val;
        constants.WeatherCode[73].night.svg = val;
        constants.WeatherCode[75].day.svg = val;
        constants.WeatherCode[75].night.svg = val;
        constants.WeatherCode[77].day.svg = val;
        constants.WeatherCode[77].night.svg = val;
        constants.WeatherCode[85].day.svg = val;
        constants.WeatherCode[85].night.svg = val;
        constants.WeatherCode[86].day.svg = val;
        constants.WeatherCode[86].night.svg = val;
        val =
            WW_XML +
            WW_SVG1 +
            this.svg.gewitter(
                this.own_color.cloud,
                this.own_color.cloud_filled,
                0,
                this.own_color.flash,
                this.own_color.flash_filled,
            ) +
            WW_SVG2;
        constants.WeatherCode[95].day.svg = val;
        constants.WeatherCode[95].night.svg = val;
        val =
            WW_XML +
            WW_SVG1 +
            this.svg.hagelgewitter(
                this.own_color.cloud,
                this.own_color.cloud_filled,
                this.own_color.rain,
                this.own_color.flash,
                this.own_color.flash_filled,
            ) +
            WW_SVG2;
        constants.WeatherCode[96].day.svg = val;
        constants.WeatherCode[96].night.svg = val;
        constants.WeatherCode[99].day.svg = val;
        constants.WeatherCode[99].night.svg = val;
        val =
            WW_XML +
            WW_SVG1 +
            this.svg.regen_gesamt(
                this.own_color.cloud,
                this.own_color.cloud_filled,
                this.own_color.rain,
                true,
                this.own_color.wind,
            ) +
            WW_SVG2;
        constants.WeatherCode[161].day.svg = val;
        constants.WeatherCode[161].night.svg = val;
        constants.WeatherCode[163].day.svg = val;
        constants.WeatherCode[163].night.svg = val;
        constants.WeatherCode[165].day.svg = val;
        constants.WeatherCode[165].night.svg = val;
        if (this.own_color.unknown && this.own_color.unknown_filled) {
            val = WW_XML + WW_SVG1 + this.svg.unknown(this.own_color.unknown, this.own_color.unknown_filled) + WW_SVG2;
            constants.WeatherCode[200].day.svg = val;
            constants.WeatherCode[200].night.svg = val;
        }
        for (const id in constants.WeatherCode) {
            if (old_code[id].day.svg != constants.WeatherCode[id].day.svg) {
                await this.writeFileAsync(this.namespace, `${id}day.svg`, constants.WeatherCode[id].day.svg);
            }
            if (old_code[id].night.svg != constants.WeatherCode[id].night.svg) {
                await this.writeFileAsync(this.namespace, `${id}night.svg`, constants.WeatherCode[id].night.svg);
            }
        }
        for (let i = 0; i < 12; i++) {
            constants.UV_INDEX[i].svg = this.svg.uv_index(
                i,
                this.own_color[`uv_index_${i}`],
                this.own_color.uv_index_bg,
                this.own_color.uv_index_desc,
            );
            await this.writeFileAsync(this.namespace, `${i}.svg`, constants.UV_INDEX[i].svg);
        }
        this.log.debug(`CODE: ${JSON.stringify(constants.WeatherCode)}`);
        this.log.debug(`UV: ${JSON.stringify(constants.UV_INDEX)}`);
    }

    hexToRGBA(hex, alpha) {
        const r = parseInt(hex.slice(1, 3), 16);
        const g = parseInt(hex.slice(3, 5), 16);
        const b = parseInt(hex.slice(5, 7), 16);
        return `rgba(${r}, ${g}, ${b}, ${alpha})`;
    }

    fromJulian(j) {
        j = +j + 30.0 / (24 * 60 * 60);
        const A = this.julianArray(j, true);
        // @ts-expect-error // Error OK
        return new Date(Date.UTC.apply(Date, A));
    }

    julianArray(j, n) {
        const F = Math.floor;
        let j2;
        let JA;
        let a;
        let b;
        let c;
        let d;
        let e;
        let f;
        let g;
        let h;
        let z;
        j += 0.5;
        j2 = (j - F(j)) * 86400.0;
        z = F(j);
        f = j - z;
        if (z < 2299161) {
            a = z;
        } else {
            g = F((z - 1867216.25) / 36524.25);
            a = z + 1 + g - F(g / 4);
        }
        b = a + 1524;
        c = F((b - 122.1) / 365.25);
        d = F(365.25 * c);
        e = F((b - d) / 30.6001);
        h = F(e < 14 ? e - 1 : e - 13);
        JA = [F(h > 2 ? c - 4716 : c - 4715), h - 1, F(b - d - F(30.6001 * e) + f)];
        const JB = [F(j2 / 3600), F((j2 / 60) % 60), Math.round(j2 % 60)];
        JA = JA.concat(JB);
        if (typeof n == "number") {
            return JA.slice(0, n);
        }
        return JA;
    }

    getSeasons(y, wch) {
        y = y || new Date().getFullYear();
        if (y < 1000 || y > 3000) {
            this.log.warn(`${y} is out of range`);
            return;
        }
        let Y1 = (y - 2000) / 1000;
        let Y2 = Y1 * Y1;
        let Y3 = Y2 * Y1;
        let Y4 = Y3 * Y1;
        let jd;
        let t;
        let w;
        let d;
        let est = 0;
        let i = 0;
        let A = [y];
        let e1 = [485, 203, 199, 182, 156, 136, 77, 74, 70, 58, 52, 50, 45, 44, 29, 18, 17, 16, 14, 12, 12, 12, 9, 8];
        let e2 = [
            324.96, 337.23, 342.08, 27.85, 73.14, 171.52, 222.54, 296.72, 243.58, 119.81, 297.17, 21.02, 247.54, 325.15,
            60.93, 155.12, 288.79, 198.04, 199.76, 95.39, 287.11, 320.81, 227.73, 15.45,
        ];
        let e3 = [
            1934.136, 32964.467, 20.186, 445267.112, 45036.886, 22518.443, 65928.934, 3034.906, 9037.513, 33718.147,
            150.678, 2281.226, 29929.562, 31555.956, 4443.417, 67555.328, 4562.452, 62894.029, 31436.921, 14577.848,
            31931.756, 34777.259, 1222.114, 16859.074,
        ];
        while (i < 4) {
            switch (i) {
                case 0:
                    jd = 2451623.80984 + 365242.37404 * Y1 + 0.05169 * Y2 - 0.00411 * Y3 - 0.00057 * Y4;
                    break;
                case 1:
                    jd = 2451716.56767 + 365241.62603 * Y1 + 0.00325 * Y2 + 0.00888 * Y3 - 0.0003 * Y4;
                    break;
                case 2:
                    jd = 2451810.21715 + 365242.01767 * Y1 - 0.11575 * Y2 + 0.00337 * Y3 + 0.00078 * Y4;
                    break;
                case 3:
                    jd = 2451900.05952 + 365242.74049 * Y1 - 0.06223 * Y2 - 0.00823 * Y3 + 0.00032 * Y4;
                    break;
                default:
                    jd = 2451623.80984 + 365242.37404 * Y1 + 0.05169 * Y2 - 0.00411 * Y3 - 0.00057 * Y4;
            }
            t = (jd - 2451545.0) / 36525;
            w = 35999.373 * t - 2.47;
            d = 1 + 0.0334 * this.degCos(w) + 0.0007 * this.degCos(2 * w);
            est = 0;
            for (let n = 0; n < 24; n++) {
                est += e1[n] * this.degCos(e2[n] + e3[n] * t);
            }
            jd += (0.00001 * est) / d;
            A[++i] = this.fromJulian(jd);
        }
        return wch && A[wch] ? A[wch] : A;
    }

    degRad(d) {
        return (d * Math.PI) / 180.0;
    }

    degSin(d) {
        return Math.sin(this.degRad(d));
    }

    degCos(d) {
        return Math.cos(this.degRad(d));
    }

    seasonalBackground() {
        const mine = this.getSeasons();
        const today = new Date(); //Date.parse('Mar 21, 2014'); //use Date.parse() to check dates other than today
        const firstSpring = mine[1];
        const firstSummer = mine[2];
        const firstFall = mine[3];
        const firstWinter = mine[4];
        let season = "";
        if (today >= firstSpring && today < firstSummer) {
            season = constants.Seasons["spring"][this.lang];
        } else if (today >= firstSummer && today < firstFall) {
            season = constants.Seasons["summer"][this.lang];
        } else if (today >= firstFall && today < firstWinter) {
            season = constants.Seasons["fall"][this.lang];
        } else if (today >= firstWinter || today < firstSpring) {
            season = constants.Seasons["winter"][this.lang];
        }
        return season;
    }

    async readHTML() {
        const html_states = await this.getStatesAsync(`open-meteo.${this.instance}.html.*`);
        for (const html_state in html_states) {
            const split = html_state.split(".");
            const state = split.pop();
            if (state != "html") {
                this.html[state] = html_states[html_state].val;
            }
        }
    }

    async updateHTML() {
        const unit = this.config.temperaturUnit === "default" ? "°C" : "F";
        const bg =
            this.html.bg_color != "#000"
                ? `	 background-color:${this.hexToRGBA(this.html.bg_color, this.html.bg_color_alpha)};`
                : "";
        const font =
            this.html.font_color != "#000"
                ? `;color:${this.hexToRGBA(this.html.font_color, this.html.font_color_alpha)}`
                : "";
        const id = this.value[`current.weather_code`];
        const actual_times = this.value[`current.time`];
        const direction = this.value[`current.wind_direction_10m`];
        const name = constants.DAYNAME[new Date(actual_times).getDay()][this.lang];
        const actual_date = this.formatDate(new Date(actual_times), "DD.MM.YYYY");
        const actual_text = this.value[`current.weather_code_text`];
        const actual_clock = `${`0${new Date().getHours()}`.slice(-2)}:` + `${`0${new Date().getMinutes()}`.slice(-2)}`;
        let actual_temp;
        if (this.config.objectId && this.config.objectId != "") {
            actual_temp = await this.getForeignStateAsync(this.config.objectId);
        }
        let actual_temperature = 0;
        if (actual_temp && actual_temp.val != null && actual_temp.val != "") {
            actual_temperature = parseFloat(actual_temp.val.toString());
        }
        const actual =
            `<img width="${this.html.today_image_thermalstress_width}px" height="${this.html.today_image_thermalstress_height}px" ` +
            `style="vertical-align:middle" alt="${actual_temperature}" title="${actual_temperature}" ` +
            `src='/adapter/open-meteo/img/thermalstress/${this.getThermalStress(actual_temperature)}'/>`;
        const trigger_val = this.html.trigger ? false : true;
        let html =
            `<html>` +
            `<head>` +
            `<meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0">` +
            `<style>` +
            `   body {overflow:hidden;${bg}}` +
            `   svg {height:10vw;width:10vw;}` +
            `   span {text-align:${this.html.today_text_algin}${font};` +
            `   border-radius:${this.html.today_border_radius}px;border-collapse:separate;border:${this.html.today_border}px solid gainsboro;` +
            `   border-color:${this.hexToRGBA(this.html.today_border_color, this.html.today_border_color_alpha)};}` +
            `   td {border-width:0px;border-style:solid;border-color:silver;white-space:nowrap;}` +
            `   input {height:10vw;width:10vw;}` +
            `   .container_column {display:flex;flex-direction: column;justify-content: flex-start;` +
            `   border-radius:${this.html.forecast_border_radius}px;border-collapse:separate;border:${this.html.forecast_border}px solid gainsboro;` +
            `   border-color:${this.hexToRGBA(this.html.forecast_border_color, this.html.forecast_border_color_alpha)};}` +
            `   .container_row {display: flex;flex-direction: row;justify-content: space-between;` +
            `   border-radius:${this.html.today_text_border_radius}px;border-collapse:separate;border:${this.html.today_text_border}px solid gainsboro;` +
            `   border-color:${this.hexToRGBA(this.html.today_text_border_color, this.html.today_text_border_color_alpha)};}` +
            `   .img_weather {height:${this.html.today_image_height}vw;width:${this.html.today_image_width}vw;}` +
            `   .box_time {font-size:${this.html.today_clock_font_size}vmax;}` +
            `   .box_date {font-size:${this.html.today_date_font_size}vmax;text-align:center;}` +
            `   .box_weather {font-size:${this.html.today_weather_font_size}vmax;margin-right:1.5vw;text-align:left;}` +
            `   .table_forecast {margin-top:4vw;width: 100%;border-collapse: collapse;font-size:${this.html.forecast_font_size}vmax${font};}` +
            `</style>` +
            `<script type="text/javascript">` +
            `    function setState(stateId, value){` +
            `        sendPostMessage("setState", stateId, value);` +
            `    }` +
            `    function sendPostMessage(command, stateId, value){` +
            `        message = {command: command, stateId: stateId, value: value};` +
            `        window.parent.postMessage(message, "*");` +
            `    }` +
            `</script>` +
            `</head>` +
            `<body>` +
            `<div class="container_row"><span class="box_time"><b>${actual_clock}</b></span>` +
            `    <input type="image" class="img_weather" onclick="setState('${this.namespace}.html.trigger', ${trigger_val})" src='/open-meteo.0/grad${direction}.svg' />` +
            `    <input type="image" class="img_weather" onclick="setState('${this.namespace}.html.trigger', ${trigger_val})" src='${await this.setIcon("current", id, actual_times)}' />` +
            `</div>` +
            `<div class="container_row">` +
            `    <div class="container_column">` +
            `        <span class="box_date"><b><i>${name}, ${actual_date}</i></b></span>` +
            `    </div>` +
            `    <div class="container_column">` +
            `        <span class="box_weather">${actual} <b><i>${actual_temperature}${unit}</i></b></span>` +
            `        <span class="box_weather"><i>${actual_text}</i></span>` +
            `    </div>` +
            `</div>` +
            `<div class="container_column">` +
            `    <table class="table_forecast">`;
        for (let i = 2; i < this.config.forecast + 1; i++) {
            const daily_id = this.value[`daily.day0${i}.weather_code`];
            const times = this.value[`daily.day0${i}.time`];
            const temp_min = this.value[`daily.day0${i}.temperature_2m_min`];
            const temp_max = this.value[`daily.day0${i}.temperature_2m_max`];
            const text = this.value[`daily.day0${i}.weather_code_text`];
            const humidity = this.value[`daily.day0${i}.relative_humidity_2m_mean`];
            const direction = this.value[`daily.day0${i}.wind_direction_10m_dominant`];
            const direc =
                `<img width="${this.html.compass_forecast_image_width}px" height="${this.html.compass_forecast_image_height}px" ` +
                `style="vertical-align:middle" alt="${direction}°" title="${direction}°" ` +
                `src='/open-meteo.0/grad${direction}.svg'/>`;
            const humi_path =
                this.html.icon_select == "animed_icon"
                    ? "/adapter/open-meteo/img/weatheranimated/humidity.svg"
                    : "/adapter/open-meteo/img/weathericons/humidity-water-drop.svg";
            const humi =
                `<img width="${this.html.forecast_image_humidity_width}px" height="${this.html.forecast_image_humidity_height}px" ` +
                `style="vertical-align:middle" alt="${humidity}" title="${humidity}" ` +
                `src='${humi_path}'/>`;
            const min =
                `<img width="${this.html.forecast_image_thermalstress_width}px" height="${this.html.forecast_image_thermalstress_height}px" ` +
                `style="vertical-align:middle" alt="${temp_min}" title="${temp_min}" ` +
                `src='/adapter/open-meteo/img/thermalstress/${this.getThermalStress(temp_min)}'/>`;
            const max =
                `<img width="${this.html.forecast_image_thermalstress_width}px" height="${this.html.forecast_image_thermalstress_height}px" ` +
                `style="vertical-align:middle" alt="${temp_max}" title="${temp_max}" ` +
                `src='/adapter/open-meteo/img/thermalstress/${this.getThermalStress(temp_max)}'/>`;
            const daily =
                `<img style="vertical-align:middle" width="${this.html.forecast_image_width}px" ` +
                `height="${this.html.forecast_image_height}px" alt="${text}" title="${text}" ` +
                `src='${await this.setIcon(`daily.day0${i}`, daily_id, false)}'/>`;
            html += `<tr>
                        <td>${constants.DAYNAME[new Date(times).getDay()][this.lang]}</td>
                        <td>${daily}</td>
                        <td>${min} ${temp_min}${unit} ${constants.DAYNAME.unit[this.lang]} ${max} ${temp_max}${unit}</td>
                        <td>${direc}</td>
                        <td>${humi} ${humidity}%</td>
                        <td align="left">${text}</td>
                    </tr>`;
        }
        html += `    </table>` + `</div></body></html>`;
        this.log.debug(html);
        await this.setState(`html.html_code`, { val: html, ack: true });
        this.updateHTMLHourly(actual_temperature);
    }

    async updateHTMLHourly(actual_temperature) {
        const unit = this.config.temperaturUnit === "default" ? "°C" : "F";
        let h = new Date().getHours();
        const bg =
            this.html.bg_color != "#000"
                ? `	 background-color:${this.hexToRGBA(this.html.bg_color, this.html.bg_color_alpha)};`
                : "";
        const font =
            this.html.font_color != "#000"
                ? `;color:${this.hexToRGBA(this.html.font_color, this.html.font_color_alpha)}`
                : "";
        const id = this.value[`hourly.day01.hour${`0${h}`.slice(-2)}.weather_code`];
        const actual_times = this.value[`hourly.day01.hour${`0${h}`.slice(-2)}.time`];
        const direction = this.value[`hourly.day01.hour${`0${h}`.slice(-2)}.wind_direction_10m`];
        const name = constants.DAYNAME[new Date(actual_times).getDay()][this.lang];
        const actual_date = this.formatDate(new Date(actual_times), "DD.MM.YYYY");
        const actual_text = this.value[`hourly.day01.hour${`0${h}`.slice(-2)}.weather_code_text`];
        const actual_clock = `${`0${new Date().getHours()}`.slice(-2)}:` + `${`0${new Date().getMinutes()}`.slice(-2)}`;
        const actual =
            `<img width="${this.html.today_image_thermalstress_width}px" height="${this.html.today_image_thermalstress_height}px" ` +
            `style="vertical-align:middle" alt="${actual_temperature}" title="${actual_temperature}" ` +
            `src='/adapter/open-meteo/img/thermalstress/${this.getThermalStress(actual_temperature)}'/>`;
        const trigger_val = this.html.trigger_hourly ? false : true;
        let html =
            `<html>` +
            `<head>` +
            `<meta name="viewport" content="width=device-width, initial-scale=1.0, minimum-scale=1.0">` +
            `<style>` +
            `   body {${bg}}` +
            `   span {text-align:${this.html.today_text_algin}${font};` +
            `   border-radius:${this.html.today_border_radius}px;border-collapse:separate;border:${this.html.today_border}px solid gainsboro;` +
            `   border-color:${this.hexToRGBA(this.html.today_border_color, this.html.today_border_color_alpha)};}` +
            `   td {border-width:0px;border-style:solid;border-color:silver;white-space:nowrap;}` +
            `   input {height:10vw;width:10vw;}` +
            `   .container_column {display:flex;flex-direction: column;justify-content: flex-start;` +
            `   border-radius:${this.html.forecast_border_radius}px;border-collapse:separate;border:${this.html.forecast_border}px solid gainsboro;` +
            `   border-color:${this.hexToRGBA(this.html.forecast_border_color, this.html.forecast_border_color_alpha)};}` +
            `   .container_row {display: flex;flex-direction: row;justify-content: space-between;` +
            `   border-radius:${this.html.today_text_border_radius}px;border-collapse:separate;border:${this.html.today_text_border}px solid gainsboro;` +
            `   border-color:${this.hexToRGBA(this.html.today_text_border_color, this.html.today_text_border_color_alpha)};}` +
            `   .img_weather {height:${this.html.today_image_height}vw;width:${this.html.today_image_width}vw;}` +
            `   .box_time {font-size:${this.html.today_clock_font_size}vmax;}` +
            `   .box_date {font-size:${this.html.today_date_font_size}vmax;text-align:center;}` +
            `   .box_weather {font-size:${this.html.today_weather_font_size}vmax;margin-right:1.5vw;text-align:left;}` +
            `   .table_forecast {margin-top:4vw;width: 100%;border-collapse: collapse;font-size:${this.html.forecast_font_size}vmax${font};}` +
            `</style>` +
            `<script type="text/javascript">` +
            `    function setState(stateId, value){` +
            `        sendPostMessage("setState", stateId, value);` +
            `    }` +
            `    function sendPostMessage(command, stateId, value){` +
            `        message = {command: command, stateId: stateId, value: value};` +
            `        window.parent.postMessage(message, "*");` +
            `    }` +
            `</script>` +
            `</head>` +
            `<body>` +
            `<div class="container_row"><span class="box_time"><b>${actual_clock}</b></span>` +
            `    <input type="image" class="img_weather" onclick="setState('${this.namespace}.html.trigger_hourly', ${trigger_val})" src='/open-meteo.0/grad${direction}.svg' />` +
            `    <input type="image" class="img_weather" onclick="setState('${this.namespace}.html.trigger_hourly', ${trigger_val})" src='${await this.setIcon("current", id, actual_times)}' />` +
            `</div>` +
            `<div class="container_row">` +
            `    <div class="container_column">` +
            `        <span class="box_date"><b><i>${name}, ${actual_date}</i></b></span>` +
            `    </div>` +
            `    <div class="container_column">` +
            `        <span class="box_weather">${actual} <b><i>${actual_temperature}${unit}</i></b></span>` +
            `        <span class="box_weather"><i>${actual_text}</i></span>` +
            `    </div>` +
            `</div>` +
            `<div class="container_column">` +
            `    <table class="table_forecast">`;
        if (h === 23) {
            h = 0;
        } else {
            ++h;
        }
        if (this.config.forecast > 1) {
            for (let i = h; i < 24; i++) {
                const daily_id = this.value[`hourly.day01.hour${`0${i}`.slice(-2)}.weather_code`];
                const times = this.value[`hourly.day01.hour${`0${i}`.slice(-2)}.time`];
                const temp = this.value[`hourly.day01.hour${`0${i}`.slice(-2)}.temperature_2m`];
                const text = this.value[`hourly.day01.hour${`0${i}`.slice(-2)}.weather_code_text`];
                const humidity = this.value[`hourly.day01.hour${`0${i}`.slice(-2)}.relative_humidity_2m`];
                const direction = this.value[`hourly.day01.hour${`0${i}`.slice(-2)}.wind_direction_10m`];
                const direc =
                    `<img width="${this.html.compass_forecast_image_width}px" height="${this.html.compass_forecast_image_height}px" ` +
                    `style="vertical-align:middle" alt="${direction}°" title="${direction}°" ` +
                    `src='/open-meteo.0/grad${direction}.svg'/>`;
                const humi_path =
                    this.html.icon_select == "animed_icon"
                        ? "/adapter/open-meteo/img/weatheranimated/humidity.svg"
                        : "/adapter/open-meteo/img/weathericons/humidity-water-drop.svg";
                const humi =
                    `<img width="${this.html.forecast_image_humidity_width}px" height="${this.html.forecast_image_humidity_height}px" ` +
                    `style="vertical-align:middle" alt="${humidity}" title="${humidity}" ` +
                    `src='${humi_path}'/>`;
                const min =
                    `<img width="${this.html.forecast_image_thermalstress_width}px" height="${this.html.forecast_image_thermalstress_height}px" ` +
                    `style="vertical-align:middle" alt="${temp}" title="${temp}" ` +
                    `src='/adapter/open-meteo/img/thermalstress/${this.getThermalStress(temp)}'/>`;
                const daily =
                    `<img style="vertical-align:middle" width="${this.html.forecast_image_width}px" ` +
                    `height="${this.html.forecast_image_height}px" alt="${text}" title="${text}" ` +
                    `src='${await this.setIcon(`hourly.day01.hour${`0${i}`.slice(-2)}`, daily_id, times)}'/>`;
                html += `<tr>
                                <td>${constants.DAYNAME[new Date(times).getDay()][this.lang]} ${this.timeCounting(new Date(times))}</td>
                                <td>${daily}</td>
                                <td>${min} ${temp}${unit}</td>
                                <td>${direc}</td>
                                <td>${humi} ${humidity}%</td>
                                <td align="left">${text}</td>
                            </tr>`;
            }
            if (h > 0) {
                for (let i = 0; i < h; i++) {
                    const daily_id = this.value[`hourly.day02.hour${`0${i}`.slice(-2)}.weather_code`];
                    const times = this.value[`hourly.day02.hour${`0${i}`.slice(-2)}.time`];
                    const temp = this.value[`hourly.day02.hour${`0${i}`.slice(-2)}.temperature_2m`];
                    const text = this.value[`hourly.day02.hour${`0${i}`.slice(-2)}.weather_code_text`];
                    const humidity = this.value[`hourly.day02.hour${`0${i}`.slice(-2)}.relative_humidity_2m`];
                    const direction = this.value[`hourly.day02.hour${`0${i}`.slice(-2)}.wind_direction_10m`];
                    const humi_path =
                        this.html.icon_select == "animed_icon"
                            ? "/adapter/open-meteo/img/weatheranimated/humidity.svg"
                            : "/adapter/open-meteo/img/weathericons/humidity-water-drop.svg";
                    const direc =
                        `<img width="${this.html.compass_forecast_image_width}px" height="${this.html.compass_forecast_image_height}px" ` +
                        `style="vertical-align:middle" alt="${direction}°" title="${direction}°" ` +
                        `src='/open-meteo.0/grad${direction}.svg'/>`;
                    const humi =
                        `<img width="${this.html.forecast_image_humidity_width}px" height="${this.html.forecast_image_humidity_height}px" ` +
                        `style="vertical-align:middle" alt="${humidity}" title="${humidity}" ` +
                        `src='${humi_path}'/>`;
                    const min =
                        `<img width="${this.html.forecast_image_thermalstress_width}px" height="${this.html.forecast_image_thermalstress_height}px" ` +
                        `style="vertical-align:middle" alt="${temp}" title="${temp}" ` +
                        `src='/adapter/open-meteo/img/thermalstress/${this.getThermalStress(temp)}'/>`;
                    const daily =
                        `<img style="vertical-align:middle" width="${this.html.forecast_image_width}px" ` +
                        `height="${this.html.forecast_image_height}px" alt="${text}" title="${text}" ` +
                        `src='${await this.setIcon(`hourly.day02.hour${`0${i}`.slice(-2)}`, daily_id, times)}'/>`;
                    html += `<tr>
                                    <td>${constants.DAYNAME[new Date(times).getDay()][this.lang]} ${this.timeCounting(new Date(times))}</td>
                                    <td>${daily}</td>
                                    <td nowrap>${min} ${temp}${unit}</td>
                                    <td>${direc}</td>
                                    <td nowrap>${humi} ${humidity}%</td>
                                    <td align=left>${text}</td>
                                </tr>`;
                }
            }
            this.log.debug(html);
            html += `    </table>` + `</div></body></html>`;
            await this.setState(`html.html_code_hourly`, { val: html, ack: true });
        }
    }

    async isDayNight(times) {
        const astro_time = SunCalc.getSunTimes(new Date(times), this.param.latitude, this.param.longitude);
        if (times > new Date(astro_time.sunriseStart.value) && times < new Date(astro_time.civilDusk.value)) {
            return "day";
        }
        return "night";
    }

    async setIcon(path, id, day) {
        const times = day ? new Date(day) : new Date();
        let isDay = await this.isDayNight(times);
        if (this.html.icon_select == "own") {
            return `/${this.namespace}/${id}${isDay}.svg`;
        } else if (this.html.icon_select == "path") {
            const icon = this.value[`${path}.weather_code_path`];
            if (!icon) {
                return "";
            }
            return icon;
        } else if (this.html.icon_select == "animed_icon") {
            const icon = this.value[`${path}.weather_code_path_animated`];
            if (!icon) {
                return "";
            }
            return icon;
        }
        return this.html.icon_own_path.replace("<code>", id.val).replace("<day>", isDay);
    }

    getThermalStress(val) {
        if ((val > 8 && val < 27) || (val > 0 && val < 9)) {
            return "thermalstress-none.svg";
        } else if (val > 26 && val < 33) {
            return "thermalstress-heat-minor.svg";
        } else if (val > 32 && val < 39) {
            return "thermalstress-heat-moderate.svg";
        } else if (val > 38 && val < 47) {
            return "thermalstress-heat-severe.svg";
        } else if (val > 46) {
            return "thermalstress-heat-extreme.svg";
        } else if (val < 1 && val > -14) {
            return "thermalstress-cold-minor.svg";
        } else if (val < 13 && val > -28) {
            return "thermalstress-cold-moderate.svg";
        } else if (val < 27 && val > -46) {
            return "thermalstress-cold-severe.svg";
        }
        return "thermalstress-cold-extreme.svg";
    }

    async readAllFiles() {
        const images = await this.readDirAsync(this.namespace, "");
        for (const image of images) {
            this.images[image.file] = image.isDir;
        }
    }

    getDirectionName(degrees) {
        const directionDE = [
            "↑N",
            "NNO",
            "↗NO",
            "ONO",
            "→O",
            "OSO",
            "↘SO",
            "SSO",
            "↓S",
            "SSW",
            "↙SW",
            "WSW",
            "←W",
            "WNW",
            "↖NW",
            "NNW",
            "↑N",
        ];
        const directionEN = [
            "↑N",
            "NNE",
            "↗NE",
            "ENE",
            "→E",
            "ESE",
            "↘SE",
            "SSE",
            "↓S",
            "SSW",
            "↙SW",
            "WSW",
            "←W",
            "WNW",
            "↖NW",
            "NNW",
            "↑N",
        ];
        if (this.lang === "de") {
            return directionDE[Math.round((degrees + 11.25) / 22.5 - 1)];
        }
        return directionEN[Math.round((degrees + 11.25) / 22.5 - 1)];
    }

    msToBeaufort(ms) {
        if (this.config.windSpeedUnit === "default") {
            ms = ms * 0.27778;
        } else if (this.config.windSpeedUnit === "Knots") {
            ms = ms * 0.514444;
        } else if (this.config.windSpeedUnit === "mph") {
            ms = ms * 0.44704;
        }
        return Math.ceil(Math.cbrt(Math.pow(ms / 0.836, 2)));
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
