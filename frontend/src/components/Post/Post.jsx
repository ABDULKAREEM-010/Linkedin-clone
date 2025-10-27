import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from '../../config/axios';
import { AiOutlineLike, AiFillLike } from 'react-icons/ai';
import { FaRegComment } from 'react-icons/fa';
import { BsThreeDots } from 'react-icons/bs';
import { MdEdit, MdDelete } from 'react-icons/md';
// import { IoCheckmarkCircle, IoWarning } from 'react-icons/io5';
import './Post.css';

function Post({ post, onPostUpdate, onPostDelete, showNotification }) {
  const [commentText, setCommentText] = useState('');
  const [showComments, setShowComments] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(post.content);
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [likeAnimation, setLikeAnimation] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem('user'));

  const handleLike = async () => {
    try {
      const token = localStorage.getItem('token');
      const wasLiked = isLiked;
      
      // Trigger animation
      setLikeAnimation(true);
      setTimeout(() => setLikeAnimation(false), 600);
      
      const response = await axios.put(
        `/api/posts/${post._id}/like`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onPostUpdate(response.data);
      
      // Show notification
      if (showNotification) {
        showNotification(wasLiked ? 'Removed like' : 'Post liked!', 'success');
      }
    } catch (error) {
      console.error('Error liking post:', error);
      if (showNotification) {
        showNotification('Failed to like post', 'error');
      }
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    
    if (!commentText.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const response = await axios.post(
        `/api/posts/${post._id}/comment`,
        { text: commentText },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onPostUpdate(response.data);
      setCommentText('');
      setShowComments(true);
      
      // Show notification
      if (showNotification) {
        showNotification('Comment added!', 'success');
      }
    } catch (error) {
      console.error('Error commenting:', error);
      if (showNotification) {
        showNotification('Failed to add comment', 'error');
      }
    }
  };

  const handleDelete = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/posts/${post._id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      onPostDelete(post._id);
      setShowDeleteModal(false);
      
      // Show notification
      if (showNotification) {
        showNotification('Post deleted successfully', 'success');
      }
    } catch (error) {
      console.error('Error deleting post:', error);
      if (showNotification) {
        showNotification('Failed to delete post', 'error');
      }
    }
  };

  const handleEdit = async () => {
    if (!editedContent.trim()) return;

    try {
      const token = localStorage.getItem('token');
      const response = await axios.put(
        `/api/posts/${post._id}`,
        { content: editedContent },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      onPostUpdate(response.data);
      setIsEditing(false);
      setShowMenu(false);
      
      // Show notification
      if (showNotification) {
        showNotification('Post updated successfully', 'success');
      }
    } catch (error) {
      console.error('Error editing post:', error);
      if (showNotification) {
        showNotification('Failed to edit post', 'error');
      }
    }
  };

  const handleCancelEdit = () => {
    setEditedContent(post.content);
    setIsEditing(false);
  };

  const handleEditClick = () => {
    setIsEditing(true);
    setShowMenu(false);
  };

  const handleDeleteClick = () => {
    setShowDeleteModal(true);
    setShowMenu(false);
  };

  const isLiked = post.likes.includes(currentUser.id);
  const isAuthor = post.author._id === currentUser.id;

  const formatDate = (date) => {
    const now = new Date();
    const postDate = new Date(date);
    const diffMs = now - postDate;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return postDate.toLocaleDateString();
  };

  return (
    <div className="post">
      <div className="post-header">
        <Link to={`/profile/${post.author._id}`} className="post-author">
          <div className="post-avatar">
            {post.author.profilePicture ? (
              <img src={post.author.profilePicture} alt={post.author.firstName} />
            ) : (
              <span>{post.author.firstName[0]}{post.author.lastName[0]}</span>
            )}
          </div>
          <div className="post-author-info">
            <h4>{post.author.firstName} {post.author.lastName}</h4>
            <p>{post.author.headline || 'LinkedIn Member'}</p>
            <span className="post-time">{formatDate(post.createdAt)}</span>
          </div>
        </Link>
        {isAuthor && (
          <div className="post-menu-wrapper">
            <button 
              onClick={() => setShowMenu(!showMenu)} 
              className="post-menu-btn"
              title="More options"
            >
              <BsThreeDots />
            </button>
            {showMenu && (
              <>
                <div className="menu-backdrop" onClick={() => setShowMenu(false)}></div>
                <div className="post-menu-dropdown">
                  <button onClick={handleEditClick} className="menu-item">
                    <span className="menu-icon"><MdEdit /></span>
                    <span>Edit post</span>
                  </button>
                  <button onClick={handleDeleteClick} className="menu-item delete-item">
                    <span className="menu-icon"><MdDelete /></span>
                    <span>Delete post</span>
                  </button>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {showDeleteModal && (
        <>
          <div className="modal-backdrop" onClick={() => setShowDeleteModal(false)}></div>
          <div className="delete-modal">
            <h3>Delete post?</h3>
            <p>Are you sure you want to delete this post? This action cannot be undone.</p>
            <div className="modal-actions">
              <button onClick={() => setShowDeleteModal(false)} className="modal-btn cancel-btn">
                Cancel
              </button>
              <button onClick={handleDelete} className="modal-btn delete-btn">
                Delete
              </button>
            </div>
          </div>
        </>
      )}

      <div className="post-content">
        {isEditing ? (
          <div className="edit-post-form">
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              rows="3"
            />
            <div className="edit-actions">
              <button onClick={handleEdit} className="save-btn">Save</button>
              <button onClick={handleCancelEdit} className="cancel-btn">Cancel</button>
            </div>
          </div>
        ) : (
          <p>{post.content}</p>
        )}
        {post.image && (
          <img src={post.image} alt="Post content" className="post-image" />
        )}
      </div>

      <div className="post-stats">
        <span>{post.likes.length} {post.likes.length === 1 ? 'like' : 'likes'}</span>
        <span>{post.comments.length} {post.comments.length === 1 ? 'comment' : 'comments'}</span>
      </div>

      <div className="post-actions">
        <button 
          onClick={handleLike} 
          className={`post-action-btn ${isLiked ? 'liked' : ''} ${likeAnimation ? 'like-animation' : ''}`}
        >
          {isLiked ? <AiFillLike className="like-icon" /> : <AiOutlineLike className="like-icon" />} Like
        </button>
        <button 
          onClick={() => setShowComments(!showComments)} 
          className="post-action-btn"
        >
          <FaRegComment /> Comment
        </button>
      </div>

      {showComments && (
        <div className="comments-section">
          <form onSubmit={handleComment} className="comment-form">
            <input
              type="text"
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Add a comment..."
            />
            <button type="submit" disabled={!commentText.trim()}>
              Post
            </button>
          </form>

          <div className="comments-list">
            {post.comments.map((comment, index) => (
              <div key={index} className="comment">
                <div className="comment-avatar">
                  {comment.user.profilePicture ? (
                    <img src={comment.user.profilePicture} alt={comment.user.firstName} />
                  ) : (
                    <span>{comment.user.firstName[0]}{comment.user.lastName[0]}</span>
                  )}
                </div>
                <div className="comment-content">
                  <div className="comment-header">
                    <strong>{comment.user.firstName} {comment.user.lastName}</strong>
                  </div>
                  <p>{comment.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default Post;
