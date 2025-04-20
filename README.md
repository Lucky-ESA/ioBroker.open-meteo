![Logo](admin/open-meteo.png)

# ioBroker.open-meteo

[![NPM version](https://img.shields.io/npm/v/iobroker.open-meteo.svg)](https://www.npmjs.com/package/iobroker.open-meteo)
[![Downloads](https://img.shields.io/npm/dm/iobroker.open-meteo.svg)](https://www.npmjs.com/package/iobroker.open-meteo)
![Number of Installations](https://iobroker.live/badges/open-meteo-installed.svg)
![Current version in stable repository](https://iobroker.live/badges/open-meteo-stable.svg)
![GitHub size](https://img.shields.io/github/repo-size/Lucky-ESA/ioBroker.open-meteo)</br>
![GitHub commit activity](https://img.shields.io/github/commit-activity/m/Lucky-ESA/ioBroker.open-meteo)
![GitHub commits since latest release](https://img.shields.io/github/commits-since/Lucky-ESA/ioBroker.open-meteo/latest)
![GitHub last commit](https://img.shields.io/github/last-commit/Lucky-ESA/ioBroker.open-meteo)
![GitHub issues](https://img.shields.io/github/issues/Lucky-ESA/ioBroker.open-meteo)</br>
**Version:** </br>
![Current version in stable repository](https://iobroker.live/badges/open-meteo-stable.svg)

[![NPM](https://nodei.co/npm/iobroker.open-meteo.png?downloads=true)](https://nodei.co/npm/iobroker.open-meteo/)

**Tests:** ![Test and Release](https://github.com/Lucky-ESA/ioBroker.open-meteo/workflows/Test%20and%20Release/badge.svg)

## open-meteo adapter for ioBroker

Weather forecast from [OpenMeteo](https://open-meteo.com/en/docs/dwd-api)

In the instance setting, individual variables can be activated for 15 minutes, hourly, daily and currently.
Each variable has a factor of 1.7 queries. A maximum of 10,000 queries per day is allowed. 79 variables can be selected.
This would be 79 x 1.7 = 134.3 requests per request.

## Icons

The icons are from these providers and are subject to the MIT license!
https://github.com/basmilius/weather-icons
https://github.com/Makin-Things/weather-icons
https://github.com/roe-dl/weathericons

## Requirements

- Node 20 or 22
- JS-Controller >= 6.0.11
- Admin >= 7.0.23

## Description

🇬🇧 [Description](/docs/en/README.md)</br>
🇩🇪 [Beschreibung](/docs/de/README.md)

## Questions

🇩🇪 [Fragen]()

## Changelog

<!--
    Placeholder for the next version (at the beginning of the line):
    ### **WORK IN PROGRESS**
-->

### **WORK IN PROGRESS**

- (Lucky-ESA) initial release

## License

MIT License

Copyright (c) 2025 Lucky-ESA <github@luckyskills.de>

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
