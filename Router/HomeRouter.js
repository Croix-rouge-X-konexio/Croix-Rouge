const express = require("express");
const router = express.Router();
const HomeController = require("../Controller/HomeController");
const Protect = require("../middleware/protect");
const multer = require("multer");
const upload = multer({ dest: './public/Img/' });

router.post("/register", upload.single('image'), HomeController.addUser); // V
router.post("/logIn", HomeController.logIn); // V
router.get("/", Protect.protect, HomeController.deconnected); // V
// router.patch("/", HomeController.patchUser); // X si on a le temps et que tout est nickel

module.exports = router;