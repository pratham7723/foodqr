import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

import {
  Home,
  Dashboard,
  Orders,
  Menu,
  TableOrders,
  Staff,
  Reports,
  CustomerMenu
} from './pages'

function App() {

  return (
    <Router>
    <Routes>
      {/* <Route path="/home" element={<Home />} /> */}
      <Route path="/" element={<Dashboard />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="/menu" element={<Menu />} />
      <Route path="/table-orders" element={<TableOrders />} />
      <Route path="/Staff" element={<Staff />} />
      <Route path="/Reports" element={<Reports />} />
      <Route path="/customermenu" element={<CustomerMenu />} />
    </Routes>
  </Router>
  )
}

export default App
