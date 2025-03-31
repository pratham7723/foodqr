import React, { useState, useEffect } from 'react';
import { motion, useAnimation, AnimatePresence } from 'framer-motion';
import { useInView } from 'react-intersection-observer';
import { 
  FiArrowRight, FiArrowLeft, FiSmartphone, FiEye, FiShoppingCart, 
  FiMapPin, FiClock, FiX, FiMenu 
} from 'react-icons/fi';

// Error Boundary Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error("Error caught by ErrorBoundary:", error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-red-50 p-8">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
            <p className="text-gray-700 mb-6">We're having trouble loading this page. Please try refreshing.</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition-colors"
            >
              Refresh Page
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

const Home = () => {
  const [currentTestimonial, setCurrentTestimonial] = useState(0);
  const [currentDish, setCurrentDish] = useState(0);
  const [currentFeature, setCurrentFeature] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const controls = useAnimation();
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: false });

  useEffect(() => {
    if (inView) controls.start('visible');
  }, [controls, inView]);

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 30, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { type: 'spring', stiffness: 100, damping: 10 }
    }
  };

  const fadeIn = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { duration: 0.8 } }
  };

  const slideInFromLeft = {
    hidden: { x: -100, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
  };

  const slideInFromRight = {
    hidden: { x: 100, opacity: 0 },
    visible: { x: 0, opacity: 1, transition: { type: 'spring', stiffness: 100 } }
  };

  const dishes = [
    {
      name: "Veg Burger",
      description: "A delicious vegetable patty topped with fresh lettuce, tomatoes, onions, and a special house sauce, served in a toasted bun.",
      price: "₹340",
      image: "https://ik.imagekit.io/rwz4yhwit/qrcode/menu_images/istockphoto-1309352410-612x612_SS8EdB4lJ.jpg?updatedAt=1742815904717",
      ingredients: ["Vegetable patty", "Lettuce", "Tomato", "Onion", "Cheese"],
      prepTime: "25 mins",
      calories: "650 kcal"
    },
    {
      name: "Veg Sandwich",
      description: "A fresh and crispy sandwich loaded with seasonal vegetables, cheese, and a tangy spread.",
      price: "₹189",
      image: "https://ik.imagekit.io/rwz4yhwit/qrcode/menu_images/istockphoto-1256670482-612x612_f1fqGQbW4Q.jpg?updatedAt=1742815757084",
      ingredients: ["Whole wheat bread", "Lettuce", "Tomato", "Cucumber", "Cheese"],
      prepTime: "15 mins",
      calories: "320 kcal"
    },
    {
      name: "Garlic Bread",
      description: "Crispy, golden brown bread infused with garlic butter and herbs, served with a side of marinara sauce.",
      price: "₹249",
      image: "https://ik.imagekit.io/rwz4yhwit/qrcode/menu_images/360_F_319223572_ILWIWBuhaeyTzGPLQ0rJCVtBSGOqw864_0GpR9vQYl.jpg?updatedAt=1742815804813",
      ingredients: ["Baguette", "Garlic", "Butter", "Parsley", "Olive oil"],
      prepTime: "10 mins",
      calories: "280 kcal"
    },
    {
      name: "Margherita Pizza",
      description: "A classic Italian pizza topped with fresh tomatoes, mozzarella cheese, basil, and olive oil on a thin crust.",
      price: "₹599",
      image: "https://ik.imagekit.io/rwz4yhwit/qrcode/menu_images/20220211142645-margherita-9920_e41233d5-dcec-461c-b07e-03245f031dfe.jpg_kFPmYGt2V.webp?updatedAt=1742815506561",
      ingredients: ["Pizza dough", "Tomato sauce", "Mozzarella cheese", "Basil", "Olive oil"],
      prepTime: "30 mins",
      calories: "480 kcal"
    }
  ];
  
  const testimonials = [
    {
      quote: "The AR menu was an amazing experience! Seeing the dishes in 3D before ordering made it so much more exciting.",
      author: "Aarav Mehta",
      role: "Food Critic",
      avatar: "https://randomuser.me/api/portraits/men/75.jpg"
    },
    {
      quote: "Every dish was presented beautifully, and the AR preview added a whole new dimension to dining!",
      author: "Neha Sharma",
      role: "Regular Customer",
      avatar: "https://randomuser.me/api/portraits/women/65.jpg"
    },
    {
      quote: "The ambiance, the food, and the service made our anniversary dinner truly special. The AR menu was the cherry on top!",
      author: "Rohan & Ananya Iyer",
      role: "First-time Visitors",
      avatar: "https://randomuser.me/api/portraits/men/85.jpg"
    },
    {
      quote: "As a vegetarian, I loved how the AR menu showcased every detail of the dish, making it easier to choose my meal.",
      author: "Priya Verma",
      role: "Food Blogger",
      avatar: "https://randomuser.me/api/portraits/women/72.jpg"
    }
  ];
  

  const features = [
    {
      title: "3D Dish Visualization",
      description: "View photorealistic 3D models of every dish from all angles before ordering.",
      icon: <FiEye className="text-3xl" />
    },
    {
      title: "Nutritional Information",
      description: "Get detailed nutritional breakdowns for every menu item with AR overlays.",
      icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
      </svg>
    },
    {
      title: "Instant Ordering",
      description: "Place your order directly from the AR interface with just one tap.",
      icon: <FiShoppingCart className="text-3xl" />
    },
    {
      title: "Customization",
      description: "Modify ingredients and see changes reflected in real-time AR previews.",
      icon: <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
      </svg>
    }
  ];

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const nextDish = () => {
    setCurrentDish((prev) => (prev + 1) % dishes.length);
  };

  const prevDish = () => {
    setCurrentDish((prev) => (prev - 1 + dishes.length) % dishes.length);
  };

  const nextFeature = () => {
    setCurrentFeature((prev) => (prev + 1) % features.length);
  };

  const prevFeature = () => {
    setCurrentFeature((prev) => (prev - 1 + features.length) % features.length);
  };



  try {
    return (
      <ErrorBoundary>
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-orange-50 overflow-x-hidden">
          {/* Navigation */}
          <nav className="fixed w-full bg-white bg-opacity-95 shadow-md z-50 backdrop-blur-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between h-20 items-center">
                <motion.div initial={{ x: -100, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ type: 'spring', stiffness: 100 }} className="flex-shrink-0 flex items-center">
                  <span className="text-2xl font-bold text-orange-600">Flavor</span><span className="text-2xl font-bold text-gray-800">Fusion</span>
                </motion.div>
                
                {/* Desktop Navigation */}
                <div className="hidden md:block">
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }} className="ml-10 flex items-center space-x-8">
                    <a href="#home" className="text-gray-800 hover:text-orange-600 px-3 py-2 text-sm font-medium transition-colors">Home</a>
                    <a href="#menu" className="text-gray-800 hover:text-orange-600 px-3 py-2 text-sm font-medium transition-colors">Menu</a>
                    <a href="#ar" className="text-gray-800 hover:text-orange-600 px-3 py-2 text-sm font-medium transition-colors">AR Menu</a>
                    <a href="#features" className="text-gray-800 hover:text-orange-600 px-3 py-2 text-sm font-medium transition-colors">Features</a>
                    <a href="#testimonials" className="text-gray-800 hover:text-orange-600 px-3 py-2 text-sm font-medium transition-colors">Testimonials</a>
                    <a href="#contact" className="text-gray-800 hover:text-orange-600 px-3 py-2 text-sm font-medium transition-colors">Contact</a>
                    <a href="/Loginpage"  className="border border-orange-600 text-orange-600 hover:bg-orange-50 px-4 py-2 rounded-full text-sm font-medium transition-colors">Login</a>
                  </motion.div>
                </div>
                
                {/* Mobile menu button */}
                <div className="md:hidden flex items-center">
                  <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="text-gray-800 hover:text-orange-600 focus:outline-none"
                  >
                    {mobileMenuOpen ? (
                      <FiX className="h-6 w-6" />
                    ) : (
                      <FiMenu className="h-6 w-6" />
                    )}
                  </button>
                </div>
              </div>
            </div>
            
            {/* Mobile Navigation */}
            <AnimatePresence>
              {mobileMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="md:hidden overflow-hidden"
                >
                  <div className="px-4 pt-2 pb-6 space-y-2">
                    <a href="#home" className="block text-gray-800 hover:text-orange-600 px-3 py-2 rounded-md text-base font-medium">Home</a>
                    <a href="#menu" className="block text-gray-800 hover:text-orange-600 px-3 py-2 rounded-md text-base font-medium">Menu</a>
                    <a href="#ar" className="block text-gray-800 hover:text-orange-600 px-3 py-2 rounded-md text-base font-medium">AR Menu</a>
                    <a href="#features" className="block text-gray-800 hover:text-orange-600 px-3 py-2 rounded-md text-base font-medium">Features</a>
                    <a href="#testimonials" className="block text-gray-800 hover:text-orange-600 px-3 py-2 rounded-md text-base font-medium">Testimonials</a>
                    <a href="#contact" className="block text-gray-800 hover:text-orange-600 px-3 py-2 rounded-md text-base font-medium">Contact</a>
                    <div className="pt-4 border-t border-gray-200">
                      <a href="/Loginpage" className="w-full mb-2 border border-orange-600 text-orange-600 hover:bg-orange-50 px-4 py-2 rounded-full text-sm font-medium transition-colors">Login</a>
                      
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </nav>

          {/* Hero Section */}
          <section id="home" className="pt-32 pb-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <motion.div initial="hidden" animate="visible" variants={slideInFromLeft}>
                <motion.h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                  <span className="text-orange-600">Experience</span> Dining Like Never <span className="text-orange-600">Before</span>
                </motion.h1>
                <motion.p className="text-lg text-gray-600 mb-8" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                  Discover our revolutionary AR menu that lets you visualize dishes in 3D before ordering. Combine this with our masterfully crafted cuisine for an unforgettable experience.
                </motion.p>
                <motion.div className="flex flex-col sm:flex-row gap-4" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.6 }}>
                <a 
  href={`${import.meta.env.VITE_REACT_APP_CLIENT_URL}/CustomerMenu`} 
  className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-4 rounded-full font-semibold transition-colors shadow-lg transform hover:scale-105 flex items-center justify-center gap-2"
