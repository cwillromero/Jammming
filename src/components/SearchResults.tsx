import React from 'react';
import Track from './Track';

type TrackType = {
    id: string;
    name: string;
    artist: string;
    album: string;
    uri: any;
    image: string;
};

type SearchResultsProps = {
    searchResults: TrackType[];
    onAdd: (track: TrackType) => void;
    onRemove: (track: TrackType) => void;
};

const SearchResults: React.FC<SearchResultsProps> = ({ searchResults, onAdd, onRemove }) => {
    return (
        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
            <h2>Results</h2>
            <div>
                {searchResults.map((track) => (
                    <Track
                        track={track}
                        isRemoval={false}
                        onAdd={onAdd}
                        onRemove={onRemove}
                    />
                ))}
            </div>
        </div>
    );
};

export default SearchResults;
