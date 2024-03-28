import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';

const friendRequests = [
  { id: '1', name: 'John Doe' },
  { id: '2', name: 'Jane Smith' },
];

interface FriendRequestItem {
  name:String
  onAccept: () => void
  onDeny: () => void
}

const FriendRequestItem: React.FC<FriendRequestItem> = ({ name, onAccept, onDeny }) => (
  <View style={styles.requestItem}>
    <Text style={styles.requestText}>{name}</Text>
    <View style={styles.buttonsContainer}>
      <TouchableOpacity onPress={onAccept} style={styles.button}>
        <AntDesign name="checksquare" size={24} color="green" />
      </TouchableOpacity>
      <TouchableOpacity onPress={onDeny} style={styles.button}>
        <AntDesign name="closesquare" size={24} color="red" />
      </TouchableOpacity>
    </View>
  </View>
);

const FriendRequestScreen: React.FC = () => {
  const handleAccept = (id) => {
    console.log('Accepted request:', id);
    // Handle accept action here (e.g., update state or send a request to your backend)
  };

  const handleDeny = (id) => {
    console.log('Denied request:', id);
    // Handle deny action here
  };

  return (
    <FlatList
      data={friendRequests}
      keyExtractor={(item) => item.id}
      renderItem={({ item }) => (
        <FriendRequestItem
          name={item.name}
          onAccept={() => handleAccept(item.id)}
          onDeny={() => handleDeny(item.id)}
        />
      )}
    />
  );
};

const styles = StyleSheet.create({
  requestItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  requestText: {
    fontSize: 16,
  },
  buttonsContainer: {
    flexDirection: 'row',
  },
  button: {
    marginLeft: 10,
  },
});

export default FriendRequestScreen;

