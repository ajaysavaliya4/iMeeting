import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import { Divider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

import { Colors } from '../../themes/Colors';
import Normalize from '../../themes/mixins';
import { Fonts } from '../../themes';
import Icon from '../Icon';
import IconName from '../Icon/iconName';

const CommitteesCard = ({
  committeesTitle,
  committeeIdNumber,
  committeeCategoryName,
  committeeRoleName,
  committeeDate
}) => {
  const navigation = useNavigation();
  const [editModal, setEditModal] = useState(false);

  // committee row view
  const RowData = ({ name, discription }) => {
    return (
      <View style={styles.container}>
        <Text style={styles.txtCommitteeName}>{name}</Text>
        <Text style={styles.discription}>{discription}</Text>
      </View>
    );
  };

  return (
    <TouchableOpacity activeOpacity={1} onPress={() => setEditModal(false)}>
      <Divider style={styles.divider} />

      {/* committee details */}
      <TouchableOpacity
        style={styles.committeeDetailView}
        onPress={() => navigation.navigate('CommitteeDetails')}
        activeOpacity={0.5}
      >
        <Text style={styles.txtCommitteeTitle}>{committeesTitle}</Text>

        <RowData name={'ID'} discription={committeeIdNumber} />
        <RowData name={'Category'} discription={committeeCategoryName} />
        <RowData name={'Your role'} discription={committeeRoleName} />
        <RowData name={'Date'} discription={committeeDate} />
      </TouchableOpacity>

      {/* dotsView */}
      <TouchableOpacity
        onPress={() => setEditModal(!editModal)}
        style={styles.dotsView}
      >
        <Icon
          name={IconName.Dots}
          height={Normalize(16)}
          width={Normalize(6)}
        />
      </TouchableOpacity>
      {editModal && (
        <View
          style={{
            backgroundColor: '#f8f8f8',
            position: 'absolute',
            top: Normalize(48),
            right: Normalize(18),
            padding: Normalize(16)
          }}
        >
          <TouchableOpacity>
            <Text>Edit</Text>
          </TouchableOpacity>
          <TouchableOpacity>
            <Text>Delete</Text>
          </TouchableOpacity>
        </View>
      )}
    </TouchableOpacity>
  );
};

export default CommitteesCard;

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: Normalize(12)
  },
  divider: {
    width: '100%',
    height: Normalize(1),
    backgroundColor: Colors.line
  },
  txtCommitteeName: {
    ...Fonts.PoppinsRegular[14],
    color: Colors.secondary,
    width: '30%'
  },
  discription: {
    ...Fonts.PoppinsRegular[14],
    color: Colors.bold
  },
  committeeDetailView: {
    paddingVertical: Normalize(24),
    paddingHorizontal: Normalize(16),
    width: '90%'
  },
  txtCommitteeTitle: {
    ...Fonts.PoppinsBold[20],
    color: Colors.bold
  },
  dotsView: {
    position: 'absolute',
    right: Normalize(16),
    top: Normalize(32)
  }
});
