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
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

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

        const unsubscribeFromUserUpdates = firestore()
        .collection('users')
        .doc(user.uid)
        .onSnapshot(doc => {
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
        }, error => {
            console.error("Error getting document:", error);
        });

        const unsubscribeFromPredictionUpdates = firestore()
        .collection('predictions')
        .doc(user.uid)
        .onSnapshot(doc => {
            if (doc.exists) {
                const predictionData = doc.data();
                setPrediction(predictionData?.predictionValue ?? null);
            } else {
                console.log("No prediction document found for the user.");
            }
        }, error => {
            console.error("Error getting prediction document:", error);
        });

        return () => {
            unsubscribeFromUserUpdates();
            unsubscribeFromPredictionUpdates();
        };
        
        }, [user, navigation]);

    const db = firestore();

    const onSignOutPressed = () => {
        auth()
            .signOut()
            .then(() => {
                console.warn('User signed out!');
            });

        navigation.navigate('SignIn');
    }

    const onCompleteSurveyPressed = () => {
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
        navigation.navigate('GeneratePredictionScreen');
    };

    const onAccountPressed = () => {
        navigation.navigate('AccountScreen');
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
                icon={<Icon name="checkbox-marked-circle-plus-outline" size={20} color="#FBFBF2" />}
            />
            
            <CustomButton
                text="Complete Survey"
                onPress={onCompleteSurveyPressed}
                type="PRIMARY"
                icon={<Icon name="checkbox-marked-circle-plus-outline" size={20} color="#FBFBF2" />}
            />
            <CustomButton
                text="Your Sleep Quality Prediction"
                onPress={onGeneratePredictionPressed}
                type="PRIMARY"
                icon={<Icon name="chat-sleep-outline" size={20} color="#FBFBF2" />}

            />

            <CustomButton 
                text="Sign Out" 
                onPress={onSignOutPressed}
                type="SECONDARY"
                icon={<Icon name="logout" size={20} color="#8B88F8" />}
            />

            <CustomButton 
                text="Account Profile" 
                onPress={onAccountPressed}
                type="SECONDARY"
                icon={<Icon name="account" size={20} color="#8B88F8" />}
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
