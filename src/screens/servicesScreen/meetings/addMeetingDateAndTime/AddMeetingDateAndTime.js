import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  TouchableOpacity,
  ScrollView
} from 'react-native';
import React, { useState } from 'react';
import * as Progress from 'react-native-progress';
import { useNavigation, useRoute } from '@react-navigation/native';
import DeviceInfo from 'react-native-device-info';
import DateTimePickerModal from 'react-native-modal-datetime-picker';
import RNDateTimePicker from '@react-native-community/datetimepicker';

import Header from '../../../../component/header/Header';
import { Icon, IconName } from '../../../../component';
import { styles } from './styles';
import { Colors } from '../../../../themes/Colors';
import { SIZES } from '../../../../themes/Sizes';
import { Divider } from 'react-native-paper';
import moment from 'moment';
import DropDownPicker from 'react-native-dropdown-picker';
import { Fonts } from '../../../../themes';
import { Button } from '../../../../component/button/Button';
import { useQuery } from '@apollo/client';
import { GET_TIMEZONE } from '../../../../graphql/query';

const AddMeetingDateAndTime = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { attachFiles, committee, title, discription, users, userRequired } =
    route?.params;
  console.log('meeting data from date and time', {
    attachFiles,
    committee,
    title,
    discription,
    users,
    userRequired
  });
  const [startDate, setStartdate] = useState(
    moment(new Date()).format('DD MMM,YYYY')
  );
  const [startNewDate, setStartNewDate] = useState(
    moment(new Date()).format('YYYY-MM-DD')
  );
  const [startTime, setStartTime] = useState(moment(new Date()).format('LT'));
  const [endDate, setEnddate] = useState(startDate);
  const [endNewDate, setEndNewdate] = useState(
    moment(new Date()).format('YYYY-MM-DD')
  );
  const [endTime, setEndTime] = useState(moment(new Date()).format('LT'));
  const [date, setDate] = useState(new Date());
  const [dates, setDates] = useState(new Date());
  const [time, setTime] = useState(new Date());
  const [times, setTimes] = useState(new Date());
  const [timeZone, setTimeZone] = useState([]);
  const [openCalendar, setOpenCalendar] = useState(false);
  const [openClock, setOpenClock] = useState(false);
  const [value, setValue] = useState('');
  const [openTimeZone, setOpenTimeZone] = useState(false);
  const [openRepeat, setOpenRepeat] = useState(false);
  const [valueRepeat, setValueRepeat] = useState(null);
  const [valueTimeZone, setValueTimeZone] = useState(null);
  const [items, setItems] = useState([
    { label: 'GMT_8 (USA)', value: 'GMT_8 (USA)' }
  ]);

  const handleConfirmClock = (date) => {
    console.log('A time has been picked: ', date);

    const time = moment(date).format('LT');
    console.log('time', time);
    if (value == 'startTime') {
      setStartTime(time);
      setTime(date);
      setEndTime(time);
      setTimes(date);
    }
    if (value == 'endTime') {
      setEndTime(time);
      setTime(date);
    }
    setOpenClock(false);
  };
  const handleConfirmCalendar = (date) => {
    setOpenCalendar(false);
    const Date = moment(date).format('DD MMM,YYYY');
    const newDate = moment(date).format('YYYY-MM-DD');

    if (value == 'startDate') {
      setStartdate(Date);
      setStartNewDate(newDate);
      setDates(date);
      setEnddate(Date);
      setDate(date);
    }
    if (value == 'endDate') {
      setEnddate(Date);
      setEndNewdate(newDate);
      setDate(date);
    }
  };

  const TimeZone = useQuery(GET_TIMEZONE, {
    onCompleted: (data) => {
      console.log(data.timeZone.items);
      if (data) {
        setTimeZone(data.timeZone.items);
      }
    },
    onError: (data) => {
      console.log('timezone error', data);
    }
  });

  return (
    <SafeAreaView style={styles.container}>
      <Header
        name={'Add meeting'}
        rightIconName={IconName.Close}
        onRightPress={() =>
          navigation.navigate('Details', {
            title: 'Meetings',
            active: '0'
          })
        }
      />
      <ScrollView style={styles.subContainer}>
        <View style={styles.progressContainer}>
          <Progress.Bar
            color={Colors.switch}
            progress={0.6}
            borderColor={Colors.white}
            unfilledColor={'#e6e7e9'}
            width={DeviceInfo.isTablet() ? 800 : 264}
          />
          <Text style={styles.txtProgress}>Step 3/5</Text>
        </View>

        <Text style={styles.txtAddSubjectTitle}>Date & Time</Text>
        <View style={styles.dateTimeContainer}>
          <Text style={styles.txtTitle}>START DATE</Text>
          <View style={styles.dateTimeRowView}>
            <TouchableOpacity
              style={styles.dateContainer}
              onPress={() => {
                setOpenCalendar(!openCalendar);
                setOpenClock(false);
                setValue('startDate');
              }}
            >
              <TextInput
                style={styles.textInput}
                value={startDate}
                editable={false}
              />

              <Icon
                name={IconName.Calendar}
                height={SIZES[20]}
                width={SIZES[18]}
              />
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.dateContainer}
              onPress={() => {
                setOpenClock(!openClock);
                setOpenCalendar(false);
                setValue('startTime');
              }}
            >
              <TextInput
                style={styles.textInput}
                value={startTime}
                editable={false}
              />

              <Icon
                name={IconName.Arrow_Down}
                height={SIZES[6]}
                width={SIZES[12]}
              />
            </TouchableOpacity>
          </View>
          <Text style={[styles.txtTitle, { marginTop: SIZES[24] }]}>
            END DATE
          </Text>
          <View style={styles.dateTimeRowView}>
            <TouchableOpacity
              style={styles.dateContainer}
              onPress={() => {
                setOpenCalendar(!openCalendar);
                setOpenClock(false);
                setValue('endDate');
              }}
            >
              <TextInput
                style={styles.textInput}
                value={endDate}
                editable={false}
              />

              <Icon
                name={IconName.Calendar}
                height={SIZES[20]}
                width={SIZES[18]}
              />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.dateContainer}
              onPress={() => {
                setOpenClock(!openClock);
                setOpenCalendar(false);
                setValue('endTime');
              }}
            >
              <TextInput
                style={styles.textInput}
                value={endTime}
                editable={false}
              />

              <Icon
                name={IconName.Arrow_Down}
                height={SIZES[6]}
                width={SIZES[12]}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.timezoneContainer}>
            <Text style={styles.txtTitle}>TIMEZONE</Text>
            <DropDownPicker
              listMode="SCROLLVIEW"
              dropDownDirection="TOP"
              open={openTimeZone}
              value={valueTimeZone}
              items={timeZone?.map((item) => ({
                label: item.timeZone,
                value: item.timeZoneId
              }))}
              arrowIconStyle={{
                height: SIZES[12],
                width: SIZES[14]
              }}
              setOpen={() => {
                setOpenRepeat(false);
                setOpenTimeZone(!openTimeZone);
              }}
              setValue={setValueTimeZone}
              setItems={setItems}
              placeholder={''}
              placeholderStyle={{
                ...Fonts.PoppinsRegular[12],
                color: Colors.secondary
              }}
              style={{
                borderWidth: 0,
                paddingRight: SIZES[16],
                paddingLeft: 0,
                flex: 1
              }}
              textStyle={{ ...Fonts.PoppinsRegular[14] }}
            />
            <Divider style={styles.divider} />
          </View>
          <View style={styles.repeatContainer}>
            <Text style={styles.txtTitle}>REPEAT</Text>
            <DropDownPicker
              listMode="SCROLLVIEW"
              dropDownDirection="TOP"
              open={openRepeat}
              value={valueRepeat}
              items={[
                {
                  label: "Dosen't repeat",
                  value: 0
                },
                {
                  label: 'Repeat daily',
                  value: 1
                },
                {
                  value: 2,
                  label: 'Repeat weekly'
                },
                {
                  value: 3,
                  label: 'Repeat monthly'
                },
                {
                  value: 4,
                  label: 'Repeat yearly'
                }
              ]}
              arrowIconStyle={{
                height: SIZES[12],
                width: SIZES[14]
              }}
              setOpen={() => {
                setOpenTimeZone(false);
                setOpenRepeat(!openRepeat);
              }}
              setValue={setValueRepeat}
              setItems={setItems}
              placeholder={''}
              placeholderStyle={{
                ...Fonts.PoppinsRegular[12],
                color: Colors.secondary
              }}
              style={{
                borderWidth: 0,
                paddingRight: SIZES[16],
                paddingLeft: 0
              }}
              textStyle={{ ...Fonts.PoppinsRegular[14] }}
            />
            <Divider style={styles.divider} />
          </View>
        </View>
        <DateTimePickerModal
          isVisible={openCalendar}
          mode="date"
          onConfirm={handleConfirmCalendar}
          onCancel={() => setOpenCalendar(false)}
          minimumDate={value === 'startDate' ? new Date() : dates}
          date={value === 'startDate' ? dates : date}
          timePickerModeAndroid="spinner"
        />

        <DateTimePickerModal
          isVisible={openClock}
          mode="time"
          onConfirm={handleConfirmClock}
          onCancel={() => setOpenClock(false)}
          minimumDate={value == 'startTime' ? new Date() : times}
          date={value == 'startTime' ? times : time}
          is24Hour={true}
        />
      </ScrollView>
      <View
        style={{
          backgroundColor: Colors.white,
          justifyContent: 'flex-end'
        }}
      >
        {/* Divider */}
        <Divider style={styles.divider} />
        <View style={styles.buttonContainer}>
          <Button
            title={'Back'}
            onPress={() => navigation.goBack()}
            layoutStyle={styles.cancelBtnLayout}
            textStyle={styles.txtCancelButton}
          />
          <Button
            title={'Next'}
            onPress={() =>
              navigation.navigate('AddMeetingLocation', {
                attachFiles,
                committee,
                title,
                discription,
                users,
                userRequired,
                startDate: startNewDate,
                endDate: endNewDate,
                startTime: startTime,
                endTime: endTime,
                TimeZone: valueTimeZone,
                Repeat: valueRepeat
              })
            }
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
    </SafeAreaView>
  );
};

export default AddMeetingDateAndTime;
