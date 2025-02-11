import React from "react";
import { useNavigate, Link } from "react-router-dom";

const HomePage = () => {
  return (
    <div className="m-5 p-5">
      <div className="flex flex-col items-center justify-center content-center">
        <p className="text-3xl text-center">
          This is the home page. <br />
          You are logged in.
        </p>
        <br />
        <nav>
          <ul className="list-disc text-2xl">
            <li>
              <Link to="/familylist">Family List</Link>
            </li>
            <li>
              <Link to="/familytree">Family Tree</Link>
            </li>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default HomePage;
