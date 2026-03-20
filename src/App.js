import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { getToken, getUser } from "./utils/auth";

import Login        from "./page/Login";
import Landing      from "./page/Landing";
import Member       from "./page/Member";
import Admin        from "./page/Admin/Admin";
import Card         from "./component/Card";
import Addmember    from "./page/Addmember";
import Requirement  from "./page/Admin/Requirement";
import Approve      from "./page/Admin/Approve";
import Managemember from "./page/Admin/Managemember";
import Manageuser   from "./page/Admin/Manageuser";
import Editmember   from "./page/Admin/Editmember";
import Edituser     from "./page/Admin/Edituser";
import Newuser      from "./page/Admin/Newuser";
import Datamanagement from "./page/Admin/Datamanagement";
import AddExpertise from "./page/Admin/AddExpertise";
import Typeuser     from "./page/Admin/Typeuser";
import Profile      from "./page/profile";
import './App.css';

const AdminRoute = ({ children }) => {
  const token = getToken();
  const user  = getUser();
  if (!token)                  return <Navigate to="/Login" replace />;
  if (user?.type !== 'Admin')  return <Navigate to="/"     replace />;
  return children;
};

const AuthRoute = ({ children }) => {
  if (!getToken()) return <Navigate to="/Login" replace />;
  return children;
};

function App() {
  return (
    <Routes>
      {/* Public */}
      <Route path="/Login"      element={<Login />} />
      <Route path="/"           element={<Landing />} />
      <Route path="/member"     element={<Member />} />
      <Route path="/1"          element={<Card />} />
      <Route path="/member/:id" element={<Member />} />

      {/* Authenticated users */}
      <Route path="/addmember"  element={<AuthRoute><Addmember /></AuthRoute>} />
      <Route path="/profile"    element={<AuthRoute><Profile /></AuthRoute>} />

      {/* Admin only */}
      <Route path="/admin"                element={<AdminRoute><Admin /></AdminRoute>} />
      <Route path="/requirements"         element={<AdminRoute><Requirement /></AdminRoute>} />
      <Route path="/approve/:id"          element={<AdminRoute><Approve /></AdminRoute>} />
      <Route path="/manage-members"       element={<AdminRoute><Managemember /></AdminRoute>} />
      <Route path="/manage-members/:id"   element={<AdminRoute><Editmember /></AdminRoute>} />
      <Route path="/manage-users"         element={<AdminRoute><Manageuser /></AdminRoute>} />
      <Route path="/manage-users/new"     element={<AdminRoute><Newuser /></AdminRoute>} />
      <Route path="/manage-users/:id"     element={<AdminRoute><Edituser /></AdminRoute>} />
      <Route path="/data-management"      element={<AdminRoute><Datamanagement /></AdminRoute>} />
      <Route path="/add-expertise"        element={<AdminRoute><AddExpertise /></AdminRoute>} />
      <Route path="/type-of-users"        element={<AdminRoute><Typeuser /></AdminRoute>} />
    </Routes>
  );
}

export default App;
