import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./page/Login";
import Landing from "./page/Landing";
import Member from "./page/Member";
import Admin from "./page/Admin/Admin";
import Card from "./component/Card";
import Addmember from "./page/Addmember";
import Requirement from "./page/Admin/Requirement";
import Approve from "./page/Admin/Approve";
import Managemember from "./page/Admin/Managemember";
import Manageuser from "./page/Admin/Manageuser";
import Editmember from "./page/Admin/Editmember";
import Edituser from "./page/Admin/Edituser";
import Newuser from "./page/Admin/Newuser";
import Datamanagement from "./page/Admin/Datamanagement";
import AddExpertise from "./page/Admin/AddExpertise";
import Typeuser from "./page/Admin/Typeuser";
import Profile from "./page/profile";
import './App.css';

function App() {
  return (
      <Routes>
        <Route path="/Login" element={<Login />} />
        <Route path="/" element={<Landing />} />
        <Route path="/member" element={<Member />} />
        <Route path="/1" element={<Card />} />
        <Route path="/member/:id" element={<Member />} />
        <Route path="/admin" element={<Admin />} />
        <Route path="/addmember" element={<Addmember />} />
        <Route path="/requirements" element={<Requirement />} />
        <Route path="/approve/:id" element={<Approve />} />
        <Route path="/manage-members" element={<Managemember />} />
        <Route path="/manage-members/:id" element={<Editmember />} />
        <Route path="/manage-users" element={<Manageuser />} />
        <Route path="/manage-users/new" element={<Newuser />} />
        <Route path="/manage-users/:id" element={<Edituser />} />
        <Route path="/data-management" element={<Datamanagement />} />
        <Route path="/add-expertise" element={<AddExpertise />} />
        <Route path="/type-of-users" element={<Typeuser />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
  );
}

export default App;

