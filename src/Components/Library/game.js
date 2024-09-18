import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import styles from './Library.module.css';

const possibleCards = {
    CSGO: ['AWP - Dragon Lore', 'AK47 - Vulcan', 'Glock18 - Fade'],
    'Golf With Your Friends': ['Unicorn Horn', 'Cupcake Hat', 'Bouncy Ring'],
    // Add more games and their respective cards
};

const GameSession = () => {
    const { gameId } = useParams();
    const [active, setActive] = useState(false);
    const [lastCard, setLastCard] = useState(null);

    console.log(gameId);

    useEffect(() => {
        let timer;
        console.log(active);
        if (active) {
            const interval = 3 * 1000; //* 60 * 60 * 1000; // 3 hours in milliseconds
            timer = setInterval(() => {
                rewardCard();
            }, interval);
            console.log("inside");
            // Trigger the first card reward immediately
        }

        // Cleanup timer on component unmount
        return () => clearInterval(timer);
    }, [active]);

    const rewardCard = () => {
        console.log("Card recieved");
        const cards = possibleCards[gameId];
        console.log(cards);
        console.log(gameId);
        if (cards) {
            const randomCard = cards[Math.floor(Math.random() * cards.length)];
            setLastCard(randomCard);
            console.log(`You received: ${randomCard}`);
            // Here, you could also update the user's inventory in MongoDB
        }
    };

    const handleStartPlaying = () => {
        setActive(true);
        console.log(console.log(active));
    };

    return (
        <div className={styles.gameSessionContainer}>
            <h2>Playing {gameId}</h2>
            <button 
                className={styles.playButton} 
                onClick={handleStartPlaying}
                disabled={active}
            >
                {active ? 'Game is Active' : 'Start Playing'}
            </button>

            {lastCard && (
                <div className={styles.cardReward}>
                    <p>You received a card: {lastCard}</p>
                </div>
            )}

            <p>Keep playing to receive a new card every 3 hours!</p>
        </div>
    );
};

export default GameSession;
