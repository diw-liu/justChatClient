import { createSlice, isFulfilled, PayloadAction } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { FriendService } from '../service/FriendService';
import { Friend } from '../interface';

export const fetchFriends = createAsyncThunk(
  'friends/fetchFriends',
  async () => {
    return await FriendService.fetchFriends()
  }
);

export const subscribeRequest = createAsyncThunk(
  'friends/subscribeRequest',
  async (userId: string) => {
    return await FriendService.subscribeRequest(userId)
  }
)

interface FriendState {
  friends: {[key: string]: Friend}
  requests: {[key: string]: Friend}
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
        console.log("isFulfilled")
        action.payload.forEach(friend => {
          if(friend.Status == "FRIENDS") state.friends[friend.FriendId] = friend;
          else state.requests[friend.FriendId] = friend;
        });
        console.log(state.friends)
      })
      .addCase(fetchFriends.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addCase(subscribeRequest.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(subscribeRequest.fulfilled, (state, action) => {
        state.status = 'succeeded';
        console.log(action)
      })
      .addCase(subscribeRequest.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
  reducers: {
    setLoading: (state) => {
      state.status = 'loading'
    },
    setIdle: (state) => {
      state.status = 'idle'
    },
    addRequest: (state, action: PayloadAction<Friend>) => {
      const friend = action.payload;
      state.requests[friend.FriendId] = friend;
    },
    addFriend: (state, action: PayloadAction<Friend>) => {
      const friend = action.payload;
      state.friends[friend.FriendId] = friend;
    },
    removeRequest: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      delete state.requests[id];
    },
    removeFriend: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      delete state.friends[id];
    },
  },
})

export default friendSlice.reducer;