import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './SingleProduct.module.css';

const SingleProduct = ({ product }) => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate(`/game-info/${product.id}`);
    };

    // Preload the background image and first screenshot
    useEffect(() => {
        const preloadImage = (src) => {
            const img = new Image();
            img.src = src;
        };

        // Preload the background image
        if (product.background_image) {
            preloadImage(product.background_image);
        }

        // Preload the first screenshot if available
        if (product.short_screenshots.length > 0) {
            preloadImage(product.short_screenshots[0].image);
        }
    }, [product.background_image, product.short_screenshots]);

    // Render screenshots dynamically
    let screenshots;
    if (product.short_screenshots.length === 1) {
        screenshots = (
            <div className={styles.rightDivOneImg}>
                <img 
                    className={styles.smallScreenshot} 
                    src={product.short_screenshots[0].image} 
                    alt="small_screenshot 0" 
                    loading="lazy" // Lazy load the image
                />
            </div>
        );
    } else if (product.short_screenshots.length >= 2 && product.short_screenshots.length <= 5) {
        screenshots = (
            <div className={styles.rightDivTwoImgs}>
                {product.short_screenshots.slice(0, 2).map((screenshot, index) => (
                    <img 
                        key={index} 
                        className={styles.smallScreenshot} 
                        src={screenshot.image} 
                        alt={`small_screenshot ${index}`} 
                        loading="lazy" // Lazy load the image
                    />
                ))}
            </div>
        );
    } else if (product.short_screenshots.length > 5) {
        screenshots = (
            <div className={styles.rightDiv}>
                {product.short_screenshots.slice(1, 5).map((screenshot, index) => (
                    <img 
                        key={index} 
                        className={styles.smallScreenshot} 
                        src={screenshot.image} 
                        alt={`small_screenshot ${index}`} 
                        loading="lazy" // Lazy load the image
                    />
                ))}
            </div>
        );
    }

    return (
        <div className={styles.both} onClick={handleClick}>
            <div className={styles.rightTopDiv}>
                <p className={styles.gameName}>{product.name.replace(/"/g, "'")}</p>
            </div>
            <div className={styles.leftDiv}>
                <img 
                    className={styles.gamePic} 
                    src={product.background_image} 
                    alt={product.name.replace(/"/g, "'")} 
                    loading="eager" // Load the background image eagerly
                />
            </div>
            {screenshots}
        </div>
    );
};

export default SingleProduct;
