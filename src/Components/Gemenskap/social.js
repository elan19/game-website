import React, { useState, useEffect } from 'react';
import styles from './Social.module.css'; // Ensure your CSS module is properly imported
import MongoDbModel from '../../models/mongodb'; // Your MongoDB model

const Social = () => {
    const [users, setUsers] = useState([]); // State to hold all users
    const [searchTerm, setSearchTerm] = useState(''); // State to hold the search query
    const [filteredUsers, setFilteredUsers] = useState([]); // State to hold filtered search results
    const [loading, setLoading] = useState(true); // State to track loading status
    const [error, setError] = useState(null); // State to track errors

    // Fetch all users from MongoDB on component mount
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const allUsers = await MongoDbModel.getAllUsers(); // Fetch users from your backend
                console.log(allUsers);
                setUsers(allUsers); // Assuming the response is an array of user objects with 'username' field
                setLoading(false);
            } catch (err) {
                console.error('Failed to fetch users:', err);
                setError('Failed to load users.');
                setLoading(false);
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
        return <p>{error}</p>; // Show error state
    }

    return (
        <div className={styles.socialBackground}>
            <h2>Search for Users</h2>
            <input
                type="text"
                placeholder="Search by username..."
                value={searchTerm}
                onChange={handleSearchChange}
                className={styles.searchBar} // Add styling for the search bar
            />

            <div className={styles.searchResults}>
                {filteredUsers.length > 0 ? (
                    <ul>
                        {filteredUsers.map((user) => (
                            <li key={user._id} className={styles.userItem}>
                                {user.username}
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
