import React, {useState} from 'react';
import { View, StyleSheet, useWindowDimensions, ScrollView, Text, ToastAndroid } from 'react-native';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import SocialSignInButtons from '../../components/SocialSignInButton';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


interface FirebaseError extends Error {
    code?: string;
}

const SignUpScreen: React.FC = () => {

    const db = firestore();


    const [username, setUsername] = useState<string|null>('');
    const [password, setPassword] = useState<string|null>('');
    const [email, setEmail] = useState<string|null>('');
    const [confirmPassword, setConfirmPassword] = useState<string|null>('');

    const emailregex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    const navigation = useNavigation();

    const onCreateAccountPressed = () => {
        if (!email || !password || !username || !confirmPassword) {
            ToastAndroid.show('Please fill out all fields', ToastAndroid.LONG);
        } else if (password !== confirmPassword) {
            ToastAndroid.show('Passwords do not match', ToastAndroid.LONG);
        } else if (username.length < 3) {
            ToastAndroid.show('Username must be at least 3 characters', ToastAndroid.LONG);
        } else if (!emailregex.test(email)) {
            ToastAndroid.show('Please enter a valid email', ToastAndroid.LONG);
        } else {
            console.warn('Create Account Pressed!');
        
            auth()
                .createUserWithEmailAndPassword(email, password)
                .then((userCredential) => {
                    const uid = userCredential.user.uid;
                    db.collection('users').doc(uid).set({
                        username: username,
                        email: email,
                    })
                    .then(() => {
                        ToastAndroid.show('Account Created and User added to Firestore!', ToastAndroid.LONG);
                        navigation.navigate('Home');
                    })
                    .catch((error: Error) => {
                        ToastAndroid.show('Failed to add user to Firestore: ' + error.message, ToastAndroid.LONG);
                    });
                })
                .catch((error: FirebaseError) => {
                    if (error.code === 'auth/email-already-in-use') {
                      ToastAndroid.show('That email address is already in use!', ToastAndroid.LONG);
                    } else if (error.code === 'auth/invalid-email') {
                      ToastAndroid.show('That email address is invalid!', ToastAndroid.LONG);
                    } else {
                      ToastAndroid.show(error.message, ToastAndroid.LONG);
                    }
                    console.error(error);
                });
        }
    };
    
    

    
    const onSignInPressed = () => {
        console.warn('Sign In Pressed!');

        navigation.navigate('SignIn');
    }

    const onTermsOfServicePress = () => {
        console.warn('Terms of Service Pressed!');

        // navigate to terms of service
        navigation.navigate('TermsOfService');
    }

    const onPrivacyPolicyPress = () => {
        console.warn('Privacy Policy Pressed!');

        // navigate to privacy policy
        navigation.navigate('PrivacyPolicy');
    }


    return (
        <ScrollView>
            <View>
                <Text style={styles.title}>Create an Account</Text>
                <CustomInput 
                    placeholder="Username" 
                    value={username} 
                    setValue={setUsername}
                    secureTextEntry={false}
                    icon={<Icon name="account-circle-outline" size={20} color="#FBFBF2" />}
                />
                <CustomInput 
                    placeholder="E-mail Address" 
                    value={email} 
                    setValue={setEmail}
                    secureTextEntry={false}
                    icon={<Icon name="email-outline" size={20} color="#FBFBF2" />}
                />
                <CustomInput 
                    placeholder="Password" 
                    value={password} 
                    setValue={setPassword}
                    secureTextEntry={true}
                    icon={<Icon name="lock-outline" size={20} color="#FBFBF2" />}
                />
                <CustomInput 
                    placeholder="Confirm Password" 
                    value={confirmPassword} 
                    setValue={setConfirmPassword}
                    secureTextEntry={true}
                    icon={<Icon name="lock-outline" size={20} color="#FBFBF2" />}
                />

                <CustomButton 
                    text="Create Account" 
                    onPress={onCreateAccountPressed}
                    type="PRIMARY"
                    icon={<Icon name="account-plus" size={20} color="#FBFBF2" />}
                />

                <SocialSignInButtons />

                <Text style={styles.text}>
                    By creating an account, you agree{"\n"} to our{'  '}
                    <Text style={styles.link} onPress={onTermsOfServicePress}>Terms of Service</Text> and{'  '}
                    <Text style={styles.link} onPress={onPrivacyPolicyPress}>Privacy Policy</Text>
                </Text>

                <CustomButton 
                    text="Already have an account? Sign In here!" 
                    onPress={onSignInPressed}
                    type="TERTIARY"
                    icon={<Icon name="login" size={20} color="#FBFBF2" />}
                />
            </View>
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
        marginVertical: 20,
        padding: 20,
    },
    text: {
        color: '#FBFBF2',
        textAlign: 'center',
        marginVertical: 10,
        padding: 20,
    },
    link: {
        color: '#5AB1FF',
        textAlign: 'center',
        marginVertical: 10,
        padding: 20,
    }
  });

export default SignUpScreen;