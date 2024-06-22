import React, { useEffect, useState } from 'react';

import styles from '../../Views/Products/Products.module.css';

import SingleProduct from './single-product';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [next, setNext] = useState(null);
  const [prev, setPrev] = useState(null);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');

  const apiKey = process.env.REACT_APP_API_KEY;
  const baseURL = process.env.REACT_APP_BASE_URL;

  const fetchData = async (page, query = '') => {
    const url = query
      ? `${baseURL}/games?key=${apiKey}&search=${query}&page=${page}`
      : `${baseURL}/games?key=${apiKey}&page=${page}`;
    
    const response = await fetch(url);
    const result = await response.json();
    console.log(result);

    setProducts(result.results);
    setNext(result.next);
    setPrev(result.previous);
  };

  useEffect(() => {
    fetchData(page, searchQuery);
  }, [page, searchQuery]);

  const handleSearch = (event) => {
    event.preventDefault();
    const searchInput = document.querySelector('input[type="text"]').value;
    setSearchQuery(searchInput);
    console.log(searchInput);
  };

  const handlePrevPage = () => {
    if (prev) {
      const regex = /page=(\d+)/;
      const matchTest = prev.match(regex);
      if (matchTest) {
        const pageNumber = matchTest[1];
        setPage(pageNumber);
      }
    }
  };

  const handleNextPage = () => {
    if (next) {
      const regex = /page=(\d+)/;
      const matchTest = next.match(regex);
      if (matchTest) {
        const pageNumber = matchTest[1];
        setPage(pageNumber);
      }
    }
  };

  return (
    <div>
        <div className={styles.search}>
            <form>
                <input className={styles.searchBar} type="text" name="search" />
                <input className={styles.searchBtn} onClick={handleSearch} type="submit" value="Sök" />
            </form>
        </div>
        <h3 className={styles.gameListH3}>Utvalda och rekommenderas</h3>
        <div>
            {products.map((product) => (
            <SingleProduct key={product.id} product={product} />
            ))}
        </div>
        <button className={styles.prevPage} onClick={handlePrevPage}>
            &lt;
        </button>
        <button className={styles.nextPage} onClick={handleNextPage}>
            &gt;
        </button>
    </div>
  );
};

export default ProductList;
