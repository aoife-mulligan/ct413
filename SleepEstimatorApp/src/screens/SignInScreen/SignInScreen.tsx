import React, {useState} from 'react';
import { View, Image, StyleSheet, useWindowDimensions, ScrollView } from 'react-native';
import Logo from '../../../assets/images/logos_bright/SleepSense_transparent.png'
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import SocialSignInButton from '../../components/SocialSignInButton';
// import secure text entry from react-native


const SignInScreen: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const {height} = useWindowDimensions();

    const onSignInPressed = () => {
        console.warn('Sign In Pressed!');
    }

    const forgotPasswordPressed = () => {
        console.warn('Forgot Password Pressed!');
    }

    const onSignUpPressed = () => {
        console.warn('Sign Up Pressed!');
    }

    return (
        <ScrollView>
            <View>
                <Image source={Logo}
                style={[styles.logo, {height: height * 0.3}]}
                resizeMode="contain"
                />

                <CustomInput 
                    placeholder="Username" 
                    value={username} 
                    setValue={setUsername}
                    secureTextEntry={false}
                />
                <CustomInput 
                    placeholder="Password" 
                    value={password} 
                    setValue={setPassword}
                    secureTextEntry={true}
                />

                <CustomButton 
                    text="Sign In" 
                    onPress={onSignInPressed}
                    type="PRIMARY"
                />

                <CustomButton 
                    text="Forgot Password?" 
                    onPress={forgotPasswordPressed}
                    type="TERTIARY"
                />

                <SocialSignInButton />

                <CustomButton 
                    text="Don't have an account? Create one!" 
                    onPress={onSignUpPressed}
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
  });

export default SignInScreen;