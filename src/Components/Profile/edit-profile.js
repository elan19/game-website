import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MongoDbModel from '../../models/mongodb';

import styles from './EditProfile.module.css'; // Assuming you have a CSS file for styling

import { UserContext } from '../../util/UserContext'; // Import UserContext

import defaultProfilePic from '../../images/login.jpg';

const EditProfile = () => {
    const [userData, setUserData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { fetchUserData } = useContext(UserContext); // Use UserContext
    const [formData, setFormData] = useState({
        username: '',
        name: '',
        desc: '',
        profilePic: '',
    });

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const data = await MongoDbModel.getOneUser(localStorage.getItem('username'));
                if (data) {
                    setUserData(data);
                    setFormData({
                        username: data.username || '',
                        name: data.name || '',
                        desc: data.desc || '',
                        profilePic: data.profilePic || '',
                    });
                } else {
                    setError('Failed to fetch user data.');
                }
            } catch (err) {
                setError('An error occurred while fetching user data.');
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await MongoDbModel.editUser(userData.username, formData); // Assume updateUser is a method to update user data
            fetchUserData();
            alert('Profile updated successfully!');
            navigate("/profile");
        } catch (err) {
            alert('Failed to update profile.');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>{error}</div>;
    }

    return (
        <div className={styles.editProfileDiv}>
            <div className={styles.editProfileLinkDiv}>
                <Link to="/profile" className={styles.editProfileLink}>
                    Back to profile 
                </Link>
            </div>
            <h1>Edit Profile</h1>
            <form onSubmit={handleSubmit} className={styles.editProfileForm}>
                <div className={styles.formGroup}>
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        id="username"
                        name="username"
                        value={formData.username || ''}
                        onChange={handleChange}
                        disabled
                        className={styles.disabled}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="name">Name</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name || ''}
                        onChange={handleChange}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="desc">Description</label>
                    <textarea
                        id="desc"
                        name="desc"
                        value={formData.desc || ''}
                        onChange={handleChange}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="profilePic">Profile Picture URL</label>
                    <input
                        type="text"
                        id="profilePic"
                        name="profilePic"
                        value={formData.profilePic || ''}
                        onChange={handleChange}
                    />
                </div>
                <button type="submit">Save Changes</button>
            </form>
        </div>
    );
};

export default EditProfile;
