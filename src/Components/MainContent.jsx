import React, { useState } from "react";

function MainContent({ data, setSong }) {
  const [text, setText] = useState('');

  const handleInput = (e) => {
    setText(e.target.value);
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
      <h1 className="head">For You</h1>

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
