import React, { useEffect, useState } from 'react';
import {
  ScrollView,
  Text,
  TextInput,
  StyleSheet,
  Button,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import {Picker} from '@react-native-picker/picker';
import { useDispatch, useSelector } from 'react-redux';
import { RouteProp } from '@react-navigation/native';
import {
  createApplication, JobApplication, NewApplicationPayload, Stage,
  updateApplications,
} from '../store/ApplicationsSlice.ts';
import {
  fetchContractTypes,
  fetchStatuses,
  selectOptions,
} from '../store/optionsSlice.ts';
import { AppDispatch } from '../store/store';



type RootStackParamList = {
  NewApplication: { application?: JobApplication }; // Define the expected `params` for this screen
};

type NewApplicationRouteProp = RouteProp<RootStackParamList, 'NewApplication'>;

interface FormState {
  id?: string; // Only used when editing an existing application
  company: string;
  jobTitle: string;
  status: string; // We'll convert this to statusId
  applicationDate: string;
  interviewDate: string;
  notes: string;
  contractType: string; // We'll convert this to contractTypeId
  jobDescription: string;
  createdAt: string;
  financialInformation: {
    salary: string;
    currency: string;
    salaryType: string;
    typeOfEmployment: string;
  };
  location: string;
}

const initialState: FormState = {
  company: '',
  jobTitle: '',
  status: '',
  applicationDate: '',
  interviewDate: '',
  notes: '',
  contractType: '',
  jobDescription: '',
  createdAt: new Date().toISOString(),
  financialInformation: {
    salary: '',
    currency: 'USD',
    salaryType: 'Monthly',
    typeOfEmployment: 'Remote',
  },
  location: '',
};

const NewApplicationView = (): React.JSX.Element => {
  const [formData, setFormData] = useState(initialState);

  const { contractTypes, statuses } = useSelector(selectOptions);
  const dispatch: AppDispatch = useDispatch();
  const navigation = useNavigation();
  const route = useRoute<NewApplicationRouteProp>();

  useEffect(() => {
    dispatch(fetchStatuses());
    dispatch(fetchContractTypes());
  }, [dispatch]);

  useEffect(() => {
    if (route.params?.application) {
      const application = route.params.application;
      const matchedContractType = contractTypes.find(
        (type) => type.id === application.contractTypeId
      );
      console.log('Editing Application:', application);
      setFormData({
        id: application.id,
        company: application.company || '',
        jobTitle: application.jobTitle || '',
        status: application.status || '', // Ensure string
        applicationDate: application.applicationDate?.toString() || '', // Convert to string if undefined
        interviewDate: application.interviewDate?.toString() || '', // Ensure it's a string
        notes: application.notes || '',
        contractType: matchedContractType?.name || '', // Get the name from contractTypes
        jobDescription: application.jobDescription || '',
        createdAt: application.createdAt || new Date().toISOString(),
        financialInformation: {
          id: application.financialInformation?.id,
          salary: application.financialInformation?.salary?.toString() || '',
          currency: application.financialInformation?.currency || 'USD',
          salaryType: application.financialInformation?.salaryType || 'Monthly',
          typeOfEmployment: application.financialInformation?.typeOfEmployment || 'Remote',
        },
        location: application.location || 'Unknown',
      });
    }
  }, [contractTypes, route.params]);

  const handleInputChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleFinancialInfoChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      financialInformation: {
        ...prev.financialInformation,
        [name]: value,
      },
    }));
  };

  const handleSubmit = async () => {
      if (!formData.company || !formData.jobTitle || !formData.status) {
        Alert.alert('Error', 'Please fill in all required fields.');
        return;
      }

    console.log('Form data before processing: ', formData);
      // Find the matching GUIDs from your loaded 'statuses' and 'contractTypes'
      const selectedStatus = statuses.find((s) => s.name === formData.status);
      const selectedContractType = contractTypes.find(
        (c) => c.name === formData.contractType
      );

    if (!selectedStatus || !selectedContractType) {
      Alert.alert('Error', 'Invalid status or contract type selection.');
      return;
    }

      const isEditMode = !!formData.id;

      // Create the new application object
      const applicationPayload: NewApplicationPayload = {
        company: formData.company.trim(),
        jobTitle: formData.jobTitle.trim(),
        applicationDate: formData.applicationDate ? new Date(formData.applicationDate).toISOString() : null,
        interviewDate: formData.interviewDate ? new Date(formData.interviewDate).toISOString() : null,
        notes: formData.notes.trim(),
        jobDescription: formData.jobDescription?.trim() || '',
        createdAt: new Date().toISOString(), // Automatically set the created date
        financialInformation: {
          // If you leave out "id", the server sees it as a new record
          salary: formData.financialInformation.salary,
          currency: formData.financialInformation.currency,
          salaryType: formData.financialInformation.salaryType,
          typeOfEmployment: formData.financialInformation.typeOfEmployment,
        },
        location: formData.location.trim() || 'Unknown',
        statusId: selectedStatus?.id || '', // Ensure it's a string
        contractTypeId: selectedContractType?.id || '', // Ensure it's a string
      };

      console.log('Final Payload:', JSON.stringify(applicationPayload, null, 2));

      try {
        if (isEditMode) {
          const updatedApplication = {
            id: formData.id!,
            company: formData.company.trim(),
            jobTitle: formData.jobTitle.trim(),
            statusId: selectedStatus?.id || '',
            status: selectedStatus?.name as Stage || '',
            contractTypeId: selectedContractType?.id || '',
            contractType: selectedContractType?.name || '',
            applicationDate: formData.applicationDate ? new Date(formData.applicationDate).toISOString() : null,
            interviewDate: formData.interviewDate ? new Date(formData.interviewDate).toISOString() : null,
            notes: formData.notes.trim(),
            jobDescription: formData.jobDescription?.trim() || '',
            createdAt: formData.createdAt || new Date().toISOString(),
            financialInformation: formData.financialInformation,
            location: formData.location.trim() || 'Unknown',
          };

          console.log('Updating application:', JSON.stringify(updatedApplication, null, 2));
          await dispatch(
            updateApplications({ applicationToUpdate: updatedApplication })
          ).unwrap();
          Alert.alert('Success', 'Application updated successfully!');
          navigation.goBack();
        } else {
          console.log('Creating new application:', JSON.stringify(applicationPayload, null, 2));
          await dispatch(createApplication(applicationPayload));
          Alert.alert('Success', 'Application saved successfully!');
          navigation.goBack();
        }
      } catch (error) {
        console.error(error);
        Alert.alert('Error', 'Failed to save the application.');
      }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>
        {formData.id ? 'Edit Application' : 'Add New Application'}
      </Text>

      {/* Company */}
      <Text style={styles.label}>Company</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Company Name"
        value={formData.company}
        onChangeText={(text) => handleInputChange('company', text)}
      />

      {/* Job Title */}
      <Text style={styles.label}>Job Title</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Job Title"
        value={formData.jobTitle}
        onChangeText={(text) => handleInputChange('jobTitle', text)}
      />

      {/* Status */}
      <Text style={styles.label}>Status</Text>
      <Picker
        selectedValue={formData.status}
        onValueChange={(value) => handleInputChange('status', value)}
        style={styles.input}
      >
        {statuses.map((status) => (
          <Picker.Item key={status.id} label={status.name} value={status.name} />
        ))}
      </Picker>

      {/* Application Date */}
      <Text style={styles.label}>Application Date</Text>
      <TextInput
        style={styles.input}
        placeholder="YYYY-MM-DD"
        value={formData.applicationDate}
        onChangeText={(text) => handleInputChange('applicationDate', text)}
      />

      {/* Interview Date */}
      <Text style={styles.label}>Interview Date</Text>
      <TextInput
        style={styles.input}
        placeholder="YYYY-MM-DD"
        value={formData.interviewDate}
        onChangeText={(text) => handleInputChange('interviewDate', text)}
      />

      {/* Contract Type */}
      <Text style={styles.label}>Contract Type</Text>
      <Picker
        selectedValue={formData.contractType}
        onValueChange={(value) => handleInputChange('contractType', value)}
        style={styles.input}
      >
        {contractTypes.map((type) => (
          <Picker.Item key={type.id} label={type.name} value={type.name} />
        ))}
      </Picker>

      {/* Notes */}
      <Text style={styles.label}>Notes</Text>
      <TextInput
        style={styles.textArea}
        placeholder="Enter Notes"
        value={formData.notes}
        onChangeText={(text) => handleInputChange('notes', text)}
        multiline
      />

      {/* Job Description */}
      <Text style={styles.label}>Job Description</Text>
      <TextInput
        style={styles.textArea}
        placeholder="Enter Job Description"
        value={formData.jobDescription}
        onChangeText={(text) => handleInputChange('jobDescription', text)}
        multiline
      />

      {/* Financial Information */}
      <Text style={styles.label}>Salary</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter Salary"
        value={formData.financialInformation.salary}
        onChangeText={(text) =>
          handleFinancialInfoChange('salary', text)
        }
      />

      <Text style={styles.label}>Currency</Text>
      <Picker
        selectedValue={formData.financialInformation.currency}
        onValueChange={(value) =>
          handleFinancialInfoChange('currency', value)
        }
        style={styles.input}
      >
        <Picker.Item label="USD" value="USD" />
        <Picker.Item label="EUR" value="EUR" />
        <Picker.Item label="PLN" value="PLN" />
      </Picker>

      <Button title="Save Application" onPress={handleSubmit} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: '#f5f5f5',
    flexGrow: 1,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    height: 100,
    marginBottom: 15,
    fontSize: 16,
  },
});

export default NewApplicationView;
