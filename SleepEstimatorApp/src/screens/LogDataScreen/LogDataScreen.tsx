import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, Modal, TextInput, Button, Alert } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import CustomButton from '../../components/CustomButton';
import LogDataBox from '../../components/LogDataBox/LogDataBox';
import { useAuth } from '../../components/hooks/AuthContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const LogDataScreen: React.FC = () => {
    const navigation = useNavigation();
    const { user } = useAuth();
    const db = firestore();
    const [username, setUsername] = useState<string | null>(null);
    const [metrics, setMetrics] = useState({
        STEPS: '0',
        HEART_RATE_MAX: '0',
        HEART_RATE_MIN: '0',
        HEART_RATE_AVG: '0',
        DISTANCE: '0',
        WEIGHT: '0',
        HEIGHT: '0',
    });
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [tempValue, setTempValue] = useState('');
    const [currentMetricEditing, setCurrentMetricEditing] = useState('');

type MetricKeys = 'STEPS' | 'HEART_RATE_MAX' | 'HEART_RATE_MIN' | 'HEART_RATE_AVG' | 'DISTANCE' | 'WEIGHT' | 'HEIGHT';


const updateFirestoreData = async (fieldName: keyof typeof metrics, fieldValue: string) => {
    const currentUserUID = auth().currentUser?.uid;
    if (currentUserUID) {
        const today = new Date().toISOString().split('T')[0]; 
        const docId = `${currentUserUID}_${today}`;
        await db.collection('activityData').doc(docId).set({
            userId: currentUserUID,
            date: today,
            [fieldName]: fieldValue,
        }, { merge: true })
        .then(() => console.log(`Data updated: ${fieldName} = ${fieldValue}`))
        .catch((error) => console.error(`Failed to update data: ${error}`));
    }
};

  

useEffect(() => {
    const currentUserUID = auth().currentUser?.uid;

    const fetchUsernameAndOtherData = async () => {
        if (!user || !currentUserUID) {
            navigation.navigate('SignIn');
            return;
        }

        try {
            const userDocRef = firestore().collection('users').doc(currentUserUID);
            const doc = await userDocRef.get();
            if (doc.exists) {
                const userData = doc.data();
                setUsername(userData?.username); // Set the username
            } else {
                console.log("No such document for username!");
            }
            
            const metricsDoc = await db.collection('users').doc(currentUserUID).get();
            if (metricsDoc.exists) {
                const data = metricsDoc.data();
                const keysToInclude = ['STEPS', 'HEART_RATE_MAX', 'HEART_RATE_MIN', 'HEART_RATE_AVG', 'DISTANCE', 'WEIGHT', 'HEIGHT'];
                const filteredData = keysToInclude.reduce((acc, key) => {
                    if (data && data[key] !== undefined) {
                        acc[key] = data[key].toString();
                    }
                    return acc;
                }, {});
                setMetrics(prevMetrics => ({ ...prevMetrics, ...filteredData }));
            }
        } catch (error) {
            console.error("Error fetching user data:", error);
        }
    };

    fetchUsernameAndOtherData();
}, [user, navigation]);
  
  

const promptForNewValue = (metricKey: keyof typeof metrics) => {
    setCurrentMetricEditing(metricKey);
    setTempValue(metrics[metricKey]);
    setIsModalVisible(true);
};

const handleSave = () => {
    if (currentMetricEditing && !isNaN(Number(tempValue))) {
        const updatedMetrics = {
            ...metrics,
            [currentMetricEditing]: tempValue,
        };
        setMetrics(updatedMetrics);
        updateFirestoreData(currentMetricEditing as any, tempValue);
        setIsModalVisible(false);
    } else {
        Alert.alert('Invalid Input', 'Please enter a numerical value.');
    }
};

const onBackToHomePressed = () => {
    navigation.navigate('Home');
};

return (
<ScrollView style={styles.root}>
    <Text style={styles.title}>Edit Your Data, {username || "Loading..."}</Text>

    {Object.entries(metrics).map(([metricKey, metricValue]) => (
    <LogDataBox
        key={metricKey}
        type={metricKey as any}
        value={metricValue}
        onEdit={() => promptForNewValue(metricKey as "STEPS" | "HEART_RATE_MAX" | "HEART_RATE_MIN" | "HEART_RATE_AVG" | "DISTANCE" | "WEIGHT" | "HEIGHT")}
    />
    ))}

    <Modal
    animationType="slide"
    transparent={true}
    visible={isModalVisible}
    onRequestClose={() => setIsModalVisible(!isModalVisible)}
    >
    <View style={styles.centeredView}>
        <View style={styles.modalView}>
        <TextInput
            style={styles.modalText}
            onChangeText={setTempValue}
            placeholder="Enter new value"
            value={tempValue}
            keyboardType="numeric"
        />
        <Button
            title="Save"
            onPress={handleSave}
            color="#B57EDC"
        />
        </View>
    </View>
    </Modal>

    <CustomButton
        text="Back to Home"
        onPress={onBackToHomePressed}
        type="PRIMARY"
        icon={<Icon name="home" size={20} color="#FBFBF2" />}
    />

    <CustomButton
    text="Sign Out"
    onPress={() => auth().signOut().then(() => navigation.navigate('SignIn'))}
    type="SECONDARY"
    icon={<Icon name="logout" size={20} color="#8B88F8" />}
    />
</ScrollView>
);
};

const styles = StyleSheet.create({
root: {
    flex: 1,
    padding: 20,
},
title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 30,
    textAlign: 'center',
    color: '#FBFBF2',
},
centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
},
modalView: {
    margin: 20,
    backgroundColor: '#333',
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
},
modalText: {
    marginBottom: 15,
    textAlign: 'center',
    color: '#FBFBF2',
    width: '100%',
    borderColor: '#ddd',
    borderWidth: 1,
    padding: 10,
},
modalButton: {
    marginTop: 10,
    color: '#FBFBF2',
    borderRadius: 100,
},
text: {
    fontSize: 20,
    marginBottom: 10,
    color: '#FBFBF2',
    textAlign: 'center',
    fontWeight: 'bold',
},
link: {
    color: '#5AB1FF',
    textAlign: 'center',
    marginVertical: 10,
    padding: 20,
},
});


export default LogDataScreen;