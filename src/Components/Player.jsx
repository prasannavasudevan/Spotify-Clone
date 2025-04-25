import React, { useRef, useState, useEffect } from 'react';
import { FaEllipsisH, FaBackward, FaPlay, FaPause, FaForward, FaVolumeUp } from 'react-icons/fa';

function Player({ song, onPrev, onForward }) {
  const [play, setPlay] = useState(false);
  const [progress, setProgress] = useState(0);
  const [hasClicked, setHasClicked] = useState(false);
  const audioRef = useRef(null);
  const progressRef = useRef(null);
  const [volume, setVolume] = useState(1);
  const [showVolumeBar, setShowVolumeBar] = useState(false);
  const [volumeTimeout, setVolumeTimeout] = useState(null);

  // AutoPlay when switching songs
  useEffect(() => {
    const tryAutoPlay = () => {
      const audio = audioRef.current;
      if (!audio || !audio.src) return;

      if (hasClicked) {
        if (audio.readyState >= 2) {
          audio
            .play()
            .then(() => setPlay(true))
            .catch((err) => console.log('Auto play blocked or failed:', err));
        } else {
          audio.addEventListener(
            'loadeddata',
            () => {
              audio
                .play()
                .then(() => setPlay(true))
                .catch((err) => console.log('Delayed autoplay failed:', err));
            },
            { once: true }
          );
        }
      }
    };

    if (song) {
      tryAutoPlay();
    }
  }, [song, hasClicked]);

  // Play/Pause Button Logic
  const handleClick = () => {
    const audio = audioRef.current;
    setHasClicked(true);
    if (!audio || !audio.src) return;

    if (!play) {
      if (audio.readyState >= 2) {
        audio
          .play()
          .then(() => setPlay(true))
          .catch((err) => console.log('Play failed:', err));
      } else {
        audio.addEventListener(
          'loadeddata',
          () => {
            audio
              .play()
              .then(() => setPlay(true))
              .catch((err) => console.log('Delayed play failed:', err));
          },
          { once: true }
        );
      }
    } else {
      audio.pause();
      setPlay(false);
    }
  };

  // Progress Bar
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const updateProgress = () => {
      const percentage = (audio.currentTime / audio.duration) * 100;
      setProgress(percentage || 0);
    };

    const handleEnded = () => setPlay(false);

    audio.addEventListener('timeupdate', updateProgress);
    audio.addEventListener('ended', handleEnded);

    return () => {
      audio.removeEventListener('timeupdate', updateProgress);
      audio.removeEventListener('ended', handleEnded);
    };
  }, [song]);

  // Click-to-Seek in Progress Bar
  const handleProgress = (e) => {
    const audio = audioRef.current;
    const bar = progressRef.current;

    if (!audio || !bar) return;

    const rect = bar.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const width = rect.width;
    const newTime = (clickX / width) * audio.duration;
    audio.currentTime = newTime;
  };

  const toggleVolumeBar = () => {
    setShowVolumeBar(prev => {
      const newValue = !prev;

      if (newValue) {
        resetVolumeTimer();
      } else {
        clearTimeout(volumeTimeout);
      }

      return newValue;
    });
  };

  const resetVolumeTimer = () => {
    clearTimeout(volumeTimeout);
    const timeout = setTimeout(() => setShowVolumeBar(false), 10000);
    setVolumeTimeout(timeout);
  };

  const handleVolumeChange = (e) => {
    const audio = audioRef.current;
    const newVolume = 1 - (e.nativeEvent.offsetY / 100); // assuming 100px height
    const clampedVolume = Math.min(1, Math.max(0, newVolume));
    setVolume(clampedVolume);
    if (audio) audio.volume = clampedVolume;
    resetVolumeTimer();
  };

  if (!song) {
    return <div className="now-playing">No song selected.</div>;
  }

  return (
    <div className="now-playing">
      <div className="song-details">
        <h2 className="song-title">{song.title}</h2>
        <p className="song-artist">{song.artist}</p>
      </div>

      <div className="album-art">
        <img src={song.thumbnail} alt="song-img" />
      </div>

      <div className="progress-bar" ref={progressRef} onClick={handleProgress}>
        <div className="progress-filled" style={{ width: `${progress}%` }}></div>
      </div>

      <div className="controls">
        <FaEllipsisH className="control-icon" />
        <FaBackward className="control-icon" onClick={onPrev} />
        <audio ref={audioRef} src={song?.musicUrl} />
        <button className="pause-button" onClick={handleClick}>
          {play ? <FaPause /> : <FaPlay />}
        </button>
        <FaForward className="control-icon" onClick={onForward} />
        <div className="volume-container" style={{ position: 'relative' }}>
          <FaVolumeUp className="control-icon" onClick={toggleVolumeBar} />
          {showVolumeBar && (
            <div className="volume-bar" onClick={handleVolumeChange}>
              <div
                style={{
                  position: 'absolute',
                  bottom: '0',
                  height: `${volume * 100}%`,
                  width: '100%',
                  background: '#555',
                  borderRadius: '4px',
                }}
              ></div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Player;
