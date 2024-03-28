import React from "react";
import "./Logout.css";
import { useSelector } from "react-redux";
import { selectUser } from "../features/userSlice";

const Logout = () => {
  const user = useSelector(selectUser);

  const dispatch = userDispatch();
  const handleLogout = (e) => {
    e.preventDefault();

    dispatch(logout());
  };
  return (
    <div className="logout">
      <h1>
        Welcome <span className="user_name">{user.name}</span>{" "}
      </h1>
      <button className="logout_btn" on onClick={(e) => handleLogout(e)}>
        Logout
      </button>
    </div>
  );
};

export default Logout;
