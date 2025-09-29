import React, { useState, useEffect, useLayoutEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert, Modal } from 'react-native';
import { Camera, CameraView } from 'expo-camera';
import { Ionicons } from '@expo/vector-icons';
import { saveAttendance } from '@/api/api';
import { getDate, getTime } from '@/utils/date-time';
import { Student, Attendance } from '@/types'
import LogoutToolbar from '@/components/toolbar/LogoutToolbar';

const Scanner = ({ navigation }: { navigation: any }) => {

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: '#017fb7' },
      headerTintColor: '#fff',
      headerRight: () => <LogoutToolbar navigation={navigation} />,
    });
  }, [navigation]);

  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [scanned, setScanned] = useState(false);
  const [facing, setFacing] = useState<'front' | 'back'>('front');
  const [student, setStudent] = useState<Student | null>(null);
  const [attendance, setAttendance] = useState<Attendance | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [errorModal, setErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = async ({ type, data }: { type: string; data: string }) => {
    setScanned(true);

    try {
      const formAttendance = {
        student_id: data,
        date: getDate(),
        time: getTime(),
        remarks: "in",
      };

      const res = await saveAttendance(formAttendance);

      // Check for validation errors
      if (res?.errors) {
        const errorMessages = Object.values(res.errors).flat().join('\n');
        setErrorMessage(errorMessages || res.message || 'Validation failed');
        setErrorModal(true);
        return;
      }

      // Check for general error message
      if (res?.message && !res.data) {
        setErrorMessage(res.message);
        setErrorModal(true);
        return;
      }

      // Success case
      if (res?.data) {
        setAttendance(res.data);
        setStudent(res.data.student);
        setShowModal(true);
      } else {
        setErrorMessage('Unknown error occurred');
        setErrorModal(true);
      }
    } catch (error: any) {

      // Handle network errors
      if (error.response) {
        const status = error.response.status;
        const errorData = error.response.data;

        if (status === 422 && errorData.errors) {
          // Validation errors
          const errorMessages = Object.values(errorData.errors).flat().join('\n');
          setErrorMessage(errorMessages || 'Validation failed');
        } else if (errorData.message) {
          setErrorMessage(errorData.message);
        } else {
          setErrorMessage(`Server error: ${status}`);
        }
      } else if (error.request) {
        // Network error
        setErrorMessage('Network error. Please check your connection.');
      } else {
        // Other errors
        setErrorMessage(error.message || 'An unexpected error occurred');
      }

      setErrorModal(true);
    }
  };

  const toggleCameraFacing = () => {
    setFacing(current => (current === 'back' ? 'front' : 'back'));
  };

  // Auto-close success modal after 2 seconds
  useEffect(() => {
    if (showModal) {
      const timer = setTimeout(() => {
        setShowModal(false);
        setScanned(false);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [showModal]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerStyle: { backgroundColor: '#017fb7' },
      headerTintColor: '#fff',
    });
  }, [navigation]);

  if (hasPermission === null) {
    return <Text>Requesting camera permission...</Text>;
  }

  if (hasPermission === false) {
    return <Text>No access to camera</Text>;
  }

  return (
    <View
      style={styles.container}
      onTouchStart={() => scanned && setScanned(false)}
    >
      <CameraView
        style={styles.camera}
        facing={facing}
        onBarcodeScanned={scanned ? undefined : handleBarCodeScanned}
      >
        {/* Broken square frame overlay */}
        <View style={styles.squareFrameContainer} pointerEvents="none">
          {/* Top Left */}
          <View style={[styles.corner, styles.topLeft]} />
          {/* Top Right */}
          <View style={[styles.corner, styles.topRight]} />
          {/* Bottom Left */}
          <View style={[styles.corner, styles.bottomLeft]} />
          {/* Bottom Right */}
          <View style={[styles.corner, styles.bottomRight]} />
          {/* Blurry overlay */}
          <View style={styles.blurOverlay} />
        </View>
      </CameraView>
      <TouchableOpacity style={styles.toggleButton} onPress={toggleCameraFacing}>
        <Ionicons name={facing === 'back' ? 'camera-reverse' : 'camera'} size={24} color="white" />
      </TouchableOpacity>
      {scanned && (
        <TouchableOpacity
          style={styles.transparentButton}
          onPress={() => setScanned(false)}
          activeOpacity={0.7}
        >
          <Text style={styles.transparentButtonText}>Scan Again</Text>
        </TouchableOpacity>
      )}

      <Modal
        animationType="slide"
        transparent={true}
        visible={showModal}
        onRequestClose={() => setShowModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalView}>
            <Ionicons name="checkmark-circle" size={48} color="green" style={{ marginBottom: 10 }} />
            <Text style={styles.modalTitle}>Attendance Recorded</Text>
            {student && (
              <View style={styles.detailsContainer}>
                <Text style={styles.detailText}>Student ID: {student.student_id}</Text>
                <Text style={styles.detailText}>Name: {student.firstname} {student.lastname}</Text>
              </View>
            )}
            {attendance && (
              <View style={styles.detailsContainer}>
                <Text style={styles.detailText}>Date: {attendance.date}</Text>
                <Text style={styles.detailText}>Time: {attendance.time}</Text>
              </View>
            )}
          </View>
        </View>
      </Modal>

      <Modal
        animationType="slide"
        transparent={true}
        visible={errorModal}
        onRequestClose={() => setErrorModal(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.errorModalView}>
            <Text style={styles.errorModalTitle}>Error</Text>
            <Text style={styles.errorMessage}>{errorMessage}</Text>
            <TouchableOpacity
              style={styles.errorCloseButton}
              onPress={() => {
                setScanned(false);
                setErrorModal(false);
              }}
            >
              <Text style={styles.errorCloseButtonText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  camera: { flex: 1 },
  toggleButton: {
    position: 'absolute',
    top: 50,
    right: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    padding: 10,
    borderRadius: 25,
  },
  button: {
    position: 'absolute',
    bottom: 40,
    alignSelf: 'center',
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: 'green',
  },
  detailsContainer: {
    marginBottom: 20,
    width: '100%',
  },
  detailText: {
    fontSize: 16,
    marginBottom: 5,
    textAlign: 'left',
  },
  closeButton: {
    backgroundColor: '#007bff',
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    width: '100%',
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  errorModalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
    width: '80%',
  },
  errorModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
    color: '#dc3545',
  },
  errorMessage: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
    color: '#333',
    lineHeight: 24,
  },
  errorCloseButton: {
    backgroundColor: '#dc3545',
    borderRadius: 10,
    padding: 10,
    elevation: 2,
    width: '100%',
    alignItems: 'center',
  },
  errorCloseButtonText: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  transparentButton: {
    position: 'absolute',
    bottom: 80, // Increased space below
    alignSelf: 'center',
    backgroundColor: 'rgba(0,0,0,0.1)',
    paddingVertical: 20, // Bigger button
    paddingHorizontal: 40,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#007bff',
    minWidth: 180,
    alignItems: 'center',
  },
  transparentButtonText: {
    color: '#007bff',
    fontWeight: 'bold',
    fontSize: 18, // Bigger text
  },
  squareFrameContainer: {
    position: 'absolute',
    top: '25%',
    left: '15%',
    width: '70%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  corner: {
    position: 'absolute',
    width: 40,
    height: 40,
    borderColor: '#017fb7',
    borderRadius: 8,
    borderWidth: 4,
    backgroundColor: 'transparent',
    shadowColor: '#017fb7',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 8,
  },
  topLeft: {
    top: 0,
    left: 0,
    borderTopWidth: 4,
    borderLeftWidth: 4,
    borderRightWidth: 0,
    borderBottomWidth: 0,
  },
  topRight: {
    top: 0,
    right: 0,
    borderTopWidth: 4,
    borderRightWidth: 4,
    borderLeftWidth: 0,
    borderBottomWidth: 0,
  },
  bottomLeft: {
    bottom: 0,
    left: 0,
    borderBottomWidth: 4,
    borderLeftWidth: 4,
    borderTopWidth: 0,
    borderRightWidth: 0,
  },
  bottomRight: {
    bottom: 0,
    right: 0,
    borderBottomWidth: 4,
    borderRightWidth: 4,
    borderTopWidth: 0,
    borderLeftWidth: 0,
  },
  blurOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 16,
    backgroundColor: 'rgba(32, 136, 255, 0.08)',
  },
});

export default Scanner;
