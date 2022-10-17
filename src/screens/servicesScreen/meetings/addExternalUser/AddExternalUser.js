import {
  View,
  Text,
  SafeAreaView,
  TextInput,
  Switch,
  ScrollView,
  TouchableOpacity
} from 'react-native';
import React, { useState } from 'react';

import { styles } from './styles';
import Header from '../../../../component/header/Header';
import { IconName } from '../../../../component';
import Avatar from '../../../../component/Avatar/Avatar';
import { Colors } from '../../../../themes/Colors';
import { Button } from '../../../../component/button/Button';
import { Divider } from 'react-native-paper';
import { useNavigation } from '@react-navigation/native';

const AddExternalUser = () => {
  const navigation = useNavigation();
  const [firstName, setFirstName] = useState('');
  const [secondName, setSecondName] = useState('');
  const [lastName, setLastName] = useState('');
  const [organization, setOrganization] = useState('');
  const [email, setEmail] = useState('');
  const [number, setNumber] = useState('');
  const [sensSMS, setSendSMS] = useState(false);
  const [savaDatabase, setSaveDatabase] = useState(false);
  const [privateDetails, setPrivateDetails] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <Header
        name={'Add external user'}
        rightIconName={IconName.Close}
        onRightPress={() => navigation.goBack()}
      />
      <ScrollView
        style={styles.subContainer}
        showsVerticalScrollIndicator={false}
      >
        {/* avatar */}
        <TouchableOpacity style={styles.profilePicContainer}>
          <Avatar
            name={'Darlene'}
            size={120}
            backgroundColor={'#E79D73'}
            source={'https://picsum.photos/200/300'}
          />
        </TouchableOpacity>

        {/* details */}
        {/* FIRST NAME */}
        <View style={styles.titleContainer}>
          <Text style={styles.txtTitle}>FIRST NAME</Text>
          <TextInput
            style={styles.textInput}
            value={firstName}
            onChangeText={(text) => setFirstName(text)}
          />
        </View>

        {/* SECOND NAME */}
        <View style={styles.titleContainer}>
          <Text style={styles.txtTitle}>SECOND NAME</Text>
          <TextInput
            style={styles.textInput}
            value={secondName}
            onChangeText={(text) => setSecondName(text)}
          />
        </View>

        {/* LAST NAME */}
        <View style={styles.titleContainer}>
          <Text style={styles.txtTitle}>LAST NAME</Text>
          <TextInput
            style={styles.textInput}
            value={lastName}
            onChangeText={(text) => setLastName(text)}
          />
        </View>

        {/* ORGANIZATION */}
        <View style={styles.titleContainer}>
          <Text style={styles.txtTitle}>ORGANIZATION</Text>
          <TextInput
            style={styles.textInput}
            value={organization}
            onChangeText={(text) => setOrganization(text)}
          />
        </View>

        {/* EMAIL */}
        <View style={styles.titleContainer}>
          <Text style={styles.txtTitle}>E-MAIL</Text>
          <TextInput
            keyboardType="email-address"
            style={styles.textInput}
            value={email}
            onChangeText={(text) => setEmail(text)}
          />
        </View>

        {/* NUMBER */}
        <View style={styles.titleContainer}>
          <Text style={styles.txtTitle}>NUMBER</Text>
          <TextInput
            keyboardType="name-phone-pad"
            style={styles.textInput}
            value={number}
            onChangeText={(text) => setNumber(text)}
          />
        </View>
        <View style={styles.rowContainer}>
          <Text style={styles.txtLabel}>Send SMS</Text>
          <Switch
            value={sensSMS}
            onValueChange={() => setSendSMS(!sensSMS)}
            color={Colors.switch}
          />
        </View>
        <View style={styles.rowContainer}>
          <Text style={styles.txtLabel}>Save to database</Text>
          <Switch
            value={savaDatabase}
            onValueChange={() => setSaveDatabase(!savaDatabase)}
            color={Colors.switch}
          />
        </View>
        <View style={[styles.rowContainer, { marginBottom: 24 }]}>
          <Text style={styles.txtLabel}>Private details</Text>
          <Switch
            value={privateDetails}
            onValueChange={() => setPrivateDetails(!privateDetails)}
            color={Colors.switch}
          />
        </View>
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
            title={'Cancel'}
            onPress={() => navigation.goBack()}
            layoutStyle={styles.cancelBtnLayout}
            textStyle={styles.txtCancelButton}
          />
          <Button
            title={'Save'}
            // onPress={() => navigation.navigate('AddMeetingUser')}
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

export default AddExternalUser;