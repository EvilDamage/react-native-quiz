import React from 'react';
import {Modal, StyleSheet, Text, TouchableOpacity, View} from 'react-native';

function CustomModal(props) {
  return (
    <Modal transparent={true} visible={props.visible}>
      <View style={styles.modalView}>
        <View>
          <Text style={{fontSize: 32}}>Regulamin</Text>
        </View>
        <TouchableOpacity style={styles.customButton} onPress={props.onPress}>
          <Text style={styles.buttonText}>Zamknij</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalView: {
    backgroundColor: '#f1f1ef',
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  customButton: {
    backgroundColor: '#006bff',
    width: '50%',
    padding: 10,
    marginTop: 20,
    justifyContent: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  buttonText: {
    color: '#ffffff',
  },
});
export default CustomModal;
