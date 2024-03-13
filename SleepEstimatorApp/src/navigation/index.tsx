import 'react-native-gesture-handler';
import React from 'react';
import { View, Text } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator, StackNavigationProp } from '@react-navigation/stack';
import { enableScreens } from 'react-native-screens';

import SignInScreen from '../screens/SignInScreen';
import SignUpScreen from '../screens/SignUpScreen';
import ConfirmEmailScreen from '../screens/ConfirmEmailScreen';
import ForgotPasswordScreen from '../screens/ForgotPasswordScreen';
import ResetPasswordScreen from '../screens/ResetPasswordScreen';
import HomeScreen from '../screens/HomeScreen';
import PrivacyPolicy from '../screens/PrivacyPolicy';
import TermsOfService from '../screens/TermsOfService';
import { User } from 'firebase/auth';

interface NavigationProps {
    user: User | null;
}

enableScreens();

const Stack = createStackNavigator();

const Navigation: React.FC<NavigationProps> = ({ user }) => {
    return (
        <Stack.Navigator
            initialRouteName={user ? "HomeScreen" : "SignInScreen"}
            screenOptions={{
                headerShown: false,
                cardStyle: { backgroundColor: '#262626' },
            }}
        >

            {user ? (
                <>
                    <Stack.Screen name="Home" component={HomeScreen} />
                    {/* Add other screens that should be accessible after sign in */}
                </>
            ) : (
                <>
                    <Stack.Screen name="SignIn" component={SignInScreen} />
                    <Stack.Screen name="SignUp" component={SignUpScreen} />
                    <Stack.Screen name="ConfirmEmail" component={ConfirmEmailScreen} />
                    <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
                    <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
                    {/* Screens like PrivacyPolicy and TermsOfService might be accessible regardless of sign-in status */}
                    <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
                    <Stack.Screen name="TermsOfService" component={TermsOfService} />
                </>
            )}
        </Stack.Navigator>
    );
};

export default Navigation;