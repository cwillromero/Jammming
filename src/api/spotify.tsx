export interface Track {
  uri: any;
  id: string;
  name: string;
  artist: string;
  album: string;
  image: string;
  // add more fields as needed
}

// Function to redirect user to Spotify login if no authotization code is found
export const redirectToSpotifyLogin = () => {
    const queryParams = new URLSearchParams({
        response_type: 'code',
        client_id: import.meta.env.VITE_SPOTIFY_CLIENT_ID,
        scope: 'user-read-private playlist-modify-private playlist-modify-private',
        redirect_uri: import.meta.env.VITE_REDIRECT_URI,
    });

    window.location.href = `https://accounts.spotify.com/authorize?${queryParams.toString()}`;
}

// Function  used to fetch the token by client credentials flow
export const generateToken = async (): Promise<void> => {
    const tokenUrl = 'https://accounts.spotify.com/api/token';

    const body = new URLSearchParams({
        code: localStorage.getItem('spotify_auth_code') ?? '',
        redirect_uri: import.meta.env.VITE_REDIRECT_URI,
        grant_type: 'authorization_code'
    });

    const authHeader = btoa(`${import.meta.env.VITE_SPOTIFY_CLIENT_ID}:${import.meta.env.VITE_SPOTIFY_CLIENT_SECRET}`); // base64 encode

    try {
        const response = await fetch(tokenUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': `Basic ${authHeader}`
            },
            body: body.toString()
        });

        if (!response.ok) {
            throw new Error(`Token request failed: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        localStorage.setItem('spotify_access_token', data.access_token);
        localStorage.setItem('spotify_refresh_token', data.refresh_token);
        console.log('Access and Refresh tokens generated and stored in localStorage.');

        // add an expiration time to the token (1 hour)
        const expiresIn = data.expires_in; // in seconds
        const expirationTime = Date.now() + expiresIn * 1000;
        localStorage.setItem('spotify_token_expiration', expirationTime.toString());
    } catch (error) {
        console.error('Error exchanging token:', error);
    }

};

// function to validate if the token is expired
export const validateTokenExpiration = (): void => {
    const expiration = parseInt(localStorage.getItem('spotify_token_expiration') || '0', 10);
    const now = Date.now();

    if (now >= expiration) {
        console.warn('Spotify token expired. Redirecting to home...');
        localStorage.removeItem('spotify_access_token');
        localStorage.removeItem('spotify_refresh_token');
        localStorage.removeItem('spotify_auth_code');
        localStorage.removeItem('spotify_token_expiration');

        window.location.href = '/'; // Redirect to home
    }
}

// Function to handle searching tracks from Spotify API
export const fetchUserId = async (): Promise<string | null> => {
    validateTokenExpiration();// Validate token expiration before making API calls
    const url = 'https://api.spotify.com/v1/me';

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('spotify_access_token')}`,
            }
        });

        if (!response.ok) {
            throw new Error(`User ID fetch error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Fetched User ID:', data.id);
        return data.id;

    } catch (error) {
        alert('User ID not found. Please check your Spotify token and try again.' + error);
        throw new Error(`User ID fetch error: ${error}`);
    }

};

// Fuction to create a new playlist and return its ID
export const createPlaylist = async (userId: string, playlistName: string): Promise<string> => {
    validateTokenExpiration();// Validate token expiration before making API calls
    const createPlaylistUrl = `https://api.spotify.com/v1/users/${userId}/playlists`;
    // Create a new playlist
    console.log('Creating playlist:', playlistName);
    try {
        const response = await fetch(createPlaylistUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('spotify_access_token')}`,
            },
            body: JSON.stringify({
                name: playlistName,
                description: 'New playlist created from Jammming',
                public: false
            })
        });

        if (!response.ok) {
            throw new Error(`Fetch error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        console.log('Playlist created properly:', data);
        return data.id;
    } catch (error) {
        alert('Fetch error:' + error);
        throw new Error(`Fetch error: ${error}`);
    }
}

// Function to add tracks to the created playlist
export const addTracksToPlaylist = async (playlistId: string, playlistTracks: Track[]): Promise<void> => {
    validateTokenExpiration();// Validate token expiration before making API calls
    const trackURIs = playlistTracks.map(track => track.uri);
    const addItemsPlaylistUrl = `https://api.spotify.com/v1/playlists/${playlistId}/tracks`;
    console.log('Adding tracks to playlist:', playlistId);

    try {
        const response = await fetch(addItemsPlaylistUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${localStorage.getItem('spotify_access_token')}`,
            },
            body: JSON.stringify({
                uris: trackURIs,
                position: 0
            })
        });

        if (!response.ok) {
            throw new Error(`Fetch error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        playlistId = data.id;
        console.log('Tracks added to Playlist properly:', data);
        alert('Playlist saved to your Spotify account!');
        window.location.href = '/'; // Redirect to home after saving
    } catch (error) {
        console.error('Fetch error:', error);
    }
}

// Function to handle searching tracks from Spotify API
export const searchTracks = async (term: string): Promise<Track[]> => {
    validateTokenExpiration();// Validate token expiration before making API calls
    console.log('Searching for:', term);
    const url = 'https://api.spotify.com/v1/search?q=' + term + '&type=track&limit=10';

    try {
        const response = await fetch(url, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${localStorage.getItem('spotify_access_token')}`,
                'Content-Type': 'application/json'
            }
        });

        if (!response.ok) {
            throw new Error(`Spotify API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        // converting response in an array of objects with the attributes id, name, artist, album, and uri
        const tracks = data.tracks.items.map((item: any) => ({
            id: item.id,
            name: item.name,
            artist: item.artists[0].name,
            album: item.album.name,
            uri: item.uri,
            image: item.album.images[2]?.url || '' // Get the smallest image
        }));
        console.log(data);
        return tracks

    } catch (error) {
        console.error('Fetch error:', error);
        alert('Fetch error:' + error);
        return []; // Ensure a Track[] is always returned
    }
}
