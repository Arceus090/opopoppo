import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import axios from 'axios';

const PopularBloggersPerMonth = () => {
    const [popularBloggers, setPopularBloggers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedMonth, setSelectedMonth] = useState(1); // Default to January

    useEffect(() => {
        const fetchPopularBloggersByMonth = async () => {
            try {
                const token = localStorage.getItem('token');
                const response = await axios.get(`https://localhost:7279/api/AdminDashboard/dashboard/pbmonth?month=${selectedMonth}`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                if (!response.data) {
                    throw new Error('Failed to fetch popular bloggers for the selected month');
                }
                setPopularBloggers(response.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching popular bloggers for the selected month:', error);
            }
        };

        fetchPopularBloggersByMonth();
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
                <h2 style={{ fontSize: '30px', textAlign: 'center', marginTop:'100px' }}>Top 10 Popular Bloggers for Selected Month</h2>
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
                {popularBloggers.length > 0 ? (
                    popularBloggers.map(blogger => (
                        <div key={blogger.id} className="card mb-4 row mt-5" style={{ width: '400px' }}>
                            <div className="card-body">
                                <h3 className="card-title">{blogger.username}</h3>
                                <p className="card-subtitle text-muted">Email: {blogger.email}</p>
                                <p className="card-text">Username: {blogger.userName}</p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div>No popular bloggers found for the selected month.</div>
                )}
            </div>
        </>
    );
};

export default PopularBloggersPerMonth;
