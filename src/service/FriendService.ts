import { generateClient } from 'aws-amplify/api';
import { getFriends, getUser } from './graphql/queries'
import { requestFriend } from './graphql/mutation';
import { User, Friends } from '../interface'

export class FriendService {
  private static client = generateClient();

  public static fetchUser = async (email: string) : Promise<User | undefined> => {
    try {
      const result = await FriendService.client.graphql({
        query: getUser,
        variables: { email: email}
      });
      return result?.data.getUser as User;
    } catch (err) {
      console.log('error fetching users', err);
      return undefined
    }
  }

  public static fetchFriends = async () => {
    try {
      const result = await FriendService.client.graphql({
        query: getFriends
      });
      return result?.data.getFriends as Friends[];
    } catch (err) {
      console.log('error fetching users', err);
      return undefined
    }
  }

  public static addFriend = async (id: string) : Promise<String | undefined> => {
    try {
      const result = await FriendService.client.graphql({
        query: requestFriend,
        variables: { friendId: id, type: 'ADD'}
      });
      console.log(result?.data.requestFriend)
      return result?.data.requestFriend;
    } catch (err) {
      console.log('error add friends', err);
      return undefined
    }
  }

  public static removeFriend = async (id: string) : Promise<String | undefined> => {
    try {
      const result = await FriendService.client.graphql({
        query: requestFriend,
        variables: { friendId: id, type: 'REMOVE'}
      });
      console.log(result?.data.requestFriend)
      return result?.data.requestFriend;
    } catch (err) {
      console.log('error add friends', err);
      return undefined
    }
  }

  public static approveFriend = async (id: string) : Promise<String | undefined> => {
    try {
      const result = await FriendService.client.graphql({
        query: requestFriend,
        variables: { friendId: id, type: 'APPROVE'}
      });
      console.log(result?.data.requestFriend)
      return result?.data.requestFriend;
    } catch (err) {
      console.log('error add friends', err);
      return undefined
    }
  }

  public static disapproveFriend = async (id: string) : Promise<String | undefined> => {
    try {
      const result = await FriendService.client.graphql({
        query: requestFriend,
        variables: { friendId: id, type: 'DISAPPROVE'}
      });
      console.log(result?.data.requestFriend)
      return result?.data.requestFriend;
    } catch (err) {
      console.log('error add friends', err);
      return undefined
    }
  }
}