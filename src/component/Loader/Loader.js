import { View, ActivityIndicator } from 'react-native';
import React from 'react';
import { Colors } from '../../themes/Colors';

const Loader = ({ layOutStyle }) => {
  return (
    <View
      style={[
        { flex: 1, alignItems: 'center', justifyContent: 'center' },
        layOutStyle
      ]}
    >
      <ActivityIndicator color={Colors.primary} size="large" />
    </View>
  );
};

export default Loader;
