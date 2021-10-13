const express = require("express");
const router = express.Router();
const ProfilController = require("../Controller/ProfilController");
const Protect = require("../middleware/protect");

router.get("/", Protect.protect, ProfilController.getMyProfil); // X

module.exports = router;