import { useSelector } from "react-redux";

const useMyListMovies = () => {
  const myListMovies = useSelector((store) => store.myList.movies);
  return myListMovies;
};

export default useMyListMovies;
