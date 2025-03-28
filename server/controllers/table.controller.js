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

// controllers/table.controller.js
export const releaseTable = async (req, res) => {
  try {
    const table = await Table.findByIdAndUpdate(
      req.params.id,
      { 
        status: "Available",
        currentOrder: null,
        menuItems: [] 
      },
      { new: true }
    );

    if (!table) {
      return res.status(404).json({ success: false, message: "Table not found" });
    }

    res.json({
      success: true,
      message: `Table ${table.tableNo} is now available`,
      data: table
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error releasing table",
      error: error.message
    });
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

export const checkTableAvailability = async (req, res) => {
  try {
    const { tableNo } = req.params;
    const table = await Table.findOne({ tableNo: parseInt(tableNo) });
    
    if (!table) {
      return res.status(404).json({
        success: false,
        message: "Table not found"
      });
    }

    res.json({
      success: true,
      tableNumber: table.tableNo,
      status: table.status,
      capacity: table.capacity
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error checking table status",
      error: error.message
    });
  }
};
