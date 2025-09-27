/**
 * Centralized API Service for MediVerse Frontend
 * Handles all backend API communications with consistent error handling
 */

const BACKEND_BASE_URL = import.meta?.env?.VITE_BACKEND_URL || 'https://s64-gaurang-capstone-medisite-12.onrender.com';

class ApiService {
  constructor() {
    this.baseURL = BACKEND_BASE_URL;
  }

  /**
   * Get authorization headers with token
   */
  getAuthHeaders() {
    const token = localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` })
    };
  }

  /**
   * Generic API request handler
   */
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getAuthHeaders(),
      ...options
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error || error.message || 'Request failed');
      }
      
      return await response.json();
    } catch (error) {
      console.error('API request failed:', error);
      throw error;
    }
  }

  // Authentication endpoints
  async login(email, password) {
    return this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password })
    });
  }

  async register(userData) {
    return this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    });
  }

  // AI Health Assistant endpoints
  async getHealthAssistantResponse(message, conversationHistory = []) {
    return this.request('/api/gemini/health-assistant', {
      method: 'POST',
      body: JSON.stringify({ message, conversationHistory })
    });
  }

  async getHealthInformation(condition) {
    return this.request('/api/gemini/health-info', {
      method: 'POST',
      body: JSON.stringify({ condition })
    });
  }

  async getMedicineInformation(medicine) {
    return this.request('/api/gemini/medicine-info', {
      method: 'POST',
      body: JSON.stringify({ medicine })
    });
  }

  async testAIConnection() {
    return this.request('/api/gemini/test', {
      method: 'GET'
    });
  }

  // DeepSeek Chat endpoint
  async getChatResponse(message) {
    return this.request('/api/chat', {
      method: 'POST',
      body: JSON.stringify({ message })
    });
  }

  // User endpoints
  async getUserProfile() {
    return this.request('/api/users/profile', {
      method: 'GET'
    });
  }

  async updateUserProfile(userData) {
    return this.request('/api/users/profile', {
      method: 'PUT',
      body: JSON.stringify(userData)
    });
  }

  // Search history endpoints
  async getSearchHistory() {
    return this.request('/api/search-history', {
      method: 'GET'
    });
  }

  async addSearchHistory(searchData) {
    return this.request('/api/search-history', {
      method: 'POST',
      body: JSON.stringify(searchData)
    });
  }

  // Medicine endpoints
  async getMedicines() {
    return this.request('/api/medicines', {
      method: 'GET'
    });
  }

  async getMedicineById(id) {
    return this.request(`/api/medicines/${id}`, {
      method: 'GET'
    });
  }

  // Symptom endpoints
  async getSymptoms() {
    return this.request('/api/symptoms', {
      method: 'GET'
    });
  }

  async getSymptomById(id) {
    return this.request(`/api/symptoms/${id}`, {
      method: 'GET'
    });
  }

  // Disease endpoints
  async getDiseases() {
    return this.request('/api/diseases', {
      method: 'GET'
    });
  }

  async getDiseaseById(id) {
    return this.request(`/api/diseases/${id}`, {
      method: 'GET'
    });
  }
}

// Create and export a singleton instance
const apiService = new ApiService();
export default apiService;