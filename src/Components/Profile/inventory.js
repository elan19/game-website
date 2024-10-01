import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../../util/UserContext';
import { Link } from 'react-router-dom';
import MongoDbModel from '../../models/mongodb';

import styles from './Inventory.module.css';
import defaultProfilePic from '../../images/login.jpg';

const InventoryView = () => {
    const { userData, fetchUserData } = useContext(UserContext);
    const [loading, setLoading] = useState(true);
    const [selectedGame, setSelectedGame] = useState(null); // Track selected game by name
    const [selectedCard, setSelectedCard] = useState(null); // Track selected card
    const [isModalOpen, setIsModalOpen] = useState(false); // Track modal visibility
    const [price, setPrice] = useState(''); // Track the price entered by the user

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

    if (loading) {
        return <div>Loading...</div>;
    }

    const inventory = userData?.inventory || [];

    // Get unique game names from the inventory
    const gamesFromInventory = [...new Set(inventory.map(item => item.gameName))];

    // Function to handle opening the modal and setting the price
    const handleSellItem = (card) => {
        setSelectedCard(card);
        setIsModalOpen(true);
    };

    // Function to call the MongoDB function to list the item on the market
    const handleConfirmSell = async () => {
        if (price === '') {
            alert("Please enter a price.");
            return;
        }

        try {
            const response = await MongoDbModel.setCardToMarket(
                userData.username,
                localStorage.getItem('loginId'),
                selectedGame,  // Selected game name
                selectedCard.cardName,  // Card name
                parseFloat(price) // Price input by the user
            );

            if (response.success) {
                alert("Item listed for sale successfully.");
                setIsModalOpen(false);
                setPrice('');
                setSelectedCard(null);
                await fetchUserData(); // Fetch updated user data after selling
            } else {
                alert("Failed to list item for sale: " + response.error);
            }
        } catch (error) {
            console.error("Error selling item:", error);
        }
    };

    return (
        <div className={styles.inventoryContainer}>
            {/* User profile header */}
            <div className={styles.profileHeader}>
                <img 
                    src={userData.profilePic ? `/images/profile/${userData.profilePic}` : defaultProfilePic} 
                    alt="Profile" 
                    className={styles.profilePic} 
                />
                <div className={styles.username}>
                    <Link to={`/profile/${userData?.username}`} className={styles.editProfileLink}>
                        {userData?.username || 'User'}
                    </Link>
                </div>
            </div>

            {/* Game tabs */}
            <div className={styles.gameTabs}>
                {gamesFromInventory.length > 0 ? (
                    gamesFromInventory.map((game, index) => (
                        <button
                            key={index}
                            onClick={() => setSelectedGame(game)}
                            className={`${styles.gameTab} ${selectedGame === game ? styles.activeTab : ''}`}
                        >
                            {game}
                        </button>
                    ))
                ) : (
                    <div>No games found in inventory.</div>
                )}
            </div>

            {/* Inventory grid */}
            {selectedGame && inventory.find(item => item.gameName === selectedGame)?.cards.length > 0 ? (
                <div className={styles.inventoryGrid}>
                    <h1 className={styles.inventorySelectedGame}>{selectedGame}</h1>
                    {inventory.find(item => item.gameName === selectedGame).cards.map((card, index) => (
                        <div
                            key={index}
                            className={`${styles.inventoryItem} ${selectedCard === card ? styles.selectedItem : ''}`}
                            onClick={() => setSelectedCard(card)}
                        >
                            <img src={`/images/inventory/${card.cardPic}`} alt={card.cardName} className={styles.itemImage} />
                        </div>
                    ))}
                </div>
            ) : (
                <div>
                    <h2>{selectedGame || 'No Game Selected'}</h2>
                </div>
            )}

            {/* Item details */}
            {selectedCard && (
                <div className={styles.itemDetails}>
                    <img src={`/images/inventory/${selectedCard.cardPic}`} alt={selectedCard.cardPic} className={styles.itemDetailImage} />
                    <div className={styles.itemName}>{selectedCard.cardName}</div>
                    <div className={styles.itemDescription}>{selectedCard.cardDesc}</div>        
                    
                    <button className={styles.sellButton} onClick={() => handleSellItem(selectedCard)}>
                        Sell Item
                    </button>
                </div>
            )}

            {/* Modal for selling an item */}
            {isModalOpen && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <h2>Set Price for {selectedCard.cardName}</h2>
                        <input 
                            type="number" 
                            value={price} 
                            onChange={(e) => setPrice(e.target.value)} 
                            placeholder="Enter price"
                            className={styles.priceInput}
                        />
                        <button className={styles.confirmButton} onClick={handleConfirmSell}>
                            Confirm
                        </button>
                        <button className={styles.cancelButton} onClick={() => setIsModalOpen(false)}>
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default InventoryView;
