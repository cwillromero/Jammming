import { useState, useEffect } from 'react';
import styles from './css/App.module.css';
import SearchBar from './components/SearchBar';
import SearchButton from './components/SearchButton';
import SearchResults from './components/SearchResults';
import TrackList from './components/Tracklist';
import { redirectToSpotifyLogin, generateToken, searchTracks, fetchUserId, createPlaylist, addTracksToPlaylist, validateTokenExpiration } from './api/spotify';
import type { Track } from './api/spotify';

function App() {
  // States
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Track[]>([]);
  const [playlistTracks, setPlaylistTracks] = useState<Track[]>([]);
  const [playlistName, setPlaylistName] = useState<string>('My Playlist');

  useEffect(() => {
    const fetchToken = async () => {
      const params = new URLSearchParams(window.location.search);
      const code = params.get('code');

      // If no code, redirect to Spotify login
      if (!code) {
        console.log('No authorization code found, redirecting to Spotify login...');
        redirectToSpotifyLogin();
        return;
      }

      // Store new code and generate token
      localStorage.setItem('spotify_auth_code', code);
      await generateToken();
      window.history.replaceState({}, document.title, window.location.pathname);
    };

    fetchToken();
  }, []);


  // Functions
  // Function to handle searching tracks from Spotify API
  const handleSearch = async (): Promise<void> => {
    if (!searchTerm) {
      return; // Do nothing if search term is empty
    }
    validateTokenExpiration();// Validate token expiration before making API calls
    const results = await searchTracks(searchTerm);
    setSearchResults(results);
    setSearchTerm(''); // Clear search input after search
  };

  // Function to handle adding a track to the playlist
  const handleAddTrack = (track: Track): void => {
    if (playlistTracks.find(savedTrack => savedTrack.id === track.id)) {
      return; // Track is already in the playlist
    }
    setPlaylistTracks(prevTracks => [...prevTracks, track]);
  };

  // Function to handle removing a track from the playlist
  const handleRemoveTrack = (track: Track): void => {
    setPlaylistTracks(prevTracks => prevTracks.filter(t => t.id !== track.id));
  };

  // Function to handle saving the playlist to Spotify
  const handleSave = async (): Promise<void> => {
    const userId = await fetchUserId();

    if (!userId) {
      alert('User ID not found. Please check your Spotify token and try again.');
      window.location.href = '/'; // Redirect to home after saving
      return
    }

    const playlistId = await createPlaylist(userId, playlistName);
    if (!playlistId) {
      alert('Playlist creation failed. Please try again.');
      window.location.href = '/'; // Redirect to home after saving
      return;
    }

    await addTracksToPlaylist(playlistId, playlistTracks);
  };

  // Function to handle changing the playlist name
  const handlePlaylistNameChange = (name: string): void => { setPlaylistName(name); };

  return (
    <div className="App">
      <h1>Jammming</h1>
      <br />
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} onSearch={handleSearch} />
      <br /><br />
      <SearchButton onSearch={handleSearch} />
      <div className={styles.gridContainer}>
        <div>
          {searchResults.length > 0 && <SearchResults
            searchResults={searchResults}
            onAdd={handleAddTrack}
            onRemove={handleRemoveTrack}
          />}
        </div>
        <div>
          {playlistTracks.length > 0 && <TrackList
            playlistTracks={playlistTracks}
            playlistName={playlistName}
            onPlaylistNameChange={handlePlaylistNameChange}
            onAdd={handleAddTrack}
            onRemove={handleRemoveTrack}
            onSave={handleSave}
          />}
        </div>
      </div>
    </div>
  );
}

export default App;
