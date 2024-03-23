import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';
import CustomButton from '../../components/CustomButton';
import { RouteProp, useNavigation } from '@react-navigation/native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore'; // Import Firestore
import SurveyQuestionBox from '../../components/SurveyQuestionBox.tsx';
import { useAuth } from '../../components/hooks/AuthContext';

type Props = {
    email: string;
    question: string;
    options: string[];
    onSelectOption: (response: string) => void;
};



const SurveyScreen: React.FC = () => {
    const navigation = useNavigation();
    const { user } = useAuth(); // Get the user object from AuthContext
    const db = firestore();

    // You can access the user's email directly from the user object
    const userEmail = user?.email;

    const onSignOutPressed = () => {
        auth()
            .signOut()
            .then(() => {
                console.warn('User signed out!');
                navigation.navigate('SignIn');
            })
            .catch((error) => {
                console.error('Sign out error:', error);
            });
    };
    

    const saveUserResponse = (fieldName: string, fieldValue: string) => {
        const currentUserUID = auth().currentUser?.uid;
    
        if (currentUserUID) {
            const userDocRef = db.collection('users').doc(currentUserUID);
            userDocRef.update({
                [fieldName]: fieldValue
            }).then(() => {
                console.log(`User response saved successfully for field ${fieldName}!`);
            }).catch((error) => {
                console.error(`Error saving user response for field ${fieldName}:`, error);
            });
        } else {
            console.error('Current user UID is not available.');
        }
    }
    

    function onBackToHomePressed(): void {
        navigation.navigate('Home');
    }

    return (
        <ScrollView>
            <Text style={styles.title}>Please answer all following questions to help us estimate your sleep quality.</Text>
            <Text style={styles.text}>Select the option that best describes you.</Text>
            <Text style={styles.text}> It is advised to re-answer these when your lifestyle changes.</Text>

            <SurveyQuestionBox
                question="Thinking about alcoholic beverages such as beer (12 oz.), wine (5 oz.), liquor or mixed drinks (1.5 oz.), how many drinks do you have in a typical week?"
                options={['None', '1-7 drinks', '8-14 drinks', '15-21 drinks', '22-28 drinks', '29 or more drinks']}
                onSelectOption={(response) => saveUserResponse('alcoholConsumption', response)}
            />
            <SurveyQuestionBox
                question="How hard is it for you (and your family) to pay for very basics like food, rent, mortgage, or heating, etc.?"
                options={['Very hard', 'Hard', 'Somewhat hard', 'Not very hard']}
                onSelectOption={(response) => saveUserResponse('basic_expenses', response)}
            />
            <SurveyQuestionBox
                question="Thinking about caffeinated beverages such as soda, coffee, energy drinks, and tea, how many cups (6-8 oz.) or cans (12 oz.) do you typically drink each day? Enter number of caffeinated beverages (cups/cans)"
                options={['None', '1-7 drinks', '8-14 drinks', '15-21 drinks', '22-28 drinks', '29 or more drinks']}
                onSelectOption={(response) => saveUserResponse('caffeine', response)}
            />
            <SurveyQuestionBox
                question="What best describes your current main daily activities?"
                options={['Working full-time (day shifts)', 'Working full-time (rotating or night shifts)', 'Working part-time (day shifts)', 'Working part-time (rotating or night shifts)', 'Unemployed', 'Student/In school', 'Stay-at-home parent/Keeping household', 'Retired', 'Disabled']}
                onSelectOption={(response) => saveUserResponse('daily_activities', response)}
            />
            <SurveyQuestionBox
                question="Do you now smoke every day, some days, or not at all?"
                options={['Every day', 'Some days', 'Not at all']}
                onSelectOption={(response) => saveUserResponse('daily_smoking', response)}
            />
            <SurveyQuestionBox
                question="What is the highest degree or level of school you have completed?"
                options={['Junior Cycle/Junior Certificate/Inter Cert  or less', 'Some Leaving Certificate, but did not graduate', 'Leaving Certificate or PLC', 'Some college or 2-year college graduate', '4-year college graduate', 'More than 4-year college degree']}
                onSelectOption={(response) => saveUserResponse('education', response)}
            />
            <SurveyQuestionBox
                question="Do you have flexible work hours that allow you to vary or make changes in the time you begin and end work?"
                options={['Yes', 'No']}
                onSelectOption={(response) => saveUserResponse('flexible_work_hours', response)}
            />
            <SurveyQuestionBox
                question="What is your sex?"
                options={['Female', 'Male', 'Other']}
                onSelectOption={(response) => saveUserResponse('gender', response)}
            />
            <SurveyQuestionBox
                question="I have a good life."
                options={['Strongly disagree', 'Disagree', 'Neither agree nor disagree', 'Agree', 'Strongly agree']}
                onSelectOption={(response) => saveUserResponse('good_life', response)}
            />
            <SurveyQuestionBox
                question="Are you of Hispanic, Latino or Spanish origin or ancestry? Please check all that apply."
                options={['No', 'Yes-Mexican, Mexican-American, or Chicano', 'Yes-Puerto Rican', 'Yes-Cuban', 'Yes-South or Central American', 'Yes-Other or Mixed Hispanic, Latino(a), or Spanish culture or origin']}
                onSelectOption={(response) => saveUserResponse('hispanic', response)}
            />
            {/*Using exchange rate where 1 Euro = 1.08 USD and rounding up*/}
            <SurveyQuestionBox 
                question="Last year, what was your total household income from all sources, before taxes?" 
                options={['Less than €9,500', '€9,500-46,500', '€46,500-93,000', '€93,000-139,000', '€139,000-185,500', '€185,500-231,500', '€231,500 and above']} 
                onSelectOption={(response) => saveUserResponse('income', response)} 
                />

            <SurveyQuestionBox
                question="What is your current marital status?"
                options={['Now married', 'Unmarried, but living with a partner', 'Widowed', 'Divorced', 'Separated', 'Never married']}
                onSelectOption={(response) => saveUserResponse('marital', response)}
            />
            <SurveyQuestionBox
                question="What is your race?"
                options={['American Indian or Alaska Native', 'Asian (Including South Asian and Asian Indian)', 'Black or African American', 'Native Hawaiian or other Pacific Islander', 'White', 'Multiple', 'Other', 'Unsure']}
                onSelectOption={(response) => saveUserResponse('race', response)}
            />
            <SurveyQuestionBox
                question="How would you describe your smoking status?"
                options={['Current everyday smoker', 'Current some day smoker', 'Former smoker', 'Never smoker', 'Smoker, current status unknown', 'Unknown if ever smoked', 'Heavy tobacco smoker', 'Light tobacco smoker']}
                onSelectOption={(response) => saveUserResponse('smoking_status', response)}
            />
            <SurveyQuestionBox
                question="Thinking about the past 3 months, which of the following best describes your work schedule? Would you say that you worked…"
                options={['Regular day shifts (anytime between 9AM and 5PM)', 'Regular evening shifts (anytime between 2PM and midnight)', 'Regular night shifts (anytime between 9PM and 8AM)', 'Rotating shifts (one that changes periodically from days to evenings)', 'A split shift (one consisting of two distinct periods each day)', 'An irregular schedule (inconsistent, on-call or flexible schedule)']}
                onSelectOption={(response) => saveUserResponse('work_schedule', response)}
            />
            <SurveyQuestionBox
                question="How much do you depend on an alarm clock?"
                options={['Not at all', 'Slightly', 'Somewhat', 'Very much']}
                onSelectOption={(response) => saveUserResponse('alarm_dependency', response)}
            />
            <SurveyQuestionBox
                question="In the past year how often have you had a crash or near miss because you dozed off while driving?"
                options={['3 or more', '1-2 per week', '1-2 per month', 'Less than 1 per month', 'Never', 'Don\'t know']}
                onSelectOption={(response) => saveUserResponse('driving_sleepy', response)}
            />
            <SurveyQuestionBox
                question="On most nights, how long does it take you to fall asleep?"
                options={['<5 minutes', '5-10 minutes', '10-20 minutes', '15-30 minutes', '30-45 minutes', '45-60 minutes', '60+ minutes']}
                onSelectOption={(response) => saveUserResponse('falling_asleep', response)}
            />
            <SurveyQuestionBox
                question="Would you consider yourself a morning or evening person?"
                options={['Morning person', 'Evening person']}
                onSelectOption={(response) => saveUserResponse('morning_person', response)}
            />
            <SurveyQuestionBox
                question="How much sleep do you lose because of your partner's sleep problems? (minutes)"
                options={['None', '1-15 minutes', '16-30 minutes', '31-45 minutes', '46-60 minutes', '60+ minutes']}
                onSelectOption={(response) => saveUserResponse('sleep_lost', response)}
            />
            <SurveyQuestionBox
                question="How many hours of sleep do you need to function your best during the day?"
                options={['<4 hours', '4-5 hours', '6 hours', '7 hours', '8 hours', '9 hours', '10 hours', '11 hours', '12+ hours']}
                onSelectOption={(response) => saveUserResponse('sleep_needed', response)}
            />
            <SurveyQuestionBox
                question="Most nights do you sleep …"
                options={['Alone', 'With your significant other', 'With your children', 'With a pet', 'Multiple (E.G. Partner and pet, partner and children, etc.)']}
                onSelectOption={(response) => saveUserResponse('sleep_partner', response)}
            />
            <SurveyQuestionBox
                question="How many hours of sleep do you get per night on workdays?"
                options={['<4 hours', '4-5 hours', '6 hours', '7 hours', '8 hours', '9 hours', '10 hours', '11 hours', '12+ hours']}
                onSelectOption={(response) => saveUserResponse('sleep_time_workday', response)}
            />
            <SurveyQuestionBox
                question="How many hours of sleep do you get per night on weekends/days off?"
                options={['<4 hours', '4-5 hours', '6 hours', '7 hours', '8 hours', '9 hours', '10 hours', '11 hours', '12+ hours']}
                onSelectOption={(response) => saveUserResponse('sleep_time_weekend', response)}
            />
            <SurveyQuestionBox
                question="Approximately what time would you wake up if you were free to plan your day?"
                options={['After 1PM', '5-6AM', '6-7AM', '7-8AM', '8-9AM', '9-10AM', '10-11AM', '11AM-Noon', 'Noon-1PM', 'After 1PM']}
                onSelectOption={(response) => saveUserResponse('wake_up_choices', response)}
            />
            <SurveyQuestionBox
                question="On average, how many times during the week do you take a nap?"
                options={['None', '1', '2-3', '4-5', 'More than 5']}
                onSelectOption={(response) => saveUserResponse('weekly_naps', response)}
            />
            <SurveyQuestionBox
                question="On average, how long would you say you usually nap?"
                options={['<15 minutes', '15-30 minutes', '30-45 minutes', '45-60 minutes', '60+ minutes', 'Don\'t know', 'Rarely nap, hard to say']}
                onSelectOption={(response) => saveUserResponse('nap_duration', response)}
            />
            <SurveyQuestionBox
                question="On average, how many times do you wake up during the night?"
                options={['1', '2', '3', '4', '5', '6', '7', '8', '9', '10+']}
                onSelectOption={(response) => saveUserResponse('wake_ups', response)}
            />
            <SurveyQuestionBox
                question="Does noise or light awaken you during the night?"
                options={['No', 'Yes']}
                onSelectOption={(response) => saveUserResponse('noise_light', response)}
            />
            <SurveyQuestionBox
                question="Does stress or inability to stop thinking awaken you during the night?"
                options={['No', 'Yes']}
                onSelectOption={(response) => saveUserResponse('stress_thinking', response)}
            />
            <SurveyQuestionBox
                question="Does another person awaken you during the night?"
                options={['No', 'Yes']}
                onSelectOption={(response) => saveUserResponse('other_person', response)}
            />
            <SurveyQuestionBox
                question="Does pain or discomfort awaken you during the night?"
                options={['No', 'Yes']}
                onSelectOption={(response) => saveUserResponse('pain_discomfort', response)}
            />
            <SurveyQuestionBox
                question="Do nightmares awaken you during the night?"
                options={['No', 'Yes']}
                onSelectOption={(response) => saveUserResponse('nightmares', response)}
            />
            <SurveyQuestionBox
                question="Do bathroom urges awaken you during the night?"
                options={['No', 'Yes']}
                onSelectOption={(response) => saveUserResponse('bathroom_urges', response)}
            />
            <SurveyQuestionBox
                question="Are there other reasons you wake during the night?"
                options={['No', 'Yes']}
                onSelectOption={(response) => saveUserResponse('other_reasons', response)}
            />
            {/* If the user is not female, they should select 'None of the above' for the following two questions */ }
            <Text style={styles.text}>If you are not female, please select 'None of the above', for the following two quesitons.</Text>
            <SurveyQuestionBox
                question="If you are female, do you or your doctor think that..."
                options={['You may be going through peri-menopause (you have changes in your periods but have not gone 12 months in a row without a period)', 'You are postmenopausal', 'You are neither peri- or post-menopausal']}
                onSelectOption={(response) => saveUserResponse('menopause', response)}
            />
            <SurveyQuestionBox
                question="If you are female, which of the following statements describes you?"
                options={['I have given birth in the past 6 months', 'I am currently pregnant', 'I have given birth more than six months ago', 'None of the above']}
                onSelectOption={(response) => saveUserResponse('recent_births', response)}
            />

            <CustomButton
                text="Back to Home"
                onPress={onBackToHomePressed}
                type="PRIMARY"
            />

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
        alignItems: 'center',
        justifyContent: 'center',
        alignContent: 'center',
        marginVertical: 20,
        padding: 20,
    },
    text: {
        fontSize: 20,
        marginBottom: 10,
        color: '#FBFBF2',
        textAlign: 'center',
        fontWeight: 'bold',
    },
    link: {
        color: '#5AB1FF',
        textAlign: 'center',
        marginVertical: 10,
        padding: 20,
    }
});

export default SurveyScreen;
