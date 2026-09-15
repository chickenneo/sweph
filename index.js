const s = require("./sweph.node");
const c = require("./constants.js");

const sweph = {
    ...s,
    constants: c
};

sweph.default = sweph;

module.exports = sweph;
