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
import Feedback     from "./page/Feedback";
import FeedbackAdmin from "./page/Admin/Feedback_admin";
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
      {/* Login only — accessible without token */}
      <Route path="/Login" element={<Login />} />

      {/* All other routes require login */}
      <Route path="/"           element={<AuthRoute><Landing /></AuthRoute>} />
      <Route path="/member"     element={<AuthRoute><Member /></AuthRoute>} />
      <Route path="/1"          element={<AuthRoute><Card /></AuthRoute>} />
      <Route path="/member/:id" element={<AuthRoute><Member /></AuthRoute>} />
      <Route path="/addmember"  element={<AuthRoute><Addmember /></AuthRoute>} />
      <Route path="/profile"    element={<AuthRoute><Profile /></AuthRoute>} />
      <Route path="/feedback"   element={<AuthRoute><Feedback /></AuthRoute>} />

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
      <Route path="/feedback-admin"       element={<AdminRoute><FeedbackAdmin /></AdminRoute>} />
    </Routes>
  );
}

export default App;
