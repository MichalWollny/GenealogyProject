// npm's
import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
// local files
import { useAuth } from "../context/AuthProvider";

const LoginForm = () => {
  const { setIsLoggedIn, isLoggedIn, checkUser, userData } = useAuth();
  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [checkingUser, setCheckingUser] = useState(true); // State to track user data check

  useEffect(() => {
    const fetchUserData = async () => {
      await checkUser();
      setCheckingUser(false); // Set checkingUser to false after checkUser completes
    };
    fetchUserData();
  }, []);

  useEffect(() => {
    const checkLoginStatus = () => {
      if (isLoggedIn && userData) {
        alert("Logged in successfully!");
        console.log("You have loggen in.");
        navigate("/home");
      } else {
        console.log("Try logging in!");
        navigate("/login");
      }
    };

    if (!checkingUser) {
      checkLoginStatus();
    }
  }, [isLoggedIn, userData, checkingUser, navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();

    // Get all cookies
    const allCookies = document.cookie.split(";");

    // Loop through each cookie and remove it
    allCookies.forEach((cookie) => {
      const eqPos = cookie.indexOf("=");
      const name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
      Cookies.remove(name.trim());
    });

    try {
      const response = await axios.post(
        `http://localhost:8000/api/users/login`,
        { username, password },
        { withCredentials: true }
      );

      if (response.status === 200) {
        await checkUser();
        setIsLoggedIn(true);
      }
    } catch (error) {
      // console.log(error.response.data.error);
      console.error("Something went wrong in the login function", error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center content-center">
      <p>This is the login page</p>
      <form onSubmit={handleLogin} className="flex flex-col">
        <div className="pb-2">
          <label className="">
            <p>Username</p>
            <input
              type="text"
              label="Username"
              name="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="border-1 pl-2"
            />
          </label>
          <br />
          <label className="">
            <p>Password</p>
            <input
              type="text"
              label="Password"
              name="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border-1 pl-2"
            />
          </label>
        </div>

        <button className="border-2 rounded-none p-4 pt-2 pb-2" type="submit">
          Log in!
        </button>
      </form>
    </div>
  );
};

export default LoginForm;
