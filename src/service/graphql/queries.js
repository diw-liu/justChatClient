export const getUser = `query GetUser($email: String!) {
  getUser(email: $email) {
    UserId
    UserName
    Email
  }
}`;

export const getFriends = `query GetFriends {
  getFriends {
    FriendId
    Status
    RoomId
    FriendInfo {
      UserName
      Email
    }
    Messages {
      items {
        MessageId
        AuthorId
        Content
        CreatedTime
      }
      nextToken
    }
  }
}`;

export const getMessage = `query GetMessage($roomId: String!, $limit: Int, $nextToken: String) {
  getMessage(roomId: $roomId, limit: $limit, nextToken: $nextToken) {
    items {
      RoomId
      MessageId
      AuthorId
      Content
      CreatedTime
    }
    nextToken
  }
}`

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