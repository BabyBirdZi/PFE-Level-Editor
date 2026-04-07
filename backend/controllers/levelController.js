const Level = require("../models/Level");

const createLevel = async (req, res) => {
  try {
    const { name, cells, gridSize } = req.body;

    const newLevel = new Level({
      name: name || "Untitled Level",
      cells: cells || [],
      gridSize: gridSize || 20,
      user: req.user.id,
    });

    await newLevel.save();
    res.status(201).json(newLevel);
  } catch (error) {
    console.error("Create level error:", error);
    res.status(500).json({ message: "Failed to create level." });
  }
};

const getLevels = async (req, res) => {
  try {
    const levels = await Level.find({ user: req.user.id }).sort({ updatedAt: -1 });
    res.status(200).json(levels);
  } catch (error) {
    console.error("Get levels error:", error);
    res.status(500).json({ message: "Failed to fetch levels." });
  }
};

const getLevelById = async (req, res) => {
  try {
    const level = await Level.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!level) {
      return res.status(404).json({ message: "Level not found." });
    }

    res.status(200).json(level);
  } catch (error) {
    console.error("Get level by id error:", error);
    res.status(500).json({ message: "Failed to fetch level." });
  }
};

const updateLevel = async (req, res) => {
  try {
    const { name, cells, gridSize } = req.body;

    const updatedLevel = await Level.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.id,
      },
      {
        name,
        cells,
        gridSize: gridSize || 20,
      },
      { new: true, runValidators: true }
    );

    if (!updatedLevel) {
      return res.status(404).json({ message: "Level not found." });
    }

    res.status(200).json(updatedLevel);
  } catch (error) {
    console.error("Update level error:", error);
    res.status(500).json({ message: "Failed to update level." });
  }
};

const deleteLevel = async (req, res) => {
  try {
    const deletedLevel = await Level.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!deletedLevel) {
      return res.status(404).json({ message: "Level not found." });
    }

    res.status(200).json({ message: "Level deleted successfully." });
  } catch (error) {
    console.error("Delete level error:", error);
    res.status(500).json({ message: "Failed to delete level." });
  }
};

const exportLevel = async (req, res) => {
  try {
    const level = await Level.findOne({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!level) {
      return res.status(404).json({ message: "Level not found." });
    }

    const exportData = {
      id: level._id,
      name: level.name,
      gridSize: level.gridSize || 20,
      cells: level.cells.map((cell) => ({
        x: cell.x,
        y: cell.y,
        type: cell.object?.type || null,
        variant: cell.object?.variant || null,
      })),
    };

    res.status(200).json(exportData);
  } catch (error) {
    console.error("Export level error:", error);
    res.status(500).json({ message: "Failed to export level." });
  }
};

module.exports = {
  createLevel,
  getLevels,
  getLevelById,
  updateLevel,
  deleteLevel,
  exportLevel,
};