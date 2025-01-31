import React from 'react';
import { TouchableOpacity, Text, StyleSheet, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const FloatingActionButton: React.FC = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      {/* Your main floating button */}
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('NewApplication', { application: null })} // Replace with your route name
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end', // To align at the bottom
    alignItems: 'flex-end', // To align at the right side
    position: 'absolute',
    bottom: 0,
    right: 0,
    zIndex: 10, // Makes it appear above other elements
  },
  fab: {
    marginBottom: 20, // Padding from the bottom of the screen
    marginRight: 20, // Padding from the right of the screen
    backgroundColor: '#4F46E5', // Indigo color
    width: 60,
    height: 60,
    borderRadius: 30, // Circle shape
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // Shadow for Android
  },
  fabText: {
    color: '#FFF',
    fontSize: 28,
    fontWeight: 'bold',
  },
});

export default FloatingActionButton;
