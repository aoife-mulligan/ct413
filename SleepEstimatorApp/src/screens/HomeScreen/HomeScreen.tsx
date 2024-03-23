import React, { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import CustomButton from '../../components/CustomButton';
import { RouteProp, useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore'; // Import Firestore
import SurveyQuestionBox from '../../components/SurveyQuestionBox.tsx';
import LogDataBox from '../../components/LogDataBox/LogDataBox.tsx';
import { useAuth } from '../../components/hooks/AuthContext';

const HomeScreen: React.FC = () => {
    const navigation = useNavigation();
    const { user } = useAuth(); // Use the useAuth hook here
    const userEmail = user?.email; // Get the email from the user object

    if (!user) {
        useEffect(() => {
            navigation.navigate('SignIn');
        }, []);
        // Return null or a loading spinner until the effect runs
        return null;
    }

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
        navigation.navigate('SurveyScreen');
    }

    const onLogDataPressed = () => {
        const userEmail = auth().currentUser?.email;
    
        if (userEmail) {
            // If userEmail exists, navigate and pass it to LogDataScreen
            navigation.navigate('LogDataScreen');
        } else {
            // Handle the scenario where there is no user email available
            console.error('No user email found');
            // For example, redirect to a login screen or show an alert
            navigation.navigate('SignIn');
        }
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
            <Text style={styles.title}>Hello, {userEmail}!</Text>

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
