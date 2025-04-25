import React, {useEffect, useState} from 'react'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import "./App.css"
import SideBar from "./Components/SideBar"
import MainContent from "./Components/MainContent"
import Player from "./Components/Player"
import data from "../src/data/data.json"
import top from "./data/topsongs.json"
import fav from "./data/fav.json"
import recent from "./data/recent.json"


function App() {
    const [currentSong, setCurrentSong] = useState(data[0]);
    const [currentIndex, setCurrentIndex] = useState(0);

    const handleNext = () => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % data.length);
    };
    
    const handlePrev = () => {
      if(currentIndex <= 0) setCurrentIndex((prevIndex) => (prevIndex + data.length))
      setCurrentIndex((prevIndex) => (prevIndex - 1) % data.length);    
    };

    useEffect(() => {
      setCurrentSong(data[currentIndex]);
    }, [currentIndex]);
  
    return (
      <Router>
        <div className='column'>
          <SideBar />
          <Routes>
            <Route path='/' element={<MainContent data={data} setSong={setCurrentSong} />} />
            <Route path='/top-tracks' element={<MainContent data={top} setSong={setCurrentSong} />} />
            <Route path='/favorites' element={<MainContent data={fav} setSong={setCurrentSong} />} />
             <Route path='/recent' element={<MainContent data={recent} setSong={setCurrentSong} />} /> 
          </Routes>
          <Player song={currentSong} onPrev={handlePrev} onForward={handleNext} />
        </div>
      </Router>
    );
    
}

export default App;