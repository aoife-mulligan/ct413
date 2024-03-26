import React from 'react';
import { View, Text } from 'react-native';
import CustomButton from '../CustomButton/CustomButton';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


interface SocialSignInButtonsProps {
    onSignInGoogle: () => void;
}

const SocialSignInButtons: React.FC<SocialSignInButtonsProps> = (props) => {
    const onSignInGoogle = () => {
        console.warn('Sign In with Google Pressed!');
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