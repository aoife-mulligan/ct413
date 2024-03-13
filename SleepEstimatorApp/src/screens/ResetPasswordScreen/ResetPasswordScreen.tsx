import React, { useState } from 'react';
import CustomInput from '../../components/CustomInput';
import CustomButton from '../../components/CustomButton';
import { StyleSheet, Text, View, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';


const ResetPasswordScreen: React.FC = () => {
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const navigation = useNavigation();


    const onResetPassword = () => {
        console.warn('Reset Password Pressed!');

        navigation.navigate('SignIn');
    };

    const onSignInPressed = () => {
        console.warn('Sign In Pressed!');

        navigation.navigate('SignIn');
    };

    return (
        <ScrollView>
            <View>
                <Text style={styles.title}>Reset Password</Text>
                <CustomInput
                    placeholder="Enter confirmation code" 
                    value={password} 
                    setValue={setPassword}
                    secureTextEntry={true}
                />

                <CustomInput
                    placeholder="Confirm Password"
                    value={password} 
                    setValue={setPassword}
                    secureTextEntry={true}
                />

                <CustomButton 
                onPress={onResetPassword} 
                text={"Reset Password"} 
                type="PRIMARY"
                />

                <CustomButton 
                onPress={onSignInPressed} 
                text={"Back to Sign In"} 
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

export default ResetPasswordScreen;