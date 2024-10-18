import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import styles from './Social.module.css';
import MongoDbModel from '../../models/mongodb';

const Social = () => {
    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState(''); 
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [error, setError] = useState(null);

    // Fetch all users from MongoDB on component mount
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const allUsers = await MongoDbModel.getAllUsers();
                setUsers(allUsers);
            } catch (err) {
                console.error('Failed to fetch users:', err);
                setError('Failed to load users.');
            }
        };

        fetchUsers();
    }, []);

    // Handle search input change
    const handleSearchChange = (event) => {
        const searchValue = event.target.value;
        setSearchTerm(searchValue);

        // Filter users based on search term
        if (searchValue === '') {
            setFilteredUsers([]); // If no search term, clear filtered results
        } else {
            const filtered = users.filter((user) =>
                user.username.toLowerCase().includes(searchValue.toLowerCase())
            );
            setFilteredUsers(filtered);
        }
    };

    if (error) {
        return <p>{error}</p>;
    }

    return (
        <div className={styles.socialBackground}>
            <h2 className={styles.searchH2}>Search for Users</h2>
            <input
                type="text"
                placeholder="Search by username..."
                value={searchTerm}
                onChange={handleSearchChange}
                className={styles.searchBar}
            />

            <div className={styles.searchResults}>
                {filteredUsers.length > 0 ? (
                    <ul>
                        {filteredUsers.map((user) => (
                            <li key={user._id} className={styles.userItem}>
                                <Link to={`/profile/${user.username}`} className={styles.userLink}>
                                    {user.username}
                                </Link>
                            </li>
                        ))}
                    </ul>
                ) : (
                    searchTerm && <p>No users found for "{searchTerm}"</p>
                )}
            </div>
        </div>
    );
};

export default Social;
