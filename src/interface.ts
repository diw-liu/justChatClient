export interface User {
  UserId: string;
  FriendInfo: UserInfo
}

export interface UserInfo {
  UserName: string,
  Email: string
}

export interface MessageInfo {
  MessageId: string,
  AuthorId: string,
  Content: string,
  CreatedTime: string
}

export interface Message {
  MessageId: string,
  AuthorId: string,
  Content: string,
  CreatedTime: string,
  successful?: boolean 
}

export interface MessageConnection {
  items: [Message],
  nextToken?: string
}

export interface Friend {
  FriendId: string,
  CreatedTime: string,
  RoomId: string,
  Status: string,
  FriendInfo: UserInfo,
  Messages: MessageConnection
}

export interface FriendsResponse {
  Friend: Friend,
  Status: String
}