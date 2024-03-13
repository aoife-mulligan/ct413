import React, {useState} from 'react';
import { View, StyleSheet, useWindowDimensions, ScrollView, Text } from 'react-native';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import SocialSignInButtons from '../../components/SocialSignInButton';
import { useNavigation } from '@react-navigation/native';



const ConfirmEmailScreen: React.FC = () => {
    const [code, setCode] = useState('');

    const navigation = useNavigation();

    const onConfirmPressed = () => {
        console.warn('Confirm Pressed!');

        //navigate to home
        navigation.navigate('Home');
        
    }

    const onSignInPressed = () => {
        console.warn('Sign In Pressed!');

        navigation.navigate('SignIn');
    }

    const onResendPressed = () => {
        console.warn('Resend Code Pressed!');

        //resend code
    }

    return (
        <ScrollView>
            <View>
                <Text style={styles.title}>Confirm Your Email</Text>
                <CustomInput 
                    placeholder="Enter confirmation code" 
                    value={code} 
                    setValue={setCode}
                    secureTextEntry={false}
                />
                
                <CustomButton 
                    text="Confirm" 
                    onPress={onConfirmPressed}
                    type="PRIMARY"
                />

                <CustomButton 
                    text="Back to Sign In" 
                    onPress={onSignInPressed}
                    type="SECONDARY"
                />

    	        <CustomButton 
                    text="Resend Code" 
                    onPress={onResendPressed}
                    type="SECONDARY"
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

export default ConfirmEmailScreen;