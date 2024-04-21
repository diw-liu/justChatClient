export const onPublishMessage = `subscription OnPublishMessage($RoomId: [String!]) {
  onPublishMessage(RoomId: $RoomId) {
    RoomId
    MessageId
    AuthorId
    Content
    CreatedTime
  }
}`;

export const onPublishFriend = `subscription OnPublishFriend($UserId: String!) {
  onPublishFriend(UserId: $UserId) {
    UserId
    FriendId
    Status
    FriendInfo {
      UserId
      UserName
      Email
    }
  }
}`;

export const onStatus = `subscription OnStatus($id: ID!) {
  onStatus(id: $id) {
    id
    status
  }
}`;
