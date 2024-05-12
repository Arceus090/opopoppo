import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import axios from 'axios';

const PopularPostsPerMonth = () => {
    const [popularPosts, setPopularPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMonth, setSelectedMonth] = useState(1); // Default to January

    useEffect(() => {
        const fetchPopularPostsByMonth = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`https://localhost:7279/api/AdminDashboard/dashboard/ppmonth?month=${selectedMonth}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if (!response.data) {
                    throw new Error('Failed to fetch popular posts for the selected month');
                }
                setPopularPosts(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching popular posts for the selected month:', error);
            }
        };

        fetchPopularPostsByMonth();
    }, [selectedMonth]);

    const handleMonthChange = (e) => {
        setSelectedMonth(parseInt(e.target.value));
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    return (
        <>
            <Navbar />
            <div className="container my-4">
                <h2 style={{ fontSize: '30px', textAlign: 'center', marginTop:'100px' }}>Top 10 Popular Posts for Selected Month</h2>
                <div className="form-group">
                    <label htmlFor="monthSelect">Select Month:</label>
                    <select id="monthSelect" className="form-control" value={selectedMonth} onChange={handleMonthChange}>
                        <option value={1}>January</option>
                        <option value={2}>February</option>
                        <option value={3}>March</option>
                        <option value={4}>April</option>
                        <option value={5}>May</option>
                        <option value={6}>June</option>
                        <option value={7}>July</option>
                        <option value={8}>August</option>
                        <option value={9}>September</option>
                        <option value={10}>October</option>
                        <option value={11}>November</option>
                        <option value={12}>December</option>
                    </select>
                </div>
                {popularPosts.length > 0 ? (
                    popularPosts.map(post => (
                        <div key={post.blogId} className="card mb-4 row mt-5" style={{ width: '400px', height: '600px' }}>
                            <div className="card-body">
                                <h3 className="card-title">{post.title}</h3>
                                <p className="card-subtitle text-muted">Posted by {post.username}</p>
                                <p className="card-text">{post.content}</p>
                                <div style={{ width: '300px', height: '400px' }}>
                                    {post.imageUrl && <img src={post.imageUrl} alt={post.title} className="card-img-top img-fluid" />}
                                </div>
                                <div className="mt-3">
                                    <p>Upvotes: {post.upvoteCount}</p>
                                    <p>Comments: {post.totalCommentCount}</p>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div>No popular posts found for the selected month.</div>
                )}
            </div>
        </>
    );
};

export default PopularPostsPerMonth;
