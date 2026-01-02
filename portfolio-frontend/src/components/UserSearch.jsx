import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';
import './UserSearch.css';

const UserSearch = () => {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const searchRef = useRef(null);
    const navigate = useNavigate();

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowDropdown(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    // Debounce search
    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (query.trim()) {
                try {
                    const response = await api.get(`profiles/?search=${encodeURIComponent(query)}`);
                    setResults(response.data);
                    setShowDropdown(true);
                } catch (error) {
                    console.error('Search error:', error);
                }
            } else {
                setResults([]);
                setShowDropdown(false);
            }
        }, 300); // 300ms delay

        return () => clearTimeout(delayDebounceFn);
    }, [query]);

    const handleSelectUser = (username) => {
        navigate(`/${username}`);
        setShowDropdown(false);
        setQuery('');
    };

    return (
        <div className="user-search" ref={searchRef}>
            <input
                type="text"
                placeholder="Пошук розробників..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onFocus={() => query && setShowDropdown(true)}
            />
            {showDropdown && results.length > 0 && (
                <div className="search-dropdown">
                    {results.map((profile) => (
                        <div
                            key={profile.id}
                            className="search-item"
                            onClick={() => handleSelectUser(profile.user.username)}
                        >
                            {profile.profile_picture ? (
                                <img src={profile.profile_picture} alt={profile.user.username} className="search-avatar" />
                            ) : (
                                <div className="search-avatar-placeholder">
                                    {profile.user.first_name ? profile.user.first_name[0] : profile.user.username[0].toUpperCase()}
                                </div>
                            )}
                            <div className="search-info">
                                <span className="search-name">
                                    {profile.user.first_name || profile.user.username}
                                </span>
                                <span className="search-username">@{profile.user.username}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default UserSearch;
