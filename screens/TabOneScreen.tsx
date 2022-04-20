import { StyleSheet, TextInput, TouchableWithoutFeedback, Keyboard } from 'react-native';
import React from 'react';
import EditScreenInfo from '../components/EditScreenInfo';
import { Text, View } from '../components/Themed';
import { RootTabScreenProps } from '../types';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function TabOneScreen({ navigation }: RootTabScreenProps<'TabOne'>) {
  const [participantNumber, onChangeNumber] = React.useState('0');

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
    <View style={styles.container}>
      <Text style={styles.title}>Participant Number</Text>
      <View style={styles.separator} lightColor="#eee" darkColor="rgba(255,255,255,0.1)" />
      <TextInput
        style={styles.input}
        onChangeText={onChangeNumber}
        value={participantNumber}
        placeholder="Enter Participant Number"
        keyboardType="numeric"
      />
    </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: '80%',
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding:10,
  }
});
