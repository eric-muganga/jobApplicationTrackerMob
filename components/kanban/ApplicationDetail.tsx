import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Modal,
  Alert,
} from 'react-native';
import { useDispatch } from 'react-redux';
import { format } from 'date-fns';
import { AppDispatch } from '../../store/store';
import { deleteApplication, JobApplication } from '../../store/ApplicationsSlice';

interface ApplicationDetailProps {
  application: JobApplication;
  onClose: () => void;
  visible: boolean;
  onEditApplication: (application: JobApplication) => void;
}

const ApplicationDetail: React.FC<ApplicationDetailProps> = ({
                                                               application,
                                                               onClose,
                                                               visible,
                                                               onEditApplication,
                                                             }) => {
  const dispatch = useDispatch<AppDispatch>();

  // Format text with line breaks
  const formatText = (text: string | undefined) =>
    text?.split('\n').map((line, index) => (
      <Text key={index} style={styles.descriptionLine}>
        {line}
      </Text>
    ));

  const handleEditClick = () => {
    onClose();
    onEditApplication(application);
  };

  const handleDeleteClick = async () => {
    Alert.alert('Confirm Delete', 'Are you sure you want to delete this application?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await dispatch(deleteApplication(application.id));
            onClose();
          } catch (error) {
            console.error('Failed to delete application', error);
            Alert.alert('Error', 'Failed to delete application.');
          }
        },
      },
    ]);
  };

  if (!application) {
    return null;
  }

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modal}>
          <ScrollView>
            {/* Header Section */}
            <View style={styles.header}>
              <View>
                <Text style={styles.title}>{application.jobTitle}</Text>
                <Text style={styles.subtitle}>{application.company}</Text>
              </View>
              <TouchableOpacity onPress={onClose}>
                <Text style={styles.closeButton}>X</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.divider} />

            {/* Content Section */}
            <View style={styles.content}>
              <Text>
                <Text style={styles.label}>Location:</Text> {application.location || 'N/A'}
              </Text>
              <Text>
                <Text style={styles.label}>Status:</Text>{' '}
                <Text style={[styles.status, styles[`status${application.status}`]]}>
                  {application.status}
                </Text>
              </Text>
              {application.applicationDate && (
                <Text>
                  <Text style={styles.label}>Applied On:</Text> {format(new Date(application.applicationDate), 'PPpp')}
                </Text>
              )}
              {application.contractType && (
                <Text>
                  <Text style={styles.label}>Contract Type:</Text> {application.contractType}
                </Text>
              )}
              {application.jobDescription && (
                <View>
                  <Text style={styles.label}>Job Description:</Text>
                  <View style={styles.descriptionContainer}>
                    {formatText(application.jobDescription)}
                  </View>
                </View>
              )}
              {application.notes && (
                <Text>
                  <Text style={styles.label}>Notes:</Text> {application.notes}
                </Text>
              )}
              {application.financialInformation && (
                <Text>
                  <Text style={styles.label}>Financial Information:</Text>{' '}
                  {application.financialInformation.salary}{' '}
                  {application.financialInformation.currency} (
                  {application.financialInformation.salaryType}) -{' '}
                  {application.financialInformation.typeOfEmployment}
                </Text>
              )}
            </View>

            {/* Buttons Section */}
            <View style={styles.buttons}>
              <TouchableOpacity onPress={handleEditClick} style={styles.editButton}>
                <Text style={styles.buttonText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleDeleteClick} style={styles.deleteButton}>
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modal: {
    backgroundColor: 'white',
    borderRadius: 10,
    width: '90%',
    maxHeight: '80%',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#333',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  closeButton: {
    fontSize: 20,
    color: 'red',
    fontWeight: 'bold',
  },
  divider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 16,
  },
  content: {
    marginBottom: 16,
  },
  label: {
    fontWeight: 'bold',
    color: '#555',
  },
  status: {
    fontWeight: 'bold',
    paddingVertical: 2,
    paddingHorizontal: 8,
    borderRadius: 4,
    overflow: 'hidden',
    color: 'white',
  },
  statusApplied: { backgroundColor: '#3182CE' },
  statusInterviewing: { backgroundColor: '#D69E2E' },
  statusOffer: { backgroundColor: '#38A169' },
  statusRejected: { backgroundColor: '#E53E3E' },
  statusWishlist: { backgroundColor: '#9F7AEA' },
  descriptionContainer: {
    marginTop: 8,
    padding: 8,
    backgroundColor: '#f9f9f9',
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  descriptionLine: {
    marginBottom: 4,
    color: '#333',
  },
  buttons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  editButton: {
    backgroundColor: '#3182CE',
    padding: 12,
    borderRadius: 4,
    flex: 1,
    marginRight: 8,
  },
  deleteButton: {
    backgroundColor: '#E53E3E',
    padding: 12,
    borderRadius: 4,
    flex: 1,
    marginLeft: 8,
  },
  buttonText: {
    color: 'white',
    textAlign: 'center',
    fontWeight: 'bold',
  },
});

export default ApplicationDetail;
