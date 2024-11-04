import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom'; 
import { UserContext } from '../../../util/UserContext';
import MongoDbModel from '../../../models/mongodb';
import styles from './DiscussionDetail.module.css';

const DiscussionDetail = () => {
    const { userData, fetchUserData } = useContext(UserContext);
    const { discussionId } = useParams(); 
    const [discussion, setDiscussion] = useState(null);
    const [comments, setComments] = useState([]);
    const [commentContent, setCommentContent] = useState(''); 
    const [loading, setLoading] = useState(true);
    const [loadingUserData, setLoadingUserData] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const commentsPerPage = 10;
    const navigate = useNavigate(); 

    // Fetch the discussion and comments for that discussion
    useEffect(() => {
        const fetchDiscussionDetails = async () => {
            setLoading(true);
            try {
                const fetchedDiscussion = await MongoDbModel.getDiscussionById(discussionId);
                setDiscussion(fetchedDiscussion.discussion);
                setComments(fetchedDiscussion.discussion.comments || []);
            } catch (error) {
                console.error('Error fetching discussion details:', error);
            }
            setLoading(false);
        };

        fetchDiscussionDetails();
    }, [discussionId]);

    // Fetch the userData if needed
    useEffect(() => {
        const updateUserData = async () => {
            try {
                setLoadingUserData(true); 
                await fetchUserData(); 
            } catch (error) {
                console.error('Error fetching user data:', error);
            } finally {
                setLoadingUserData(false); 
            }
        };
    
        if (!userData?.email && !loadingUserData) {
            updateUserData();
        }
    }, [userData, fetchUserData, loadingUserData]);

    const handleTagClick = (tag) => {
        navigate(`/gemenskap/discussions?genre=${tag}`);
    };

    const addCommentToDiscussion = async (discussionId, newComment) => {
        const response = await MongoDbModel.addCommentToDiscussion(discussionId, newComment);
        return response;
    };

    const handleCommentSubmit = async (event) => {
        event.preventDefault();
        const newComment = {
            author: userData.username,
            loginId: userData.loginId,
            content: commentContent,
            createdAt: new Date().toISOString()
        };
        
        const response = await addCommentToDiscussion(discussionId, newComment);
        
        if (response.error) {
            console.error(response.error);
        } else {
            setComments(prevComments => [...prevComments, newComment]);
            setCommentContent(''); 
        }
    };

    const handleNextPage = () => {
        if (currentPage < Math.ceil(comments.length / commentsPerPage)) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const indexOfLastComment = currentPage * commentsPerPage;
    const indexOfFirstComment = indexOfLastComment - commentsPerPage;
    const currentComments = comments.slice(indexOfFirstComment, indexOfLastComment);

    let totalPages = Math.ceil(comments.length / commentsPerPage);
    if (totalPages < 1) totalPages = 1;

    if (loading) {
        return <div></div>;
    }

    if (!discussion) {
        return <div>Discussion not found or failed to load.</div>;
    }

    return (
        <div className={styles.discussionDetailContainer}>
            <button className={styles.backButton} onClick={() => navigate('/gemenskap/discussions')}>
                Back to Discussions
            </button>
            <h2>{discussion.title}</h2>
            <p><strong>Game:</strong> {discussion.game}</p>
            <p className={styles.italicFont}>
                Author: <Link className={styles.profileLink} to={`/profile/${discussion.author}`}>{discussion.author}</Link>
            </p>
            <p className={styles.italicFont}>
                Created on: {new Date(discussion.createdAt).toLocaleString()}
            </p>
            {discussion.genre && discussion.genre.length > 0 && (
                <div className={styles.genres}>
                    {discussion.genre.map((tag, index) => (
                        <span
                            key={index}
                            className={styles.genre}
                            onClick={() => handleTagClick(tag)}
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            )}
            <p>{discussion.content}</p>

            {/* Edit Discussion Button */}
            {userData && discussion.author === userData.username && (
                <button 
                    className={styles.editButton} 
                    onClick={() => navigate(`/gemenskap/discussions/${discussionId}/edit`)}
                >
                    Edit Discussion
                </button>
            )}

            <div className={styles.commentsSection}>
                <h3>Comments</h3>
                
                {/* Display comments regardless of discussion privacy */}
                {currentComments.length > 0 ? (
                    currentComments.map((comment, index) => {
                        const formattedDate = new Date(comment.createdAt).toLocaleString();

                        return (
                            <div key={index} className={styles.comment}>
                                <p>
                                    <strong>
                                        <Link className={styles.profileLink} to={`/profile/${comment.author}`}>
                                            {comment.author}
                                        </Link>
                                    </strong>: {comment.content}
                                </p>
                                <p className={styles.italicFont}>{formattedDate}</p>
                            </div>
                        );
                    })
                ) : (
                    <p>No comments yet. Be the first to comment!</p>
                )}

                {/* Pagination Controls */}
                <div className={styles.pagination}>
                    <button 
                        className={styles.paginationButton} 
                        onClick={handlePreviousPage} 
                        disabled={currentPage === 1}
                    >
                        Previous
                    </button>
                    <span>Page {currentPage} of {totalPages}</span>
                    <button 
                        className={styles.paginationButton} 
                        onClick={handleNextPage} 
                        disabled={currentPage === Math.ceil(comments.length / commentsPerPage)}
                    >
                        Next
                    </button>
                </div>
            </div>

            {/* Render comment form only if the user is the author of the discussion */}
            {userData !== null && Object.keys(userData).length > 2 && !discussion.private && (
                <div className={styles.commentFormContainer}>
                    <form onSubmit={handleCommentSubmit}>
                        <textarea
                            value={commentContent}
                            onChange={(e) => setCommentContent(e.target.value)}
                            placeholder="Add a comment..."
                            maxLength={1000}
                            required
                        />
                        <button className={styles.button} type="submit">Comment</button>
                    </form>
                </div>
            )}

            {/* Render comment form only if the user is the author of the discussion */}
            {userData !== null && Object.keys(userData).length > 2 && discussion.private && discussion.author === userData.username &&(
                <div className={styles.commentFormContainer}>
                    <form onSubmit={handleCommentSubmit}>
                        <textarea
                            value={commentContent}
                            onChange={(e) => setCommentContent(e.target.value)}
                            placeholder="Add a comment..."
                            maxLength={1000}
                            required
                        />
                        <button className={styles.button} type="submit">Comment</button>
                    </form>
                </div>
            )}
        </div>
    );
};

export default DiscussionDetail;
