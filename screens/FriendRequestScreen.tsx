import React from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../src/redux/store';
import { FriendService } from '../src/service/FriendService';
import { friendSlice } from '../src/redux/friendsReducer';

interface FriendRequestItem {
  email: string
  name: string
  onAccept: () => void
  onDeny: () => void
}

const FriendRequestItem: React.FC<FriendRequestItem> = ({ name, email, onAccept, onDeny }) => (
  <View style={styles.requestItem}>
    <Text style={styles.requestText}>{name}</Text>
    <Text style={styles.requestText}>{email}</Text>
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
  const requests = useSelector((state: RootState) => state.friends.requests);
  const dispatch = useDispatch();
  
  const handleAccept = async (id) => {
    console.log('Accepted request:', id);
    dispatch(friendSlice.actions.setLoading());
    const result = await FriendService.approveFriend(id);
    if(result['Status'] == "200") {
      dispatch(friendSlice.actions.addFriend(result['Friend']))
      dispatch(friendSlice.actions.removeRequest(id))
    }
    dispatch(friendSlice.actions.setIdle());
  };

  const handleDeny = async (id) => {
    console.log('Denied request:', id);
    dispatch(friendSlice.actions.setLoading());
    const result = await FriendService.disapproveFriend(id);
    if(result['Status'] == "200") {
      dispatch(friendSlice.actions.removeRequest(id));
    }
    dispatch(friendSlice.actions.setIdle());
  };

  return (
    <FlatList
      data={Object.values(requests)}
      keyExtractor={(item) => item.FriendId}
      renderItem={({ item }) => (
        <FriendRequestItem
          name={item.FriendInfo.UserName}
          email={item.FriendInfo.Email}
          onAccept={() => handleAccept(item.FriendId)}
          onDeny={() => handleDeny(item.FriendId)}
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

