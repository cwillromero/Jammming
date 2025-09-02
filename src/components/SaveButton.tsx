import React from 'react';

type Track = {
    id: string;
    name: string;
    artist: string;
    album: string;
    // add other properties as needed
};

type SaveButtonProps = {
    tracksList: Track[];
    onSave: (tracks: Track[]) => void;
};

const SaveButton: React.FC<SaveButtonProps> = ({ tracksList, onSave }) => {
    const handleClick = () => {
        onSave(tracksList);
    };

    return (
        <button type="button" onClick={handleClick}>
            SAVE TO SPOTIFY
        </button>
    );
};

export default SaveButton;