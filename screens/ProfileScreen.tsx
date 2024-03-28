// ProfileScreen.tsx
import React from 'react';
import { View, Text, Button } from 'react-native';
import { Authenticator, useAuthenticator } from '@aws-amplify/ui-react-native';


const ProfileScreen: React.FC = () => {
  const { signOut } = useAuthenticator();
  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Profile Screen</Text>
      <Button title="Sign Out" onPress={signOut} />
    </View>
  );
};

export default ProfileScreen;
