export const getUser = `query GetUser($email: String!) {
  getUser(email: $email) {
    UserId
    UserName
    Email
  }
}`;

export const getFriends = `query GetFriends {
  getFriends {
    UserId
    FriendId
    Status
    RoomId
    CreatedTime
    UpdatedTime
    FriendInfo {
      UserId
      UserName
      Email
    }
  }
}`;

export const heartbeat = `query Heartbeat {
  heartbeat {
    id
    status
  }
}`;

export const status = `query Status($id: ID!) {
  status(id: $id) {
    id
    status
  }
}`;