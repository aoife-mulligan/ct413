import React, {useState} from 'react';
import { View, StyleSheet, useWindowDimensions, ScrollView, Text, ToastAndroid } from 'react-native';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import SocialSignInButtons from '../../components/SocialSignInButton';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../../navigation';
import auth from '@react-native-firebase/auth';
// import secure text entry from react-native


const SignUpScreen: React.FC = () => {
    const [username, setUsername] = useState<string|null>('');
    const [password, setPassword] = useState<string|null>('');
    const [email, setEmail] = useState<string|null>('');
    const [confirmPassword, setConfirmPassword] = useState<string|null>('');

    const emailregex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,4}$/;

    const navigation = useNavigation();

    const onCreateAccountPressed = () => {
        if (!email && !password && !username && !confirmPassword) {
            ToastAndroid.show('Please fill out all fields', ToastAndroid.LONG);
        } else if (password && confirmPassword && password !== confirmPassword) {
            ToastAndroid.show('Passwords do not match', ToastAndroid.LONG);
        } else if (password && password.length < 6) {
            ToastAndroid.show('Password must be at least 6 characters', ToastAndroid.LONG);
        } else if (username && username.length < 6) {
            ToastAndroid.show('Username must be at least 6 characters', ToastAndroid.LONG);
        } else if (email && email.length < 6 && !emailregex.test(email)) {
            ToastAndroid.show('Email must be at least 6 characters', ToastAndroid.LONG);
        }        
        else if (email && password){
            console.warn('Create Account Pressed!');

            auth()
                .createUserWithEmailAndPassword(email, password)
                .then(() => {
                    ToastAndroid.show('Account Created!', ToastAndroid.LONG);
            })
            .catch((error: { message: string; }) => {
                ToastAndroid.show(error.message, ToastAndroid.LONG);
                console.error(error);
            });

            navigation.navigate('Home');
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
                />
                <CustomInput 
                    placeholder="E-mail Address" 
                    value={email} 
                    setValue={setEmail}
                    secureTextEntry={false}
                />
                <CustomInput 
                    placeholder="Password" 
                    value={password} 
                    setValue={setPassword}
                    secureTextEntry={true}
                />
                <CustomInput 
                    placeholder="Confirm Password" 
                    value={confirmPassword} 
                    setValue={setConfirmPassword}
                    secureTextEntry={true}
                />

                <CustomButton 
                    text="Create Account" 
                    onPress={onCreateAccountPressed}
                    type="PRIMARY"
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