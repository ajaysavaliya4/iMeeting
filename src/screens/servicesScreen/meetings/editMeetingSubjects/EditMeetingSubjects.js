import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList
} from 'react-native';
import React, { useContext, useEffect, useState } from 'react';
import * as Progress from 'react-native-progress';
import DeviceInfo from 'react-native-device-info';
import { useNavigation, useRoute } from '@react-navigation/native';
import Voice from '@react-native-community/voice';

import Header from '../../../../component/header/Header';
import { Icon, IconName } from '../../../../component';
import { Colors } from '../../../../themes/Colors';
import { styles } from './styles';
import { SIZES } from '../../../../themes/Sizes';
import { Divider } from 'react-native-paper';
import { Button } from '../../../../component/button/Button';
import { useMutation, useQuery } from '@apollo/client';
import { GET_All_MEETING, GET_All_SUBJECTS } from '../../../../graphql/query';
import { UPDATE_MEETING } from '../../../../graphql/mutation';
import { UserContext } from '../../../../context';
import AddSubjectsCard from '../addMeetingSubjects/AddSubjectsCard';

const EditMeetingSubjects = () => {
  const navigation = useNavigation();
  const route = useRoute();

  const { selectedSubjects } = useContext(UserContext);
  const {
    attachFiles,
    committee,
    title,
    discription,
    users,
    userRequired,
    startDate,
    endDate,
    startTime,
    endTime,
    TimeZone,
    Repeat,
    platform,
    location,
    item
  } = route?.params;
  console.log('meeting data from add meeting subjects', {
    attachFiles,
    committee,
    title,
    discription,
    users,
    userRequired,
    startDate,
    endDate,
    startTime,
    endTime,
    TimeZone,
    Repeat,
    platform,
    location,
    item
  });

  console.log('selected subjects from add meeting subjects', selectedSubjects);
  const [calendarValue, setCalendarValue] = useState('5-11 September');
  const [searchText, setSearchText] = useState('');
  const [filterData, setFilterData] = useState(selectedSubjects);
  const [subjectData, setSubjectData] = useState(selectedSubjects);
  const [subjectsId, setSubjectsId] = useState([]);
  const [user, setUsers] = useState([]);
  const [visibleIndex, setVisibleIndex] = useState(-1);
  const [openIndex, setOpenIndex] = useState(-1);

  useEffect(() => {
    const user = selectedSubjects?.map((item) => item.user);
    console.log('userId', user);
    setUsers(user);
  }, [selectedSubjects]);

  // useEffect(() => {
  //   if (selectedSubjects.length > 0) {
  //     const subjectId = selectedSubjects?.map((subject) => {
  //       return subject.subjectId;
  //     });
  //     subjectsId.push(subjectId);
  //   }
  // }, [selectedSubjects]);
  // console.log('subjectId', subjectsId);

  const searchFilterSubject = (text) => {
    if (text) {
      const newData = selectedSubjects.filter((item) => {
        const itemData = item.subjectTitle ? item.subjectTitle : '';
        const textData = text;
        return itemData.indexOf(textData) > -1;
      });

      setSearchText(text);
      setFilterData(newData);
    } else {
      setSearchText(text);
      setFilterData(selectedSubjects);
    }
  };

  // get ALL SUBJECTS
  const {
    loading: SubjectsLoading,
    error: SubjectsError,
    data: SubjectsData
  } = useQuery(GET_All_SUBJECTS, {
    variables: {
      searchValue: searchText,
      screen: 1,
      committeeId: committee
    },

    onCompleted: (data) => {
      setFilterData(data?.subjects.items);
      console.log(data.subjects.items, 'commiitee by id');
      setSubjectData(data?.subjects.items);
    }
  });

  if (SubjectsError) {
    console.log('subjects error---', SubjectsError);
  }

  const [addMeeting, { data, loading, error }] = useMutation(UPDATE_MEETING, {
    // export const GET_All_SUBJECTS = gql`
    refetchQueries: [
      {
        query: GET_All_MEETING,
        variables: {
          onlyMyMeeting: false,
          screen: 0
        }
      }
    ],
    onCompleted: (data) => {
      if (data.updateMeeting.status[0].statusCode == '200') {
        navigation.navigate('Details', {
          title: 'Meetings',
          active: '0'
        });
      }
    }
  });
  if (data) {
    console.log('addmeeting data', data.updateMeeting);
  }
  if (error) {
    console.log('addmeeting error--', error);
  }

  return (
    <SafeAreaView style={styles.container}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={() => setVisibleIndex(-1)}
        style={{ flex: 1 }}
      >
        <Header
          name={'Edit meeting'}
          rightIconName={IconName.Close}
          onRightPress={() => navigation.goBack()}
        />
        <View style={styles.subContainer}>
          <View style={styles.progressContainer}>
            <Progress.Bar
              color={Colors.switch}
              progress={1}
              borderColor={Colors.white}
              unfilledColor={'#e6e7e9'}
              width={DeviceInfo.isTablet() ? 800 : 264}
            />
            <Text style={styles.txtProgress}>Step 5/5</Text>
          </View>
          <Text style={styles.txtAddSubjectTitle}>Subjects</Text>

          <View style={styles.searchContainer}>
            <Icon name={IconName.Search} height={SIZES[12]} width={SIZES[12]} />
            <TextInput
              style={styles.textInput}
              placeholder={'Search'}
              onChangeText={(text) => searchFilterSubject(text)}
            />
            <TouchableOpacity>
              <Icon
                name={IconName.Speaker}
                height={SIZES[15]}
                width={SIZES[10]}
              />
            </TouchableOpacity>
          </View>
          <Divider style={styles.divider} />

          <ScrollView showsVerticalScrollIndicator={false}>
            <FlatList
              data={selectedSubjects}
              keyExtractor={(item, index) => {
                return `${item.subjectId}`;
              }}
              renderItem={({ item, index }) => {
                return (
                  <AddSubjectsCard
                    item={item}
                    searchText={searchText}
                    index={index}
                    visibleIndex={visibleIndex}
                    setVisibleIndex={setVisibleIndex}
                    openIndex={openIndex}
                    setOpenIndex={setOpenIndex}
                  />
                );
              }}
            />
            {/* {selectedSubjects?.map((subject, index) => {
              return (
                <AddSubjectsCard
                  item={subject}
                  searchText={searchText}
                  index={index}
                  visibleIndex={visibleIndex}
                  setVisibleIndex={setVisibleIndex}
                />
              );
            })} */}
            <View style={styles.deadlineContainer}>
              <Text style={styles.txtTitle}>DEADLINE SUGGESTING</Text>
              <TouchableOpacity
                style={styles.deadlineRowContainer}
                onPress={() => navigation.navigate('DeadlineSuggestion')}
              >
                <TextInput value={calendarValue} editable={false} />
                <Icon
                  name={IconName.Calendar}
                  width={SIZES[18]}
                  height={SIZES[20]}
                />
              </TouchableOpacity>

              <Divider style={styles.divider} />
              <Button
                title={'Select subjects'}
                layoutStyle={styles.selectsubjectBtnLayout}
                textStyle={styles.txtCancelButton}
                onPress={() =>
                  navigation.navigate('SelectSubjects', {
                    committee: committee
                  })
                }
              />
            </View>
          </ScrollView>
        </View>
        <View
          style={{
            backgroundColor: Colors.white,
            justifyContent: 'flex-end'
          }}
        >
          {/* Divider */}
          <Divider style={styles.divider} />
          <View
            style={[styles.buttonContainer, { paddingHorizontal: SIZES[16] }]}
          >
            <Button
              title={'Back'}
              onPress={() => navigation.goBack()}
              layoutStyle={styles.cancelBtnLayout}
              textStyle={styles.txtCancelButton}
            />
            <Button
              title={'Submit'}
              onPress={() => {
                console.log('data on press', {
                  attachFiles,
                  committee,
                  discription,
                  endDate,
                  endTime,
                  location,
                  title,
                  platformlink: platform.platformlink,
                  platformId: platform.platformId,
                  Repeat,
                  startDate,
                  startTime,
                  subjectid: subjectsId[0],
                  TimeZone,
                  users
                });
                addMeeting({
                  variables: {
                    meeting: {
                      attachFileIds: attachFiles,
                      committeeId: committee,
                      creatorName: '',
                      description: discription,
                      endDate: endDate,
                      endTime: endTime,
                      locationId: location,
                      meetingId: item.meetingId,
                      meetingTitle: title,
                      platformlink: platform.platformlink,
                      platformId: platform.platformId,
                      repeat: 0,
                      repeatName: Repeat,
                      required: userRequired,
                      setDate: startDate,
                      setTime: startTime,
                      subjectIds: subjectsId[0],
                      timeZone: TimeZone,
                      userIds: users,
                      subjectStatusIds: [],
                      meetingStatusId: 0
                    }
                  }
                });
              }}
              layoutStyle={[
                // {
                //     opacity: title === "" || discription === "" ? 0.5 : null,
                // },
                styles.nextBtnLayout
              ]}
              textStyle={styles.txtNextBtn}
            />
          </View>
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default EditMeetingSubjects;
