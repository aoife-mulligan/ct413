import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import CustomButton from '../../components/CustomButton';
import { useNavigation } from '@react-navigation/native';

const PrivacyPolicy: React.FC = () => {

    const navigation = useNavigation();

    function onReturnPressed(): void {
        console.warn('Return Pressed!');

        navigation.navigate('SignUp');
    }

    return (
        <ScrollView>
            <Text>This is the privacy policy page.</Text>
            <Text>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam auctor, nisl id lacinia ultrices, nunc nunc tincidunt nunc, vel tincidunt nunc lacus id nunc. Sed euismod, purus sed aliquet tincidunt, mauris nunc tincidunt nunc, vel tincidunt nunc lacus id nunc. Sed euismod, purus sed aliquet tincidunt, mauris nunc tincidunt nunc, vel tincidunt nunc lacus id nunc.</Text>
            <Text>Phasellus auctor, nisl id lacinia ultrices, nunc nunc tincidunt nunc, vel tincidunt nunc lacus id nunc. Sed euismod, purus sed aliquet tincidunt, mauris nunc tincidunt nunc, vel tincidunt nunc lacus id nunc. Sed euismod, purus sed aliquet tincidunt, mauris nunc tincidunt nunc, vel tincidunt nunc lacus id nunc.</Text>
            <Text>Donec auctor, nisl id lacinia ultrices, nunc nunc tincidunt nunc, vel tincidunt nunc lacus id nunc. Sed euismod, purus sed aliquet tincidunt, mauris nunc tincidunt nunc, vel tincidunt nunc lacus id nunc. Sed euismod, purus sed aliquet tincidunt, mauris nunc tincidunt nunc, vel tincidunt nunc lacus id nunc.</Text>
        
            <CustomButton 
                text="Return to Sign Up" 
                onPress={onReturnPressed}
                type="PRIMARY"
            />
        </ScrollView>
    );
};

export default PrivacyPolicy;