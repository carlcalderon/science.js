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
  equal(science.point.isInPolygon(0.5, 0.5, [0, 0, 1, 0, 1, 1, 0, 1]), true, "Point inside Polygon: true");
  equal(science.point.isInPolygon(0.9, 0.1, [0, 0, 1, 0, 1, 1, 0, 1]), true, "Point inside Polygon: true");
  equal(science.point.isInPolygon(0.1, 0.9, [0, 0, 1, 0, 1, 1, 0, 1]), true, "Point inside Polygon: true");
  equal(science.point.isInPolygon(0.9, 0.9, [0, 0, 1, 0, 1, 1, 0, 1]), true, "Point inside Polygon: true");
  equal(science.point.isInPolygon(0.1, 0.1, [0, 0, 1, 0, 1, 1, 0, 1]), true, "Point inside Polygon: true");
  equal(science.point.isInPolygon(2, 2, [0, 0, 1, 0, 1, 1, 0, 1]), false, "Point inside Polygon: false");
  equal(science.point.isInPolygon(1.1, 0, [0, 0, 1, 0, 1, 1, 0, 1]), false, "Point inside Polygon: false");
  equal(science.point.isInPolygon(0.1, -0.1, [0, 0, 1, 0, 1, 1, 0, 1]), false, "Point inside Polygon: false");
  equal(science.point.isInPolygon(-0.1, -0.1, [0, 0, 1, 0, 1, 1, 0, 1]), false, "Point inside Polygon: false");
  equal(science.point.isInPolygon(1, -0.1, [0, 0, 1, 0, 1, 1, 0, 1]), false, "Point inside Polygon: false");
  equal(science.point.isInPolygon(1, 1.1, [0, 0, 1, 0, 1, 1, 0, 1]), false, "Point inside Polygon: false");
  equal(science.point.isInPolygon(0.1, 1.1, [0, 0, 1, 0, 1, 1, 0, 1]), false, "Point inside Polygon: false");
});