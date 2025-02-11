// npm's
import { useEffect, useRef, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
// local files
import { useAuth } from "../context/AuthProvider";

const LandingPage = () => {
  const { isLoggedIn, checkUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserData = async () => {
      await checkUser();
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      navigate("/home");
    } else {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  return (
    <div>
      <p>This is the landing page.</p>
      <p>You are not logged in!</p>
    </div>
  );
};

export default LandingPage;
