import Restaurant from "../models/restaurant.modal.js";

// Get all restaurants
export const getRestaurants = async (req, res, next) => {
  try {
    const restaurants = await Restaurant.find().populate("owner staff.user");
    res.json(restaurants);
  } catch (error) {
    next(error);
  }
};

// Get a single restaurant
export const getRestaurantById = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id).populate(
      "owner staff.user"
    );
    if (!restaurant)
      return res.status(404).json({ error: "Restaurant not found" });
    res.json(restaurant);
  } catch (error) {
    next(error);
  }
};

// Create a new restaurant
export const createRestaurant = async (req, res, next) => {
  try {
    const restaurant = new Restaurant(req.body);
    await restaurant.save();
    res.status(201).json(restaurant);
  } catch (error) {
    next(error);
  }
};

// Update restaurant
export const updateRestaurant = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );
    if (!restaurant)
      return res.status(404).json({ error: "Restaurant not found" });
    res.json(restaurant);
  } catch (error) {
    next(error);
  }
};

// Delete restaurant
export const deleteRestaurant = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findByIdAndDelete(req.params.id);
    if (!restaurant)
      return res.status(404).json({ error: "Restaurant not found" });
    res.json({ message: "Restaurant deleted successfully" });
  } catch (error) {
    next(error);
  }
};
