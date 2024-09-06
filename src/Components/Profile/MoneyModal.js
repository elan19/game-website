import React, { useState } from 'react';
import styles from './MoneyModal.module.css'; // Create a CSS module for styling

const MoneyModal = ({ onClose, onAddMoney }) => {
    const [amount, setAmount] = useState(0);

    const handleSubmit = (event) => {
        event.preventDefault();
        if (amount > 0) {
            onAddMoney(amount);
            onClose();
        }
    };

    return (
        <div className={styles.modalBackground}>
            <div className={styles.modalContent}>
                <h2>Add Money</h2>
                <form onSubmit={handleSubmit}>
                    <label>
                        Amount:
                        <input
                            type="number"
                            value={amount}
                            onChange={(e) => setAmount(Number(e.target.value))}
                            min="1"
                            step="1"
                            required
                        />
                    </label>
                    <div className={styles.modalButtons}>
                        <button type="submit">Add</button>
                        <button type="button" onClick={onClose}>
                            Cancel
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default MoneyModal;
