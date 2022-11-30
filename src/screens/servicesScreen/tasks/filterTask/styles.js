import { StyleSheet } from 'react-native';
import { Fonts } from '../../../../themes';
import { Colors } from '../../../../themes/Colors';
import { SIZES } from '../../../../themes/Sizes';

export const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  subContainer: {
    flex: 1,
    backgroundColor: Colors.white
  },
  typeContainer: {
    paddingHorizontal: SIZES[16]
  },
  txtTitle: {
    ...Fonts.PoppinsBold[20],
    color: Colors.bold,
    marginVertical: SIZES[24]
  },
  rowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: SIZES[16]
  },
  txtDiscription: {},
  round: {
    height: SIZES[8],
    width: SIZES[8],
    borderRadius: SIZES[4],
    marginLeft: SIZES[16],
    marginRight: SIZES[8]
  },
  divider: {
    width: '100%',
    color: Colors.line,
    height: SIZES[1]
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: SIZES[10],
    paddingHorizontal: SIZES[16]
  },
  txtSwitchLabel: {
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
  }
});
