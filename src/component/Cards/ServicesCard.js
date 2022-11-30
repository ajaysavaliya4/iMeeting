import { Text, TouchableOpacity } from 'react-native';
import React from 'react';

import Icon from '../Icon';
import { Fonts } from '../../themes';
import { Colors } from '../../themes/Colors';
import { SIZES } from '../../themes/Sizes';

const DashboardCard = ({
  backgroundColor,
  name,
  height,
  width,
  style,
  title,
  textStyle,
  onPress
}) => {
  return (
    <TouchableOpacity
      activeOpacity={0.5}
      style={[
        {
          height: SIZES[98],
          width: SIZES[98],
          backgroundColor,
          borderRadius: SIZES[12],
          alignItems: 'center',
          justifyContent: 'center',
          marginRight: SIZES[16],
          marginTop: SIZES[8]
        },
        style
      ]}
      onPress={onPress}
    >
      <Icon name={name} height={height} width={width} />
      <Text
        style={[
          {
            ...Fonts.PoppinsRegular[12],
            color: Colors.bold
          },
          textStyle
        ]}
      >
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export default DashboardCard;
