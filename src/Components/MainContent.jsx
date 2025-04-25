import React, { useState } from "react";
import { useLocation } from "react-router-dom";

function MainContent({ data, setSong }) {
  const location = useLocation();
  const [text, setText] = useState('');

  const handleInput = (e) => {
    setText(e.target.value);
  }

  let heading = "";
  if (location.pathname === "/top-tracks") {
    heading = "Top Tracks";
  } else if (location.pathname === "/favorites") {
    heading = "Favorites";
  } else if (location.pathname === "/recent") {
    heading = "Recently Played";
  } else {
    heading = "For You";
  }

  const filteredData = text.trim() === ''
    ? data
    : data.filter((song) => {
        const search = text.toLowerCase();
        return (
          song.title.toLowerCase().includes(search) ||
          song.artist.toLowerCase().includes(search)
        );
      }); 

  return (
    <div className="main">
      <h1 className="head">{heading}</h1>

      <div className="input">
        <input
          className="search-bar"
          onChange={handleInput}
          value={text}
          type="text"
          placeholder="Search Songs, Artist"
        />
      </div>

      {filteredData.length > 0 ? (
        filteredData.map((song, index) => (
          <div className="song-list" key={index} onClick={() => setSong(song)}>
            <div className="left">
              <img className="song-img" src={song.thumbnail} alt="img" />
              <div className="song-text">
                <h3 className="song-name">{song.title}</h3>
                <p className="artist">{song.artist}</p>
              </div>
            </div>
            <p className="time">{song.duration}</p>
          </div>
        ))
      ) : (
        <p className="nopara">No Songs or Artists Found.</p>
      )}
    </div>
  );
}

export default MainContent;
