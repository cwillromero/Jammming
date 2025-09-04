import { useState } from 'react';
import './App.css';
import SearchBar from './components/SearchBar';
import SearchButton from './components/SearchButton';
import SearchResults from './components/SearchResults';
import TrackList from './components/Tracklist';

export interface Track {
  id: string;
  name: string;
  artist: string;
  album: string;
  // add more fields as needed
}

function App() {
  // States
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [searchResults, setSearchResults] = useState<Track[]>([]);
  const [playlistTracks, setPlaylistTracks] = useState<Track[]>([]);
  const [playlistName, setPlaylistName] = useState<string>('My Playlist');

  // Functions
  const handleSearch = async (): Promise<void> => {
    console.log('Searching for:', searchTerm);
    console.log('Token:', import.meta.env.VITE_SPOTIFY_TOKEN);
    const url = 'https://api.spotify.com/v1/search?q=' + searchTerm + '&type=track&limit=10';
    const token = import.meta.env.VITE_SPOTIFY_TOKEN; // Replace with your actual token

    try {
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Spotify API error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      console.log(data);

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
    }
  };
  const handleAddTrack = (track: Track): void => { };
  const handleRemoveTrack = (track: Track): void => { };
  const handleSave = (playlistTracks: Track[]): void => { };
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
          <SearchResults
            searchResults={searchResults}
            onAdd={handleAddTrack}
            onRemove={handleRemoveTrack}
          />
        </div>
        <div>
          <TrackList
            playlistTracks={playlistTracks}
            playlistName={playlistName}
            onPlaylistNameChange={handlePlaylistNameChange}
            onAdd={handleAddTrack}
            onRemove={handleRemoveTrack}
            onSave={handleSave}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
