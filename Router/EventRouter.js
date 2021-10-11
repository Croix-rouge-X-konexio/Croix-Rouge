const express = require("express");
const EventController = require("../Controller/EventController");
const Protect = require("../middleware/protect");
const isAdmin = require("../middleware/isAdmin");

const router = express.Router();

router.get("/", Protect.protect, EventController.getAllEvent); // V
router.post("/", Protect.protect, isAdmin.isAdmin, EventController.addEvent); // V
router.delete("/:eventId", Protect.protect, isAdmin.isAdmin, EventController.deleteEvent); //  Récupérer coté front l'id de l'Event
// router.patch("/", Protect.protect, isAdmin.isAdmin, EventController.patchEvent); // X

module.exports = router;