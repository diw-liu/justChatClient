import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { TabNavigator } from './screens/Navigator'
import { Amplify } from 'aws-amplify';
import { signIn } from 'aws-amplify/auth';
import { Authenticator } from '@aws-amplify/ui-react-native';
import { BackendStack } from './output/cdk-exports.json'
import { store } from './src/redux/store';
import { Provider } from 'react-redux';

Amplify.configure({
  Auth: {
    Cognito: {
      userPoolClientId: BackendStack.ChatsClient,
      userPoolId: BackendStack.ChatsUserpool,
    }
  },
  API: {
    GraphQL: {
      endpoint: BackendStack.ChatsAppSync,
      region: 'us-east-1',
      defaultAuthMode: 'userPool'
    }
  }
})

const App = () => {
  const signInHandler = async(username, password) => {
    try {
      return signIn({
        username: username,
        password: password,
        options: {
          authFlowType: "USER_PASSWORD_AUTH",
        }
      })
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <Provider store={store}>
      <Authenticator.Provider>
      <Authenticator
        signUpAttributes={["email"]}
        services={{
          handleSignIn: async ({username, password}) => {
            return signInHandler(username, password)
          },
          handleConfirmSignUp: async ({username, password}) => {
            return signInHandler(username, password)
          } 
        }}>
          <NavigationContainer>
            <TabNavigator/>
          </NavigationContainer>
      </Authenticator>
      </Authenticator.Provider>
    </Provider>
  );
};

export default App;