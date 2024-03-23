import React from 'react';
import { View, Text } from 'react-native';
import CustomButton from '../CustomButton/CustomButton';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


interface SocialSignInButtonsProps {
    // Define your props here
}

const SocialSignInButtons: React.FC<SocialSignInButtonsProps> = (props) => {
    // Add your component logic here
    const onSignInGoogle = () => {
        console.warn('Sign In with Google Pressed!');
    }

    const onSignInFacebook = () => {
        console.warn('Sign In with Facebook Pressed!');
    }

    return (
        <>
            <CustomButton 
                text="Sign In with Google" 
                onPress={onSignInGoogle}
                type="PRIMARY"
                bgColor='#FAE9EA'
                fgColor='#DB4437'
                icon={<Icon name="google-plus" size={20} color="#DB4437" />}
            />
        </>
    );
};

export default SocialSignInButtons;