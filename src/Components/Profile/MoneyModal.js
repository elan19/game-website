import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../util/UserContext';
import styles from './MoneyModal.module.css';
import MongoDbModel from '../../models/mongodb';

const DAILY_REWARD_AMOUNT = 20; // Fixed reward amount

const MoneyModal = ({ onClose, onAddMoney }) => {
    const { userData } = useContext(UserContext);
    const [isRewardClaimed, setIsRewardClaimed] = useState(false);

    useEffect(() => {
        // Check if the user has already claimed today's reward
        const checkClaimStatus = async () => {
            try {
                const response = await MongoDbModel.getLastClaimDate(userData.username, userData.loginId);
                const lastClaimDate = response?.lastClaimDate;
    
                const today = new Date().toISOString().split('T')[0]; // Get today's date in YYYY-MM-DD format
                
                // If the lastClaimDate is today, the user has already claimed the reward
                if (lastClaimDate === today) {
                    setIsRewardClaimed(true);
                }
            } catch (error) {
                console.error("Error fetching last claim date:", error);
            }
        };
    
        if (userData?.username) {
            checkClaimStatus();
        }
    }, [userData]);    

    const handleClaimReward = async () => {

        onAddMoney(DAILY_REWARD_AMOUNT);
        onClose();
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
