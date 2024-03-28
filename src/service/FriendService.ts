import { generateClient } from 'aws-amplify/api';
import { getUser } from '../graphql/queries'
import { requestFriend } from '../graphql/mutation';

interface User {
  UserId: string;
  UserName: string;
  Email: string;
}

export class FriendService {
  private static client = generateClient();

  public static fetchUser = async (email: string) : Promise<User | undefined> => {
    try {
      const postData = await FriendService.client.graphql({
        query: getUser,
        variables: { email: email}
      });
      return postData?.data.getUser as User;
    } catch (err) {
      console.log('error fetching posts', err);
      return undefined
    }
  }

  public static addFriend = async (id: string) : Promise<String | undefined> => {
    try {
      const postData = await FriendService.client.graphql({
        query: requestFriend,
        variables: { friendId: id, type: 'ADD'}
      });
      console.log(postData?.data.requestFriend)
      return postData?.data.requestFriend;
    } catch (err) {
      console.log('error fetching posts', err);
      return undefined
    }
  }

}