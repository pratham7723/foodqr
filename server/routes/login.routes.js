import User from './models/User'; // Import your user model

router.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // 1. Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // 2. Compare passwords (using the method from your schema)
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // 3. Return user data (without password)
    const userData = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      restaurant: user.restaurant
    };

    // 4. You might want to generate a simple token or just use session
    res.json({
      message: 'Login successful',
      user: userData,
      token: 'simple-token-or-use-jwt-if-you-prefer' // Optional
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
});