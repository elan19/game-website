import React, { useState, useEffect, useContext  } from 'react';
import { useParams } from 'react-router-dom';
import possibleCards from './cards.js'; // Adjust path as needed
import styles from './Library.module.css';
import { UserContext } from '../../util/UserContext'; // Import UserContext

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
    const { fetchUserData } = useContext(UserContext);

    useEffect(() => {
        let timer;
        if (active) {
            const interval = 6 * 1000; // * 60 * 60 // 3 seconds for testing
            timer = setInterval(() => {
                rewardCard();
            }, interval);
        }

        return () => clearInterval(timer); // Cleanup the timer
    }, [active]);

    const rewardCard = async () => {
        let adjustedGameId = gameId;
    
        // Check if gameId exists in possibleCards, if not default to 'Gamipo'
        if (!possibleCards[gameId]) {
            adjustedGameId = 'Gamipo';
        }
    
        const cards = possibleCards[adjustedGameId];
    
        if (cards) {
            const randomCard = getRandomCardByRarity(cards);
            console.log(randomCard);
            setLastCard(randomCard.name);
            console.log(`You received: ${randomCard.name}`);
    
            try {
                const username = localStorage.getItem('username');
                const loginId = localStorage.getItem('loginId');
                // Pass adjustedGameId instead of gameId
                const test = await MongoDbModel.updateUserInventory(username, loginId, adjustedGameId, randomCard.name, randomCard.desc, randomCard.pic);
    
                // Fetch updated user data after updating inventory
                await fetchUserData();
            } catch (error) {
                console.error('Error updating inventory:', error);
            }
        }
    };
    
    

    // Function to select a random card based on rarity
    const totalSlots = 1000; // Total slots you want

    // Calculate the number of slots for each rarity based on the weights
    const calculateSlotsByRarity = () => {
        const slotsByRarity = {};
        for (const rarity in rarityWeights) {
            const weight = rarityWeights[rarity];
            const slots = Math.round((weight / 100) * totalSlots); // Calculate slots based on weight percentage
            slotsByRarity[rarity] = slots;
        }
        return slotsByRarity;
    };

    // Function to select a random card based on rarity
    const getRandomCardByRarity = (cards) => {
        const slotsByRarity = calculateSlotsByRarity();
        const pool = [];

        // Fill the pool based on the calculated slots
        for (const rarity in slotsByRarity) {
            const cardGroup = cards.filter(card => card.rarity === rarity);
            const slots = slotsByRarity[rarity];

            // Add cards to the pool based on the calculated number of slots
            for (let i = 0; i < slots; i++) {
                const randomCard = cardGroup[Math.floor(Math.random() * cardGroup.length)];
                pool.push(randomCard);
            }
        }
        console.log(pool);
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
