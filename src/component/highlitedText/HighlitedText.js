import { StyleSheet, Text } from 'react-native';
import { Fonts } from '../../themes';
import { Colors } from '../../themes/Colors';
import { SIZES } from '../../themes/Sizes';

export const getHighlightedText = (txt, searchText) => {
  const parts = txt.split(new RegExp(`(${searchText})`, 'gi'));
  return (
    <Text style={{ width: '94%' }} numberOfLines={1}>
      {parts.map((part) =>
        part.toUpperCase() === searchText.toUpperCase() ? (
          <Text
            style={[
              styles.txtCommitteeTitle,
              {
                backgroundColor: '#E6C54F'
              }
            ]}
            numberOfLines={1}
          >
            {part}
          </Text>
        ) : (
          <Text style={styles.txtCommitteeTitle} numberOfLines={1}>
            {part}
          </Text>
        )
      )}
    </Text>
  );
};

const styles = StyleSheet.create({
  txtCommitteeTitle: {
    ...Fonts.PoppinsBold[20],
    color: Colors.bold,
    marginLeft: SIZES[12]
  }
});
