import React, { useState, useContext, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { UserContext } from '../../util/UserContext'; // Import UserContext

import MongoDbModel from '../../models/mongodb';

import styles from "./GameInfo.module.css";

const GameInfo = () => {
    const { gameId } = useParams();
    const [game, setGame] = useState(null);
    const [loading, setLoading] = useState(true);
    const { userData, fetchUserData } = useContext(UserContext); // Use UserContext

    const apiKey = process.env.REACT_APP_API_KEY;
    const baseURL = process.env.REACT_APP_BASE_URL;

    useEffect(() => {
        const fetchGameInfo = async () => {
            try {
                const response = await fetch(`${baseURL}/games/${gameId}?key=${apiKey}`);
                const result = await response.json();
                console.log(result);
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
        // Add your logic for the "buy-game" button action here
        if (userOwnsGame) return; // Prevent action if user already owns the game
        //alert("You need to login first.");
        try {
            await MongoDbModel.updateUser(userData.username, -gameCost, game.name);
            console.log("success");
            fetchUserData(); // Refresh user data
        } catch (error) {
            console.error('Failed to update user data:', error);
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
                    <p>Genomsnittlig recension: <span>{game.rating} av 5</span></p>
                    <p>Topp recensioner: <span>{ratingCount} ({ratingPercent}%)</span></p>
                    <p>Antal recensioner: <span>{game.ratings_count}</span></p>
                    <br />
                    <p>Utgivningsdatum: <span>{game.released}</span></p>
                    <br />
                    <p>Utvecklare: 
                        <Link to={`/developer/${game.developers[0].id}`}>
                            {game.developers[0].name}
                        </Link>
                    </p>
                    <p>Utgivare: {publishersHTML}</p>
                </div>
            </div>
            <div className={styles.gameBody}>
                <div className={`${styles.buyGame} ${userOwnsGame ? styles.hide : ''}`}>
                    <h2>Köp {game.name}</h2>
                    <p>{platforms}</p>
                    <div className={styles.purchase}>
                        <div className={styles.gameCost}>
                            <p>${gameCost}</p>
                        </div>
                        <button className={styles.buyGameBtn} 
                        onClick={handleBuyClick} 
                        disabled={userOwnsGame}>
                            Köp
                        </button>
                    </div>
                </div>
                <div className={styles.recommended}>
                    <h2>Rekommenderat spel</h2>
                    <p>Från dina tidigare spel ser detta ut att vara ett spel du skulle tycka om.</p>
                </div>
                <div className={styles.gameDesc}>
                    <h2>Om detta spel</h2>
                    <div className={styles.gameDescH2Border}></div>
                    <p>{game.description_raw}</p>
                </div>
                <div className={styles.gameLinks}>
                    <p>Titel: <span>{game.name}</span></p>
                    <p>Genre: <span>{genres}</span></p>
                    <p>Utvecklare: 
                        <Link to={`/developer/${game.developers[0].id}`} target="_blank">
                            {game.developers[0].name}
                        </Link>
                    </p>
                    <p>Utgivare: {publishersHTML}</p>
                    <p>Utgivningsdatum: <span>{game.released}</span></p>
                    <div className={styles.allLinks}>
                        <a className={styles.link} href={game.website} target="_blank" rel="noopener noreferrer">Gå till webbplatsen</a>
                        <a className={styles.link} href={`https://www.twitch.tv/directory/game/${game.name}`} target="_blank" rel="noopener noreferrer">Länk till twitch</a>
                        <a className={styles.link} href={`https://www.youtube.com/results?search_query=${game.name}`} target="_blank" rel="noopener noreferrer">Sök på Youtube</a>
                    </div>
                </div>
                <div className={styles.gameReq}>
                    <h2>Systemkrav: </h2>
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
