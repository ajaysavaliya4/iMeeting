import { Text, View } from 'react-native';
import React from 'react';
import DeviceInfo from 'react-native-device-info';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';

import DashboardScreen from './src/screens/dashboardScreen/DashboardScreen';
import ServicesScreen from './src/screens/servicesScreen/ServicesScreen';
import CalenderScreen from './src/screens/calenderScreen/CalenderScreen';
import ProfileScreen from './src/screens/profileScreen/ProfileScreen';
import LoginScreen from './src/screens/authScreen/loginScreen/LoginScreen';
import CreateAccount from './src/screens/authScreen/createAccount/CreateAccountStep1';
import CreateAccountStep2 from './src/screens/authScreen/createAccount/CreateAccountStep2';
import CreateAccountStep3 from './src/screens/authScreen/createAccount/CreateAccountStep3';
import MailNotification from './src/screens/authScreen/createAccount/MailNotification';
import { Icon, IconName } from './src/component';
import { Colors } from './src/themes/Colors';
import { Fonts } from './src/themes';
import CommitteesDetails from './src/screens/dashboardScreen/CommitteesDetails';
import StatisticScreen from './src/screens/dashboardScreen/StatisticScreen';
import CommitteeScreen from './src/screens/dashboardScreen/CommitteeScreen';
import SubjectDownload from './src/screens/servicesScreen/subjects/subjectDowmload/SubjectDownload';
import AddMeetingGeneralScreen from './src/screens/servicesScreen/meetings/addMeetingGeneral/AddMeetingGeneral';
import AddMeetingUser from './src/screens/servicesScreen/meetings/addMeetingUser/AddMeetingUser';
import TimelineScreen from './src/screens/servicesScreen/meetings/timeline/TimelineScreen';
import SelectUsers from './src/screens/SelectUsers';
import AddExternalUser from './src/screens/servicesScreen/meetings/addExternalUser/AddExternalUser';
import { SIZES } from './src/themes/Sizes';
import DetailsScreen from './src/screens/servicesScreen/detailsScreen/DetailsScreen';
import AddSubjectScreen from './src/screens/servicesScreen/subjects/addSubjects/AddSubjectScreen';
import EditSubjectScreen from './src/screens/servicesScreen/subjects/editSubject/EditSubjectScreen';
import SubjectDetails from './src/screens/servicesScreen/subjects/subjectDetails/SubjectDetails';
import AddMeetingDateAndTime from './src/screens/servicesScreen/meetings/addMeetingDateAndTime/AddMeetingDateAndTime';
import AddMeetingLocation from './src/screens/servicesScreen/meetings/addMeetingLocation/AddMeetingLocation';
import LocationDetails from './src/screens/servicesScreen/meetings/locationDetails/LocationDetails';
import AddLocation from './src/screens/servicesScreen/meetings/addLocation/AddLocation';
import AddMeetingSubjects from './src/screens/servicesScreen/meetings/addMeetingSubjects/AddMeetingSubjects';
import DeadlineSuggestion from './src/screens/servicesScreen/meetings/deadlineSuggestion/DeadlineSuggestion';
import SelectSubjects from './src/screens/servicesScreen/meetings/selectSubjects/SelectSubjects';
import Role from './src/screens/servicesScreen/meetings/role/Role';
import AppointmentsList from './src/screens/servicesScreen/appointments/appointmetList/AppointmentsList';
import MeetingDetails from './src/screens/servicesScreen/meetings/meetingDetails/MeetingDetails';
import Users from './src/screens/servicesScreen/meetings/users/Users';
import AddAppointmentGeneral from './src/screens/servicesScreen/appointments/addAppointmentGeneral/AddAppointmentGeneral';
import AddAppointmentUsers from './src/screens/servicesScreen/appointments/addAppointmentUsers/AddAppointmentUsers';
import AddAppointmentDateAndTime from './src/screens/servicesScreen/appointments/addAppointmentDateAndTime/AddAppointmentDateAndTime';
import AddAppointmentLocation from './src/screens/servicesScreen/appointments/addAppointmentLocation/AddAppointmentLocation';
import AddSubjectCategory from './src/screens/servicesScreen/subjects/addSubjectCategory/AddSubjectCategory';
import EditLocation from './src/screens/servicesScreen/meetings/editLocation/EditLocation';
import EditMeetingGeneralScreen from './src/screens/servicesScreen/meetings/editMeetingGeneral /EditMeetingGeneral';
import EditMeetingUser from './src/screens/servicesScreen/meetings/editMeetingUser/EditMeetingUser';
import EditMeetingDateAndTime from './src/screens/servicesScreen/meetings/editMeetingDateAndTime/EditMeetingDateAndTime';
import EditMeetingLocation from './src/screens/servicesScreen/meetings/editMeetingLocation/EditMeetingLocation';
import EditMeetingSubjects from './src/screens/servicesScreen/meetings/editMeetingSubjects/EditMeetingSubjects';
import YourAnswer from './src/screens/servicesScreen/meetings/yourAnswer/YourAnswer';
import Subjects from './src/screens/servicesScreen/Subjects';
import AddDraftSubject from './src/screens/servicesScreen/subjects/addDraftSybject/AddDraftSubject';
import EditAppointmentDateAndTime from './src/screens/servicesScreen/appointments/EditAppointmentDateAndTime /EditAppointmentDateAndTime';
import EditAppointmentGeneral from './src/screens/servicesScreen/appointments/EditAppointmentGeneral/EditAppointmentGeneral';
import EditAppointmentLocation from './src/screens/servicesScreen/appointments/EditAppointmentLocation/EditAppointmentLocation';
import EditAppointmentUsers from './src/screens/servicesScreen/appointments/EditAppointmentUsers/EditAppointmentUsers';
import SelectUser from './src/screens/servicesScreen/meetings/selectUser/SelectUser';
import AppointmentsDetails from './src/screens/servicesScreen/appointments/appointmentDetails/AppointmentDetails';
import TasksList from './src/screens/servicesScreen/tasks/tasksList/TasksList';
import FilterTask from './src/screens/servicesScreen/tasks/filterTask/FilterTask';

