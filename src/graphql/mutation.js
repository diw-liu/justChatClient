export const connect = `mutation Connect {
  connect {
    id
    status
  }
}`;

export const disconnect = `mutation Disconnect {
  disconnect {
    id
    status
  }
}`;

export const disconnected = `mutation Disconnected($id: ID!) {
  disconnected(id: $id) {
    id
    status
  }
}`;

export const sendMessage = `mutation SendMessage($RoomId: String!, $Message: String!) {
  sendMessage(RoomId: $RoomId, Message: $Message)
}`;

export const requestFriend = `mutation RequestFriend($friendId: String!, $type: RequestType!) {
  requestFriend(friendId: $friendId, type: $type)
}`;
