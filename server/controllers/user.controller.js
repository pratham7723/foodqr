import User from "../models/user.modal.js";
import bcrypt from "bcryptjs"; // Ensure bcrypt is installed
import jwt from "jsonwebtoken"; // Ensure jwt is installed

// Create a new user
export const createUser = async (req, res) => {
  try {
    const { name, email, password, phone, role } = req.body;

    // Validate input
    if (!name || !email || !password || !role) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    // Check for existing user
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(400).json({ error: 'Email already in use' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      role
    });

    res.status(201).json(user);
  } catch (error) {
    console.error('Create user error:', error);
    res.status(500).json({ 
      error: 'Server error',
      message: error.message 
    });
  }
};

// Delete a user
export const deleteUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// Get a user by ID
export const getUserById = async (req, res, next) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(user);
  } catch (error) {
    next(error);
  }
};

// Get all users
export const getUsers = async (req, res, next) => {
  try {
    const users = await User.find();

    if (!users || users.length === 0) {
      return res.status(404).json({ error: "No users found" });
    }

    res.status(200).json(users);
  } catch (error) {
    next(error);
  }
};

// Login user
export const loginUser = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Generate a JWT token
    const token = jwt.sign({ id: user._id, role: user.role }, "your_secret_key", {
      expiresIn: "1h",
    });

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    next(error);
  }
};


// Update a user
export const updateUser = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, phone, role } = req.body;

    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, email, phone, role },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({ error: "User not found" });
    }

    res.status(200).json(updatedUser);
  } catch (error) {
    next(error);
  }
};

