test("science.gregorian", function () {
  equal(science.gregorian.isLeapYear(2004), true, "2004 is a leap year");
  equal(science.gregorian.isLeapYear(2005), false, "2005 is not a leap year");
});

test("science.julian", function (assert) {
  equal(science.julian.convert(new Date(2013, 8, 26), science.julian.GREGORIAN, science.julian.JULIAN_DAY), 2456561.5, "Gregorian 2013-09-26 to Julian Day");
  assert.close(science.julian.convert(new Date(2013, 8, 26), science.julian.GREGORIAN, science.julian.JULIAN_TIME), 2456561.416666667, 0.000000001, "Gregorian 2013-09-26 to Julian Time");
  equal(science.julian.convert(new Date(2013, 8, 26), science.julian.GREGORIAN, science.julian.MODIFIED_JULIAN_DAY), 56561, "Gregorian 2013-09-26 to Modified Julian Day");
  equal(science.julian.convert(1380153600, science.julian.UNIX, science.julian.JULIAN_DAY), 2456561.5, "Unix timestamp 1380153600 to Julian Day");
  deepEqual(science.julian.convert(new Date(2013, 8, 26), science.julian.GREGORIAN, science.julian.JULIAN_CALENDAR_DATE), [2013, 9, 13], "Gregorian 2013-09-26 to Julian Calendar Date");
});

test("science.temperature", function (assert) {
  assert.close(science.temperature.convert(20, science.temperature.CELCIUS, science.temperature.FAHRENHEIT), 68, 0.000000001, "Celcius to Fahrenheit");
  assert.close(science.temperature.convert(68, science.temperature.FAHRENHEIT, science.temperature.CELCIUS), 20, 0.000000001, "Fahrenheit to Celcius");
  assert.close(science.temperature.convert(20, science.temperature.CELCIUS, science.temperature.KELVIN), 293.15, 0.000000001, "Celcius to Kelvin");
  assert.close(science.temperature.convert(20, science.temperature.CELCIUS, science.temperature.RANKINE), 527.67, 0.000000001, "Celcius to Rankine");
  assert.close(science.temperature.convert(20, science.temperature.CELCIUS, science.temperature.REAUMUR), 16, 0.000000001, "Celcius to Réaumur");
});

test("science.point", function (assert) {
  var rect = [
    {x: 0, y: 0},
    {x: 1, y: 0},
    {x: 1, y: 1},
    {x: 0, y: 1}
  ];
  equal(science.point.isInPolygon(0.5, 0.5, rect), true, "Point inside Polygon: true (0.5, 0.5, [{x: 0, y: 0},{x: 1, y: 0},{x: 1, y: 1},{x: 0, y: 1}])");
  equal(science.point.isInPolygon(0.9, 0.1, rect), true, "Point inside Polygon: true (0.9, 0.1, [{x: 0, y: 0},{x: 1, y: 0},{x: 1, y: 1},{x: 0, y: 1}])");
  equal(science.point.isInPolygon(0.1, 0.9, rect), true, "Point inside Polygon: true (0.1, 0.9, [{x: 0, y: 0},{x: 1, y: 0},{x: 1, y: 1},{x: 0, y: 1}])");
  equal(science.point.isInPolygon(0.9, 0.9, rect), true, "Point inside Polygon: true (0.9, 0.9, [{x: 0, y: 0},{x: 1, y: 0},{x: 1, y: 1},{x: 0, y: 1}])");
  equal(science.point.isInPolygon(0.1, 0.1, rect), true, "Point inside Polygon: true (0.1, 0.1, [{x: 0, y: 0},{x: 1, y: 0},{x: 1, y: 1},{x: 0, y: 1}])");
  equal(science.point.isInPolygon(2, 2, rect), false, "Point inside Polygon: false (2, 2, [{x: 0, y: 0},{x: 1, y: 0},{x: 1, y: 1},{x: 0, y: 1}])");
  equal(science.point.isInPolygon(1.1, 0, rect), false, "Point inside Polygon: false (1.1, 0, [{x: 0, y: 0},{x: 1, y: 0},{x: 1, y: 1},{x: 0, y: 1}])");
  equal(science.point.isInPolygon(0.1, -0.1, rect), false, "Point inside Polygon: false (0.1, -0.1, [{x: 0, y: 0},{x: 1, y: 0},{x: 1, y: 1},{x: 0, y: 1}])");
  equal(science.point.isInPolygon(-0.1, -0.1, rect), false, "Point inside Polygon: false (-0.1, -0.1, [{x: 0, y: 0},{x: 1, y: 0},{x: 1, y: 1},{x: 0, y: 1}])");
  equal(science.point.isInPolygon(1, -0.1, rect), false, "Point inside Polygon: false (1, -0.1, [{x: 0, y: 0},{x: 1, y: 0},{x: 1, y: 1},{x: 0, y: 1}])");
  equal(science.point.isInPolygon(1, 1.1, rect), false, "Point inside Polygon: false (1, 1.1, [{x: 0, y: 0},{x: 1, y: 0},{x: 1, y: 1},{x: 0, y: 1}])");
  equal(science.point.isInPolygon(0.1, 1.1, rect), false, "Point inside Polygon: false (0.1, 1.1, [{x: 0, y: 0},{x: 1, y: 0},{x: 1, y: 1},{x: 0, y: 1}])");
  equal(science.point.distance(2.3, 4.5, 5.6, 7.8),  4.666904755831213, "Distance between two points.");
  equal(science.point.distanceToLine(2.3, 4.5, 5.6, 7.8, 9.1, 1.2),  4.461483615445308, "Distance between two points.");
});

test("science.math", function (assert) {
  equal(science.math.within(0, -1, 1), true, "0 within -1 to 1");
  equal(science.math.within(-1, -1, 1), true, "-1 within -1 to 1");
  equal(science.math.within(-1.000001, -1, 1), false, "-1.000001 not within -1 to 1");
  equal(science.math.interpolate(0.3, 0, 100), 30, "30% of 0 to 100 is 30");
  equal(science.math.interpolate(0.3, -10, 100), 33, "30% of 0 to 100 is 33");
  equal(science.math.fits(0.3, 1), true, "0.3 fits within 1");
  equal(science.math.fits(0, 1), true, "0 fits within 1");
  equal(science.math.fits(1, -1), true, "1 fits within -1");
  equal(science.math.fits(0.0001, 0), false, "0.0001 does not fit within 0");
  equal(science.math.inRange(0.02, 0.1, 0.1), false, "0.02 is not in 10% range of 0.1");
  equal(science.math.inRange(1, 2, 0.5), true, "1 is in 50% range of 2");
  equal(science.math.inRange(2.9, 3, 0.1), true, "2.9 is in 10% range of 3");
});