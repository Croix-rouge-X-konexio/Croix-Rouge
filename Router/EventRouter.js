const express = require("express");
const EventController = require("../Controller/EventController");
const Protect = require("../middleware/protect");
const isAdmin = require("../middleware/isAdmin");
const multer = require("multer");
const upload = multer({ dest: './public/Img/' });
const router = express.Router();


router.get("/", Protect.protect, EventController.getAllEvent); // V
router.post("/", Protect.protect, isAdmin.isAdmin, upload.single('image'), EventController.addEvent); // V
router.post("/interested/:eventId", Protect.protect, EventController.attendEvent); // X
router.delete("/:eventId", Protect.protect, isAdmin.isAdmin, EventController.deleteEvent); //  V
// router.patch("/", Protect.protect, isAdmin.isAdmin, EventController.patchEvent); // X

module.exports = router;