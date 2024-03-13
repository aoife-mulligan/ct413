import React from 'react';
import { View, Text } from 'react-native';
import CustomButton from '../CustomButton/CustomButton';

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
                />
        </>
    );
};

export default SocialSignInButtons;