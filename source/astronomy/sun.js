science.sun = science.sun || (function () {

    function getMeanSiderealTime(date, long) {

        var julianDate = science.julian.convert(date, science.julian.GREGORIAN, science.julian.JULIAN_DATE_TIME);

        // Time since J2000.0
        var normalizedJulianDate = julianDate - 2451545.0;
        var julianTime = normalizedJulianDate / 36525.0;
        var GMST = 280.46061837 + 360.98564736629 * normalizedJulianDate;
        var meanSiderealTime = GMST + 0.000387933 * Math.pow(julianTime, 2) - Math.pow(julianTime, 3) / 38710000 + long;
        meanSiderealTime %= 360;
        return meanSiderealTime;
    }

    return {
        coordinateToSunPosition: function(date, lat, long) {

            var j = science.julian.convert(date, science.julian.GREGORIAN, science.julian.JULIAN_DATE_TIME) - 2451545;
            var DEG_TO_RAD = Math.PI / 180;
            var RAD_TO_DEG = 180 / Math.PI;

            var meanLongitude = (280.461 + 0.9856474 * j) % 360;
            var meanAnomaly = (357.528 + 0.9856003 * j) % 360

            var eclipticLongitude = (meanLongitude + 1.915 * Math.sin(meanAnomaly * DEG_TO_RAD) + 0.020 * Math.sin(2 * (meanAnomaly * DEG_TO_RAD))) % 360;
            var obliquityOfEcliptic = 23.439 - 0.0000004 * j;

            var num = Math.cos(obliquityOfEcliptic * DEG_TO_RAD) * Math.sin(eclipticLongitude * DEG_TO_RAD);
            var den = Math.cos(eclipticLongitude * DEG_TO_RAD);

            var rightAscension = Math.atan(num / den);

            if(den < 0) rightAscension += Math.PI;
            else if(den > 0 && num < 0) rightAscension += Math.PI * 2;

            var declination = Math.asin(Math.sin(obliquityOfEcliptic * DEG_TO_RAD) * Math.sin(eclipticLongitude * DEG_TO_RAD));

            rightAscension = rightAscension / DEG_TO_RAD;

            var ha = getMeanSiderealTime(date, long) - rightAscension;
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
    }

}());