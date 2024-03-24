import React, { useState, useEffect } from 'react';
import { ScrollView, View, Text, StyleSheet, Modal, TextInput, Button, Alert } from 'react-native';
import { RouteProp, useNavigation, useRoute } from '@react-navigation/native'; // import useRoute
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import CustomButton from '../../components/CustomButton';
import LogDataBox from '../../components/LogDataBox/LogDataBox';
import { useAuth } from '../../components/hooks/AuthContext';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const LogDataScreen: React.FC = () => {
    const navigation = useNavigation();
    const { user } = useAuth(); // Using useAuth hook to access user
    const userEmail = user?.email; // Accessing the email from the user object
  
    const db = firestore();
    const [metrics, setMetrics] = useState({
        STEPS: '0',
        HEART_RATE_MAX: '0',
        HEART_RATE_MIN: '0',
        HEART_RATE_AVG: '0',
        DISTANCE: '0',
        WEIGHT: '0',
        HEIGHT: '0',
    });

type MetricKeys = 'STEPS' | 'HEART_RATE_MAX' | 'HEART_RATE_MIN' | 'HEART_RATE_AVG' | 'DISTANCE' | 'WEIGHT' | 'HEIGHT';


const [isModalVisible, setIsModalVisible] = useState(false);
const [tempValue, setTempValue] = useState('');
const [currentMetricEditing, setCurrentMetricEditing] = useState('');

const updateFirestoreData = async (fieldName: MetricKeys, fieldValue: string) => {
    const currentUserUID = auth().currentUser?.uid;
    const today = new Date().toISOString().split('T')[0]; //today's date in YYYY-MM-DD format

    if (currentUserUID) {
        //docId format: "UID_YYYY-MM-DD"
        const docId = `${currentUserUID}_${today}`;
        await db.collection('activityData').doc(docId).set({
            userId: currentUserUID,
            date: today,
            [fieldName]: fieldValue,
        }, { merge: true })
        .then(() => console.log(`Data updated for ${today}: ${fieldName} = ${fieldValue}`))
        .catch((error) => console.error(`Failed to update data for ${today}: ${error}`));
    }
};

  

useEffect(() => {
    const currentUserUID = auth().currentUser?.uid;
    if (currentUserUID) {
        db.collection('users').doc(currentUserUID).get().then((documentSnapshot) => {
            if (documentSnapshot.exists) {
                const data = documentSnapshot.data();
                const keysToInclude: MetricKeys[] = ['STEPS', 'HEART_RATE_MAX', 'HEART_RATE_MIN', 'HEART_RATE_AVG', 'DISTANCE', 'WEIGHT', 'HEIGHT'];
                
                const filteredData = keysToInclude.reduce((acc, key) => {
                    if (data && key in data) {
                        acc[key] = data[key].toString();
                    }
                    return acc;
                }, {} as Record<MetricKeys, string>);
        
                const newMetrics = {
                    ...metrics,
                    ...filteredData,
                };
                setMetrics(newMetrics);
            }
        }).catch((error) => {
            console.error(`Failed to fetch user data: ${error}`);
        });
    }
  }, []);
  
  

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
    updateFirestoreData(currentMetricEditing, tempValue);
    setIsModalVisible(false);
} else {
    Alert.alert('Invalid Input', 'Please enter a numerical value.');
}
};

function onBackToHomePressed(): void {
    navigation.navigate('Home');
}

return (
<ScrollView style={styles.root}>
    <Text style={styles.title}>Edit Your Data, {userEmail}</Text>

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