import React, { useState, useContext, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { UserContext } from '../../util/UserContext';
import MongoDbModel from '../../models/mongodb';

import styles from "./GameInfo.module.css";

const GameInfo = () => {
    const { gameId } = useParams();
    const [game, setGame] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');  // New state for error message
    let { userData, fetchUserData } = useContext(UserContext);
    const navigate = useNavigate();

    const apiKey = process.env.REACT_APP_API_KEY;
    const baseURL = process.env.REACT_APP_BASE_URL;

    useEffect(() => {
        const fetchGameInfo = async () => {
            try {
                const response = await fetch(`${baseURL}/games/${gameId}?key=${apiKey}`);
                const result = await response.json();
                setGame(result);
            } catch (error) {
                console.error('Error fetching game info:', error);
            }
            setLoading(false);
        };

        fetchGameInfo();
    }, [gameId, apiKey, baseURL]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!game) {
        return <div>No game info available</div>;
    }

    // Check if the user already owns the game
    const userOwnsGame = userData?.games?.some((userGame) => userGame === game.name);

    let platforms = "";
    let genres = "";
    let reqMin = "Minumum:\nUnknown";
    let reqRec = "Recommended:\nSame as Minimum";
    let publishers = [];
    let ratingCount = 0;
    let ratingPercent = 0;
    let gameCost = 9.99;

    if (game.ratings?.[0]) {
        ratingCount = game.ratings[0].count || 0;
        ratingPercent = game.ratings[0].percent || 0;
    }

    game.platforms?.forEach(platformInfo => {
        platforms += `${platformInfo.platform.name} | `;
        if (platformInfo.platform.name === "PC") {
            reqMin = platformInfo.requirements.minimum || reqMin;
            reqRec = platformInfo.requirements.recommended || reqRec;
        }
    });

    game.genres?.forEach(genre => {
        genres += `${genre.name}, `;
    });

    game.publishers?.forEach(publisher => {
        publishers.push(publisher.name);
    });

    platforms = platforms.slice(0, -3);
    genres = genres.slice(0, -2);
    const publishersHTML = game.publishers.map(publisher => (
        <Link key={publisher.id} to={`/publisher/${publisher.id}`}>{publisher.name}</Link>
    )).reduce((prev, curr) => [prev, ', ', curr]);

    const handleBuyClick = async () => {
        if (userOwnsGame) return;
        try {
            const response = await MongoDbModel.purchaseGame(userData.username, -gameCost, game.name);
            if (response.error) {
                setError(response.error);  // Set error message if there's an error from backend
            } else {
                setError('');  // Clear error if purchase is successful
                fetchUserData();
            }
        } catch (error) {
            console.error('Failed to update user data:', error);
            setError("An unexpected error occurred");  // General error message for unexpected issues
        }
    };

    return (
        <div>
            <h2 className={styles.mapHeading}>{game.name}</h2>
            <div className={`${styles.both} ${styles.noCursor} ${styles.gameInfoHeight}`}>
                <div className={`${styles.leftDiv} ${styles.noMarginLeft}`}>
                    <img className={styles.gameInfoPic} src={game.background_image} alt={game.name} />
                </div>
                <div className={styles.rightDivInfo}>
                    {game.background_image_additional ? (
                        <img className={styles.rightDivInfoImg} src={game.background_image_additional} alt={game.name} />
                    ) : (
                        <img className={styles.rightDivInfoImg} src={game.background_image} alt={game.name} />
                    )}
                    <p>Average reviews: <span>{game.rating} av 5</span></p>
                    <p>Top reviews: <span>{ratingCount} ({ratingPercent}%)</span></p>
                    <p>Total reviews: <span>{game.ratings_count}</span></p>
                    <br />
                    <p>Release date: <span>{game.released}</span></p>
                    <br />
                    <p>Developer: 
                        <Link to={`/developer/${game.developers[0].id}`}>
                            {game.developers[0].name}
                        </Link>
                    </p>
                    <p>Publisher: {publishersHTML}</p>
                </div>
            </div>
            <div className={styles.gameBody}>
                <div className={`${styles.buyGame}`}>
                        <h2>{userOwnsGame ? `Play ${game.name}` : `Buy ${game.name}`}</h2>
                        <p>{platforms}</p>
                        <div className={styles.purchase}>
                            {!userOwnsGame && (
                                <div className={styles.gameCost}>
                                    <p>${gameCost}</p>
                                </div>
                            )}
                            <button 
                                className={styles.buyGameBtn} 
                                onClick={userOwnsGame ? () => navigate('/library') : handleBuyClick}
                            >
                                {userOwnsGame ? 'Play' : 'Buy'}
                            </button>
                        </div>
                        {error && <div className={styles.error}>{error}</div>}
                </div>
                <div className={styles.recommended}>
                    <h2>{userOwnsGame ? `You own the game` : `Recommended game`}</h2>
                    <p>{userOwnsGame ? `Play the game and get a chance to recieve cards to your inventory.` : `From the look of it this seems to be a game you would like.`}</p>
                </div>
                <div className={styles.gameDesc}>
                    <h2>About this game</h2>
                    <div className={styles.gameDescH2Border}></div>
                    <p>{game.description_raw}</p>
                </div>
                <div className={styles.gameLinks}>
                    <p>Title: <span>{game.name}</span></p>
                    <p>Genre: <span>{genres}</span></p>
                    <p>Developer: 
                        <Link to={`/developer/${game.developers[0].id}`} target="_blank">
                            {game.developers[0].name}
                        </Link>
                    </p>
                    <p>Publisher: {publishersHTML}</p>
                    <p>Release date: <span>{game.released}</span></p>
                    <div className={styles.allLinks}>
                        <a className={styles.link} href={game.website} target="_blank" rel="noopener noreferrer">Go to website</a>
                        <a className={styles.link} href={`https://www.twitch.tv/directory/game/${game.name}`} target="_blank" rel="noopener noreferrer">Link to twitch</a>
                        <a className={styles.link} href={`https://www.youtube.com/results?search_query=${game.name}`} target="_blank" rel="noopener noreferrer">Search on Youtube</a>
                    </div>
                </div>
                <div className={styles.gameReq}>
                    <h2>System requirements: </h2>
                    <div className={styles.gameDescH2Border}></div>
                    <div className={styles.reqMin}>
                        <pre>{reqMin}</pre>
                    </div>
                    <div className={styles.reqRec}>
                        <pre>{reqRec}</pre>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GameInfo;
