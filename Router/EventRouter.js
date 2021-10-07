const express = require("express");
const EventController = require("../Controller/EventController");
const Protect = require("../middleware/protect");
const isAdmin = require("../middleware/isAdmin");

const router = express.Router();

router.get("/", Protect.protect, EventController.getAllEvent);
router.post("/", Protect.protect, isAdmin.isAdmin, EventController.addEvent);
router.delete("/:eventId", Protect.protect, isAdmin.isAdmin, EventController.deleteEvent);
// router.patch("/", Protect.protect, isAdmin.isAdmin, EventController.patchEvent);

module.exports = router;