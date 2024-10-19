import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UserContext } from '../../../util/UserContext';
import MongoDbModel from '../../../models/mongodb';
import styles from './EditDiscussion.module.css';

const EditDiscussion = () => {
    const { userData, fetchUserData } = useContext(UserContext);
    const { discussionId } = useParams();
    const [discussion, setDiscussion] = useState(null);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [game, setGame] = useState('');
    const [genre, setGenre] = useState([]);
    const [isPrivate, setIsPrivate] = useState(false);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchDiscussionDetails = async () => {
            setLoading(true);
            try {
                const fetchedDiscussion = await MongoDbModel.getDiscussionById(discussionId);
                setDiscussion(fetchedDiscussion.discussion);
                setTitle(fetchedDiscussion.discussion.title);
                setContent(fetchedDiscussion.discussion.content);
                setGame(fetchedDiscussion.discussion.game);
                setGenre(fetchedDiscussion.discussion.genre || []);
                setIsPrivate(fetchedDiscussion.discussion.private);
            } catch (error) {
                console.error('Error fetching discussion details:', error);
            }
            setLoading(false);
        };

        fetchDiscussionDetails();
    }, [discussionId]);

    useEffect(() => {
        const updateUserData = async () => {
            if (!userData || !userData.email) {
                await fetchUserData();
            }
        };

        updateUserData();
    }, [userData, fetchUserData]);

    const handleGenreChange = (e) => {
        const selectedGenres = Array.from(e.target.selectedOptions, (option) => option.value);
        setGenre(selectedGenres);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        const updatedDiscussion = {
            title,
            content,
            game,
            genre,
            isPrivate,
        };

        try {
            const response = await MongoDbModel.editDiscussion(discussionId, updatedDiscussion, userData.username, userData.loginId);
            if (response.error) {
                console.error('Error updating discussion:', response.error);
            } else {
                navigate(`/gemenskap/discussions/${discussionId}`);
            }
        } catch (error) {
            console.error('Error submitting updated discussion:', error);
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!discussion) {
        return <div>Discussion not found or failed to load.</div>;
    }

    // Ensure only the author can edit the discussion
    if (userData && discussion.author !== userData.username) {
        navigate('/gemenskap/discussions'); // Redirect immediately
        return null; // Return null to avoid rendering anything else
    }

    return (
        <div className={styles.editDiscussionContainer}>
            <button className={styles.backButton} onClick={() => navigate(`/gemenskap/discussions/${discussionId}`)}>
                Back to Discussion
            </button>
            <h2>Edit Discussion</h2>
            <form onSubmit={handleSubmit} className={styles.formGroup}>
                <label>Title:</label>
                <input 
                    type="text" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)} 
                    required
                />
                <label>Content:</label>
                <textarea 
                    value={content} 
                    onChange={(e) => setContent(e.target.value)} 
                    required 
                />
                <label>Game:</label>
                <input 
                    type="text" 
                    value={game} 
                    onChange={(e) => setGame(e.target.value)} 
                />
                <label>Tags: <span className={styles.italic}>(Hold down CTRL to select multiple)</span></label>
                <select multiple value={genre} onChange={handleGenreChange} className={styles.multipleSelect}>
                    <option value="Action">Action</option>
                    <option value="Adventure">Adventure</option>
                    <option value="Shooter">Shooter</option>
                    <option value="Strategy">Strategy</option>
                    <option value="RPG">RPG</option>
                    <option value="Indie">Indie</option>
                    <option value="Puzzle">Puzzle</option>
                    <option value="Platformer">Platformer</option>
                    <option value="Help">Help</option>
                    <option value="Discussion">Discussion</option>
                    <option value="Info">Info</option>
                </select>
                <label>
                    <span>Private Discussion:</span>
                    <input
                        type="checkbox"
                        checked={isPrivate}
                        onChange={() => setIsPrivate(!isPrivate)}
                    />
                </label>
                <button type="submit" className={styles.submitButton}>Save Changes</button>
            </form>
        </div>
    );
};

export default EditDiscussion;
