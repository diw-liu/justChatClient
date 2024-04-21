import { createSlice, isFulfilled, PayloadAction } from '@reduxjs/toolkit';
import { createAsyncThunk } from '@reduxjs/toolkit';
import { FriendService } from '../service/FriendService';
import { Friend, Message, MessageConnection, MessageInfo } from '../interface';
import { RootState } from './store';
import { MessageService } from '../service/MessageService';

export const fetchFriends = createAsyncThunk(
  'friends/fetchFriends',
  async () => {
    return await FriendService.fetchFriends()
  }
);

// export const fetchMessages = createAsyncThunk(
//   'friends/fetchMessages',
//   async (roomId: string, nextToken: string) => {
//     return await MessageService.fetchMessage(roomId, nextToken)
//   }
// );


// export const subscribeMessage = createAsyncThunk(
//   'friends/subscribeMessage',
//   async (roomId: string, nextToken: string, thunkAPI) => {
//     console.log('inside subsMessage')
//     const rooms = (thunkAPI.getState() as RootState).friends.rooms;
//     console.log(roomId)
//     console.log(Object.keys(nextToken))
//     return await MessageService.subscribeMessage(Object.keys(rooms))
//   }
// )

interface FriendState {
  friends: {[key: string]: Friend}
  requests: {[key: string]: Friend}
  rooms: {[key: string]: MessageConnection}
  status: string
  error: string
}

// interface MessageInput {
//   message: Message,
//   roomId: string
// }

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
      // .addCase(fetchMessages.pending, (state, action) => {
      //   state.status = 'loading';
      // })
      // .addCase(fetchMessages.fulfilled, (state, action) => {
      //   state.status = 'succeeded';
      //   action.payload.forEach(friend => {
      //     if(friend.Status == "FRIENDS") {
      //       state.friends[friend.FriendId] = friend;
      //       state.rooms[friend.RoomId] = friend.Messages;
      //     } else { 
      //       state.requests[friend.FriendId] = friend;
      //     }
      //   });
      // })
      // .addCase(fetchMessages.rejected, (state, action) => {
      //   state.status = 'failed';
      //   state.error = action.error.message;
      // })
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
      state.rooms[roomId].items.forEach(element => {
        console.log('okay')
        console.log(element)
      });
      state.rooms[roomId].nextToken = result.nextToken;
      console.log(state.rooms[roomId])
    }
  }
})

export default friendSlice.reducer;