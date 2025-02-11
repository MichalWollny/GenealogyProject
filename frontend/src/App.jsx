// npm's
import { useState } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
// local files
import LoginForm from "./pages/LoginForm";
import LandingPage from "./pages/LandingPage";
import NotFound from "./pages/NotFound";
import AccessDeniedPage from "./pages/AccessDeniedPage";
import PrivateRoute from "./utils/PrivateRoute";
import HomePage from "./pages/Restricted/HomePage";
import FamilyList from "./pages/Restricted/FamilyList";
import FamilyTree from "./pages/Restricted/FamilyTree";

function App() {
  return (
    <>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<LoginForm />} />
        <Route path="/accessdenied" element={<AccessDeniedPage />} />
        <Route element={<PrivateRoute />}>
          <Route path="/home" element={<HomePage />} />
          <Route path="/familylist" element={<FamilyList />} />

          <Route path="/familytree" element={<FamilyTree />} />
          {/* 
          <Route path="" element={</>}/>
           */}
        </Route>
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}

export default App;
