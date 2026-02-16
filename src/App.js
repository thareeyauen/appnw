import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./page/Login";
import Landing from "./page/Landing";
import Member from "./page/Member";
import Card from "./component/Card";
import './App.css';

function App() {
  return (
      <Routes>
        <Route path="/Login" element={<Login />} />
        <Route path="/" element={<Landing />} />
        <Route path="/member" element={<Member />} />
        <Route path="/1" element={<Card />} />
      </Routes>
  );
}

export default App;

