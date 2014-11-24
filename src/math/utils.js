science.math = science.math = {

    within: function (value, low, high) {
        if (low > high) {
            var temp = low;
            low = high;
            high = low;
        }
        return (value >= low) && (value <= high);
    },

    interpolate: function (length, from, to) {
        return length * (to - from);
    },

    fits: function (value, inside) {
        if (value === 0 && inside === 0) {
            return true;
        }
        if (inside === 0) {
            return false;
        }
        if (value === 0) {
            return true;
        }
        return (Math.abs(value) / Math.abs(inside)) > 0;
    },

    inRange: function (value, of, range) {
        return Math.abs((Math.abs(value) - Math.abs(of))) <= Math.abs(range * of);
    }


};