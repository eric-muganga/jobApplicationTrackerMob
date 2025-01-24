import {ActivityIndicator, ScrollView, View, Text} from 'react-native';
import React, { useEffect} from 'react';
import MonthlyApplicationsChart from '../components/dashboard/MonthlyApplicationsChart.tsx';
import {
  selectMonthlyApplications,
  selectStats,
  selectError,
  selectLoading,
  fetchMonthlyApplications, fetchStatusCounts,
} from '../store/dashboardSlice.ts';
import { useSelector, useDispatch} from 'react-redux';
import StatusPieChart from '../components/dashboard/StatusPieChart.tsx';
import {AppDispatch} from '../store/store.ts';


const DashboardView = (): React.JSX.Element => {
  const dispatch:AppDispatch = useDispatch();

  const monthlyApplications = useSelector(selectMonthlyApplications); // Monthly applications data
  const stats = useSelector(selectStats); // Status counts data
  const loading = useSelector(selectLoading); // Loading state
  const error = useSelector(selectError); // Error state

  // Fetch data when the component mounts
  useEffect(() => {
    dispatch(fetchMonthlyApplications());
    dispatch(fetchStatusCounts());
  }, [dispatch]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: 'red' }}>{error}</Text>
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <View style={{ marginBottom: 20 }}>
        <MonthlyApplicationsChart data={monthlyApplications} />
      </View>
      <View>
        <StatusPieChart data={stats} />
      </View>
    </ScrollView>
  );
};

export default DashboardView;