const bottomTab = createBottomTabNavigator();
const Stack = createStackNavigator();

const MainBottomTab = () => {
  return (
    <bottomTab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          borderTopWidth: 1,
          borderTopColor: '#e6e7e9',
          backgroundColor: Colors.white
        },
        tabBarShowLabel: false
      }}
      initialRouteName="ServicesStack"
    >
      <bottomTab.Screen
        name="DashboardStack"
        component={DashboardScreen}
        options={{
          tabBarIcon: ({ focused }) => {
            return (
              <View
                style={{
                  borderTopColor: focused ? Colors.primary : null,
                  borderTopWidth: focused ? SIZES[1] : 0,
                  width: DeviceInfo.isTablet() ? '400%' : '90%',
                  alignItems: 'center',
                  justifyContent: DeviceInfo.isTablet()
                    ? 'space-between'
                    : 'center',
                  height: '100%',
                  flexDirection: DeviceInfo.isTablet() ? 'row' : null
                }}
              >
                <Icon
                  name={
                    focused ? IconName.Dashboard_Focused : IconName.Dashboard
                  }
                  height={SIZES[20]}
                  width={SIZES[20]}
                />
                <Text
                  style={{
                    ...Fonts.PoppinsRegular[10],
                    color: Colors.secondary
                  }}
                >
                  Dashboard
                </Text>
              </View>
            );
          },
          tabBarActiveTintColor: Colors.primary,
          tabBarLabelStyle: { ...Fonts.PoppinsRegular[10] }
        }}
      />
      <bottomTab.Screen
        name="ServicesStack"
        options={{
          tabBarIcon: ({ focused }) => {
            return (
              <View
                style={{
                  borderTopColor: focused ? Colors.primary : null,
                  borderTopWidth: focused ? SIZES[1] : 0,
                  width: DeviceInfo.isTablet() ? '400%' : '90%',
                  alignItems: 'center',
                  justifyContent: DeviceInfo.isTablet()
                    ? 'space-between'
                    : 'center',
                  height: '100%',
                  flexDirection: DeviceInfo.isTablet() ? 'row' : null
                }}
              >
                <Icon
                  name={focused ? IconName.Services_Focused : IconName.Services}
                  height={SIZES[20]}
                  width={SIZES[20]}
                />
                <Text
                  style={{
                    ...Fonts.PoppinsRegular[10],
                    color: Colors.secondary
                  }}
                >
                  Services
                </Text>
              </View>
            );
          },
          tabBarActiveTintColor: Colors.primary,
          tabBarLabelStyle: { ...Fonts.PoppinsRegular[10] }
        }}
        component={ServicesScreen}
      />
      <bottomTab.Screen
        name="CalenderStack"
        options={{
          tabBarIcon: ({ focused }) => {
            return (
              <View
                style={{
                  borderTopColor: focused ? Colors.primary : null,
                  borderTopWidth: focused ? SIZES[1] : 0,
                  width: DeviceInfo.isTablet() ? '400%' : '90%',
                  alignItems: 'center',
                  justifyContent: DeviceInfo.isTablet()
                    ? 'space-between'
                    : 'center',
                  height: '100%',
                  flexDirection: DeviceInfo.isTablet() ? 'row' : null
                }}
              >
                <Icon
                  name={focused ? IconName.Calendar_Focused : IconName.Calendar}
                  height={SIZES[20]}
                  width={SIZES[20]}
                />
                <Text
                  style={{
                    ...Fonts.PoppinsRegular[10],
                    color: Colors.secondary
                  }}
                >
                  Calendar
                </Text>
              </View>
            );
          },
          tabBarActiveTintColor: Colors.primary,
          tabBarLabelStyle: { ...Fonts.PoppinsRegular[10] }
        }}
        component={CalenderScreen}
      />
      <bottomTab.Screen
        name="ProfileStack"
        options={{
          tabBarIcon: ({ focused }) => {
            return (
              <View
                style={{
                  borderTopColor: focused ? Colors.primary : null,
                  borderTopWidth: focused ? SIZES[1] : 0,
                  width: DeviceInfo.isTablet() ? '350%' : '90%',
                  alignItems: 'center',
                  justifyContent: DeviceInfo.isTablet()
                    ? 'space-between'
                    : 'center',
                  height: '100%',
                  flexDirection: DeviceInfo.isTablet() ? 'row' : null
                }}
              >
                <Icon
                  name={focused ? IconName.Account_Focused : IconName.Account}
                  height={SIZES[20]}
                  width={SIZES[20]}
                />
                <Text
                  style={{
                    ...Fonts.PoppinsRegular[10],
                    color: Colors.secondary
                  }}
                >
                  Profile
                </Text>
              </View>
            );
          },
          tabBarActiveTintColor: Colors.primary,
          tabBarLabelStyle: { ...Fonts.PoppinsRegular[10] }
        }}
        component={ProfileScreen}
      />
    </bottomTab.Navigator>
  );
};

