const express = require("express");
const router = express.Router();
const ListController = require("../Controller/ListController");
const Protect = require("../middleware/protect");
const isAdmin = require("../middleware/isAdmin");
const checkId = require("../middleware/checkId");

router.get("/listUsers", Protect.protect, isAdmin.isAdmin, ListController.getAllUsers); // V
router.get("/listUsers/:userid", Protect.protect, isAdmin.isAdmin, checkId.checkId, ListController.getOneUser); // X on attend la PimpMy card user
router.patch("/listUsers/:userid", Protect.protect, isAdmin.isAdmin, checkId.checkId, ListController.modifyOneUser); // X si on a le temps et que tout est nickel
router.delete("/listUsers/:userid", Protect.protect, isAdmin.isAdmin, checkId.checkId, ListController.deleteOneUser); // X on attend la PimpMy card user

module.exports = router;
