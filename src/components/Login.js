import React, { useState, useRef } from "react";
import { BG_IMG_URL } from "../utils/constants";
import Header from "./Header";
import { validate } from "./formValidation";
import { auth } from "../utils/firebase";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "firebase/auth";
import { useNavigate } from "react-router";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";

const Login = () => {
  const [signUp, setSignUp] = useState(false);
  const [error, setError] = useState("");
  const email = useRef(null);
  const password = useRef(null);
  const confirmPassword = useRef(null);
  const fullName = useRef(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const toggleSignUp = () => {
    setSignUp(!signUp);
    setError("");
    if (email.current) email.current.value = "";
    if (password.current) password.current.value = "";
    if (confirmPassword.current) confirmPassword.current.value = "";
    if (fullName.current) fullName.current.value = "";
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    const emailValue = email.current.value;
    const passwordValue = password.current.value;
    const confirmPasswordValue = signUp ? confirmPassword.current.value : "";

    const { isValid, message } = validate(
      emailValue,
      passwordValue,
      confirmPasswordValue,
      signUp
    );

    if (!isValid) {
      setError(message);
      return;
    }

    if (signUp) {
      createUserWithEmailAndPassword(auth, emailValue, passwordValue)
        .then((userCredential) => {
          const user = userCredential.user;
          // Dispatch addUser action to store user details in Redux
          dispatch(addUser({ uid: user.uid, email: user.email }));
          navigate("/browse");
        })
        .catch((error) => {
          setError(error.message);
          console.log(error.code + " : " + error.message);
        });
    } else {
      signInWithEmailAndPassword(auth, emailValue, passwordValue)
        .then((userCredential) => {
          const user = userCredential.user;
          // Dispatch addUser action to store user details in Redux
          dispatch(addUser({ uid: user.uid, email: user.email }));
          navigate("/browse");
        })
        .catch((error) => {
          setError("Invalid email or password.");
          console.log(error.code + " : " + error.message);
        });
    }
  };

  return (
    <div className="relative h-screen w-full flex flex-col">
      <Header />
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${BG_IMG_URL})` }}
      ></div>
      <div className="absolute inset-0 bg-black bg-opacity-60"></div>
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="bg-black bg-opacity-70 px-8 py-10 rounded-md shadow-md w-full max-w-md">
          <h1 className="text-3xl text-white text-center mb-5">
            {signUp ? "Sign Up" : "Sign In"}
          </h1>
          <form className="flex flex-col" onSubmit={handleSubmit}>
            {signUp && (
              <input
                ref={fullName}
                type="text"
                placeholder="Full Name"
                className="w-full p-3 mb-3 border border-gray-500 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            )}
            <input
              type="text"
              ref={email}
              placeholder="Email"
              className="w-full p-3 mb-3 border border-gray-500 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
            <input
              type="password"
              ref={password}
              placeholder={signUp ? "Create Password" : "Password"}
              className="w-full p-3 mb-3 border border-gray-500 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
              required
            />
            {signUp && (
              <input
                type="password"
                ref={confirmPassword}
                placeholder="Confirm Password"
                className="w-full p-3 mb-3 border border-gray-500 bg-gray-800 text-white rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
                required
              />
            )}
            <div className="flex items-center mb-3 text-white">
              <input type="checkbox" id="rememberMe" className="mr-2" />
              <label htmlFor="rememberMe" className="text-sm">
                Remember Me
              </label>
            </div>
            {error && <p className="text-red-500 mb-3 text-center">{error}</p>}
            <button
              type="submit"
              className="w-full p-3 bg-red-600 text-white rounded-md hover:bg-red-700 transition duration-300"
            >
              {signUp ? "Sign Up" : "Sign In"}
            </button>
            <p className="text-white text-center mt-5">
              {signUp ? "Already Registered?" : "New to MovieLens?"}
              <span
                className="text-red-500 cursor-pointer ml-1"
                onClick={toggleSignUp}
              >
                {signUp ? "Sign In Now" : "Sign Up Now"}
              </span>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
