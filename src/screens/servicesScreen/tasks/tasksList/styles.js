import { StyleSheet } from 'react-native';
import { Fonts } from '../../../../themes';
import { Colors } from '../../../../themes/Colors';
import { SIZES } from '../../../../themes/Sizes';

export const styles = StyleSheet.create({
  container: {
    flex: 1
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
    marginLeft: SIZES[30]
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
  divider: {
    width: '100%',
    height: SIZES[1],
    backgroundColor: Colors.line,
    marginLeft: SIZES[16]
  },
  committeeView: {
    marginVertical: SIZES[10],
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SIZES[16]
  },
  txtCommittee: {
    ...Fonts.PoppinsRegular[14],
    color: Colors.bold
  },
  btnCommittees: { flexDirection: 'row', alignItems: 'center' }
});
