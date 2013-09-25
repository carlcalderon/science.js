science.sun = science.sun || {

    getJulianDate: function(date) {
        var year    = date.getUTCFullYear();
        var month   = date.getUTCMonth() + 1;
        var day     = date.getUTCDate();
        var hour    = date.getUTCHours();
        var minutes = date.getUTCMinutes();
        var seconds = date.getUTCSeconds();

        if(year < 1000) {
            year += 1900;
        }

        var uniTime = hour + (minutes / 60) + (seconds / 3600);
        var sign    = (100 * year + month - 190002.5 >= 0) ? 1 : -1;
        var part1   = 367 * year;
        var part2   = parseInt((7 * (year + parseInt((month + 9) / 12, 10))) / 4, 10);
        var part3   = day + parseInt((275 * month) / 9, 10);
        var part4   = 1721013.5 + (uniTime / 24);
        var part5   = 0.5 * sign;

        return part1 - part2 + part3 + part4 - part5 + 0.5;
    },

    getMeanSiderealTime: function(date, long) {

        var julianDate = this.getJulianDate(date) - 2451545.0;
        var julianTime = julianDate / 36525.0;
        var meanSiderealTime = 280.46061837 + 360.98564736629 * julianDate + 0.000387933 * julianTime * julianTime - julianTime * julianTime * julianTime / 38710000 + long;

        if(meanSiderealTime > 0.0) {
            while(meanSiderealTime > 360.0) meanSiderealTime -= 360.0;
        } else {
            while(meanSiderealTime < 0.0) meanSiderealTime += 360.0;
        }
        return meanSiderealTime;
    },

    coordinateToSunPosition: function(date, lat, long) {

        var j = this.getJulianDate(date) - 2451545;
        var DEG_TO_RAD = Math.PI / 180;
        var RAD_TO_DEG = 180 / Math.PI;

        var meanLongitude = 280.461 + 0.9856474 * j;
        while(meanLongitude > 360) meanLongitude -= 360;
        while(meanLongitude < 0) meanLongitude += 360;

        var meanAnomaly = 357.528 + 0.9856003 * j;
        while(meanAnomaly > 360) meanAnomaly -= 360;
        while(meanAnomaly < 0) meanAnomaly += 360;

        var eclipticLongitude = (meanLongitude + 1.915 * Math.sin(meanAnomaly * DEG_TO_RAD) + 0.020 * Math.sin(2 * (meanAnomaly * DEG_TO_RAD))) % 360;
        var obliquityOfEcliptic = 23.439 - 0.0000004 * j;

        var num = Math.cos(obliquityOfEcliptic * DEG_TO_RAD) * Math.sin(eclipticLongitude * DEG_TO_RAD);
        var den = Math.cos(eclipticLongitude * DEG_TO_RAD);

        var rightAscension = Math.atan(num / den);

        if(den < 0) rightAscension += Math.PI;
        else if(den > 0 && num < 0) rightAscension += Math.PI * 2;

        var declination = Math.asin(Math.sin(obliquityOfEcliptic * DEG_TO_RAD) * Math.sin(eclipticLongitude * DEG_TO_RAD));

        rightAscension = rightAscension / DEG_TO_RAD;

        var ha = this.getMeanSiderealTime(date, long) - rightAscension;
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