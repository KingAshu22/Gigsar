import React, { useState } from "react";
import genreOptions from "../(route)/registration/constants/genres";

const SearchList = ({ selectedGenres, setSelectedGenres }) => {
  const [searchTerm, setSearchTerm] = useState("");

  const handleChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSelectGenre = (genre) => {
    setSelectedGenres([...selectedGenres, genre]);
    setSearchTerm("");
  };

  const handleRemoveGenre = (genreToRemove) => {
    setSelectedGenres(
      selectedGenres.filter((genre) => genre !== genreToRemove)
    );
  };

  const filteredGenres = genreOptions.filter((genre) =>
    genre.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="mt-4">
      <div className="mb-2">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Selected Genres:
        </label>
        <div className="flex flex-wrap">
          {selectedGenres.map((genre, index) => (
            <div
              key={index}
              className="bg-blue-500 text-white px-3 py-1 m-1 rounded-full flex items-center"
            >
              {genre}
              <button
                className="ml-2 text-white hover:text-gray-300"
                onClick={() => handleRemoveGenre(genre)}
              >
                &times;
              </button>
            </div>
          ))}
        </div>
      </div>
      <input
        type="text"
        value={searchTerm}
        onChange={handleChange}
        placeholder="Type a genre"
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
