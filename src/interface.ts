export interface User {
  UserId: string;
  FriendInfo: UserInfo
}

export interface UserInfo {
  UserName: String,
  Email: String
}

export interface Friends {
  FriendId: String,
  Status: String,
  RoomId: String,
  FriendInfo: UserInfo
}