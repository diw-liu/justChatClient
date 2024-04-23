import { useDispatch } from 'react-redux';
import { generateClient } from 'aws-amplify/api';
import { sendMessage } from './graphql/mutation';
import { getMessage } from './graphql/queries';
import { MessageConnection } from '../interface';

export class MessageService {
  private static client = generateClient();
  private static regex = /MessageId=([-\w]+)/;

  public static sendMessage = async (roomId: string, message: string) : Promise<string | undefined>=> {
    try {
      const result = await MessageService.client.graphql({
        query: sendMessage,
        variables: {RoomId: roomId, Message: message}
      })
      const messageId = result?.data.sendMessage.match(MessageService.regex)[1];
      return messageId
    } catch (err) {
      //console.log('sendMessage err'+ err)
      return undefined
    }
  }

  public static fetchMessage = async (roomId: string, nextToken?: string) : Promise<MessageConnection | undefined>=> {
    try {
      let variables = {roomId: roomId}
      if (nextToken) variables['nextToken'] = nextToken
      const result = await MessageService.client.graphql({
        query: getMessage,
        variables: variables
      })
      //console.log(result?.data)
      return result?.data.getMessage as MessageConnection
    } catch (err) {
      //console.log('fetchMessage err'+ JSON.stringify(err))
      return undefined
    }
  }
}