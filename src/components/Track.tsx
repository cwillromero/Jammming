import React from 'react';
import styles from '../css/Track.module.css';

type Track = {
    id: string;
    name: string;
    artist: string;
    album: string;
    uri: any;
    image: string;
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
            console.log('Removing track:', track);
            onRemove && onRemove(track);
        } else {
            console.log('Adding track:', track);
            onAdd && onAdd(track);
        }
    };

    return (
        <div className={styles.card}>
            <img
            src={track.image}
            alt={`${track.name} album cover`}
            width={64}
            height={64}
            style={{ objectFit: 'cover', borderRadius: '4px', marginRight: '12px' }}
            />
            <div className={styles.cardContent}>
            <div className={styles.title}>{track.name.length > 25 ? track.name.slice(0, 25) + '...' : track.name}</div>
            <div className={styles.artist}>
                {track.artist} | {track.album.length > 25 ? track.album.slice(0, 25) + '...' : track.album}
            </div>
            </div>
            <button
            onClick={handleClick}
            aria-label={isRemoval ? 'Remove track' : 'Add track'}
            className='track-action'
            >
            {isRemoval ? '-' : '+'}
            </button>
        </div>
    );
};

export default Track;