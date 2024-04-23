import { generateClient } from "aws-amplify/api";
import { heartbeat, status } from "./graphql/queries";
import { connect, disconnect } from "./graphql/mutation";

export class StatusService {
  private static client = generateClient();

  public static heartBeat = async () => {
    try {
      const result = await StatusService.client.graphql({
        query: heartbeat,
      })
      //console.log(result)
    } catch (err) {
      //console.log('heartBeat'+ err)
    }
  }

  public static status = async (id: string) => {
    try {
      const result = await StatusService.client.graphql({
        query: status,
        variables: {id: id}
      })
      //console.log("status"+result)
    } catch (err) {
      //console.log('status'+ err)
    }
  }

  public static connect = async () => {
    try {
      const result = await StatusService.client.graphql({
        query: connect,
      })
      //console.log("connect"+result)
    } catch (err) {
      //console.log('status'+ err)
    }
  }

  public static disconnect = async () => {
    try {
      const result = await StatusService.client.graphql({
        query: disconnect
      })
      //console.log("Disconnect"+result)
    } catch (err) {
      //console.log('status'+ err)
    }
  }
}