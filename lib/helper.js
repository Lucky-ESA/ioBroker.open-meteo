module.exports = {
    /**
     * Check objects states
     */
    async checkObjects() {
        this.log.info(`Check channels and folder!`);
        const objs = await this.getChannelsAsync();
        for (let i = this.config.forecast + 1; i < 9; i++) {
            const hourly = objs.find(t => t._id === `${this.namespace}.hourly.day${`0${i}`.slice(-2)}`);
            if (hourly) {
                this.log.debug(`Delete: ${this.namespace}.hourly.day${`0${i}`.slice(-2)}`);
                await this.delObjectAsync(hourly._id, { recursive: true });
            }
            const daily = objs.find(t => t._id === `${this.namespace}.daily.day${`0${i}`.slice(-2)}`);
            if (daily) {
                this.log.debug(`Delete: ${this.namespace}.daily.day${`0${i}`.slice(-2)}`);
                await this.delObjectAsync(daily._id, { recursive: true });
            }
            const minutely = objs.find(t => t._id === `${this.namespace}.minutely.day${`0${i}`.slice(-2)}`);
            if (minutely) {
                this.log.debug(`Delete: ${this.namespace}.minutely.day${`0${i}`.slice(-2)}`);
                await this.delObjectAsync(minutely._id, { recursive: true });
            }
        }
        this.log.info(`Check states!`);
        const allId = await this.getStatesAsync(`*`);
        for (const id in allId) {
            if (!this.stateCheck.includes(id)) {
                await this.delObjectAsync(id, { recursive: true });
            }
        }
    },
    /**
     * Create sunCalc
     */
    async createIconColor() {
        this.log.info(`Create or update icon color!`);
        let common = {};
        common = {
            name: {
                en: "Chnage icon color",
                de: "Symbolfarbe ändern",
                ru: "Изменить цвет значка",
                pt: "Alterar cor do ícone",
                nl: "Verander pictogramkleur",
                fr: "Changer la couleur de l'icône",
                it: "Cambia colore icona",
                es: "Cambiar el color del icono",
                pl: "Zmień kolor ikony",
                uk: "Зміна кольору значка",
                "zh-cn": "更改图标颜色",
            },
            desc: "Chnage icon color",
            icon: "img/weather.png",
        };
        await this.createDataPoint(`iconcolor`, common, "device", null, null);
        common = {
            type: "string",
            role: "level.color.rgb",
            name: {
                en: "Color UV-Index 0",
                de: "Farbe UV-Index 0",
                ru: "Цветовой УФ-индекс 0",
                pt: "Índice UV de cor 0",
                nl: "Kleur UV-index 0",
                fr: "Indice UV couleur 0",
                it: "Indice UV colore 0",
                es: "Índice UV de color 0",
                pl: "Kolor Indeks UV 0",
                uk: "Кольоровий УФ-індекс 0",
                "zh-cn": "颜色 UV 指数 0",
            },
            desc: "Color UV-Index 0",
            read: true,
            write: true,
            def: "3ea72d",
        };
        await this.createDataPoint(`iconcolor.uv_index_0`, common, "state", null, null);
        common = {
            type: "string",
            role: "level.color.rgb",
            name: {
                en: "Color UV-Index 1",
                de: "Farbe UV-Index 1",
                ru: "Цветовой УФ-индекс 1",
                pt: "Índice UV de cor 1",
                nl: "Kleur UV-index 1",
                fr: "Indice UV couleur 1",
                it: "Indice UV colore 1",
                es: "Índice UV de color 1",
                pl: "Kolor Indeks UV 1",
                uk: "Кольоровий УФ-індекс 1",
                "zh-cn": "颜色 UV 指数 1",
            },
            desc: "Color UV-Index 1",
            read: true,
            write: true,
            def: "3ea72d",
        };
        await this.createDataPoint(`iconcolor.uv_index_1`, common, "state", null, null);
        common = {
            type: "string",
            role: "level.color.rgb",
            name: {
                en: "Color UV-Index 2",
                de: "Farbe UV-Index 2",
                ru: "Цветовой УФ-индекс 2",
                pt: "Índice UV de cor 2",
                nl: "Kleur UV-index 2",
                fr: "Indice UV couleur 2",
                it: "Indice UV colore 2",
                es: "Índice UV de color 2",
                pl: "Kolor Indeks UV 2",
                uk: "Кольоровий УФ-індекс 2",
                "zh-cn": "颜色 UV 指数 2",
            },
            desc: "Color UV-Index 2",
            read: true,
            write: true,
            def: "3ea72d",
        };
        await this.createDataPoint(`iconcolor.uv_index_2`, common, "state", null, null);
        common = {
            type: "string",
            role: "level.color.rgb",
            name: {
                en: "Color UV-Index 3",
                de: "Farbe UV-Index 3",
                ru: "Цветовой УФ-индекс 3",
                pt: "Índice UV de cor 3",
                nl: "Kleur UV-index 3",
                fr: "Indice UV couleur 3",
                it: "Indice UV colore 3",
                es: "Índice UV de color 3",
                pl: "Kolor Indeks UV 3",
                uk: "Кольоровий УФ-індекс 3",
                "zh-cn": "颜色 UV 指数 3",
            },
            desc: "Color UV-Index 3",
            read: true,
            write: true,
            def: "#fff300",
        };
        await this.createDataPoint(`iconcolor.uv_index_3`, common, "state", null, null);
        common = {
            type: "string",
            role: "level.color.rgb",
            name: {
                en: "Color UV-Index 4",
                de: "Farbe UV-Index 4",
                ru: "Цветовой УФ-индекс 4",
                pt: "Índice UV de cor 4",
                nl: "Kleur UV-index 4",
                fr: "Indice UV couleur 4",
                it: "Indice UV colore 4",
                es: "Índice UV de color 4",
                pl: "Kolor Indeks UV 4",
                uk: "Кольоровий УФ-індекс 4",
                "zh-cn": "颜色 UV 指数 4",
            },
            desc: "Color UV-Index 4",
            read: true,
            write: true,
            def: "#fff300",
        };
        await this.createDataPoint(`iconcolor.uv_index_4`, common, "state", null, null);
        common = {
            type: "string",
            role: "level.color.rgb",
            name: {
                en: "Color UV-Index 5",
                de: "Farbe UV-Index 5",
                ru: "Цветовой УФ-индекс 5",
                pt: "Índice UV de cor 5",
                nl: "Kleur UV-index 5",
                fr: "Indice UV couleur 5",
                it: "Indice UV colore 5",
                es: "Índice UV de color 5",
                pl: "Kolor Indeks UV 5",
                uk: "Кольоровий УФ-індекс 5",
                "zh-cn": "颜色 UV 指数 5",
            },
            desc: "Color UV-Index 5",
            read: true,
            write: true,
            def: "#fff300",
        };
        await this.createDataPoint(`iconcolor.uv_index_5`, common, "state", null, null);
        common = {
            type: "string",
            role: "level.color.rgb",
            name: {
                en: "Color UV-Index 6",
                de: "Farbe UV-Index 6",
                ru: "Цветовой УФ-индекс 6",
                pt: "Índice UV de cor 6",
                nl: "Kleur UV-index 6",
                fr: "Indice UV couleur 6",
                it: "Indice UV colore 6",
                es: "Índice UV de color 6",
                pl: "Kolor Indeks UV 6",
                uk: "Кольоровий УФ-індекс 6",
                "zh-cn": "颜色 UV 指数 6",
            },
            desc: "Color UV-Index 6",
            read: true,
            write: true,
            def: "#f18b00",
        };
        await this.createDataPoint(`iconcolor.uv_index_6`, common, "state", null, null);
        common = {
            type: "string",
            role: "level.color.rgb",
            name: {
                en: "Color UV-Index 7",
                de: "Farbe UV-Index 7",
                ru: "Цветовой УФ-индекс 7",
                pt: "Índice UV de cor 7",
                nl: "Kleur UV-index 7",
                fr: "Indice UV couleur 7",
                it: "Indice UV colore 7",
                es: "Índice UV de color 7",
                pl: "Kolor Indeks UV 7",
                uk: "Кольоровий УФ-індекс 7",
                "zh-cn": "颜色 UV 指数 7",
            },
            desc: "Color UV-Index 7",
            read: true,
            write: true,
            def: "#f18b00",
        };
        await this.createDataPoint(`iconcolor.uv_index_7`, common, "state", null, null);
        common = {
            type: "string",
            role: "level.color.rgb",
            name: {
                en: "Color UV-Index 8",
                de: "Farbe UV-Index 8",
                ru: "Цветовой УФ-индекс 8",
                pt: "Índice UV de cor 8",
                nl: "Kleur UV-index 8",
                fr: "Indice UV couleur 8",
                it: "Indice UV colore 8",
                es: "Índice UV de color 8",
                pl: "Kolor Indeks UV 8",
                uk: "Кольоровий УФ-індекс 8",
                "zh-cn": "颜色 UV 指数 8",
            },
            desc: "Color UV-Index 8",
            read: true,
            write: true,
            def: "#e53210",
        };
        await this.createDataPoint(`iconcolor.uv_index_8`, common, "state", null, null);
        common = {
            type: "string",
            role: "level.color.rgb",
            name: {
                en: "Color UV-Index 9",
                de: "Farbe UV-Index 9",
                ru: "Цветовой УФ-индекс 9",
                pt: "Índice UV de cor 9",
                nl: "Kleur UV-index 9",
                fr: "Indice UV couleur 9",
                it: "Indice UV colore 9",
                es: "Índice UV de color 9",
                pl: "Kolor Indeks UV 9",
                uk: "Кольоровий УФ-індекс 9",
                "zh-cn": "颜色 UV 指数 9",
            },
            desc: "Color UV-Index 9",
            read: true,
            write: true,
            def: "#e53210",
        };
        await this.createDataPoint(`iconcolor.uv_index_9`, common, "state", null, null);
        common = {
            type: "string",
            role: "level.color.rgb",
            name: {
                en: "Color UV-Index 10",
                de: "Farbe UV-Index 10",
                ru: "Цветовой УФ-индекс 10",
                pt: "Índice UV de cor 10",
                nl: "Kleur UV-index 10",
                fr: "Indice UV couleur 10",
                it: "Indice UV colore 10",
                es: "Índice UV de color 10",
                pl: "Kolor Indeks UV 10",
                uk: "Кольоровий УФ-індекс 10",
                "zh-cn": "颜色 UV 指数 10",
            },
            desc: "Color UV-Index 10",
            read: true,
            write: true,
            def: "#e53210",
        };
        await this.createDataPoint(`iconcolor.uv_index_10`, common, "state", null, null);
        common = {
            type: "string",
            role: "level.color.rgb",
            name: {
                en: "Color UV-Index 11",
                de: "Farbe UV-Index 11",
                ru: "Цветовой УФ-индекс 11",
                pt: "Índice UV de cor 11",
                nl: "Kleur UV-index 11",
                fr: "Indice UV couleur 11",
                it: "Indice UV colore 11",
                es: "Índice UV de color 11",
                pl: "Kolor Indeks UV 11",
                uk: "Кольоровий УФ-індекс 11",
                "zh-cn": "颜色 UV 指数 11",
            },
            desc: "Color UV-Index 11",
            read: true,
            write: true,
            def: "#b567a4",
        };
        await this.createDataPoint(`iconcolor.uv_index_11`, common, "state", null, null);
        common = {
            type: "string",
            role: "level.color.rgb",
            name: {
                en: "Background color",
                de: "Hintergrundfarbe",
                ru: "Цвет фона",
                pt: "Cor de fundo",
                nl: "Achtergrondkleur",
                fr: "Couleur d'arrière-plan",
                it: "Colore di sfondo",
                es: "Color de fondo",
                pl: "Kolor tła",
                uk: "Колір фону",
                "zh-cn": "背景颜色",
            },
            desc: "Background color",
            read: true,
            write: true,
            def: "#b567a4",
        };
        await this.createDataPoint(`iconcolor.uv_index_bg`, common, "state", null, null);
        common = {
            type: "string",
            role: "level.color.rgb",
            name: {
                en: "Description color",
                de: "Beschreibung Farbe",
                ru: "Описание цвета",
                pt: "Descrição cor",
                nl: "Beschrijving kleur",
                fr: "Description couleur",
                it: "Descrizione colore",
                es: "Descripción color",
                pl: "Opis koloru",
                uk: "Колір опису",
                "zh-cn": "描述颜色",
            },
            desc: "Description color",
            read: true,
            write: true,
            def: "#ffffff",
        };
        await this.createDataPoint(`iconcolor.uv_index_desc`, common, "state", null, null);
        common = {
            type: "string",
            role: "level.color.rgb",
            name: {
                en: "Sun",
                de: "Sonne",
                ru: "Солнце",
                pt: "Sol",
                nl: "Zon",
                fr: "Soleil",
                it: "Sole",
                es: "Sol",
                pl: "Słoneczny",
                uk: "сонце",
                "zh-cn": "太阳",
            },
            desc: "Sun",
            read: true,
            write: true,
            def: "#f6bc68",
        };
        await this.createDataPoint(`iconcolor.sun`, common, "state", null, null);
        common = {
            type: "string",
            role: "level.color.rgb",
            name: {
                en: "Sun filled",
                de: "Sonne gefüllt",
                ru: "Солнце наполнено",
                pt: "Recheado do sol",
                nl: "Zon gevuld",
                fr: "Soleil rempli",
                it: "Sole pieno",
                es: "Sol lleno",
                pl: "Wypełnione słońcem",
                uk: "Сонце заповнене",
                "zh-cn": "太阳满了",
            },
            desc: "Sun filled",
            read: true,
            write: true,
            def: "#f6bc68",
        };
        await this.createDataPoint(`iconcolor.sun_filled`, common, "state", null, null);
        common = {
            type: "string",
            role: "level.color.rgb",
            name: {
                en: "Fog",
                de: "Nebel",
                ru: "Туман",
                pt: "Névoa",
                nl: "Mist",
                fr: "Brouillard",
                it: "Nebbia",
                es: "Niebla",
                pl: "Mgła",
                uk: "Туман",
                "zh-cn": "多雾路段",
            },
            desc: "Fog",
            read: true,
            write: true,
            def: "#6f9ba4",
        };
        await this.createDataPoint(`iconcolor.fog`, common, "state", null, null);
        common = {
            type: "string",
            role: "level.color.rgb",
            name: {
                en: "Moon",
                de: "Mond",
                ru: "Луна",
                pt: "Lua",
                nl: "Maan",
                fr: "Lune",
                it: "Luna",
                es: "Luna",
                pl: "Księżyc",
                uk: "Місяці",
                "zh-cn": "月亮",
            },
            desc: "Moon",
            read: true,
            write: true,
            def: "#da4935",
        };
        await this.createDataPoint(`iconcolor.moon`, common, "state", null, null);
        common = {
            type: "string",
            role: "level.color.rgb",
            name: {
                en: "Moon filled",
                de: "Mond gefüllt",
                ru: "Луна заполнена",
                pt: "Lua cheia",
                nl: "Maan gevuld",
                fr: "Lune remplie",
                it: "Luna piena",
                es: "Luna llena",
                pl: "Księżyc wypełniony",
                uk: "Місяць заповнений",
                "zh-cn": "满月",
            },
            desc: "Moon filled",
            read: true,
            write: true,
            def: "#da4935",
        };
        await this.createDataPoint(`iconcolor.moon_filled`, common, "state", null, null);
        common = {
            type: "string",
            role: "level.color.rgb",
            name: {
                en: "Flash",
                de: "Blitz",
                ru: "Вспышка",
                pt: "Flash",
                nl: "Flash",
                fr: "Flash",
                it: "Flash",
                es: "Flash",
                pl: "Lampa błyskowa",
                uk: "Флеш",
                "zh-cn": "闪光灯",
            },
            desc: "Flash",
            read: true,
            write: true,
            def: "#f6bc68",
        };
        await this.createDataPoint(`iconcolor.flash`, common, "state", null, null);
        common = {
            type: "string",
            role: "level.color.rgb",
            name: {
                en: "Flash filled",
                de: "Blitz gefüllt",
                ru: "Вспышка заполнена",
                pt: "Flash preenchido",
                nl: "Flits gevuld",
                fr: "Flash rempli",
                it: "Flash riempito",
                es: "Flash lleno",
                pl: "Wypełniony błyskiem",
                uk: "Flash заповнений",
                "zh-cn": "闪光填充",
            },
            desc: "Flash filled",
            read: true,
            write: true,
            def: "#f6bc68",
        };
        await this.createDataPoint(`iconcolor.flash_filled`, common, "state", null, null);
        common = {
            type: "string",
            role: "level.color.rgb",
            name: {
                en: "Cloud",
                de: "Wolke",
                ru: "Облако",
                pt: "Nuvem",
                nl: "Wolk",
                fr: "Nuage",
                it: "Nuvola",
                es: "Nube",
                pl: "Chmura",
                uk: "Хмара",
                "zh-cn": "云",
            },
            desc: "Cloud",
            read: true,
            write: true,
            def: "#828487",
        };
        await this.createDataPoint(`iconcolor.cloud`, common, "state", null, null);
        common = {
            type: "string",
            role: "level.color.rgb",
            name: {
                en: "Cloud filled",
                de: "Wolke gefüllt",
                ru: "Облако заполнено",
                pt: "Nuvem cheia",
                nl: "Wolk gevuld",
                fr: "Nuage rempli",
                it: "Cloud riempito",
                es: "Nube llena",
                pl: "Chmura wypełniona",
                uk: "Хмари заповнені",
                "zh-cn": "云层满了",
            },
            desc: "Cloud filled",
            read: true,
            write: true,
            def: "#828487",
        };
        await this.createDataPoint(`iconcolor.cloud_filled`, common, "state", null, null);
        common = {
            type: "string",
            role: "level.color.rgb",
            name: {
                en: "Curving line",
                de: "Kurvenlinie",
                ru: "Изогнутая линия",
                pt: "Linha curva",
                nl: "Gebogen lijn",
                fr: "Curving line",
                it: "Curva",
                es: "Línea curva",
                pl: "Linia zakrzywiająca",
                uk: "Вигнута лінія",
                "zh-cn": "曲线",
            },
            desc: "Curving line",
            read: true,
            write: true,
            def: "#000000",
        };
        await this.createDataPoint(`iconcolor.lines`, common, "state", null, null);
        common = {
            type: "string",
            role: "level.color.rgb",
            name: {
                en: "Curving line filled",
                de: "Geschwungene Linie gefüllt",
                ru: "Изогнутая линия заполнена",
                pt: "Linha curva preenchida",
                nl: "Gebogen lijn gevuld",
                fr: "Ligne courbe remplie",
                it: "Linea curva riempita",
                es: "Línea curva rellena",
                pl: "Wypełniona linia krzywa",
                uk: "Вигнута лінія заповнена",
                "zh-cn": "曲线填充",
            },
            desc: "Curving line filled",
            read: true,
            write: true,
            def: "#000000",
        };
        await this.createDataPoint(`iconcolor.lines_filled`, common, "state", null, null);
        common = {
            type: "string",
            role: "level.color.rgb",
            name: {
                en: "Warning triangle",
                de: "Warndreieck",
                ru: "Треугольный знак аварийной остановки",
                pt: "Triângulo de advertência",
                nl: "Gevarendriehoek",
                fr: "Triangle de présignalisation",
                it: "Triangolo di avvertimento",
                es: "Triángulo de advertencia",
                pl: "Trójkąt ostrzegawczy",
                uk: "Трикутник попередження",
                "zh-cn": "警告三角牌",
            },
            desc: "Warning triangle",
            read: true,
            write: true,
            def: "#b52126",
        };
        await this.createDataPoint(`iconcolor.warning_triangle`, common, "state", null, null);
        common = {
            type: "string",
            role: "level.color.rgb",
            name: {
                en: "Warning triangle rand",
                de: "Warndreieck Rand",
                ru: "Треугольный знак аварийной остановки",
                pt: "Triângulo de advertência rand",
                nl: "Gevarendriehoek rand",
                fr: "Triangle de présignalisation rand",
                it: "Triangolo di avvertimento",
                es: "Triángulo de advertencia rand",
                pl: "Trójkąt ostrzegawczy",
                uk: "Попереджувальний трикутник ранд",
                "zh-cn": "警告三角形",
            },
            desc: "Warning triangle rand",
            read: true,
            write: true,
            def: "#F0F0F0",
        };
        await this.createDataPoint(`iconcolor.warning_triangle_rand`, common, "state", null, null);
        common = {
            type: "string",
            role: "level.color.rgb",
            name: {
                en: "Rain",
                de: "Regen",
                ru: "Дождь",
                pt: "Chuva",
                nl: "Regen",
                fr: "Pluie",
                it: "Piovere",
                es: "Lluvia",
                pl: "Deszcz",
                uk: "Дощ",
                "zh-cn": "雨",
            },
            desc: "Rain",
            read: true,
            write: true,
            def: "#66a1ba",
        };
        await this.createDataPoint(`iconcolor.rain`, common, "state", null, null);
        common = {
            type: "string",
            role: "level.color.rgb",
            name: {
                en: "Snow",
                de: "Schnee",
                ru: "Снег",
                pt: "Neve",
                nl: "Sneeuw",
                fr: "Neige",
                it: "Nevicare",
                es: "Nieve",
                pl: "Śnieg",
                uk: "сніг",
                "zh-cn": "雪",
            },
            desc: "Snow",
            read: true,
            write: true,
            def: "#66a1ba",
        };
        await this.createDataPoint(`iconcolor.snow`, common, "state", null, null);
        common = {
            type: "string",
            role: "level.color.rgb",
            name: {
                en: "Wind",
                de: "Wind",
                ru: "Ветер",
                pt: "Vento",
                nl: "Wind",
                fr: "Vent",
                it: "Vento vento",
                es: "Viento",
                pl: "Wiatr",
                uk: "Вітер",
                "zh-cn": "风",
            },
            desc: "Wind",
            read: true,
            write: true,
            def: "#000000",
        };
        await this.createDataPoint(`iconcolor.wind`, common, "state", null, null);
        common = {
            type: "string",
            role: "level.color.rgb",
            name: {
                en: "Unknown",
                de: "Unbekannt",
                ru: "Неизвестный",
                pt: "Desconhecido",
                nl: "Onbekend",
                fr: "Inconnu",
                it: "Sconosciuto",
                es: "Desconocida",
                pl: "Nieznany",
                uk: "Невідомо",
                "zh-cn": "未知",
            },
            desc: "Unknown",
            read: true,
            write: true,
            def: "#66a1ba",
        };
        await this.createDataPoint(`iconcolor.unknown`, common, "state", null, null);
        common = {
            type: "string",
            role: "level.color.rgb",
            name: {
                en: "Unknown filled",
                de: "Unbekannt gefüllt",
                ru: "Неизвестный заполнен",
                pt: "Desconhecido preenchido",
                nl: "Onbekend gevuld",
                fr: "Inconnu rempli",
                it: "Sconosciuto riempito",
                es: "Desconocido",
                pl: "Nieznane wypełnione",
                uk: "Невідоме заповнення",
                "zh-cn": "未知已填充",
            },
            desc: "Unknown filled",
            read: true,
            write: true,
            def: "#66a1ba",
        };
        await this.createDataPoint(`iconcolor.unknown_filled`, common, "state", null, null);
    },
    /**
     * Create objects states
     *
     * @param {object} val
     * @param {string} path
     */
    async createObjectsStates(val, path) {
        let common = {};
        if (val.includes("dew_point_2m")) {
            common = {
                type: "number",
                role: "value.temperature",
                name: {
                    en: "Dewpoint (2 m)",
                    de: "Taupunkt (2 m)",
                    ru: "точка росы (2 м)",
                    pt: "Orvalho (2 m)",
                    nl: "Dauwpunt (22 mm)",
                    fr: "Point de rosée (2 m)",
                    it: "Rugiada (2 m)",
                    es: "Punto de rocío (2 m)",
                    pl: "Punkt rosy (2 m)",
                    uk: "Точка роси (2 м)",
                    "zh-cn": "露点 (2 m)",
                },
                desc: "Dewpoint (2 m)",
                read: true,
                write: false,
                unit: this.config.temperaturUnit === "default" ? "°C" : "F",
                def: 0,
            };
            await this.createDataPoint(`${path}.dew_point_2m`, common, "state", 0, null);
        }
        if (val.includes("snow_depth")) {
            common = {
                type: "number",
                role: "value",
                name: {
                    en: "Snow depth on the ground",
                    de: "Schneehöhe am Boden",
                    ru: "Глубина снега на земле",
                    pt: "Pico de neve no chão",
                    nl: "Sneeuwhoogte op de grond",
                    fr: "Hauteur de neige au sol",
                    it: "Altezza neve al suolo",
                    es: "Nieve en el suelo",
                    pl: "Głębokość śniegu na ziemi",
                    uk: "Глибина снігу на землі",
                    "zh-cn": "地面积雪深度",
                },
                desc: "Snow depth on the ground",
                read: true,
                write: false,
                unit: "m",
                def: 0,
            };
            await this.createDataPoint(`${path}.snow_depth`, common, "state", 0, null);
        }
        if (val.includes("precipitation_probability")) {
            common = {
                type: "number",
                role: "value",
                name: {
                    en: "Precipitation probability",
                    de: "Niederschlagswahrscheinlichkeit",
                    ru: "Вероятность осадков",
                    pt: "Probabilidade de precipitação",
                    nl: "Neerslagwaarschijnlijkheid",
                    fr: "Probabilité de précipitations",
                    it: "Probabilità di precipitazione",
                    es: "Probabilidad de precipitación",
                    pl: "Prawdopodobieństwo opadów",
                    uk: "Ймовірність опадів",
                    "zh-cn": "降水概率",
                },
                desc: "Precipitation probability",
                read: true,
                write: false,
                unit: "m",
                def: 0,
            };
            await this.createDataPoint(`${path}.precipitation_probability`, common, "state", 0, null);
        }
        if (val.includes("visibility")) {
            common = {
                type: "number",
                role: "value",
                name: {
                    en: "Viewing distance in meters",
                    de: "Betrachtungsabstand in Metern",
                    ru: "Расстояние просмотра в метрах",
                    pt: "Distância de visualização em metros",
                    nl: "Kijkafstand in meters",
                    fr: "Distance de visualisation en mètres",
                    it: "Distanza di visualizzazione in metri",
                    es: "Distancia de visualización en metros",
                    pl: "Odległość oglądania w metrach",
                    uk: "Відстань перегляду в метрах",
                    "zh-cn": "观看距离（米）",
                },
                desc: "Viewing distance in meters",
                read: true,
                write: false,
                unit: "m",
                def: 0,
            };
            await this.createDataPoint(`${path}.visibility`, common, "state", 0, null);
        }
        if (val.includes("cloud_cover_high")) {
            common = {
                type: "number",
                role: "value",
                name: {
                    en: "Cloud cover high",
                    de: "Wolkendecke hoch",
                    ru: "Облачность высокая",
                    pt: "Cobertura de nuvens alta",
                    nl: "Hoge bewolking",
                    fr: "Couverture nuageuse élevée",
                    it: "Copertura nuvolosa alta",
                    es: "Alta cobertura de nubes",
                    pl: "Wysokie zachmurzenie",
                    uk: "Хмарність висока",
                    "zh-cn": "云量较高",
                },
                desc: "Cloud cover high",
                read: true,
                write: false,
                unit: "%",
                def: 0,
            };
            await this.createDataPoint(`${path}.cloud_cover_high`, common, "state", 0, null);
        }
        if (val.includes("cloud_cover_mean")) {
            common = {
                type: "number",
                role: "value",
                name: {
                    en: "Mean Cloud cover",
                    de: "Mittlere Wolkendecke",
                    ru: "Средняя облачность",
                    pt: "Cobertura de nuvens média",
                    nl: "Gemiddelde bewolking",
                    fr: "Couverture nuageuse moyenne",
                    it: "Copertura nuvolosa media",
                    es: "Cobertura nubosa media",
                    pl: "Średnie zachmurzenie",
                    uk: "Середня хмарність",
                    "zh-cn": "平均云量",
                },
                desc: "Mean Cloud cover",
                read: true,
                write: false,
                unit: "%",
                def: 0,
            };
            await this.createDataPoint(`${path}.cloud_cover_mean`, common, "state", 0, null);
        }
        if (val.includes("relative_humidity_2m_mean")) {
            common = {
                type: "number",
                role: "value",
                name: {
                    en: "Mean Relative Humidity (2 m)",
                    de: "Mittlere relative Luftfeuchtigkeit (2 m)",
                    ru: "Средняя относительная влажность (2 м)",
                    pt: "Humidade relativa média (2 m)",
                    nl: "Gemiddelde relatieve vochtigheid (2 m)",
                    fr: "Humidité relative moyenne (2 m)",
                    it: "Umidità relativa media (2 m)",
                    es: "Humedad relativa media (2 m)",
                    pl: "Średnia wilgotność względna (2 m)",
                    uk: "Середня відносна вологість (2 м)",
                    "zh-cn": "平均相对湿度（2米）",
                },
                desc: "Mean Relative Humidity (2 m)",
                read: true,
                write: false,
                unit: "%",
                def: 0,
            };
            await this.createDataPoint(`${path}.relative_humidity_2m_mean`, common, "state", 0, null);
        }
        if (val.includes("cloud_cover_mid")) {
            common = {
                type: "number",
                role: "value",
                name: {
                    en: "Cloud cover mid",
                    de: "Bewölkung mittig",
                    ru: "Облачность средняя",
                    pt: "Cobertura de nuvens no meio",
                    nl: "Bewolking midden",
                    fr: "Couverture nuageuse au milieu",
                    it: "Copertura nuvolosa media",
                    es: "Cobertura nubosa a mediados de",
                    pl: "Zachmurzenie średnie",
                    uk: "Середня хмарність",
                    "zh-cn": "云量中等",
                },
                desc: "Cloud cover mid",
                read: true,
                write: false,
                unit: "%",
                def: 0,
            };
            await this.createDataPoint(`${path}.cloud_cover_mid`, common, "state", 0, null);
        }
        if (val.includes("cloud_cover_low")) {
            common = {
                type: "number",
                role: "value",
                name: {
                    en: "Cloud cover low",
                    de: "Wolkendecke niedrig",
                    ru: "Низкая облачность",
                    pt: "Cobertura de nuvens baixa",
                    nl: "Lage bewolking",
                    fr: "Couverture nuageuse faible",
                    it: "Copertura nuvolosa bassa",
                    es: "Baja cobertura de nubes",
                    pl: "Niskie zachmurzenie",
                    uk: "Хмарність низька",
                    "zh-cn": "云量低",
                },
                desc: "Cloud cover low",
                read: true,
                write: false,
                unit: "%",
                def: 0,
            };
            await this.createDataPoint(`${path}.cloud_cover_low`, common, "state", 0, null);
        }
        if (val.includes("cloud_cover")) {
            common = {
                type: "number",
                role: "value",
                name: {
                    en: "Cloud cover",
                    de: "Bewölkung",
                    ru: "Облачный покров",
                    pt: "Cobertura de nuvens",
                    nl: "Bewolking",
                    fr: "Couverture nuageuse",
                    it: "Copertura nuvolosa",
                    es: "Cobertura de nubes",
                    pl: "Pokrywa chmur",
                    uk: "Хмарність",
                    "zh-cn": "云量",
                },
                desc: "Cloud cover",
                read: true,
                write: false,
                unit: "%",
                def: 0,
            };
            await this.createDataPoint(`${path}.cloud_cover`, common, "state", 0, null);
        }
        if (val.includes("uv_index_clear_sky_max")) {
            common = {
                type: "number",
                role: "value",
                name: {
                    en: "Daily maximum in UV Index starting from 0 on assumes cloud free conditions",
                    de: "Tägliches Maximum des UV-Index ab 0 bei wolkenlosen Bedingungen",
                    ru: "Дневной максимум УФ-индекса начинается с 0 при условии отсутствия облаков",
                    pt: "Máximo diário no Índice UV a partir de 0 em diante pressupõe condições sem nuvens",
                    nl: "Dagelijks maximum in UV-index vanaf 0, uitgaande van wolkenvrije omstandigheden",
                    fr: "Le maximum quotidien de l'indice UV à partir de 0 suppose des conditions sans nuages",
                    it: "Massimo giornaliero nell'indice UV a partire da 0 in poi presuppone condizioni senza nuvole",
                    es: "El máximo diario del índice UV a partir de 0 asume condiciones sin nubes.",
                    pl: "Maksimum dzienne indeksu UV zaczynające się od 0 przy założeniu braku chmur",
                    uk: "Денний максимум УФ-індексу, починаючи з 0, передбачає відсутність хмар",
                    "zh-cn": "每日紫外线指数最大值从 0 开始，假设无云条件",
                },
                desc: "Daily maximum in UV Index starting from 0 on assumes cloud free conditions",
                read: true,
                write: false,
                def: 0,
            };
            await this.createDataPoint(`${path}.uv_index_clear_sky_max`, common, "state", 0, null);
            common = {
                type: "string",
                role: "state",
                name: {
                    en: "UV Icon Path",
                    de: "UV-Symbolpfad",
                    ru: "Путь к иконке УФ",
                    pt: "Caminho do ícone UV",
                    nl: "UV-pictogrampad",
                    fr: "Chemin de l'icône UV",
                    it: "Percorso icona UV",
                    es: "Ruta del icono UV",
                    pl: "Ścieżka ikony UV",
                    uk: "Шлях піктограми УФ",
                    "zh-cn": "UV 图标路径",
                },
                desc: "UV Icon Path",
                read: true,
                write: false,
                def: "",
            };
            await this.createDataPoint(`${path}.uv_index_clear_sky_max_path`, common, "state", null, null);
            common = {
                type: "string",
                role: "state",
                name: {
                    en: "UV own SVG icon",
                    de: "UV eigenes SVG-Symbol",
                    ru: "Собственный значок SVG UV",
                    pt: "Ícone SVG próprio UV",
                    nl: "UV eigen SVG-pictogram",
                    fr: "Icône SVG propre à UV",
                    it: "Icona SVG UV propria",
                    es: "Icono SVG propio de UV",
                    pl: "Własna ikona SVG UV",
                    uk: "Власна піктограма UV SVG",
                    "zh-cn": "UV 自己的 SVG 图标",
                },
                desc: "UV own SVG icon",
                read: true,
                write: false,
                def: "",
            };
            await this.createDataPoint(`${path}.uv_index_clear_sky_max_own`, common, "state", null, null);
        }
        if (val.includes("uv_index_max")) {
            common = {
                type: "number",
                role: "value",
                name: {
                    en: "Daily maximum in UV Index starting from 0",
                    de: "Tagesmaximum im UV-Index ab 0",
                    ru: "Дневной максимум УФ-индекса от 0",
                    pt: "Máximo diário no Índice UV a partir de 0",
                    nl: "Dagelijks maximum in UV-index vanaf 0",
                    fr: "Maximum quotidien de l'indice UV à partir de 0",
                    it: "Massima giornaliera nell'indice UV a partire da 0",
                    es: "Máximo diario en el índice UV a partir de 0",
                    pl: "Maksimum dzienne w indeksie UV zaczynające się od 0",
                    uk: "Денний максимум в УФ-індексі, починаючи з 0",
                    "zh-cn": "每日最高紫外线指数从 0 开始",
                },
                desc: "Daily maximum in UV Index starting from 0",
                read: true,
                write: false,
                def: 0,
            };
            await this.createDataPoint(`${path}.uv_index_max`, common, "state", 0, null);
            common = {
                type: "string",
                role: "state",
                name: {
                    en: "UV Icon Path",
                    de: "UV-Symbolpfad",
                    ru: "Путь к иконке УФ",
                    pt: "Caminho do ícone UV",
                    nl: "UV-pictogrampad",
                    fr: "Chemin de l'icône UV",
                    it: "Percorso icona UV",
                    es: "Ruta del icono UV",
                    pl: "Ścieżka ikony UV",
                    uk: "Шлях піктограми УФ",
                    "zh-cn": "UV 图标路径",
                },
                desc: "UV Icon Path",
                read: true,
                write: false,
                def: "",
            };
            await this.createDataPoint(`${path}.uv_index_max_path`, common, "state", null, null);
            common = {
                type: "string",
                role: "state",
                name: {
                    en: "UV own SVG icon",
                    de: "UV eigenes SVG-Symbol",
                    ru: "Собственный значок SVG UV",
                    pt: "Ícone SVG próprio UV",
                    nl: "UV eigen SVG-pictogram",
                    fr: "Icône SVG propre à UV",
                    it: "Icona SVG UV propria",
                    es: "Icono SVG propio de UV",
                    pl: "Własna ikona SVG UV",
                    uk: "Власна піктограма UV SVG",
                    "zh-cn": "UV 自己的 SVG 图标",
                },
                desc: "UV own SVG icon",
                read: true,
                write: false,
                def: "",
            };
            await this.createDataPoint(`${path}.uv_index_max_own`, common, "state", null, null);
        }
        if (val.includes("freezing_level_height")) {
            common = {
                type: "number",
                role: "value",
                name: {
                    en: "Freezing Level Height",
                    de: "Höhe der Gefriergrenze",
                    ru: "Высота уровня замерзания",
                    pt: "Altura do nível de congelamento",
                    nl: "Vriesniveau Hoogte",
                    fr: "Hauteur du niveau de congélation",
                    it: "Altezza del livello di congelamento",
                    es: "Altura del nivel de congelación",
                    pl: "Wysokość poziomu zamarzania",
                    uk: "Висота рівня замерзання",
                    "zh-cn": "冻结高度",
                },
                desc: "Freezing Level Height",
                read: true,
                write: false,
                unit: "m",
                def: 0,
            };
            await this.createDataPoint(`${path}.freezing_level_height`, common, "state", 0, null);
        }
        if (val.includes("cape")) {
            common = {
                type: "number",
                role: "value",
                name: {
                    en: "CAPE",
                    de: "KAP",
                    ru: "МЫС",
                    pt: "CABO",
                    nl: "KAAP",
                    fr: "CAP",
                    it: "CAPO",
                    es: "CABO",
                    pl: "PELERYNA",
                    uk: "НАКИДА",
                    "zh-cn": "岬",
                },
                desc: "CAPE",
                read: true,
                write: false,
                unit: "J/kg",
                def: 0,
            };
            await this.createDataPoint(`${path}.cape`, common, "state", 0, null);
        }
        if (val.includes("lightning_potential")) {
            common = {
                type: "number",
                role: "value",
                name: {
                    en: "Lightning Potential Index LPI",
                    de: "Blitzpotenzialindex LPI",
                    ru: "Индекс потенциала молнии LPI",
                    pt: "Índice de Potencial de Raios LPI",
                    nl: "Bliksempotentieelindex LPI",
                    fr: "Indice de potentiel de foudre LPI",
                    it: "Indice di potenziale di fulmine LPI",
                    es: "Índice de potencial de rayos (LPI)",
                    pl: "Wskaźnik Potencjału Błyskawicowego LPI",
                    uk: "Індекс потенціалу блискавки LPI",
                    "zh-cn": "雷电潜力指数 LPI",
                },
                desc: "Lightning Potential Index LPI",
                read: true,
                write: false,
                unit: "J/kg",
                def: 0,
            };
            await this.createDataPoint(`${path}.lightning_potential`, common, "state", 0, null);
        }
        if (val.includes("snowfall_height")) {
            common = {
                type: "number",
                role: "value",
                name: {
                    en: "Snowfall Height",
                    de: "Schneefallhöhe",
                    ru: "Высота снегопада",
                    pt: "Altura da queda de neve",
                    nl: "Sneeuwval Hoogte",
                    fr: "Hauteur des chutes de neige",
                    it: "Altezza della nevicata",
                    es: "Altura de las nevadas",
                    pl: "Wysokość opadów śniegu",
                    uk: "Висота снігопаду",
                    "zh-cn": "降雪高度",
                },
                desc: "Snowfall Height",
                read: true,
                write: false,
                unit: "m",
                def: 0,
            };
            await this.createDataPoint(`${path}.snowfall_height`, common, "state", 0, null);
        }
        if (val.includes("is_day")) {
            common = {
                type: "boolean",
                role: "state",
                name: {
                    en: "is Day",
                    de: "ist Tag",
                    ru: "это день",
                    pt: "é dia",
                    nl: "is dag",
                    fr: "c'est le jour",
                    it: "è giorno",
                    es: "es día",
                    pl: "jest dzień",
                    uk: "є День",
                    "zh-cn": "是日",
                },
                desc: "is Day",
                read: true,
                write: false,
                def: false,
            };
            await this.createDataPoint(`${path}.is_day`, common, "state", false, null);
        }
        if (val.includes("relative_humidity_2m")) {
            common = {
                type: "number",
                role: "value",
                name: {
                    en: "Relative Humidity (2 m)",
                    de: "Relative Luftfeuchtigkeit (2 m)",
                    ru: "Относительная влажность (2 м)",
                    pt: "Humidade relativa (2 m)",
                    nl: "Relatieve vochtigheid (2 m)",
                    fr: "Humidité relative (2 m)",
                    it: "Umidità relativa (2 m)",
                    es: "Humedad relativa (2 m)",
                    pl: "Wilgotność względna (2 m)",
                    uk: "Відносна вологість (2 м)",
                    "zh-cn": "相对湿度（2米）",
                },
                desc: "Relative Humidity (2 m)",
                read: true,
                write: false,
                unit: "%",
                def: 0,
            };
            await this.createDataPoint(`${path}.relative_humidity_2m`, common, "state", 0, null);
        }
        if (val.includes("temperature_2m")) {
            common = {
                type: "number",
                role: "value.temperature",
                name: {
                    en: "Temperature (2 m)",
                    de: "Temperatur (2 m)",
                    ru: "Температура (2 м)",
                    pt: "Temperatura (2 m)",
                    nl: "Temperatuur (2 m)",
                    fr: "Température (2 m)",
                    it: "Temperatura (2 m)",
                    es: "Temperatura (2 m)",
                    pl: "Temperatura (2m)",
                    uk: "Температура (2 м)",
                    "zh-cn": "温度（2米）",
                },
                desc: "Temperature (2 m)",
                read: true,
                write: false,
                unit: this.config.temperaturUnit === "default" ? "°C" : "F",
                def: 0,
            };
            await this.createDataPoint(`${path}.temperature_2m`, common, "state", 0, null);
        }
        if (val.includes("temperature_2m_mean")) {
            common = {
                type: "number",
                role: "value.temperature",
                name: {
                    en: "Mean Temperature (2 m)",
                    de: "Mittlere Temperatur (2 m)",
                    ru: "Средняя температура (2 м)",
                    pt: "Temperatura média (2 m)",
                    nl: "Gemiddelde temperatuur (2 m)",
                    fr: "Température moyenne (2 m)",
                    it: "Temperatura media (2 m)",
                    es: "Temperatura media (2 m)",
                    pl: "Średnia temperatura (2 m)",
                    uk: "Середня температура (2 м)",
                    "zh-cn": "平均气温（2米）",
                },
                desc: "Mean Temperature (2 m)",
                read: true,
                write: false,
                unit: this.config.temperaturUnit === "default" ? "°C" : "F",
                def: 0,
            };
            await this.createDataPoint(`${path}.temperature_2m_mean`, common, "state", 0, null);
        }
        if (val.includes("temperature_80m")) {
            common = {
                type: "number",
                role: "value.temperature",
                name: {
                    en: "Temperature (80 m)",
                    de: "Temperatur (80 m)",
                    ru: "Температура (80 м)",
                    pt: "Temperatura (80 m)",
                    nl: "Temperatuur (80 m)",
                    fr: "Température (80 m)",
                    it: "Temperatura (80 m)",
                    es: "Temperatura (80 m)",
                    pl: "Temperatura (80m)",
                    uk: "Температура (80 м)",
                    "zh-cn": "温度（80米）",
                },
                desc: "Temperature (80 m)",
                read: true,
                write: false,
                unit: this.config.temperaturUnit === "default" ? "°C" : "F",
                def: 0,
            };
            await this.createDataPoint(`${path}.temperature_80m`, common, "state", 0, null);
        }
        if (val.includes("temperature_120m")) {
            common = {
                type: "number",
                role: "value.temperature",
                name: {
                    en: "Temperature (120 m)",
                    de: "Temperatur (120 m)",
                    ru: "Температура (120 м)",
                    pt: "Temperatura (120 m)",
                    nl: "Temperatuur (120 m)",
                    fr: "Température (120 m)",
                    it: "Temperatura (120 m)",
                    es: "Temperatura (120 m)",
                    pl: "Temperatura (120 m)",
                    uk: "Температура (120 м)",
                    "zh-cn": "温度（120米）",
                },
                desc: "Temperature (120 m)",
                read: true,
                write: false,
                unit: this.config.temperaturUnit === "default" ? "°C" : "F",
                def: 0,
            };
            await this.createDataPoint(`${path}.temperature_120m`, common, "state", 0, null);
        }
        if (val.includes("temperature_180m")) {
            common = {
                type: "number",
                role: "value.temperature",
                name: {
                    en: "Temperature (180 m)",
                    de: "Temperatur (180 m)",
                    ru: "Температура (180 м)",
                    pt: "Temperatura (180 m)",
                    nl: "Temperatuur (180 m)",
                    fr: "Température (180 m)",
                    it: "Temperatura (180 m)",
                    es: "Temperatura (180 m)",
                    pl: "Temperatura (180m)",
                    uk: "Температура (180 м)",
                    "zh-cn": "温度（180米）",
                },
                desc: "Temperature (180 m)",
                read: true,
                write: false,
                unit: this.config.temperaturUnit === "default" ? "°C" : "F",
                def: 0,
            };
            await this.createDataPoint(`${path}.temperature_180m`, common, "state", 0, null);
        }
        if (val.includes("soil_temperature_0cm")) {
            common = {
                type: "number",
                role: "value.temperature",
                name: {
                    en: "Soil Temperature (0 cm)",
                    de: "Bodentemperatur (0 cm)",
                    ru: "Температура почвы (0 см)",
                    pt: "Temperatura do solo (0 cm)",
                    nl: "Bodemtemperatuur (0 cm)",
                    fr: "Température du sol (0 cm)",
                    it: "Temperatura del suolo (0 cm)",
                    es: "Temperatura del suelo (0 cm)",
                    pl: "Temperatura gleby (0 cm)",
                    uk: "Температура грунту (0 см)",
                    "zh-cn": "土壤温度（0厘米）",
                },
                desc: "Soil Temperature (0 cm)",
                read: true,
                write: false,
                unit: this.config.temperaturUnit === "default" ? "°C" : "F",
                def: 0,
            };
            await this.createDataPoint(`${path}.soil_temperature_0cm`, common, "state", 0, null);
        }
        if (val.includes("soil_temperature_6cm")) {
            common = {
                type: "number",
                role: "value.temperature",
                name: {
                    en: "Soil Temperature (6 cm)",
                    de: "Bodentemperatur (6 cm)",
                    ru: "Температура почвы (6 см)",
                    pt: "Temperatura do solo (6 cm)",
                    nl: "Bodemtemperatuur (6 cm)",
                    fr: "Température du sol (6 cm)",
                    it: "Temperatura del suolo (6 cm)",
                    es: "Temperatura del suelo (6 cm)",
                    pl: "Temperatura gleby (6 cm)",
                    uk: "Температура грунту (6 см)",
                    "zh-cn": "土壤温度（6厘米）",
                },
                desc: "Soil Temperature (6 cm)",
                read: true,
                write: false,
                unit: this.config.temperaturUnit === "default" ? "°C" : "F",
                def: 0,
            };
            await this.createDataPoint(`${path}.soil_temperature_6cm`, common, "state", 0, null);
        }
        if (val.includes("soil_temperature_18cm")) {
            common = {
                type: "number",
                role: "value.temperature",
                name: {
                    en: "Soil Temperature (18 cm)",
                    de: "Bodentemperatur (18 cm)",
                    ru: "Температура почвы (18 см)",
                    pt: "Temperatura do solo (18 cm)",
                    nl: "Bodemtemperatuur (18 cm)",
                    fr: "Température du sol (18 cm)",
                    it: "Temperatura del suolo (18 cm)",
                    es: "Temperatura del suelo (18 cm)",
                    pl: "Temperatura gleby (18 cm)",
                    uk: "Температура грунту (18 см)",
                    "zh-cn": "土壤温度（18厘米）",
                },
                desc: "Soil Temperature (18 cm)",
                read: true,
                write: false,
                unit: this.config.temperaturUnit === "default" ? "°C" : "F",
                def: 0,
            };
            await this.createDataPoint(`${path}.soil_temperature_18cm`, common, "state", 0, null);
        }
        if (val.includes("soil_temperature_54cm")) {
            common = {
                type: "number",
                role: "value.temperature",
                name: {
                    en: "Soil Temperature (54 cm)",
                    de: "Bodentemperatur (54 cm)",
                    ru: "Температура почвы (54 см)",
                    pt: "Temperatura do solo (54 cm)",
                    nl: "Bodemtemperatuur (54 cm)",
                    fr: "Température du sol (54 cm)",
                    it: "Temperatura del suolo (54 cm)",
                    es: "Temperatura del suelo (54 cm)",
                    pl: "Temperatura gleby (54 cm)",
                    uk: "Температура грунту (54 см)",
                    "zh-cn": "土壤温度（54厘米）",
                },
                desc: "Soil Temperature (54 cm)",
                read: true,
                write: false,
                unit: this.config.temperaturUnit === "default" ? "°C" : "F",
                def: 0,
            };
            await this.createDataPoint(`${path}.soil_temperature_54cm`, common, "state", 0, null);
        }
        if (val.includes("soil_moisture_0_to_1cm")) {
            common = {
                type: "number",
                role: "value.temperature",
                name: {
                    en: "Soil Moisture (0-1 cm)",
                    de: "Bodenfeuchtigkeit (0-1 cm)",
                    ru: "Влажность почвы (0-1 см)",
                    pt: "Umidade do solo (0-1 cm)",
                    nl: "Bodemvochtigheid (0-1 cm)",
                    fr: "Humidité du sol (0-1 cm)",
                    it: "Umidità del terreno (0-1 cm)",
                    es: "Humedad del suelo (0-1 cm)",
                    pl: "Wilgotność gleby (0-1 cm)",
                    uk: "Вологість ґрунту (0-1 см)",
                    "zh-cn": "土壤湿度（0-1厘米）",
                },
                desc: "Soil Moisture (0-1 cm)",
                read: true,
                write: false,
                unit: "m³/m³",
                def: 0,
            };
            await this.createDataPoint(`${path}.soil_moisture_0_to_1cm`, common, "state", 0, null);
        }
        if (val.includes("soil_moisture_1_to_3cm")) {
            common = {
                type: "number",
                role: "value.temperature",
                name: {
                    en: "Soil Moisture (1-3 cm)",
                    de: "Bodenfeuchtigkeit (1-3 cm)",
                    ru: "Влажность почвы (1-3 см)",
                    pt: "Umidade do solo (1-3 cm)",
                    nl: "Bodemvochtigheid (1-3 cm)",
                    fr: "Humidité du sol (1-3 cm)",
                    it: "Umidità del terreno (1-3 cm)",
                    es: "Humedad del suelo (1-3 cm)",
                    pl: "Wilgotność gleby (1-3 cm)",
                    uk: "Вологість ґрунту (1-3 см)",
                    "zh-cn": "土壤湿度（1-3厘米）",
                },
                desc: "Soil Moisture (1-3 cm)",
                read: true,
                write: false,
                unit: "m³/m³",
                def: 0,
            };
            await this.createDataPoint(`${path}.soil_moisture_1_to_3cm`, common, "state", 0, null);
        }
        if (val.includes("soil_moisture_3_to_9cm")) {
            common = {
                type: "number",
                role: "value.temperature",
                name: {
                    en: "Soil Moisture (3-9 cm)",
                    de: "Bodenfeuchtigkeit (3-9 cm)",
                    ru: "Влажность почвы (3-9 см)",
                    pt: "Umidade do solo (3-9 cm)",
                    nl: "Bodemvochtigheid (3-9 cm)",
                    fr: "Humidité du sol (3-9 cm)",
                    it: "Umidità del terreno (3-9 cm)",
                    es: "Humedad del suelo (3-9 cm)",
                    pl: "Wilgotność gleby (3-9 cm)",
                    uk: "Вологість ґрунту (3-9 см)",
                    "zh-cn": "土壤湿度（3-9厘米）",
                },
                desc: "Soil Moisture (3-9 cm)",
                read: true,
                write: false,
                unit: "m³/m³",
                def: 0,
            };
            await this.createDataPoint(`${path}.soil_moisture_3_to_9cm`, common, "state", 0, null);
        }
        if (val.includes("soil_moisture_9_to_27cm")) {
            common = {
                type: "number",
                role: "value.temperature",
                name: {
                    en: "Soil Moisture (9-27 cm)",
                    de: "Bodenfeuchtigkeit (9-27 cm)",
                    ru: "Влажность почвы (9-27 см)",
                    pt: "Umidade do solo (9-27 cm)",
                    nl: "Bodemvochtigheid (9-27 cm)",
                    fr: "Humidité du sol (9-27 cm)",
                    it: "Umidità del terreno (9-27 cm)",
                    es: "Humedad del suelo (9-27 cm)",
                    pl: "Wilgotność gleby (9-27 cm)",
                    uk: "Вологість ґрунту (9-27 см)",
                    "zh-cn": "土壤湿度（9-27厘米）",
                },
                desc: "Soil Moisture (9-27 cm)",
                read: true,
                write: false,
                unit: "m³/m³",
                def: 0,
            };
            await this.createDataPoint(`${path}.soil_moisture_9_to_27cm`, common, "state", 0, null);
        }
        if (val.includes("soil_moisture_27_to_81cm")) {
            common = {
                type: "number",
                role: "value.temperature",
                name: {
                    en: "Soil Moisture (27-81 cm)",
                    de: "Bodenfeuchtigkeit (27-81 cm)",
                    ru: "Влажность почвы (27-81 см)",
                    pt: "Umidade do solo (27-81 cm)",
                    nl: "Bodemvochtigheid (27-81 cm)",
                    fr: "Humidité du sol (27-81 cm)",
                    it: "Umidità del terreno (27-81 cm)",
                    es: "Humedad del suelo (27-81 cm)",
                    pl: "Wilgotność gleby (27-81 cm)",
                    uk: "Вологість ґрунту (27-81 см)",
                    "zh-cn": "土壤湿度（27-81厘米）",
                },
                desc: "Soil Moisture (27-81 cm)",
                read: true,
                write: false,
                unit: "m³/m³",
                def: 0,
            };
            await this.createDataPoint(`${path}.soil_moisture_27_to_81cm`, common, "state", 0, null);
        }
        if (val.includes("apparent_temperature")) {
            common = {
                type: "number",
                role: "value.temperature",
                name: {
                    en: "Apparent Temperature",
                    de: "Gefühlte Temperatur",
                    ru: "Кажущаяся температура",
                    pt: "Temperatura Aparente",
                    nl: "Schijnbare temperatuur",
                    fr: "Température apparente",
                    it: "Temperatura apparente",
                    es: "Temperatura aparente",
                    pl: "Temperatura pozorna",
                    uk: "Видима температура",
                    "zh-cn": "表观温度",
                },
                desc: "Apparent Temperature",
                read: true,
                write: false,
                unit: this.config.temperaturUnit === "default" ? "°C" : "F",
                def: 0,
            };
            await this.createDataPoint(`${path}.apparent_temperature`, common, "state", 0, null);
        }
        if (val.includes("apparent_temperature_min")) {
            common = {
                type: "number",
                role: "value.temperature",
                name: {
                    en: "Minimum Apparent Temperature (2 m)",
                    de: "Minimale gefühlte Temperatur (2 m)",
                    ru: "Минимальная видимая температура (2 м)",
                    pt: "Temperatura Mínima Aparente (2 m)",
                    nl: "Minimale schijnbare temperatuur (2 m)",
                    fr: "Température apparente minimale (2 m)",
                    it: "Temperatura minima apparente (2 m)",
                    es: "Temperatura mínima aparente (2 m)",
                    pl: "Minimalna temperatura pozorna (2 m)",
                    uk: "Мінімальна видима температура (2 м)",
                    "zh-cn": "最低表观温度（2米）",
                },
                desc: "Minimum Apparent Temperature (2 m)",
                read: true,
                write: false,
                unit: this.config.temperaturUnit === "default" ? "°C" : "F",
                def: 0,
            };
            await this.createDataPoint(`${path}.apparent_temperature_min`, common, "state", 0, null);
        }
        if (val.includes("apparent_temperature_max")) {
            common = {
                type: "number",
                role: "value.temperature",
                name: {
                    en: "Maximum Apparent Temperature (2 m)",
                    de: "Maximale gefühlte Temperatur (2 m)",
                    ru: "Максимальная кажущаяся температура (2 м)",
                    pt: "Temperatura Aparente Máxima (2 m)",
                    nl: "Maximale schijnbare temperatuur (2 m)",
                    fr: "Température apparente maximale (2 m)",
                    it: "Temperatura apparente massima (2 m)",
                    es: "Temperatura máxima aparente (2 m)",
                    pl: "Maksymalna temperatura pozorna (2 m)",
                    uk: "Максимальна видима температура (2 м)",
                    "zh-cn": "最大表观温度（2米）",
                },
                desc: "Maximum Apparent Temperature (2 m)",
                read: true,
                write: false,
                unit: this.config.temperaturUnit === "default" ? "°C" : "F",
                def: 0,
            };
            await this.createDataPoint(`${path}.apparent_temperature_max`, common, "state", 0, null);
        }
        if (val.includes("temperature_2m_min")) {
            common = {
                type: "number",
                role: "value.temperature",
                name: {
                    en: "Minimum Temperature (2 m)",
                    de: "Minimale Temperatur (2 m)",
                    ru: "Минимальная температура (2 м)",
                    pt: "Temperatura mínima (2 m)",
                    nl: "Minimale temperatuur (2 m)",
                    fr: "Température minimale (2 m)",
                    it: "Temperatura minima (2 m)",
                    es: "Temperatura mínima (2 m)",
                    pl: "Minimalna temperatura (2 m)",
                    uk: "Мінімальна температура (2 м)",
                    "zh-cn": "最低温度（2 米）",
                },
                desc: "Minimum Temperature (2 m)",
                read: true,
                write: false,
                unit: this.config.temperaturUnit === "default" ? "°C" : "F",
                def: 0,
            };
            await this.createDataPoint(`${path}.temperature_2m_min`, common, "state", 0, null);
        }
        if (val.includes("temperature_2m_max")) {
            common = {
                type: "number",
                role: "value.temperature",
                name: {
                    en: "Maximum Temperature (2 m)",
                    de: "Maximale Temperatur (2 m)",
                    ru: "Максимальная температура (2 м)",
                    pt: "Temperatura Máxima (2 m)",
                    nl: "Maximale temperatuur (2 m)",
                    fr: "Température maximale (2 m)",
                    it: "Temperatura massima (2 m)",
                    es: "Temperatura máxima (2 m)",
                    pl: "Maksymalna temperatura (2 m)",
                    uk: "Максимальна температура (2 м)",
                    "zh-cn": "最高温度（2 米）",
                },
                desc: "Maximum Temperature (2 m)",
                read: true,
                write: false,
                unit: this.config.temperaturUnit === "default" ? "°C" : "F",
                def: 0,
            };
            await this.createDataPoint(`${path}.temperature_2m_max`, common, "state", 0, null);
        }
        if (val.includes("precipitation")) {
            common = {
                type: "number",
                role: "value",
                name: {
                    en: "Precipitation (rain + showers + snow)",
                    de: "Niederschlag (Regen + Schauer + Schnee)",
                    ru: "Осадки (дождь + ливни + снег)",
                    pt: "Precipitação (chuva + aguaceiros + neve)",
                    nl: "Neerslag (regen + buien + sneeuw)",
                    fr: "Précipitations (pluie + averses + neige)",
                    it: "Precipitazioni (pioggia + rovesci + neve)",
                    es: "Precipitación (lluvia + chubascos + nieve)",
                    pl: "Opady (deszcz + przelotne opady + śnieg)",
                    uk: "Опади (дощ + злива + сніг)",
                    "zh-cn": "降水（雨 + 阵雨 + 雪）",
                },
                desc: "Precipitation (rain + showers + snow)",
                read: true,
                write: false,
                unit: "mm",
                def: 0,
            };
            await this.createDataPoint(`${path}.precipitation`, common, "state", 0, null);
        }
        if (val.includes("precipitation_sum")) {
            common = {
                type: "number",
                role: "value",
                name: {
                    en: "Precipitation sum (rain)",
                    de: "Niederschlagssumme (Regen)",
                    ru: "Сумма осадков (дождь)",
                    pt: "Soma de precipitação (chuva)",
                    nl: "Neerslagsom (regen)",
                    fr: "Somme des précipitations (pluie)",
                    it: "Somma delle precipitazioni (pioggia)",
                    es: "Suma de precipitaciones (lluvia)",
                    pl: "Suma opadów (deszczu)",
                    uk: "Сума опадів (дощ)",
                    "zh-cn": "降水总量（雨）",
                },
                desc: "Precipitation sum (rain)",
                read: true,
                write: false,
                unit: "mm",
                def: 0,
            };
            await this.createDataPoint(`${path}.precipitation_sum`, common, "state", 0, null);
        }
        if (val.includes("weather_code")) {
            common = {
                type: "number",
                role: "value",
                name: {
                    en: "Weather code",
                    de: "Wettercode",
                    ru: "Погодный код",
                    pt: "Código meteorológico",
                    nl: "Weerscode",
                    fr: "Code météo",
                    it: "Codice meteo",
                    es: "Código meteorológico",
                    pl: "Kod pogody",
                    uk: "Код погоди",
                    "zh-cn": "天气代码",
                },
                desc: "Weather code",
                read: true,
                write: false,
                def: 0,
            };
            await this.createDataPoint(`${path}.weather_code`, common, "state", 0, null);
            common = {
                type: "string",
                role: "state",
                name: {
                    en: "Weather text",
                    de: "Wettertext",
                    ru: "Текст прогноза погоды",
                    pt: "Texto sobre o clima",
                    nl: "Weer tekst",
                    fr: "Texte météo",
                    it: "Testo meteo",
                    es: "Texto del tiempo",
                    pl: "Tekst o pogodzie",
                    uk: "Текст про погоду",
                    "zh-cn": "天气文本",
                },
                desc: "Weather text",
                read: true,
                write: false,
                def: "",
            };
            await this.createDataPoint(`${path}.weather_code_text`, common, "state", "", null);
            common = {
                type: "string",
                role: "state",
                name: {
                    en: "Weather icon path",
                    de: "Wettersymbolpfad",
                    ru: "Путь к значку погоды",
                    pt: "Caminho do ícone do clima",
                    nl: "Weerpictogram pad",
                    fr: "Chemin de l'icône météo",
                    it: "Percorso dell'icona meteo",
                    es: "Ruta del icono del tiempo",
                    pl: "Ścieżka ikon pogody",
                    uk: "Погода значок шлях",
                    "zh-cn": "天气图标路径",
                },
                desc: "Weather icon path",
                read: true,
                write: false,
                def: "",
            };
            await this.createDataPoint(`${path}.weather_code_path`, common, "state", "", null);
            common = {
                type: "string",
                role: "state",
                name: {
                    en: "Own SVG icon",
                    de: "Eigenes SVG-Symbol",
                    ru: "Собственный значок SVG",
                    pt: "Próprio ícone SVG",
                    nl: "Eigen SVG-pictogram",
                    fr: "Icône SVG propre",
                    it: "Icona SVG",
                    es: "Own SVG icono",
                    pl: "Własna ikona SVG",
                    uk: "СВГ іконка",
                    "zh-cn": "拥有 SVG 图标",
                },
                desc: "Weather icon path",
                read: true,
                write: false,
                def: "",
            };
            await this.createDataPoint(`${path}.weather_code_own`, common, "state", "", null);
        }
        if (val.includes("wind_speed_10m")) {
            common = {
                type: "number",
                role: "state",
                name: {
                    en: "Wind speed (10 m)",
                    de: "Windgeschwindigkeit (10 m)",
                    ru: "Скорость ветра (10 м)",
                    pt: "Velocidade do vento (10 m)",
                    nl: "Windsnelheid (10 m)",
                    fr: "Vitesse du vent (10 m)",
                    it: "Velocità del vento (10 m)",
                    es: "Velocidad del viento (10 m)",
                    pl: "Prędkość wiatru (10 m)",
                    uk: "Швидкість вітру (10 м)",
                    "zh-cn": "风速（10米）",
                },
                desc: "Wind speed (10 m)",
                read: true,
                write: false,
                unit: this.config.windSpeedUnit === "default" ? "km/h" : this.config.windSpeedUnit,
                def: 0,
            };
            await this.createDataPoint(`${path}.wind_speed_10m`, common, "state", 0, null);
        }
        if (val.includes("wind_speed_80m")) {
            common = {
                type: "number",
                role: "state",
                name: {
                    en: "Wind speed (80 m)",
                    de: "Windgeschwindigkeit (80 m)",
                    ru: "Скорость ветра (80 м)",
                    pt: "Velocidade do vento (80 m)",
                    nl: "Windsnelheid (80 m)",
                    fr: "Vitesse du vent (80 m)",
                    it: "Velocità del vento (80 m)",
                    es: "Velocidad del viento (80 m)",
                    pl: "Prędkość wiatru (80 m)",
                    uk: "Швидкість вітру (80 м)",
                    "zh-cn": "风速（80米）",
                },
                desc: "Wind speed (80 m)",
                read: true,
                write: false,
                unit: this.config.windSpeedUnit === "default" ? "km/h" : this.config.windSpeedUnit,
                def: 0,
            };
            await this.createDataPoint(`${path}.wind_speed_80m`, common, "state", 0, null);
        }
        if (val.includes("wind_speed_120m")) {
            common = {
                type: "number",
                role: "state",
                name: {
                    en: "Wind speed (120 m)",
                    de: "Windgeschwindigkeit (120 m)",
                    ru: "Скорость ветра (120 м)",
                    pt: "Velocidade do vento (120 m)",
                    nl: "Windsnelheid (120 m)",
                    fr: "Vitesse du vent (120 m)",
                    it: "Velocità del vento (120 m)",
                    es: "Velocidad del viento (120 m)",
                    pl: "Prędkość wiatru (120 m)",
                    uk: "Швидкість вітру (120 м)",
                    "zh-cn": "风速（120米）",
                },
                desc: "Wind speed (120 m)",
                read: true,
                write: false,
                unit: this.config.windSpeedUnit === "default" ? "km/h" : this.config.windSpeedUnit,
                def: 0,
            };
            await this.createDataPoint(`${path}.wind_speed_120m`, common, "state", 0, null);
        }
        if (val.includes("wind_speed_180m")) {
            common = {
                type: "number",
                role: "state",
                name: {
                    en: "Wind speed (180 m)",
                    de: "Windgeschwindigkeit (180 m)",
                    ru: "Скорость ветра (180 м)",
                    pt: "Velocidade do vento (180 m)",
                    nl: "Windsnelheid (180 m)",
                    fr: "Vitesse du vent (180 m)",
                    it: "Velocità del vento (180 m)",
                    es: "Velocidad del viento (180 m)",
                    pl: "Prędkość wiatru (180 m)",
                    uk: "Швидкість вітру (180 м)",
                    "zh-cn": "风速（180米）",
                },
                desc: "Wind speed (180 m)",
                read: true,
                write: false,
                unit: this.config.windSpeedUnit === "default" ? "km/h" : this.config.windSpeedUnit,
                def: 0,
            };
            await this.createDataPoint(`${path}.wind_speed_180m`, common, "state", 0, null);
        }
        if (val.includes("wind_direction_10m")) {
            common = {
                type: "number",
                role: "state",
                name: {
                    en: "Wind Direction (10 m)",
                    de: "Windrichtung (10 m)",
                    ru: "Направление ветра (10 м)",
                    pt: "Direção do vento (10 m)",
                    nl: "Windrichting (10 m)",
                    fr: "Direction du vent (10 m)",
                    it: "Direzione del vento (10 m)",
                    es: "Dirección del viento (10 m)",
                    pl: "Kierunek wiatru (10 m)",
                    uk: "Напрямок вітру (10 м)",
                    "zh-cn": "风向 (10 米)",
                },
                desc: "Wind Direction (10 m)",
                read: true,
                write: false,
                unit: "°",
                def: 0,
            };
            await this.createDataPoint(`${path}.wind_direction_10m`, common, "state", 0, null);
        }
        if (val.includes("wind_direction_80m")) {
            common = {
                type: "number",
                role: "state",
                name: {
                    en: "Wind Direction (80 m)",
                    de: "Windrichtung (80 m)",
                    ru: "Направление ветра (80 м)",
                    pt: "Direção do vento (80 m)",
                    nl: "Windrichting (80 m)",
                    fr: "Direction du vent (80 m)",
                    it: "Direzione del vento (80 m)",
                    es: "Dirección del viento (80 m)",
                    pl: "Kierunek wiatru (80 m)",
                    uk: "Напрямок вітру (80 м)",
                    "zh-cn": "风向 (80 米)",
                },
                desc: "Wind Direction (80 m)",
                read: true,
                write: false,
                unit: "°",
                def: 0,
            };
            await this.createDataPoint(`${path}.wind_direction_80m`, common, "state", 0, null);
        }
        if (val.includes("wind_direction_120m")) {
            common = {
                type: "number",
                role: "state",
                name: {
                    en: "Wind Direction (120 m)",
                    de: "Windrichtung (120 m)",
                    ru: "Направление ветра (120 м)",
                    pt: "Direção do vento (120 m)",
                    nl: "Windrichting (120 m)",
                    fr: "Direction du vent (120 m)",
                    it: "Direzione del vento (120 m)",
                    es: "Dirección del viento (120 m)",
                    pl: "Kierunek wiatru (120 m)",
                    uk: "Напрямок вітру (120 м)",
                    "zh-cn": "风向 (120 米)",
                },
                desc: "Wind Direction (120 m)",
                read: true,
                write: false,
                unit: "°",
                def: 0,
            };
            await this.createDataPoint(`${path}.wind_direction_120m`, common, "state", 0, null);
        }
        if (val.includes("wind_direction_180m")) {
            common = {
                type: "number",
                role: "state",
                name: {
                    en: "Wind Direction (180 m)",
                    de: "Windrichtung (180 m)",
                    ru: "Направление ветра (180 м)",
                    pt: "Direção do vento (180 m)",
                    nl: "Windrichting (180 m)",
                    fr: "Direction du vent (180 m)",
                    it: "Direzione del vento (180 m)",
                    es: "Dirección del viento (180 m)",
                    pl: "Kierunek wiatru (180 m)",
                    uk: "Напрямок вітру (180 м)",
                    "zh-cn": "风向 (180 米)",
                },
                desc: "Wind Direction (180 m)",
                read: true,
                write: false,
                unit: "°",
                def: 0,
            };
            await this.createDataPoint(`${path}.wind_direction_180m`, common, "state", 0, null);
        }
        if (val.includes("wind_gusts_10m")) {
            common = {
                type: "number",
                role: "state",
                name: {
                    en: "Wind Gusts (10 m)",
                    de: "Windböen (10 m)",
                    ru: "Порывы ветра (10 м)",
                    pt: "Rajadas de vento (10 m)",
                    nl: "Windstoten (10 m)",
                    fr: "Rafales de vent (10 m)",
                    it: "Raffiche di vento (10 m)",
                    es: "Ráfagas de viento (10 m)",
                    pl: "Porywy wiatru (10 m)",
                    uk: "Пориви вітру (10 м)",
                    "zh-cn": "阵风 (10 米)",
                },
                desc: "Wind Gusts (10 m)",
                read: true,
                write: false,
                unit: this.config.windSpeedUnit === "default" ? "km/h" : this.config.windSpeedUnit,
                def: 0,
            };
            await this.createDataPoint(`${path}.wind_gusts_10m`, common, "state", 0, null);
        }
        if (val.includes("wind_speed_10m_max")) {
            common = {
                type: "number",
                role: "state",
                name: {
                    en: "Maximum Wind Speed (10 m)",
                    de: "Maximale Windgeschwindigkeit (10 m)",
                    ru: "Максимальная скорость ветра (10 м)",
                    pt: "Velocidade máxima do vento (10 m)",
                    nl: "Maximale windsnelheid (10 m)",
                    fr: "Vitesse maximale du vent (10 m)",
                    it: "Velocità massima del vento (10 m)",
                    es: "Velocidad máxima del viento (10 m)",
                    pl: "Maksymalna prędkość wiatru (10 m)",
                    uk: "Максимальна швидкість вітру (10 м)",
                    "zh-cn": "最大风速（10米）",
                },
                desc: "Maximum Wind Speed (10 m)",
                read: true,
                write: false,
                unit: this.config.windSpeedUnit === "default" ? "km/h" : this.config.windSpeedUnit,
                def: 0,
            };
            await this.createDataPoint(`${path}.wind_speed_10m_max`, common, "state", 0, null);
        }
        if (val.includes("rain")) {
            common = {
                type: "number",
                role: "state",
                name: {
                    en: "Amount of rain",
                    de: "Regenmenge",
                    ru: "Количество осадков",
                    pt: "Quantidade de chuva",
                    nl: "Hoeveelheid regen",
                    fr: "Quantité de pluie",
                    it: "Quantità di pioggia",
                    es: "Cantidad de lluvia",
                    pl: "Ilość deszczu",
                    uk: "Кількість дощу",
                    "zh-cn": "降雨量",
                },
                desc: "Amount of rain",
                read: true,
                write: false,
                unit: "mm",
                def: 0,
            };
            await this.createDataPoint(`${path}.rain`, common, "state", 0, null);
        }
        if (val.includes("showers")) {
            common = {
                type: "number",
                role: "state",
                name: {
                    en: "Showers (rain)",
                    de: "Schauer (Regen)",
                    ru: "Ливни (дождь)",
                    pt: "Chuva (pancadas de chuva)",
                    nl: "Buien (regen)",
                    fr: "Averses (pluie)",
                    it: "Rovesci (pioggia)",
                    es: "Chubascos (lluvia)",
                    pl: "Przelotne opady deszczu",
                    uk: "Злива (дощ)",
                    "zh-cn": "阵雨",
                },
                desc: "Showers (rain)",
                read: true,
                write: false,
                unit: "mm",
                def: 0,
            };
            await this.createDataPoint(`${path}.showers`, common, "state", 0, null);
        }
        if (val.includes("snowfall")) {
            common = {
                type: "number",
                role: "state",
                name: {
                    en: "Snowfall",
                    de: "Schneefall",
                    ru: "Снегопад",
                    pt: "Queda de neve",
                    nl: "Sneeuwval",
                    fr: "Chute de neige",
                    it: "Nevicata",
                    es: "Nevada",
                    pl: "Opady śniegu",
                    uk: "Снігопад",
                    "zh-cn": "降雪",
                },
                desc: "Snowfall",
                read: true,
                write: false,
                unit: "cm",
                def: 0,
            };
            await this.createDataPoint(`${path}.snowfall`, common, "state", 0, null);
        }
        if (val.includes("rain_sum")) {
            common = {
                type: "number",
                role: "state",
                name: {
                    en: "Rain sum",
                    de: "Regensumme",
                    ru: "Сумма дождя",
                    pt: "Soma de chuva",
                    nl: "Regensom",
                    fr: "Somme des précipitations",
                    it: "Somma di pioggia",
                    es: "Suma de lluvia",
                    pl: "Suma opadów",
                    uk: "Сума дощу",
                    "zh-cn": "雨量",
                },
                desc: "Rain sum",
                read: true,
                write: false,
                unit: "mm",
                def: 0,
            };
            await this.createDataPoint(`${path}.rain_sum`, common, "state", 0, null);
        }
        if (val.includes("showers_sum")) {
            common = {
                type: "number",
                role: "state",
                name: {
                    en: "Showers sum (rain)",
                    de: "Schauersumme (Regen)",
                    ru: "Сумма ливней (дождь)",
                    pt: "Chuva sum (chuva)",
                    nl: "Buiensom (regen)",
                    fr: "Somme des averses (pluie)",
                    it: "Somma di rovesci (pioggia)",
                    es: "Chubascos de lluvia",
                    pl: "Suma opadów deszczu",
                    uk: "Сума злив (дощ)",
                    "zh-cn": "阵雨（雨）",
                },
                desc: "Showers sum (rain)",
                read: true,
                write: false,
                unit: "mm",
                def: 0,
            };
            await this.createDataPoint(`${path}.showers_sum`, common, "state", 0, null);
        }
        if (val.includes("snowfall_sum")) {
            common = {
                type: "number",
                role: "state",
                name: {
                    en: "Snowfall sum",
                    de: "Schneefallsumme",
                    ru: "Сумма снегопада",
                    pt: "Soma de queda de neve",
                    nl: "Sneeuwvalsom",
                    fr: "Somme des chutes de neige",
                    it: "Somma delle nevicate",
                    es: "Suma de nevadas",
                    pl: "Suma opadów śniegu",
                    uk: "Сума снігопаду",
                    "zh-cn": "降雪量",
                },
                desc: "Snowfall sum",
                read: true,
                write: false,
                unit: "cm",
                def: 0,
            };
            await this.createDataPoint(`${path}.snowfall_sum`, common, "state", 0, null);
        }
        if (val.includes("wind_direction_10m_dominant")) {
            common = {
                type: "number",
                role: "state",
                name: {
                    en: "Dominant Wind Direction (10 m)",
                    de: "Dominante Windrichtung (10 m)",
                    ru: "Преобладающее направление ветра (10 м)",
                    pt: "Direção do vento dominante (10 m)",
                    nl: "Dominante windrichting (10 m)",
                    fr: "Direction dominante du vent (10 m)",
                    it: "Direzione del vento dominante (10 m)",
                    es: "Dirección dominante del viento (10 m)",
                    pl: "Dominujący kierunek wiatru (10 m)",
                    uk: "Переважний напрямок вітру (10 м)",
                    "zh-cn": "主导风向 (10 米)",
                },
                desc: "Dominant Wind Direction (10 m)",
                read: true,
                write: false,
                unit: "°",
                def: 0,
            };
            await this.createDataPoint(`${path}.wind_direction_10m_dominant`, common, "state", 0, null);
        }
        if (val.includes("wind_gusts_10m_max")) {
            common = {
                type: "number",
                role: "state",
                name: {
                    en: "Maximum Wind Gusts (10 m)",
                    de: "Maximale Windböen (10 m)",
                    ru: "Максимальные порывы ветра (10 м)",
                    pt: "Rajadas de vento máximas (10 m)",
                    nl: "Maximale windstoten (10 m)",
                    fr: "Rafales de vent maximales (10 m)",
                    it: "Raffiche di vento massime (10 m)",
                    es: "Ráfagas de viento máximas (10 m)",
                    pl: "Maksymalne porywy wiatru (10 m)",
                    uk: "Максимальні пориви вітру (10 м)",
                    "zh-cn": "最大阵风（10 米）",
                },
                desc: "Maximum Wind Gusts (10 m)",
                read: true,
                write: false,
                unit: this.config.windSpeedUnit === "default" ? "km/h" : this.config.windSpeedUnit,
                def: 0,
            };
            await this.createDataPoint(`${path}.wind_gusts_10m_max`, common, "state", 0, null);
        }
        if (val.includes("precipitation_probability_max")) {
            common = {
                type: "number",
                role: "value",
                name: {
                    en: "Precipitation Probability Max",
                    de: "Maximale Niederschlagswahrscheinlichkeit",
                    ru: "Вероятность осадков Макс.",
                    pt: "Probabilidade de precipitação máxima",
                    nl: "Neerslagwaarschijnlijkheid Max",
                    fr: "Probabilité maximale de précipitations",
                    it: "Probabilità massima di precipitazione",
                    es: "Probabilidad máxima de precipitación",
                    pl: "Maksymalne prawdopodobieństwo opadów",
                    uk: "Імовірність опадів Макс",
                    "zh-cn": "最大降水概率",
                },
                desc: "Precipitation Probability Max",
                read: true,
                write: false,
                unit: "mm",
                def: 0,
            };
            await this.createDataPoint(`${path}.precipitation_probability_max`, common, "state", 0, null);
        }
        if (val.includes("precipitation_hours")) {
            common = {
                type: "number",
                role: "value",
                name: {
                    en: "Precipitation Hours",
                    de: "Niederschlagsstunden",
                    ru: "Часы осадков",
                    pt: "Horas de precipitação",
                    nl: "Neerslaguren",
                    fr: "Heures de précipitations",
                    it: "Ore di precipitazione",
                    es: "Horas de precipitación",
                    pl: "Godziny opadów",
                    uk: "Години опадів",
                    "zh-cn": "降水小时数",
                },
                desc: "Precipitation Hours",
                read: true,
                write: false,
                unit: "mm",
                def: 0,
            };
            await this.createDataPoint(`${path}.precipitation_hours`, common, "state", 0, null);
        }
        if (val.includes("sunshine_duration")) {
            common = {
                type: "number",
                role: "value",
                name: {
                    en: "Sunshine Duration",
                    de: "Sonnenscheindauer",
                    ru: "Продолжительность солнечного сияния",
                    pt: "Duração do Sol",
                    nl: "Zonneschijnduur",
                    fr: "Durée d'ensoleillement",
                    it: "Durata del sole",
                    es: "Duración de la luz solar",
                    pl: "Czas trwania nasłonecznienia",
                    uk: "Тривалість сонячного сяйва",
                    "zh-cn": "日照时长",
                },
                desc: "Sunshine Duration",
                read: true,
                write: false,
                unit: "s",
                def: 0,
            };
            await this.createDataPoint(`${path}.sunshine_duration`, common, "state", 0, null);
        }
        if (val.includes("daylight_duration")) {
            common = {
                type: "number",
                role: "value",
                name: {
                    en: "Daylight Duration",
                    de: "Tageslichtdauer",
                    ru: "Продолжительность светового дня",
                    pt: "Duração da luz do dia",
                    nl: "Daglichtduur",
                    fr: "Durée du jour",
                    it: "Durata della luce diurna",
                    es: "Duración de la luz del día",
                    pl: "Długość dnia",
                    uk: "Тривалість світлового дня",
                    "zh-cn": "日照时间",
                },
                desc: "Daylight Duration",
                read: true,
                write: false,
                unit: "s",
                def: 0,
            };
            await this.createDataPoint(`${path}.daylight_duration`, common, "state", 0, null);
        }
    },
    /**
     * Create sunCalc
     */
    async createObjectsSunCalc() {
        let common = {};
        common = {
            name: {
                en: "Sun calculation",
                de: "Sonnenberechnung",
                ru: "Расчет солнца",
                pt: "Cálculo do sol",
                nl: "Berekening van de zon",
                fr: "Calcul du soleil",
                it: "Calcolo del sole",
                es: "Cálculo del sol",
                pl: "Obliczanie Słońca",
                uk: "Розрахунок сонця",
                "zh-cn": "太阳计算",
            },
            desc: "Sun calculation",
            icon: "img/weather.png",
        };
        await this.createDataPoint(`suncalc`, common, "device", null, null);
        common = {
            type: "string",
            role: "state",
            name: {
                en: "Seasons",
                de: "Jahreszeiten",
                ru: "Времена года",
                pt: "Estações",
                nl: "Seizoenen",
                fr: "Saisons",
                it: "Stagioni",
                es: "Estaciones",
                pl: "Pory roku",
                uk: "Пори року",
                "zh-cn": "季节",
            },
            desc: "Seasons",
            read: true,
            write: false,
            def: "",
        };
        await this.createDataPoint(`suncalc.seasons`, common, "state", "", null);
        common = {
            type: "string",
            role: "state",
            name: {
                en: "Current AstroTime",
                de: "Aktuelle AstroTime",
                ru: "Текущее астровремя",
                pt: "AstroTime atual",
                nl: "De huidige AstroTime",
                fr: "AstroTime actuel",
                it: "AstroTime attuale",
                es: "AstroTime actual",
                pl: "Aktualny AstroTime",
                uk: "Поточний АстроТайм",
                "zh-cn": "当前的 AstroTim",
            },
            desc: "Current AstroTime",
            read: true,
            write: false,
            def: "",
        };
        await this.createDataPoint(`suncalc.currentAstroTime`, common, "state", "", null);
        common = {
            type: "string",
            role: "state",
            name: {
                en: "Current Object",
                de: "Aktuelles Objekt",
                ru: "Текущий объект",
                pt: "Objeto atual",
                nl: "Huidig object",
                fr: "Objet actuel",
                it: "Oggetto corrente",
                es: "Objeto actual",
                pl: "Aktualny obiekt",
                uk: "Поточний об'єкт",
                "zh-cn": "当前对象",
            },
            desc: "Current Object",
            read: true,
            write: false,
            def: "",
        };
        await this.createDataPoint(`suncalc.currentState`, common, "state", "", null);
        common = {
            type: "string",
            role: "state",
            name: {
                en: "Next astrotime",
                de: "Nächste Astrozeit",
                ru: "Следующее астровремя",
                pt: "Next Astrotime",
                nl: "Volgende astrotijd",
                fr: "Next Astro Time",
                it: "Prossima ora",
                es: "El próximo astrotime",
                pl: "Następny astrotime",
                uk: "Наступний астротайм",
                "zh-cn": "下次天文时光",
            },
            desc: "Next astrotime",
            read: true,
            write: false,
            def: "",
        };
        await this.createDataPoint(`suncalc.nextAstroTime`, common, "state", "", null);
        common = {
            type: "string",
            role: "state",
            name: {
                en: "Next Object",
                de: "Nächstes Objekt",
                ru: "Следующий объект",
                pt: "Próximo objeto",
                nl: "Volgend object",
                fr: "Objet suivant",
                it: "Oggetto successivo",
                es: "Siguiente objeto",
                pl: "Następny obiekt",
                uk: "Наступний об'єкт",
                "zh-cn": "下一个对象",
            },
            desc: "Next Object",
            read: true,
            write: false,
            def: "",
        };
        await this.createDataPoint(`suncalc.nextState`, common, "state", "", null);
        common = {
            type: "string",
            role: "state",
            name: {
                en: "The sun-time for night starts",
                de: "Die Abenddämmerung beginnt",
                ru: "Наступает время заката, когда начинается ночь",
                pt: "O sol da noite começa",
                nl: "De tijd van de zon voor de avond begint",
                fr: "L'heure du soleil commence",
                it: "Inizia l'ora solare notturna",
                es: "Empieza la hora del sol por la noche",
                pl: "Zaczyna się czas słoneczny na noc",
                uk: "Починається сонячний час ночі",
                "zh-cn": "夜晚的日照时间开始了",
            },
            desc: "The sun-time for night starts",
            read: true,
            write: false,
            def: "00:00",
        };
        await this.createDataPoint(`suncalc.astronomicalDusk`, common, "state", "00:00", null);
        common = {
            type: "string",
            role: "state",
            name: {
                en: "The sun-time for night ends",
                de: "Die Sonne geht zu Ende",
                ru: "Вечернее время солнца подходит к концу",
                pt: "O sol da noite termina",
                nl: "De tijd van de zon voor de avond is voorbij",
                fr: "Fin de l'heure du soleil",
                it: "Il sole notturno finisce",
                es: "El sol por la noche termina",
                pl: "Czas słoneczny na noc się kończy",
                uk: "Сонячний час для ночі закінчується",
                "zh-cn": "夜晚的日照时间结束了",
            },
            desc: "The sun-time for night ends",
            read: true,
            write: false,
            def: "00:00",
        };
        await this.createDataPoint(`suncalc.astronomicalDawn`, common, "state", "00:00", null);
        common = {
            type: "string",
            role: "state",
            name: {
                en: "Beginning of the blue hour at dawn",
                de: "Beginn der blauen Stunde im Morgengrauen",
                ru: "Начало синего часа на рассвете",
                pt: "Início da hora azul ao amanhecer",
                nl: "Begin van het blauwe uur bij zonsopgang",
                fr: "Début de l'heure bleue à l'aube",
                it: "Inizio dell'ora blu all'alba",
                es: "Comienzo de la hora azul al amanecer",
                pl: "Początek niebieskiej godziny o świcie",
                uk: "Початок блакитної години на світанку",
                "zh-cn": "黎明蓝色时刻的开始",
            },
            desc: "Beginning of the blue hour at dawn",
            read: true,
            write: false,
            def: "00:00",
        };
        await this.createDataPoint(`suncalc.blueHourDawnStart`, common, "state", "00:00", null);
        common = {
            type: "string",
            role: "state",
            name: {
                en: "End of the blue hour at dawn",
                de: "Ende der blauen Stunde im Morgengrauen",
                ru: "Конец синего часа на рассвете",
                pt: "Fim da hora azul ao amanhecer",
                nl: "Einde van het blauwe uur bij zonsopgang",
                fr: "Fin de l'heure bleue à l'aube",
                it: "Fine dell'ora blu all'alba",
                es: "Fin de la hora azul al amanecer",
                pl: "Koniec niebieskiej godziny o świcie",
                uk: "Кінець блакитної години на світанку",
                "zh-cn": "黎明时分蓝色时刻结束",
            },
            desc: "End of the blue hour at dawn",
            read: true,
            write: false,
            def: "00:00",
        };
        await this.createDataPoint(`suncalc.blueHourDawnEnd`, common, "state", "00:00", null);
        common = {
            type: "string",
            role: "state",
            name: {
                en: "Beginning of the blue hour at dusk",
                de: "Beginn der blauen Stunde in der Dämmerung",
                ru: "Начало синего часа в сумерках",
                pt: "Início da hora azul ao anoitecer",
                nl: "Begin van het blauwe uur bij schemering",
                fr: "Début de l'heure bleue au crépuscule",
                it: "Inizio dell'ora blu al tramonto",
                es: "Comienzo de la hora azul al anochecer",
                pl: "Początek niebieskiej godziny o zmierzchu",
                uk: "Початок блакитної години в сутінках",
                "zh-cn": "黄昏蓝色时刻的开始",
            },
            desc: "Beginning of the blue hour at dusk",
            read: true,
            write: false,
            def: "00:00",
        };
        await this.createDataPoint(`suncalc.blueHourDuskStart`, common, "state", "00:00", null);
        common = {
            type: "string",
            role: "state",
            name: {
                en: "End of the blue hour at dusk",
                de: "Ende der blauen Stunde in der Dämmerung",
                ru: "Конец синего часа в сумерках",
                pt: "Fim da hora azul ao anoitecer",
                nl: "Einde van het blauwe uur bij schemering",
                fr: "Fin de l'heure bleue au crépuscule",
                it: "Fine dell'ora blu al tramonto",
                es: "Fin de la hora azul al anochecer",
                pl: "Koniec niebieskiej godziny o zmierzchu",
                uk: "Кінець блакитної години в сутінках",
                "zh-cn": "黄昏时分蓝色时刻结束",
            },
            desc: "End of the blue hour at dusk",
            read: true,
            write: false,
            def: "00:00",
        };
        await this.createDataPoint(`suncalc.blueHourDuskEnd`, common, "state", "00:00", null);
        common = {
            type: "string",
            role: "state",
            name: {
                en: "Midnight",
                de: "Mitternacht",
                ru: "Полночь",
                pt: "Meia-noite",
                nl: "Middernacht",
                fr: "Minuit",
                it: "Mezzanotte",
                es: "Medianoche",
                pl: "Północą",
                uk: "Опівночі",
                "zh-cn": "午夜",
            },
            desc: "Midnight",
            read: true,
            write: false,
            def: "00:00",
        };
        await this.createDataPoint(`suncalc.nadir`, common, "state", "00:00", null);
        common = {
            type: "string",
            role: "state",
            name: {
                en: "dawn",
                de: "Morgendämmerung",
                ru: "рассвет",
                pt: "alvorecer",
                nl: "dageraad",
                fr: "aube",
                it: "alba",
                es: "alba",
                pl: "świt",
                uk: "світанок",
                "zh-cn": "黎明的",
            },
            desc: "dawn",
            read: true,
            write: false,
            def: "00:00",
        };
        await this.createDataPoint(`suncalc.civilDawn`, common, "state", "00:00", null);
        common = {
            type: "string",
            role: "state",
            name: {
                en: "dusk",
                de: "Dämmerung",
                ru: "смеркаться",
                pt: "entardecer",
                nl: "schemering",
                fr: "crépuscule",
                it: "crepuscolo",
                es: "anochecer",
                pl: "zmierzch",
                uk: "сутінків",
                "zh-cn": "黄昏",
            },
            desc: "dusk",
            read: true,
            write: false,
            def: "00:00",
        };
        await this.createDataPoint(`suncalc.civilDusk`, common, "state", "00:00", null);
        common = {
            type: "string",
            role: "state",
            name: {
                en: "Start of golden hour at dusk",
                de: "Beginn der goldenen Stunde in der Dämmerung",
                ru: "Начало золотого часа в сумерках",
                pt: "Início da hora dourada ao anoitecer",
                nl: "Begin van het gouden uur bij zonsondergang",
                fr: "Début de l'heure dorée au crépuscule",
                it: "Inizio dell'ora d'oro al tramonto",
                es: "Inicio de la hora dorada al anochecer",
                pl: "Początek złotej godziny o zmierzchu",
                uk: "Початок золотої години в сутінках",
                "zh-cn": "黄昏时分的黄金时段开始",
            },
            desc: "Start of golden hour at dusk",
            read: true,
            write: false,
            def: "00:00",
        };
        await this.createDataPoint(`suncalc.goldenHourDuskStart`, common, "state", "00:00", null);
        common = {
            type: "string",
            role: "state",
            name: {
                en: "End of golden hour at dusk",
                de: "Ende der goldenen Stunde in der Dämmerung",
                ru: "Конец золотого часа в сумерках",
                pt: "Fim da hora dourada ao anoitecer",
                nl: "Einde van het gouden uur bij zonsondergang",
                fr: "Fin de l'heure dorée au crépuscule",
                it: "Fine dell'ora d'oro al tramonto",
                es: "Fin de la hora dorada al anochecer",
                pl: "Koniec złotej godziny o zmierzchu",
                uk: "Кінець золотої години в сутінках",
                "zh-cn": "黄昏时分的黄金时段结束",
            },
            desc: "End of golden hour at dusk",
            read: true,
            write: false,
            def: "00:00",
        };
        await this.createDataPoint(`suncalc.goldenHourDuskEnd`, common, "state", "00:00", null);
        common = {
            type: "string",
            role: "state",
            name: {
                en: "Start of golden hour at dawn",
                de: "Beginn der goldenen Stunde im Morgengrauen",
                ru: "Начало золотого часа на рассвете",
                pt: "Início da hora dourada ao amanhecer",
                nl: "Begin van het gouden uur bij zonsopgang",
                fr: "Début de l'heure dorée à l'aube",
                it: "Inizio dell'ora d'oro all'alba",
                es: "Inicio de la hora dorada al amanecer",
                pl: "Początek złotej godziny o świcie",
                uk: "Початок золотої години на світанку",
                "zh-cn": "黎明时分的黄金时段开始",
            },
            desc: "Start of golden hour at dawn",
            read: true,
            write: false,
            def: "00:00",
        };
        await this.createDataPoint(`suncalc.goldenHourDawnStart`, common, "state", "00:00", null);
        common = {
            type: "string",
            role: "state",
            name: {
                en: "End of golden hour at dawn",
                de: "Ende der goldenen Stunde im Morgengrauen",
                ru: "Конец золотого часа на рассвете",
                pt: "Fim da hora dourada ao amanhecer",
                nl: "Einde van het gouden uur bij zonsopgang",
                fr: "Fin de l'heure dorée à l'aube",
                it: "Fine dell'ora d'oro all'alba",
                es: "Fin de la hora dorada al amanecer",
                pl: "Koniec złotej godziny o świcie",
                uk: "Кінець золотої години на світанку",
                "zh-cn": "黎明时分黄金时段结束",
            },
            desc: "End of golden hour at dawn",
            read: true,
            write: false,
            def: "00:00",
        };
        await this.createDataPoint(`suncalc.goldenHourDawnEnd`, common, "state", "00:00", null);
        common = {
            type: "string",
            role: "state",
            name: {
                en: "Nautical dawn",
                de: "Nautische Morgendämmerung",
                ru: "Морской рассвет",
                pt: "Amanhecer náutico",
                nl: "Nautische dageraad",
                fr: "Aube nautique",
                it: "Alba nautica",
                es: "Amanecer náutico",
                pl: "Świt marynarski",
                uk: "Морський світанок",
                "zh-cn": "航海黎明",
            },
            desc: "Nautical dawn",
            read: true,
            write: false,
            def: "00:00",
        };
        await this.createDataPoint(`suncalc.nauticalDawn`, common, "state", "00:00", null);
        common = {
            type: "string",
            role: "state",
            name: {
                en: "Nautical dusk",
                de: "Nautische Dämmerung",
                ru: "Морские сумерки",
                pt: "Crepúsculo náutico",
                nl: "Nautische schemering",
                fr: "Crépuscule nautique",
                it: "Crepuscolo nautico",
                es: "Atardecer náutico",
                pl: "Zmierzch marynarski",
                uk: "Морські сутінки",
                "zh-cn": "航海黄昏",
            },
            desc: "Nautical dusk",
            read: true,
            write: false,
            def: "00:00",
        };
        await this.createDataPoint(`suncalc.nauticalDusk`, common, "state", "00:00", null);
        common = {
            type: "string",
            role: "state",
            name: {
                en: "Amateur dawn",
                de: "Amateur-Morgendämmerung",
                ru: "Любительский рассвет",
                pt: "Amanhecer amador",
                nl: "Amateur dageraad",
                fr: "Aube amateur",
                it: "Alba amatoriale",
                es: "Amanecer amateur",
                pl: "Amatorski świt",
                uk: "Аматорський світанок",
                "zh-cn": "业余黎明",
            },
            desc: "Amateur dawn",
            read: true,
            write: false,
            def: "00:00",
        };
        await this.createDataPoint(`suncalc.amateurDawn`, common, "state", "00:00", null);
        common = {
            type: "string",
            role: "state",
            name: {
                en: "Amateur dusk",
                de: "Amateurdämmerung",
                ru: "Любительские сумерки",
                pt: "Crepúsculo amador",
                nl: "Amateur schemering",
                fr: "Crépuscule amateur",
                it: "Crepuscolo amatoriale",
                es: "Atardecer amateur",
                pl: "Amatorski zmierzch",
                uk: "Аматорські сутінки",
                "zh-cn": "业余黄昏",
            },
            desc: "Amateur dusk",
            read: true,
            write: false,
            def: "00:00",
        };
        await this.createDataPoint(`suncalc.amateurDusk`, common, "state", "00:00", null);
        common = {
            type: "string",
            role: "state",
            name: {
                en: "Start sunrise",
                de: "Start Sonnenaufgang",
                ru: "Начать рассвет",
                pt: "Comece a amanhecer",
                nl: "Begin met de zonsopgang",
                fr: "Départ à l'aube",
                it: "Inizi alba",
                es: "Empezar a amanecer",
                pl: "Rozpocznij wschód słońca",
                uk: "Почніть схід сонця",
                "zh-cn": "开始日出",
            },
            desc: "Start sunrise",
            read: true,
            write: false,
            def: "00:00",
        };
        await this.createDataPoint(`suncalc.sunriseStart`, common, "state", "00:00", null);
        common = {
            type: "string",
            role: "state",
            name: {
                en: "End sunrise",
                de: "Ende Sonnenaufgang",
                ru: "Конец восхода",
                pt: "Fim do sol",
                nl: "Einde van de zonsopkomst",
                fr: "Fin de l'aube",
                it: "Fine alba",
                es: "Fin del sol",
                pl: "Koniec wschodu słońca",
                uk: "Кінець сходу сонця",
                "zh-cn": "结束日出",
            },
            desc: "End sunrise",
            read: true,
            write: false,
            def: "00:00",
        };
        await this.createDataPoint(`suncalc.sunriseEnd`, common, "state", "00:00", null);
        common = {
            type: "string",
            role: "state",
            name: {
                en: "Start sunset",
                de: "Beginn Sonnenuntergang",
                ru: "Начать закат",
                pt: "Começa o pôr",
                nl: "Begin zonsondergang",
                fr: "Départ au crépuscule",
                it: "Inizio tramonto",
                es: "Empezar al atardecer",
                pl: "Rozpocznij zachód słońca",
                uk: "Почніть захід сонця",
                "zh-cn": "开始日落",
            },
            desc: "Start sunset",
            read: true,
            write: false,
            def: "00:00",
        };
        await this.createDataPoint(`suncalc.sunsetStart`, common, "state", "00:00", null);
        common = {
            type: "string",
            role: "state",
            name: {
                en: "End sunset",
                de: "Ende Sonnenuntergang",
                ru: "Конец заката",
                pt: "Fim do sol",
                nl: "Einde van de zonsondergang",
                fr: "Fin du crépuscule",
                it: "Tramonto",
                es: "Fin al anochecer",
                pl: "Zakończ zachód słońca",
                uk: "Кінець заходу сонця",
                "zh-cn": "结束日落",
            },
            desc: "End sunset",
            read: true,
            write: false,
            def: "00:00",
        };
        await this.createDataPoint(`suncalc.sunsetEnd`, common, "state", "00:00", null);
        common = {
            type: "string",
            role: "state",
            name: {
                en: "Noon solar",
                de: "Sonne am Mittag",
                ru: "Полдень солнечный",
                pt: "Sol sem sol",
                nl: "Zonneschijn op de middag",
                fr: "Midi solaire",
                it: "Noon solar",
                es: "Día solar",
                pl: "Południe słoneczne",
                uk: "Полудень сонячний",
                "zh-cn": "正午太阳",
            },
            desc: "Noon solar",
            read: true,
            write: false,
            def: "00:00",
        };
        await this.createDataPoint(`suncalc.solarNoon`, common, "state", "00:00", null);
        common = {
            type: "number",
            role: "value",
            name: {
                en: "Sun Elevation",
                de: "Sonnenhöhe",
                ru: "Высота солнца",
                pt: "Elevação do sol",
                nl: "Hoogte van de zon",
                fr: "Sun Elevation",
                it: "Altezza del sole",
                es: "Elevación solar",
                pl: "Wzniesienie Słońca",
                uk: "Висота Сонця",
                "zh-cn": "太阳仰角",
            },
            desc: "Sun Elevation",
            read: true,
            write: false,
            unit: "°",
            def: 0,
        };
        await this.createDataPoint(`suncalc.sunElevation`, common, "state", 0, null);
        common = {
            type: "number",
            role: "value",
            name: {
                en: "Altitude Degrees",
                de: "Höhengrade",
                ru: "Градусы высоты",
                pt: "Graus de altitude",
                nl: "Hoogtegraden",
                fr: "Degrés d'altitude",
                it: "Gradi altimetrici",
                es: "Grados de altitud",
                pl: "Stopnie wysokości",
                uk: "Висотні градуси",
                "zh-cn": "海拔度",
            },
            desc: "Altitude Degrees",
            read: true,
            write: false,
            unit: "°",
            def: 0,
        };
        await this.createDataPoint(`suncalc.sunAltitudeDegrees`, common, "state", 0, null);
        common = {
            type: "number",
            role: "value",
            name: {
                en: "Azimuth Degrees",
                de: "Azimutgrade",
                ru: "Градусы азимута",
                pt: "Graus de azimute",
                nl: "Azimuth-graden",
                fr: "Degrés azimutaux",
                it: "Gradi azimutali",
                es: "Grados de acimut",
                pl: "Stopnie azymutu",
                uk: "Ступінь азимуту",
                "zh-cn": "方位角",
            },
            desc: "Azimuth Degrees",
            read: true,
            write: false,
            unit: "°",
            def: 0,
        };
        await this.createDataPoint(`suncalc.sunAzimuthDegrees`, common, "state", 0, null);
        common = {
            type: "number",
            role: "value",
            name: {
                en: "Moon Elevation",
                de: "Mondhöhe",
                ru: "Высота Луны",
                pt: "Elevação da Lua",
                nl: "Hoogte van de maan",
                fr: "Élévation de la lune",
                it: "Altezza lunare",
                es: "Elevación lunar",
                pl: "Wysokość księżyca",
                uk: "Висота Місяця",
                "zh-cn": "月球仰角",
            },
            desc: "Moon Elevation",
            read: true,
            write: false,
            unit: "°",
            def: 0,
        };
        await this.createDataPoint(`suncalc.moonElevation`, common, "state", 0, null);
        common = {
            type: "number",
            role: "value",
            name: {
                en: "Altitude Degrees",
                de: "Höhengrade",
                ru: "Градусы высоты",
                pt: "Graus de altitude",
                nl: "Hoogtegraden",
                fr: "Degrés d'altitude",
                it: "Gradi altimetrici",
                es: "Grados de altitud",
                pl: "Stopnie wysokości",
                uk: "Висотні градуси",
                "zh-cn": "海拔度",
            },
            desc: "Altitude Degrees",
            read: true,
            write: false,
            unit: "°",
            def: 0,
        };
        await this.createDataPoint(`suncalc.moonAltitudeDegrees`, common, "state", 0, null);
        common = {
            type: "number",
            role: "value",
            name: {
                en: "Azimuth Degrees",
                de: "Azimutgrade",
                ru: "Градусы азимута",
                pt: "Graus de azimute",
                nl: "Azimuth-graden",
                fr: "Degrés azimutaux",
                it: "Gradi azimutali",
                es: "Grados de acimut",
                pl: "Stopnie azymutu",
                uk: "Ступінь азимуту",
                "zh-cn": "方位角",
            },
            desc: "Azimuth Degrees",
            read: true,
            write: false,
            unit: "°",
            def: 0,
        };
        await this.createDataPoint(`suncalc.moonAzimuthDegrees`, common, "state", 0, null);
        common = {
            type: "string",
            role: "state",
            name: {
                en: "Emoji",
                de: "Emoji",
                ru: "смайлик",
                pt: "Emoji",
                nl: "Emoji",
                fr: "Emoji",
                it: "Emoji",
                es: "Emoji",
                pl: "emotikon",
                uk: "Емоджі",
                "zh-cn": "表情符号",
            },
            desc: "Emoji",
            read: true,
            write: false,
            def: "",
        };
        await this.createDataPoint(`suncalc.moonEmoji`, common, "state", "", null);
    },
    /**
     * Create objects
     */
    async createObjects() {
        let common = {};
        const arrD = [];
        const arrC = [];
        const arrH = [];
        const arrM = [];
        for (const config in this.config) {
            if (config.startsWith("c_")) {
                if (this.config[config]) {
                    arrC.push(config.replace("c_", ""));
                }
            } else if (config.startsWith("h_")) {
                if (this.config[config]) {
                    arrH.push(config.replace("h_", ""));
                }
            } else if (config.startsWith("d_")) {
                if (this.config[config]) {
                    arrD.push(config.replace("d_", ""));
                }
            } else if (config.startsWith("m_")) {
                if (this.config[config]) {
                    arrM.push(config.replace("m_", ""));
                }
            }
        }
        this.log.debug(`arrD: ${JSON.stringify(arrD)} - ${arrD.length}`);
        this.log.debug(`arrC: ${JSON.stringify(arrC)} - ${arrC.length}`);
        this.log.debug(`arrH: ${JSON.stringify(arrH)} - ${arrH.length}`);
        this.log.debug(`arrM: ${JSON.stringify(arrM)} - ${arrM.length}`);
        if (arrD.length > 0) {
            common = {
                name: {
                    en: "Daily Weather",
                    de: "Tageswetter",
                    ru: "Ежедневная погода",
                    pt: "Clima diário",
                    nl: "Het weer per dag",
                    fr: "Météo du jour",
                    it: "Meteo giornaliero",
                    es: "Clima diario",
                    pl: "Codzienna pogoda",
                    uk: "Щоденна погода",
                    "zh-cn": "每日天气",
                },
                desc: "Daily Weather",
                icon: "img/weather.png",
            };
            await this.createDataPoint(`daily`, common, "device", null, null);
            for (let i = 1; i < this.config.forecast + 1; i++) {
                common = {
                    name: {
                        en: `Day ${i}`,
                        de: `Tag ${i}`,
                        ru: `День ${i}`,
                        pt: `Dia ${i}`,
                        nl: `Dag ${i}`,
                        fr: `Jour ${i}`,
                        it: `Giorno ${i}`,
                        es: `Día ${i}`,
                        pl: `Dzień ${i}`,
                        uk: `День ${i}`,
                        "zh-cn": `第 ${i} 天`,
                    },
                    desc: `Day ${i}`,
                    icon: "img/weather.png",
                };
                const path3 = `daily.day${`0${i}`.slice(-2)}`;
                await this.createDataPoint(path3, common, "channel", null, null);
                common = {
                    type: "string",
                    role: "date",
                    name: {
                        en: "Date",
                        de: "Datum",
                        ru: "Дата",
                        pt: "Data",
                        nl: "Datum",
                        fr: "Date",
                        it: "Data",
                        es: "Fecha",
                        pl: "Data",
                        uk: "Дата",
                        "zh-cn": "日期",
                    },
                    desc: "Date",
                    read: true,
                    write: false,
                };
                await this.createDataPoint(`${path3}.time`, common, "state", null, null);
                await this.createObjectsStates(arrD, path3);
            }
        } else {
            await this.delObjectAsync(`daily`, { recursive: true });
        }
        if (arrC.length > 0) {
            common = {
                name: {
                    en: "Current Weather",
                    de: "Aktuelles Wetter",
                    ru: "Текущая погода",
                    pt: "Clima atual",
                    nl: "Actueel weer",
                    fr: "Météo actuelle",
                    it: "Meteo attuale",
                    es: "El tiempo actual",
                    pl: "Aktualna pogoda",
                    uk: "Поточна погода",
                    "zh-cn": "当前天气",
                },
                desc: "Current Weather",
                icon: "img/weather.png",
            };
            await this.createDataPoint(`current`, common, "device", null, null);
            common = {
                type: "string",
                role: "date",
                name: {
                    en: "Date",
                    de: "Datum",
                    ru: "Дата",
                    pt: "Data",
                    nl: "Datum",
                    fr: "Date",
                    it: "Data",
                    es: "Fecha",
                    pl: "Data",
                    uk: "Дата",
                    "zh-cn": "日期",
                },
                desc: "Date",
                read: true,
                write: false,
            };
            await this.createDataPoint(`current.time`, common, "state", null, null);
            await this.createObjectsStates(arrC, `current`);
        } else {
            await this.delObjectAsync(`current`, { recursive: true });
        }
        if (arrH.length > 0) {
            common = {
                name: {
                    en: "Hourly Weather",
                    de: "Wetter pro Stunde",
                    ru: "Почасовая погода",
                    pt: "Clima por hora",
                    nl: "Het weer per uur",
                    fr: "Météo par heure",
                    it: "Meteo orario",
                    es: "Clima por hora",
                    pl: "Pogoda godzinowa",
                    uk: "Погодинний прогноз",
                    "zh-cn": "每小时天气",
                },
                desc: "Hourly Weather",
                icon: "img/weather.png",
            };
            await this.createDataPoint(`hourly`, common, "device", null, null);
            for (let i = 1; i < this.config.forecast + 1; i++) {
                common = {
                    name: {
                        en: `Day ${i}`,
                        de: `Tag ${i}`,
                        ru: `День ${i}`,
                        pt: `Dia ${i}`,
                        nl: `Dag ${i}`,
                        fr: `Jour ${i}`,
                        it: `Giorno ${i}`,
                        es: `Día ${i}`,
                        pl: `Dzień ${i}`,
                        uk: `День ${i}`,
                        "zh-cn": `第 ${i} 天`,
                    },
                    desc: `Day ${i}`,
                    icon: "img/weather.png",
                };
                await this.createDataPoint(`hourly.day${`0${i}`.slice(-2)}`, common, "channel", null, null);
                for (let a = 0; a < 23 + 1; a++) {
                    common = {
                        name: {
                            en: `Hour ${a}`,
                            de: `Stunde ${a}`,
                            ru: `Час ${a}`,
                            pt: `Hora ${a}`,
                            nl: `Uur ${a}`,
                            fr: `Heure ${a}`,
                            it: `Ora ${a}`,
                            es: `Hora ${a}`,
                            pl: `Godzina ${a}`,
                            uk: `Година ${a}`,
                            "zh-cn": `${a} 小时`,
                        },
                        desc: `Hour ${a}`,
                        icon: "img/weather.png",
                    };
                    const path = `hourly.day${`0${i}`.slice(-2)}.hour${`0${a}`.slice(-2)}`;
                    await this.createDataPoint(path, common, "folder", null, null);
                    common = {
                        type: "string",
                        role: "date",
                        name: {
                            en: "Date",
                            de: "Datum",
                            ru: "Дата",
                            pt: "Data",
                            nl: "Datum",
                            fr: "Date",
                            it: "Data",
                            es: "Fecha",
                            pl: "Data",
                            uk: "Дата",
                            "zh-cn": "日期",
                        },
                        desc: "Date",
                        read: true,
                        write: false,
                    };
                    await this.createDataPoint(`${path}.time`, common, "state", null, null);
                    await this.createObjectsStates(arrH, `${path}`);
                }
            }
        } else {
            await this.delObjectAsync(`hourly`, { recursive: true });
        }
        if (arrM.length > 0) {
            common = {
                name: {
                    en: "15-Minutely Forecast",
                    de: "15-Minuten-Vorhersage",
                    ru: "15-минутный прогноз",
                    pt: "Previsão de 15 minutos",
                    nl: "15-minutenvoorspelling",
                    fr: "Prévisions à 15 minutes",
                    it: "Previsioni ogni 15 minuti",
                    es: "Pronóstico de 15 minutos",
                    pl: "Prognoza 15-minutowa",
                    uk: "15-хвилинний прогноз",
                    "zh-cn": "15 分钟预报",
                },
                desc: "15-Minutely Forecast",
                icon: "img/weather.png",
            };
            await this.createDataPoint(`minutely`, common, "device", null, null);
            const min = { 0: "00", 1: "15", 2: "30", 3: "45" };
            for (let i = 1; i < this.config.forecast + 1; i++) {
                common = {
                    name: {
                        en: `Day ${i}`,
                        de: `Tag ${i}`,
                        ru: `День ${i}`,
                        pt: `Dia ${i}`,
                        nl: `Dag ${i}`,
                        fr: `Jour ${i}`,
                        it: `Giorno ${i}`,
                        es: `Día ${i}`,
                        pl: `Dzień ${i}`,
                        uk: `День ${i}`,
                        "zh-cn": `第 ${i} 天`,
                    },
                    desc: `Day ${i}`,
                    icon: "img/weather.png",
                };
                await this.createDataPoint(`minutely.day${`0${i}`.slice(-2)}`, common, "channel", null, null);
                for (let a = 0; a < 24; a++) {
                    common = {
                        name: {
                            en: `Hour ${a}`,
                            de: `Stunde ${a}`,
                            ru: `Час ${a}`,
                            pt: `Hora ${a}`,
                            nl: `Uur ${a}`,
                            fr: `Heure ${a}`,
                            it: `Ora ${a}`,
                            es: `Hora ${a}`,
                            pl: `Godzina ${a}`,
                            uk: `Година ${a}`,
                            "zh-cn": `${a} 小时`,
                        },
                        desc: `Hour ${a}`,
                        icon: "img/weather.png",
                    };
                    const path = `minutely.day${`0${i}`.slice(-2)}.hour${`0${a}`.slice(-2)}`;
                    await this.createDataPoint(path, common, "folder", null, null);
                    for (let b = 0; b < 4; b++) {
                        common = {
                            name: {
                                en: `Minute ${b}`,
                                de: `Minute ${b}`,
                                ru: `Минута ${b}`,
                                pt: `Minuto ${b}`,
                                nl: `Minuut ${b}`,
                                fr: `Minute ${b}`,
                                it: `Minuto ${b}`,
                                es: `Minuto ${b}`,
                                pl: `Chwila ${b}`,
                                uk: `хвилина ${b}`,
                                "zh-cn": `${b} 分钟`,
                            },
                            desc: `Minute ${b}`,
                            icon: "img/weather.png",
                        };
                        await this.createDataPoint(`${path}.minute${min[b]}`, common, "folder", null, null);
                        common = {
                            type: "string",
                            role: "date",
                            name: {
                                en: "Date",
                                de: "Datum",
                                ru: "Дата",
                                pt: "Data",
                                nl: "Datum",
                                fr: "Date",
                                it: "Data",
                                es: "Fecha",
                                pl: "Data",
                                uk: "Дата",
                                "zh-cn": "日期",
                            },
                            desc: "Date",
                            read: true,
                            write: false,
                        };
                        await this.createDataPoint(`${path}.minute${min[b]}.time`, common, "state", null, null);
                        await this.createObjectsStates(arrM, `${path}.minute${min[b]}`);
                    }
                }
            }
        } else {
            await this.delObjectAsync(`minutely`, { recursive: true });
        }
        common = {
            type: "boolean",
            role: "button",
            name: {
                en: "Manuel update",
                de: "Manuelles Update",
                ru: "Обновление мануала",
                pt: "Atualização do Manuel",
                nl: "Handmatige update",
                fr: "Mise à jour du manuel",
                it: "Aggiornamento manuale",
                es: "Actualización de Manuel",
                pl: "Aktualizacja podręcznika",
                uk: "Оновлення вручну",
                "zh-cn": "手册更新",
            },
            desc: "Manuel update",
            read: true,
            write: true,
            def: false,
        };
        await this.createDataPoint(`update`, common, "state", false, null);
        common = {
            type: "string",
            role: "json",
            name: {
                en: "Parameter",
                de: "Parameter",
                ru: "Параметр",
                pt: "Parâmetro",
                nl: "Parameter",
                fr: "Paramètre",
                it: "Parametro",
                es: "Parámetro",
                pl: "Parametr",
                uk: "Параметр",
                "zh-cn": "参数",
            },
            desc: "Parameter",
            read: true,
            write: true,
            def: JSON.stringify({}),
        };
        await this.createDataPoint(`param`, common, "state", JSON.stringify({}), null);
        common = {
            type: "string",
            role: "json",
            name: {
                en: "Request result as JSON",
                de: "Anfrageergebnis als JSON",
                ru: "Результат запроса JSON",
                pt: "Resultado de solicitação como JSON",
                nl: "Resultaat aanvraag als JSON",
                fr: "Résultat de la demande en JSON",
                it: "Richiedi il risultato come JSON",
                es: "Resultado de la solicitud como JSON",
                pl: "Wynik wniosku jako JSON",
                uk: "Результати пошуку в JSON",
                "zh-cn": "JSON的要求结果",
            },
            desc: "Request result as JSON",
            read: true,
            write: false,
            def: "{}",
        };
        await this.createDataPoint(`result`, common, "state", "{}", null);
        common = {
            type: "string",
            role: "json",
            name: {
                en: "Status",
                de: "Status",
                ru: "Статус",
                pt: "Estado",
                nl: "Status",
                fr: "État",
                it: "Stato",
                es: "Situación",
                pl: "Status",
                uk: "Статус на сервери",
                "zh-cn": "状态",
            },
            desc: "Status",
            read: true,
            write: false,
            def: "{}",
        };
        await this.createDataPoint(`status`, common, "state", "{}", null);
        common = {
            type: "number",
            role: "value.time",
            name: {
                en: "Last update",
                de: "Letzte Aktualisierung",
                ru: "Последнее обновление",
                pt: "Última atualização",
                nl: "Laatste update",
                fr: "Dernière mise à jour",
                it: "Ultimo aggiornamento",
                es: "Última actualización",
                pl: "Ostatnia aktualizacja",
                uk: "Останнє оновлення",
                "zh-cn": "上次更新",
            },
            desc: "Last update",
            read: true,
            write: false,
        };
        await this.createDataPoint(`last_update`, common, "state", null, null);
    },
    /**
     * @param {string} ident
     * @param {object} common
     * @param {string} types
     * @param {string|number|boolean|null|undefined} value
     * @param {object|null|undefined} [native=null]
     */
    async createDataPoint(ident, common, types, value, native) {
        this.stateCheck.push(`${this.namespace}.${ident}`);
        try {
            const nativvalue = !native ? { native: {} } : { native: native };
            const obj = await this.getObjectAsync(ident);
            if (!obj) {
                await this.setObjectNotExistsAsync(ident, {
                    type: types,
                    common: common,
                    ...nativvalue,
                }).catch(error => {
                    this.log.warn(`createDataPoint: ${error}`);
                });
            } else {
                let ischange = false;
                if (Object.keys(obj.common).length == Object.keys(common).length) {
                    for (const key in common) {
                        if (obj.common[key] == null) {
                            ischange = true;
                            break;
                        } else if (JSON.stringify(obj.common[key]) != JSON.stringify(common[key])) {
                            ischange = true;
                            break;
                        }
                    }
                } else {
                    ischange = true;
                }
                if (JSON.stringify(obj.type) != JSON.stringify(types)) {
                    ischange = true;
                }
                if (native) {
                    if (Object.keys(obj.native).length == Object.keys(nativvalue.native).length) {
                        for (const key in obj.native) {
                            if (nativvalue.native[key] == null) {
                                ischange = true;
                                delete obj["native"];
                                obj["native"] = native;
                                break;
                            } else if (JSON.stringify(obj.native[key]) != JSON.stringify(nativvalue.native[key])) {
                                ischange = true;
                                obj.native[key] = nativvalue.native[key];
                                break;
                            }
                        }
                    } else {
                        ischange = true;
                    }
                }
                if (ischange) {
                    this.log.debug(`INFORMATION - Change common: ${this.namespace}.${ident}`);
                    delete obj["common"];
                    obj["common"] = common;
                    obj["type"] = types;
                    await this.setObjectAsync(ident, obj);
                }
            }
            if (value != null) {
                await this.setStateAsync(ident, value, true);
            }
        } catch (error) {
            this.log.warn(`createDataPoint e: ${error}`);
        }
    },
};
