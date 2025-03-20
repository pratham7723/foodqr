import Menu from "../models/Menu.modal.js";

// Get all menu items
export const getMenuItems = async (req, res, next) => {
  try {
    const menuItems = await Menu.find().populate("restaurantId");
    res.json(menuItems);
  } catch (error) {
    next(error);
  }
};

// Get a single menu item
export const getMenuItemById = async (req, res, next) => {
  try {
    const menuItem = await Menu.findById(req.params.id).populate(
      "restaurantId"
    );
    if (!menuItem)
      return res.status(404).json({ error: "Menu item not found" });
    res.json(menuItem);
  } catch (error) {
    next(error);
  }
};

// Create a new menu item
export const createMenuItem = async (req, res, next) => {
  try {
    const menuItem = new Menu(req.body);
    await menuItem.save();
    res.status(201).json(menuItem);
  } catch (error) {
    next(error);
  }
};

// Update menu item
export const updateMenuItem = async (req, res, next) => {
  try {
    const menuItem = await Menu.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    if (!menuItem)
      return res.status(404).json({ error: "Menu item not found" });
    res.json(menuItem);
  } catch (error) {
    next(error);
  }
};

// Delete menu item
export const deleteMenuItem = async (req, res, next) => {
  try {
    const menuItem = await Menu.findByIdAndDelete(req.params.id);
    if (!menuItem)
      return res.status(404).json({ error: "Menu item not found" });
    res.json({ message: "Menu item deleted successfully" });
  } catch (error) {
    next(error);
  }
};
