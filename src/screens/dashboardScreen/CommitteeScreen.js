import { View, Text, StyleSheet, SafeAreaView, ScrollView } from 'react-native';
import React, { useRef, useState } from 'react';
import { useNavigation } from '@react-navigation/native';
import Checkbox from 'expo-checkbox';

import Header from '../../component/header/Header';
import { IconName } from '../../component';
import { Colors } from '../../themes/Colors';
import { Fonts } from '../../themes';
import { SIZES } from '../../themes/Sizes';
import { useQuery } from '@apollo/client';
import { GET_All_COMMITTEE } from '../../graphql/query';
import Loader from '../../component/Loader/Loader';

const CommitteeScreen = () => {
  const navigation = useNavigation();
  const ref = useRef();
  const [isChecked, setChecked] = useState(false);
  const [committee, setCommittee] = useState([]);

  const { loading: CommitteeLoading, error: CommitteeError } = useQuery(
    GET_All_COMMITTEE,
    {
      variables: { isDeleted: true },
      onCompleted: (data) => {
        if (data) {
          console.log('committees', data?.committees.items);
          setCommittee(data.committees.items);
        }
      }
    }
  );
  if (CommitteeError) {
    console.log('commitee error', CommitteeError);
  }

  const rowData = ({ title, index }) => {
    return (
      <View style={styles.rowDataContainer} key={index}>
        <Checkbox
          color={Colors.primary}
          value={isChecked}
          onValueChange={setChecked}
        />
        <Text style={styles.txtCheckboxTitle}>{title}</Text>
      </View>
    );
  };
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header
        name={'Committees'}
        leftIconName={IconName.Arrow_Left}
        onLeftPress={() => navigation.goBack()}
      />
      <View style={styles.container}>
        <Text
          style={{
            ...Fonts.PoppinsBold[24],
            color: Colors.bold,
            marginTop: SIZES[16]
          }}
        >
          Committees
        </Text>
        {CommitteeLoading ? (
          <Loader />
        ) : CommitteeError ? (
          <View style={{ alignItems: 'center', justifyContent: 'center' }}>
            <Text>{CommitteeError}</Text>
          </View>
        ) : (
          <ScrollView>
            {committee.map((item, index) => {
              return rowData({ title: item.committeeTitle, index });
            })}
          </ScrollView>
        )}
        {/* 
        {rowData({ title: 'Advisory Committee on Financial Management' })}
        {rowData({ title: 'Assessment Accommodations Review Panel' })}
        {rowData({ title: 'English Learner Stakeholder Input Group (ELSIG)' })}
        {rowData({ title: 'Indigenous Education Action Team' })}
        {rowData({ title: 'Local Assessment Advisory Committee (LAAC)' })}
        {rowData({ title: 'Nonpublic Education Council' })}
        {rowData({ title: 'Special Education Advisory Panel (SEAP)' })} */}
      </View>
    </SafeAreaView>
  );
};

export default CommitteeScreen;

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    width: '100%',
    padding: SIZES[16],
    height: '100%'
  },
  wrapItem: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  icon: {
    marginHorizontal: SIZES[8]
  },
  name: {
    ...Fonts.PoppinsRegular[14],
    color: Colors.bold
  },
  rowDataContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: SIZES[24]
  },
  txtCheckboxTitle: {
    ...Fonts.PoppinsRegular[14],
    color: Colors.bold,
    marginLeft: SIZES[16],
    marginRight: SIZES[16]
  }
});
