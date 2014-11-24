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
    },

    /**
     * Returns the distance between to points.
     * @param  {Number} x1  Point 1 X-axis
     * @param  {Number} y1  Point 1 Y-axis
     * @param  {Number} x2  Point 2 X-axis
     * @param  {Number} y2  Point 2 Y-axis
     * @return {Number}     Distance
     */
    distance: function (x1, y1, x2, y2) {
        return Math.sqrt((x2-x1)*(x2-x1)+(y2-y1)*(y2-y1));
    },

    /**
     * Returns the shortest distance to a line from a point.
     * @param  {[type]} x    Point X-axis
     * @param  {[type]} y    Point X-axis
     * @param  {[type]} lx1  Line Point 1 X-axis
     * @param  {[type]} ly2  Line Point 1 Y-axis
     * @param  {[type]} lx2  Line Point 2 X-axis
     * @param  {[type]} ly2  Line Point 2 Y-axis
     * @return {[type]}      Distance
     */
    distanceToLine: function (x, y, lx1, ly1, lx2, ly2) {
        var A = x - lx1;
        var B = y - ly1;
        var C = lx2 - lx1;
        var D = ly2 - ly1;
        var dot = A * C + B * D;
        var len_sq = C * C + D * D;
        var param = dot / len_sq;
        var xx, yy;
        if (param < 0 || (lx1 == lx2 && ly1 == ly2)) {
            xx = lx1;
            yy = ly1;
        }
        else if (param > 1) {
            xx = lx2;
            yy = ly2;
        }
        else {
            xx = lx1 + param * C;
            yy = ly1 + param * D;
        }
        return this.distance(x, y, xx, yy);
    }

};