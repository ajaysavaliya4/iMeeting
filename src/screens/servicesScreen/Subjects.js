import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  StyleSheet,
  FlatList,
  TouchableOpacity
} from 'react-native';
import React, { useState } from 'react';
import Header from '../../component/header/Header';
import { Icon, IconName } from '../../component';
import { Divider } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SIZES } from '../../themes/Sizes';
import { Colors } from '../../themes/Colors';
import { Fonts } from '../../themes';
import { subjectData, usersData } from '../../Constans/data';
import SubjectCard from '../../component/Cards/subjectCard/SubjectCard';
import { Button } from '../../component/button/Button';
import { useRef } from 'react/cjs/react.development';
import { useQuery } from '@apollo/client';
import { GET_SUBJECT_BY_ID } from '../../graphql/query';

const subjectsData = [
  {
    subjectTitle: 'Advisory Committee on Fina...',

    id: 0,
    subjectCategoryName: 'finance',
    createrName: 'Marvin McKinney',
    subjectStatus: 'Approved'
  },
  {
    subjectTitle: 'Advisory Committee on Fina...',
    id: 1,
    subjectCategoryName: 'finance',
    createrName: 'Marvin McKinney',
    subjectStatus: 'Verified'
  },
  {
    subjectTitle: 'Advisory Committee on Fina...',
    id: 2,
    subjectCategoryName: 'finance',
    createrName: 'Marvin McKinney',
    subjectStatus: 'Rejected'
  },
  {
    subjectTitle: 'Advisory Committee on Fina...',
    id: 3,
    subjectCategoryName: 'finance',
    createrName: 'Marvin McKinney',
    subjectStatus: 'Pending'
  },
  {
    subjectTitle: 'Advisory Committee on Fina...',
    id: 4,
    subjectCategoryName: 'finance',
    createrName: 'Marvin McKinney',
    subjectStatus: 'Transferred'
  }
];

const Subjects = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { subjectId, role } = route?.params;
  console.log('subject id', subjectId);
  const [searchText, setSearchText] = useState('');
  const [subject, setSubject] = useState(null);
  let subjects = [];

  subjectId?.map((id) => {
    const getSubjectsById = useQuery(GET_SUBJECT_BY_ID, {
      variables: {
        subjectId: id
      },
      onCompleted: (data) => {
        console.log('subject from meeting details', data.subject);
        setSubject((prev) => {
          const id = subjects.map((item) => {
            return item.subjectId;
          });

          if (id != data.subject.subjectId) {
            subjects.push(data.subject);
            setSubject(subjects);
          }
        });
      }
    });
    // if (getSubjectsById.data) {
    //   console.log('getSubjectsById', getSubjectsById.data);
    // }
    if (getSubjectsById.error) {
      console.log('getSubjectsById error', getSubjectsById.error);
    }
  });
  return (
    <SafeAreaView style={styles.container}>
      <Header
        name={'Subjects'}
        leftIconName={IconName.Arrow_Left}
        onLeftPress={() => navigation.goBack()}
      />
      <View style={styles.subContainer}>
        <View style={styles.searchContainer}>
          <Icon name={IconName.Search} height={SIZES[12]} width={SIZES[12]} />
          <TextInput
            style={styles.textInput}
            placeholder={'Search'}
            onChangeText={(text) => setSearchText(text)}
          />
          <Icon name={IconName.Speaker} height={SIZES[15]} width={SIZES[10]} />
        </View>
        <View style={styles.deadlineContainer}>
          <Text style={styles.txtDeadlineTitle}>Deadline suggesting</Text>
          {role == 'Head' || role == 'Secretory' ? (
            <TouchableOpacity
              style={styles.chooseDateContainer}
              onPress={() => navigation.navigate('DeadlineSuggestion')}
            >
              <View
                style={{
                  borderBottomWidth: SIZES[1],
                  borderBottomColor: Colors.primary,
                  marginRight: SIZES[14]
                }}
              >
                <Text style={styles.txtChooseDate}>Choose date</Text>
              </View>

              <Icon
                name={IconName.Calendar_Focused}
                height={SIZES[20]}
                width={SIZES[18]}
              />
            </TouchableOpacity>
          ) : (
            <Text
              style={{
                ...Fonts.PoppinsSemiBold[14],
                color: Colors.bold,
                marginLeft: SIZES[8]
              }}
            >
              5-11 September
            </Text>
          )}
        </View>
        {role == 'Head' || role == 'Secretory' ? null : (
          <Button
            title="Add draft subject"
            layoutStyle={styles.cancelBtnLayout}
            textStyle={styles.txtCancelButton}
            onPress={() => navigation.navigate('AddDraftSubject')}
          />
        )}
        <Divider style={styles.divider} />
        <FlatList
          data={subject}
          keyExtractor={(item, index) => `subjects-${item.id}`}
          renderItem={({ item, index }) => (
            <SubjectCard
              item={item}
              index={index}
              searchText={searchText}
              role={role}
            />
          )}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
};

export default Subjects;

const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  subContainer: {
    paddingHorizontal: SIZES[16],
    backgroundColor: Colors.white,
    flex: 1
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: SIZES[10],
    backgroundColor: Colors.gray,
    borderRadius: SIZES[10],
    marginVertical: SIZES[22],
    height: SIZES[36]
  },
  textInput: {
    ...Fonts.PoppinsRegular[14],
    color: Colors.bold,
    backgroundColor: 'transparent',
    flex: 1,
    marginHorizontal: SIZES[6]
  },
  divider: {
    width: '100%',
    color: Colors.line,
    height: 1
  },
  txtDeadlineTitle: {
    ...Fonts.PoppinsRegular[14],
    color: Colors.secondary
  },
  txtChooseDate: {
    ...Fonts.PoppinsSemiBold[14],
    color: Colors.primary
  },
  chooseDateContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  deadlineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SIZES[24]
  },
  cancelBtnLayout: {
    backgroundColor: '#F3F6F9',
    marginBottom: SIZES[46]
  },
  txtCancelButton: {
    ...Fonts.PoppinsSemiBold[14],
    color: Colors.primary
  }
});
