import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';

import styles from './PublisherInfo.module.css';
import SingleProduct from '../Products/single-product';
import { AuthContext } from '../../util/AuthContext';

const PublisherInfo = () => {
    const { id } = useParams();
    const [publisher, setPublisher] = useState({});
    const [products, setProducts] = useState([]);
    const [next, setNext] = useState(null);
    const [prev, setPrev] = useState(null);
    const { isAuthenticated } = useContext(AuthContext);

    const apiKey = process.env.REACT_APP_API_KEY;
    const baseURL = process.env.REACT_APP_BASE_URL;

    console.log(isAuthenticated);

    useEffect(() => {
        const fetchData = async () => {
            const publisherId = id;
            let url = `${baseURL}/games?publishers=${publisherId}&key=${apiKey}`;
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
                const publisherResponse = await fetch(`${baseURL}/publishers/${publisherId}?key=${apiKey}`);
                const publisherResult = await publisherResponse.json();
                setPublisher(publisherResult);
            } catch (error) {
                console.error('Error fetching publisher info:', error);
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
            <a className={styles.backToRec} href="/">
                Back to recommended games
            </a>
            <h2 className={styles.mapHeading}>{publisher.name}</h2>
            <div className={styles.publisherDesc}>
                <div dangerouslySetInnerHTML={{ __html: publisher.description }} />
            </div>
            {products.map(product => (
                <SingleProduct key={product.id} product={product}></SingleProduct>
            ))}
            <button className={styles.prevPage} onClick={handlePrevClick}>Previous</button>
            <button className={styles.nextPage} onClick={handleNextClick}>Next</button>
        </div>
    );
};

export default PublisherInfo;