const MainStack = ({ initialRouteName }) => {
  return (
    <Stack.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="MainBottomTab" component={MainBottomTab} />
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="CreateAccount" component={CreateAccount} />
      <Stack.Screen name="Step2" component={CreateAccountStep2} />
      <Stack.Screen name="Step3" component={CreateAccountStep3} />
      <Stack.Screen name="Mail Notification" component={MailNotification} />
      <Stack.Screen name="CommitteeDetails" component={CommitteesDetails} />
      <Stack.Screen name="Statistic" component={StatisticScreen} />
      <Stack.Screen name="Committee" component={CommitteeScreen} />
      <Stack.Screen name="Details" component={DetailsScreen} />
      <Stack.Screen name="AddSubject" component={AddSubjectScreen} />
      <Stack.Screen name="AddSubjectCategory" component={AddSubjectCategory} />
      <Stack.Screen name="AddDraftSubject" component={AddDraftSubject} />
      <Stack.Screen name="SubjectDetails" component={SubjectDetails} />
      <Stack.Screen name="EditSubject" component={EditSubjectScreen} />
      <Stack.Screen name="SubjectDownload" component={SubjectDownload} />
      <Stack.Screen
        name="AddMeetingGeneral"
        component={AddMeetingGeneralScreen}
      />
      <Stack.Screen
        name="EditMeetingGeneral"
        component={EditMeetingGeneralScreen}
      />
      <Stack.Screen name="AddMeetingUser" component={AddMeetingUser} />
      <Stack.Screen name="EditMeetingUser" component={EditMeetingUser} />
      <Stack.Screen
        name="AddMeetingDateAndTime"
        component={AddMeetingDateAndTime}
      />
      <Stack.Screen
        name="EditMeetingDateAndTime"
        component={EditMeetingDateAndTime}
      />
      <Stack.Screen name="AddMeetingLocation" component={AddMeetingLocation} />
      <Stack.Screen
        name="EditMeetingLocation"
        component={EditMeetingLocation}
      />
      <Stack.Screen name="AddMeetingSubjects" component={AddMeetingSubjects} />
      <Stack.Screen
        name="EditMeetingSubjects"
        component={EditMeetingSubjects}
      />
      <Stack.Screen name="LocationDetails" component={LocationDetails} />
      <Stack.Screen name="AddLocation" component={AddLocation} />
      <Stack.Screen name="EditLocation" component={EditLocation} />
      <Stack.Screen name="SelectUser" component={SelectUser} />
      <Stack.Screen name="Timeline" component={TimelineScreen} />
      <Stack.Screen name="SelectUsers" component={SelectUsers} />
      <Stack.Screen name="AddExternalUser" component={AddExternalUser} />
      <Stack.Screen name="DeadlineSuggestion" component={DeadlineSuggestion} />
      <Stack.Screen name="SelectSubjects" component={SelectSubjects} />
      <Stack.Screen name="Role" component={Role} />
      <Stack.Screen name="MeetingDetails" component={MeetingDetails} />
      <Stack.Screen name="AppointmentDetails" component={AppointmentsDetails} />
      <Stack.Screen name="AppointmentsList" component={AppointmentsList} />
      <Stack.Screen name="YourAnswer" component={YourAnswer} />
      <Stack.Screen name="subjects" component={Subjects} />
      <Stack.Screen
        name="AddAppointmentGeneral"
        component={AddAppointmentGeneral}
      />
      <Stack.Screen
        name="EditAppointmentGeneral"
        component={EditAppointmentGeneral}
      />
      <Stack.Screen
        name="AddAppointmentUsers"
        component={AddAppointmentUsers}
      />
      <Stack.Screen
        name="EditAppointmentUsers"
        component={EditAppointmentUsers}
      />
      <Stack.Screen
        name="AddAppointmentDateAndTime"
        component={AddAppointmentDateAndTime}
      />
      <Stack.Screen
        name="EditAppointmentDateAndTime"
        component={EditAppointmentDateAndTime}
      />
      <Stack.Screen
        name="AddAppointmentLocation"
        component={AddAppointmentLocation}
      />
      <Stack.Screen
        name="EditAppointmentLocation"
        component={EditAppointmentLocation}
      />
      <Stack.Screen name="Users" component={Users} />
      <Stack.Screen name="TasksList" component={TasksList} />
      <Stack.Screen name="FilterTask" component={FilterTask} />
    </Stack.Navigator>
  );
};

export default MainStack;
