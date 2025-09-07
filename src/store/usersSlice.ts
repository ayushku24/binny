import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { User, UsersState } from '../types';

const USERS_STORAGE_KEY = '@users_cache';
const CACHE_EXPIRY_TIME = 5 * 60 * 1000; // 5 minutes

const initialState: UsersState = {
  users: [],
  loading: false,
  error: null,
  lastFetch: null,
};

// Check if cached data is still valid
function isCacheValid(lastFetch: number | null): boolean {
  if (!lastFetch) return false;
  return Date.now() - lastFetch < CACHE_EXPIRY_TIME;
}

// Load users from cache
export const loadUsersFromCache = createAsyncThunk(
  'users/loadFromCache',
  async () => {
    const cached = await AsyncStorage.getItem(USERS_STORAGE_KEY);
    if (cached) {
      const { users, lastFetch } = JSON.parse(cached);
      return { users, lastFetch };
    }
    return { users: [], lastFetch: null };
  }
);

// Fetch users from API with offline support
export const fetchUsers = createAsyncThunk(
  'users/fetchUsers',
  async (_, { getState, rejectWithValue }) => {
    try {
      // Check network connectivity
      const netInfo = await NetInfo.fetch();
      
      const state = getState() as { users: UsersState };
      const { lastFetch, users: cachedUsers } = state.users;
      
      // If offline, return cached data
      if (!netInfo.isConnected) {
        if (cachedUsers.length > 0) {
          return { users: cachedUsers, fromCache: true };
        }
        throw new Error('No internet connection and no cached data available');
      }
      
      // If cache is still valid, return cached data
      if (isCacheValid(lastFetch) && cachedUsers.length > 0) {
        return { users: cachedUsers, fromCache: true };
      }
      
      // Fetch from API
      const response = await fetch('https://jsonplaceholder.typicode.com/users');
      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }
      
      const users: User[] = await response.json();
      const now = Date.now();
      
      // Cache the data
      await AsyncStorage.setItem(USERS_STORAGE_KEY, JSON.stringify({
        users,
        lastFetch: now,
      }));
      
      return { users, fromCache: false };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Load from cache
      .addCase(loadUsersFromCache.fulfilled, (state, action) => {
        state.users = action.payload.users;
        state.lastFetch = action.payload.lastFetch;
      })
      
      // Fetch users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users;
        if (!action.payload.fromCache) {
          state.lastFetch = Date.now();
        }
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = usersSlice.actions;
export default usersSlice.reducer;
