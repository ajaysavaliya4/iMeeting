import { View, Text, SafeAreaView, StyleSheet } from 'react-native';
import React, { useState } from 'react';
import DropDownPicker from 'react-native-dropdown-picker';
import { useNavigation } from '@react-navigation/native';

import { IconName } from '../../../../component';
import { Colors } from '../../../../themes/Colors';
import { Fonts } from '../../../../themes';
import { Divider, Switch } from 'react-native-paper';
import { Button } from '../../../../component/button/Button';
import Header from '../../../../component/header/Header';
import { styles } from './styles';

const SubjectDownload = () => {
  const navigation = useNavigation();
  const [open, setOpen] = useState(false);
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { label: '.pdf', value: '.pdf' },
    { label: '.zip', value: '.zip' }
  ]);
  const [isAttachFileSwitchOn, setIsAttachFileSwitchOn] = useState(false);
  const [isCommentsSwitchOn, setIsCommentsSwitchOn] = useState(false);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Header
        name={'Download'}
        rightIconName={IconName.Close}
        onRightPress={() => navigation.goBack()}
      />
      <View style={styles.subContainer}>
        <Text style={styles.txtDownloadTitle}>Download</Text>
        <View style={styles.exportContainer}>
          <Text style={styles.txtExportTitle}>EXPORT FORMAT</Text>
          <DropDownPicker
            open={open}
            value={value}
            items={items}
            setOpen={setOpen}
            setValue={setValue}
            setItems={setItems}
            placeholder={'Format'}
            placeholderStyle={styles.txtExportTitle}
            style={{
              borderWidth: 0,

              zIndex: 999
            }}
            textStyle={{ ...Fonts.PoppinsRegular[14] }}
          />
        </View>
        <View style={styles.rowContainer}>
          <Text style={styles.txtLabel}>Attach files</Text>
          <Switch
            value={isAttachFileSwitchOn}
            onValueChange={() => setIsAttachFileSwitchOn(!isAttachFileSwitchOn)}
            color={Colors.switch}
          />
        </View>
        <View style={styles.rowContainer}>
          <Text style={styles.txtLabel}>Comments</Text>
          <Switch
            value={isCommentsSwitchOn}
            onValueChange={() => setIsCommentsSwitchOn(!isCommentsSwitchOn)}
            color={'#81AB96'}
          />
        </View>
      </View>
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
            // onPress={onCancelHandler}
            layoutStyle={styles.cancelBtnLayout}
            textStyle={styles.txtCancelButton}
          />
          <Button
            title={'Save'}
            // onPress={() => navigation.navigate("Step2")}

            layoutStyle={[styles.nextBtnLayout]}
            textStyle={styles.txtNextBtn}
          />
        </View>
      </View>
    </SafeAreaView>
  );
};

export default SubjectDownload;