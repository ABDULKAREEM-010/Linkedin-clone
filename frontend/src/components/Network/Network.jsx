import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { IoCheckmarkCircle, IoWarning } from 'react-icons/io5';
import { MdLocationOn } from 'react-icons/md';
import { BsThreeDots } from 'react-icons/bs';
import { IoMdPersonAdd, IoMdCheckmark } from 'react-icons/io';
import { HiUserGroup, HiOutlineMail, HiOutlineSearch } from 'react-icons/hi';
import './Network.css';

function Network() {
  const [connections, setConnections] = useState([]);
  const [requests, setRequests] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('connections');
  const [notification, setNotification] = useState(null);
  const [pendingSent, setPendingSent] = useState([]);

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type });
    setTimeout(() => setNotification(null), 3000);
  };

  useEffect(() => {
    fetchNetworkData();
  }, []);

  const fetchNetworkData = async () => {
    try {
      const token = localStorage.getItem('token');
      
      const [connectionsRes, requestsRes, suggestionsRes] = await Promise.all([
        axios.get('/api/connections', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('/api/connections/requests', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('/api/users', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);

      setConnections(connectionsRes.data);
      setRequests(requestsRes.data);
      setSuggestions(suggestionsRes.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching network data:', error);
      setLoading(false);
    }
  };

  const sendConnectionRequest = async (userId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/connections/request', 
        { recipientId: userId },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setPendingSent([...pendingSent, userId]);
      showNotification('Connection request sent successfully!');
    } catch (error) {
      console.error('Error sending request:', error);
      showNotification(error.response?.data?.message || 'Failed to send request', 'error');
    }
  };

  const acceptRequest = async (requestId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/connections/${requestId}/accept`, {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      await fetchNetworkData();
      showNotification('Connection accepted! You are now connected.');
    } catch (error) {
      console.error('Error accepting request:', error);
      showNotification('Failed to accept connection request', 'error');
    }
  };

  const rejectRequest = async (requestId) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`/api/connections/${requestId}/reject`, {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setRequests(requests.filter(req => req._id !== requestId));
      showNotification('Connection request ignored');
    } catch (error) {
      console.error('Error rejecting request:', error);
      showNotification('Failed to reject request', 'error');
    }
  };

  const removeConnection = async (userId, userName) => {
    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/connections/${userId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      
      setConnections(connections.filter(conn => conn._id !== userId));
      showNotification(`You are no longer connected with ${userName}`);
    } catch (error) {
      console.error('Error removing connection:', error);
      showNotification('Failed to remove connection', 'error');
    }
  };

  if (loading) {
    return <div className="loading">Loading network...</div>;
  }

  return (
    <div className="network">
      {notification && (
        <div className={`notification ${notification.type}`}>
          <span className="notification-icon">
            {notification.type === 'success' ? <IoCheckmarkCircle /> : <IoWarning />}
          </span>
          {notification.message}
        </div>
      )}
      
      <div className="network-container">
        <div className="network-header">
          <h2>My Network</h2>
          <p className="network-subtitle">Manage your professional network</p>
        </div>

        <div className="network-stats">
          <div className="stat-card">
            <div className="stat-number">{connections.length}</div>
            <div className="stat-label">Connections</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{requests.length}</div>
            <div className="stat-label">Pending Requests</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{suggestions.length}</div>
            <div className="stat-label">Suggestions</div>
          </div>
        </div>

        <div className="network-tabs">
          <button
            className={activeTab === 'connections' ? 'active' : ''}
            onClick={() => setActiveTab('connections')}
          >
            Connections ({connections.length})
          </button>
          <button
            className={activeTab === 'requests' ? 'active' : ''}
            onClick={() => setActiveTab('requests')}
          >
            Requests ({requests.length})
          </button>
          <button
            className={activeTab === 'suggestions' ? 'active' : ''}
            onClick={() => setActiveTab('suggestions')}
          >
            Suggestions
          </button>
        </div>

        <div className="network-content">
          {activeTab === 'connections' && (
            <div className="connections-list">
              {connections.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon"><HiUserGroup /></div>
                  <h3>No connections yet</h3>
                  <p>Start connecting with people to grow your network!</p>
                  <button 
                    onClick={() => setActiveTab('suggestions')} 
                    className="btn-primary"
                  >
                    Find connections
                  </button>
                </div>
              ) : (
                connections.map(user => (
                  <div key={user._id} className="network-card">
                    <Link to={`/profile/${user._id}`} className="network-card-link">
                      <div className="network-avatar">
                        {user.profilePicture ? (
                          <img src={user.profilePicture} alt={user.firstName} />
                        ) : (
                          <span>{user.firstName[0]}{user.lastName[0]}</span>
                        )}
                      </div>
                      <div className="network-info">
                        <h4>{user.firstName} {user.lastName}</h4>
                        <p>{user.headline || 'LinkedIn Member'}</p>
                        {user.location && <span className="location"><MdLocationOn /> {user.location}</span>}
                        <span className="connection-badge">Connected</span>
                      </div>
                    </Link>
                    <div className="network-actions">
                      <button className="btn-message">Message</button>
                      <button 
                        onClick={() => removeConnection(user._id, `${user.firstName} ${user.lastName}`)}
                        className="btn-more"
                        title="More options"
                      >
                        <BsThreeDots />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {activeTab === 'requests' && (
            <div className="requests-list">
              {requests.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon"><HiOutlineMail /></div>
                  <h3>No pending requests</h3>
                  <p>When someone sends you a connection request, it will appear here.</p>
                </div>
              ) : (
                <>
                  <div className="requests-header">
                    <h3>Pending Requests ({requests.length})</h3>
                  </div>
                  {requests.map(request => (
                    <div key={request._id} className="network-card request-card">
                      <Link to={`/profile/${request.requester._id}`} className="network-card-link">
                        <div className="network-avatar">
                          {request.requester.profilePicture ? (
                            <img src={request.requester.profilePicture} alt={request.requester.firstName} />
                          ) : (
                            <span>{request.requester.firstName[0]}{request.requester.lastName[0]}</span>
                          )}
                        </div>
                        <div className="network-info">
                          <h4>{request.requester.firstName} {request.requester.lastName}</h4>
                          <p>{request.requester.headline || 'LinkedIn Member'}</p>
                          <span className="request-time">Wants to connect</span>
                        </div>
                      </Link>
                      <div className="request-actions">
                        <button 
                          onClick={() => rejectRequest(request._id)}
                          className="btn-secondary"
                        >
                          Ignore
                        </button>
                        <button 
                          onClick={() => acceptRequest(request._id)}
                          className="btn-primary"
                        >
                          Accept
                        </button>
                      </div>
                    </div>
                  ))}
                </>
              )}
            </div>
          )}

          {activeTab === 'suggestions' && (
            <div className="suggestions-list">
              {suggestions.length === 0 ? (
                <div className="empty-state">
                  <div className="empty-icon"><HiOutlineSearch /></div>
                  <h3>No suggestions available</h3>
                  <p>Check back later for new connection suggestions.</p>
                </div>
              ) : (
                <>
                  <div className="suggestions-header">
                    <h3>People you may know</h3>
                    <p>Based on your profile and connections</p>
                  </div>
                  <div className="suggestions-grid">
                    {suggestions.map(user => (
                      <div key={user._id} className="suggestion-card">
                        <Link to={`/profile/${user._id}`} className="suggestion-link">
                          <div className="suggestion-avatar">
                            {user.profilePicture ? (
                              <img src={user.profilePicture} alt={user.firstName} />
                            ) : (
                              <span>{user.firstName[0]}{user.lastName[0]}</span>
                            )}
                          </div>
                          <div className="suggestion-info">
                            <h4>{user.firstName} {user.lastName}</h4>
                            <p className="suggestion-headline">{user.headline || 'LinkedIn Member'}</p>
                            {user.location && (
                              <p className="suggestion-location"><MdLocationOn /> {user.location}</p>
                            )}
                          </div>
                        </Link>
                        <button 
                          onClick={() => sendConnectionRequest(user._id)}
                          className={`btn-connect ${pendingSent.includes(user._id) ? 'pending' : ''}`}
                          disabled={pendingSent.includes(user._id)}
                        >
                          {pendingSent.includes(user._id) ? (
                            <><IoMdCheckmark /> Pending</>
                          ) : (
                            <><IoMdPersonAdd /> Connect</>
                          )}
                        </button>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default Network;
