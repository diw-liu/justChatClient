import { useLayoutEffect, useState } from "react";
import { View, Text, StyleSheet, FlatList, TextInput, Button, KeyboardAvoidingView, Platform, SafeAreaView } from "react-native";
import { useSelector } from "react-redux";
import { RootState } from "../src/redux/store";
import { useAuthenticator } from "@aws-amplify/ui-react-native";

const MessageItem = ({ text, isSent }) => {
  const messageStyle = isSent ? styles.sentMessage : styles.receivedMessage;
  const textStyle = isSent ? styles.sentText : styles.receivedText;

  return (
    <View style={[styles.message, messageStyle]}>
      <Text style={textStyle}>{text}</Text>
    </View>
  );
};

const MessageRoomScreen: React.FC<any> = ({ route, navigation }) => {
  const { id, name } = route.params;
  const { user } = useAuthenticator(); 
  const [messageText, setMessageText] = useState('');
  const friend = useSelector((state: RootState) => state.friends.friends[id])

  useLayoutEffect(() => {
    navigation.setOptions({
      title: name ? name: "MessageRoom",
      headerBackTitleVisible: false, 
    })
  })

  const sendMessage = () => {
    console.log(messageText);
    setMessageText('');
  };

  return (
    <SafeAreaView style={{flex: 1}}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 20}
      >
      <FlatList
        data={friend.Messages.items}
        keyExtractor={(item) => item.MessageId}
        renderItem={({ item }) => (
          <MessageItem
            text={item.Content}
            isSent={item.AuthorId === user.userId}
          />
        )}
        inverted
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={messageText}
          onChangeText={setMessageText}
          placeholder="Type a message..."
        />
        <Button title="Send" onPress={sendMessage} />
      </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    backgroundColor: '#fff', // Ensure input container has a different background
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    marginRight: 10,
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#fff', // Ensure the input field is clearly visible
  },
  messageText: {
    fontSize: 16,
  },
  sentMessage: {
    backgroundColor: '#DCF8C6', // Light green, typical for sent messages
    alignSelf: 'flex-end',
    marginRight: 10,
  },
  receivedMessage: {
    backgroundColor: '#ECECEC', // Light grey, for received messages
    alignSelf: 'flex-start',
    marginLeft: 10,
  },
  sentText: {
    color: 'black',
  },
  receivedText: {
    color: 'black',
  },
  message: {
    maxWidth: '70%',
    padding: 10,
    marginVertical: 5,
    borderRadius: 20,
  },
});

export default MessageRoomScreen