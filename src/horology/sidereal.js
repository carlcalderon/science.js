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