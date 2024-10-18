// src/components/CreateDiscussion.js

import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../../util/UserContext';
import MongoDbModel from '../../../models/mongodb';
import styles from './CreateDiscussion.module.css';

const CreateDiscussion = () => {
    const { userData, fetchUserData } = useContext(UserContext);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [game, setGame] = useState('');
    const [genre, setGenre] = useState([]);
    const [isPrivate, setIsPrivate] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const updateUserData = async () => {
            await fetchUserData();
        };
    
        if (!userData || !userData.email) {
            updateUserData();
        }

    }, [userData, fetchUserData]);

    const handleGenreChange = (e) => {
        const selectedGenres = Array.from(e.target.selectedOptions, (option) => option.value);
        setGenre(selectedGenres);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newDiscussion = { title, content, game, genre, isPrivate };
        try {
            await MongoDbModel.addDiscussion(newDiscussion, userData.username, userData.loginId);
            navigate('/gemenskap/discussion');
        } catch (error) {
            console.error('Error creating discussion:', error);
        }
    };

    return (
        <div className={styles.createDiscussionContainer}>
            {/* Back to Discussions Button */}
            <button className={styles.backButton} onClick={() => navigate('/gemenskap/discussions')}>
                Back to Discussions
            </button>
            <h2>Create New Discussion</h2>
            <form onSubmit={handleSubmit} className={styles.createDiscussionForm}>
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
                <select multiple onChange={handleGenreChange} className={styles.multipleSelect}>
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
                <button type="submit" className={styles.submitButton}>Create Discussion</button>
            </form>
        </div>
    );
};

export default CreateDiscussion;
