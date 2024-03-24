import React, {useState} from 'react';
import { View, Image, StyleSheet, useWindowDimensions, ScrollView, ToastAndroid } from 'react-native';
import Logo from '../../../assets/images/logo/KnowYourNightLogo.png'
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import SocialSignInButton from '../../components/SocialSignInButton';
import { NavigationProp, useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const SignInScreen: React.FC = () => {
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');

    const {height} = useWindowDimensions();
    const navigation = useNavigation();

    const onSignInPressed = () => {

        console.warn('Sign In Pressed!');

        if (!password && !email) {
            ToastAndroid.show('Please fill out all fields', ToastAndroid.LONG);
        } else if (email && password){
            auth()
                .signInWithEmailAndPassword(email, password)
                .then(() => {
                    ToastAndroid.show('Signed In!', ToastAndroid.LONG);
                    console.log("Email on HomeScreen:", email);
                    navigation.navigate('Home');
                })
                .catch((error: { message: string; }) => {
                    ToastAndroid.show(error.message, ToastAndroid.LONG);
                    console.error(error);
                });
        }
    }

    const forgotPasswordPressed = () => {
        console.warn('Forgot Password Pressed!');
        navigation.navigate('ForgotPassword');
    }

    const onSignUpPressed = () => {
        console.warn('Sign Up Pressed!');
        navigation.navigate('SignUp');
    }

    return (
        <ScrollView>
            <View style={styles.root}>
                <Image source={Logo}
                style={[styles.logo, {height: height * 0.4}]}
                resizeMode="contain"
                />

                <CustomInput 
                    placeholder="Username" 
                    value={email} 
                    setValue={setEmail}
                    secureTextEntry={false}
                    icon={<Icon name="account-outline" size={20} color="#FBFBF2" />}
                />
                <CustomInput 
                    placeholder="Password" 
                    value={password} 
                    setValue={setPassword}
                    secureTextEntry={true}
                    icon={<Icon name="lock-outline" size={20} color="#FBFBF2" />}
                />

                <CustomButton 
                    text="Sign In" 
                    onPress={onSignInPressed}
                    type="PRIMARY"
                    icon={<Icon name="login" size={20} color="#FBFBF2" />}
                />
                {/*}
                <CustomButton 
                    text="Forgot Password?" 
                    onPress={forgotPasswordPressed}
                    type="TERTIARY"
                    icon={<Icon name="lock-reset" size={20} color="#FBFBF2" />}
                />
                */}

                <SocialSignInButton />

                <CustomButton 
                    text="Don't have an account? Create one!" 
                    onPress={onSignUpPressed}
                    type="TERTIARY"
                    icon={<Icon name="account-plus" size={20} color="#FBFBF2" />}
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
  });

export default SignInScreen;