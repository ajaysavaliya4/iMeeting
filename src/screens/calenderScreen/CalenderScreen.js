import { View, Text, SafeAreaView } from 'react-native';
import React from 'react';
import { Calendar } from 'react-native-big-calendar';

const CalenderScreen = () => {
  const events = [
    {
      title: 'Meeting...........',
      start: new Date(2022, 10, 15, 10, 0),
      end: new Date(2022, 10, 15, 10, 30)
    },
    {
      title: 'Meeting',
      start: new Date(2022, 10, 15, 10, 0),
      end: new Date(2022, 10, 15, 10, 30)
    }
  ];
  return (
    <SafeAreaView>
      <Text>CalenderScreen</Text>
      <Calendar events={events} height={600} mode="month" />
    </SafeAreaView>
  );
};

export default CalenderScreen;
