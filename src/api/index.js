import axios from 'axios'

const API_URL = 'https://finance-management-app-backend-lczn.onrender.com';

const api = axios.create({
    baseURL: API_URL,
})


// Sign Up API call
export const signUp = async (userData) => {
    try {
        const response = await api.post('/auth/signup', userData);
        return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.detail || "Sign Up failed");
    }
};

// Verify OTP API call
export const verifyOtp = async ({ tempUserId, otp }) => {
  try {
    const response = await api.post('/auth/verify-otp', { temp_user_id: tempUserId, otp });
    return response.data;
  } catch (error) {
      throw new Error(error.response?.data?.detail || "OTP Verification failed");
  }
};

// Sign In API call
export const signIn = async (credentials) => {
    try {
      const response = await api.post('/auth/login', credentials);
      return response.data;
    } catch (error) {
        throw new Error(error.response?.data?.detail || "Sign In failed");
    }
};


// Get Transactions API call
  export const getTransactions = async () => {
    try {
      const response = await api.get('/transactions/', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      return response.data; 
    } catch (error) {
      console.error('Failed to fetch transactions', error);
      throw error;
    }
  };

// Get Transaction by ID API call
  export const getTransactionById = async (transactionId) => {
    try {
      const response = await axios.get(`/transactions/${transactionId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching transaction:', error);
      throw error;
    }
  };

// Create Transaction API call
  export const createTransaction = async (transactionData) => {
    try {
      const response = await api.post('/transactions', transactionData, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`, 
          
        },
      });
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to create transaction');
    }
  };

// Update Transaction API call 
  export const updateTransaction = async (transactionId, transactionData) => {
    try {
      const response = await api.put(`/transactions/${transactionId}`, transactionData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to update transaction');
    }
  };

// Delete Transaction API call
  export const deleteTransaction = async (transactionId) => {
    try {
      const response = await api.delete(`/transactions/${transactionId}`);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.detail || 'Failed to delete transaction');
    }
  };

// Update User API call
  export const updateUser = async (userId, userData) => {
    try {
      const response = await api.put(`/users/${userId}`, userData);
      return response.data; 
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  };
  

// Delete User API call
  export const deleteUser = async (userId) => {
    try {
      const response = await api.delete(`/users/${userId}`);
      return response.data; 
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  };

// Update User Role API call
  export const updateUserRole = async (userId, role) => {
    try {
      const response = await api.put(`/users/${userId}/role`, {role});
      return response.data;
    } catch (error) {
      console.error('Error updating user role:', error);
      throw error;
    }
  };

// Get All Users API call
  export const getAllUsers = async () => {
    try {
      const response = await api.get('/users');
      return response.data; 
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  };

// Get User with Transactions API call
  export const getUserWithTransactions = async (userId) => {
    try {
      const response = await api.get(`/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching transaction:', error);
      throw error;
    }
  };

  export default api;