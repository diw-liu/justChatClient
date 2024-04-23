import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { FriendService } from '../service/FriendService';
import { Friend, Message, MessageConnection, MessageInfo } from '../interface';

export const fetchFriends = createAsyncThunk(
  'friends/fetchFriends',
  async () => {
    return await FriendService.fetchFriends()
  }
);

interface FriendState {
  friends: {[key: string]: Friend}
  requests: {[key: string]: Friend}
  rooms: {[key: string]: MessageConnection}
  status: string
  error: string
}

const initialState: FriendState = {
  friends: {},
  rooms: {},
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
          if(friend.Status == "FRIENDS") {
            state.friends[friend.FriendId] = friend;
            friend.Messages.items.reverse();
            state.rooms[friend.RoomId] = friend.Messages;
          } else { 
            state.requests[friend.FriendId] = friend;
          }
        });
      })
      .addCase(fetchFriends.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
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
      state.rooms[friend.RoomId] = friend.Messages;
    },
    removeRequest: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      delete state.requests[id];
    },
    removeFriend: (state, action: PayloadAction<string>) => {
      const id = action.payload;
      delete state.friends[id];
    },
    receiveMessage: (state, action: PayloadAction<{roomId: string, message: Message}>) => {
      const {roomId, message} = action.payload;
      const messages = state.rooms[roomId].items;
      if(messages[messages.length-1].MessageId == message.MessageId) {
        messages[messages.length-1].successful = true
      } else {
        message.successful = true
        messages.push(message)
      } 
    },
    addMessage: (state, action: PayloadAction<{roomId: string, message: Message}>) => {
      const {roomId, message} = action.payload;
      state.rooms[roomId].items.push(message);
    },
    updateMessage: (state, action: PayloadAction<{roomId: string, result: MessageConnection}>) => {
      const {roomId, result} = action.payload;
      state.rooms[roomId].items = [...result.items.reverse(), ...state.rooms[roomId].items, ];
      state.rooms[roomId].nextToken = result.nextToken;
    },
    updateStatus: (state, action: PayloadAction<{id: string, status: string}>) => {
      ////console.log("status updated")
      const {id, status} = action.payload
      state.friends[id].isOnline.status = status
      ////console.log(state.friends[id])
    }
  }
})

export default friendSlice.reducer;