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
  const handleSearch = (): void => {};
  const handleAddTrack = (track: Track): void => {};
  const handleRemoveTrack = (track: Track): void => {};
  const handleSave = (playlistTracks: Track[]): void => {};
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
