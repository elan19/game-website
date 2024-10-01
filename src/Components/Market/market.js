import React, { useEffect, useState, useContext } from 'react';
import MongoDbModel from '../../models/mongodb';
import { UserContext } from '../../util/UserContext'; // Import UserContext

import styles from './Market.module.css';
import defaultItemPic from '../../images/gamipo-logo.png';

const MarketView = () => {
    const [marketItems, setMarketItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 5; // Show 25 items per page
    const { fetchUserData } = useContext(UserContext);

    useEffect(() => {
        const fetchMarketItems = async () => {
            setLoading(true);
            try {
                const marketItems = await MongoDbModel.getAllMarketItems();
                setMarketItems(marketItems);
            } catch (error) {
                console.error('Error fetching market items:', error);
            }
            setLoading(false);
        };

        fetchMarketItems();
    }, []);

    const handleBuy = async (marketItemId, price) => {
        const confirmed = window.confirm(`Are you sure you want to buy this item for ${price} coins?`);
        if (confirmed) {
            try {
                const buyerUsername = localStorage.getItem('username');
                const buyerLoginId = localStorage.getItem('loginId');
                const result = await MongoDbModel.buyMarketItem(buyerUsername, buyerLoginId, marketItemId);

                if (result.success) {
                    alert('Item purchased successfully');
                    setMarketItems(marketItems.filter(item => item._id !== marketItemId)); // Remove the purchased item from the UI
                    await fetchUserData();
                } else {
                    alert(result.error || 'Failed to purchase the item.');
                }
            } catch (error) {
                console.error('Failed to buy item:', error);
            }
        }
    };

    // Pagination logic (same as before)
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = marketItems.slice(indexOfFirstItem, indexOfLastItem);

    const totalPages = Math.ceil(marketItems.length / itemsPerPage);

    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const maxVisiblePages = 4;
    let startPage = Math.max(1, currentPage - 1);
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    const visiblePages = [];
    for (let i = startPage; i <= endPage; i++) {
        visiblePages.push(i);
    }

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <div className={styles.marketContainer}>
            <h1>Market</h1>
            <div className={styles.marketGrid}>
                {currentItems.length > 0 ? (
                    currentItems.map((item, index) => (
                        <div key={index} className={styles.marketItem}>
                            <img src={`/images/inventory/${item.cardPic}` || defaultItemPic} alt={item.cardPic} className={styles.itemImage} />
                            <div className={styles.itemName}>{item.cardName}</div>
                            <div className={styles.itemPrice}>Price: {item.price} coins</div>
                            <div className={styles.sellerName}>Seller: {item.username}</div>
                            <button 
                                className={styles.buyButton}
                                onClick={() => handleBuy(item._id, item.price)}
                            >
                                Buy
                            </button>
                        </div>
                    ))
                ) : (
                    <div>No items found on the market.</div>
                )}
            </div>

            {/* Pagination controls */}
            <div className={styles.pagination}>
                <button
                    onClick={handlePreviousPage}
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
                    onClick={handleNextPage}
                    className={styles.pageButton}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default MarketView;
