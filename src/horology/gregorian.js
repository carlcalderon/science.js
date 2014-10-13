science.gregorian = science.gregorian || {

    isLeapYear: function (year) {
        return ((year % 4) === 0) && (!(((year % 100) === 0) && ((year % 400) !== 0)));
    }

};