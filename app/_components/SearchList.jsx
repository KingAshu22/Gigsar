import React, { useState } from "react";
import genreOptions from "../(route)/registration/constants/genres";
import { topGenres } from "../(route)/registration/constants/topGenres";

const SearchList = ({ selectedGenres, setSelectedGenres }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSelectGenre = (genre) => {
    if (!selectedGenres.includes(genre)) {
      setSelectedGenres([...selectedGenres, genre]);
    }
    setSearchTerm("");
  };

  const handleRemoveGenre = (genreToRemove) => {
    setSelectedGenres(
      selectedGenres.filter((genre) => genre !== genreToRemove)
    );
  };

  const filteredGenres = genreOptions.filter(
    (genre) =>
      genre.toLowerCase().includes(searchTerm.toLowerCase()) &&
      !selectedGenres.includes(genre)
  );

  const filteredTopGenres = topGenres.filter(
    (genre) => !selectedGenres.includes(genre)
  );

  return (
    <div className="mt-4 p-4">
      <div className="mb-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Selected Genres:
        </label>
        <div className="flex flex-wrap">
          {selectedGenres.map((genre, index) => (
            <div
              key={index}
              className="bg-primary text-white px-3 py-1 m-1 rounded-full flex items-center"
            >
              {genre}
              <button
                type="button"
                className="ml-2 text-white hover:text-gray-300"
                onClick={() => handleRemoveGenre(genre)}
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Top Genres:
        </label>
        <div className="flex flex-wrap">
          {filteredTopGenres.map((genre, index) => (
            <button
              type="button"
              key={index}
              onClick={() => handleSelectGenre(genre)}
              className="bg-gray-200 text-gray-700 px-3 py-1 m-1 rounded-full hover:bg-gray-300"
            >
              {genre}
            </button>
          ))}
        </div>
      </div>

      <input
        type="text"
        value={searchTerm}
        onChange={handleChange}
        placeholder="Search for your genre..."
        className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {searchTerm && (
        <ul className="mt-2 border rounded-lg shadow-lg bg-white overflow-hidden">
          {filteredGenres.map((genre, index) => (
            <li
              key={index}
              onClick={() => handleSelectGenre(genre)}
              className="px-4 py-2 cursor-pointer hover:bg-blue-100"
            >
              {genre}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchList;
