import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const UpdateBlogPage = () => {
  const { id } = useParams(); // Get the blog ID from the URL params
  const [blog, setBlog] = useState({
    id: '',
    title: '',
    content: '',
    imageUrl: '',
    image: null // New state for image file
  });

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('JWT token not found');
        }
    
        const response = await axios.get(`https://localhost:7279/api/Blog/blog/update`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const blogData = response.data;
        // Update the state with the fetched blog data
        setBlog({
          id: blogData.id,
          title: blogData.title,
          content: blogData.content,
          imageUrl: blogData.imageUrl,
          image: null // Initialize image to null
        });
      } catch (error) {
        console.error('Error fetching blog:', error);
      }
    };

    fetchBlog();
  }, [id]); // Dependency array includes id to refetch data when id changes

  const handleInputChange = (e) => {
    setBlog({ ...blog, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setBlog({ ...blog, image: e.target.files[0] }); // Update image state with the selected file
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('JWT token not found');
      }

      // Upload the image if it exists
      let imageUrl = blog.imageUrl; // Default imageUrl

      if (blog.image) {
        const imageData = new FormData();
        imageData.append('image', blog.image);

        const imageResponse = await axios.post('https://localhost:7279/api/Blog/upload-image', imageData, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });

        if (!imageResponse.ok) {
          throw new Error('Failed to upload image');
        }

        imageUrl = imageResponse.data.imageUrl;
      }

      // Update the blog with the new data
      const updatedBlog = { ...blog, imageUrl }; // Update imageUrl in the blog object
      await axios.put(`https://localhost:7279/api/Blog/blog/update?postId=${id}`, updatedBlog, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      toast.success('Blog updated successfully');
      // Optionally, you can redirect the user to another page after successful update
    } catch (error) {
      console.error('Error updating blog:', error);
      // Handle error
    }
  };

  return (
    <div className="container mt-5">
      <h2>Update Blog</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Title:</label>
          <input type="text" className="form-control" name="title" value={blog.title} onChange={handleInputChange} />
        </div>
        <div className="form-group">
          <label>Content:</label>
          <textarea className="form-control" name="content" value={blog.content} onChange={handleInputChange} />
        </div>
        <div className="form-group">
          <label>Image URL:</label>
          <input type="text" className="form-control" name="imageUrl" value={blog.imageUrl} onChange={handleInputChange} />
        </div>
        <div className="form-group">
          <label>Upload Image:</label>
          <input type="file" className="form-control-file" accept="image/*" onChange={handleImageChange} />
        </div>
        <button type="submit" className="btn btn-primary">Update</button>
      </form>
      <ToastContainer />
    </div>
  );
};

export default UpdateBlogPage;
