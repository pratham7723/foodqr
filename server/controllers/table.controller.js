import Table from "../models/table.modal.js";

// Get all tables
export const getTables = async (req, res, next) => {
  try {
    const tables = await Table.find().populate(
      "restaurantId menuItems.menuItem"
    );
    res.json(tables);
  } catch (error) {
    next(error);
  }
};

// Get a single table
export const getTableById = async (req, res, next) => {
  try {
    const table = await Table.findById(req.params.id).populate(
      "restaurantId menuItems.menuItem"
    );
    if (!table) return res.status(404).json({ error: "Table not found" });
    res.json(table);
  } catch (error) {
    next(error);
  }
};

// Create a new table
export const createTable = async (req, res, next) => {
  try {
    const table = new Table(req.body);
    await table.save();
    res.status(201).json(table);
  } catch (error) {
    next(error);
  }
};

// Update table
export const updateTable = async (req, res, next) => {
  try {
    const table = await Table.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!table) return res.status(404).json({ error: "Table not found" });
    res.json(table);
  } catch (error) {
    next(error);
  }
};

// Delete table
export const deleteTable = async (req, res, next) => {
  try {
    const table = await Table.findByIdAndDelete(req.params.id);
    if (!table) return res.status(404).json({ error: "Table not found" });
    res.json({ message: "Table deleted successfully" });
  } catch (error) {
    next(error);
  }
};
