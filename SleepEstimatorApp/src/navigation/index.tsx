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
import SurveyScreen from '../screens/SurveyScreen';
import LogDataScreen from '../screens/LogDataScreen/LogDataScreen';
import { useAuth } from '../components/hooks/AuthContext';
import GeneratePredictionScreen from '../screens/GeneratePredictionScreen/GeneratePredictionScreen';
import ReccommendationsScreen from '../screens/ReccommendationsScreen';
import AccountScreen from '../screens/AccountScreen';


enableScreens();

type RootStackParamList = {
    Home: undefined;
    SurveyScreen: undefined;
    LogDataScreen: undefined;
    GeneratePredictionScreen: undefined;
    ReccommendationsScreen: undefined;
    AccountScreen: undefined;
    SignIn: undefined;
    SignUp: undefined;
    ConfirmEmail: undefined;
    ForgotPassword: undefined;
    ResetPassword: undefined;
    PrivacyPolicy: undefined;
    TermsOfService:undefined;
}

const Stack = createStackNavigator();

const Navigation: React.FC = () => {
    const { user } = useAuth();
    return (
        <Stack.Navigator
            initialRouteName={user ? "Home" : "SignIn"}
            screenOptions={{
                headerShown: false,
                cardStyle: { backgroundColor: '#262626' },
            }}
        >

            {user ? (
                <>
                    <Stack.Screen name="Home" component={HomeScreen} />
                    <Stack.Screen name="SurveyScreen" component={SurveyScreen} />
                    <Stack.Screen name="LogDataScreen" component={LogDataScreen} />
                    <Stack.Screen name="GeneratePredictionScreen" component={GeneratePredictionScreen} />
                    <Stack.Screen name="ReccommendationsScreen" component={ReccommendationsScreen} />
                    <Stack.Screen name="AccountScreen" component={AccountScreen} />
                </>
            ) : (
                <>
                    <Stack.Screen name="SignIn" component={SignInScreen} />
                    <Stack.Screen name="SignUp" component={SignUpScreen} />
                    <Stack.Screen name="ConfirmEmail" component={ConfirmEmailScreen} />
                    <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
                    <Stack.Screen name="ResetPassword" component={ResetPasswordScreen} />
                    <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicy} />
                    <Stack.Screen name="TermsOfService" component={TermsOfService} />
                </>
            )}
        </Stack.Navigator>
    );
};

export default Navigation;