import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform
} from 'react-native';
import React from 'react';
import DeviceInfo from 'react-native-device-info';

import { Fonts } from '../../themes';
import { Colors } from '../../themes/Colors';
import Icon from '../Icon';
import { SIZES } from '../../themes/Sizes';

const Header = ({
  name,
  leftIconName,
  rightIconName,
  onLeftPress,
  onRightPress,
  style
}) => {
  return (
    <View>
      {leftIconName || rightIconName ? (
        <View
          style={[
            styles.headerWithIconView,
            { justifyContent: rightIconName ? 'space-between' : null }
          ]}
        >
          {/* leftIconName */}
          <TouchableOpacity
            activeOpacity={0.5}
            onPress={onLeftPress}
            style={style}
          >
            <Icon
              name={leftIconName}
              height={Platform.isPad ? SIZES[10] : SIZES[14]}
              width={Platform.isPad ? SIZES[10] : SIZES[14]}
            />
          </TouchableOpacity>

          {/* header Title */}
          <Text
            style={[
              styles.txtHeader,
              {
                marginLeft: rightIconName ? '8%' : '38%',
                width: '30%',

                alignSelf: 'center'
              }
            ]}
            numberOfLines={1}
          >
            {name}
          </Text>

          {/* rightIconName */}
          <TouchableOpacity activeOpacity={0.5} onPress={onRightPress}>
            <Icon name={rightIconName} height={SIZES[14]} width={SIZES[14]} />
          </TouchableOpacity>
        </View>
      ) : (
        <View style={styles.centerView}>
          <Text style={styles.txtHeader}>{name}</Text>
        </View>
      )}
    </View>
  );
};

export default Header;

const styles = StyleSheet.create({
  headerWithIconView: {
    paddingVertical: SIZES[10],
    alignItems: 'center',
    flexDirection: 'row',
    paddingHorizontal: SIZES[16]
  },
  txtHeader: {
    ...Fonts.PoppinsSemiBold[14],
    color: Colors.bold

    // width: '30%'
  },
  centerView: {
    paddingVertical: SIZES[10],
    alignItems: 'center'
  }
});
