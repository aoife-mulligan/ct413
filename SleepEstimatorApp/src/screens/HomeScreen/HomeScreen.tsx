import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import CustomButton from '../../components/CustomButton';
import { RouteProp, useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';

type HomeScreenRouteProp = RouteProp<{ Home: { email: string } }, 'Home'>;

type Props = {
    route: HomeScreenRouteProp;
}; 


const HomeScreen: React.FC<Props> = ({ route }) => {

    const email = route?.params?.email || 'No email provided';
    const navigation = useNavigation();

    const onSignOutPressed = () => {
        console.warn('Sign Out Pressed!');
        auth()
            .signOut()
            .then(() => {
                console.warn('User signed out!');
            });

        navigation.navigate('SignIn');
    }

    return (
        <ScrollView>
            <Text style={styles.title}>Hello, {email}!</Text>

            // insert 'sleep rating' component here

            // insert 'add' buttons here

            <CustomButton 
                text="Sign Out" 
                onPress={onSignOutPressed}
                type="SECONDARY"
            
            />
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

export default HomeScreen;

