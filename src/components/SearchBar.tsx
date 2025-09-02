import React from 'react';
import styles from '../css/SearchBar.module.css';

interface SearchBarProps {
    searchTerm: string;
    setSearchTerm: (value: string) => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ searchTerm, setSearchTerm }) => {
    return (
        <input
            className={styles.searchBar}
            type="text"
            placeholder="Search for a song..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
        />
    );
};

export default SearchBar;