import React, { useState } from 'react';
import { Text, View, StyleSheet, TextInput, Button, Alert, TouchableOpacity } from 'react-native';
import { useDispatch } from 'react-redux';
import { loginUser } from '../store/authSlice.ts';
import { AppDispatch } from '../store/store.ts';
import { useNavigation } from '@react-navigation/native';

const LoginView = (): React.JSX.Element => {
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const dispatch: AppDispatch = useDispatch();
  const navigation = useNavigation();

  const handleLogin = () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in both email and password.');
      return;
    }
    dispatch(loginUser({ email, password }));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        autoCapitalize="none"
      />

      <Button title="Login" onPress={handleLogin} />

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.note}>
          Don't have an account? <Text style={styles.link}>Sign up</Text>
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    backgroundColor: '#F5FCFF',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    marginBottom: 15,
    paddingHorizontal: 10,
    fontSize: 16,
  },
  note: {
    marginTop: 15,
    textAlign: 'center',
    fontSize: 14,
    color: '#555',
  },
  link: {
    color: '#007BFF',
    fontWeight: 'bold',
  },
});

export default LoginView;
