import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, TouchableHighlight, Alert, ToastAndroid, TextInput } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import * as LocalAuthentication from 'expo-local-authentication';
import * as Device from 'expo-device';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system';
import * as Permissions from 'expo-permissions';
import Constants from 'expo-constants';
import bcrypt from 'bcryptjs';
import { NAME, PHONE_NUMBER, PIN_HASH } from '@env';

export default function AuthScreen({ setIsLoggedIn }) {
    const [pinNumber, setPinNumber] = useState('');
    const [avaterText, setAvaterText] = useState(getInitials(NAME));
    const [arraypin1Present, setArrayPin1Present] = useState(false);
    const [arraypin2Present, setArrayPin2Present] = useState(false);
    const [arraypin3Present, setArrayPin3Present] = useState(false);
    const [arraypin4Present, setArrayPin4Present] = useState(false);
    const [isUserAuthTrue, setIsUserAuthTrue] = useState(false);

    const chechArray = () => {
        const arrayLenght = pinNumber.length;
        setArrayPin1Present(arrayLenght > 0);
        setArrayPin2Present(arrayLenght > 1);
        setArrayPin3Present(arrayLenght > 2);
        setArrayPin4Present(arrayLenght > 3);
    };

    const getSimCarrier = async () => {
        const simCardProvider = await Device.getCarrier();
        ToastAndroid.show(simCardProvider + " sim detected", ToastAndroid.LONG);
    };

    const readPhoneStateRequestPermisions = async () => {
        try {
            const { status } = await Permissions.askAsync(Permissions.READ_PHONE_STATE);
            if (status !== 'granted') {
                ToastAndroid.show("Permission denied", ToastAndroid.LONG);
            }
        } catch (error) {
            console.log("error in the readPhoneStateRequestPermisions function", error);
        }
    };

    const permissonToReadSms = async () => {
        try {
            const { status } = await Permissions.askAsync(Permissions.READ_SMS);
            if (status !== 'granted') {
                ToastAndroid.show("Permission denied", ToastAndroid.LONG);
            }
        } catch (error) {
            console.log(error);
        }
    };

    const fingerprintAuth = async () => {
        const isFingerprintSupported = await LocalAuthentication.hasHardwareAsync();
        if (isFingerprintSupported) {
            const result = await LocalAuthentication.authenticateAsync({
                promptMessage: "Finger M-PESA",
                fallbackLabel: "Use PIN",
            });
            if (result.success) {
                setIsUserAuthTrue(true);
                setIsLoggedIn(true);
                ToastAndroid.show("Authentication Success", ToastAndroid.LONG);
            } else {
                console.log("Authentication Failed");
            }
        } else {
            ToastAndroid.show("Fingerprint not supported, use pin 0000", ToastAndroid.LONG);
        }
    };

    const pinPressHandler = async (value) => {
        if (pinNumber.length < 4) {
            setPinNumber((prevPin) => {
                const newPin = prevPin + value;
                chechArray();
                if (newPin.length === 4) {
                    verifyPin(newPin);
                }
                return newPin;
            });
        }
    };

    const verifyPin = (inputPin) => {
        if (bcrypt.compareSync(inputPin, PIN_HASH)) {
            setIsUserAuthTrue(true);
            setIsLoggedIn(true);
            ToastAndroid.show("PIN Correct", ToastAndroid.LONG);
        } else {
            setPinNumber('');
            chechArray();
            ToastAndroid.show("Incorrect PIN", ToastAndroid.LONG);
        }
    };

    function getInitials(name) {
        const words = name.split(' ');
        const initials = words.map(word => word.charAt(0));
        return initials.join('');
    }

    const getGalleryPhotos = async () => {
        try {
            const galleryPath = FileSystem.documentDirectory + "Pictures";
            const files = await FileSystem.readDirectoryAsync(galleryPath);
            console.log(files);
        } catch (error) {
            console.error('Error reading gallery:', error);
        }
    };

    const PERMISSION_READ_WRITE_STORAGE = async () => {
        try {
            const { status } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);
            if (status === 'granted') {
                getGalleryPhotos();
            } else {
                Alert.alert("Permission denied", "Give me access to the storage");
            }
        } catch (error) {
            console.log("Error in read and writing permissions function ", error);
        }
    };

    useEffect(() => {
        readPhoneStateRequestPermisions();
        permissonToReadSms();
        getSimCarrier();
        PERMISSION_READ_WRITE_STORAGE();
    }, [isUserAuthTrue]);

    return (
        <View style={styles.MainAuthScreen}>
            <View style={styles.personIdentifiableInfoContainer}>
                <View style={styles.AvaterContainer}>
                    <Text style={styles.AvaterText}>{avaterText}</Text>
                </View>
                <Text style={styles.UsersFullName}>{NAME}</Text>
                <Text style={styles.UsersMobileNumber}>{PHONE_NUMBER}</Text>
            </View>
            <View style={styles.InputContainer}>
                <Text style={{ color: 'white', fontWeight: '600' }}>ENTER M-PESA PIN</Text>
                <View style={styles.inputValidationContainer}>
                    <View style={styles.inputIdentifier}>
                        <View style={arraypin1Present ? styles.pinValuePresent : styles.pinValueAbsent}></View>
                    </View>
                    <View style={styles.inputIdentifier}>
                        <View style={arraypin2Present ? styles.pinValuePresent : styles.pinValueAbsent}></View>
                    </View>
                    <View style={styles.inputIdentifier}>
                        <View style={arraypin3Present ? styles.pinValuePresent : styles.pinValueAbsent}></View>
                    </View>
                    <View style={styles.inputIdentifier}>
                        <View style={arraypin4Present ? styles.pinValuePresent : styles.pinValueAbsent}></View>
                    </View>
                </View>
            </View>
            <View style={styles.numberPadContainer}>
                <View style={[styles.numRow, styles.Top]}>
                    <TouchableHighlight style={styles.keyPadNumberButton} onPress={() => pinPressHandler('1')}>
                        <Text style={styles.KeypAdNumber}>1</Text>
                    </TouchableHighlight>
                    <TouchableHighlight style={styles.keyPadNumberButton} onPress={() => pinPressHandler('2')}>
                        <Text style={styles.KeypAdNumber}>2</Text>
                    </TouchableHighlight>
                    <TouchableHighlight style={styles.keyPadNumberButton} onPress={() => pinPressHandler('3')}>
                        <Text style={styles.KeypAdNumber}>3</Text>
                    </TouchableHighlight>
                </View>
                <View style={[styles.numRow, styles.secondTop]}>
                    <TouchableHighlight style={styles.keyPadNumberButton} onPress={() => pinPressHandler('4')}>
                        <Text style={styles.KeypAdNumber}>4</Text>
                    </TouchableHighlight>
                    <TouchableHighlight style={styles.keyPadNumberButton} onPress={() => pinPressHandler('5')}>
                        <Text style={styles.KeypAdNumber}>5</Text>
                    </TouchableHighlight>
                    <TouchableHighlight style={styles.keyPadNumberButton} onPress={() => pinPressHandler('6')}>
                        <Text style={styles.KeypAdNumber}>6</Text>
                    </TouchableHighlight>
                </View>
                <View style={[styles.numRow, styles.secondLast]}>
                    <TouchableHighlight style={styles.keyPadNumberButton} onPress={() => pinPressHandler('7')}>
                        <Text style={styles.KeypAdNumber}>7</Text>
                    </TouchableHighlight>
                    <TouchableHighlight style={styles.keyPadNumberButton} onPress={() => pinPressHandler('8')}>
                        <Text style={styles.KeypAdNumber}>8</Text>
                    </TouchableHighlight>
                    <TouchableHighlight style={styles.keyPadNumberButton} onPress={() => pinPressHandler('9')}>
                        <Text style={styles.KeypAdNumber}>9</Text>
                    </TouchableHighlight>
                </View>
                <View style={[styles.numRow, styles.last]}>
                    <TouchableHighlight style={styles.keyPadNumberButton}>
                        <Text style={styles.KeypAdNumber}></Text>
                    </TouchableHighlight>
                    <TouchableHighlight style={styles.keyPadNumberButton} onPress={() => pinPressHandler('0')}>
                        <Text style={styles.KeypAdNumber}>0</Text>
                    </TouchableHighlight>
                    <TouchableHighlight style={styles.keyPadNumberButton} onPress={fingerprintAuth}>
                        <MaterialIcons name="fingerprint" color="white" size={35} />
                    </TouchableHighlight>
                </View>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    MainAuthScreen: {
        height: '100%',
        width: '100%',
        backgroundColor: 'rgb(18, 18, 18)'
    },
    personIdentifiableInfoContainer: {
        height: '20%',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
    },
    InputContainer: {
        height: '30%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    },
    numberPadContainer: {
        height: '50%',
        justifyContent: 'flex-end'
    },
    AvaterContainer: {
        height: 70,
        width: 70,
        backgroundColor: 'white',
        borderRadius: 100,
        justifyContent: 'center',
        alignItems: 'center'
    },
    AvaterText: {
        fontSize: 25,
        color: 'rgb(0, 188, 246)'
    },
    UsersFullName: {
        color: 'white',
        textAlign: 'center',
        padding: 0,
    },
    UsersMobileNumber: {
        color: 'white'
    },
    inputValidationContainer: {
        flexDirection: 'row',
    },
    inputIdentifier: {
        height: 40,
        width: 40,
        marginTop: 15,
        marginLeft: 10,
        borderRadius: 100,
        borderColor: 'white',
        borderWidth: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    numRow: {
        flexDirection: 'row',
        width: '100%',
        marginBottom: 5,
    },
    keyPadNumberButton: {
        height: 60,
        width: '33.33%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    KeypAdNumber: {
        color: 'white',
        fontSize: 30
    },
    pinValuePresent: {
        height: 20,
        width: 20,
        borderRadius: 100,
        borderWidth: 1,
        backgroundColor: 'limegreen'
    }
});