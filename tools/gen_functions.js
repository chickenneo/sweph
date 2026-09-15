// Concatenates src/functions/*.cpp into src/functions.cpp for the addon build.
// Each file is wrapped so its local `args` identifiers stay unique.

const { readdirSync, readFileSync, writeFileSync } = require("fs");
const { join } = require("path");

const dir = join(__dirname, "..", "src", "functions");
const out = readdirSync(dir)
	.map((name, i) => readFileSync(join(dir, name), "utf8")
		.replace(/args/g, "args" + i)
		.replace("#include <sweph.h>", ""))
	.reduce((a, b) => a + b, "#include <sweph.h>");

writeFileSync(join(__dirname, "..", "src", "functions.cpp"), out, "utf8");
console.log("generated src/functions.cpp");
