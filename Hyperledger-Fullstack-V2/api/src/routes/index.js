const express = require("express");
const _birthRoute = require("./birth").default
const router = new express.Router();
/**
 * Primary app routes.
 */
router.use("/birthcertificate", _birthRoute);

module.exports = router;
