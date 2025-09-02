import React from 'react';

type Track = {
    id: string;
    name: string;
    artist: string;
    album: string;
};

type TrackProps = {
    track: Track;
    isRemoval?: boolean; // true if in Tracklist, false if in SearchResults
    onAdd?: (track: Track) => void;
    onRemove?: (track: Track) => void;
};

const Track: React.FC<TrackProps> = ({ track, isRemoval = false, onAdd, onRemove }) => {
    const handleClick = () => {
        if (isRemoval) {
            onRemove && onRemove(track);
        } else {
            onAdd && onAdd(track);
        }
    };

    return (
        <div
            style={{
                border: '1px solid #ddd',
                borderRadius: '8px',
                padding: '16px',
                margin: '8px 0',
                background: '#fff',
                boxShadow: '0 2px 8px rgba(0,0,0,0.05)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
            }}
        >
            <div>
                <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{track.name}</div>
                <div style={{ fontSize: '0.9rem', color: '#555' }}>
                    {track.artist} | {track.album}
                </div>
            </div>
            <button
                onClick={handleClick}
                style={{
                    fontSize: '1.5rem',
                    background: 'none',
                    border: 'none',
                    color: '#007bff',
                    cursor: 'pointer',
                    padding: '0 8px',
                }}
                aria-label={isRemoval ? 'Remove track' : 'Add track'}
            >
                {isRemoval ? '-' : '+'}
            </button>
        </div>
    );
};

export default Track;