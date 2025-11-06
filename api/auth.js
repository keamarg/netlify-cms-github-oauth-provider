const provider = require("../index.js");
module.exports = (req, res) => provider.auth(req, res);
