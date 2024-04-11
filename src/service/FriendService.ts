import { generateClient } from 'aws-amplify/api';
import { getFriends, getUser } from './graphql/queries'
import { requestFriend } from './graphql/mutation';
import { onPublishFriend } from './graphql/subscriptions'
import { User, Friend, FriendsResponse } from '../interface'

export class FriendService {
  private static client = generateClient();

  public static fetchUser = async (email: string) : Promise<User | undefined> => {
    try {
      const result = await FriendService.client.graphql({
        query: getUser,
        variables: { email: email}
      });
      console.log(result)
      return result?.data.getUser[0] as User;
    } catch (err) {
      console.log('error fetching users', err);
      return undefined
    }
  }

  public static fetchFriends = async () => {
    try {
      const result = await FriendService.client.graphql({
        query: getFriends
      })
      console.log(result?.data.getFriends)
      return result?.data.getFriends as Friend[];
    } catch (err) {
      console.log('error fetching users', err);
      return undefined
    }
  }

  public static subscribeRequest = async (userId: string) => {
    console.log("Dasdadassad")
    FriendService
      .client
      .graphql({
        query: onPublishFriend,
        variables: {UserId: userId}})
      .subscribe({
        next: ({ data }) => console.log(data),
        error: (error) => console.warn(error)
      });
  }

  public static addFriend = async (id: string) : Promise<FriendsResponse | undefined> => {
    try {
      const result = await FriendService.client.graphql({
        query: requestFriend,
        variables: { friendId: id, type: 'ADD'}
      });
      console.log(result?.data.requestFriend)
      return result?.data.requestFriend as FriendsResponse;
    } catch (err) {
      console.log('error add friends', err);
      return undefined
    }
  }

  public static removeFriend = async (id: string) : Promise<FriendsResponse | undefined> => {
    try {
      const result = await FriendService.client.graphql({
        query: requestFriend,
        variables: { friendId: id, type: 'REMOVE'}
      });
      console.log(result?.data.requestFriend)
      return result?.data.requestFriend as FriendsResponse;
    } catch (err) {
      console.log('error add friends', err);
      return undefined
    }
  }

  public static approveFriend = async (id: string) : Promise<FriendsResponse | undefined> => {
    try {
      const result = await FriendService.client.graphql({
        query: requestFriend,
        variables: { friendId: id, type: 'APPROVE'}
      });
      console.log(result?.data.requestFriend)
      return result?.data.requestFriend as FriendsResponse;
    } catch (err) {
      console.log('error add friends', err);
      return undefined
    }
  }

  public static disapproveFriend = async (id: string) : Promise<FriendsResponse | undefined> => {
    try {
      const result = await FriendService.client.graphql({
        query: requestFriend,
        variables: { friendId: id, type: 'DISAPPROVE'}
      });
      console.log(result?.data.requestFriend)
      return result?.data.requestFriend as FriendsResponse;
    } catch (err) {
      console.log('error add friends', err);
      return undefined
    }
  }
}