import {
  View,
  Text,
  SafeAreaView,
  TouchableOpacity,
  FlatList,
  TextInput
} from 'react-native';
import React, { useContext, useState } from 'react';
import { Divider, Switch } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useQuery } from '@apollo/client';

import SubjectsCard from '../../../component/Cards/subjectCard/SubjectsCard';
import { SIZES } from '../../../themes/Sizes';
import MeetingsCard from '../../../component/Cards/MeetingdCard';
import { Button } from '../../../component/button/Button';
import { GET_All_MEETING, GET_All_SUBJECTS } from '../../../graphql/query';
import { Icon, IconName } from '../../../component';
import { Colors } from '../../../themes/Colors';
import Loader from '../../../component/Loader/Loader';
import { styles } from './styles';
import { Fonts } from '../../../themes';
import { UserContext } from '../../../context';

const DetailsScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();

  const { title, active } = route?.params;
  const [activeTab, setActiveTab] = useState(active);
  const [headerTitle, setHeaderTitle] = useState(title);
  const [search, setSearch] = useState(false);
  const [onlyMyMeetings, setOnlyMyMeetings] = useState(false);
  const [filterData, setFilterData] = useState([]);
  const [subjectData, setSubjectData] = useState([]);
  const [searchText, setSearchText] = useState('');
  const [meetingData, setMeetingData] = useState([]);
  const [filterMeetingData, setFilterMeetingData] = useState([]);
  const { committee } = useContext(UserContext);
  const [visibleIndex, setVisibleIndex] = useState(-1);
  const [isFetching, setIsFetching] = useState(false);
  console.log('commitee', committee);

  // get ALL SUBJECTS
  const {
    loading: SubjectsLoading,
    error: SubjectsError,
    data: SubjectsData
  } = useQuery(GET_All_SUBJECTS, {
    variables: {
      committeeId: committee?.organizationId,
      searchValue: searchText,
      screen: 0
    },

    onCompleted: (data) => {
      console.log('subjects', data?.subjects.items);
      setFilterData(data?.subjects.items);

      setSubjectData(data?.subjects.items);
    }
  });

  if (SubjectsError) {
    console.log('subjects error---', SubjectsError);
  }

  // get ALL MEETINGS
  const {
    loading: loadingGetMeetings,
    error: errorGetMeetings,
    data: dataGetMeetings
  } = useQuery(GET_All_MEETING, {
    variables: {
      onlyMyMeeting: onlyMyMeetings,
      committeeId: committee?.organizationId,
      screen: 0
    },
    onCompleted: (data) => {
      if (data) {
        console.log('meetings', data?.meetings.items);
        setFilterMeetingData(data?.meetings.items);

        setMeetingData(data?.meetings.items);
      }
    }
  });

  // if (dataGetMeetings) {
  //   console.log('dataGetMeetings---', dataGetMeetings.meetings.items);
  // }
  if (errorGetMeetings) {
    console.log('GetMeetings error---', errorGetMeetings.message);
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* header */}
      <TouchableOpacity
        style={{ flex: 1 }}
        onPress={() => setVisibleIndex(-1)}
        activeOpacity={1}
      >
        <View style={styles.headerContainer}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Icon
              name={IconName.Arrow_Left}
              height={SIZES[14]}
              width={SIZES[14]}
            />
          </TouchableOpacity>
          <Text style={styles.txtHeader}>{headerTitle}</Text>
          <View style={styles.headeRightView}>
            <TouchableOpacity
              style={styles.searchIconView}
              onPress={() => setSearch(!search)}
            >
              <Icon
                name={IconName.Search}
                height={SIZES[18]}
                width={SIZES[18]}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => {
                if (activeTab === '0') {
                  navigation.navigate('AddMeetingGeneral');
                } else if (activeTab === '1') {
                  navigation.navigate('AddSubject', { committee: null });
                }
              }}
            >
              <Icon name={IconName.Plus} height={SIZES[14]} width={SIZES[14]} />
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.subContainer}>
          {search ? (
            <View>
              <View style={styles.searchRowContainer}>
                <Icon
                  name={IconName.Search}
                  height={SIZES[12]}
                  width={SIZES[12]}
                />
                <TextInput
                  style={{ flex: 1, marginLeft: SIZES[6] }}
                  onChangeText={(text) => {
                    activeTab === '0'
                      ? setSearchText(text)
                      : activeTab === '1'
                      ? setSearchText(text)
                      : null;
                  }}
                  value={searchText}
                  placeholder={
                    activeTab === '0'
                      ? 'Search meeting'
                      : activeTab === '1'
                      ? 'Search subject'
                      : ''
                  }
                />
                <TouchableOpacity
                  onPress={() => {
                    setSearchText('');
                    setFilterData(subjectData);
                    setFilterMeetingData(meetingData);
                  }}
                >
                  <Icon
                    name={IconName.Close}
                    height={SIZES[8]}
                    width={SIZES[8]}
                  />
                </TouchableOpacity>
              </View>
              <Divider style={styles.divider} />
            </View>
          ) : (
            <View>
              {/* committes */}
              <TouchableOpacity
                style={styles.committeeView}
                activeOpacity={0.5}
                onPress={() => {
                  if (activeTab === '0') {
                    navigation.navigate('Committee', {
                      Data: filterMeetingData,
                      activeTab: '0'
                    });
                  } else if (activeTab === '1') {
                    navigation.navigate('Committee', {
                      Data: filterData,
                      activeTab: '1'
                    });
                  }
                  // navigation.navigate('Committee');
                }}
              >
                <Text style={styles.txtCommittee}>Committee</Text>
                <View style={styles.btnCommittees}>
                  <Text style={styles.txtBtnCommittees}>
                    {committee?.committeeTitle
                      ? committee?.committeeTitle
                      : 'All'}
                  </Text>
                  <Icon
                    name={IconName.Arrow_Right}
                    height={SIZES[12]}
                    width={SIZES[6]}
                  />
                </View>
              </TouchableOpacity>

              <Divider style={[styles.divider, { marginLeft: SIZES[16] }]} />
              <View style={styles.btnContainer}>
                <Button
                  title={'Meetings'}
                  layoutStyle={[
                    styles.btnServices,
                    {
                      backgroundColor:
                        activeTab === '0' ? Colors.white : 'transparent'
                    }
                  ]}
                  textStyle={styles.txtBtnServices}
                  onPress={() => {
                    setActiveTab('0');
                    setHeaderTitle('Meetings');
                  }}
                />

                <Button
                  title={'Subjects'}
                  layoutStyle={[
                    styles.btnServices,
                    {
                      backgroundColor:
                        activeTab === '1' ? Colors.white : 'transparent'
                    }
                  ]}
                  textStyle={styles.txtBtnServices}
                  onPress={() => {
                    setActiveTab('1');
                    setHeaderTitle('Subjects');
                  }}
                />
                <Button
                  title={'Delegations'}
                  layoutStyle={[
                    styles.btnServices,
                    {
                      backgroundColor:
                        activeTab === '2' ? Colors.white : 'transparent'
                    }
                  ]}
                  textStyle={styles.txtBtnServices}
                  onPress={() => {
                    setActiveTab('2');
                    setHeaderTitle('Delegations');
                  }}
                />
              </View>
              <Divider style={styles.divider} />
            </View>
          )}

          {/* meetings list */}

          {activeTab === '0' && (
            <View style={{ flex: 1 }}>
              <View style={styles.switchContainer}>
                <Text style={styles.txtSwitchLabel}>Only my meetings</Text>
                <Switch
                  color={Colors.switch}
                  value={onlyMyMeetings}
                  onChange={() => setOnlyMyMeetings(!onlyMyMeetings)}
                />
              </View>
              <Divider style={styles.divider} />
              {loadingGetMeetings ? (
                <Loader />
              ) : errorGetMeetings ? (
                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Text
                    style={{ ...Fonts.PoppinsBold[20], color: Colors.primary }}
                  >
                    {errorGetMeetings.message}
                  </Text>
                </View>
              ) : filterMeetingData.length > 0 ? (
                <FlatList
                  data={
                    // meetingsData
                    filterMeetingData
                  }
                  keyExtractor={(item, index) => `${item.meetingId}`}
                  renderItem={({ item, index }) => (
                    <MeetingsCard
                      item={item}
                      index={index}
                      text={searchText}
                      visibleIndex={visibleIndex}
                      setVisibleIndex={setVisibleIndex}
                    />
                  )}
                  showsVerticalScrollIndicator={false}
                />
              ) : (
                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Text
                    style={{ ...Fonts.PoppinsBold[20], color: Colors.primary }}
                  >
                    No meetings found
                  </Text>
                </View>
              )}
            </View>
          )}

          {/* subjects list */}

          {activeTab === '1' && (
            <TouchableOpacity
              style={{ flex: 1 }}
              // onPress={() => setEditModal(false)}
            >
              {SubjectsLoading ? (
                <Loader />
              ) : SubjectsError ? (
                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Text
                    style={{ ...Fonts.PoppinsBold[20], color: Colors.primary }}
                  >
                    {SubjectsError.message}
                  </Text>
                </View>
              ) : filterData.length > 0 ? (
                <FlatList
                  data={filterData}
                  keyExtractor={(item, index) => `$subject-${index}`}
                  renderItem={({ item, index }) => (
                    <SubjectsCard
                      item={item}
                      index={index}
                      searchText={searchText}
                      search={search}
                      visibleIndex={visibleIndex}
                      setVisibleIndex={setVisibleIndex}
                    />
                  )}
                  showsVerticalScrollIndicator={false}
                />
              ) : (
                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}
                >
                  <Text
                    style={{ ...Fonts.PoppinsBold[20], color: Colors.primary }}
                  >
                    No subjects found
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default DetailsScreen;
