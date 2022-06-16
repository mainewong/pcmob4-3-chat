import { StyleSheet, Text, View, Button, TouchableOpacity } from 'react-native';
import React, {useEffect, useState}from 'react';
import firebase from '../database/firebaseDB';
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { GiftedChat } from 'react-native-gifted-chat';

const auth = firebase.auth();
const db = firebase.firestore().collection("messages");
export default function ChatScreen({navigation}) {
    const [messages, setMessages] = useState([]);
    useEffect(() => {
        auth.onAuthStateChanged((user) => {
            if (user) {
                navigation.navigate("Chat", { id: user.id, email: user.email});
            } else {
                navigation.navigate("Login");
            }
        });
        navigation.setOptions({
            headerRight: () => (
                <TouchableOpacity onPress={logout}>
                <MaterialCommunityIcons name="logout" size={30} color="grey" />
                </TouchableOpacity>
            ),
        });
        const unsubscribe = db
        .orderBy("createdAt", "desc")
        .onSnapshot((collectionSnapshot) => {
            const messages = collectionSnapshot.docs.map((doc) => {
                const date = doc.data().createdAt.toDate();
                const newDoc = {...doc.data(), createdAt: date};
                return newDoc;
            });
            setMessages(messages);
        });
        return unsubscribe;
    }, []);
    const logout = () => auth.signOut();
    function sendMessage(newMessages){
        console.log(newMessages);
        db.add(newMessages[0]);
        //setMessages([...messages, ...newMessages]);
    }
  return (
    <GiftedChat
    messages={messages}
    onSend={sendMessage}
    renderUsernameOnMessage={true}
    listViewProps={{
        style: {
            backgroundColor: "lightgrey"} }}
    user={{ _id: auth.currentUser?.uid, name: auth.currentUser?.email }} />
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
