import { useDispatch, useSelector } from 'react-redux';
import { useEffect, useRef } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { generateClient } from 'aws-amplify/api';
import MessageScreen from './MessageScreen';
import ProfileScreen from './ProfileScreen';
import FriendRequestScreen from './FriendRequestScreen';
import MessageRoomScreen from './MessageRoomScreen';
import { fetchFriends, friendSlice} from '../src/redux/friendsReducer';
import { AppDispatch, RootState } from '../src/redux/store';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { useAuthenticator } from '@aws-amplify/ui-react-native';
import { onPublishFriend, onPublishMessage } from '../src/service/graphql/subscriptions';
import { Message } from '../src/interface';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

const StackNavigator = () => {
  return(
    <Stack.Navigator>
      <Stack.Screen name="Message" component={MessageScreen} options={{headerBackTitle: ""}}/>
      <Stack.Screen name="FriendRequest" component={FriendRequestScreen} />
      <Stack.Screen name="MessageRoom" component={MessageRoomScreen} />
    </Stack.Navigator>
  )
}

export const TabNavigator = () => {
  const client = generateClient();
  const rooms = useSelector((state: RootState) => state.friends.rooms)
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useAuthenticator()


  const subscribeRequest = async () => {
    const observable = client.graphql({
      query: onPublishFriend,
      variables: {UserId: user.userId}
    }).subscribe({
      next: ({ data }) => {
        //console.log(data)
        const request = data['onPublishFriend']
        if(request['Status'] == 'FRIENDS'){
          //console.log('inside firend')
          dispatch(friendSlice.actions.addFriend(request))
        } else if(request['Status'] == 'PENDING'){
          //console.log('inside pendings')
          dispatch(friendSlice.actions.addRequest(request))
        }
        // console.log('insssss')
      },
      error: (error) => console.warn(error)
    });

    return () => {
      observable.unsubscribe();
    };
  }

  const subscribeMessage = async () => {
    console.log(Object.keys(rooms))
    const observable = client.graphql({
      query: onPublishMessage,
      variables: {RoomId: Object.keys(rooms)}
    }).subscribe({
      next: ({ data }) => {
        console.log('hello'+data);
        const message = data['onPublishMessage']
        const roomId = message['RoomId']
        dispatch(friendSlice.actions.receiveMessage({roomId, message}))
      },
      error: (error) => console.warn(error)
    });

    return () => {
      observable.unsubscribe();
    };
  }

  useEffect(() => {
    dispatch(fetchFriends());
    subscribeRequest();
  }, [user.userId]);

  useEffect(() => {
    if (rooms) {
      subscribeMessage();
    }
  }, [rooms]);


  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          switch (route.name) {
            case 'Home':
              iconName = focused ? 'message-text' : 'message-text-outline';
              break;
            case 'Settings':
              iconName = focused ? 'account-settings' : 'account-settings-outline';
              break;
            default:
              break;
          }
          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
        "tabBarActiveTintColor": "blue",
        "tabBarInactiveTintColor": "gray",
      })}>
      <Tab.Screen 
        options={({ route }) => ({
          headerShown: false,
          tabBarStyle: { display: getFocusedRouteNameFromRoute(route) === 'MessageRoom' ? 'none' : 'flex' }
        })}
        name="Home"
        component={StackNavigator}/>
      <Tab.Screen options={{ headerShown: false }} name="Settings" component={ProfileScreen} />
    </Tab.Navigator>
  );
};
