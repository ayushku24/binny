import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import * as SecureStore from 'expo-secure-store';
import { AuthState } from '../types';

const TOKEN_KEY = 'auth_token';

const initialState: AuthState = {
  token: null,
  isAuthenticated: false,
};

// Load token from secure storage
export const loadTokenFromStorage = createAsyncThunk(
  'auth/loadToken',
  async () => {
    try {
      const token = await SecureStore.getItemAsync(TOKEN_KEY);
      return token;
    } catch (error) {
      console.error('Failed to load token from secure storage:', error);
      return null;
    }
  }
);

// Save token to secure storage
export const saveTokenToStorage = createAsyncThunk(
  'auth/saveToken',
  async (token: string) => {
    try {
      await SecureStore.setItemAsync(TOKEN_KEY, token);
      return token;
    } catch (error) {
      console.error('Failed to save token to secure storage:', error);
      throw error;
    }
  }
);

// Remove token from secure storage
export const removeTokenFromStorage = createAsyncThunk(
  'auth/removeToken',
  async () => {
    try {
      await SecureStore.deleteItemAsync(TOKEN_KEY);
      return null;
    } catch (error) {
      console.error('Failed to remove token from secure storage:', error);
      throw error;
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // For demo purposes - generate a dummy token
    generateDummyToken: (state) => {
      const dummyToken = `dummy_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      state.token = dummyToken;
      state.isAuthenticated = true;
    },
    
    logout: (state) => {
      state.token = null;
      state.isAuthenticated = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Load token
      .addCase(loadTokenFromStorage.fulfilled, (state, action) => {
        if (action.payload) {
          state.token = action.payload;
          state.isAuthenticated = true;
        }
      })
      
      // Save token
      .addCase(saveTokenToStorage.fulfilled, (state, action) => {
        state.token = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(saveTokenToStorage.rejected, (state) => {
        state.token = null;
        state.isAuthenticated = false;
      })
      
      // Remove token
      .addCase(removeTokenFromStorage.fulfilled, (state) => {
        state.token = null;
        state.isAuthenticated = false;
      });
  },
});

export const { generateDummyToken, logout } = authSlice.actions;
export default authSlice.reducer;
