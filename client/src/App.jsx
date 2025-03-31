import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import {
  Home,
  Dashboard,
  Orders,
  Menu,
  Tableqrcodes,
  Staff,
  Reports,
  CustomerMenu,
  KitchenStaff,
  Waiter,
  Management,
  Loginpage,
} from './pages'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/orders" element={<Orders />} />
        <Route path="/menu" element={<Menu />} />
        <Route path="/Tableqrcodes" element={<Tableqrcodes />} />
        <Route path="/Staff" element={<Staff />} />
        <Route path="/Reports" element={<Reports />} />
        <Route path="/customermenu" element={<CustomerMenu />} />
        <Route path="/kitchenstaff" element={<KitchenStaff />} />
        <Route path="/waiter" element={<Waiter />} />
        <Route path="/management" element={<Management />} />
        <Route path="/loginpage" element={<Loginpage />} />
      </Routes>
    </Router>
  )
}

export default App