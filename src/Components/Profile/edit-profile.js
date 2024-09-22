import React, { useState, useContext, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import MongoDbModel from '../../models/mongodb';

import styles from './EditProfile.module.css'; // Assuming you have a CSS file for styling
import { UserContext } from '../../util/UserContext'; // Import UserContext

const profileImages = [
    'profile1.jpg',
    'profile2.jpg',
    'profile3.jpg',
    'profile4.jpg',
    'profile5.jpg',
    'profile6.jpg',
    'profile7.jpg',
    'profile8.jpg',
    'profile9.jpg',
];

const EditProfile = () => {
    const { userData, fetchUserData } = useContext(UserContext); // Use UserContext
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        username: '',
        name: '',
        desc: '',
        profilePic: '',
    });

    useEffect(() => {
        if (!userData) {
            fetchUserData();
        } else {
            setLoading(false);
        }
    }, [userData, fetchUserData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const updatedData = {
            username: formData.username || userData.username,
            name: formData.name || userData.name,
            desc: formData.desc || userData.desc,
            profilePic: formData.profilePic || userData.profilePic,
        };

        try {
            const response = await MongoDbModel.editUser(userData.username, updatedData);
            fetchUserData(); // Refresh user data
            alert('Profile updated successfully!');
            navigate("/profile");
        } catch (err) {
            console.error("Failed to update profile:", err);
            alert('Failed to update profile.');
        }
    };

    const handleImageSelect = (image) => {
        setFormData({
            ...formData,
            profilePic: image, // Store the selected image
        });
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
                        placeholder={userData.username || ''}
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
                        placeholder={userData.name || ''}
                        onChange={handleChange}
                    />
                </div>
                <div className={styles.formGroup}>
                    <label htmlFor="desc">Description</label>
                    <textarea
                        id="desc"
                        name="desc"
                        value={formData.desc || ''}
                        placeholder={userData.desc || ''}
                        onChange={handleChange}
                    />
                </div>

                {/* Image Selection */}
                <div className={styles.formGroup}>
                    <label htmlFor="profilePic">Profile Picture</label>
                    <div className={styles.imageSelection}>
                        {profileImages.map((image, index) => (
                            <img
                                key={index}
                                src={`/images/profile/${image}`} // Correct path for public folder
                                alt={`Profile Pic ${index + 1}`}
                                className={`${styles.profileImage} ${formData.profilePic === image ? styles.selectedImage : ''}`} // Apply selected class
                                onClick={() => handleImageSelect(image)}
                            />
                        ))}
                    </div>
                </div>

                <button type="submit">Save Changes</button>
            </form>
        </div>
    );
};

export default EditProfile;
