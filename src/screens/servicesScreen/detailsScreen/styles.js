import { StyleSheet } from 'react-native';
import { Fonts } from '../../../themes';
import { Colors } from '../../../themes/Colors';
import { SIZES } from '../../../themes/Sizes';

export const styles = StyleSheet.create({
  container: {
    flex: 1
  },
  modalView: {
    position: 'absolute',
    top: SIZES[60],
    right: SIZES[8]
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES[16],
    paddingVertical: SIZES[10]
  },
  txtHeader: {
    ...Fonts.PoppinsSemiBold[14],
    color: Colors.bold,
    marginLeft: SIZES[24]
  },
  headeRightView: { flexDirection: 'row', alignItems: 'center' },
  searchIconView: { marginRight: SIZES[24] },
  subContainer: { flex: 1, backgroundColor: Colors.white },
  searchView: {
    backgroundColor: Colors.gray,
    padding: SIZES[16],
    height: SIZES[36]
  },
  searchRowContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    margin: SIZES[16],
    height: SIZES[36],
    backgroundColor: Colors.gray,
    paddingHorizontal: SIZES[16],
    borderRadius: SIZES[10]
  },
  subSearchView: {
    padding: SIZES[12]
  },
  committeeView: {
    marginVertical: SIZES[10],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES[16]
  },
  divider: {
    width: '100%',
    height: SIZES[1],
    backgroundColor: Colors.line
  },
  btnContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(118, 118, 128, 0.12)',
    borderRadius: SIZES[10],
    margin: SIZES[16],
    padding: SIZES[2],
    justifyContent: 'space-evenly'
  },
  btnServices: {
    paddingVertical: SIZES[8],
    width: '33%',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: SIZES[8]
  },
  txtBtnServices: { ...Fonts.PoppinsSemiBold[12], color: Colors.bold },
  btnCommittees: { flexDirection: 'row', alignItems: 'center' },
  txtBtnCommittees: {
    ...Fonts.PoppinsRegular[14],
    color: Colors.secondary,
    marginRight: SIZES[21]
  },
  subjectCard: { ...Fonts.PoppinsSemiBold[14] },
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
  txtCommittee: {
    ...Fonts.PoppinsRegular[14],
    color: Colors.bold
  }
});
