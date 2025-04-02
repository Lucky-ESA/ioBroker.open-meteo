/**
    Create weather icon SVG files
    Copyright (C) 2023 Johanna Roedenbeck
    This script is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.
 
    This script is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.
 */
module.exports = class SVG {
    /**
     * @param adapter any
     */
    constructor(adapter) {
        this.adapter = adapter;
    }

    sonne(x, y, SUN_COLOR, fill) {
        let s = "";
        s = `<g stroke="${SUN_COLOR}">`;
        s += `<circle cx="${x}" cy="${y}" r="18" fill="${fill != "none" ? fill : "none"}" />`;
        s += `<path d="`;
        for (let i = 0; i < 8; i++) {
            const w = (Math.PI * i) / 4;
            const ri = 24;
            const ro = 38;
            const a = (x + Math.cos(w) * ri).toFixed(14);
            const b = (y + Math.sin(w) * ri).toFixed(14);
            const c = (x + Math.cos(w) * ro).toFixed(14);
            const d = (y + Math.sin(w) * ro).toFixed(14);
            s += `M ${a},${b} L ${c},${d} `;
        }
        s += `" />`;
        s += `</g>`;
        return s;
    }

    mond(x, y, scale, MOON_COLOR, fill) {
        const r1 = (26 * scale).toFixed(7);
        const r2 = (24 * scale).toFixed(7);
        const dx = (22 * scale).toFixed(7);
        const dy = (39 * scale).toFixed(7);
        return `<path stroke="${MOON_COLOR}" fill="${fill != "none" ? fill : "none"}" d="M ${x},${y} a ${r1},${r1} 0 0 1 -${dx},${dy} a ${r2},${r2} 0 1 0 ${dx},-${dy} z" />`;
    }

    sonnemondicon(MOON_COLOR, SUN_COLOR, fill, fills) {
        let s = this.sonne(-20, -5, SUN_COLOR, fills != "none" ? fills : "none");
        s += this.mond(35, -5, MOON_COLOR, fill != "none" ? fill : "none");
        return s;
    }

    wolke_grosz(x, y, offen, CLOUD_COLOR, fill) {
        if (fill != "none") {
            offen = 0;
        }
        let s = `<path stroke="${CLOUD_COLOR}" fill="${fill != "none" ? fill : "none"}" d="M ${x},${y} `;
        if (offen) {
            s += `m ${offen},0 h -${offen} `;
        }
        s +=
            "a 20,20 0 1 1 4.88026841,-39.3954371 a 24,24 0 0 1 43.20059379,-9.49083912 a 16.25,16.25 0 0 1 16.9191378,9.88627622 a 20,20 0 0 1 -6.244998,39";
        if (offen) {
            s += `h -${offen}`;
        } else {
            s += "z";
        }
        s += `" />`;
        return s;
    }

    wolke_klein(x, y, CLOUD_COLOR, fill) {
        return `<path stroke="${CLOUD_COLOR}" stroke-width="1.8" fill="${fill != "none" ? fill : "none"}" d="M ${x},${y} a 12,12 0 1 1 2.92816105,-23.63726226 a 14.4,14.4 0 0 1 25.92035627,-5.69450347 a 9.75,9.75 0 0 1 10.15148268,5.93176573 a 12,12 0 0 1 -3.7469988,23.4 z " />`;
    }

    wolke(x, y, scale, offen, CLOUD_COLOR, fill, linewidth) {
        if (fill != "none") {
            offen = 0;
        }
        offen = offen * scale;
        let s = `<path stroke="${CLOUD_COLOR}" `;
        if (linewidth) {
            s += `stroke-width="${linewidth}" `;
        }
        s += `fill="${fill != "none" ? fill : "none"}" d="M ${x},${x} `;
        if (offen) {
            s += `m ${offen},0 h -${offen} `;
        }
        s += `a${20 * scale},${20 * scale} 0 1 1 ${4.88026841 * scale},${-39.3954371 * scale} `;
        s += `a${24 * scale},${24 * scale} 0 0 1 ${43.20059379 * scale},${-9.49083912 * scale} `;
        s += `a${16.25 * scale},${16.25 * scale} 0 0 1 ${16.9191378 * scale},${9.88627622 * scale} `;
        s += `a${20 * scale},${20 * scale} 0 0 1 ${-6.244998 * scale},${39 * scale} `;
        if (offen) {
            s += `h ${-offen}`;
        } else {
            s += "z";
        }
        s += `" />`;
        return s;
    }

    blitz(x, y, SUN_COLOR, fill) {
        return `<path stroke-width="2" stroke-linejoin="round" stroke="${SUN_COLOR}" fill="${fill != "none" ? fill : "none"}" d="M${x},${y} l9.12538211,-21.49805304 l-12.39550268,3.32136493 l7.14107222,-16.82331189 h-8.81753557 l-4.1787982,21.49805304 l12.39550268,-3.32136493 z" />`;
    }
    regen(x, y, v, RAIN_COLOR) {
        const h = ((v * 22) / 30).toFixed(14);
        let s = `<path stroke="none" fill="${RAIN_COLOR}" d="M ${x},${y} `;
        for (let i = 0; i < 3; i++) {
            s += `h5 l${h},${v} h-5 l-${h},-${v} z `;
            if (i < 2) {
                s += "m 15,0 ";
            }
        }
        s += `" />`;
        return s;
    }

    niesel(x, y, v, anzahl, RAIN_COLOR) {
        const h = ((v * 22) / 30).toFixed(14);
        let dash = "4 9";
        if (v / 13 < 2.2) {
            dash = "3.5 7.5";
        }
        x += 1.5 + h;
        y += v;
        let s = `<path stroke="${RAIN_COLOR}" fille="none" stroke-dasharray="${dash}" stroke-width="2" d="M${x},${y} `;
        for (let i = 0; i < anzahl; i++) {
            let sign = 0;
            if (i % 2) {
                sign = 1;
            } else {
                sign = -1;
            }
            s += `l${parseFloat(h) * sign},${v * sign} `;
            if (i < 4) {
                s += "m7.5,0 ";
            }
        }
        s += `" />`;
        return s;
    }

    schneeflocke(x, y, r, innen, SNOW_COLOR) {
        y -= r;
        let s = `<path stroke="${SNOW_COLOR}" stroke-width="${r * 0.15}" stroke-linecap="round" fill="none" d="M ${x},${y} `;
        let xa = x;
        let ya = y;
        for (let i = 0; i < 3; i++) {
            const phi = (i * Math.PI) / 3;
            if (i > 0) {
                s += `m${(-xa - r * Math.sin(phi)).toFixed(8)},${(-ya - r * Math.cos(phi)).toFixed(8)} `;
            }
            s += `l${(2 * r * Math.sin(phi)).toFixed(8)},${(2 * r * Math.cos(phi)).toFixed(8)} `;
            xa = r * Math.sin(phi);
            ya = r * Math.cos(phi);
        }
        for (let i = 0; i < 6; i++) {
            const phi = (i * Math.PI) / 3;
            x = -r * Math.sin(phi);
            y = -r * Math.cos(phi);
            s += `m${(x - xa).toFixed(8)},${(y - ya).toFixed(8)} `;
            const r2 = r / 3;
            s += `m${(r2 * Math.sin(phi + Math.PI / 3)).toFixed(8)},${(r2 * Math.cos(phi + Math.PI / 3)).toFixed(8)} `;
            s += `l${(r2 * Math.sin(phi + (5 * Math.PI) / 3)).toFixed(8)},${(r2 * Math.cos(phi + (5 * Math.PI) / 3)).toFixed(8)} `;
            s += `l${(r2 * Math.sin(phi - (2 * Math.PI) / 3)).toFixed(8)},${(r2 * Math.cos(phi - (2 * Math.PI) / 3)).toFixed(8)} `;
            s += `m${(r2 * Math.sin(phi + (2 * Math.PI) / 3)).toFixed(8)},${(r2 * Math.cos(phi + (2 * Math.PI) / 3)).toFixed(8)} `;
            xa = x;
            ya = y;
        }
        if (innen) {
            for (let i = 0; i < 6; i++) {
                const phi = (i * Math.PI) / 3;
                x = ((-r * 1.5) / 3) * Math.sin(phi);
                y = ((-r * 1.5) / 3) * Math.cos(phi);
                s += `m${(x - xa).toFixed(8)},${(y - ya).toFixed(8)} `;
                const r2 = r / 6;
                s += `m${(r2 * Math.sin(phi + Math.PI / 3)).toFixed(8)},${(r2 * Math.cos(phi + Math.PI / 3)).toFixed(8)} `;
                s += `l${(r2 * Math.sin(phi + (5 * Math.PI) / 3)).toFixed(8)},${(r2 * Math.cos(phi + (5 * Math.PI) / 3)).toFixed(8)} `;
                s += `l${(r2 * Math.sin(phi - (2 * Math.PI) / 3)).toFixed(8)},${(r2 * Math.cos(phi - (2 * Math.PI) / 3)).toFixed(8)} `;
                s += `m${(r2 * Math.sin(phi + (2 * Math.PI) / 3)).toFixed(8)},${(r2 * Math.cos(phi + (2 * Math.PI) / 3)).toFixed(8)} `;
                xa = x;
                ya = y;
            }
        }
        s += `" />`;
        return s;
    }

    regentropfen(x, y, r, RAIN_COLOR, fill) {
        r *= 1 + 0.15 / 2;
        const r1 = 5 * r;
        const r2 = 0.6 * r;
        let s = `<path stroke="${RAIN_COLOR}" fill="${fill != "none" ? fill : "none"}" d="M${x},${y - r} `;
        s += `a${r1},${r1} 0 0 1 ${-0.508568808 * r},${1.081632653 * r} `;
        s += `a${r2},${r2} 0 1 0 ${1.017137616 * r},0 `;
        s += `a${r1},${r1} 0 0 1 ${-0.508568808 * r},${-1.081632653 * r} z" />`;
        return s;
    }

    schlitterlinie(x, y, LINE, fill) {
        let s = `<path stroke="${LINE}" fill="${fill != "none" ? fill : "none"}" d="M${x - 14.02235138},${y} l8.54455967,-4.047423 `;
        s += `a6.04100450,6.04100450 0 0 0 2.54603347,-8.64621208 l-3.23725145,-5.21347156 a2.74580363,2.74580363 0 0 1 0.78256116,-3.71485342 l4.93895246,-3.37803994 h-1.38888889 `;
        s += `l-5.10795449,2.93585208 a4.68254091,4.68254091 0 0 0 -2.09563466,5.5796135 l2.27226862,6.62156404 a3.29583971,3.29583971 0 0 1 -1.84474537,4.10998876 l-13.74323385,5.75298161 z `;
        s += `m33.33333333,0 l1.22771241,-1.22771241 a6.20359314,6.20359314 0 0 0 -1.28480621,-9.75907203 l-13.55967183,-7.82868018 a3.22628070,3.22628070 0 0 1 -1.41857181,-3.89749403 l0.83241498,-2.28704135 h-1.38888889 `;
        s += `l-0.68119443,1.08342259 a4.68254091,4.68254091 0 0 0 1.30173924,6.30605466 l12.49300857,8.59055233 a2.68888799,2.68888799 0 0 1 0.13365758,4.33313596 l-5.98873292,4.68683446 z`;
        s += `" />`;
        return s;
    }

    windsymbol(wx, wy, factor, WIND_COLOR) {
        const r = (12 * factor).toFixed(6);
        return `<path stroke-width="${(6 * factor).toFixed(1)}" stroke="${WIND_COLOR}" fill="none" d="M${wx},${wy - 15 * factor} h${40 * factor} a${r},${r} 0 1 0 -${r},-${r} M${wx},${wy} h${75 * factor} a${r},${r} 0 1 0 -${r},-${r} M${wx},${wy + 15 * factor} h${57.5 * factor} a${r},${r} 0 1 1 -${r},${r}" />`;
    }

    snowflake_icon_15px(RAIN_COLOR) {
        let s =
            '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="15px" height="15px" viewBox="-7.5 -7.5 15 15">';
        s += this.schneeflocke(0, 0, 6.95, false, RAIN_COLOR);
        s += "</svg>";
        return s;
    }

    raindrop_icon_15px(RAIN_COLOR, fill) {
        let s =
            '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="15px" height="15px" viewBox="-7.5 -7.5 15 15">';
        s += this.regentropfen(0, 0, 6.95, RAIN_COLOR, fill != "none" ? fill : "none");
        s += "</svg>";
        return s;
    }

    sun_icon_15px(SUN_COLOR, fill) {
        let s =
            '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="15px" height="15px" viewBox="-40 -40 80 80">';
        s += '<g stroke-width="5.7">';
        s += this.sonne(0, 0, SUN_COLOR, fill != "none" ? fill : "none");
        s += "</g>";
        s += "</svg>";
        return s;
    }

    moon_icon_15px(MOON_COLOR, fill) {
        let s =
            '<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="15px" height="15px" viewBox="-40 -40 80 80">';
        s += '<g stroke-width="5.7">';
        s += this.mond(0, 24, MOON_COLOR, fill != "none" ? fill : "none");
        s += "</g>";
        s += "</svg>";
        return s;
    }

    wetterleuchten(CLOUD_COLOR, SUN_COLOR, fill, fills) {
        let s = this.wolke_grosz(-31, 28, 0, CLOUD_COLOR, fills != "none" ? fills : "none");
        s += this.blitz(-4, 16, SUN_COLOR, fill ? fill : "none");
        return s;
    }

    wetterleuchten2(CLOUD_COLOR, SUN_COLOR, fill, fills) {
        let s = this.wolke_klein(-20, 0, CLOUD_COLOR, fills != "none" ? fills : "none");
        s += this.blitz(-4, 38, SUN_COLOR, fill != "none" ? fill : "none");
        return s;
    }

    wetterleuchten3(CLOUD_COLOR, fill) {
        let s = this.wolke_grosz(-31, 22, 12, CLOUD_COLOR, fill != "none" ? fill : "none");
        s += this.blitz(-2, 45);
        return s;
    }

    gewitter(CLOUD_COLOR, fill, offen, FLASH_COLOR, fills) {
        let s = "";
        if (fill != "none") {
            const scale = 0.85;
            s = this.wolke(-31 * scale, 8.5, scale, offen, CLOUD_COLOR, fill != "none" ? fill : "none", false);
            s += this.blitz(-4, 2, FLASH_COLOR, fills != "none" ? fills : "none");
            s += this.regen(-20, 10, 30);
        } else {
            s = this.wolke_grosz(-31, 22, 4, CLOUD_COLOR, fill != "none" ? fill : "none");
            s += this.blitz(-4, 6, FLASH_COLOR, fills != "none" ? fills : "none");
            s += this.regen(-28, 10, 30);
        }
        return s;
    }

    hagelgewitter(CLOUD_COLOR, fill1, RAIN_COLOR, fill, FLASH_COLOR, fills) {
        let s = this.wolke_grosz(-31, fill != "none" ? 16 : 22, 4, CLOUD_COLOR, fill1 != "none" ? fill1 : "none");
        s += this.blitz(-4, 6, FLASH_COLOR, fills != "none" ? fills : "none");
        s += `<g stroke="none" fill="${RAIN_COLOR}">`;
        s += `<circle cx="-15" cy="${fill != "none" ? 42 : 37}" r="4" />`;
        s += `<circle cx="-6" cy="${fill != "none" ? 25 : 19}" r="4" />`;
        s += `<circle cx="11" cy="${fill != "none" ? 36 : 30}" r="4" />`;
        s += "</g>";
        return s;
    }

    sandsturmgewitter(CLOUD_COLOR, SAND_COLOR, SUN_COLOR, fill, fills) {
        let s = "";
        if (fill != "none") {
            const scale = 0.85;
            s = this.wolke(-31 * scale, 8.5 - 2, scale, 0, CLOUD_COLOR, fill != "none" ? fill : "none", false);
            s += this.blitz(-4, 2 - 2, SUN_COLOR, fills ? fills : "none");
            s += this.windsymbol(-31 + 8, 22 - 4 + 7.5 + 2, 0.5 * scale, SAND_COLOR);
        } else {
            s = this.wolke_grosz(-31, 22 - 7.5, 2, CLOUD_COLOR, fill != "none" ? fill : "none");
            s += this.blitz(-4, 6 - 7.5, SUN_COLOR, fills ? fills : "none");
            s += this.windsymbol(-31 + 8, 22 - 4 + 7.5, 0.5, SAND_COLOR);
        }
        return s;
    }

    regen_gesamt(CLOUD_COLOR, fill, RAIN_COLOR, mit_wind, WIND_COLOR) {
        let s = "";
        if (fill != "none") {
            const scale = 0.85;
            s = this.wolke(-31 * scale, 8.5, scale, 0, CLOUD_COLOR, fill != "none" ? fill : "none", false);
            s += this.regen(-20, 10, 30, RAIN_COLOR);
            if (mit_wind) {
                s += this.windsymbol(13, 24, 0.5, WIND_COLOR);
            }
        } else {
            s = this.wolke_grosz(-31, 22, 4, CLOUD_COLOR, fill != "none" ? fill : "none");
            s += this.regen(-28, 10, 30, RAIN_COLOR);
            if (mit_wind) {
                s += this.windsymbol(13, 24, 0.5, WIND_COLOR);
            }
        }
        return s;
    }

    niesel_gesamt(RAIN_COLOR, CLOUD_COLOR, fill) {
        let s = "";
        if (fill != "none") {
            const scale = 0.85;
            s = this.wolke(-31 * scale, 8.5, scale, 0, CLOUD_COLOR, fill != "none" ? fill : "none", false);
            s += this.niesel(-20, 10, 30, 5, RAIN_COLOR);
        } else {
            s = this.wolke_grosz(-31, 22, 4, CLOUD_COLOR, fill != "none" ? fill : "none");
            s += this.niesel(-28, 10, 30, 5, RAIN_COLOR);
        }
        return s;
    }

    schneefall(fill, innen, CLOUD_COLOR, SNOW_COLOR) {
        let s = "";
        if (fill != "none") {
            const scale = 0.85;
            s = this.wolke(-31 * scale, 8.5, scale, 0, CLOUD_COLOR, fill != "none" ? fill : "none", false);
        } else {
            s = this.wolke_grosz(-31, 22, 4, CLOUD_COLOR, fill != "none" ? fill : "none");
        }
        s += this.schneeflocke(-13, 17, 10, innen, SNOW_COLOR);
        s += this.schneeflocke(12, 10, 10, innen, SNOW_COLOR);
        s += this.schneeflocke(5, 33, 10, innen, SNOW_COLOR);
        return s;
    }

    schneeregen(fill, innen, CLOUD_COLOR, RAIN_COLOR) {
        let s = "";
        if (fill != "none") {
            const scale = 0.85;
            s = this.wolke(-31 * scale, 8.5, scale, 0, CLOUD_COLOR, fill != "none" ? fill : "none", false);
            s += this.schneeflocke(-15, 30, 10, innen, CLOUD_COLOR);
        } else {
            s = this.wolke_grosz(-31, 22, 4, CLOUD_COLOR, fill != "none" ? fill : "none");
            s += this.schneeflocke(-13, 33, 10, innen, CLOUD_COLOR);
        }
        s += this.niesel(-10, 10, 3, 5, RAIN_COLOR);
        return s;
    }

    hagel(CLOUD_COLOR, RAIN_COLOR, fill) {
        let s = "";
        if (fill != "none") {
            const scale = 0.85;
            s = this.wolke(-31 * scale, 8.5, scale, 0, CLOUD_COLOR, fill != "none" ? fill : "none", false);
        } else {
            s = this.wolke_grosz(-31, 22, 4, CLOUD_COLOR, fill != "none" ? fill : "none");
        }
        s += `<g stroke="none" fill="${RAIN_COLOR}">`;
        s += '<circle cx="-15" cy="37" r="4" />';
        s += '<circle cx="-6" cy="19" r="4" />';
        s += '<circle cx="11" cy="30" r="4" />';
        s += "</g>";
        return s;
    }

    glatt(LINE, innen, fill, RAIN_COLOR, SNOW_COLOR) {
        let s = this.schlitterlinie(10.6, 45, LINE, fill != "none" ? fill : "none");
        s += this.schneeflocke(-23, 32.5, 10, innen, SNOW_COLOR);
        return s;
    }

    gefrierender_nieselregen(CLOUD_COLOR, fill, innen, RAIN_COLOR, LINE, fills, SNOW_COLOR) {
        const scale = 0.85;
        let s = this.wolke(-31 * scale, 4, scale, 4, CLOUD_COLOR, fill != "none" ? fill : "none", false);
        s += this.niesel(-27, -7, 30 * scale, 5, RAIN_COLOR);
        s += this.schlitterlinie(4.6, 48, LINE, fills != "none" ? fills : "none");
        s += this.schneeflocke(-17, 34, 8, innen, SNOW_COLOR);
        return s;
    }

    gefrierender_regen(CLOUD_COLOR, fill, innen, RAIN_COLOR, LINE, fills, SNOW_COLOR) {
        const scale = 0.85;
        let s = this.wolke(-31 * scale, 4, scale, 4, CLOUD_COLOR, fill != "none" ? fill : "none", false);
        s += this.regen(-27, -7, 30 * scale, RAIN_COLOR);
        s += this.schlitterlinie(4.6, 48, LINE, fills != "none" ? fills : "none");
        s += this.schneeflocke(-17, 34, 8, innen, SNOW_COLOR);
        return s;
    }

    gefrierender_regen2(CLOUD_COLOR, fill, innen, RAIN_COLOR, LINE, fills, SNOW_COLOR) {
        let s = this.wolke_grosz(-31, 22, 4, CLOUD_COLOR, fill != "none" ? fill : "none");
        s += this.regen(-28, 10, 30, RAIN_COLOR);
        s += this.schlitterlinie(10.6, 5, LINE, fills != "none" ? fills : "none");
        s += this.schneeflocke(-15, -7, 8, innen, SNOW_COLOR);
        return s;
    }

    gefrierender_regen5(CLOUD_COLOR, fill, RAIN_COLOR, LINE, fills) {
        let s = this.wolke(-31 + 21, 22 - 14, 0.85, 4, CLOUD_COLOR, fill != "none" ? fill : "none", false);
        s += this.regen(-28 + 17, 10 - 14, 30 * 0.85, RAIN_COLOR);
        let b = 74;
        let h = b * 0.5;
        let v = (b * Math.sin((60 * Math.PI) / 180)).toFixed(8);
        s += `<path stroke="none" fill="#F0F0F0" d="M-60,46 l${h},${-v} l${h},${v} z" />`;
        b = 68;
        h = b * 0.5;
        v = (b * Math.sin((60 * Math.PI) / 180)).toFixed(8);
        s += `<path stroke="#FF0000" stroke-width="6" stroke-linecap="round" fill="none" d="M-56,42 l${h},${-v} l${h},${v} z" />`;
        s += this.schlitterlinie(-23, 37, LINE, fills != "none" ? fills : "none");
        return s;
    }
    schleudergefahr(LINE, fill, TRIANGLE, TRIANGLE_RAND) {
        const b = 42;
        const h = b * 0.5;
        let v = (b * Math.sin((60 * Math.PI) / 180)).toFixed(8);
        let s = `<path stroke="${TRIANGLE_RAND}" stroke-width="8" stroke-linejoin="round" fill="${TRIANGLE_RAND}" d="M10,42 l${h},-${v} l${h},${v} z" />`;
        v = (b * Math.sin((60 * Math.PI) / 180)).toFixed(8);
        s += `<path stroke="${TRIANGLE}" stroke-width="6" stroke-linejoin="round" fill="none" d="M10,42 l${h},-${v} l${h},${v} z" />`;
        s += '<g transform="scale(0.5)">';
        s += this.schlitterlinie(23 * 2 + 15, 37 * 2, LINE, fill != "none" ? fill : "none");
        s += "</g>";
        return s;
    }

    gefrierender_regen4(CLOUD_COLOR, fill, LINE, fills, TRIANGLE, TRIANGLE_RAND, mit_wind, WIND_COLOR) {
        let s = this.wolke_grosz(-31 - 7, 22 - 7, 4, CLOUD_COLOR, fill != "none" ? fill : "none");
        s += this.regen(-28 - 7, 10 - 7, 30);
        s += this.schleudergefahr(LINE, fills != "none" ? fills : "none", TRIANGLE, TRIANGLE_RAND);
        if (mit_wind) {
            s += this.windsymbol(14, -23, 0.5, WIND_COLOR);
        }
        return s;
    }

    nach_gefrierendem_regen(CLOUD_COLOR, fill, innen, LINE, fills, SNOW_COLOR) {
        const scale = 0.9;
        let s = this.wolke(-31 * scale, 11, scale, 0, CLOUD_COLOR, fill != "none" ? fill : "none", false);
        s += this.schlitterlinie(4.6, 44, LINE, fills != "none" ? fills : "none");
        s += this.schneeflocke(-17, 30, 8, innen, SNOW_COLOR);
        return s;
    }

    nach_gefrierendem_regen4(CLOUD_COLOR, fill, LINE, fills, TRIANGLE, TRIANGLE_RAND) {
        let s = this.wolke_grosz(-31 - 7, 22 - 7, 0, CLOUD_COLOR, fill != "none" ? fill : "none");
        s += this.schleudergefahr(LINE, fills, TRIANGLE, TRIANGLE_RAND);
        return s;
    }

    unknown(CLOUD_COLOR, fill) {
        let s = this.wolke_grosz(-31, 28, 0, CLOUD_COLOR, fill != "none" ? fill : "none");
        s += `<text x="-18" y="18" fill="${CLOUD_COLOR}" style="font-family:sans-serif;font-size:50px;font-weight:normal;text-align:center">?</text>`;
        return s;
    }

    bewoelkt(wolke, mit_sonne, mit_mond, mit_wind, SUN_COLOR, fill, WIND_COLOR, MOON_COLOR, fill1, CLOUD_COLOR, fill2) {
        if (wolke == 0) {
            if (mit_sonne) {
                if (mit_wind) {
                    return (
                        this.sonne(-21, -6, SUN_COLOR, fill != "none" ? fill : "none") +
                        this.windsymbol(13, 24, 0.5, WIND_COLOR)
                    );
                }
                return this.sonne(0, 0, SUN_COLOR, fill != "none" ? fill : "none");
            }
            if (mit_mond) {
                if (mit_wind) {
                    return (
                        this.mond(-23, -350, 0, MOON_COLOR, fill1 != "none" ? fill1 : "none") +
                        this.windsymbol(3, 15, 0.5, WIND_COLOR)
                    );
                }
                return this.mond(0, 24, 0, MOON_COLOR, fill1 != "none" ? fill1 : "none");
            }
        }
        let s = "";
        let xy = [-31, 28];
        let cx = 0;
        let cy = 0;
        let r = 0;
        let ri = 0;
        let ro = 0;
        let arc = [];
        let strahlen = [];
        if (mit_sonne && wolke < 4) {
            if (wolke == 3) {
                cx = -28;
                cy = -12;
                r = 14;
                ri = 19;
                ro = 30;
                arc = [-19.99475974, -23.48547467, 0, -41.65782625, -8.92367394];
                strahlen = [4, 5, 6];
            } else if (wolke == 2) {
                cx = -32;
                cy = -18;
                r = 14;
                ri = 19;
                ro = 30;
                arc = [-18.00252351, -17.73419552, 1, -39.25615559, -6.02718888];
                strahlen = [3, 4, 5, 6, 7];
                xy = [-25, 28];
            } else {
                if (mit_wind) {
                    cx = -21;
                } else {
                    cx = 0;
                }
                if (mit_wind) {
                    cy = 0;
                } else {
                    cy = -7;
                }
                r = 18;
                ri = 24;
                ro = 38;
                arc = [17.4069956 + cx, -2.41780574 + cy + 7, 1, -5.26007294 + cx, 10.21428571 + cy + 7];
                strahlen = [3, 4, 5, 6, 7, 0];
            }
            s += `<g stroke="${SUN_COLOR}">`;
            if (arc.length == 0 || fill != "none") {
                s += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fill}" />`;
            }
            s += `<path fill="none" d="`;
            if (arc.length > 0) {
                s += `M ${arc[0]},${arc[1]} A ${r},${r} 0 ${arc[2]} 0 ${arc[3]},${arc[4]} `;
            }
            for (let i = 0; i < 8; i++) {
                const w = (Math.PI * i) / 4;
                if (strahlen.includes(i)) {
                    s += `M ${(Math.cos(w) * ri).toFixed(14) + cx},${(Math.sin(w) * ri).toFixed(14) + cy} L ${Math.cos(w) * ro + cx},${(Math.sin(w) * ro).toFixed(14) + cy} `;
                }
            }
            s += `" />`;
            s += "</g>";
        }
        if (mit_mond && wolke < 4) {
            if (wolke == 1) {
                if (fill != "none") {
                    s += this.mond(0, 24, 1.0, MOON_COLOR, fill1 != "none" ? fill1 : "none");
                } else {
                    s += `<path stroke="${MOON_COLOR}" fill="none" d="M${19.97705974 - mit_wind ? 21 : 0},${-2.12865019 + mit_wind ? 7 : 0} a 24,24 0 0 0 -19.97705974,-28.87134981 a 26,26 0 0 1 -22,39 a 24,24 0 0 0 11.27165715,7.62388061" />`;
                }
            } else if (wolke == 2) {
                if (fill != "none") {
                    s += this.mond(-34, -43, 1.0, MOON_COLOR, fill1 != "none" ? fill1 : "none");
                } else {
                    s += `<path stroke="${MOON_COLOR}" fill="none" d="M-13.88,-23.64 a24,24 0 0 0 -20.12,-19.36 a26,26 0 0 1 -22,39 a 24,24 0 0 0 11.44,7.68" />`;
                }
                xy = [-25, 28];
            } else if (wolke >= 3) {
                if (fill != "none") {
                    s += this.mond(-29, -33, 1.0, MOON_COLOR, fill1 != "none" ? fill1 : "none");
                } else {
                    s += `<path stroke="${MOON_COLOR}" fill="none" d="M-13.518,-23.978 a24,24 0 0 0 -15.482,-9.022 a26,26 0 0 1 2.200,21.081 m-17.992,17.040 a26,26 0 0 1 -6.208,0.879  a 24,24 0 0 0 6.290,5.392" />`;
                }
                xy = [-25, 28];
            }
        }
        if (wolke >= 3) {
            let w3 = [5, -30];
            if (mit_mond && wolke == 3) {
                w3 = [11, -30];
            }
            if (fill != "none") {
                s += this.wolke_klein(w3[0] + 5, w3[1] + 20, CLOUD_COLOR, fill2 != "none" ? fill2 : "none");
            } else {
                s += `<path stroke="${CLOUD_COLOR}" stroke-width="1.8" fill="none" d="M ${w3[0]},${w3[1]} a 14.4,14.4 0 0 1 25.8,-5.4 h 2 a 9.75,9.75 0 0 1 9,6 a 12,12 0 0 1 0.3,22.68" />`;
            }
        }
        if (wolke == 1) {
            s += this.wolke_klein(
                mit_wind ? -21 : 0,
                mit_wind ? 40 : 33,
                CLOUD_COLOR,
                fill2 != "none" ? fill2 : "none",
            );
            if (mit_wind) {
                s += this.windsymbol(14, -23, 0.5, WIND_COLOR);
            }
        }
        if (wolke >= 2) {
            s += this.wolke_grosz(xy[0], xy[1], mit_wind ? 4 : 0, CLOUD_COLOR, fill2 != "none" ? fill2 : "none");
            if (mit_wind) {
                s += this.windsymbol(xy[0] + 8, xy[1] - 4, 0.5, WIND_COLOR);
            }
        }
        return s;
    }

    nebel(FOG_COLOR) {
        let s = `<path stroke="${FOG_COLOR}" stroke-linecap="round" d="`;
        for (let i = 0; i < 4; i++) {
            s += `M -39,${10 * i - 15} h 78 `;
        }
        s += '" />';
        return s;
    }

    wind(WIND_COLOR) {
        return this.windsymbol(-45, 0, 1, WIND_COLOR);
    }

    tornado() {
        // TODO
        return "";
    }

    sandsturm(SAND_COLOR) {
        return this.windsymbol(-45, 0, 1, SAND_COLOR);
    }

    schneesturm(WIND_COLOR, innen, SNOW_COLOR) {
        let s = this.windsymbol(-60, 0, 1, WIND_COLOR);
        s += this.schneeflocke(30, 30, 10, innen, SNOW_COLOR);
        s += this.schneeflocke(50, 5, 10, innen, SNOW_COLOR);
        s += this.schneeflocke(42, -30, 10, innen, SNOW_COLOR);
        return s;
    }

    epfeil(x, y, factor, color) {
        const epfeil_coordinates = [
            [-0.1682952122, 0.5728820612],
            [0.2461538364, -0.1269230985],
            [-0.0526681452, 0.3855718688],
            [-0.050322184, -0.0734997543],
            [0.0387837266, 0.2417740425],
            [0.1411296744, -0.2038461369],
            [-0.0714760171, 0.0444421877],
            [0.1483991222, -0.5463653028],
            [-0.2653846543, 0.1461538497],
            [0.1942307946, -0.4403845977],
            [-0.1605509414, 0.0001949137],
        ];
        let s = `<path stroke="none" fill="${color}" d="`;
        s += `M${(x - 0.013652021551523648 * factor).toFixed(10)},${(y - factor).toFixed(10)} `;
        for (const i of epfeil_coordinates) {
            s += `l${(i[0] * factor).toFixed(10)},${(i[1] * factor).toFixed(10)} `;
        }
        s += 'Z" />';
        return s;
    }

    solarpanel(pv, color1, color2) {
        let s = `<g stroke="${color1}">`;
        s += `<path fill="${color2}" d="`;
        s += `M${pv[0]},${pv[0]} `;
        s += `L${pv[1]},${pv[1]} `;
        s += `L${pv[3]},${pv[3]} `;
        s += `L${pv[2]},${pv[2]} `;
        s += 'Z" />';
        s += '<path fill="none" d="';
        let dx0 = (pv[2][0] - pv[0][0]) / 3;
        let dy0 = (pv[2][1] - pv[0][1]) / 3;
        let dx1 = (pv[3][0] - pv[1][0]) / 3;
        let dy1 = (pv[3][1] - pv[1][1]) / 3;
        let x0 = pv[0];
        let y0 = pv[0];
        let x1 = pv[1];
        let y1 = pv[1];
        for (let i = 0; i < 2; i++) {
            x0 += dx0;
            y0 += dy0;
            x1 += dx1;
            y1 += dy1;
            s += `M${x0},${y0} L${x1},${y1} `;
        }
        dx0 = (pv[1][0] - pv[0][0]) / 3;
        dy0 = (pv[1][1] - pv[0][1]) / 3;
        dx1 = (pv[3][0] - pv[2][0]) / 3;
        dy1 = (pv[3][1] - pv[2][1]) / 3;
        x0 = pv[0];
        y0 = pv[0];
        x1 = pv[2];
        y1 = pv[2];
        for (let i = 0; i < 2; i++) {
            x0 += dx0;
            y0 += dy0;
            x1 += dx1;
            y1 += dy1;
            s += `M${x0},${y0} L${x1},${y1} `;
        }
        s += '" />';
        s += "</g>";
        return s;
    }

    pvicon(bewoelkung, SOLAR, SUN_COLOR, fills, MOON_COLOR, fill1, CLOUD_COLOR, fill2) {
        let cx = -32;
        let cy = -18;
        let r = 14;
        let ri = 19;
        let ro = 30;
        let beams = [];
        let arc = [];
        let s = "";
        if (bewoelkung == 1) {
            beams = [3, 4, 5, 6, 7, 0];
            arc = [0.25, 1.9, 1];
        }
        const pv = [
            [30, -20],
            [60, -10],
            [0, 20],
            [35, 45],
        ];
        if (bewoelkung < 4) {
            s = `<g stroke="${SUN_COLOR}">`;
            if (bewoelkung == 0 || fills != "none") {
                s += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="${fills}" />`;
            } else {
                s += `<path fill="none" d="M${(cx + Math.cos(arc[0]) * r).toFixed(14)},${cy + (Math.sin(arc[0]) * r).toFixed(14)} A${r},${r} 0 ${arc[2]} 0 ${(cx + Math.cos(arc[1]) * r).toFixed(14)} ${(cy + Math.sin(arc[1]) * r).toFixed(14)}" />`;
            }
            let strahlen = [];
            for (let i = 0; i < 8; i++) {
                const w = (Math.PI * i) / 4;
                if (bewoelkung == 0 || beams.includes(i)) {
                    strahlen.push(
                        `M${(Math.cos(w) * ri).toFixed(14) + cx},${(Math.sin(w) * ri).toFixed(14) + cy} L${(Math.cos(w) * ro).toFixed(14) + cx},${(Math.sin(w) * ro).toFixed(14) + cy} `,
                    );
                }
            }
            s += `<path fill="none" d="${strahlen.join(" ")}" />`;
            s += "</g>";
        } else if (bewoelkung == 10) {
            s = this.mond(-30, -40, 0.7777777, MOON_COLOR, fill1 != "none" ? fill1 : "none");
        } else {
            s = "";
        }
        if (bewoelkung == 1) {
            s += this.wolke(cx, cy + 31, 0.4666666, 0, CLOUD_COLOR, fill2 != "none" ? fill2 : "none", 1.8);
        } else if (bewoelkung == 4) {
            s += this.wolke(-47, -9.5, 0.6, 0, CLOUD_COLOR, fill2 != "none" ? fill2 : "none", false);
        }
        s += this.solarpanel(pv, SOLAR, bewoelkung >= 10 ? "#808080" : "#4c7ed3");
        s += this.epfeil(13, -10, 35, bewoelkung >= 10 ? "#808080" : "#d9040f");
        return s;
    }

    accumulator(filled, color1, color2) {
        let s = "";
        if (filled < 100) {
            s += `<path stroke="none" fill="${color2}" d="M-55,-25 h${filled} v50 h-${filled} z" />`;
        }
        s += `<path stroke="${color1}" fill="${filled >= 100 ? color2 : "none"}" fill-opacity="0.8" d="`;
        s += "M-55,-25 h100 v50 h-100 z";
        s += "M45,-10 h5 a5,5 0 0 1 5,5 v10 a5,5 0 0 1 -5,5 h-5 z";
        s += '" />';
        s += `<path stroke="${color1}" fill="none" d="M15,0 h20 m-10,-10 v20 M-45,0 h20" />`;
        return s;
    }

    uv_index(uv, color, bg, desc) {
        const XML =
            '<?xml version="1.0" encoding="UTF-8" standalone="no"?>\n<!DOCTYPE svg PUBLIC "-//W3C//DTD SVG 1.1//EN" "http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd">\n';
        const SVG_START =
            '<svg width="26.04868" height="50.00000" viewBox="0 0 9.8319197 18.8722" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg">';
        const SVG_END = "</svg>\n";
        const DESC = `<desc>UV index ${uv == 12 ? "?" : uv}</desc>\n`;
        const G_START = '<g fill-opacity="1" fill-rule="nonzero" stroke="none">';
        const G_END = "</g>\n";
        const PATH1 = `<path d="m1.45486,-0.000044 h 6.92185 c 0.80363,0 1.45521,0.65122 1.45521,1.45485 v 15.96249 c 0,0.80363 -0.65158,1.45486 -1.45521,1.45486 h -6.92185 c -0.80363,0 -1.45486,-0.65123 -1.45486,-1.45486 v -15.96249 c 0,-0.80363 0.65123,-1.45485 1.45486,-1.45485" fill="${bg}" /><path d="m1.51564,3.549864 c 0,0.79375 0.71106,1.32705 1.60817,1.32705 0.89297,0 1.60403,-0.5333 1.60403,-1.32705 v -2.53007 h -0.68213 v 2.46393 c 0,0.52917 -0.401,0.81442 -0.9219,0.81442 -0.5209,0 -0.92191,-0.28525 -0.92191,-0.81442 v -2.46393 h -0.68626 z m 5.02915,1.29398 h 0.53743 l 1.48828,-3.82405 h -0.72347 l -1.02526,2.91041 h -0.0165 l -1.02526,-2.91041 h -0.72347 z m 0,0" fill="${desc}" aria-label="UV" /><path d="m1.61279,6.790969 h 0.21911 v -1.51722 h -0.21911 z m 0.83096,0 h 0.21911 v -1.079 h 0.004 l 0.64492,1.079 h 0.20671 v -1.51722 h -0.21911 v 1.079 l -0.64905,-1.079 h -0.20671 z m 1.68569,0 h 0.48782 c 0.21498,0 0.3638,-0.11162 0.44649,-0.25218 0.0661,-0.10749 0.0785,-0.16537 0.0785,-0.50436 0,-0.31833 -0.004,-0.37621 -0.0744,-0.50436 -0.091,-0.16537 -0.24805,-0.25632 -0.43822,-0.25632 h -0.50022 z m 0.2191,-1.29811 h 0.26045 c 0.11576,0 0.18604,0.0331 0.25218,0.12816 0.0579,0.0827 0.0662,0.14882 0.0662,0.42168 0,0.28112 -0.008,0.32246 -0.0537,0.401 -0.0579,0.0868 -0.1447,0.12816 -0.26459,0.12816 h -0.26045 z m 1.35909,1.29811 h 0.91778 v -0.21911 h -0.69867 v -0.44235 h 0.59531 v -0.2067 h -0.59531 v -0.42995 h 0.69867 v -0.21911 h -0.91778 z m 2.13217,0 h 0.24392 l -0.43822,-0.77721 0.41341,-0.74001 h -0.24805 l -0.28525,0.52917 -0.28525,-0.52917 h -0.24392 l 0.40928,0.74001 -0.43821,0.77721 h 0.24391 l 0.31419,-0.56224 z m 0,0" fill="${desc}" aria-label="INDEX" />`;
        const PATH2 = [
            `<path d="m1.50000,12.72277 a3.41596,5.314405 0 0 0 6.83192,0.0 a3.41596,5.314405 0 0 0 -6.83192,0.0 h1.68258 a1.73338,3.631825 0 0 1 3.46676,0.0 a1.73338,3.631825 0 0 1 -3.46676,0.0 z" fill="${color}" aria-label="0" />`,
            `<path d="m4.18111,18.037176 h 1.68258 v -10.62881 h -1.68258 l -1.67018,1.10381 v 1.6123 l 1.67018,-1.1038 z m 0,0" fill="${color}" aria-label="1" />`,
            `<path d="m1.50634,18.037866 h 6.7014 v -1.52136 h -4.48965 l 3.78271,-4.28708 c 0.49196,-0.54983 0.70694,-1.16168 0.70694,-1.86448 0,-1.68672 -1.46762,-3.04684 -3.43132,-3.04684 -1.7694,0 -3.25355,1.33118 -3.27008,3.06337 h 1.68258 c 0.0827,-0.95911 0.81029,-1.53789 1.71979,-1.53789 1.00459,0 1.61644,0.76068 1.61644,1.50482 0,0.31419 -0.0661,0.64492 -0.42995,1.06247 l -4.58886,5.19245 z m 0,0" fill="${color}" aria-label="2" />`,
            `<path d="m3.88345,13.229574 h 0.71107 c 0.98805,0 1.81488,0.62838 1.81488,1.68671 0,1.04594 -0.84336,1.68672 -1.78181,1.68672 -0.95911,0 -1.43867,-0.47542 -1.75286,-1.20716 h -1.68259 c 0.3142,1.77767 1.74873,2.73265 3.33623,2.73265 1.99678,0 3.56361,-1.28571 3.56361,-3.25768 0,-0.86403 -0.39274,-1.76113 -1.38493,-2.32751 0.97565,-0.56637 1.25264,-1.38906 1.25264,-2.19521 0,-1.5503 -1.36839,-3.03031 -3.46439,-3.03031 -1.67018,0 -3.10472,1.29811 -3.23701,2.80707 h 1.68258 c 0.1819,-0.86403 0.90951,-1.28158 1.62058,-1.28158 0.93844,0 1.71565,0.66973 1.71565,1.53789 0,0.86403 -0.69453,1.50482 -1.81487,1.50482 h -0.57878 z m 0,0" fill="${color}" aria-label="3" />`,
            `<path d="m1.17561,16.454176 h 4.90306 v 1.58337 h 1.68672 v -1.58337 h 0.93844 v -1.4304 h -0.93844 v -3.06338 h -1.68672 v 3.06338 h -3.07165 l 3.98115,-7.61504 h -1.88102 l -3.93154,7.61504 z m 0,0" fill="${color}" aria-label="4" />`,
            `<path d="m1.80399,13.155468 h 1.58337 c 0.39687,-0.64079 0.87643,-0.88057 1.52135,-0.88057 1.38493,0 1.69912,0.86816 1.69912,2.04639 0,1.00045 0,2.28203 -1.64951,2.28203 -0.94258,0 -1.50482,-0.47542 -1.68672,-1.2361 h -1.68258 c 0.24805,1.98437 1.91409,2.76159 3.43545,2.76159 1.16995,0 2.06292,-0.58291 2.54248,-1.13688 0.50849,-0.58291 0.72347,-1.13275 0.72347,-2.55075 0,-1.76114 -0.28112,-2.28617 -0.92191,-2.91042 -0.42995,-0.42168 -1.20716,-0.77721 -2.10013,-0.77721 -0.72347,0 -1.31878,0.17776 -1.88102,0.58291 v -2.40606 h 4.67155 v -1.52135 h -6.25492 z m 0,0" fill="${color}" aria-label="5" />`,
            `<path d="m2.01897,13.110062 c -0.29766,0.53744 -0.44649,1.14929 -0.44649,1.77767 0,2.00091 1.63298,3.24115 3.27009,3.24115 1.74873,0 3.46438,-0.97152 3.46438,-3.40651 0,-2.05879 -1.31878,-2.95589 -2.80706,-2.95589 -0.28112,0 -0.64079,0.0455 -0.88883,0.13642 h -0.0331 l 2.47634,-4.49378 h -1.88516 z m 2.92282,0 c 0.9219,0 1.68258,0.55397 1.68258,1.74873 0,1.26918 -0.90951,1.7446 -1.68258,1.7446 -1.02527,0 -1.68672,-0.54984 -1.68672,-1.7446 0,-1.19476 0.76067,-1.74873 1.68672,-1.74873 z m 0,0" fill="${color}" aria-label="6" />`,
            `<path d="m1.82053,10.467978 h 1.68258 v -1.5379 h 3.12126 l -3.98115,9.10746 h 1.88515 l 3.97702,-9.10746 v -1.52135 h -6.68486 z m 0,0" fill="${color}" aria-label="7" />`,
            `<path d="m3.25507,10.36486 c 0,-1.00045 0.82682,-1.52135 1.68672,-1.52135 0.85576,0 1.68258,0.5209 1.68258,1.52135 0,1.00046 -0.82682,1.52136 -1.68258,1.52136 -0.8599,0 -1.68672,-0.5209 -1.68672,-1.52136 z m -1.89756,4.5682 c 0,1.88102 1.63297,3.19567 3.58428,3.19567 1.94716,0 3.58014,-1.31465 3.58014,-3.19567 0,-1.00045 -0.4961,-1.85208 -1.38493,-2.38952 0.69453,-0.56637 1.16995,-1.2237 1.16995,-2.14974 0,-1.71565 -1.46761,-3.07578 -3.36516,-3.07578 -1.9017,0 -3.36931,1.36013 -3.36931,3.07578 0,0.92604 0.47956,1.58337 1.16996,2.14974 -0.88884,0.53744 -1.38493,1.38907 -1.38493,2.38952 z m 1.68258,-0.0165 c 0,-0.96738 0.89297,-1.68671 1.9017,-1.68671 1.00458,0 1.89755,0.71933 1.89755,1.68671 0,0.97152 -0.89297,1.68672 -1.89755,1.68672 -1.00873,0 -1.9017,-0.7152 -1.9017,-1.68672 z m 0,0" fill="${color}" aria-label="8" />`,
            `<path d="m7.86047,12.336576 c 0.29766,-0.53743 0.44648,-1.14928 0.44648,-1.77767 0,-2.00091 -1.63297,-3.24114 -3.26595,-3.24114 -1.75286,0 -3.46852,0.97151 -3.46852,3.40651 0,2.05879 1.31878,2.95589 2.80707,2.95589 0.28112,0 0.64492,-0.0455 0.88883,-0.13643 h 0.0331 l -2.47633,4.49379 h 1.88515 z m -2.91868,0 c -0.92605,0 -1.68672,-0.55397 -1.68672,-1.74873 0,-1.26917 0.9095,-1.74459 1.68672,-1.74459 1.02112,0 1.68258,0.54983 1.68258,1.74459 0,1.19476 -0.76068,1.74873 -1.68258,1.74873 z m 0,0" fill="${color}" aria-label="9" />`,
            `<path d="m1.75182,18.13416 h 1.28158 v -10.68668 h -1.28158 l -1.26504,1.10794 v 1.62471 l 1.26504,-1.11208 z m 5.83944,-3.07578 c 0,1.03353 -0.50436,1.63298 -1.25677,1.63298 -0.75241,0 -1.25677,-0.59945 -1.25677,-1.63298 v -4.53512 c 0,-1.03353 0.50436,-1.63711 1.25677,-1.63711 0.75241,0 1.25677,0.60358 1.25677,1.63711 z m -3.79512,0.0868 c 0,1.96784 1.21957,3.07991 2.53835,3.07991 1.31878,0 2.53835,-1.11207 2.53835,-3.07991 v -4.71289 c 0,-1.96371 -1.21957,-3.07578 -2.53835,-3.07578 -1.31878,0 -2.53835,1.11207 -2.53835,3.07578 z m 0,0" fill="${color}" aria-label="10" />`,
            `<path d="m1.75182,18.13395 h 1.28158 v -10.68669 h -1.28158 l -1.26504,1.10795 v 1.6247 l 1.26504,-1.11207 z m3.61322,-0.000063 h 1.33945 v -7.79281 h -1.33945 l -1.32705,0.81029 v 1.18236 l 1.32705,-0.81029 z m2.04846,-9.550803 h -1.26091 v 0.48369 h 1.26091 v 1.33119 h 0.46302 v -1.33119 h 1.2609 v -0.48369 h -1.2609 v -1.33118 h -0.46302 z" fill="${color}" aria-label="11+" />`,
        ];
        return XML + SVG_START + DESC + G_START + PATH1 + PATH2[uv] + G_END + SVG_END;
    }
};
