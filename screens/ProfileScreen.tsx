// ProfileScreen.tsx
import React from 'react';
import { View, Text, Button } from 'react-native';
import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react-native';


const ProfileScreen: React.FC = () => {
  const { user, signOut } = useAuthenticator();

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Profile Screen</Text>
      <Text> {user.userId} </Text>
      <Text> {user.username} </Text>
      <Button title="Sign Out" onPress={signOut} />
    </View>
  );
};

export default ProfileScreen;
