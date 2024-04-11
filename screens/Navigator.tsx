import { useDispatch } from 'react-redux';
import { useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import MessageScreen from './MessageScreen';
import ProfileScreen from './ProfileScreen';
import FriendRequestScreen from './FriendRequestScreen';
import MessageRoomScreen from './MessageRoomScreen'

import { fetchFriends } from '../src/redux/friendsReducer';
import { AppDispatch } from '../src/redux/store';
import { getFocusedRouteNameFromRoute } from '@react-navigation/native';

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
  const dispatch = useDispatch<AppDispatch>();
  

  useEffect(() => {
    dispatch(fetchFriends());
  }, [dispatch]);


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
