import React, { useEffect, useState } from 'react';
import MongoDbModel from '../../models/mongodb';

import styles from './Market.module.css';
import defaultItemPic from '../../images/gamipo-logo.png';

const MarketView = () => {
    const [marketItems, setMarketItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 1; // Show 25 items per page

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

    // Calculate the items for the current page
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = marketItems.slice(indexOfFirstItem, indexOfLastItem);

    // Calculate total pages
    const totalPages = Math.ceil(marketItems.length / itemsPerPage);

    // Handle changing to a specific page
    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    // Handle next and previous page
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

    // Calculate the range of visible pages (show max 4 pages)
    const maxVisiblePages = 4;
    let startPage = Math.max(1, currentPage - 1);
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    // Ensure startPage stays within range when close to the end
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
                            <button className={styles.buyButton}>Buy</button>
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
