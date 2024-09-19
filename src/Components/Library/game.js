import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import possibleCards from './cards.js'; // Adjust path as needed
import styles from './Library.module.css';

import MongoDbModel from '../../models/mongodb';

// Define rarities and their probabilities
const rarityWeights = {
    common: 79.92, // 79.92% chance
    uncommon: 15.98,  // 15.98% chance
    rare: 3.2, // 3.2% chance
    epic: 0.64,  // 0.64% chance
    legendary: 0.26 // 0.26% chance
};

const GameSession = () => {
    const { gameId } = useParams();
    const [active, setActive] = useState(false);
    const [lastCard, setLastCard] = useState(null);

    useEffect(() => {
        let timer;
        if (active) {
            const interval = 3 * 1000; // * 60 * 60 // 3 seconds for testing
            timer = setInterval(() => {
                rewardCard();
            }, interval);
        }

        return () => clearInterval(timer); // Cleanup the timer
    }, [active]);

    const rewardCard = async () => {
        const cards = possibleCards[gameId];
        if (cards) {
            const randomCard = getRandomCardByRarity(cards);
            setLastCard(randomCard.name);
            console.log(`You received: ${randomCard.name}`);
            console.log(`desc: ${randomCard.desc}`);
            console.log(gameId);
    
            // Update the user's inventory in MongoDB
            try {
                const username = localStorage.getItem('username'); // Fetch from local storage or AuthContext
                const loginId = localStorage.getItem('loginId'); // Fetch loginId
                await MongoDbModel.updateUserInventory(username, loginId, gameId, randomCard.name, randomCard.desc);

            } catch (error) {
                console.error('Error updating inventory:', error);
            }
        }
    };
    

    // Function to select a random card based on rarity
    const getRandomCardByRarity = (cards) => {
        // Create a pool based on the card's rarity weights
        const pool = [];

        cards.forEach(card => {
            for (let i = 0; i < rarityWeights[card.rarity]; i++) {
                pool.push(card);
            }
        });

        // Select a random card from the pool
        const randomIndex = Math.floor(Math.random() * pool.length);
        return pool[randomIndex];
    };

    const handleStartPlaying = () => {
        setActive(true);
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
