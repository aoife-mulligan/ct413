import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import CustomButton from '../../components/CustomButton';
import { RouteProp, useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore'; // Import Firestore
import SurveyQuestionBox from '../../components/SurveyQuestionBox.tsx';
import LogDataBox from '../../components/LogDataBox/LogDataBox.tsx';
import { useAuth } from '../../components/hooks/AuthContext';
import PredictionDisplay from '../../components/PredictionDisplay/PredictionDisplay.tsx';

const HomeScreen: React.FC = () => {
    const navigation = useNavigation();
    const { user } = useAuth();
    const userEmail = user?.email;
    const [username, setUsername] = useState<string | null>(null);
    const [prediction, setPrediction] = useState<number | null>(null);


    useEffect(() => {
        if (!user) {
            navigation.navigate('SignIn');
            return;
        }

        const fetchUsername = async () => {
            const currentUserUID = user.uid;
            const userDocRef = firestore().collection('users').doc(currentUserUID);
            
            try {
                const doc = await userDocRef.get();
                if (doc.exists) {
                    const userData = doc.data();
                    if(userData) {
                        console.log("Setting username to: ", userData.username);
                        setUsername(userData.username);
                    } else {
                        console.log("Document data is undefined.");
                    }
                } else {
                    console.log("No such document!");
                }
            } catch (error) {
                console.error("Error getting document:", error);
            }
        };

        fetchUsername();
        const fetchPrediction = async () => {
            const predictionDocRef = firestore().collection('predictions').doc(user.uid);
            
            try {
                const doc = await predictionDocRef.get();
                if (doc.exists) {
                    const predictionData = doc.data();
                    const predictionValue = predictionData?.predictionValue ?? null;
                    setPrediction(predictionValue);
                } else {
                    console.log("No prediction document found for the user.");
                }
            } catch (error) {
                console.error("Error getting prediction document:", error);
            }
        };

        fetchPrediction();
    }, [user, navigation]);

    const db = firestore();

    const onSignOutPressed = () => {
        console.warn('Sign Out Pressed!');
        auth()
            .signOut()
            .then(() => {
                console.warn('User signed out!');
            });

        navigation.navigate('SignIn');
    }

    const onCompleteSurveyPressed = () => {
        console.warn('Complete Survey Pressed!');
        navigation.navigate('SurveyScreen');
    }

    const onLogDataPressed = () => {
        const userEmail = auth().currentUser?.email;
    
        if (userEmail) {
            navigation.navigate('LogDataScreen');
        } else {
            console.error('No user email found');
            navigation.navigate('SignIn');
        }
    };

    const onGeneratePredictionPressed = () => {
        console.warn('Generate Prediction Pressed!');
        navigation.navigate('GeneratePredictionScreen');
    };

    const saveUserResponse = (fieldName: string, fieldValue: string) => {
        const currentUserUID = auth().currentUser?.uid;
    
        if (currentUserUID) {
            const userDocRef = db.collection('users').doc(currentUserUID);
            userDocRef.update({
                [fieldName]: fieldValue
            }).then(() => {
                console.log(`User response saved successfully for field ${fieldName}!`);
            }).catch((error) => {
                console.error(`Error saving user response for field ${fieldName}:`, error);
            });
        } else {
            console.error('Current user UID is not available.');
        }
    }
    

    return (
        <ScrollView>
            <Text style={styles.title}>Hello, {username ? username : "Loading..." }!</Text>

            <PredictionDisplay prediction={prediction}/>

            <CustomButton
                text="Log Today's Data"
                onPress={onLogDataPressed}
                type="PRIMARY"
            />
            
            <CustomButton
                text="Complete Survey"
                onPress={onCompleteSurveyPressed}
                type="PRIMARY"
            />
            <CustomButton
                text="Your Sleep Quality Prediction"
                onPress={onGeneratePredictionPressed}
                type="PRIMARY"
            />

            <CustomButton 
                text="Sign Out" 
                onPress={onSignOutPressed}
                type="SECONDARY"
            />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    root: {
        alignItems: 'center',
        padding: 20,
    },
    logo: {
      width: '100%',
      maxWidth: 500,
      maxHeight: 500,       
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FBFBF2',
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        alignContent: 'center',
        marginVertical: 20,
        padding: 20,
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
    }
});

export default HomeScreen;
