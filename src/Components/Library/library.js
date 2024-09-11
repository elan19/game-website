import React, { useState, useContext, useEffect } from 'react';
import styles from './Library.module.css';

import MongoDbModel from '../../models/mongodb';

const Library = () => {
    // State to hold the list of games and the selected game
    const [games, setGames] = useState([]);
    const [selectedGame, setSelectedGame] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch user's games when component mounts
    useEffect(() => {
        const fetchGames = async () => {
            try {
                const username = localStorage.getItem('username');
                console.log(username); // Debugging: check if username is being fetched correctly

                const userGames = await MongoDbModel.getAllGamesFromUser(username);

                if (userGames.error) {
                    throw new Error(userGames.error);
                }

                // Set the games if they exist in the response
                setGames(userGames.games || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchGames();
    }, []);

    // Handler for selecting a game from the list
    const handleGameClick = (game) => {
        setSelectedGame(game);
    };

    if (loading) {
        return <p>Loading your games...</p>;
    }

    if (error) {
        return <p>Error loading games: {error}</p>;
    }

    return (
        <div className={styles.libraryContainer}>
            <div className={styles.gameList}>
                <h2>Your Games</h2>
                {games.length > 0 ? (
                    <ul>
                        {games.map((game, index) => (
                            <li 
                                key={index} 
                                className={styles.gameItem} 
                                onClick={() => handleGameClick(game)}
                            >
                                {game}
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p>You don't own any games yet.</p>
                )}
            </div>

            <div className={styles.gameDetails}>
                {selectedGame ? (
                    <div>
                        <h2>{selectedGame}</h2>
                        {/* You can add more details if available */}
                        <button 
                            className={styles.playButton}
                            onClick={() => console.log(`Playing ${selectedGame}`)}
                        >
                            Play
                        </button>
                    </div>
                ) : (
                    <p>Please select a game to view details</p>
                )}
            </div>
        </div>
    );
};

export default Library;