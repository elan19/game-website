import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import MongoDbModel from '../../models/mongodb';
import styles from './Profile.module.css';
import defaultProfilePic from '../../images/login.jpg';

const UserProfileView = () => {
    const { username } = useParams();
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

    useEffect(() => {
        if (username === localStorage.getItem("username")) {
            navigate("/profile");
        }

        const fetchUser = async () => {
            try {
                const fetchedUser = await MongoDbModel.getOneUser('user2', '67b5489687e58b97');
                console.log(fetchedUser);
                setUser(fetchedUser);
                setLoading(false);
                fetchComments();
                checkIfFriend(fetchedUser); // Check if the user is already a friend
            } catch (err) {
                console.error('Failed to fetch user data:', err);
                setError('Failed to load user profile.');
                setLoading(false);
            }
        };

        fetchUser();
    }, [username]); // Re-run the effect if the username changes

    const fetchComments = async () => {
        try {
            const response = await MongoDbModel.getUserComments(username);
            const fetchedComments = response.comments;
            setComments(fetchedComments);
        } catch (error) {
            console.error('Failed to fetch comments:', error);
        }
    };

    const handleAddComment = async () => {
        if (!newComment.trim()) return;

        try {
            await MongoDbModel.addUserComment(user.username, localStorage.getItem('loginId'), localStorage.getItem("username"), newComment);
            setNewComment('');
            fetchComments();
        } catch (error) {
            console.error('Failed to add comment:', error);
        }
    };

    const checkIfFriend = async (fetchedUser) => {
        const currentUser = localStorage.getItem("username");
        if (fetchedUser.friends.includes(currentUser)) {
            setFriendRequestStatus("friends");
        } else if (fetchedUser.friendRequests.some(request => request.sender === currentUser && request.status === "pending")) {
            setFriendRequestStatus("pending");
        }  else {
            setFriendRequestStatus('');
        }
    };

    const handleSendFriendRequest = async () => {
        try {
            await MongoDbModel.sendFriendRequest(localStorage.getItem("username"), username);
            setFriendRequestStatus("pending");
        } catch (error) {
            console.error('Failed to send friend request:', error);
        }
    };

    const indexOfLastComment = currentPage * commentsPerPage;
    const indexOfFirstComment = indexOfLastComment - commentsPerPage;
    const currentComments = comments.slice(indexOfFirstComment, indexOfLastComment);
    const totalPages = Math.ceil(comments.length / commentsPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage(currentPage + 1);
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) setCurrentPage(currentPage - 1);
    };

    if (loading) {
        return <div>Loading...</div>;
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
                        <p>{user.desc}</p>
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

export default UserProfileView;
