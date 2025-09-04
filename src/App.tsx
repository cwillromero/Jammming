import { useState, useEffect } from 'react';
import './App.css';
import SearchBar from './components/SearchBar';
import SearchButton from './components/SearchButton';
import SearchResults from './components/SearchResults';
import TrackList from './components/Tracklist';

export interface Track {
  uri: any;
  id: string;
  name: string;
  artist: string;
  album: string;
  image: string;
  // add more fields as needed
}

function App() {
  // States
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Track[]>([]);
  const [playlistTracks, setPlaylistTracks] = useState<Track[]>([]);
  const [playlistName, setPlaylistName] = useState<string>('My Playlist');

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    console.log('Authorization code:', code);
    if (!code) {
      console.log('No authorization code found, redirecting to Spotify login...');
      redirectToSpotifyLogin(); // Or wait for user action
      return;
    }
  }, []);


  // Functions
  // Function to redirect user to Spotify login if no authotization code is found
  const redirectToSpotifyLogin = () => {
    const queryParams = new URLSearchParams({
      response_type: 'code',
      client_id: import.meta.env.VITE_SPOTIFY_CLIENT_ID,
      scope: 'user-read-private playlist-modify-private playlist-modify-private',
      redirect_uri: import.meta.env.VITE_REDIRECT_URI,
    });

    window.location.href = `https://accounts.spotify.com/authorize?${queryParams.toString()}`;
  }

  // Function  used to fetch the token by client credentials flow
  const exchangeSpotifyCode = async (): Promise<void> => {
    const params = new URLSearchParams(window.location.search);
    const code = params.get('code');
    console.log('Authorization code:', code);
    if (!code) {
      console.log('No authorization code found, redirecting to Spotify login...');
      redirectToSpotifyLogin(); // Or wait for user action
      return;
    }

    const tokenUrl = 'https://accounts.spotify.com/api/token';

    const body = new URLSearchParams({
      code,
      redirect_uri: import.meta.env.VITE_REDIRECT_URI,
      grant_type: 'authorization_code'
    });

    const authHeader = btoa(`${import.meta.env.VITE_SPOTIFY_CLIENT_ID}:${import.meta.env.VITE_SPOTIFY_CLIENT_SECRET}`); // base64 encode

    try {
      const response = await fetch(tokenUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Basic ${authHeader}`
        },
        body: body.toString()
      });

      if (!response.ok) {
        throw new Error(`Token request failed: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      import.meta.env.VITE_SPOTIFY_TOKEN = data.access_token;
      console.log('Access token:', import.meta.env.VITE_SPOTIFY_TOKEN);
      return data;
    } catch (error) {
      console.error('Error exchanging token:', error);
    }

  };

  // Function to handle searching tracks from Spotify API
  const fetchUserId = async (): Promise<string | null> => {
    const url = 'https://api.spotify.com/v1/me';
    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SPOTIFY_TOKEN}`,
        }
      });

      if (!response.ok) {
        throw new Error(`User ID fetch error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log('Fetched User ID:', data.id);
      return data.id;

    } catch (error) {
      alert('User ID not found. Please check your Spotify token and try again.' + error);
      throw new Error(`User ID fetch error: ${error}`);
    }

  };

  // Function to handle searching tracks from Spotify API
  const handleSearch = async (): Promise<void> => {
    if (!searchTerm) {
      return; // Do nothing if search term is empty
    }

    await exchangeSpotifyCode(); // Ensure we have a valid token

    console.log('Searching for:', searchTerm);
    const url = 'https://api.spotify.com/v1/search?q=' + searchTerm + '&type=track&limit=10';

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${import.meta.env.VITE_SPOTIFY_TOKEN}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Spotify API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      // converting response in an array of objects with the attributes id, name, artist, album, and uri
      const tracks = data.tracks.items.map((item: any) => ({
        id: item.id,
        name: item.name,
        artist: item.artists[0].name,
        album: item.album.name,
        uri: item.uri,
        image: item.album.images[2]?.url || '' // Get the smallest image
      }));
      console.log(data);
      setSearchResults(tracks);

    } catch (error) {
      console.error('Fetch error:', error);
      alert('Fetch error:' + error);
    }
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
    const trackURIs = playlistTracks.map(track => track.uri);
    const userId = await fetchUserId();
    const createPlaylistUrl = `https://api.spotify.com/v1/users/${userId}/playlists`;
    let playlistId = '';
    if (!userId) {
      alert('User ID not found. Please check your Spotify token and try again.');
      return;
    }
    // Create a new playlist
    console.log('Creating playlist:', playlistName);
    try {
      const response = await fetch(createPlaylistUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SPOTIFY_TOKEN}`,
        },
        body: JSON.stringify({
          name: playlistName,
          description: 'New playlist created from Jammming',
          public: false
        })
      });

      if (!response.ok) {
        throw new Error(`Fetch error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      playlistId = data.id;
      console.log('Playlist created properly:', data);
    } catch (error) {
      alert('Fetch error:' + error);
      throw new Error(`Fetch error: ${error}`);

    }

    // Add tracks to the newly created playlist
    const addItemsPlaylistUrl = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;
    console.log('Adding tracks to playlist:', playlistId);
    try {
      const response = await fetch(addItemsPlaylistUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${import.meta.env.VITE_SPOTIFY_TOKEN}`,
        },
        body: JSON.stringify({
          uris: trackURIs,
          position: 0
        })
      });

      if (!response.ok) {
        throw new Error(`Fetch error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      playlistId = data.id;
      console.log('Tracks added to Playlist properly:', data);
      alert('Playlist saved to your Spotify account!');
      window.location.reload();

    } catch (error) {
      console.error('Fetch error:', error);
    }
  };

  // Function to handle changing the playlist name
  const handlePlaylistNameChange = (name: string): void => { setPlaylistName(name); };

  return (
    <div className="App">
      <h1>Jammming</h1>
      <br />
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <br /><br />
      <SearchButton onSearch={handleSearch} searchTerm={searchTerm} />
      <div className="grid-container" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem', marginTop: '2rem' }}>
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
