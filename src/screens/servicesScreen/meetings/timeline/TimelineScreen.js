import {
  View,
  SafeAreaView,
  Text,
  TouchableOpacity,
  ScrollView,
  FlatList,
  useWindowDimensions
} from 'react-native';
import React, { useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import DeviceInfo from 'react-native-device-info';
import CalendarStrip from 'react-native-calendar-strip';
import { Divider } from 'react-native-paper';
import Timetable from 'react-native-calendar-timetable';
import moment from 'moment';

import { SIZES } from '../../../../themes/Sizes';
import { Colors } from '../../../../themes/Colors';
import Header from '../../../../component/header/Header';
import { Icon, IconName } from '../../../../component';
import { styles } from './styles';
import Avatar from '../../../../component/Avatar/Avatar';
import { Fonts } from '../../../../themes';
import { useQuery } from '@apollo/client';
import { GET_TIMELINE_REVIEW } from '../../../../graphql/query';
import Loader from '../../../../component/Loader/Loader';
import EventCalendar from 'react-native-events-calendar';

const TimelineScreen = () => {
  const { width, height } = useWindowDimensions();
  const navigation = useNavigation();
  const route = useRoute();
  const { selectedUsers } = route?.params;
  // console.log(' from timeline', selectedUsers);
  const userId = selectedUsers.map((user) => user.userId.toString()).join(',');
  console.log('userId', userId);

  const [date, setDate] = useState(new Date());
  const [selected, setSelected] = useState(false);
  const [event, setEvents] = useState(null);
  const [from] = useState(moment(event?.startTime).toDate());

  const [till] = useState(moment(event?.endTime).toISOString());

  const { data, error, loading } = useQuery(GET_TIMELINE_REVIEW, {
    variables: {
      startTime: `${moment(date).format('YYYY-MM-DD')} 00:00 AM `,
      endTime: `${moment(date).format('YYYY-MM-DD')} 11:59 PM `,
      date: moment(date).format('YYYY-MM-DD'),
      requiredUserIds: userId,
      optionalUserIds: '',
      timeStart: '00:00 AM',
      timeEnd: '11:59 PM'
    },
    onCompleted: (data) => {
      console.log('timeline review data', data.timeReviewMobile.userEvents);
      Object.keys(data.timeReviewMobile.userEvents).forEach(function (key) {
        var value = data.timeReviewMobile.userEvents[key];
        console.log('key', value);
        setEvents(value);
        // ...
      });
    },
    onError: (data) => {
      console.log('timeline error', data);
    }
  });

  const onEventClick = React.useCallback((event) => {
    console.log('pressed event', event.event.title);
    // toast({
    //   message: event.event.title
    // });
  }, []);

  // console.log('events', event);

  const range = { from, till };
  console.log('from', range);
  console.log('date value', moment(event?.endDate).toDate());
  console.log(moment().add(1, 'hour').toDate());
  const [items] = useState([
    {
      title: [
        { title: 'Some event' },
        { title: 'Business of Software Conference' },
        { title: 'ajay' },
        { title: 'ajay' },
        { title: 'ajay' },
        { title: 'ajay' }
      ],
      startDate: moment(event?.startTime).toDate(),
      // moment(event?.startTime, 'YYYY-MM-DD hh:mm a'),
      endDate: moment(event?.endTime).toDate(),
      color: '#FDF5F1',
      borderColor: '#E79D73'
    }
  ]);

  let datesWhitelist = [
    {
      start: moment(),
      end: moment().add(3, 'days') // total 4 days enabled
    }
  ];
  let datesBlacklist = [moment().add(1, 'days')];

  const events = [
    {
      start: '2022-11-26 00:30:00',
      end: '2022-11-26 01:30:00',
      title: 'Dr. Mariana Joseph',
      summary: '3412 Piedmont Rd NE, GA 3032',
      color: 'red'
    },
    {
      start: '2017-09-07 01:30:00',
      end: '2017-09-07 02:20:00',
      title: 'Dr. Mariana Joseph',
      summary: '3412 Piedmont Rd NE, GA 3032',
      color: 'red'
    },
    {
      start: '2017-09-07 04:10:00',
      end: '2017-09-07 04:40:00',
      title: 'Dr. Mariana Joseph',
      summary: '3412 Piedmont Rd NE, GA 3032',
      color: 'red'
    },
    {
      start: '2017-09-07 01:05:00',
      end: '2017-09-07 01:45:00',
      title: 'Dr. Mariana Joseph',
      summary: '3412 Piedmont Rd NE, GA 3032',
      color: 'red'
    },
    {
      start: '2017-09-07 14:30:00',
      end: '2017-09-07 16:30:00',
      title: 'Dr. Mariana Joseph',
      summary: '3412 Piedmont Rd NE, GA 3032',
      color: 'red'
    },
    {
      start: '2017-09-08 01:20:00',
      end: '2017-09-08 02:20:00',
      title: 'Dr. Mariana Joseph',
      summary: '3412 Piedmont Rd NE, GA 3032',
      color: 'red'
    },
    {
      start: '2017-09-08 04:10:00',
      end: '2017-09-08 04:40:00',
      title: 'Dr. Mariana Joseph',
      summary: '3412 Piedmont Rd NE, GA 3032',
      color: 'red'
    },
    {
      start: '2017-09-08 00:45:00',
      end: '2017-09-08 01:45:00',
      title: 'Dr. Mariana Joseph',
      summary: '3412 Piedmont Rd NE, GA 3032',
      color: 'red'
    },
    {
      start: '2017-09-08 11:30:00',
      end: '2017-09-08 12:30:00',
      title: 'Dr. Mariana Joseph',
      summary: '3412 Piedmont Rd NE, GA 3032',
      color: 'red'
    },
    {
      start: '2017-09-09 01:30:00',
      end: '2017-09-09 02:00:00',
      title: 'Dr. Mariana Joseph',
      summary: '3412 Piedmont Rd NE, GA 3032',
      color: 'red'
    },
    {
      start: '2017-09-09 03:10:00',
      end: '2017-09-09 03:40:00',
      title: 'Dr. Mariana Joseph',
      summary: '3412 Piedmont Rd NE, GA 3032',
      color: 'red'
    },
    {
      start: '2017-09-09 00:10:00',
      end: '2017-09-09 01:45:00',
      title: 'Dr. Mariana Joseph',
      summary: '3412 Piedmont Rd NE, GA 3032',
      color: 'red'
    }
  ];

  function MyItemCard({ style, item, dayIndex, daysTotal }) {
    return (
      <TouchableOpacity
        style={{
          ...style,
          backgroundColor: item.color,
          borderRadius: SIZES[8],
          // elevation: 5,
          width: width - 102,
          flexDirection: 'row'
        }}
        activeOpacity={0.9}
      >
        <View
          style={{
            backgroundColor: item.borderColor,
            width: SIZES[4],
            borderTopLeftRadius: SIZES[10],
            borderBottomLeftRadius: SIZES[10]
          }}
        />

        <FlatList
          // maxToRenderPerBatch={3}
          contentContainerStyle={{ paddingVertical: SIZES[8] }}
          initialNumToRender={3}
          data={
            DeviceInfo.isTablet()
              ? item.title.slice(0, 2)
              : item.title.slice(0, 3)
          }
          renderItem={({ item, index }) => {
            return (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginLeft: SIZES[4],
                  marginBottom: SIZES[4]
                }}
                key={index}
              >
                <Avatar
                  source={'https://picsum.photos/200/300'}
                  size={SIZES[24]}
                />
                <Text
                  style={{
                    ...Fonts.PoppinsSemiBold[14],
                    color: Colors.bold,
                    marginLeft: SIZES[8]
                  }}
                >
                  {item.title}
                </Text>
              </View>
            );
          }}
        />
        {/* {item.title.map((ite, index) => {
            return (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginLeft: SIZES[4],
                  marginBottom: SIZES[4]
                }}
                key={index}
              >
                <Avatar
                  source={'https://picsum.photos/200/300'}
                  size={SIZES[24]}
                />
                <Text
                  style={{
                    ...Fonts.PoppinsSemiBold[14],
                    color: Colors.bold,
                    marginLeft: SIZES[8]
                  }}
                >
                  {ite.title}
                </Text>
              </View>
            );
          })} */}

        <Text
          style={{
            position: 'absolute',
            bottom: SIZES[8],
            left: SIZES[12],
            zIndex: 20,
            ...Fonts.PoppinsRegular[12],
            color: Colors.secondary
          }}
        >
          10:00 - 12:10 PM - 12 users
        </Text>
      </TouchableOpacity>
    );
  }

  markedDatesArray = [
    {
      date: new Date(),
      dots: [
        {
          color: Colors.primary,
          selectedColor: Colors.white
        }
      ]
    },
    {
      date: new Date(),
      lines: [
        {
          color: Colors.primary
          // selectedColor: <string> (optional),
        }
      ]
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Header
        name={'Timeline'}
        rightIconName={IconName.Search}
        leftIconName={IconName.Arrow_Left}
        onLeftPress={() => navigation.goBack()}
      />

      <View style={styles.subContainer}>
        <TouchableOpacity
          style={styles.usersView}
          activeOpacity={0.5}
          onPress={() => navigation.navigate('SelectUser', { selectedUsers })}
        >
          <Text style={styles.txtUsers}>Users</Text>
          <View style={styles.btnCommittees}>
            <Text style={styles.txtBtnCommittees}>
              Selected {selectedUsers?.length} users
            </Text>
            <Icon
              name={IconName.Arrow_Right}
              height={SIZES[12]}
              width={SIZES[6]}
            />
          </View>
        </TouchableOpacity>
        <Divider style={styles.divider} />

        <CalendarStrip
          calendarAnimation={{ type: 'sequence', duration: 30 }}
          style={{ height: 100, marginTop: SIZES[16] }}
          calendarHeaderPosition={'above'}
          // calendarHeaderFormat={moment(date).format('MMMM DD,YYYY')}

          showMonth={false}
          dateNumberStyle={{ color: Colors.bold, ...Fonts.PoppinsSemiBold[14] }}
          dateNameStyle={{ color: '#AEB0B5', ...Fonts.PoppinsRegular[12] }}
          highlightDateNumberStyle={{
            color: Colors.white,
            ...Fonts.PoppinsSemiBold[14]
          }}
          highlightDateNameStyle={{
            color: Colors.white,
            ...Fonts.PoppinsRegular[12]
          }}
          disabledDateNameStyle={{ color: 'grey' }}
          disabledDateNumberStyle={{ color: 'grey' }}
          highlightDateContainerStyle={{
            backgroundColor: Colors.primary,
            height: 80,
            borderRadius: 10
          }}
          startingDate={new Date()}
          selectedDate={date}
          // datesWhitelist={datesWhitelist}
          // datesBlacklist={datesBlacklist}
          markedDates={markedDatesArray}
          onDateSelected={(date) => {
            setDate(new Date(date));
            console.log(date.toDate());
          }}
          scrollable={true}
          dayComponentHeight={100}
          dayContainerStyle={{
            height: 80,
            borderRadius: 10,
            alignSelf: 'center',

            zIndex: 20
          }}
        />
        {loading && <Loader />}
        <Text
          style={{
            ...Fonts.PoppinsBold[20],
            color: Colors.bold,
            marginBottom: SIZES[4]
          }}
        >
          {moment(date).format('MMMM DD,YYYY')}
        </Text>
        <Text
          style={{
            ...Fonts.PoppinsRegular[14],
            color: Colors.secondary,
            marginBottom: SIZES[24]
          }}
        >
          {event?.events.length} events
        </Text>
        <ScrollView style={{ flex: 1 }}>
          {/* <EventCalendar
            // eventTapped={this._eventTapped.bind(this)}
            events={events}
            width={width}
            initDate={date}
            renderEvent={(event) => <Text>{event.title}</Text>}
            eventTapped={console.log('event pressed')}
          /> */}
          <Timetable
            items={items}
            cardComponent={MyItemCard}
            date={date} // optional
            range={range} // optional
            // width={width - 40}
            hideNowLine={true}
            linesLeftInset={-5}
            linesTopOffset={20}
            timeWidth={50}
            enableSnapping={false}
            hourHeight={DeviceInfo.isTablet() ? 200 : 60}
          />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

export default TimelineScreen;
