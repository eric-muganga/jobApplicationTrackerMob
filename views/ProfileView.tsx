import React from 'react';
import {Text, View, StyleSheet, Button} from 'react-native';
import {useDispatch, useSelector} from 'react-redux';
import {logout, selectUser} from '../store/authSlice.ts';
import {AppDispatch} from '../store/store.ts';

const ProfileView = ():React.JSX.Element => {
  const dispatch: AppDispatch = useDispatch();
  const user = useSelector(selectUser);
  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile</Text>
      <View style={styles.infoContainer}>
        <Text style={styles.label}>Name:</Text>
        <Text style={styles.value}>{user?.firstName}</Text>

        <Text style={styles.label}>Full name:</Text>
        <Text style={styles.value}>{user?.fullName}</Text>

        <Text style={styles.label}>Email:</Text>
        <Text style={styles.value}>{user?.email}</Text>
      </View>
      <View style={styles.buttonContainer} >
        <Button title="Change password" onPress={handleLogout} />
        <Button title="Logout" onPress={handleLogout} color="#d9534f" />
      </View>
    </View>
  );
};


const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  infoContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 18,
    fontWeight: '500',
    color: '#333',
  },
  value: {
    fontSize: 18,
    color: '#555',
    marginBottom: 10,
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'center',
    gap: 10,
  }
});

export default ProfileView;
