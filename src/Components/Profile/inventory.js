import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../../util/UserContext';
import { Link } from 'react-router-dom';
import MongoDbModel from '../../models/mongodb';

import styles from './Inventory.module.css';
import defaultProfilePic from '../../images/login.jpg';

const InventoryView = () => {
    const { userData, fetchUserData } = useContext(UserContext);
    const [loading, setLoading] = useState(true);
    const [selectedGame, setSelectedGame] = useState(null);
    const [selectedCard, setSelectedCard] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [price, setPrice] = useState('');
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 450);
    const [isProcessing, setIsProcessing] = useState(false);

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
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 450);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    if (loading) {
        return <div></div>;
    }

    const inventory = userData?.inventory || [];

    // Get unique game names from the inventory
    const gamesFromInventory = [...new Set(inventory.map(item => item.gameName))];

    // Function to handle opening the modal and setting the price
    const handleSellItem = (card) => {
        setSelectedCard(card);
        console.log();
        setIsModalOpen(true);
    };

    // Function to call the MongoDB function to list the item on the market
    const handleConfirmSell = async () => {
        if (price === '') {
            alert("Please enter a price.");
            return;
        }
    
        if (isProcessing) {
            return; // Prevent duplicate clicks
        }
    
        setIsProcessing(true); // Disable the button

        try {
            const response = await MongoDbModel.setCardToMarket(
                userData.username,
                userData.loginId,
                selectedGame,
                selectedCard.cardName,
                parseFloat(price)
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
        } finally {
            setIsProcessing(false); // Re-enable the button
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
                    <div className={styles.noGames}>
                        <p>No games or items found.</p>
                    </div>
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
                <div className={styles.inventoryGrid}>
                    <h2 className={styles.noGameSelectedH2}>{selectedGame || 'No Game Selected'}</h2>
                </div>
            )}

            {/* Item details */}
            {selectedCard && !isMobile && (
                <div className={styles.itemDetails}>
                    <img src={`/images/inventory/${selectedCard.cardPic}`} alt={selectedCard.cardPic} className={styles.itemDetailImage} />
                    <div className={styles.itemName}>{selectedCard.cardName}</div>
                    <div className={styles.itemDescription}>{selectedCard.cardDesc}</div>        
                    
                    <button className={styles.sellButton} onClick={() => handleSellItem(selectedCard)}>
                        Sell Item
                    </button>
                </div>
            )}

            {/* Modal for the selected item - Only show on mobile */}
            {selectedCard && isMobile && (
                <div className={styles.modal}>
                    <button className={styles.closeButton} onClick={() => setSelectedCard(null) && setIsModalOpen(null)}>X</button>
                    <div className={styles.itemDetails}>
                        <img src={`/images/inventory/${selectedCard.cardPic}`} alt={selectedCard.cardPic} className={styles.itemDetailImage} />
                        <div className={styles.itemName}>{selectedCard.cardName}</div>
                        <div className={styles.itemDescription}>{selectedCard.cardDesc}</div>        
                        
                        <button className={styles.sellButton} onClick={() => handleSellItem(selectedCard)}>
                            Sell Item
                        </button>
                    </div>
                </div>
            )}

            {/* Modal for selling an item */}
            {isModalOpen && selectedCard &&(
                <div className={styles.sellModal}>
                    <div className={styles.modalContent}>
                        <button className={styles.closeButtonSellItem} onClick={() => setIsModalOpen(false)}>X</button>
                        <h2 className={styles.sellCardH2}>Sell price '{selectedCard.cardName}'</h2>
                        <input 
                            type="number" 
                            value={price} 
                            onChange={(e) => setPrice(e.target.value)} 
                            placeholder="Enter price"
                            className={styles.priceInput}
                        />
                        <button
                            className={styles.confirmButton}
                            onClick={handleConfirmSell}
                            disabled={isProcessing} // Disable the button while processing
                        >
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
