import React from 'react';
import { View, Text, FlatList, StyleSheet } from 'react-native';
import KanbanCard from './KanbanCard';
import {JobApplication} from '../../store/ApplicationsSlice.ts';

interface ColumnProps {
  name: string;
  count: number;
  applications: Array<{
    statusId: string;
    id: string;
    company: string;
    jobTitle: string;
    status: string;
  }>;
  onEditApplication: (application: JobApplication) => void;
}

const Column: React.FC<ColumnProps> = ({ name, count, applications, onEditApplication }) => {

  console.log('Column component' ,count, name, applications);
  return (
    <View style={styles.column}>
      <Text style={styles.columnHeader}>{name}</Text>
      <Text style={styles.columnCount}>
        {count} {count === 1 ? 'Job' : 'Jobs'}
      </Text>
      <FlatList
        data={applications}
        renderItem={({ item }) => (
          <KanbanCard
            id={item.id}
            company={item.company}
            position={item.jobTitle}
            stage={item.status}
            statusId={item.statusId}
            application={item}
            onEditApplication={onEditApplication}
          />
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  column: {
    backgroundColor: '#f0f0f0',
    padding: 10,
    borderRadius: 8,
    width: 250,
    marginRight: 10,
    minHeight: 400,
  },
  columnHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 5,
  },
  columnCount: {
    textAlign: 'center',
    color: '#666',
    fontSize: 12,
    marginBottom: 10,
  },
});

export default Column;
