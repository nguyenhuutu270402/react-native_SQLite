import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import * as SQLite from 'expo-sqlite';
import React, { useState, useEffect } from 'react';
import { Button } from 'react-native';
import { TextInput } from 'react-native';
export default function App() {
  const db = SQLite.openDatabase('example.db');
  const [nameCur, setNameCur] = useState("");
  const [arrName, setArrName] = useState([]);

  const fetchData = () => {
    db.transaction(tx => {
      tx.executeSql(`CREATE TABLE IF NOT EXISTS names (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT)`)
    });
    db.transaction(tx => {
      tx.executeSql(`SELECT * FROM names`, null,
        (txtObj, resultSet) => setArrName(resultSet.rows._array),
        (txtObj, error) => console.log(error)
      );
    });
  }
  useEffect(() => {
    fetchData();
  }, []);
  const onAddItem = () => {
    db.transaction(tx => {
      tx.executeSql(`INSERT INTO names (name) VALUES (?)`, [nameCur])
    });
    fetchData();
  }
  const onDeleteItem = (id) => {
    db.transaction(tx => {
      tx.executeSql(`DELETE FROM names WHERE id = ?`, [id])
    });
    fetchData();
  }
  const onUpdateItem = (id) => {
    db.transaction(tx => {
      tx.executeSql(`UPDATE names SET name = ? WHERE id = ?`, [nameCur, id])
    });
    fetchData();
  }
  return (
    <View style={styles.container}>
      <View style={styles.boxAdd}>
        <TextInput placeholder='Enter name...' onChangeText={(text) => setNameCur(text)} />
        <Button onPress={() => onAddItem()} title='Add' />
      </View>
      <StatusBar style="auto" />
      <View style={styles.boxContent}>
        {
          arrName.map((item, index) => (
            <View key={item.id} style={styles.boxItem}>
              <Text>{item.name}</Text>
              <Button onPress={() => onDeleteItem(item.id)} title='Delete' />
              <Button onPress={() => onUpdateItem(item.id)} title='Update' />
            </View>
          ))
        }

      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  boxItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    margin: 10,
  },
  boxAdd: {
    flexDirection: 'row',
    borderWidth: 1,
    width: '90%',
    justifyContent: 'space-between',
    padding: 10,
  },
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
