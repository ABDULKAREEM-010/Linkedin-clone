// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL;

export const API_URL = API_BASE_URL;

export const ENDPOINTS = {
  AUTH: {
    LOGIN: `${API_BASE_URL}/api/auth/login`,
    REGISTER: `${API_BASE_URL}/api/auth/register`,
  },
  USERS: {
    ME: `${API_BASE_URL}/api/users/me`,
    BY_ID: (id) => `${API_BASE_URL}/api/users/${id}`,
    PROFILE: `${API_BASE_URL}/api/users/profile`,
    SEARCH: (query) => `${API_BASE_URL}/api/users/search/${query}`,
    ALL: `${API_BASE_URL}/api/users`,
  },
  POSTS: {
    ALL: `${API_BASE_URL}/api/posts`,
    BY_ID: (id) => `${API_BASE_URL}/api/posts/${id}`,
    BY_USER: (userId) => `${API_BASE_URL}/api/posts/user/${userId}`,
    LIKE: (id) => `${API_BASE_URL}/api/posts/${id}/like`,
    COMMENT: (id) => `${API_BASE_URL}/api/posts/${id}/comment`,
  },
  CONNECTIONS: {
    ALL: `${API_BASE_URL}/api/connections`,
    REQUEST: `${API_BASE_URL}/api/connections/request`,
    REQUESTS: `${API_BASE_URL}/api/connections/requests`,
    ACCEPT: (id) => `${API_BASE_URL}/api/connections/${id}/accept`,
    REJECT: (id) => `${API_BASE_URL}/api/connections/${id}/reject`,
    REMOVE: (userId) => `${API_BASE_URL}/api/connections/${userId}`,
  }
};
