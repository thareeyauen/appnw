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
      </Routes>
  );
}

export default App;

