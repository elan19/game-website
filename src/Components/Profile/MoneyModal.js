import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../util/UserContext';
import styles from './MoneyModal.module.css'; // Create a CSS module for styling
import MongoDbModel from '../../models/mongodb'; // Assumes this contains your MongoDB operations

const DAILY_REWARD_AMOUNT = 20; // Set the fixed reward amount

const MoneyModal = ({ onClose, onAddMoney }) => {
    const { userData, fetchUserData } = useContext(UserContext);
    const [isRewardClaimed, setIsRewardClaimed] = useState(false);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if the user has already claimed today's reward
        const checkClaimStatus = async () => {
            try {
                console.log(userData);
                const response = await MongoDbModel.getLastClaimDate(userData.username, userData.loginId);
                const lastClaimDate = response?.lastClaimDate;
                console.log(lastClaimDate);

                const today = new Date().toLocaleDateString();
                
                // If the lastClaimDate is today, the user has already claimed the reward
                if (lastClaimDate === today) {
                    setIsRewardClaimed(true);
                }
            } catch (error) {
                console.error("Error fetching last claim date:", error);
            } finally {
                setLoading(false); // Set loading to false once we have the data
            }
        };

        if (userData?.username) {
            checkClaimStatus();
        }
    }, [userData]);

    const handleClaimReward = async () => {

        onAddMoney(DAILY_REWARD_AMOUNT); // Award the fixed amount
        onClose(); // Close the modal after claiming
    };

    return (
        <div className={styles.modalBackground}>
            <div className={styles.modalContent}>
                <h2>Daily Reward</h2>
                {!isRewardClaimed ? (
                    <>
                        <p>Claim your daily reward of {DAILY_REWARD_AMOUNT} Coins!</p>
                        <div className={styles.modalButtons}>
                            <button onClick={handleClaimReward}>Claim Reward</button>
                            <button type="button" onClick={onClose}>Close</button>
                        </div>
                    </>
                ) : (
                    <>
                        <p>You have already claimed your daily reward!</p>
                        <div className={styles.modalButtons}>
                            <button type="button" onClick={onClose}>Close</button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default MoneyModal;
