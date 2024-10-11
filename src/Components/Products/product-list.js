import React, { useEffect, useState, useCallback } from 'react';
import styles from '../../Views/Products/Products.module.css';
import SingleProduct from './single-product';

const ProductList = () => {
  const [products, setProducts] = useState([]);
  const [next, setNext] = useState(null);
  const [prev, setPrev] = useState(null);
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [genre, setGenre] = useState('');

  const apiKey = process.env.REACT_APP_API_KEY;
  const baseURL = process.env.REACT_APP_BASE_URL;

  // Memoize fetchData to avoid it being redefined on every render
  const fetchData = useCallback(async (page, query = '', genre = '') => {
    let url = `${baseURL}/games?key=${apiKey}&page=${page}`;
  
    if (query) {
      url += `&search=${query}`;
    }
    
    if (genre) {
      url += `&genres=${genre}`;
    }
  
    const response = await fetch(url);
    const result = await response.json();
  
    setProducts(result.results);
    setNext(result.next);
  
    if (result.previous !== null) {
      const url = new URL(result.previous);
      const params = new URLSearchParams(url.search);
  
      if (!params.has('page')) {
        params.append('page', '1');
        url.search = params.toString();
      }
  
      setPrev(url.toString());
    } else {
      setPrev('https://api.rawg.io/api/games?key=7cb59c195dc14cf682ec1efef10d43ed&page=1');
    }
  }, [apiKey, baseURL]); // Add apiKey and baseURL as dependencies since they are used inside fetchData

  // useEffect will now trigger when page, searchQuery, or genre changes
  useEffect(() => {
    fetchData(page, searchQuery, genre);
  }, [page, searchQuery, genre, fetchData]); // fetchData is now memoized and can be safely used as a dependency

  const handleSearch = (event) => {
    event.preventDefault();
    const searchInput = document.querySelector('input[type="text"]').value;
    setSearchQuery(searchInput);
    fetchData(page, searchInput, genre); // Call fetchData after updating searchQuery
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
          <input className={styles.searchBtn} onClick={handleSearch} type="submit" value="Search" />
          <select 
            className={styles.genreSelect} 
            value={genre} 
            onChange={(e) => setGenre(e.target.value)}
          >
            <option value="">All Genres</option>
            <option value="action">Action</option>
            <option value="adventure">Adventure</option>
            <option value="shooter">Shooter</option>
            <option value="strategy">Strategy</option>
            <option value="role-playing-games-rpg">RPG</option>
            <option value="indie">Indie</option>
            <option value="puzzle">Puzzle</option>
            <option value="platformer">Platformer</option>
            {/* Add more genres as needed */}
          </select>
        </form>
      </div>
      <h3 className={styles.gameListH3}>Featured and recommended</h3>
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
