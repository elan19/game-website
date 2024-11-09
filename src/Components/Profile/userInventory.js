import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../../util/UserContext';
import MongoDbModel from '../../models/mongodb';
import { Link, useParams } from 'react-router-dom';
import styles from './Inventory.module.css';
import defaultProfilePic from '../../images/login.jpg';

const OtherUserInventoryView = () => {
    const { fetchOtherUserData } = useContext(UserContext);
    const { username } = useParams();
    const [loading, setLoading] = useState(true);
    const [otherUserData, setOtherUserData] = useState(null);
    const [selectedGame, setSelectedGame] = useState(null);
    const [selectedItem, setSelectedItem] = useState(null);
    const [error, setError] = useState(null);
    const [isMobile, setIsMobile] = useState(window.innerWidth <= 650);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(20);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const fetchedUser = await MongoDbModel.getUserProfile(username);
                setOtherUserData(fetchedUser);
                setLoading(false);
            } catch (err) {
                console.error('Failed to fetch user data:', err);
                setError('Failed to load user profile.');
                setLoading(false);
            }
        };

        fetchUser();
    }, [username, fetchOtherUserData]);

    useEffect(() => {
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

    const getPagedItems = () => {
        const itemsToDisplay = selectedGame
            ? inventory.find(item => item.gameName === selectedGame)?.cards || []
            : [];
        const indexOfLastItem = currentPage * itemsPerPage;
        const indexOfFirstItem = indexOfLastItem - itemsPerPage;
        return itemsToDisplay.slice(indexOfFirstItem, indexOfLastItem);
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    const inventory = otherUserData?.inventory || [];
    const gamesFromInventory = [...new Set(inventory.map(item => item.gameName))];

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const totalItems = selectedGame ? inventory.find(item => item.gameName === selectedGame)?.cards.length : 0;
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    /*const visiblePages = Array.from({ length: totalPages }, (_, index) => index + 1);*/

    const pageWindow = 5; // Number of pages to show at a time
    const startPage = Math.max(1, currentPage - Math.floor(pageWindow / 2));
    const endPage = Math.min(totalPages, startPage + pageWindow - 1);

    // Adjust startPage if we're at the end to maintain the pageWindow length
    const adjustedStartPage = Math.max(1, endPage - pageWindow + 1);
    const visiblePages = Array.from({ length: endPage - adjustedStartPage + 1 }, (_, index) => adjustedStartPage + index);

    return (
        <div className={styles.inventoryContainer}>
            {/* User profile header */}
            <div className={styles.profileHeader}>
                <img 
                    src={otherUserData.profilePic ? `/images/profile/${otherUserData.profilePic}` : defaultProfilePic} 
                    alt="Profile" 
                    className={styles.profilePic} 
                />
                
                <div className={styles.username}>
                    <Link to={`/profile/${otherUserData?.username}`} className={styles.editProfileLink}>
                        {otherUserData?.username || 'Unknown User'}
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

            {/* Inventory grid */}
            {selectedGame && getPagedItems().length > 0 ? (
                <div className={styles.inventoryGrid}>
                    <h1 className={styles.inventorySelectedGame}>{selectedGame}</h1>
                    <div className={getPagedItems().length > 5 ? styles.grid : styles.gridSmall}>
                    {getPagedItems().map((card, index) => (
                        <div
                            key={index}
                            className={styles.inventoryItem}
                            onClick={() => setSelectedItem(card)}
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

            {/* Modal for the selected item - Only show on mobile */}
            {selectedItem && isMobile && (
                <div className={styles.modal}>
                    <button className={styles.closeButton} onClick={() => setSelectedItem(null)}>X</button>
                    <div className={styles.itemDetails}>
                        <img src={`/images/inventory/${selectedItem.cardPic}`} alt={selectedItem.cardPic} className={styles.itemDetailImage} />
                        <div className={styles.itemName}>{selectedItem.cardName}</div>
                        <div className={styles.itemDescription}>{selectedItem.cardDesc}</div>
                    </div>
                </div>
            )}

            {/* Item details for desktop view */}
            {selectedItem && !isMobile && (
                <div className={styles.itemDetails}>
                    <img src={`/images/inventory/${selectedItem.cardPic}`} alt={selectedItem.cardPic} className={styles.itemDetailImage} />
                    <div className={styles.itemName}>{selectedItem.cardName}</div>
                    <div className={styles.itemDescription}>{selectedItem.cardDesc}</div>
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
        </div>
    );
};

export default OtherUserInventoryView;
