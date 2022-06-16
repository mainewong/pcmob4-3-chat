import { StatusBar } from 'expo-status-bar';
import { Keyboard, StyleSheet, Text, View } from 'react-native';
import { TextInput, TouchableOpacity } from 'react-native-gesture-handler';
import { useState } from 'react';
import firebase from "../database/firebaseDB";

const auth = firebase.auth();

export default function LoginScreen( {navigation} ) {

    const [email, setEmail] = useState("");
    const [password,setPassword] = useState("");
    const [errorText, setErrorText] = useState("");

    function login() {
        Keyboard.dismiss();
        auth
        .signInWithEmailAndPassword(email, password)
        .then(() => {
            console.log("Signed in!");
        })
        .catch((error) => {
            console.log("Error");
            setErrorText(error.message);
        });
    }

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Chat App</Text>
            <Text style={styles.fieldTitle}>Email</Text>
            <TextInput
            style={styles.input}
            placeholder="Enter Email"
            value={email}
            onChangeText={(text) => setEmail(text)}
            />

            <Text style={styles.fieldTitle}>Password</Text>
            <TextInput
            style={styles.input}
            placeholder="Enter Password"
            secureTextEntry={true}
            value={password}
            onChangeText={(text) => setPassword(text)}
            />
            <TouchableOpacity style={styles.loginButton} onPress={login}>            
                <Text style={styles.buttonText}>Log In</Text>
            </TouchableOpacity>
            <Text style={styles.errorText}> {errorText} </Text>
        </View>
    );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
      fontSize: 36,
      fontWeight: "bold",
      marginBottom: 24,
  },
  fieldTitle: {
      fontSize: 18,
      marginBottom: 12,
  },
  input: {
      width: "80%",
      borderColor: "#999",
      borderWidth: 1,
      marginBottom: 24,
      padding: 5,
      height: 36,
      fontSize: 18,
      backgroundColor: "white",
  },
  loginButton: {
      backgroundColor: "blue",
      width: 120,
      alignItems: "center",
      padding: 18,
      marginTop: 12,
      marginBottom: 36,
  },
  buttonText: {
      color: "white",
      fontWeight: "bold",
      fontSize: 18,
  },
  errorText: {
      color: "tomato",
      marginHorizontal: 30,
  },
});
