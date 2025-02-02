import React from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { PieChart } from 'react-native-chart-kit';

const STATUS_COLORS: Record<string, string> = {
  Wishlist: '#A855F7', // Purple
  Applied: '#3B82F6', // Blue
  Interviewing: '#F59E0B', // Orange
  Offer: '#10B981', // Green
  Rejected: '#EF4444', // Red
};

const StatusPieChart = ({ data }: { data: { name: string; value: number }[] }) => {
  const screenWidth = Dimensions.get('window').width;

  console.log('StatusPieChart Data:', data);

  // Prepare chart data
  const chartData = data.map((item) => {
    if (!STATUS_COLORS[item.name]) {
      console.warn(`Missing color for status: ${item.name}`);
    }

    return {
      name: item.name,
      population: item.value,
      color: STATUS_COLORS[item.name] || '#888888', // Default to gray if color is missing
      legendFontColor: '#333333',
      legendFontSize: 12,
    };
  });

  console.log('ChartData:', chartData);


  if (!data || data.length === 0) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Application Status</Text>
        <Text style={{ textAlign: 'center', marginTop: 20 }}>No data available</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Application Status</Text>
      <PieChart
        data={chartData}
        width={screenWidth - 32}
        height={220}
        accessor="population"
        backgroundColor="transparent"
        paddingLeft="15"
        absolute
        chartConfig={{
          color: () => '#000000', // Default color function
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: '#fff',
    borderRadius: 8,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
});

export default StatusPieChart;
