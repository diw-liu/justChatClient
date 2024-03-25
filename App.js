import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import HomeScreen from './screens/HomeScreen';
import ProfileScreen from './screens/ProfileScreen';
import FriendScreen from './screens/FriendScreen';

const Drawer = createDrawerNavigator();
const Tab = createBottomTabNavigator();

const TabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          switch (route.name) {
            case 'Friends':
              iconName = focused ? 'account-group' : 'account-group-outline';
              break;
            case 'Message':
              iconName = focused ? 'message-text' : 'message-text-outline';
              break;
            default:
              break;
          }
          return <MaterialCommunityIcons name={iconName} size={size} color={color} />;
        },
        "tabBarActiveTintColor": "blue",
        "tabBarInactiveTintColor": "gray",
      })}>
      <Tab.Screen options={{ headerShown: false }} name="Message" component={HomeScreen} />
      <Tab.Screen options={{ headerShown: false }} name="Friends" component={FriendScreen} />
    </Tab.Navigator>
  );
};

const App = () => {
  return (
    // <Authenticator.Provider>
    //   <Authenticator signUpAttributes={[
    //     "email",
    //     "name"
    //   ]}>
        <NavigationContainer>
          <Drawer.Navigator initialRouteName="Tabs">
            <Drawer.Screen name="Home" component={TabNavigator}/>
            <Drawer.Screen name="Profile" component={ProfileScreen} />
          </Drawer.Navigator>
        </NavigationContainer>
    //   </Authenticator>
    // </Authenticator.Provider>
  );
};

export default App;