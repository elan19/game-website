import React from 'react';
import PropTypes from 'prop-types';
import styles from './GemenskapList.module.css';

const SingleGemenskap = ({ gemenskap }) => {
    const date = new Date(gemenskap.datetimeUploaded);

    return (
        <div className={styles.gemenskap}>
            <img src={gemenskap.originalFileUrl} alt="userpic" />
            <div className={styles.gameDescH2Border}></div>
            <p>{date.toLocaleString()}</p>
        </div>
    );
};

SingleGemenskap.propTypes = {
    gemenskap: PropTypes.shape({
        datetimeUploaded: PropTypes.string.isRequired,
        originalFileUrl: PropTypes.string.isRequired,
    }).isRequired,
};

export default SingleGemenskap;
