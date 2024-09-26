import React, { useState, useContext, useEffect } from 'react';
import { UserContext } from '../../util/UserContext';
import MongoDbModel from '../../models/mongodb';
import { Link } from 'react-router-dom';
import styles from './Profile.module.css';
import defaultProfilePic from '../../images/login.jpg';
import MoneyModal from './MoneyModal';

const ProfileView = () => {
    const { userData, fetchUserData } = useContext(UserContext);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [showModal, setShowModal] = useState(false);
    
    // Comments section states
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const commentsPerPage = 10; // Show 10 comments per page

    useEffect(() => {
        if (!userData) {
            fetchUserData();
        } else {
            setLoading(false);
            fetchComments(); // Fetch comments when userData is available
        }
    }, [userData, fetchUserData]);

    const fetchComments = async () => {
        try {
            const response = await MongoDbModel.getUserComments(userData.username); // Assuming a method to fetch comments
            const fetchedComments = response.comments; // Access the first array inside comments
            setComments(fetchedComments);
            console.log(fetchedComments);
        } catch (error) {
            console.error('Failed to fetch comments:', error);
        }
    };

    const handleAddComment = async () => {
        if (!newComment.trim()) return; // Don't allow empty comments

        try {
            
            await MongoDbModel.addUserComment(userData.username, localStorage.getItem('loginId'), userData.username, newComment);
            setNewComment('');
            fetchComments(); // Refresh comments after adding a new one
        } catch (error) {
            console.error('Failed to add comment:', error);
        }
    };

    // Calculate the comments for the current page
    const indexOfLastComment = currentPage * commentsPerPage;
    const indexOfFirstComment = indexOfLastComment - commentsPerPage;
    const currentComments = comments.slice(indexOfFirstComment, indexOfLastComment);

    // Calculate total pages
    const totalPages = Math.ceil(comments.length / commentsPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    const addMoney = async (amount) => {
        try {
            await MongoDbModel.updateUserMoney(userData.username, amount);
            fetchUserData(); // Refresh user data
        } catch (error) {
            console.error('Failed to update user data:', error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className={styles.profileDiv}>
            {showModal && (
                <MoneyModal
                    onClose={() => setShowModal(false)}
                    onAddMoney={addMoney}
                />
            )}
            {userData ? (
                <div className={styles.profileContainer}>
                    <h1 className={styles.profileName}>{userData.username}</h1>
                    <Link to="/profile/edit" className={styles.editProfileLink}>
                        Edit Profile
                    </Link>
                    <div className={styles.addMoney}>
                        <button onClick={() => setShowModal(true)} className={styles.addMoneyButton}>
                            Add Money
                        </button>
                    </div>
                    <div className={styles.profileImageContainer}>
                        <img src={`images/profile/` + userData.profilePic || defaultProfilePic} alt="Profile" className={styles.profileImage} />
                    </div>
                    <div className={styles.profileInfo}>
                        <p>{userData.name}</p>
                        <p className={styles.test}>{userData.desc}</p>
                        <p>{`Money: $${parseFloat(userData.money.toFixed(2))}`}</p>
                    </div>
                    <div className={styles.profileDetails}>
                        <h1>Details</h1>
                        <p>{`Number of Games: ${userData.games.length}`}</p>
                        <Link to={`/profile/${userData.username}/inventory`} className={styles.inventoryLink}>
                            Inventory
                        </Link>
                        <p>{`Number of Friends: ${userData.friends.length}`}</p>
                    </div>

                    {/* Comment section */}
                    <div className={styles.commentSection}>
                        <h2 className={styles.commentH2}>Comments</h2>
                        {currentComments.length > 0 ? (
                            currentComments.map((comment, index) => (
                                <div key={index} className={styles.comment}>
                                    <p>{comment[1]}</p> {/* Assuming comment[1] contains the comment text */}
                                    <small>{`Author: ${comment[0]}`}</small> {/* Assuming comment[0] is a unique identifier */}
                                </div>
                            ))
                        ) : (
                            <p>No comments yet. Be the first to comment!</p>
                        )}

                        {/* Pagination controls */}
                        <div className={styles.pagination}>
                            <button onClick={handlePreviousPage} disabled={currentPage === 1}>
                                Previous
                            </button>
                            <span>{`Page ${currentPage} of ${totalPages}`}</span>
                            <button onClick={handleNextPage} disabled={currentPage === totalPages}>
                                Next
                            </button>
                        </div>

                        {/* Add new comment */}
                        <div className={styles.addComment}>
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                placeholder="Write a comment..."
                                rows="3"
                            />
                            <button onClick={handleAddComment} disabled={!newComment.trim()}>
                                Post Comment
                            </button>
                        </div>
                    </div>
                </div>
                
            ) : (
                <div>No user data found.</div>
            )}
        </div>
    );
};

export default ProfileView;
