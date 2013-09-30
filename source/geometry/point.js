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
     * @param  {Array}   polygon Array of coordinates as [x1, y1, x2, y2, x3...]
     * @return {Boolean}         Inside polygon or not.
     */
    isInPolygon: function (x, y, polygon) {

        var total = 0, i = polygon.length - 2;
        for (;i>=0;i-=2) {
            total += this.angleBetweenPoints(x, y, polygon[i], polygon[i+1]);
        }
        return Math.abs(total) <= 1;

    }

};