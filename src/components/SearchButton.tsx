import React from 'react';

type SearchButtonProps = {
    searchTerm: string;
    onSearch: (searchTerm: string) => Promise<void>;
};

const SearchButton: React.FC<SearchButtonProps> = ({ searchTerm, onSearch }) => {
    const handleClick = () => {
        onSearch(searchTerm);
    };

    return (
        <button type="button" onClick={handleClick}>
            SEARCH SONG
        </button>
    );
};

export default SearchButton;