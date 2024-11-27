import React from "react";
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import UserManagement from "./components/UserManagement";
import RoleManagement from "./components/RoleManagement";

const App = () => {
  return (
   <>
  <Router>
      <Routes>
        <Route path="/" element={<UserManagement />} />
        <Route path="/roles" element={<RoleManagement />} />
      </Routes>
    </Router>
   </>
  );
};



export default App;
