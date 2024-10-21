import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Alert, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

// Hàm kiểm tra số điện thoại có hợp lệ (10 chữ số)
const ValidateUSPhoneNumber = (phoneNumber) => {
  const regExp = /^\d{10}$/; // Kiểm tra số điện thoại gồm 10 chữ số
  return regExp.test(phoneNumber);
};

// Hàm định dạng lại số điện thoại
const formatPhoneNumber = (phoneNumber) => {
  const cleanNumber = phoneNumber.replace(/\D/g, '');
  if (cleanNumber.length <= 3) return cleanNumber;
  if (cleanNumber.length <= 6) return `(${cleanNumber.slice(0, 3)}) ${cleanNumber.slice(3)}`;
  return `(${cleanNumber.slice(0, 3)}) ${cleanNumber.slice(3, 6)}-${cleanNumber.slice(6, 10)}`;
};

const App = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [storedPhoneNumber, setStoredPhoneNumber] = useState(null);

  useEffect(() => {
    const getStoredPhoneNumber = async () => {
      try {
        const value = await AsyncStorage.getItem('phoneNumber');
        if (value !== null) {
          setStoredPhoneNumber(value);
        }
      } catch (e) {
        console.error(e);
      }
    };

    getStoredPhoneNumber();
  }, []);

  const handleLogin = async () => {
    const cleanedPhoneNumber = phoneNumber.replace(/\D/g, ''); // Xóa tất cả các ký tự không phải là số

    if (!ValidateUSPhoneNumber(cleanedPhoneNumber)) {
      Alert.alert('Please enter a valid 10-digit phone number.');
      return;
    }

    try {
      const formattedPhoneNumber = formatPhoneNumber(cleanedPhoneNumber); // Định dạng lại số điện thoại
      await AsyncStorage.setItem('phoneNumber', formattedPhoneNumber);
      setStoredPhoneNumber(formattedPhoneNumber);
      setPhoneNumber('');
      Alert.alert('Logged in successfully with phone number!');
    } catch (e) {
      console.error(e);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('phoneNumber');
      setStoredPhoneNumber(null);
      Alert.alert('Logged out successfully!');
    } catch (e) {
      console.error(e);
    }
  };

  const SubmitButton = ({ isValid, handlePress, label }) => {
    return (
      <TouchableOpacity
        style={[styles.button, isValid ? styles.buttonEnabled : styles.buttonDisabled]}
        onPress={handlePress}
        disabled={!isValid}
      >
        <Text style={styles.buttonText}>{label}</Text>
      </TouchableOpacity>
    );
  };

  // Kiểm tra số điện thoại hợp lệ
  const isPhoneNumberValid = ValidateUSPhoneNumber(phoneNumber.replace(/\D/g, ''));

  return (
    <View style={styles.container}>
      <Text style={styles.title}>AsyncStorage Auth Example</Text>
      {storedPhoneNumber ? (
        <View style={styles.loggedInContainer}>
          <Text style={styles.message}>Welcome, {storedPhoneNumber}!</Text>
          <SubmitButton isValid={true} handlePress={handleLogout} label="Logout" />
        </View>
      ) : (
        <View style={styles.inputContainer}>
          <TextInput
            style={[
              styles.input,
              { borderColor: isPhoneNumberValid ? 'green' : 'red' }, 
            ]}
            value={phoneNumber}
            onChangeText={text => setPhoneNumber(formatPhoneNumber(text))} // Gọi hàm định dạng khi người dùng nhập số
            placeholder="Enter phone number"
            keyboardType="phone-pad"
            placeholderTextColor="#999"
          />
          <SubmitButton
            isValid={isPhoneNumberValid}
            handlePress={handleLogin}
            label="Login"
          />
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  inputContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  loggedInContainer: {
    width: '100%',
    alignItems: 'center',
    marginTop: 20,
  },
  input: {
    height: 50,
    borderWidth: 1.5,
    borderRadius: 10,
    marginBottom: 16,
    paddingHorizontal: 15,
    width: '85%',
    backgroundColor: '#fff',
    fontSize: 18,
    color: '#333',
  },
  title: {
    fontSize: 30,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 30,
  },
  message: {
    fontSize: 22,
    marginBottom: 20,
    color: '#333',
    fontWeight: '500',
    textAlign: 'center',
  },
  button: {
    height: 50,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    width: '85%',
    marginVertical: 10,
  },
  buttonEnabled: {
    backgroundColor: '#007bff',
  },
  buttonDisabled: {
    backgroundColor: '#cccccc',
  },
  buttonText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: 'bold',
  },
});

export default App;
