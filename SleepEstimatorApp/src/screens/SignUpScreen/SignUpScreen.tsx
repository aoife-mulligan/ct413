import React, {useState} from 'react';
import { View, StyleSheet, useWindowDimensions, ScrollView, Text } from 'react-native';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import SocialSignInButtons from '../../components/SocialSignInButton';
// import secure text entry from react-native


const SignUpScreen: React.FC = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const onCreateAccountPressed = () => {
        console.warn('Create Account Pressed!');
    }
    
    const onSignInPressed = () => {
        console.warn('Sign In Pressed!');
    }

    const onTermsOfServicePress = () => {
        console.warn('Terms of Service Pressed!');
    }

    const onPrivacyPolicyPress = () => {
        console.warn('Privacy Policy Pressed!');
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