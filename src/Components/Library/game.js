import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import possibleCards from './cards.js';
import styles from './GameSession.module.css';
import { UserContext } from '../../util/UserContext.js';
import MongoDbModel from '../../models/mongodb.js';

/*const rarityWeights = {
    common: 79.92,
    uncommon: 15.98,
    rare: 3.2,
    epic: 0.64,
    legendary: 0.26
};*/

const GameSession = () => {
    const { gameId } = useParams();
    const [active, setActive] = useState(false);
    const [lastCard, setLastCard] = useState(null);
    const [progress, setProgress] = useState(0);
    const { userData, fetchUserData } = useContext(UserContext);
    const [loadingUserData, setLoadingUserData] = useState(true);
    const navigate = useNavigate();

    const totalInterval = 15 * 1000; // 6 seconds for testing (replace with 3 hours)

    useEffect(() => {
        let timerId;

        if (active) {
            timerId = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 100) {
                        rewardCard();
                        return 0; // Reset progress when it reaches 100%
                    }
                    return prev + 1; // Increment progress
                });
            }, totalInterval / 100); // Increment based on the total interval divided by 100 steps
        }

        return () => clearInterval(timerId); // Cleanup
    }, [active]);

    useEffect(() => {
        const updateUserData = async () => {
            try {
                setLoadingUserData(true); 
                await fetchUserData(); 
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setLoadingUserData(false); 
            }
        };
    
        if (!userData?.email && !loadingUserData) {
            updateUserData();
        }
    }, [userData, fetchUserData, loadingUserData]);

    /*const rewardCard = async () => {
        let adjustedGameId = gameId;

        if (!possibleCards[gameId]) {
            adjustedGameId = 'Gamipo';
        }

        const cards = possibleCards[adjustedGameId];

        if (cards) {
            const randomCard = getRandomCardByRarity(cards);
            setLastCard(randomCard.name);

            try {
                await MongoDbModel.updateUserInventory(userData.username, userData.loginId, adjustedGameId, randomCard.name, randomCard.desc, randomCard.pic);

                await fetchUserData();
            } catch (error) {
                console.error('Error updating inventory:', error);
            }
        }
    };*/

    const rewardCard = async () => {
        let adjustedGameId = gameId;

        if (!possibleCards[gameId]) {
            adjustedGameId = 'Gamipo';
        }

        try {
            const response = await MongoDbModel.rewardCard(userData.username, userData.loginId, adjustedGameId);
            
            if (response.success) {
                setLastCard(response.card.name);
                await fetchUserData(); // Update the user's inventory on the frontend
            } else {
                console.error('Error rewarding card:', response.error);
            }
        } catch (error) {
            console.error('Error rewarding card:', error);
        }
    };

    /*const totalSlots = 1000;

    const calculateSlotsByRarity = () => {
        const slotsByRarity = {};
        for (const rarity in rarityWeights) {
            const weight = rarityWeights[rarity];
            const slots = Math.round((weight / 100) * totalSlots);
            slotsByRarity[rarity] = slots;
        }
        return slotsByRarity;
    };

    const getRandomCardByRarity = (cards) => {
        const slotsByRarity = calculateSlotsByRarity();
        const pool = [];

        for (const rarity in slotsByRarity) {
            const cardGroup = cards.filter(card => card.rarity === rarity);
            const slots = slotsByRarity[rarity];

            for (let i = 0; i < slots; i++) {
                const randomCard = cardGroup[Math.floor(Math.random() * cardGroup.length)];
                pool.push(randomCard);
            }
        }

        const randomIndex = Math.floor(Math.random() * pool.length);
        return pool[randomIndex];
    };*/

    const handleStartPlaying = () => {
        setActive(true);
    };

    // Handle navigating back to the library
    const handleBackToLibrary = () => {
        navigate('/library');
    };

    // Generate inline style for circular progress
    const circleStyle = {
        background: `conic-gradient(#4caf50 ${progress * 3.6}deg, #ddd 0deg)`
    };

    return (
        <div className={styles.gameSessionContainer}>
            <h2>Playing {gameId}</h2>

            <div className={styles.progressCircleContainer}>
                <div className={styles.progressCircle} style={circleStyle}>
                    <div className={styles.circleFill}>
                        {lastCard && <p className={styles.cardReward}>{lastCard}</p>}
                    </div>
                </div>
            </div>

            <button 
                className={styles.playButton} 
                onClick={handleStartPlaying}
                disabled={active}
            >
                {active ? 'Game is Active' : 'Start Playing'}
            </button>

            <button 
                className={styles.backButton} 
                onClick={handleBackToLibrary}
            >
                Back to Library
            </button>

            <p>Keep playing to receive a new card every 3 hours!</p>
        </div>
    );
};

export default GameSession;