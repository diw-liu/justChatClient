import React, { useState } from 'react';
import { View, TouchableOpacity, SafeAreaView, TextInput, StyleSheet, Text} from 'react-native';
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { UserModal } from '../src/supplement/UserModal';

const MessageScreen: React.FC = ({ navigation }) => {
  const [query, setQuery] = useState('');
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <View>
      <View style={styles.container}>
        <TextInput
          style={styles.input}
          placeholder="Search..."
          value={query}
          onChangeText={text => {
            setQuery(text);
            
          }}
        />
        <TouchableOpacity style={styles.buttonContainer} onPress={() => setModalVisible(true)}>
          <MaterialCommunityIcons name="plus" size={24} color="black" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
          style={styles.friendsContainer}
          onPress={() => navigation.navigate('FriendRequest')}
        >
          <Text style={styles.text}>Friend Request</Text>
          <MaterialIcons name="arrow-forward-ios" size={20} color="black" />
      </TouchableOpacity>
      <UserModal modalVisible={modalVisible} setModalVisible={setModalVisible}/>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    padding: 10,
  },
  buttonContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 5,
    padding: 6,
  },
  input: {
    flex: 1,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 5,
    padding: 10,
  },
  friendsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingVertical: 5,
    paddingHorizontal: 10,
    marginTop: 0, // Ensures the component is directly under the search/add button row
    marginBottom: 10, // Keeps the bottom margin to space it from the next element
    marginLeft: 10, // Aligns with the left side of the container above
    marginRight: 10, // Aligns with the right side of the container above
    borderRadius: 5,
    borderBottomWidth: 1, // Applies only a bottom border
    borderBottomColor: '#ccc', // Sets the color of the bottom border
  },
  text: {
    marginRight: 10,
    fontSize: 16,
  },
});

export default MessageScreen;