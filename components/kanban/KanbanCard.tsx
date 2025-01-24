import React, {useState} from 'react';
import {View, Text, StyleSheet, Platform, Alert, TouchableOpacity} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {useDispatch} from 'react-redux';
import {AppDispatch} from '../../store/store.ts';
import {updateApplicationStatus} from '../../store/ApplicationsSlice.ts';
import ApplicationDetail from './ApplicationDetail.tsx';

interface KanbanCardProps {
  id: string;
  company: string;
  position: string;
  stage: string;
  statusId: string;
  onPress?: (id: string) => void;
  application: any;
}

const STAGE_COLORS: Record<string, string> = {
  Wishlist: '#9F7AEA',
  Applied: '#3182CE',
  Interviewing: '#D69E2E',
  Offer: '#38A169',
  Rejected: '#E53E3E',
};

const STATUS_OPTIONS: { label: string; value: string }[] = [
  { label: 'Wishlist', value: '17be4434-0cc8-48dc-ba2a-deadcc97f814' },
  { label: 'Applied', value: '355bce13-f344-49f5-b198-b049751a6fc8' },
  { label: 'Interviewing', value: '0c54c354-4958-480a-a757-3d6cd214bc7f' },
  { label: 'Offer', value: '7979b18c-4eeb-4b29-9d33-89b996c431b1' },
  { label: 'Rejected', value: '0d05157a-0519-4034-9716-316fe203af3a' },
];

const KanbanCard: React.FC<KanbanCardProps> = ({
                                                 id,
                                                 company,
                                                 position,
                                                 stage,
                                                 statusId,
                                                 onPress,
                                                 application,
                                               }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [isModalVisible, setIsModalVisible] = useState(false);

  console.log(id, company, position, stage, statusId);

  const handleStatusChange = (newStage: string) => {
    dispatch(updateApplicationStatus({ id, statusId: newStage }))
      .then(() => Alert.alert('Success', 'Status updated successfully!'))
      .catch((error) =>
        Alert.alert('Error', 'Failed to update status. Please try again.', error.message)
      );
  };

  const handleCardPress = () => {
    setIsModalVisible(true);
  };

  return (
    <View>
      <TouchableOpacity
        style={[styles.card, { borderLeftColor: STAGE_COLORS[stage] }]}
        onPress={handleCardPress}
      >
      <View style={styles.cardContent}>
        <Text style={styles.position}>{position}</Text>
        <Text style={styles.company}>{company}</Text>
        <View style={styles.dropdownContainer}>
          <Picker
            selectedValue={statusId}
            onValueChange={(itemValue) => handleStatusChange(itemValue)}
            mode={Platform.OS === 'ios' ? 'dropdown' : 'dialog'}
            style={styles.picker}
          >
            {STATUS_OPTIONS.map((option) => (
              <Picker.Item key={option.value} label={option.label} value={option.value} />
            ))}
          </Picker>
        </View>
      </View>
        </TouchableOpacity>

      {/* Modal */}
      {isModalVisible && (
        <ApplicationDetail
          application={application} // Pass the application data to the modal
          onClose={() => setIsModalVisible(false)} // Close the modal
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
    borderLeftWidth: 4,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardContent: {
    flex: 1,
  },
  position: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  company: {
    fontSize: 14,
    color: '#666',
  },
  dropdownContainer: {
    marginTop: 10,
  },
  picker: {
    width: '100%',
    color: '#000',
  },
});


export default KanbanCard;
