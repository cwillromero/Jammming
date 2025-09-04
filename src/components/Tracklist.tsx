import React, { useState } from 'react';
import Track from './Track';
import SaveButton from './SaveButton';

type TrackType = {
    id: string;
    name: string;
    artist: string;
    album: string;
    uri: any;
    image: string;
};

type TracklistProps = {
    playlistTracks: TrackType[];
    playlistName: string;
    onPlaylistNameChange: (name: string) => void;
    onAdd: (track: TrackType) => void;
    onRemove: (track: TrackType) => void;
    onSave: () => void;
};

const Tracklist: React.FC<TracklistProps> = ({
    playlistTracks,
    playlistName,
    onPlaylistNameChange,
    onAdd,
    onRemove,
    onSave
}) => {
    const [editing, setEditing] = useState(false);
    const [inputValue, setInputValue] = useState(playlistName);

    const handleEditClick = () => {
        setEditing(true);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setInputValue(e.target.value);
    };

    const handleInputBlur = () => {
        setEditing(false);
        onPlaylistNameChange(inputValue);
    };

    const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            setEditing(false);
            onPlaylistNameChange(inputValue);
        }
    };

    React.useEffect(() => {
        setInputValue(playlistName);
    }, [playlistName]);

    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
            <div>
                {editing ? (
                    <input
                        type="text"
                        value={inputValue}
                        onChange={handleInputChange}
                        onBlur={handleInputBlur}
                        onKeyDown={handleInputKeyDown}
                        autoFocus
                        style={{ fontSize: '1.5rem', fontWeight: 'bold' }}
                    />
                ) : (
                    <h2 style={{ display: 'inline-block', marginRight: '0.5rem' }}>{playlistName}</h2>
                )}
                {!editing && (
                    <button onClick={handleEditClick} style={{ fontSize: '1rem' }}>
                        ✏️
                    </button>
                )}
            </div>
            <div>
                {playlistTracks.map((track) => (
                    <Track
                        key={track.id}
                        track={track}
                        isRemoval={true}
                        onAdd={onAdd}
                        onRemove={onRemove}
                    />
                ))}
            </div>
            {playlistTracks.length > 0 && <SaveButton tracksList={playlistTracks} onSave={onSave} />}
        </div>
    );
};

export default Tracklist;
