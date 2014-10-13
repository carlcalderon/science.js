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