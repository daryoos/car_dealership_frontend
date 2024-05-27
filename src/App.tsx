import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import DefaultLayout from "./layouts/DefaultLayout";
import ProtectedLayout from "./layouts/ProtectedLayout";
import AdminLayout from "./layouts/AdminLayout";
import NotificationBar from "./components/notification/NotificationBar";
import Search from './pages/Search';
import Profile from './pages/Profile';
import SearchModel from './pages/SearchModel';
import VehicleDetails from './pages/VehicleDetails';
import Cart from './pages/Cart';
import AdminHome from './pages/AdminHome';
import AdminVehicles from './pages/AdminVehicle';
import AdminUser from './pages/AdminUser';
import AdminVehicleSpecific from './pages/AdminVehicleSpecific';


function App() {
  return (
    <>
      <NotificationBar />
      <Routes>
        <Route element={<DefaultLayout />}>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
        </Route>
        <Route element={<ProtectedLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/search/:make" element={<Search />} />
          <Route path="/search/:make/:vehicleId" element={<SearchModel />} />
          <Route path="/vehicle/:vehicleSpecificId" element={<VehicleDetails />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/cart" element={<Cart />} />
        </Route>
        <Route element={<AdminLayout />}>
          <Route path="/adminHome" element={<AdminHome />} />
          <Route path="/adminSearch/:make" element={<AdminVehicles />} />
          <Route path="/adminSearch/:make/:vehicleId" element={<AdminVehicleSpecific />} />
          <Route path="/adminUsers" element={<AdminUser />} />
        </Route>
      </Routes>
    </>
  );
}

export default App;
