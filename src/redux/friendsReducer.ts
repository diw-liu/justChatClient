import { createSlice } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { FriendService } from '../service/FriendService';
import { Friends } from '../interface';

export const fetchFriends = createAsyncThunk(
  'friends/fetchFriends',
  async () => {
    return FriendService.fetchFriends()
  }
);

interface FriendState {
  friends: {[key: string]: Friends}
  requests: {[key: string]: Friends}
  status: string
  error: string
}

const initialState: FriendState = {
  friends: {},
  requests: {},
  status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
  error: null,
};

export const friendSlice = createSlice({
  name: 'friends',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchFriends.pending, (state, action) => {
        state.status = 'loading';
      })
      .addCase(fetchFriends.fulfilled, (state, action) => {
        state.status = 'succeeded';
        action.payload.forEach(friend => {
          if(friend.Status != "FRIENDS") state.friends[friend.FriendId as string] = friend;
          else state.requests[friend.FriendId as string] = friend;
        });
      })
      .addCase(fetchFriends.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
  reducers: {
    
  },
})

export default friendSlice.reducer;