var science = science || {
    version: "0.0.1"
};
science.gregorian = science.gregorian || {

    isLeapYear: function (year) {
        return ((year % 4) === 0) && (!(((year % 100) === 0) && ((year % 400) !== 0)));
    }

};
science.julian = science.julian || {

    JULIAN_DAY: "jd",
    JULIAN_TIME: "jt",
    MODIFIED_JULIAN_DAY: "mjd",
    JULIAN_CALENDAR_DATE: "jcd",

    GREGORIAN: "gregorian",
    UNIX: "unix",

    convert: function (date, from, to) {

        if (from === to) return date;

        function floor(value) {
            return parseInt(value, 10);
        }
        switch (from) {
            case this.GREGORIAN:
                var year    = date.getUTCFullYear();
                var month   = date.getUTCMonth() + 1;
                var day     = date.getUTCDate();
                var hours   = date.getUTCHours();
                var minutes = date.getUTCMinutes();
                var seconds = date.getUTCSeconds();
                switch (to) {
                    case this.JULIAN_DAY:
                        return (1721425.5) +
                               (365 * (year - 1)) +
                               (floor((year - 1) / 4)) +
                               (-floor((year - 1) / 100)) +
                               (floor((year - 1) / 400)) +
                               (floor((367 * month - 362) / 12)) +
                               ((month < 3) ? 0 : (science.gregorian.isLeapYear(year) ? -1 : -2)) +
                               day;
                    case this.JULIAN_TIME:
                        if(year < 1000) {
                            year += 1900;
                        }
                        var uniTime = hours + (minutes / 60) + (seconds / 3600);
                        var sign    = (100 * year + month - 190002.5 >= 0) ? 1 : -1;
                        var part1   = 367 * year;
                        var part2   = floor((7 * (year + floor((month + 9) / 12))) / 4);
                        var part3   = day + floor((275 * month) / 9);
                        var part4   = 1721013.5 + (uniTime / 24);
                        var part5   = 0.5 * sign;

                        return part1 - part2 + part3 + part4 - part5 + 0.5;
                    case this.JULIAN_CALENDAR_DATE:
                        var a, b, c, e;
                        var jd = this.convert(date, this.GREGORIAN, this.JULIAN_DAY) + 0.5;
                        a = floor(jd) + 1524;
                        b = floor((a - 122.1) / 365.25);
                        c = floor(365.25 * b);
                        e = floor((a - c) / 30.6001);
                        month = floor((e < 14) ? (e - 1) : (e - 13));
                        year = floor((month > 2) ? (b - 4716) : (b - 4715));
                        day = a - c - floor(30.6001 * e);
                        if (year < 1) {
                            year--;
                        }
                        return [year, month, day];
                    case this.MODIFIED_JULIAN_DAY:
                        return this.convert(date, this.GREGORIAN, this.JULIAN_DAY) - 2400000.5;
                }
                break;
            case this.UNIX:
                return date / 86400 + 2440587.5;
        }
    }

};
science.sidereal = science.sidereal || {

    getMeanSiderealTime: function (date, long) {

        var julianTime = science.julian.convert(date, science.julian.GREGORIAN, science.julian.JULIAN_TIME);

        // Time since J2000.0
        var normalizedJulianTime = julianTime - 2451545.0;
        julianTime = normalizedJulianTime / 36525.0;
        var GMST = 280.46061837 + 360.98564736629 * normalizedJulianTime;
        var meanSiderealTime = GMST + 0.000387933 * Math.pow(julianTime, 2) - Math.pow(julianTime, 3) / 38710000 + long;
        meanSiderealTime %= 360;
        return meanSiderealTime;
    }

};
science.earth = science.earth || (function () {

    return {

        //The primary orbital elements are here denoted as:

        // longitude of the ascending node
        N: -11.26064,

        // inclination to the ecliptic (plane of the Earth's orbit)
        i: 0.000,

        // argument of perihelion
        w: 114.20783,

        // semi-major axis, or mean distance from Sun
        a: 149.60,

        // eccentricity (0=circle, 0-1=ellipse, 1=parabola)
        e: 0.0167,

        // mean anomaly (0 at perihelion; increases uniformly with time)
        M: 265.8,

        // Related orbital elements are:
        //
        // longitude of perihelion
        w1: this.N + this.w,

        // mean longitude
        L: this.M + this.w1,

        // perihelion distance
        q: this.a * (1 - this.e),

        // aphelion distance
        Q: this.a * (1 + this.e),

        // orbital period (years if a is in AU, astronomical units)
        P: Math.pow(this.a, 1.5),

        // time of perihelion
        //T: Epoch_of_M - (M(deg)/360_deg) / P

        //true anomaly (angle between position and perihelion)
        v: this.M + 180 / Math.PI * ((2* this.e - Math.pow(this.e,3) / 4) * Math.sin(this.M) + 5/4 * Math.pow(this.e, 2) * Math.sin(2 * this.M) + 13/12 * Math.pow(this.e, 3) * Math.sin(3 * this.M)),

        //eccentric anomaly
        E: 0.0167,


        getTilt: function(julianTime) {
            return 23.4393 - 0.0000003563 * julianTime;
        }

    };

}());
science.sun = science.sun || (function () {

    return {

        // longitude of the ascending node
        N: 0.0,

        // inclination to the ecliptic
        i: 0.0,

        // argument of perihelion
        w: function (julianTime) { return 282.9404 + 0.0000470935 * julianTime; },

        // semi-major axis
        a: 1.000000,

        // eccentricity (0=circle, 0-1=ellipse, 1=parabola)
        e: function (julianTime) { return 0.016709 - 0.000000001151 * julianTime; },

        // mean anomaly (0 at perihelion; increases uniformly with time)
        M: function (julianTime) { return 356.0470 + 0.9856002585 * julianTime; },

        coordinateToSunPosition: function(date, lat, long) {

            var j = science.julian.convert(date, science.julian.GREGORIAN, science.julian.JULIAN_DATE_TIME) - 2451545;
            var DEG_TO_RAD = Math.PI / 180;
            var RAD_TO_DEG = 180 / Math.PI;

            var meanLongitude = (280.461 + 0.9856474 * j) % 360;
            var meanAnomaly = (357.528 + 0.9856003 * j) % 360;

            var eclipticLongitude = (meanLongitude + 1.915 * Math.sin(meanAnomaly * DEG_TO_RAD) + 0.020 * Math.sin(2 * (meanAnomaly * DEG_TO_RAD))) % 360;
            var obliquityOfEcliptic = 23.439 - 0.0000004 * j;

            var num = Math.cos(obliquityOfEcliptic * DEG_TO_RAD) * Math.sin(eclipticLongitude * DEG_TO_RAD);
            var den = Math.cos(eclipticLongitude * DEG_TO_RAD);

            var rightAscension = Math.atan(num / den);

            if(den < 0) rightAscension += Math.PI;
            else if(den > 0 && num < 0) rightAscension += Math.PI * 2;

            var declination = Math.asin(Math.sin(obliquityOfEcliptic * DEG_TO_RAD) * Math.sin(eclipticLongitude * DEG_TO_RAD));

            rightAscension = rightAscension / DEG_TO_RAD;

            var ha = science.sidereal.getMeanSiderealTime(date, long) - rightAscension;
            if(ha < 0) ha = ha + 360;

            ha = ha * DEG_TO_RAD;
            lat = lat * DEG_TO_RAD;

            var sineAltitude = Math.sin(declination) * Math.sin(lat) + Math.cos(declination) * Math.cos(lat) * Math.cos(ha);
            var altitude = Math.asin(sineAltitude);

            var cosineAzimuth = (Math.sin(declination) - Math.sin(altitude) * Math.sin(lat)) / (Math.cos(altitude) * Math.cos(lat));
            var azimuth = Math.acos(cosineAzimuth);

            var horizontalAltitude = altitude * RAD_TO_DEG;
            var horizontalAzimuth = azimuth * RAD_TO_DEG;

            if(Math.sin(ha) > 0) horizontalAzimuth = 360 - horizontalAzimuth;

            return {azimuth:horizontalAzimuth, altitude:horizontalAltitude};
        }
    };

}());
science.temperature = science.temperature || {

    CELCIUS: "celcius",
    FAHRENHEIT: "fahrenheit",
    KELVIN: "kelvin",
    RANKINE: "rankine",
    REAUMUR: "reaumur",

    UNITS: {
        celcius: "°C",
        fahrenheit: "°F",
        kelvin: "K",
        rankine: "°Ra",
        reaumur: "°Re"
    },

    unit: function (value) {
        return this.UNITS[value] || null;
    },

    convert: function(value, from, to) {

        if (from === to) return value;

        switch(from) {
            case this.CELCIUS:
                switch (to) {
                    case this.FAHRENHEIT: return value * 1.8 + 32;
                    case this.KELVIN: return value + 273.15;
                    case this.RANKINE: return value * 1.8 + 491.67;
                    case this.REAUMUR: return value * 0.8;
                    default: throw "Unkown temperature scale.";
                }
                break;
            case this.FAHRENHEIT: return this.convert((value - 32) * 5 / 9, this.CELCIUS, to);
            case this.KELVIN:     return this.convert(value - 273.15, this.CELCIUS, to);
            case this.RANKINE:    return this.convert((value - 491.67) / 1.8, this.CELCIUS, to);
            case this.REAUMUR:    return this.convert(value * 1.25, this.CELCIUS, to);
            default: throw "Unkown temperature scale.";
        }
        return null;
    }

};
science.wind = science.wind || {

    METERS_PER_SECOND: "mps",
    METERS_PER_MINUTE: "mpm",
    MILES_PER_HOUR: "mph",
    FEET_PER_SECOND: "fps",
    FEET_PER_MINUTE: "fpm",
    KILOMETERS_PER_HOUR: "kmph",
    KNOTS: "knots",
    BEAUFORT: "beaufort",
    SAFFIR_SIMPSON: "saffirsimpson",

    UNITS: {
        mps: "m/s",
        mpm: "m/m",
        mph: "mph",
        fps: "feet/s",
        fpm: "feet/m",
        kmph: "km/h",
        knots: "knots",
        beaufort: "Beaufort",
        saffirsimpson: "SSHS",
    },

    unit: function (value) {
        return this.UNITS[value] || null;
    },

    convert: function(value, from, to) {

        if (from === to) return value;

        switch(from) {
            case this.METERS_PER_SECOND:
                switch (to) {
                    case this.METERS_PER_MINUTE: return value * 60;
                    case this.MILES_PER_HOUR: return value * 2.23694;
                    case this.FEET_PER_SECOND: return value * 3.28084;
                    case this.FEET_PER_MINUTE: return value * 196.850393701;
                    case this.KILOMETERS_PER_HOUR: return value * 3.6;
                    case this.KNOTS: return value * 1.94384;
                    case this.BEAUFORT:
                        // loop through array would be nice but not necessary
                        if (value < 0.3) return 0;
                        if (value <= 1.5) return 1;
                        if (value <= 3.4) return 2;
                        if (value <= 5.4) return 3;
                        if (value <= 7.9) return 4;
                        if (value <= 10.7) return 5;
                        if (value <= 13.8) return 6;
                        if (value <= 17.1) return 7;
                        if (value <= 20.7) return 8;
                        if (value <= 24.4) return 9;
                        if (value <= 28.4) return 10;
                        if (value <= 32.6) return 11;
                        return 12;
                    case this.SAFFIR_SIMPSON:
                        if (value < 33) return null;
                        if (value <= 42) return 1;
                        if (value <= 49) return 2;
                        if (value <= 58) return 3;
                        if (value <= 70) return 4;
                        if (value > 70) return 5;
                        return null;
                    default: throw "Unkown temperature scale.";
                }
                break;
            case this.METERS_PER_MINUTE: return this.convert(value / 60, this.METERS_PER_SECOND, to);
            case this.MILES_PER_HOUR: return this.convert(value / 0.44704, this.METERS_PER_SECOND, to);
            case this.FEET_PER_SECOND: return this.convert(value / 0.3048, this.METERS_PER_SECOND, to);
            case this.FEET_PER_MINUTE: return this.convert(value / 0.0051, this.METERS_PER_SECOND, to);
            case this.KILOMETERS_PER_HOUR: return this.convert(value / 3.6, this.METERS_PER_SECOND, to);
            case this.KNOTS: return this.convert(value / 0.514444444, this.METERS_PER_SECOND, to);
            case this.BEAUFORT: throw "Beaufort scale is one-directional.";
            case this.SAFFIR_SIMPSON: throw "Saffir-Simpson scale is one-directional.";
            default: throw "Unkown temperature scale.";
        }
        return null;
    }

};
science.point = science.point || {

    /**
     * Returns the angle in radians between two points.
     * @param  {Number} x1 Point 1 X-axis
     * @param  {Number} y1 Point 1 Y-axis
     * @param  {Number} x2 Point 2 X-axis
     * @param  {Number} y2 Point 2 Y-axis
     * @return {Number}    Angle in radians
     */
    angleBetweenPoints: function (x1, y1, x2, y2) {
        return Math.atan2(y2 - y1, x2 - x1);
    },

    /**
     * Returns true if the `x`, `y` coordinate is within the
     * specified `polygon`.
     * @param  {Number}  x       X-axis
     * @param  {Number}  y       Y-axis
     * @param  {Array}   polygon Array of coordinates as [{x, y}, {x, y}]
     * @return {Boolean}         Inside polygon or not.
     */
    isInPolygon: function (x, y, polygon) {

        var i, j, len = polygon.length;
        var inside = false;
        for (i = 0, j = len - 1; i < len; j = i++) {
            if(((polygon[i].y > y) != (polygon[j].y > y)) && (x < (polygon[j].x-polygon[i].x) * (y-polygon[i].y) / (polygon[j].y-polygon[i].y) + polygon[i].x) ) inside = !inside;
        }
        return inside;
    }

};