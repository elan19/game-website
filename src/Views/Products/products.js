import React, { useState, useEffect } from 'react';
import styles from './Products.module.css';
import ProductList from '../../Components/Products/product-list';
import bannerImage from './banner.jpg';

const ProductsView = () => {
    const [isImageLoaded, setIsImageLoaded] = useState(false);
    const [hasImageError, setHasImageError] = useState(false);

    useEffect(() => {
        // Set a timeout to show the loading message if the image doesn't load within a certain time
        const timeout = setTimeout(() => {
            if (!isImageLoaded) {
                setHasImageError(true);
            }
        }, 5000); // Timeout after 5 seconds

        return () => clearTimeout(timeout); // Cleanup timeout on unmount
    }, [isImageLoaded]);

    return (
        <div>
            <header className={styles.header}>
                {/* Display a loading message until the image is loaded */}
                {!isImageLoaded && !hasImageError && <div className={styles.loadingMessage}></div>}
                {hasImageError && <div className={styles.errorMessage}>Failed to load banner. Please refresh your cache.</div>}
                
                <img 
                    src={bannerImage} 
                    alt="Banner" 
                    className={styles.bannerImage} 
                    onLoad={() => setIsImageLoaded(true)}
                    onError={() => setIsImageLoaded(false)} // Fallback if the image fails to load
                />
                {isImageLoaded && !hasImageError && <div className={styles.overlayText}>The <span>future</span> of gaming is here</div>}
            </header>
            <main className={styles.main}>
                <ProductList />
            </main>
        </div>
    );
};

export default ProductsView;