>
  <FiSmartphone className="text-xl" /> Try AR Menu
</a>

                  <button className="border-2 border-orange-600 text-orange-600 hover:bg-orange-50 px-8 py-3 rounded-full font-semibold transition-colors transform hover:scale-105">
                    View Traditional Menu
                  </button>
                </motion.div>
              </motion.div>
              <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} className="relative">
                <img src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80" alt="Restaurant interior" className="rounded-3xl shadow-2xl w-full h-auto" />
                <motion.div className="absolute -bottom-8 -left-8 bg-white p-4 rounded-xl shadow-lg" initial={{ x: -50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.8 }}>
                  <div className="text-orange-600 text-3xl mb-2">⭐</div><p className="font-bold text-gray-800">4.9 Rating</p><p className="text-sm text-gray-600">500+ Reviews</p>
                </motion.div>
                <motion.div className="absolute -top-8 -right-8 bg-orange-600 text-white p-4 rounded-xl shadow-lg" initial={{ x: 50, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 1 }}>
                  <div className="text-3xl mb-2">🍽️</div><p className="font-bold">50+ Dishes</p><p className="text-sm">Fresh Daily</p>
                </motion.div>
              </motion.div>
            </div>
          </section>

          {/* Stats Section */}
          <section className="py-16 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  viewport={{ once: true }}
                  className="p-6 rounded-xl bg-orange-50"
                >
                  <div className="text-4xl font-bold text-orange-600 mb-2">10K+</div>
                  <p className="text-gray-600">Happy Customers</p>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                  viewport={{ once: true }}
                  className="p-6 rounded-xl bg-orange-50"
                >
                  <div className="text-4xl font-bold text-orange-600 mb-2">50+</div>
                  <p className="text-gray-600">Menu Items</p>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  viewport={{ once: true }}
                  className="p-6 rounded-xl bg-orange-50"
                >
                  <div className="text-4xl font-bold text-orange-600 mb-2">15</div>
                  <p className="text-gray-600">Awards Won</p>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  viewport={{ once: true }}
                  className="p-6 rounded-xl bg-orange-50"
                >
                  <div className="text-4xl font-bold text-orange-600 mb-2">24/7</div>
                  <p className="text-gray-600">Support</p>
                </motion.div>
              </div>
            </div>
          </section>

          {/* AR Menu Showcase - USP Section */}
          <section id="ar" className="py-20 bg-gradient-to-r from-orange-50 to-amber-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Revolutionary AR Menu</h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">See your food before you order with our cutting-edge augmented reality technology</p>
              </motion.div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                <motion.div initial="hidden" whileInView="visible" variants={slideInFromLeft} viewport={{ once: true }} className="relative">
                  <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
                    <div className="aspect-w-16 aspect-h-9 bg-gray-100 relative">
                      <img src="https://ik.imagekit.io/rwz4yhwit/qrcode/menu_images/a_customer_sitting_comfortably_in_a_cozy_restaurant_holding_a_smartphone_that_displays_an_augmented_wcl7fesh2jgkvoimazo8_0.png?updatedAt=1743340788498" alt="AR Menu Preview" className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-6">
                        <div>
                          <h3 className="text-white text-2xl font-bold">Veg Burger</h3>
                          <p className="text-orange-300">Rotate with your finger to view 360°</p>
                        </div>
                      </div>
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-gray-600">Current Selection</p>
                          <h4 className="text-xl font-bold text-gray-900">Veg Burger</h4>
                        </div>
                        <button className="bg-orange-600 hover:bg-orange-700 text-white px-6 py-2 rounded-full font-medium transition-colors shadow-md flex items-center gap-2">
                          <FiShoppingCart /> Add to Order
                        </button>
                      </div>
                    </div>
                  </div>
                  <motion.div className="absolute -bottom-6 -right-6 bg-gray-900 text-white p-4 rounded-xl shadow-lg" initial={{ scale: 0 }} whileInView={{ scale: 1 }} transition={{ delay: 0.4 }} viewport={{ once: true }}>
                    <div className="flex items-center gap-2">
                      <FiEye className="text-orange-400 text-xl" />
                      <p className="font-medium">AR Preview</p>
                    </div>
                  </motion.div>
                </motion.div>
                <motion.div initial="hidden" whileInView="visible" variants={slideInFromRight} viewport={{ once: true }} className="space-y-8">
                  <motion.div variants={itemVariants} className="bg-white p-6 rounded-xl shadow-lg">
                    <div className="flex items-start gap-4">
                      <div className="bg-orange-100 p-3 rounded-full text-orange-600">
                        <FiSmartphone className="text-2xl" />
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Interactive 3D Previews</h3>
                        <p className="text-gray-600">View dishes from all angles, rotate and zoom to see every detail before ordering.</p>
                      </div>
                    </div>
                  </motion.div>
                  <motion.div variants={itemVariants} className="bg-white p-6 rounded-xl shadow-lg">
                    <div className="flex items-start gap-4">
                      <div className="bg-orange-100 p-3 rounded-full text-orange-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Realistic Visualization</h3>
                        <p className="text-gray-600">Our AR technology shows dishes exactly as they'll be served, with accurate portion sizes and presentation.</p>
                      </div>
                    </div>
                  </motion.div>
                  <motion.div variants={itemVariants} className="bg-white p-6 rounded-xl shadow-lg">
                    <div className="flex items-start gap-4">
                      <div className="bg-orange-100 p-3 rounded-full text-orange-600">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                      </div>
                      <div>
                        <h3 className="text-xl font-bold text-gray-900 mb-2">Instant Ordering</h3>
                        <p className="text-gray-600">Love what you see? Order directly from the AR interface with just one tap.</p>
                      </div>
                    </div>
                  </motion.div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Features Carousel */}
          <section id="features" className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Key Features</h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">Discover what makes our AR dining experience truly special</p>
              </motion.div>
              
              <div className="relative">
                <div className="overflow-hidden">
                  <motion.div 
                    key={currentFeature} 
                    initial={{ opacity: 0, x: 100 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    exit={{ opacity: 0, x: -100 }} 
                    transition={{ duration: 0.5 }} 
                    className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
                  >
                    <div className="bg-gradient-to-br from-orange-100 to-amber-100 p-12 rounded-3xl shadow-xl">
                      <div className="text-orange-600 mb-6">
                        {features[currentFeature].icon}
                      </div>
                      <h3 className="text-3xl font-bold text-gray-900 mb-4">{features[currentFeature].title}</h3>
                      <p className="text-lg text-gray-600">{features[currentFeature].description}</p>
                    </div>
                    <div className="space-y-6">
                      <h3 className="text-3xl font-bold text-gray-900">{features[currentFeature].title}</h3>
                      <p className="text-xl text-gray-600">{features[currentFeature].description}</p>
                      <div className="pt-4">
                        <button className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-full font-semibold transition-colors shadow-lg flex items-center gap-2">
                          Learn More
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </div>
                
                <button onClick={prevFeature} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white p-3 rounded-full shadow-lg text-orange-600 hover:text-orange-700 z-10">
                  <FiArrowLeft className="text-2xl" />
                </button>
                <button onClick={nextFeature} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white p-3 rounded-full shadow-lg text-orange-600 hover:text-orange-700 z-10">
                  <FiArrowRight className="text-2xl" />
                </button>
                
                <div className="flex justify-center mt-8 gap-2">
                  {features.map((_, index) => (
                    <button 
                      key={index} 
                      onClick={() => setCurrentFeature(index)} 
                      className={`w-3 h-3 rounded-full ${currentFeature === index ? 'bg-orange-600' : 'bg-gray-300'}`} 
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Featured Dishes Carousel */}
          <section id="menu"className="py-20 bg-gray-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Chef's Specialties</h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">Handcrafted by our culinary experts with passion and precision</p>
              </motion.div>
              <div className="relative">
                <div className="overflow-hidden">
                  <motion.div 
                    key={currentDish} 
                    initial={{ opacity: 0, x: 100 }} 
                    animate={{ opacity: 1, x: 0 }} 
                    exit={{ opacity: 0, x: -100 }} 
                    transition={{ duration: 0.5 }} 
                    className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center"
                  >
                    <div className="relative h-96 rounded-3xl overflow-hidden shadow-2xl">
                      <img src={dishes[currentDish].image} alt={dishes[currentDish].name} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-8">
                        <div>
                          <h3 className="text-white text-3xl font-bold mb-2">{dishes[currentDish].name}</h3>
                          <p className="text-orange-200 text-lg">{dishes[currentDish].description}</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-6">
                      <h3 className="text-3xl font-bold text-gray-900">{dishes[currentDish].name}</h3>
                      <p className="text-xl text-gray-600">{dishes[currentDish].description}</p>
                      <div className="flex items-center gap-4">
                        <span className="bg-orange-100 text-orange-800 px-4 py-2 rounded-full text-lg font-semibold">{dishes[currentDish].price}</span>
                        <span className="text-gray-500">•</span>
                        <div className="flex items-center gap-1 text-orange-600">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2h-1V9z" clipRule="evenodd" />
                          </svg>
                          <span>Gluten-free option available</span>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4 pt-2">
                        <div>
                          <p className="text-gray-500">Preparation Time</p>
                          <p className="font-medium">{dishes[currentDish].prepTime}</p>
                        </div>
                        <div>
                          <p className="text-gray-500">Calories</p>
                          <p className="font-medium">{dishes[currentDish].calories}</p>
                        </div>
                      </div>
                      
                      <div className="pt-2">
                        <h4 className="font-semibold text-gray-900 mb-2">Key Ingredients</h4>
                        <div className="flex flex-wrap gap-2">
                          {dishes[currentDish].ingredients.map((ingredient, index) => (
                            <span key={index} className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm">
                              {ingredient}
                            </span>
                          ))}
                        </div>
                      </div>
                      
                      <div className="pt-4">
                        <button className="bg-orange-600 hover:bg-orange-700 text-white px-8 py-3 rounded-full font-semibold transition-colors shadow-lg flex items-center gap-2">
                          <FiShoppingCart /> Add to Order
                        </button>
                      </div>
                    </div>
                  </motion.div>
                </div>
                <button onClick={prevDish} className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 bg-white p-3 rounded-full shadow-lg text-orange-600 hover:text-orange-700 z-10">
                  <FiArrowLeft className="text-2xl" />
                </button>
                <button onClick={nextDish} className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 bg-white p-3 rounded-full shadow-lg text-orange-600 hover:text-orange-700 z-10">
                  <FiArrowRight className="text-2xl" />
                </button>
                <div className="flex justify-center mt-8 gap-2">
                  {dishes.map((_, index) => (
                    <button 
                      key={index} 
                      onClick={() => setCurrentDish(index)} 
                      className={`w-3 h-3 rounded-full ${currentDish === index ? 'bg-orange-600' : 'bg-gray-300'}`} 
                    />
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Full Menu Section */}
          <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">Our Full Menu</h2>
                <p className="text-lg text-gray-600 max-w-2xl mx-auto">Explore our diverse selection of culinary delights</p>
              </motion.div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {dishes.map((dish, index) => (
                  <motion.div 
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    viewport={{ once: true }}
                    className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                  >
                    <div className="h-48 overflow-hidden">
                      <img src={dish.image} alt={dish.name} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                    </div>
                    <div className="p-6">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold text-gray-900">{dish.name}</h3>
                        <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-semibold">{dish.price}</span>
                      </div>
                      <p className="text-gray-600 mb-4">{dish.description}</p>
                      <button className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2">
                        <FiShoppingCart /> Add to Order
                      </button>
                    </div>
                  </motion.div>
                ))}
                
                {/* More menu items */}
                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  viewport={{ once: true }}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="h-48 overflow-hidden bg-gray-100 flex items-center justify-center">
                    <div className="text-center p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">Explore More</h3>
                      <p className="text-gray-600 mb-4">We have many more dishes waiting for you</p>
                      <a 
  href={`${import.meta.env.VITE_REACT_APP_CLIENT_URL}/CustomerMenu`} 
  className="border-2 border-orange-600 text-orange-600 hover:bg-orange-50 px-6 py-2 rounded-full font-medium transition-colors"
>
  View Full Menu
</a>

                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* Testimonials Carousel */}
          <section id="testimonials" className="py-20 bg-gray-900 text-white">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
              <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} viewport={{ once: true }} className="text-center mb-16">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Diner Experiences</h2>
                <p className="text-lg text-gray-300 max-w-2xl mx-auto">Hear from our guests about their experiences with our AR menu</p>
              </motion.div>
              <div className="relative">
                <div className="overflow-hidden h-80">
                  <AnimatePresence mode="wait">
                    <motion.div 
                      key={currentTestimonial} 
                      initial={{ opacity: 0, x: 100 }} 
                      animate={{ opacity: 1, x: 0 }} 
                      exit={{ opacity: 0, x: -100 }} 
                      transition={{ duration: 0.5 }} 
                      className="bg-gray-800 p-8 rounded-3xl absolute inset-0 flex flex-col items-center text-center"
                    >
                      <div className="mb-6">
                        <img 
                          src={testimonials[currentTestimonial].avatar} 
                          alt={testimonials[currentTestimonial].author} 
                          className="w-16 h-16 rounded-full object-cover border-2 border-orange-500"
                        />
                      </div>
                      <div className="text-orange-400 text-5xl mb-6">"</div>
                      <p className="text-xl text-gray-300 mb-8">{testimonials[currentTestimonial].quote}</p>
                      <div className="border-t border-gray-700 pt-6 w-full max-w-md">
                        <p className="font-bold text-xl">{testimonials[currentTestimonial].author}</p>
                        <p className="text-gray-400">{testimonials[currentTestimonial].role}</p>
                      </div>
                    </motion.div>
                  </AnimatePresence>
                </div>
                <div className="flex justify-center mt-8 gap-4">
                  <button onClick={prevTestimonial} className="bg-gray-700 hover:bg-gray-600 p-3 rounded-full text-white">
                    <FiArrowLeft className="text-xl" />
                  </button>
                  <button onClick={nextTestimonial} className="bg-orange-600 hover:bg-orange-700 p-3 rounded-full text-white">
                    <FiArrowRight className="text-xl" />
                  </button>
                </div>
              </div>
            </div>
          </section>

          {/* Reservation Section */}
          <section className="py-20 bg-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="bg-gradient-to-r from-orange-500 to-amber-500 rounded-3xl shadow-2xl overflow-hidden">
                <div className="grid grid-cols-1 lg:grid-cols-2">
                  <div className="p-12 text-white">
                    <motion.h2 
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      className="text-3xl md:text-4xl font-bold mb-6"
                    >
                      Reserve Your Table
                    </motion.h2>
                    <motion.p 
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      viewport={{ once: true }}
                      className="text-xl text-orange-100 mb-8"
                    >
                      Experience the future of dining at FlavorFusion
                    </motion.p>
                    <motion.div 
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      viewport={{ once: true }}
                      className="space-y-4"
                    >
                      <div className="flex items-center gap-4">
                        <FiClock className="text-2xl" />
                        <div>
                          <p className="font-semibold">Opening Hours</p>
                          <p>Monday - Sunday: 11am - 11pm</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <FiMapPin className="text-2xl" />
                        <div>
                          <p className="font-semibold">Location</p>
                          <p>Nana Mauva,Rajkot,Gujarat</p>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                  <div className="bg-white p-12">
                    <motion.form 
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                      viewport={{ once: true }}
                      className="space-y-6"
                    >
                      <div>
                        <label className="block text-gray-700 mb-2">Full Name</label>
                        <input 
                          type="text" 
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
                          placeholder="Your name"
                        />
                      </div>
                      <div>
                        <label className="block text-gray-700 mb-2">Email Address</label>
                        <input 
                          type="email" 
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
                          placeholder="your@email.com"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label className="block text-gray-700 mb-2">Date</label>
                          <input 
                            type="date" 
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
                          />
                        </div>
                        <div>
                          <label className="block text-gray-700 mb-2">Time</label>
                          <input 
                            type="time" 
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent" 
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-gray-700 mb-2">Number of Guests</label>
                        <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent">
                          <option>1 person</option>
                          <option>2 people</option>
                          <option>3 people</option>
                          <option>4 people</option>
                          <option>5+ people</option>
                        </select>
                      </div>
                      <button
                        type="submit"
                        className="w-full bg-orange-600 hover:bg-orange-700 text-white py-3 px-4 rounded-lg font-semibold shadow-md transition-colors duration-300"
                      >
                        Reserve Now
                      </button>
                    </motion.form>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Final CTA */}
          <section className="py-20 bg-gradient-to-r from-orange-600 to-amber-600">
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }} 
                whileInView={{ opacity: 1, scale: 1 }} 
                transition={{ duration: 0.6 }} 
                viewport={{ once: true }} 
                className="bg-white/10 backdrop-blur-sm p-12 rounded-3xl shadow-2xl"
              >
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">Ready to Experience the Future of Dining?</h2>
                <p className="text-xl text-orange-100 mb-8">
                  Visit us today and explore our revolutionary AR menu combined with world-class cuisine.
                </p>
                <div className="flex flex-col sm:flex-row justify-center gap-4">
                <a 
  href={`${import.meta.env.VITE_REACT_APP_CLIENT_URL}/CustomerMenu`} 
  className="bg-white text-orange-600 hover:bg-gray-100 px-8 py-4 rounded-full font-semibold transition-colors shadow-lg transform hover:scale-105 flex items-center justify-center gap-2"
>
  <FiSmartphone className="text-xl" /> Try AR Menu Demo
</a>


                  <button className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-orange-600 px-8 py-4 rounded-full font-semibold transition-colors transform hover:scale-105">
                    Book Your Table Now
                  </button>
                </div>
              </motion.div>
            </div>
          </section>

          {/* Footer */}
          <footer id="contact" className="bg-gray-900 text-white py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                <div>
                  <h3 className="text-xl font-bold mb-4 flex items-center">
                    <span className="text-orange-600">Gourmet</span>
                    <span className="text-white">House</span>
                  </h3>
                  <p className="text-gray-400 mb-4">
                    Where culinary excellence meets technological innovation for an unforgettable dining experience.
                  </p>
                  <div className="flex gap-4">
                    <a href="#" className="text-gray-400 hover:text-white transition-colors">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
                      </svg>
                    </a>
                    <a href="#" className="text-gray-400 hover:text-white transition-colors">
                      <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
                      </svg>
                    </a>
                    
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
                  <ul className="space-y-2">
                    <li><a href="#home" className="text-gray-400 hover:text-white transition-colors">Home</a></li>
                    <li><a href="#menu" className="text-gray-400 hover:text-white transition-colors">Menu</a></li>
                    <li><a href="#ar" className="text-gray-400 hover:text-white transition-colors">AR Menu</a></li>
                    <li><a href="#features" className="text-gray-400 hover:text-white transition-colors">Features</a></li>
                    <li><a href="#testimonials" className="text-gray-400 hover:text-white transition-colors">Testimonials</a></li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-4">Contact Us</h4>
                  <ul className="space-y-2 text-gray-400">
                    <li className="flex items-center gap-2"><FiMapPin />Nana Mauva</li>
                    <li className="flex items-center gap-2">Rajkot, Gujarat</li>
                    <li className="flex items-center gap-2">Phone: 7016498352</li>
                    <li className="flex items-center gap-2">Email: info@FlavorFusion.com</li>
                  </ul>
                </div>
                <div>
                  <h4 className="text-lg font-semibold mb-4">Opening Hours</h4>
                  <ul className="space-y-2 text-gray-400">
                    <li className="flex items-center gap-2"><FiClock /> Monday - Friday: 11am - 10pm</li>
                    <li className="flex items-center gap-2">Saturday: 10am - 11pm</li>
                    <li className="flex items-center gap-2">Sunday: 10am - 9pm</li>
                  </ul>
                </div>
              </div>
              <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
                <p>© {new Date().getFullYear()} FlavorFusion. All rights reserved.</p>
              </div>
            </div>
          </footer>
        </div>

      </ErrorBoundary>
    );
  } catch (error) {
    console.error("Error in Home component:", error);
    return (
      <div className="min-h-screen flex items-center justify-center bg-red-50 p-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-red-600 mb-4">Something went wrong</h2>
          <p className="text-gray-700 mb-6">We're having trouble loading the content. Please try again later.</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }
};

export default Home;

