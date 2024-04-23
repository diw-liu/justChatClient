import { useState } from 'react';
import { View, TouchableOpacity, Modal, Text, TextInput, StyleSheet, Button } from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { AntDesign } from '@expo/vector-icons';
import { FriendService } from '../service/FriendService';

interface UserModalProps {
  modalVisible: boolean;
  setModalVisible: (visible: boolean) => void;
}

interface UserInfo {
  UserId?: string;
  UserName?: string;
  Email?: String
}

export const UserModal: React.FC<UserModalProps> = ({ modalVisible, setModalVisible }) => {
  const [userInfo, setUserInfo] = useState<UserInfo | null | undefined>(null);
  
  const handleFetchUser = async (email: string) => {
    const user = await FriendService.fetchUser(email)
    setUserInfo(user)
  }

  const handleAddFriend = async () => {
    const result = await FriendService.addFriend(userInfo['UserId'])
    if(result['Status'] == "200") {
      setModalVisible(!modalVisible);
      setUserInfo(null) 
    } else {
      setUserInfo(undefined) 
    }
    //console.log(result)
  }

  const closeModal = () => {
    setModalVisible(!modalVisible);
    setUserInfo(null)
  }

  return (
    <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}
      >
        <View style={styles.centeredView}>
          <View style={styles.modalView}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={closeModal}
            >
              <MaterialCommunityIcons name="close" size={24} color="black" />
            </TouchableOpacity>
            <Text style={styles.modalText}>Enter user email adddress:</Text>
            <TextInput
              style={styles.textInput}
              maxLength={30}
              placeholder="Type here..."
              onSubmitEditing={({ nativeEvent }) => {handleFetchUser(nativeEvent.text)}}
            />
            {userInfo ? (
                        <View style={styles.container}>
                          <Text style={styles.text}>Username: {userInfo.UserName}</Text>
                          <TouchableOpacity style={styles.button} onPress={handleAddFriend}>
                            <AntDesign name="adduser" size={24} color="white"/>
                          </TouchableOpacity>
                        </View>
                      ) : (
                        userInfo === undefined && <Text>Invalid Email or Please try again later</Text>
                      )}
          </View>
        </View>
      </Modal>
  )
}

const styles = StyleSheet.create({ 
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
  },
  modalView: {
    backgroundColor: '#fefefe', // A softer white
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    width: '80%', // Adjust width to fit content better
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3, // Slightly more pronounced shadow
    shadowRadius: 5,
    elevation: 10,
  },
  modalText: {
    marginBottom: 15,
    textAlign: 'center',
    color: '#333', // Softer text color
  },
  closeButton: {
    position: 'absolute',
    right: 15,
    top: 15,
    backgroundColor: '#dddddd', // Background for the close button
    borderRadius: 15, // Rounded corners for the close button background
    padding: 5,
  },
  textInput: {
    height: 40,
    width: '100%', // Make the input stretch to match modal width
    marginVertical: 12,
    paddingHorizontal: 10,
    borderWidth: 1,
    borderColor: '#ccc', // Lighter border
    borderRadius: 5,
    fontSize: 16,
    backgroundColor: '#f9f9f9', // Keeps the input background
  },
  container: {
    flexDirection: 'row', // Align items in a row
    alignItems: 'center', // Center items vertically
    padding: 10, // Add padding around
  },
  text: {
    flex: 1, // Take up all available space except for the button
    fontSize: 16, // Increase font size for better readability
    color: '#333', // A slightly softer color than black
  },
  button: {
    backgroundColor: '#007bff', // A pleasant blue
    borderRadius: 5, // Rounded corners
    padding: 6, // Padding inside the button
    marginLeft: 10, // Spacing between text and button
  },
})