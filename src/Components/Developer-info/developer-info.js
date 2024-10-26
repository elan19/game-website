import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import SingleProduct from '../Products/single-product';
import styles from './DeveloperInfo.module.css';

const DeveloperInfo = () => {
    const { id } = useParams();
    const [developer, setDeveloper] = useState({});
    const [products, setProducts] = useState([]);
    const [next, setNext] = useState(null);
    const [prev, setPrev] = useState(null);

    const apiKey = process.env.REACT_APP_API_KEY;
    const baseURL = process.env.REACT_APP_BASE_URL;

    useEffect(() => {
        const fetchData = async () => {
            const developerId = id;
            let url = `${baseURL}/games?developers=${developerId}&key=${apiKey}`;
            try {
                const response = await fetch(url);
                const result = await response.json();
                setProducts(result.results);
                setNext(result.next);
                setPrev(result.previous);
            } catch (error) {
                console.error('Error fetching games:', error);
            }

            try {
                const developerResponse = await fetch(`${baseURL}/developers/${developerId}?key=${apiKey}`);
                const developerResult = await developerResponse.json();
                setDeveloper(developerResult);
            } catch (error) {
                console.error('Error fetching developer info:', error);
            }
        };
        fetchData();
    }, [id, apiKey, baseURL]);

    const handlePrevClick = async () => {
        if (prev !== null) {
            try {
                const response = await fetch(prev);
                const result = await response.json();
                setProducts(result.results);
                setNext(result.next);
                setPrev(result.previous);
            } catch (error) {
                console.error('Error fetching previous page:', error);
            }
        }
    };

    const handleNextClick = async () => {
        if (next !== null) {
            try {
                const response = await fetch(next);
                const result = await response.json();
                setProducts(result.results);
                setNext(result.next);
                setPrev(result.previous);
            } catch (error) {
                console.error('Error fetching next page:', error);
            }
        }
    };

    return (
        <div>
            <h2 className={styles.mapHeading}>{developer.name}</h2>
            {products.map(product => (
                <SingleProduct key={product.id} product={product}></SingleProduct>
            ))}
            <button className={styles.prevPage} onClick={handlePrevClick}>Previous</button>
            <button className={styles.nextPage} onClick={handleNextClick}>Next</button>
        </div>
    );
};

export default DeveloperInfo;
