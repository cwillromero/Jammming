import React from 'react';
import styles from '../css/SearchBar.module.css';

interface SearchBarProps {
    searchTerm: string;
    setSearchTerm: (value: string) => void;
    onSearch: () => Promise<void>;
};

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, setSearchTerm, onSearch }) => {
    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            onSearch();
        }
    };

    return (
        <input
            className={styles.searchBar}
            type="text"
            placeholder="Search for a song..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            onKeyDown={handleKeyDown}
        />
    );
};

export default SearchBar;