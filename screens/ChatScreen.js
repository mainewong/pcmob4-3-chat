import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, Button, TouchableOpacity, } from 'react-native';
import React, { useEffect, useState } from 'react';
import firebase from '../database/firebaseDB';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { GiftedChat } from 'react-native-gifted-chat';

const auth = firebase.auth();

const db = firebase.firestore().collection("messages");

export default function ChatScreen( {navigation} ) {
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if(user) {
        navigation.navigate("Chat", { id: user.id, email: user.email });
      } else {
        navigation.navigate("Login");
      }    
    });

    navigation.setOptions({
			headerRight: () => (
				<TouchableOpacity onPress={logout}>
					<MaterialCommunityIcons
						name='logout'
						size={24}
						color='grey'
						style={{ marginRight: 20}}
					/>
				</TouchableOpacity>
			)
		});

    const unsubscribe = db
      .orderBy("createdAt", "desc")
      .onSnapshot((collectionSnapshot) => {
        const messages = collectionSnapshot.docs.map((doc) => {
          const date = doc.data().createdAt.toDate();
          const newDoc = {...doc.data(), createdAt: date };
          return newDoc;
        });
        setMessages(messages);
      });

    return unsubscribe;

  }, []);

  const logout = () => auth.signOut();

  function sendMessages(newMessages) {
    console.log(newMessages);
    db.add(newMessages[0]);
    //setMessages([...messages, ...newMessages]);
  }

  return (
    <GiftedChat
      message={messages}
      onSend={sendMessages}
      listViewProps= {{ style: { backgroundColor: "#666"} }}
      user={{ _id: auth.currentUser?.uid, name: auth.currentUser?.email }}
    />
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
