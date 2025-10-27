import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Post from '../Post/Post.jsx';
import './Profile.css';

function Profile() {
  const { id } = useParams();
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({});
  const currentUser = JSON.parse(localStorage.getItem('user'));
  const isOwnProfile = currentUser?.id === id;

  useEffect(() => {
    fetchUserProfile();
    fetchUserPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchUserProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const endpoint = isOwnProfile ? '/api/users/me' : `/api/users/${id}`;
      const response = await axios.get(endpoint, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      // Ensure user data has proper structure
      const userData = response.data;
      if (userData && !userData.connections) {
        userData.connections = [];
      }
      
      setUser(userData);
      setFormData({
        headline: userData.headline || '',
        location: userData.location || '',
        about: userData.about || ''
      });
      setLoading(false);
    } catch (error) {
      console.error('Error fetching profile:', error);
      setLoading(false);
    }
  };

  const fetchUserPosts = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/posts/user/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPosts(response.data);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        '/api/users/profile',
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUser(response.data);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Failed to update profile');
    }
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
    return <div className="loading">Loading profile...</div>;
  }

  if (!user) {
    return <div className="error">User not found</div>;
  }

  return (
    <div className="profile">
      <div className="profile-container">
        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-avatar-large">
              {user.profilePicture ? (
                <img src={user.profilePicture} alt={user.firstName} />
              ) : (
                <span>{user.firstName?.[0]}{user.lastName?.[0]}</span>
              )}
            </div>
            <h2>{user.firstName} {user.lastName}</h2>
            
            {!isEditing ? (
              <>
                <p className="profile-headline">{user.headline || 'Add a headline'}</p>
                <p className="profile-location">{user.location || 'Add location'}</p>
                {isOwnProfile && (
                  <button onClick={() => setIsEditing(true)} className="edit-profile-btn">
                    Edit Profile
                  </button>
                )}
              </>
            ) : (
              <form onSubmit={handleUpdate} className="profile-edit-form">
                <input
                  type="text"
                  placeholder="Headline"
                  value={formData.headline}
                  onChange={(e) => setFormData({...formData, headline: e.target.value})}
                />
                <input
                  type="text"
                  placeholder="Location"
                  value={formData.location}
                  onChange={(e) => setFormData({...formData, location: e.target.value})}
                />
                <textarea
                  placeholder="About"
                  value={formData.about}
                  onChange={(e) => setFormData({...formData, about: e.target.value})}
                  rows="4"
                />
                <div className="form-actions">
                  <button type="submit">Save</button>
                  <button type="button" onClick={() => setIsEditing(false)}>Cancel</button>
                </div>
              </form>
            )}
          </div>

          {user.about && (
            <div className="profile-section">
              <h3>About</h3>
              <p>{user.about}</p>
            </div>
          )}

          {user.connections && Array.isArray(user.connections) && user.connections.length > 0 && (
            <div className="profile-section">
              <h3>Connections ({user.connections.length})</h3>
              <div className="connections-preview">
                {user.connections.slice(0, 5).map(connection => (
                  <div key={connection._id} className="connection-item">
                    <div className="connection-avatar">
                      {connection.profilePicture ? (
                        <img src={connection.profilePicture} alt={connection.firstName} />
                      ) : (
                        <span>{connection.firstName?.[0]}{connection.lastName?.[0]}</span>
                      )}
                    </div>
                    <span>{connection.firstName} {connection.lastName}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div className="profile-posts">
          <h3>Activity</h3>
          {posts.length === 0 ? (
            <div className="no-posts">
              <p>No posts yet</p>
            </div>
          ) : (
            posts.map(post => (
              <Post
                key={post._id}
                post={post}
                onPostUpdate={handlePostUpdate}
                onPostDelete={handlePostDelete}
                showNotification={() => {}}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Profile;
