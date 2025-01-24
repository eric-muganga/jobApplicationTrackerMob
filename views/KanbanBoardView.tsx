import React, {useEffect} from 'react';
import { ScrollView, StyleSheet, View, Text} from 'react-native';
import Column from '../components/kanban/Column.tsx';
import {useSelector, useDispatch} from 'react-redux';
import {fetchApplications, selectApplications} from '../store/ApplicationsSlice.ts';
import {AppDispatch} from '../store/store.ts';


const KanbanBoardView = (): React.JSX.Element => {
  const dispatch:AppDispatch = useDispatch();

  const {items, columns, error, loading } = useSelector(selectApplications);

  //1) Fetch applications on mount
  useEffect(() => {
    dispatch(fetchApplications());
  }, [dispatch]);

  console.log('items', items);
  console.log('columns:', columns);

  // 2) Render
  if (loading) {
    return (
      <View style={{ padding: 16 }}>
        <Text>Loading applications...</Text>
      </View>
    );
  }
  if (error) {
    return (
      <View style={{ padding: 16 }}>
        <Text style={{ color: 'red' }}>{error}</Text>
      </View>
    );
  }

  const handleCardPress = (id: string) => {
    console.log('Card pressed:', id);
    // Show details modal or navigate to another screen
  };

  return (
    <ScrollView
      horizontal
      style={styles.container}
      contentContainerStyle={styles.board}
      showsHorizontalScrollIndicator={false}
    >
      {Object.keys(columns).map((stage) => {
        // Map column IDs to application objects
        const applications = columns[stage].map((id) => items[id]).filter(Boolean);

        return (
          <Column
            key={stage}
            name={stage}
            count={applications.length}
            applications={columns[stage].map((id) => ({
              ...items[id],
              statusId: items[id]?.statusId, // Ensure statusId is passed
            }))}
          />
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  board: {
    padding: 10,
    flexDirection: 'row',
  },
});


export default KanbanBoardView;
