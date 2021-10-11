const express = require("express");
const router = express.Router();
const ListController = require("../Controller/ListController");
const Protect = require("../middleware/protect");
const isAdmin = require("../middleware/isAdmin");
const checkId = require("../middleware/checkId");

router.get("/listUsers", Protect.protect, isAdmin.isAdmin, ListController.getAllUsers); // V
router.get("/listUsers/:userid", Protect.protect, isAdmin.isAdmin, checkId.checkId, ListController.getOneUser); // X on attend la PimpMy card user
router.delete("/listUsers/:userid", Protect.protect, isAdmin.isAdmin, checkId.checkId, ListController.deleteOneUser); // V on attend la PimpMy card user / de pouvoir récup l'id
router.patch("/listUsers/:userid", Protect.protect, isAdmin.isAdmin, checkId.checkId, ListController.modifyOneUser); // V on attend la PimpMy card user / de pouvoir récup l'id

module.exports = router;
