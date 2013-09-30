science.earth = science.earth || (function () {

    return {

        //The primary orbital elements are here denoted as:

        // longitude of the ascending node
        N: -11.26064,

        // inclination to the ecliptic (plane of the Earth's orbit)
        i: 0.000,

        // argument of perihelion
        w: 114.20783,

        // semi-major axis, or mean distance from Sun
        a: 149.60,

        // eccentricity (0=circle, 0-1=ellipse, 1=parabola)
        e: 0.0167,

        // mean anomaly (0 at perihelion; increases uniformly with time)
        M: 265.8,

        // Related orbital elements are:
        //
        // longitude of perihelion
        w1: this.N + this.w,

        // mean longitude
        L: this.M + this.w1,

        // perihelion distance
        q: this.a * (1 - this.e),

        // aphelion distance
        Q: this.a * (1 + this.e),

        // orbital period (years if a is in AU, astronomical units)
        P: Math.pow(this.a, 1.5),

        // time of perihelion
        //T: Epoch_of_M - (M(deg)/360_deg) / P

        //true anomaly (angle between position and perihelion)
        v: this.M + 180 / Math.PI * ((2* this.e - Math.pow(this.e,3) / 4) * Math.sin(this.M) + 5/4 * Math.pow(this.e, 2) * Math.sin(2 * this.M) + 13/12 * Math.pow(this.e, 3) * Math.sin(3 * this.M)),

        //eccentric anomaly
        E: 0.0167,


        getTilt: function(julianTime) {
            return 23.4393 - 0.0000003563 * julianTime;
        }

    };

}());