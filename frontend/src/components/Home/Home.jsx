import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { IoMdRefresh } from 'react-icons/io';
import { IoCheckmarkCircle, IoWarning } from 'react-icons/io5';
import PostCreator from '../Post/PostCreator.jsx';
import Post from '../Post/Post.jsx';
import './Home.css';

function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notification, setNotification] = useState(null);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      console.log('Fetching posts with token:', !!token);
      
      const response = await axios.get('/api/posts', {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      console.log('Fetched posts:', response.data);
      // Handle both array and object responses
      const postsData = Array.isArray(response.data) ? response.data : (response.data.posts || []);
      console.log('Posts array:', postsData.length);
      setPosts(postsData);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching posts:', error);
      console.error('Error response:', error.response?.data);
      setLoading(false);
      showNotification('Failed to load posts', 'error');
    }
  };

  const handlePostCreated = (newPost) => {
    console.log('New post created, adding to feed:', newPost);
    setPosts([newPost, ...posts]);
    showNotification('Post created successfully!', 'success');
  };

  const handlePostUpdate = (updatedPost) => {
    setPosts(posts.map(post => 
      post._id === updatedPost._id ? updatedPost : post
    ));
  };

  const handlePostDelete = (postId) => {
    setPosts(posts.filter(post => post._id !== postId));
  };

  if (loading) {
    return <div className="loading">Loading feed...</div>;
  }

  return (
    <div className="home">
      {notification && (
        <div className={`notification ${notification.type}`}>
          <span className="notification-icon">
            {notification.type === 'success' ? <IoCheckmarkCircle /> : <IoWarning />}
          </span>
          {notification.message}
        </div>
      )}
      
      <div className="home-container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
          <h2 style={{ margin: 0 }}>Feed</h2>
          <button 
            onClick={fetchPosts} 
            style={{
              padding: '8px 16px',
              backgroundColor: '#0a66c2',
              color: 'white',
              border: 'none',
              borderRadius: '20px',
              cursor: 'pointer',
              fontWeight: '600',
              display: 'flex',
              alignItems: 'center',
              gap: '6px'
            }}
          >
            <IoMdRefresh size={18} /> Refresh
          </button>
        </div>
        
        <PostCreator onPostCreated={handlePostCreated} showNotification={showNotification} />
        
        <div className="posts-list">
          {posts.length === 0 ? (
            <div className="no-posts">
              <p>No posts yet. Be the first to share something!</p>
            </div>
          ) : (
            posts.map(post => (
              <Post 
                key={post._id} 
                post={post}
                onPostUpdate={handlePostUpdate}
                onPostDelete={handlePostDelete}
                showNotification={showNotification}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;