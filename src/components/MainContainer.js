import React, { useState } from "react";
import { useSelector } from "react-redux";
import useGetVideo from "../hooks/useGetVideo";
import useSelectMovie from "../hooks/useSelectMovie";
import useFetchMovies from "../hooks/useFetchMovies";
import {
  addNowPlayingMovies,
  addPopularMovies,
  addTopRatedMovies,
} from "../utils/movieSlice";
import { Volume2, VolumeX, Info } from "lucide-react";
import VideoBackground from "./VideoBackground";
import MoviePosters from "./MoviePosters";
import MovieDetails from "./MovieDetails";

const MainContainer = ({ showMyList }) => {
  const [isMuted, setIsMuted] = useState(true);
  const [showDetails, setShowDetails] = useState(false);

  useFetchMovies("now_playing", addNowPlayingMovies);
  useFetchMovies("popular", addPopularMovies);
  useFetchMovies("top_rated", addTopRatedMovies);

  const nowPlayingMovies = useSelector(
    (store) => store.movies?.nowPlayingMovies
  );
  const popularMovies = useSelector((store) => store.movies?.popularMovies);
  const topRatedMovies = useSelector((store) => store.movies?.topRatedMovies);
  const myListMovies = useSelector((store) => store.myList.movies);
  const gptMovies = useSelector((store) => store.gpt.gptMovies);

  const selectedMovie = useSelector(
    (store) =>
      store.select?.selectedMovie || (nowPlayingMovies && nowPlayingMovies[0])
  );

  const movieId = selectedMovie?.id;
  const movieName = selectedMovie?.title || selectedMovie?.name;
  useGetVideo(movieId, movieName);
  const videoData = useSelector((store) => store.select?.selectVideo);
  const selectMovie = useSelectMovie();

  const handleMoreInfoClick = () => {
    setShowDetails((prev) => !prev);
  };

  return (
    <div className="absolute w-[100vw] h-[100vh] overflow-hidden flex flex-col">
      <div className="absolute w-full h-[50vh] md:h-[100vh]">
        <VideoBackground
          videoKey={videoData?.key}
          isMuted={isMuted}
          selectedMovie={selectedMovie}
        />
      </div>

      <div className="absolute top-[50vh] bg-black bg-opacity-50 z-10 flex flex-col p-4 md:p-6 w-full">
        <div className="flex items-center gap-6 text-white mb-4">
          <h1 className="text-xl md:text-3xl font-bold">
            {selectedMovie?.title}
          </h1>
          <div className="flex gap-3">
            <button
              className="bg-gray-700 text-white px-3 py-1 md:px-4 md:py-2 rounded-lg flex items-center gap-2 hover:bg-gray-600 transition z-20"
              onClick={handleMoreInfoClick}
            >
              <Info size={18} />
              <span className="hidden md:inline">More Info</span>
            </button>
            <button
              className="bg-gray-700 text-white px-3 py-1 md:px-4 md:py-2 rounded-lg flex items-center gap-2 hover:bg-gray-600 transition z-20"
              onClick={() => setIsMuted(!isMuted)}
            >
              {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
            </button>
          </div>
        </div>

        <div className="h-[40vh] overflow-y-auto no-scrollbar scrollbar-thumb-gray-600 scrollbar-track-transparent p-2">
          {gptMovies && gptMovies.length > 0 && (
            <MoviePosters
              movies={gptMovies}
              onSelect={selectMovie}
              categoryLabel="Based on Recent Query"
            />
          )}

          {showMyList ? (
            myListMovies && myListMovies.length > 0 ? (
              <MoviePosters
                movies={myListMovies}
                onSelect={selectMovie}
                categoryLabel="My List"
              />
            ) : (
              <p className="text-white text-center mt-10">
                No movies in your list yet.
              </p>
            )
          ) : (
            <>
              {nowPlayingMovies && nowPlayingMovies.length > 0 ? (
                <MoviePosters
                  movies={nowPlayingMovies}
                  onSelect={selectMovie}
                  categoryLabel="Now Playing"
                />
              ) : (
                <p className="text-white text-center mt-10">
                  Loading Now Playing movies...
                </p>
              )}
              {popularMovies && popularMovies.length > 0 ? (
                <MoviePosters
                  movies={popularMovies}
                  onSelect={selectMovie}
                  categoryLabel="Popular"
                />
              ) : (
                <p className="text-white text-center mt-10">
                  Loading Popular movies...
                </p>
              )}
              {topRatedMovies && topRatedMovies.length > 0 ? (
                <MoviePosters
                  movies={topRatedMovies}
                  onSelect={selectMovie}
                  categoryLabel="Top Rated"
                />
              ) : (
                <p className="text-white text-center mt-10">
                  Loading Top Rated movies...
                </p>
              )}
            </>
          )}
        </div>
      </div>

      {showDetails && selectedMovie && (
        <MovieDetails
          movie={selectedMovie}
          onClose={() => setShowDetails(false)}
        />
      )}
    </div>
  );
};

export default MainContainer;
