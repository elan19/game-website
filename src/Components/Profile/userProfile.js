import React, { useState, useEffect, useCallback, useContext  } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import MongoDbModel from '../../models/mongodb';
import { UserContext } from '../../util/UserContext.js';
import styles from './Profile.module.css';
import defaultProfilePic from '../../images/login.jpg';

const UserProfileView = () => {
    const { username } = useParams();
    const { userData, fetchUserData } = useContext(UserContext);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [friendRequestStatus, setFriendRequestStatus] = useState(null);
    const navigate = useNavigate();

    // Comments section states
    const [comments, setComments] = useState([]);
    const [newComment, setNewComment] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const commentsPerPage = 10;

    const fetchComments = useCallback(async () => {
        try {
            const response = await MongoDbModel.getUserComments(username);
            const fetchedComments = response.comments;
            setComments(fetchedComments);
        } catch (error) {
            console.error('Failed to fetch comments:', error);
        }
    }, [username]);

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
    
                // Fetch user data if not available
                if (!userData) {
                    await fetchUserData();
                }
    
                // Proceed with fetching the user profile only if userData is available
                if (userData) {
                    // Redirect to profile if viewing the logged-in user's profile
                    if (username === userData.username) {
                        navigate("/profile");
                        return;
                    }
    
                    // Fetch the profile data of the specified user
                    const fetchedUser = await MongoDbModel.getUserProfile(username);
                    setUser(fetchedUser);
                    fetchComments();
                    checkIfFriend(fetchedUser);
                }
            } catch (err) {
                console.error('Failed to fetch user data:', err);
                setError('Failed to load user profile.');
            } finally {
                setLoading(false);
            }
        };
    
        loadData();
    }, [username, navigate, userData, fetchUserData, fetchComments]);

    const handleAddComment = async () => {
        if (!newComment.trim()) return;

        try {
            await MongoDbModel.addUserComment(user.username, userData.loginId, userData.username, newComment);
            setNewComment('');
            fetchComments();
        } catch (error) {
            console.error('Failed to add comment:', error);
        }
    };

    const checkIfFriend = async (fetchedUser) => {
        if (fetchedUser.friends.includes(userData.username)) {
            setFriendRequestStatus("friends");
        } else if (fetchedUser.friendRequests.some(request => request.sender === userData.username && request.status === "pending")) {
            setFriendRequestStatus("pending");
        } else {
            setFriendRequestStatus('');
        }
    };

    const handleSendFriendRequest = async () => {
        try {
            await MongoDbModel.sendFriendRequest(userData.username, username);
            setFriendRequestStatus("pending");
        } catch (error) {
            console.error('Failed to send friend request:', error);
        }
    };

    const indexOfLastComment = currentPage * commentsPerPage;
    const indexOfFirstComment = indexOfLastComment - commentsPerPage;
    const currentComments = comments.slice(indexOfFirstComment, indexOfLastComment);

    let totalPages = Math.ceil(comments.length / commentsPerPage);
    if (totalPages < 1) totalPages = 1;

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    if (loading) {
        return <div></div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className={styles.profileDiv}>
            {user ? (
                <div className={styles.profileContainer}>
                    <h1 className={styles.profileName}>
                        {user.username}'s profile
                        <p className={styles.status}>
                            {user.status === "Online" ? (
                                <><p className={styles.onlineOrb}></p>Online</>
                            ) : (
                                <><p className={styles.offlineOrb}></p>Offline</>
                            )}
                        </p>
                    </h1>

                    {/* Friend request button */}
                    {friendRequestStatus === "pending" ? (
                        <button disabled className={styles.friendRequestButton}>Friend Request Pending</button>
                    ) : friendRequestStatus === "friends" ? (
                        <button disabled className={styles.friendRequestButton}>Already Friends</button>
                    ) : (
                        <button onClick={handleSendFriendRequest} className={styles.friendRequestButton}>Add Friend</button>
                    )}

                    <div className={styles.profileImageContainer}>
                        <img 
                            src={user.profilePic ? `/images/profile/${user.profilePic}` : defaultProfilePic} 
                            alt="Profile" 
                            className={styles.profileImage} 
                        />
                    </div>
                    <div className={styles.profileInfo}>
                        <p className={styles.profileInfoName}>{user.name}</p>
                        <p className={styles.profileInfoDesc}>{user.desc}</p>
                    </div>
                    <div className={styles.profileDetails}>
                        <h1>Details</h1>
                        <p>{`Games: ${user.games.length}`}</p>
                        <Link to={`/profile/${username}/inventory`} className={styles.inventoryLink}>
                            Inventory
                        </Link>
                        <Link to={`/profile/${user.username}/friends`} className={styles.inventoryLink}>
                            {`Friends: ${user.friends.length}`}
                        </Link>
                    </div>

                    {/* Comment section */}
                    <div className={styles.commentSection}>
                        <h2 className={styles.commentH2}>Comments</h2>
                        {currentComments.length > 0 ? (
                            currentComments.map((comment, index) => (
                                <div key={index} className={styles.comment}>
                                    <p>{comment[1]}</p>
                                    <Link to={`/profile/${comment[0]}`} className={styles.commentProfileLink}>
                                        {comment[0]}
                                    </Link>
                                </div>
                            ))
                        ) : (
                            <p className={styles.noComments}>No comments yet. Be the first to comment!</p>
                        )}

                        {/* Pagination controls */}
                        <div className={styles.pagination}>
                            <button onClick={handlePreviousPage} disabled={currentPage === 1}>
                                Previous
                            </button>
                            <span className={styles.pageSpan}>{`Page ${currentPage} of ${totalPages}`}</span>
                            <button onClick={handleNextPage} disabled={currentPage === totalPages}>
                                Next
                            </button>
                        </div>

                        {/* Add new comment */}
                        <div className={styles.addComment}>
                            <textarea
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                maxLength={"750"}
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

export default UserProfileView;
