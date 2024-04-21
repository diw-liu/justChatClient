import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { View, Text, StyleSheet, FlatList, TextInput, Button, KeyboardAvoidingView, Platform, SafeAreaView, RefreshControl, Keyboard, ActivityIndicator } from "react-native";
import { useDispatch, useSelector } from "react-redux";
import { RootState } from "../src/redux/store";
import { useAuthenticator } from "@aws-amplify/ui-react-native";
import { MessageService } from "../src/service/MessageService";
import { Message } from "../src/interface";
import { friendSlice } from "../src/redux/friendsReducer";

const MessageItem = ({ text, isSystemMessage, isOwnMessage}) => {
  const messageStyle = isSystemMessage ? styles.systemMessage : (isOwnMessage ? styles.sentMessage : styles.receivedMessage);
  const textStyle = isSystemMessage ? styles.systemText : styles.messageText;

  return (
    <View style={[styles.message, messageStyle]}>
      <Text style={textStyle}>{text}</Text>
    </View>
  );
};

const MessageRoomScreen: React.FC<any> = ({ route, navigation }) => {
  const { roomId, name } = route.params;
  const { user } = useAuthenticator();
  const dispatch = useDispatch();
  const room = useSelector((state: RootState) => state.friends.rooms[roomId])
  const flatListRef = useRef(null);
  const [messageText, setMessageText] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: name ? name: "MessageRoom",
      headerBackTitleVisible: false, 
    })
  })

  // useEffect(() => {
  //   const unsubscribe = navigation.addListener('focus', () => {
  //     autoScrollToBottom();
  //   });
  //   return unsubscribe;
  // }, [navigation]);
    
  useEffect(() => {
    autoScrollToBottom();
  }, [room.items]); 

  const autoScrollToBottom = () => {
    console.log("Scrolling to bottom...");
    if (flatListRef.current && !refreshing && room.items.length > 0) {
      setTimeout(() => {
        flatListRef.current.scrollToIndex({
          index: room.items.length - 1,
          animated: true
        });
      }, 500);
    }
  }

  const onScrollToIndexFailed = (error) => {
    const index = error.index;
    const offset = error.averageItemLength * index;
    flatListRef.current.scrollToOffset({ offset });
    setTimeout(() => {
      if (room.items.length > index) {
        flatListRef.current.scrollToIndex({ index, animated: true });
      }
    }, 100);
  };
  
  const sendMessage = async () => {
    if(!messageText) return;
    const result = await MessageService.sendMessage(roomId, messageText);
    const message: Message = {
      MessageId: result,
      AuthorId: user.userId,
      Content: messageText,
      CreatedTime: new Date().toISOString(),
      successful: false
    }
    dispatch(friendSlice.actions.addMessage({roomId, message}))
    setMessageText('');
  };

  const fetchMessages = async () => {
    setRefreshing(true);
    try {
      if(room.nextToken){
        const result = await MessageService.fetchMessage(roomId, room.nextToken)
        dispatch(friendSlice.actions.updateMessage({roomId, result}))
      }
    } finally {
      setRefreshing(false);
    }
  }

  return (
    <SafeAreaView style={{flex: 1}}>
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 90 : 20}
      >
      <FlatList
        ref={flatListRef}
        data={room.items}
        extraData={room.items.length}
        keyExtractor={(item) => item.MessageId}
        renderItem={({ item }) => (
          <MessageItem
            text={item.Content}
            isSystemMessage={item.AuthorId === '0'}
            isOwnMessage={item.AuthorId === user.userId}
          />
        )}
        onScrollToIndexFailed={onScrollToIndexFailed}
        contentContainerStyle={styles.listContainer}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={fetchMessages}
            colors={['#9Bd35A', '#689F38']}
            tintColor="#689F38"
          />
        }
      />
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={messageText}
          onChangeText={setMessageText}
          placeholder="Type a message..."
          onFocus={autoScrollToBottom}
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
  message: {
    maxWidth: '80%',
    padding: 10,
    marginVertical: 5,
    borderRadius: 20,
  },
  sentMessage: {
    backgroundColor: '#DCF8C6', // Light green, typical for sent messages
    alignSelf: 'flex-end',
    marginRight: 10,
  },
  receivedMessage: {
    backgroundColor: '#ECECEC', // Light grey, typical for received messages
    alignSelf: 'flex-start',
    marginLeft: 10,
  },
  systemMessage: {
    backgroundColor: 'transparent', // Make system message background transparent
    alignSelf: 'center',
    marginHorizontal: 'auto', // Center the system message horizontally
    padding: 0, // Optional: Reduce padding for system messages
  },
  messageText: {
    color: 'black',
  },
  systemText: {
    color: '#666', // Change the text color to make it less prominent or adjust as needed
    fontWeight: 'bold',
    fontStyle: 'italic', // Make system messages italic to differentiate them
  },
  listContainer: {
    paddingHorizontal: 10,
    paddingTop: 10,
  },
  loader: {
    padding: 10,
    justifyContent: 'center',
    alignItems: 'center',
  }
});

export default MessageRoomScreen