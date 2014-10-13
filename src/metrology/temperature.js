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