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
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 650);
    const [isProcessing, setIsProcessing] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(20)

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
        setItemsPerPage(window.innerWidth >= 1920 ? 24 : 20);
        const handleResize = () => {
            setIsMobile(window.innerWidth <= 650);
        };
        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, []);

    useEffect(() => {
        // When selectedGame changes, reset the currentPage to 1
        setCurrentPage(1);
    }, [selectedGame]);

    if (loading) {
        return <div></div>;
    }

    const inventory = userData?.inventory || [];
    const gamesFromInventory = [...new Set(inventory.map(item => item.gameName))];

    const getPagedItems = () => {
        const itemsToDisplay = selectedGame
            ? inventory.find(item => item.gameName === selectedGame)?.cards || []
            : [];
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        return itemsToDisplay.slice(indexOfFirstItem, indexOfLastItem);
    };

    const handleSellItem = (card) => {
        setSelectedCard(card);
        setIsModalOpen(true);
    };

    const handleConfirmSell = async () => {
        if (price === '') {
            alert("Please enter a price.");
            return;
        }

        if (isProcessing) return;

        setIsProcessing(true);

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
                await fetchUserData();
            } else {
                alert("Failed to list item for sale: " + response.error);
            }
        } catch (error) {
            console.error("Error selling item:", error);
        } finally {
            setIsProcessing(false);
        }
    };

    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    const totalItems = selectedGame ? inventory.find(item => item.gameName === selectedGame)?.cards.length : 0;

    /*const totalPages = Math.ceil(totalItems / itemsPerPage);
    
    const maxVisiblePages = 4;
    let startPage = Math.max(1, currentPage - 1);
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    const visiblePages = [];
    for (let i = startPage; i <= endPage; i++) {
        visiblePages.push(i);
    }*/


    
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    //const visiblePages = Array.from({ length: totalPages }, (_, index) => index + 1);*/

    const pageWindow = 5; // Number of pages to show at a time
    const startPage = Math.max(1, currentPage - Math.floor(pageWindow / 2));
    const endPage = Math.min(totalPages, startPage + pageWindow - 1);

    // Adjust startPage if we're at the end to maintain the pageWindow length
    const adjustedStartPage = Math.max(1, endPage - pageWindow + 1);
    const visiblePages = Array.from({ length: endPage - adjustedStartPage + 1 }, (_, index) => adjustedStartPage + index);


    return (
        <div className={styles.inventoryContainer}>
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

            {/* User can set items per page */}
            <div className={styles.itemsPerPageControl}>
                <label htmlFor="itemsPerPage">Items per page: </label>
                <input
                    type="number"
                    id="itemsPerPage"
                    value={itemsPerPage}
                    onChange={(e) => {
                        const value = Math.max(Number(e.target.value), 10); // Ensures value is at least 10
                        setItemsPerPage(value);
                        setCurrentPage(1); // Reset to the first page
                    }}
                    onBlur={(e) => {
                        if (e.target.value === '' || Number(e.target.value) < 10) {
                            setItemsPerPage(10); // Set minimum value on blur
                        }
                    }}
                    min="10"
                    max="100"
                    className={styles.itemsPerPageInput}
                />
            </div>

            {selectedGame && getPagedItems().length > 0 ? (
                <div className={styles.inventoryGrid}>
                    <h1 className={styles.inventorySelectedGame}>{selectedGame}</h1>
                    <div className={getPagedItems().length > 5 ? styles.grid : styles.gridSmall}>
                    {getPagedItems().map((card, index) => (
                        <div
                            key={index}
                            className={`${styles.inventoryItem} ${selectedCard === card ? styles.selectedItem : ''}`}
                            onClick={() => setSelectedCard(card)}
                        >
                            <img src={`/images/inventory/${card.cardPic}`} alt={card.cardName} className={styles.itemImage} />
                        </div>
                    ))}
                    </div>
                </div>
            ) : (
                <div className={styles.inventoryGrid}>
                    <h2 className={styles.noGameSelectedH2}>{selectedGame || 'No Game Selected'}</h2>
                </div>
            )}

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

            {selectedCard && isMobile && (
                <div className={styles.modal}>
                    <div className={styles.itemDetails}>
                        <button className={styles.closeButton} onClick={() => { setSelectedCard(null); setIsModalOpen(false); }}>X</button>
                        <img src={`/images/inventory/${selectedCard.cardPic}`} alt={selectedCard.cardPic} className={styles.itemDetailImage} />
                        <div className={styles.itemName}>{selectedCard.cardName}</div>
                        <div className={styles.itemDescription}>{selectedCard.cardDesc}</div>        
                        
                        <button className={styles.sellButton} onClick={() => handleSellItem(selectedCard)}>
                            Sell Item
                        </button>
                    </div>
                </div>
            )}

            {totalPages > 1 && (
                <div className={styles.pagination}>
                    <button 
                        onClick={() => handlePageChange(currentPage - 1)}
                        className={styles.pageButton} 
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>

                    {visiblePages.map((page) => (
                        <button
                            key={page}
                            className={`${styles.pageButton} ${currentPage === page ? styles.active : ''}`}
                            onClick={() => handlePageChange(page)}
                        >
                            {page}
                        </button>
                    ))}

                    <button 
                        onClick={() => handlePageChange(currentPage + 1)}
                        className={styles.pageButton} 
                        disabled={currentPage === totalPages}
                    >
                        Next
                    </button>
                </div>
            )}

            {isModalOpen && selectedCard && (
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
                            disabled={isProcessing}
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
