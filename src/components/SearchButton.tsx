import React from 'react';

type SearchButtonProps = {
    onSearch: () => Promise<void>;
};

const SearchButton: React.FC<SearchButtonProps> = ({ onSearch }) => {
    const handleClick = () => {
        onSearch();
    };

    return (
        <button type="button" onClick={handleClick}>
            SEARCH SONG
        </button>
    );
};

export default SearchButton;