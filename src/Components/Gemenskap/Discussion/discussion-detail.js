import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom'; // Import Link
import { UserContext } from '../../../util/UserContext';
import MongoDbModel from '../../../models/mongodb';
import styles from './DiscussionDetail.module.css';

const DiscussionDetail = () => {
    const { userData } = useContext(UserContext);
    const { discussionId } = useParams(); // Get the discussionId from the URL
    const [discussion, setDiscussion] = useState(null);
    const [comments, setComments] = useState([]);
    const [commentContent, setCommentContent] = useState(''); // Define commentContent state
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate(); // Use navigate for navigation

    useEffect(() => {
        const fetchDiscussionDetails = async () => {
            setLoading(true);
            try {
                const fetchedDiscussion = await MongoDbModel.getDiscussionById(discussionId); // Fetch the discussion details
                setDiscussion(fetchedDiscussion.discussion); // Set the discussion state
                setComments(fetchedDiscussion.discussion.comments || []); // Set comments if available
            } catch (error) {
                console.error('Error fetching discussion details:', error);
            }
            setLoading(false);
        };

        fetchDiscussionDetails();
    }, [discussionId]);

    const handleTagClick = (tag) => {
        // Navigate to the discussion list page with the selected tag as a query parameter
        navigate(`/gemenskap/discussions?genre=${tag}`);
    };

    const addCommentToDiscussion = async (discussionId, newComment) => {
        // Implement the function to add a comment to the discussion
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
            setCommentContent(''); // Reset the comment input
            console.log(response.message);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!discussion) {
        return <div>Discussion not found or failed to load.</div>;
    }

    return (
        <div className={styles.discussionDetailContainer}>
            {/* Back to Discussions Button */}
            <button className={styles.backButton} onClick={() => navigate('/gemenskap/discussions')}>
                Back to Discussions
            </button>
            <h2>{discussion.title}</h2>
            <p><strong>Game:</strong> {discussion.game}</p>
            {discussion.genre && discussion.genre.length > 0 && (
                <div className={styles.genres}>
                    {discussion.genre.map((tag, index) => (
                        <span
                            key={index}
                            className={styles.genre}
                            onClick={() => handleTagClick(tag)} // Handle tag click
                        >
                            {tag}
                        </span>
                    ))}
                </div>
            )}
            <p>{discussion.content}</p>

            <div className={styles.commentsSection}>
                <h3>Comments</h3>
                {comments.length > 0 ? (
                    comments.map((comment, index) => (
                        <div key={index} className={styles.comment}>
                            <p>
                                <strong>
                                    <Link className={styles.profileLink} to={`/profile/${comment.loginId}`}>{comment.author}</Link>
                                </strong>: {comment.content}
                            </p>
                        </div>
                    ))
                ) : (
                    <p>No comments yet. Be the first to comment!</p>
                )}
            </div>

            {userData && (
                <div className={styles.commentFormContainer}>
                    <form onSubmit={handleCommentSubmit}>
                        <textarea
                            value={commentContent}
                            onChange={(e) => setCommentContent(e.target.value)} // Set the comment content
                            placeholder="Add a comment..."
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
