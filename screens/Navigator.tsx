import { connect, useDispatch, useSelector } from 'react-redux';
import { useEffect, useRef } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { generateClient } from 'aws-amplify/api';
import MessageScreen from './MessageScreen';
import ProfileScreen from './ProfileScreen';
import FriendRequestScreen from './FriendRequestScreen';
import MessageRoomScreen from './MessageRoomScreen';
import { fetchFriends, friendSlice } from '../src/redux/friendsReducer';
import { AppDispatch, RootState } from '../src/redux/store';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';
import { useAuthenticator } from '@aws-amplify/ui-react-native';
import { onPublishFriend, onPublishMessage, onPublishStatus } from '../src/service/graphql/subscriptions';
import { StatusService } from '../src/service/StatusService';
import { AppState } from 'react-native';

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
  const friends = useSelector((state: RootState) => state.friends.friends)
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useAuthenticator()
  const intervalRef = useRef(null);

  const subscribeRequest = async () => {
    const observable = client.graphql({
      query: onPublishFriend,
      variables: {UserId: user.userId}
    }).subscribe({
      next: ({ data }) => {
        const request = data['onPublishFriend']
        if(request['Status'] == 'FRIENDS'){
          dispatch(friendSlice.actions.addFriend(request))
        } else if(request['Status'] == 'PENDING'){
          dispatch(friendSlice.actions.addRequest(request))
        }
      },
      error: (error) => console.warn(error)
    });
    return () => {
      observable.unsubscribe();
    };
  }

  const subscribeMessage = async () => {
    const observable = client.graphql({
      query: onPublishMessage,
      variables: {RoomId: Object.keys(rooms)}
    }).subscribe({
      next: ({ data }) => {
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

  const subscribeStatus = async () => {
    ////console.log('call subs status')
    const observable = client.graphql({
      query: onPublishStatus,
      variables: {id: Object.keys(friends)}
    }).subscribe({
      next: ({ data }) => {
        const result = data['onPublishStatus']
        //console.log('someone on'+JSON.stringify(result));
        //const roomId = message['RoomId']
        dispatch(friendSlice.actions.updateStatus(result))
        //dispatch(friendSlice.actions.receiveMessage({roomId, message}))
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
    StatusService.connect();
  }, [user.userId]);

  useEffect(() => {
    if (rooms) {
      subscribeMessage();
    }
  }, [rooms]);

  useEffect(() => {
    if (friends) {
      subscribeStatus();
    }
  }, [friends]);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      StatusService.heartBeat(); 
    }, 60000); 

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);


  useEffect(() => {
    const subscription = AppState.addEventListener("change", handleAppStateChange);
    return () => {
      subscription.remove();
    };
  }, []);

  const handleAppStateChange = (nextAppState) => {
    if (nextAppState === 'active') {
      StatusService.connect()
      intervalRef.current = setInterval(StatusService.heartBeat, 60000);
    } else if (intervalRef.current) {
      StatusService.disconnect()
      clearInterval(intervalRef.current);
    }
  };

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
