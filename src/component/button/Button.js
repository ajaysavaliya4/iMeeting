import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';

import { Fonts } from '../../themes';
import { Colors } from '../../themes/Colors';
import { SIZES } from '../../themes/Sizes';

const _Button = ({
  onPress,
  title,
  textStyle,
  layoutStyle,
  icon,
  disable = false
}) => {
  return (
    <TouchableOpacity
      // activeOpacity={0.7}
      onPress={onPress}
      disabled={disable}
      style={[style.layout, { backgroundColor: Colors.primary }, layoutStyle]}
    >
      <Text style={[style.text, { color: Colors.white }, textStyle]}>
        {icon}
        {title}
      </Text>
    </TouchableOpacity>
  );
};

export const Button = _Button;

const style = StyleSheet.create({
  layout: {
    paddingVertical: SIZES[10],
    borderRadius: SIZES[8],
    // elevation: 4,
    alignContent: 'center',
    justifyContent: 'center',
    flexDirection: 'row'
  },
  text: {
    textAlign: 'center',
    alignSelf: 'center',
    ...Fonts.PoppinsSemiBold[14]
  }
});
