import { useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToMyList, removeFromMyList } from "../utils/ListSlice";

const MovieDetails = ({ movie, onClose }) => {
  const dispatch = useDispatch();
  const detailsRef = useRef(null);
  const myListMovies = useSelector((store) => store.myList.movies);

  // Close on clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (detailsRef.current && !detailsRef.current.contains(event.target)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [onClose]);

  const isMovieInList = () => {
    return myListMovies.some((m) => m.id === movie.id);
  };

  const handleAddToList = () => {
    dispatch(addToMyList(movie));
  };

  const handleRemoveFromList = () => {
    dispatch(removeFromMyList(movie.id));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-50 p-4">
      <div
        ref={detailsRef}
        className="relative w-full max-w-lg bg-black bg-opacity-80 p-6 rounded-lg text-white shadow-xl backdrop-blur-lg border border-gray-600"
      >
        <img
          src={`https://image.tmdb.org/t/p/w500${movie?.poster_path}`}
          alt={movie?.title}
          className="w-[50%] mx-auto object-cover rounded-lg"
        />
        <h2 className="text-2xl font-bold mt-4">{movie?.title}</h2>
        <p className="text-sm mt-2">{movie?.overview}</p>
        <p className="text-sm mt-2">
          ⭐ {movie?.vote_average} | 📅 {movie?.release_date}
        </p>
        <button
          className={`mt-4 w-full py-2 px-4 rounded-lg font-semibold text-white transition-all duration-300 transform ${
            isMovieInList()
              ? "bg-red-600 hover:bg-red-700 hover:scale-105"
              : "bg-green-600 hover:bg-green-700 hover:scale-105"
          }`}
          onClick={isMovieInList() ? handleRemoveFromList : handleAddToList}
        >
          {isMovieInList() ? "Remove from My List" : "Add to My List"}
        </button>
      </div>
    </div>
  );
};

export default MovieDetails;
