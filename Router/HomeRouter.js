const express = require("express");
const router = express.Router();
const HomeController = require("../Controller/HomeController");
const Protect = require("../middleware/protect");
const isAdmin = require("../middleware/isAdmin");

router.post("/register", HomeController.addUser); // à voir
router.post("/logIn", HomeController.logIn); // à voir
router.get("/", Protect.protect, HomeController.deconnected);
// router.patch("/", HomeController.patchUser);

module.exports = router;