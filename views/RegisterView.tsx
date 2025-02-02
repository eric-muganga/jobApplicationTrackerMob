import React, { useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, ScrollView, Alert, TouchableOpacity } from 'react-native';
import { AppDispatch } from '../store/store.ts';
import { useDispatch } from 'react-redux';
import { registerUser } from '../store/authSlice.ts';
import { useNavigation } from '@react-navigation/native';

const RegisterView = (): React.JSX.Element => {
  const [email, setEmail] = useState<string>('');
  const [firstName, setFirstName] = useState<string>('');
  const [fullName, setFullName] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);

  const dispatch: AppDispatch = useDispatch();
  const navigation = useNavigation();

  const passwordRules = [
    { regex: /^.{8,}$/, message: 'Password must be at least 8 characters long.' },
    { regex: /[A-Z]/, message: 'Password must contain at least one uppercase letter (A-Z).' },
    { regex: /\d/, message: 'Password must contain at least one number (0-9).' },
    { regex: /[!@#$%^&*]/, message: 'Password must contain at least one special character (e.g., !@#$%^&*).' },
  ];

  const validatePassword = (password: string): string[] =>
    passwordRules.filter(({ regex }) => !regex.test(password)).map(({ message }) => message);

  const handlePasswordChange = (value: string) => {
    setPassword(value);
    const errors = validatePassword(value);
    setPasswordErrors(errors);
  };

  const handleRegister = () => {
    if (!fullName || !firstName || !email || !password) {
      Alert.alert('Error', 'All fields are required!');
      return;
    }

    dispatch(registerUser({ firstName, fullName, email, password }));
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Register</Text>

      <TextInput
        style={styles.input}
        placeholder="Full Name"
        value={fullName}
        onChangeText={setFullName}
      />

      <TextInput
        style={styles.input}
        placeholder="First Name"
        value={firstName}
        onChangeText={setFirstName}
      />

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
        onChangeText={handlePasswordChange}
        secureTextEntry
        autoCapitalize="none"
      />

      {passwordErrors.length > 0 && (
        <View style={styles.errorContainer}>
          {passwordErrors.map((error, index) => (
            <Text key={index} style={styles.errorText}>
              • {error}
            </Text>
          ))}
        </View>
      )}

      <Button title="Register" onPress={handleRegister} />

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.note}>
          Already have an account? <Text style={styles.link}>Login</Text>
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
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
  errorContainer: {
    marginBottom: 15,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
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

export default RegisterView;
