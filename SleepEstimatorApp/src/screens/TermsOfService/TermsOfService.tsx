import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { ScrollView, Text } from 'react-native';
import CustomButton from '../../components/CustomButton';

const TermsOfService: React.FC = () => {

    const navigation = useNavigation();

    const onReturnPressed = () => {
        console.warn('Return Pressed!');

        navigation.navigate('SignUp');
    }

    return (
        <ScrollView>
            <Text>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla facilisi. Sed euismod
                mauris non nisl tincidunt, at aliquam nunc tincidunt. Sed auctor, nunc a aliquet
                consectetur, nunc nunc lacinia nunc, nec lacinia nunc nunc auctor nunc. Nulla
                facilisi. Sed euismod mauris non nisl tincidunt, at aliquam nunc tincidunt. Sed
                auctor, nunc a aliquet consectetur, nunc nunc lacinia nunc, nec lacinia nunc nunc
                auctor nunc.
            </Text>

            <CustomButton 
                text="Return to Sign Up" 
                onPress={onReturnPressed}
                type="PRIMARY"
            />
        </ScrollView>
    );
};

export default TermsOfService;