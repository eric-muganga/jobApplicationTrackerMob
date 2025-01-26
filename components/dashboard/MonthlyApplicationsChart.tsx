import React from 'react';
import { View, Text, Dimensions, StyleSheet } from 'react-native';
import { BarChart } from 'react-native-chart-kit';

const MonthlyApplicationsChart = ({ data }: { data: { month: string; applications: number }[] }) => {
  const screenWidth = Dimensions.get('window').width;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Monthly Applications</Text>
      <BarChart
        data={{
          labels: data.map((item) => item.month), // X-axis labels
          datasets: [
            {
              data: data.map((item) => item.applications), // Y-axis values
            },
          ],
        }}
        width={screenWidth - 62} // Subtract padding
        height={300}
        yAxisLabel=""
        yAxisSuffix=""
        yAxisInterval={1} // Proper spacing for Y-axis
        fromZero={true} // Ensure Y-axis starts from zero
        chartConfig={{
          backgroundColor: '#FFFFFF',
          backgroundGradientFrom: '#FFFFFF',
          backgroundGradientTo: '#FFFFFF',
          fillShadowGradient: '#3B82F6', // Blue bars
          fillShadowGradientOpacity: 1,
          decimalPlaces: 0, // No decimal places
          barPercentage: 0.6, // Adjusted bar width
          color: (opacity = 1) => `rgba(59, 130, 246, ${opacity})`, // Bar color
          labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`, // Axis label color
          propsForBackgroundLines: {
            strokeDasharray: '', // Remove dashed grid lines
            strokeWidth: 0.5, // Lighten grid lines
            stroke: '#E5E5E5', // Soft gray
          },
          style: {
            borderRadius: 16,
          },
        }}
        verticalLabelRotation={30} // Rotate X-axis labels
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
    elevation: 3, // For Android shadow
    marginBottom: 16,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
});

export default MonthlyApplicationsChart;
