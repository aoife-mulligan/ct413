import React, { useState, useEffect } from 'react';
import { View, Text, FlatList, ScrollView, StyleSheet } from 'react-native';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import { useAuth } from '../../components/hooks/AuthContext';
import CustomButton from '../../components/CustomButton';
import navigation from '../../navigation';
import { useNavigation } from '@react-navigation/native';

interface SurveyResponses {
    [question: string]: string;
}

interface ReccommendationsScreenProps extends SurveyResponses {
    id: string;
    alcoholConsumption?: string;
    basic_expenses?: string;
    caffeine?: string;
    daily_activities?: string;
    daily_smoking?: string;
    education?: string;
    flexible_work_hours?: string;
    gender?: string;
    good_life?: string;
    hispanic?: string;
    income?: string;
    marital?: string;
    race?: string;
    smoking_status?: string;
    menopause?: string;
    //current_pregnant?: string;
    work_schedule?: string;
    alarm_dependency?: string;
    driving_sleepy?: string;
    falling_asleep?: string;
    morning_person?: string;
    nap_duration?: string;
    sleep_lost?: string;
    sleep_needed?: string;
    sleep_partner?: string;
    sleep_time_workday?: string;
    sleep_time_weekend?: string;
    wake_up_choices?: string;
    wake_ups?: string;
    weekly_naps?: string;
    noise_light?: string;
    stress_thinking?: string;
    other_person?: string;
    pain_discomfort?: string;
    nightmares?: string;
    bathroom_urges?: string;
    other_reasons?: string;
    [key: string]: any;
}


const ReccommendationsScreen: React.FC = () => {
    const { user } = useAuth();
    const [responses, setResponses] = useState<ReccommendationsScreenProps[]>([]);
    const advice1 = "Aim to reduce stress as much as possible throughout the day - especially a few hours before bed.\n Consider doing deep breathing exercises or meditation.";
    const advice1extra = "If you're experiencing stress or anxiety, consider talking to a trusted friend or mental health professional.";
    const advice2 = "You seem to drink a lot of caffeinated beverages. \n Try to avoid caffeine in the afternoon and evening.";
    const advice3 = "You've noted that noise or light wakes you up.\n Consider using an eyemask or earplugs.";
    const navigation = useNavigation();

    useEffect(() => {
        if (user) {
            const unsubscribe = firestore()
                .collection('surveyresponses')
                .where('userId', '==', user.uid)
                .onSnapshot(querySnapshot => {
                    // Reduce the documents into a single object
                    const userResponses = querySnapshot.docs.reduce<SurveyResponses>((acc, doc) => {
                        const data: FirebaseFirestoreTypes.DocumentData = doc.data();
                        const question: string = data.question;
                        const response: string = data.response;
                        acc[data.question] = data.response;
                        return acc;
                    }, {});
    
                    // Set the reduced object as the single element in the responses array
                    setResponses([{ id: user.uid, ...userResponses }]);
                }, err => {
                    console.log(`Encountered error: ${err}`);
                });
    
            return () => unsubscribe();
        }
    }, [user]);

    const checkUserResponses = (responses: ReccommendationsScreenProps) => {
        const nightmaresResponse = responses.nightmares;
        const noiseLightResponse = responses.noise_light;
        const fallingAsleepResponse = responses.falling_asleep;
        const napDurationResponse = responses.nap_duration;
        const caffeineResponse = responses.caffeine;
        

        if (nightmaresResponse === 'Yes') {
            const nightmaresAdvice = "If you're experiencing nightmares, consider talking to a mental health professional.";
        }
    
        if (noiseLightResponse === 'Yes') {
            const noiseLightAdvice = "Consider using an eyemask or earplugs to block out noise and light.";
        }

        if (fallingAsleepResponse === 'No') {
            const fallingAsleepAdvice = "If you're having trouble falling asleep, consider creating a bedtime routine.";
        }

        if (napDurationResponse === 'Yes') {
            const napDurationAdvice = "If you're taking long naps, consider reducing the duration of your naps.";
        }

        if (caffeineResponse === 'Yes') {
            const caffeineAdvice = "If you're consuming a lot of caffeine, consider reducing your caffeine intake.";
        }
    
    };
    
    const renderResponse = ({ item }: { item: ReccommendationsScreenProps }) => {
        const nightmaresAdvice = "If you're experiencing nightmares, consider talking to a mental health professional. Aim to reduce stress as much as possible throughout the day - especially a few hours before bed. \n Consider doiong deep breathing exercises or meditation.";
        const noiseLightAdvice = "You've noted that noise or light sometimes wakes you up. \n Consider using an eyemask or earplugs to block out noise and light.";
        const fallingAsleepAdvice= "Aim to reduce stress as much as possible throughout the day - especially a few hours before bed. \n Consider doiong deep breathing exercises or meditation. \n Consider keeping a notebook next to your bed to write down any thoughts that are keeping you awake."
        const stressAdvice = "If you're experiencing stress or anxiety, consider talking to a trusted friend or mental health professional.";
        const napDurationAdvice = "If you're taking long naps, consider reducing the duration of your naps.";
        const caffeineAdvice = "If you're consuming a lot of caffeine, consider reducing your caffeine intake. Generally, it's best to avoid caffeine in the afternoon and evening.";
        return (
            <View style={{ padding: 10 }}>
                {item.nightmares === 'Yes' && (
                    <Text style={styles.adviceText}>{nightmaresAdvice}</Text>
                )}
                {item.noise_light === 'Yes' && (
                    <Text style={styles.adviceText}>{noiseLightAdvice}</Text>
                )}
                {item.falling_asleep === '5-10 minutes' && (
                    <Text style={styles.adviceText}>{fallingAsleepAdvice}{stressAdvice}</Text>
                )}
                {item.nap_duration === 'Long' && ( // todo update this
                    <Text style={styles.adviceText}>{napDurationAdvice}</Text>
                )}
                {item.caffeine === '8-14 drinks' && ( // todo update this
                    <Text style={styles.adviceText}>{caffeineAdvice}</Text>
                )}
            </View>
        );
    };

    return (
        <FlatList
            data={responses}
            renderItem={renderResponse}
            keyExtractor={item => item.id}
            ListHeaderComponent={<Text style={styles.title}>{"Sleep Tips"}</Text>}
            ListFooterComponent={
                <View style={{ alignItems: 'center', padding: 20 }}>
                    
                    
                    <CustomButton 
                        text="Back" 
                        onPress={() => navigation.navigate('Home')} 
                    />
                </View>
            }
            contentContainerStyle={{ flexGrow: 1 }}
        />
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FBFBF2',
        textAlign: 'center',
        marginVertical: 20,
    },
    adviceText: {
        fontSize: 20,
        color: '#FBFBF2',
        textAlign: 'center',
        padding: 20,
    },
});


export default ReccommendationsScreen;
