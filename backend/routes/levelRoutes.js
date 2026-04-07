const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const {
  createLevel,
  getLevels,
  getLevelById,
  updateLevel,
  deleteLevel,
  exportLevel,
} = require("../controllers/levelController");

router.use(authMiddleware);

router.post("/", createLevel);
router.get("/", getLevels);
router.get("/:id/export", exportLevel);
router.get("/:id", getLevelById);
router.put("/:id", updateLevel);
router.delete("/:id", deleteLevel);

module.exports = router;