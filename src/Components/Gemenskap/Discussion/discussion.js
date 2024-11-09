import React, { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { UserContext } from '../../../util/UserContext';
import MongoDbModel from '../../../models/mongodb';
import styles from './Discussion.module.css';

const DiscussionComp = () => {
    const { userData, fetchUserData } = useContext(UserContext);
    const [discussions, setDiscussions] = useState([]);
    const [filteredDiscussions, setFilteredDiscussions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedGenres, setSelectedGenres] = useState([]);
    const discussionsPerPage = 5;
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        const fetchDiscussions = async () => {
            try {
                const allDiscussions = await MongoDbModel.getAllDiscussions();
                setDiscussions(allDiscussions);
                setFilteredDiscussions(allDiscussions);
            } catch (error) {
                console.error('Error fetching discussions:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDiscussions();
    }, []); // Fetch discussions only once when the component mounts

    useEffect(() => {
        const updateUserData = async () => {
            try {
                await fetchUserData(); // Fetch user data
            } catch (error) {
                console.error('Error fetching user data:', error);
            }
        };

        if (!userData || !userData.email) {
            updateUserData();
        }
    }, [userData, fetchUserData]); // Fetch user data when `userData` changes

    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const genre = searchParams.get('genre');
        
        if (genre) {
            setSelectedGenres([genre]);
            const filtered = discussions.filter(discussion => discussion.genre.includes(genre));
            setFilteredDiscussions(filtered);
        } else {
            setFilteredDiscussions(discussions);
        }
    }, [location.search, discussions]);

    const handleSearch = (event) => {
        event.preventDefault();
        const searchInput = document.querySelector('input[type="text"]').value.toLowerCase();
        setSearchQuery(searchInput);
        setSelectedGenres([]);

        const filtered = discussions.filter(discussion => 
            (discussion.title && discussion.title.toLowerCase().includes(searchInput)) ||
            (discussion.content && discussion.content.toLowerCase().includes(searchInput)) ||
            (discussion.game && discussion.game.toLowerCase().includes(searchInput))
        );
        setFilteredDiscussions(filtered);
        setCurrentPage(1);
    };    

    const handleGenreClick = (genre) => {
        let updatedGenres;
        if (selectedGenres.includes(genre)) {
            updatedGenres = selectedGenres.filter(g => g !== genre);
        } else {
            updatedGenres = [...selectedGenres, genre];
        }
        setSelectedGenres(updatedGenres);

        const filtered = discussions.filter(discussion =>
            updatedGenres.every(g => discussion.genre.includes(g))
        );

        setFilteredDiscussions(filtered);
        setCurrentPage(1);
        setSearchQuery("");
    };

    const handleClearFilters = () => {
        setFilteredDiscussions(discussions);
        setSearchQuery("");
        setSelectedGenres([]);
        setCurrentPage(1);
    };

    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber);
        }
    };

    const handleNextPage = () => {
        if (currentPage < totalPages) {
            setCurrentPage(currentPage + 1);
        }
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) {
            setCurrentPage(currentPage - 1);
        }
    };

    const indexOfLastDiscussion = currentPage * discussionsPerPage;
    const indexOfFirstDiscussion = indexOfLastDiscussion - discussionsPerPage;
    const currentDiscussions = filteredDiscussions.slice(indexOfFirstDiscussion, indexOfLastDiscussion);

    const totalPages = Math.ceil(filteredDiscussions.length / discussionsPerPage);
    
    const maxVisiblePages = 4;
    let startPage = Math.max(1, currentPage - 1);
    let endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);

    if (endPage - startPage + 1 < maxVisiblePages) {
        startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }

    const visiblePages = [];
    for (let i = startPage; i <= endPage; i++) {
        visiblePages.push(i);
    }

    const handleDiscussionClick = (discussionId) => {
        navigate(`/community/discussions/${discussionId}`);
    };

    const handleCreateDiscussionClick = () => {
        navigate(`/community/discussion/create-discussion`);
    };

    if (loading) {
        return <div></div>;
    }

    return (
        <div className={styles.discussionContainer}>
            <h2 className={styles.discussionH2}>Discussions</h2>

            <div className={styles.searchCreateContainer}>
                <div className={styles.search}>
                    <form onSubmit={handleSearch} className={styles.discussionForm}>
                        <input className={styles.searchBar} type="text" name="search" placeholder="Search title..." />
                        <input className={styles.searchBtn} type="submit" value="Search" />
                    </form>
                    {(searchQuery || selectedGenres.length > 0) && (
                        <div className={styles.activeFilters}>
                            <span>
                                {searchQuery && `Search: ${searchQuery}`}
                                {selectedGenres.length > 0 && (
                                    <div>
                                        Filters: 
                                        {selectedGenres.map((genre, index) => (
                                            <span
                                                key={index}
                                                className={styles.activeGenre}
                                                onClick={() => handleGenreClick(genre)} 
                                                style={{ cursor: 'pointer', marginLeft: '5px' }}
                                            >
                                                {genre}
                                                {index < selectedGenres.length - 1 && ","}
                                            </span>
                                        ))}
                                        <button onClick={handleClearFilters} className={styles.clearFilters}>
                                            Clear All
                                        </button>
                                    </div>
                                )}
                            </span>
                        </div>
                    )}
                </div>

                {userData && (
                    <div className={styles.createDiscussionContainer}>
                        <button 
                            onClick={handleCreateDiscussionClick} 
                            className={styles.createDiscussionBtn}
                        >
                            Create Discussion
                        </button>
                    </div>
                )}
            </div>

            <div className={styles.discussionList}>
                {currentDiscussions.map(discussion => (
                    <div 
                        key={discussion._id} 
                        className={styles.discussionItem}
                        onClick={() => handleDiscussionClick(discussion._id)}
                    >
                        <h3>{discussion.title}</h3>
                        <p>
                            {discussion.content.length > 30 
                                ? `${discussion.content.substring(0, 30)}...` 
                                : discussion.content}
                        </p>
                        <p>{discussion.game}</p>
                        <div className={styles.genres}>
                            {discussion.genre.map((tag, index) => (
                                <span 
                                    key={index} 
                                    className={`${styles.genre} ${selectedGenres.includes(tag) ? styles.active : ''}`} 
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleGenreClick(tag);
                                    }}
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                        <div className={styles.additionalInfo}>
                            <span>{discussion.comments ? discussion.comments.length : 0} Comments</span>
                            {discussion.private && (
                                <span className={styles.privateMessage}>Private discussion</span>
                            )}
                            <span>Created: {new Date(discussion.createdAt).toLocaleDateString()}</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className={styles.pagination}>
                <button
                    onClick={handlePreviousPage}
                    className={styles.pageButton}
                    disabled={currentPage === 1}
                >
                    Previous
                </button>

                {visiblePages.map((page) => (
                    <button
                        key={page}
                        className={`${styles.pageButton} ${currentPage === page ? styles.active : ''}`}
                        onClick={() => handlePageChange(page)}
                    >
                        {page}
                    </button>
                ))}

                <button
                    onClick={handleNextPage}
                    className={styles.pageButton}
                    disabled={currentPage === totalPages}
                >
                    Next
                </button>
            </div>
        </div>
    );
};

export default DiscussionComp;
