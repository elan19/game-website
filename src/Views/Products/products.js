import React from 'react';

import styles from './Products.module.css';

import ProductList from '../../Components/Products/product-list';

class ProductsView extends React.Component {
    render() {
        return (
            <div>
                <header className={styles.header}>
                    <label className={styles.searchText}>Search for game or product</label>
                </header>
                <main className={styles.main}>
                    <ProductList />
                </main>
            </div>
        );
    }
}

export default ProductsView;

