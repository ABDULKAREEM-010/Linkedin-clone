import React, { useState } from 'react';
import axios from 'axios';
import { MdPhotoLibrary, MdClose } from 'react-icons/md';
import './Post.css';

function PostCreator({ onPostCreated, showNotification }) {
  const [content, setContent] = useState('');
  const [image, setImage] = useState('');
  const [imagePreview, setImagePreview] = useState('');
  const [loading, setLoading] = useState(false);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        e.target.value = null;
        return;
      }

      // Check file type
      if (!file.type.startsWith('image/')) {
        alert('Please select a valid image file');
        e.target.value = null;
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        setImage(reader.result);
        setImagePreview(reader.result);
      };
      reader.onerror = () => {
        alert('Failed to read image file');
      };
      reader.readAsDataURL(file);
    }
  };

  const removeImage = () => {
    setImage('');
    setImagePreview('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim()) return;

    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      console.log('Creating post...');
      console.log('Token exists:', !!token);
      console.log('Content length:', content.length);
      console.log('Has image:', !!image);
      
      const response = await axios.post('/api/posts', 
        { content, image },
        { 
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          maxContentLength: Infinity,
          maxBodyLength: Infinity
        }
      );
      
      console.log('Post created successfully:', response.data);
      onPostCreated(response.data);
      setContent('');
      setImage('');
      setImagePreview('');
    } catch (error) {
      console.error('Error creating post:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      if (error.response?.status === 413) {
        if (showNotification) {
          showNotification('Image is too large. Please choose a smaller image (under 5MB).', 'error');
        }
      } else {
        if (showNotification) {
          showNotification(error.response?.data?.message || 'Failed to create post. Please try again.', 'error');
        }
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="post-creator">
      <form onSubmit={handleSubmit}>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="What do you want to talk about?"
          rows="3"
          disabled={loading}
        />
        
        {imagePreview && (
          <div className="image-preview">
            <img src={imagePreview} alt="Preview" />
            <button type="button" onClick={removeImage} className="remove-image-btn">
              <MdClose />
            </button>
          </div>
        )}

        <div className="post-creator-footer">
          <label htmlFor="image-upload" className="image-upload-btn">
            <MdPhotoLibrary /> Photo
            <input
              type="file"
              id="image-upload"
              accept="image/*"
              onChange={handleImageChange}
              style={{ display: 'none' }}
              disabled={loading}
            />
          </label>
          <button type="submit" disabled={loading || !content.trim()}>
            {loading ? 'Posting...' : 'Post'}
          </button>
        </div>
      </form>
    </div>
  );
}

export default PostCreator;
