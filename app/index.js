import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { CheckBox, Icon } from 'react-native-elements';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, updateDoc, deleteDoc, onSnapshot, doc } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC-Bb_-u2Wg4dM7P8QzHrjhnkrDUpNFXmQ",
  authDomain: "todo-app-21cba.firebaseapp.com",
  projectId: "todo-app-21cba",
  storageBucket: "todo-app-21cba.appspot.com",
  messagingSenderId: "1094055990911",
  appId: "1:1094055990911:web:3e7a7cd9d144a3a70f114a"
};

const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export default function App() {
  const [tasks, setTasks] = useState([]);
  const [taskTitle, setTaskTitle] = useState('');

  useEffect(() => {
    const unsubscribe = onSnapshot(collection(firestore, 'tasks'), (querySnapshot) => {
      const tasks = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));
      setTasks(tasks);
    });

    return () => unsubscribe();
  }, []);

  const addTask = async () => {
    if (taskTitle.trim() === '') return;
    const newTask = { title: taskTitle, status: false };
    try {
      await addDoc(collection(firestore, 'tasks'), newTask);
      setTaskTitle('');
    } catch (error) {
      console.error('Error adding task: ', error);
    }
  };

  const toggleTaskStatus = async (taskId, currentStatus) => {
    try {
      await updateDoc(doc(firestore, 'tasks', taskId), { status: !currentStatus });
    } catch (error) {
      console.error('Error updating task status: ', error);
    }
  };

  const deleteTask = async (taskId) => {
    try {
      await deleteDoc(doc(firestore, 'tasks', taskId));
    } catch (error) {
      console.error('Error deleting task: ', error);
    }
  };

  const renderItem = ({ item }) => (
    <View style={styles.taskCard}>
      <CheckBox
        checked={item.status}
        onPress={() => toggleTaskStatus(item.id, item.status)}
      />
      <Text style={[styles.taskTitle, item.status ? styles.doneTask : styles.dueTask]}>
        {item.title} - {item.status ? 'Done' : 'Due'}
      </Text>
      <TouchableOpacity onPress={() => deleteTask(item.id)}>
        <Icon name="delete" size={24} color="red" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Image source={require('/Users/junaidahmed/ToDo_App/assets/images/logo.png')} style={styles.logo} />
        <Text style={styles.appName}>TaskBuddy</Text>
      </View>
      <View style={styles.list}>
        <TextInput
          style={styles.input}
          placeholder="Task Title"
          value={taskTitle}
          onChangeText={setTaskTitle}
        />
        <Button
          style={styles.Button}
          title="Add Task"
          onPress={addTask}
          disabled={taskTitle.trim() === ''}
        />
        <FlatList
          data={tasks}
          renderItem={renderItem}
          keyExtractor={item => item.id}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  list: {
    marginTop: 0,
    flex: 0,
    padding: 20,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#fff',
    justifyContent: 'center',
    display: 'flex',
  },
  logo: {
    width: 70,
    height: 70,
    marginRight: 10,
  },
  appName: {
    fontSize: 30,
    color: '#fff',
    fontWeight: 'bold',
    color: '#000',
  },
  input: {
    borderColor: '#000',
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 50,
  },
  taskCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    fontSize: 19,
  },
  taskTitle: {
    flex: 1,
    fontSize: 15,
  },
  dueTask: {
    color: 'red',
  },
  doneTask: {
    color: 'green',
  },
});