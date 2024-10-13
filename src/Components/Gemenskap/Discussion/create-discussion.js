// src/components/CreateDiscussion.js

import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../../../util/UserContext';
import MongoDbModel from '../../../models/mongodb'; // Adjust this path as needed
import styles from './CreateDiscussion.module.css';

const CreateDiscussion = () => {
    const { userData, fetchUserData } = useContext(UserContext);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [game, setGame] = useState('');
    const [genre, setGenre] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const updateUserData = async () => {
            setLoading(true);
            await fetchUserData();
            setLoading(false);
        };
    
        if (!userData || !userData.email) { // Check for key properties to determine if userData is incomplete
            updateUserData();
        } else {
            setLoading(false);
        }


    }, [userData, fetchUserData]);

    const handleGenreChange = (e) => {
        const selectedGenres = Array.from(e.target.selectedOptions, (option) => option.value);
        setGenre(selectedGenres);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const newDiscussion = { title, content, game, genre };
        console.log(newDiscussion);
        console.log(userData.username);
        console.log(userData.loginId);
        try {
            await MongoDbModel.addDiscussion(newDiscussion, userData.username, userData.loginId); // Replace with your API or DB method
            navigate('/gemenskap/discussion'); // Redirect to discussions page after creating the discussion
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
                <label>Tags:</label>
                <select multiple onChange={handleGenreChange}>
                    <option value="Action">Action</option>
                    <option value="Adventure">Adventure</option>
                    <option value="RPG">RPG</option>
                    <option value="Strategy">Strategy</option>
                    <option value="Help">Help</option>
                </select>
                <button type="submit" className={styles.submitButton}>Create Discussion</button>
            </form>
        </div>
    );
};

export default CreateDiscussion;