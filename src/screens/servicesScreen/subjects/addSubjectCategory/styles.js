import { StyleSheet } from 'react-native';
import { Fonts } from '../../../../themes';
import { Colors } from '../../../../themes/Colors';
import { SIZES } from '../../../../themes/Sizes';

export const styles = StyleSheet.create({
  container: { flex: 1 },
  subContainer: {
    paddingHorizontal: SIZES[16],
    paddingTop: SIZES[24],
    backgroundColor: Colors.white,
    flex: 1
  },
  txtAddSubjectTitle: { ...Fonts.PoppinsBold[24], color: Colors.bold },
  titleContainer: {
    marginTop: SIZES[16],
    borderBottomWidth: SIZES[1],
    borderBottomColor: Colors.line
  },
  txtTitle: { ...Fonts.PoppinsRegular[12], color: Colors.secondary },
  textInput: {
    paddingVertical: SIZES[10],
    ...Fonts.PoppinsRegular[14],
    color: Colors.bold
  },
  buttonContainer: {
    paddingHorizontal: SIZES[16],
    flexDirection: 'row',
    justifyContent: 'space-between'
  },
  cancelBtnLayout: {
    backgroundColor: '#F3F6F9',
    marginVertical: SIZES[12],
    width: '48%'
  },
  txtCancelButton: {
    ...Fonts.PoppinsSemiBold[14],
    color: Colors.primary
  },
  nextBtnLayout: {
    marginVertical: SIZES[12],
    width: '48%'
  },
  txtNextBtn: {
    ...Fonts.PoppinsSemiBold[14],
    color: Colors.white
  },
  divider: {
    width: '100%',
    height: SIZES[1],
    backgroundColor: Colors.line
  }
});
