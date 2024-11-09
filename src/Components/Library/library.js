import React, { useState, useEffect, useContext } from 'react';
import styles from './Library.module.css';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../util/UserContext'; // Import UserContext

import MongoDbModel from '../../models/mongodb';

const Library = () => {
    const [games, setGames] = useState([]);
    const [selectedGame, setSelectedGame] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 768); // Track if device is mobile
    const navigate = useNavigate();
    const { userData, fetchUserData } = useContext(UserContext);

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await fetchUserData();
            setLoading(false);
        };

        if (!userData) {
            loadData();
        } else {
            setLoading(false);
        }
    }, [userData, fetchUserData]);

    useEffect(() => {
        const fetchGames = async () => {
            try {
                if (!userData) return;

                const userGames = await MongoDbModel.getAllGamesFromUser(userData.username);

                if (userGames.error) {
                    throw new Error(userGames.error);
                }

                setGames(userGames.games || []);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchGames();

        const handleResize = () => {
            setIsMobile(window.innerWidth <= 768);
        };

        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, [userData]);

    const handleGameClick = (game) => {
        setSelectedGame(game);
    };

    const handlePlayClick = (game) => {
        navigate(`/game-session/${game}`);
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
                                {isMobile && selectedGame === game && (
                                    <button 
                                        className={styles.playButtonMobile}
                                        onClick={() => handlePlayClick(game)}
                                    >
                                        Play
                                    </button>
                                )}
                            </li>
                        ))}
                    </ul>
                ) : (
                    games.length === 0 && !loading && <p>You don't own any games yet.</p>
                )}
            </div>

            {!isMobile && (
                <div className={styles.gameDetails}>
                    {selectedGame ? (
                        <div>
                            <h2>{selectedGame}</h2>
                            <button 
                                className={styles.playButton}
                                onClick={() => handlePlayClick(selectedGame)}
                            >
                                Play
                            </button>
                        </div>
                    ) : (
                        <p>Please select a game to view details</p>
                    )}
                </div>
            )}
        </div>
    );
};

export default Library;
