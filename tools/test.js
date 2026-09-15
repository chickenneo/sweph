// Verifies that the addon computes from its embedded ephemeris data.
// set_ephe_path is deliberately never called: if the data were not compiled in,
// Swiss Ephemeris would silently fall back to Moshier and the flag check fails.

const assert = require("assert");
const sweph = require("../index.js");

const c = sweph.constants;
const flags = c.SEFLG_SWIEPH | c.SEFLG_SPEED;

const date = sweph.utc_to_jd(2026, 9, 15, 12, 0, 0, c.SE_GREG_CAL);
assert.strictEqual(date.flag, c.OK, date.error);
const jd_ut = date.data[1];

const expected = [
	[c.SE_SUN, "Sun", 172.6733],
	[c.SE_MOON, "Moon", 225.3429],
	[c.SE_CHIRON, "Chiron", 30.0909], // needs seas_18.se1
];

for (const [body, name, longitude] of expected) {
	const r = sweph.calc_ut(jd_ut, body, flags);
	assert.strictEqual(r.error, "", r.error);
	assert.ok(r.flag & c.SEFLG_SWIEPH, `${name}: fell back to Moshier, embedded data not used`);
	assert.strictEqual(sweph.get_planet_name(body), name);
	assert.ok(Math.abs(r.data[0] - longitude) < 1e-4, `${name}: ${r.data[0]} != ${longitude}`);
}

const star = sweph.fixstar2_ut("Spica", jd_ut, c.SEFLG_SWIEPH); // needs sefstars.txt
assert.strictEqual(star.error, "", star.error);
assert.ok(Math.abs(star.data[0] - 204.2117) < 1e-4, `Spica: ${star.data[0]}`);

const houses = sweph.houses(jd_ut, 44.8125, 20.4612, "P");
assert.strictEqual(houses.data.houses.length, 12);

console.log("OK - embedded ephemeris data in use, no ephemeris path set");
console.log(`  Sun ${sweph.calc_ut(jd_ut, c.SE_SUN, flags).data[0].toFixed(4)}`);
console.log(`  Moon ${sweph.calc_ut(jd_ut, c.SE_MOON, flags).data[0].toFixed(4)}`);
console.log(`  Chiron ${sweph.calc_ut(jd_ut, c.SE_CHIRON, flags).data[0].toFixed(4)}`);
console.log(`  Spica ${star.data[0].toFixed(4)}`);
