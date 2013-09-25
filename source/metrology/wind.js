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