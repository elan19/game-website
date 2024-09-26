import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../../util/UserContext';
import { Link } from 'react-router-dom';
import MongoDbModel from '../../models/mongodb';

import styles from './Inventory.module.css';
import defaultProfilePic from '../../images/login.jpg';

const InventoryView = () => {
    const { userData, fetchUserData } = useContext(UserContext);
    const [loading, setLoading] = useState(true);
    const [selectedGameIndex, setSelectedGameIndex] = useState(0); // Track selected game by index
    const [selectedItem, setSelectedItem] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false); // Track modal visibility
    const [price, setPrice] = useState(''); // Track the price entered by the user

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            await fetchUserData();
            setLoading(false);
        };

        // Only fetch data if userData is not already loaded
        if (!userData) {
            loadData();
        } else {
            setLoading(false);
        }
    }, [userData, fetchUserData]);

    if (loading) {
        return <div>Loading...</div>;
    }

    const games = userData?.games || [];
    const inventory = userData?.inventory || [];

    // Function to handle opening the modal and setting the price
    const handleSellItem = (item) => {
        setSelectedItem(item);
        setIsModalOpen(true);
    };

    // Function to call the MongoDB function to list the item on the market
    const handleConfirmSell = async () => {
        if (price === '') {
            alert("Please enter a price.");
            return;
        }

        try {
            // Call MongoDB Realm function instead of Express API
            const response = await MongoDbModel.setCardToMarket(
                userData.username,
                localStorage.getItem('loginId'),
                selectedGameIndex,
                selectedItem[0],  // Card name
                parseFloat(price) // Price input by the user
            );

            if (response.success) {
                alert("Item listed for sale successfully.");
                setIsModalOpen(false);
                setPrice('');
                setSelectedItem(null);
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
                {games.length > 0 ? (
                    games.map((game, index) => (
                        <button
                            key={index}
                            onClick={() => setSelectedGameIndex(index)}
                            className={`${styles.gameTab} ${selectedGameIndex === index ? styles.activeTab : ''}`}
                        >
                            {game} ({inventory[index] ? inventory[index].length : 0})
                        </button>
                    ))
                ) : (
                    <div>No games found.</div>
                )}
            </div>

            {/* Inventory grid */}
            {games.length > 0 && inventory[selectedGameIndex]?.length > 0 ? (
                <div className={styles.inventoryGrid}>
                    <h1 className={styles.inventorySelectedGame}>{games[selectedGameIndex]}</h1>
                    {inventory[selectedGameIndex].map((item, index) => (
                        <div
                            key={index}
                            className={`${styles.inventoryItem} ${selectedItem === item ? styles.selectedItem : ''}`}
                            onClick={() => setSelectedItem(item)}
                        >
                            <img src={`/images/inventory/${item[2]}`} alt={item[0]} className={styles.itemImage} />
                        </div>
                    ))}
                </div>
            ) : (
                <div>
                    <h2>{games[selectedGameIndex] || 'No Game Selected'}</h2>
                    <p>No items found for {games[selectedGameIndex] || 'this game'}.</p>
                </div>
            )}

            {/* Item details */}
            {selectedItem && (
                <div className={styles.itemDetails}>
                    <img src={`/images/inventory/${selectedItem[2]}`} alt={selectedItem[2]} className={styles.itemDetailImage} />
                    <div className={styles.itemName}>{selectedItem[0]}</div>
                    <div className={styles.itemDescription}>{selectedItem[1]}</div>        
                    
                    <button className={styles.sellButton} onClick={() => handleSellItem(selectedItem)}>
                        Sell Item
                    </button>
                </div>
            )}

            {/* Modal for selling an item */}
            {isModalOpen && (
                <div className={styles.modal}>
                    <div className={styles.modalContent}>
                        <h2>Set Price for {selectedItem[0]}</h2>
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
