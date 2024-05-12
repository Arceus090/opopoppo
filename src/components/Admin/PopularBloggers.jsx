import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import axios from 'axios';

const PopularBloggers = () => {
    const [popularBloggers, setPopularBloggers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchPopularBloggers = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get('https://localhost:7279/api/AdminDashboard/dashboard/pb', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if (!response.data) {
                    throw new Error('Failed to fetch popular bloggers');
                }
                setPopularBloggers(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching popular bloggers:', error);
            }
        };

        fetchPopularBloggers();
    }, []);

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <Navbar />
            <div className="container my-4">
                <h2 style={{ fontSize: '30px', textAlign: 'center', marginTop:'100px' }}>Top 10 Popular Bloggers</h2>
                {popularBloggers.length > 0 ? (
                    popularBloggers.map(blogger => (
                        <div key={blogger.id} className="card mb-4" style={{ width: '400px' }}>
                            <div className="card-body">
                                <h3 className="card-title">{blogger.username}</h3>
                                <p className="card-subtitle text-muted">Email: {blogger.email}</p>
                                <p className="card-text">Username: {blogger.userName}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div>No popular bloggers found.</div>
                )}
            </div>
        </>
    );
};

export default PopularBloggers;
