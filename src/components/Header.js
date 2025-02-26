import React, { useState, useEffect, useRef } from "react";
import { FaSearch, FaList, FaHome } from "react-icons/fa";
import { useNavigate } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import { signOut, onAuthStateChanged } from "firebase/auth";
import { auth } from "../utils/firebase";
import { addUser, removeUser } from "../utils/userSlice";
import { PROFILE_ICON } from "../utils/constants";
import { ReactSVG } from "react-svg";
import useSearchMovie from "../hooks/useSearchMovie";
import { setSelectedMovie } from "../utils/selectSlice";
import { toggleShow } from "../utils/gptSlice";
import { Bot } from "lucide-react";
import GptSearchPopup from "./GptSearchPopup";

const Header = ({ setShowMyList, showMyList }) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const [searchValue, setSearchValue] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [showGptPopup, setShowGptPopup] = useState(false);
  const searchRef = useRef(null);
  const profileRef = useRef(null);

  const { fetchMovies } = useSearchMovie(searchValue, setSearchResults);
  const username = user?.email?.split("@")[0] || "Guest";

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      if (currentUser) {
        const { uid, email } = currentUser;
        dispatch(addUser({ uid: uid, email: email }));
        navigate("/browse");
      } else {
        dispatch(removeUser());
        navigate("/");
      }
    });
    return () => unsubscribe();
  }, [dispatch, navigate]);

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      fetchMovies();
    }, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchValue, fetchMovies]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setSearchResults([]);
        setIsSearching(false);
      }
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setShowProfileMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSignOut = () => {
    signOut(auth)
      .then(() => {
        dispatch(removeUser());
        navigate("/");
      })
      .catch((error) => console.error("Error signing out:", error));
  };

  const handleMovieSelect = (movie) => {
    dispatch(setSelectedMovie(movie));
    setSearchValue("");
    setSearchResults([]);
    setIsSearching(false);
  };

  const handleToggle = () => {
    setShowMyList(!showMyList);
  };

  const handleBotClick = () => {
    setShowGptPopup(true);
    dispatch(toggleShow());
  };

  return (
    <header className="absolute top-0 left-0 w-full bg-black/75 px-6 md:px-10 py-4 flex items-center justify-between z-20 shadow-lg">
      <div className="flex items-center gap-3">
        <div className="flex-shrink-0 overflow-hidden">
          <ReactSVG
            src="/logo.svg"
            className="hidden md:block w-50 fill-red-600 cursor-pointer transition-transform duration-300 hover:scale-105"
            onClick={() => navigate("/browse")}
          />
          <img
            src="/M.svg"
            alt="MovieLens Logo"
            className="block md:hidden w-10 h-10 cursor-pointer transition-transform duration-300 hover:scale-105"
            onClick={() => navigate("/browse")}
          />
        </div>
        <div>
          {user && (
            <button
              onClick={handleToggle}
              className="flex items-center gap-2 text-white font-medium text-sm md:text-base px-3 py-1.5 rounded-md bg-red-600/20 hover:bg-red-600/40 transition-all duration-300 hover:text-red-500"
            >
              {showMyList ? (
                <FaHome className="w-4 h-4" />
              ) : (
                <FaList className="w-4 h-4" />
              )}
              <span className="hidden md:inline">
                {showMyList ? "Home" : "My List"}
              </span>
            </button>
          )}
        </div>
      </div>

      {user && (
        <div
          className="relative flex gap-6 items-center md:gap-6"
          ref={profileRef}
        >
          <div className="relative group" ref={searchRef}>
            <div className="flex items-center border-b border-gray-400 px-3 py-2 bg-gray-900 rounded-md">
              <FaSearch className="text-gray-300" />
              <input
                type="text"
                className={`bg-transparent text-white px-2 focus:outline-none w-24 md:w-48 placeholder-gray-400 transition-all ${
                  isSearching ? "w-full md:group-hover:w-64" : "group-hover:w-64"
                }`}
                placeholder="Search movies..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                onFocus={() => setIsSearching(true)}
              />
            </div>
            {searchResults.length > 0 && (
              <div className="absolute left-0 right-0 mt-2 max-h-80 w-full overflow-y-auto no-scrollbar bg-gray-900/95 rounded-lg shadow-2xl border border-gray-800">
                {searchResults.map((movie) => (
                  <div
                    key={movie.id}
                    className="flex items-center gap-3 p-3 hover:bg-gray-800/80 cursor-pointer transition-colors duration-200"
                    onClick={() => handleMovieSelect(movie)}
                  >
                    <img
                      src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`}
                      alt={movie.title}
                      className="w-10 h-14 object-cover rounded-md shadow-sm"
                    />
                    <span className="text-sm md:text-base text-white font-medium">
                      {movie.title}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <Bot
            onClick={handleBotClick}
            className={`w-6 h-6 text-white cursor-pointer hover:text-red-500 transition-colors duration-300 ${
              isSearching ? "hidden md:block" : ""
            }`}
          />
          <img
            className={`w-10 h-10 cursor-pointer rounded-sm border-2 border-transparent hover:border-red-500 transition ${
              isSearching ? "hidden md:block" : ""
            }`}
            src={PROFILE_ICON}
            alt="Profile"
            onClick={() => setShowProfileMenu((prev) => !prev)}
          />

          {showProfileMenu && (
            <div className="absolute top-[105%] right-0 w-56 bg-gray-900 text-white p-4 rounded-lg shadow-lg border border-gray-700">
              <p className="text-lg font-semibold">{username}</p>
              <p className="text-sm text-gray-400">{user?.email}</p>
              <hr className="border-gray-600 my-3" />
              <button
                onClick={handleSignOut}
                className="w-full bg-red-500 hover:bg-red-600 text-white py-2 rounded-md transition duration-300"
              >
                Sign Out
              </button>
            </div>
          )}
        </div>
      )}

      {showGptPopup && (
        <GptSearchPopup onClose={() => setShowGptPopup(false)} />
      )}
    </header>
  );
};

export default Header;