import React, {useState, useEffect} from 'react';
import { StatusBar } from 'expo-status-bar';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { TextInput } from 'react-native-gesture-handler';
import { Button } from 'react-native-web';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Snackbar } from 'react-native-paper';

export default function Add() {
  const defaultAppointmentName = 'My appointment';
  const [input, setInput] = useState(defaultAppointmentName);
  const [showSuccessMsg, setShowSuccessMsg] = useState(false);
  const [showClearMsg, setShowClearMsg] = useState(false);
  let STORAGE_KEY = '@APPOINTMENTS';

  // To retrieve the data whenever the app starts, invoke this method inside the useEffect hook.
  useEffect(() => {
    readData();
  }, []);

  const onChangeText = (value) => {
    setInput(value);
  }

  const onSubmitEditing = () => {
    if (!input) return;

    saveData();
    setInput('');
  }

  const saveData = async () => {
    try {
      const appointments = JSON.parse(await AsyncStorage.getItem(STORAGE_KEY)) || [];
      appointments.push(input);
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));
      setShowSuccessMsg(true);
    } catch (e) {
      alert('Failed to save the data to the storage')
    }
  }

  const readData = async () => {
    try {
      const appointments = JSON.parse(await AsyncStorage.getItem(STORAGE_KEY)) || [];
      if (appointments && appointments.length) {
        setInput(appointments[0]);
      }
    } catch (e) {
      alert('Failed to fetch the input from storage');
    }
  };

  const onClearStorage = async () => {
    try {
      await AsyncStorage.clear();
      setShowClearMsg(true);
      setInput(defaultAppointmentName);
    } catch (e) {
      alert('Failed to clear the async storage.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.lable}>Enter the Event</Text>
      <TextInput
        style={styles.input}
        value={input}
        placeholder="Enter"
        onChangeText={onChangeText}
        onSubmitEditing={onSubmitEditing}
      ></TextInput>
      <Pressable 
        onPress={onSubmitEditing}
        style={styles.button}>
        <Text style={styles.buttonText}>Save</Text>
      </Pressable>
      <Pressable 
        onPress={onClearStorage}
        style={styles.longbutton}>
        <Text style={styles.buttonText}>Clear All Appointments</Text>
      </Pressable>
      <Text>You entered {input}</Text>
      <Snackbar
          visible={showSuccessMsg}
          onDismiss={() => setShowSuccessMsg(false)}
          duration={2000}
        >
          <Text style={styles.lable}>Successfully Saved {input} </Text>
      </Snackbar>
      <Snackbar
          visible={showClearMsg}
          onDismiss={() => setShowClearMsg(false)}
          duration={2000}
        >
          <Text style={styles.lable}>Successfully deleted all appointments</Text>
      </Snackbar>
      <StatusBar style="auto" hidden={true}  />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'gray',
    alignItems: 'center',
    justifyContent: 'center',
  },
  header: {
    width: '100%',
    backgroundColor: '#dcdcdc',
    paddingTop: 48,
    paddingBottom: 10,
    borderBottomWidth: StyleSheet.hairlineWidth,
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    color: '#333',
    fontWeight: 'bold',
  },
  lable: {
    color: 'white'      
  },
  input: {
    backgroundColor: '#fff',
    height: 44,
    borderWidth: 1,
    borderColor: '#333',
    width: '100%',
    padding: 10,
    marginTop: 12,
  },
  button: {
    margin: 10,
    padding: 10,
    backgroundColor: 'orange',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    width: '50%'
  },
  longbutton: {
    margin: 10,
    padding: 10,
    backgroundColor: 'orange',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 4,
    width: '80%'
  },
  buttonText: {
    fontSize: 18,
    color: '#444',
  },
});
