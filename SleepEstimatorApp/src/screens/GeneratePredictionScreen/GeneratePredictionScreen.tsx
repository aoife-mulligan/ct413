import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-react-native';
import firestore, { FirebaseFirestoreTypes } from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { bundleResourceIO } from '@tensorflow/tfjs-react-native';
import CustomButton from '../../components/CustomButton';
import { useNavigation } from '@react-navigation/native';
import PredictionDisplay from '../../components/PredictionDisplay';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';


interface MinMaxValues {
    [key: string]: { min: number; max: number };
  }
  
  

  const minMaxValues = {
    'bodyMass_kg': {'min': 0, 'max': 635},
    'height_m': {'min': 0, 'max': 2.72},
    'bmi': {'min': 0, 'max': 204},
    'mean_hr/s': {'min': 0, 'max': 4},
    'max_hr': {'min': 0, 'max': 4},
    'min_hr': {'min': 0, 'max': 4},
    'totalSteps': {'min': 0, 'max': 238000},
    'totalDistance': {'min': 0, 'max': 160000},
    'alcohol_consumption': {'min': 0, 'max': 5},
    'basic_expenses': {'min': 1, 'max': 6},
    'caffeine': {'min': 0, 'max': 60},
    'daily_activities': {'min': 1, 'max': 10},
    'daily_smoking': {'min': 1, 'max': 3},
    'education': {'min': 1, 'max': 6},
    'flexible_work_hours': {'min': 1, 'max': 3},
    'gender': {'min': 1, 'max': 2},
    'good_life': {'min': 1, 'max': 5},
    'hispanic': {'min': 1, 'max': 6},
    'income': {'min': 1, 'max': 9},
    'marital': {'min': 1, 'max': 6},
    'race': {'min': 1, 'max': 9},
    'smoking_status': {'min': 1, 'max': 9},
    'menopause': {'min': 1, 'max': 3},
    'recent_births': {'min': 1, 'max': 4},
    'current_pregnant': {'min': 0, 'max': 2},  
    'work_schedule': {'min': 1, 'max': 7},
    'alarm_dependency': {'min': 1, 'max': 4},
    'driving_sleepy': {'min': 1, 'max': 6},
    'falling_asleep': {'min': 1, 'max': 7},
    'morning_person': {'min': 1, 'max': 3},
    'nap_duration': {'min': 1, 'max': 7},
    'sleep_lost': {'min': 0, 'max': 1440},
    'sleep_needed': {'min': 0, 'max': 24},
    'sleep_partner': {'min': 1, 'max': 6},
    'sleep_time_workday': {'min': 0, 'max': 24},
    'sleep_time_weekend': {'min': 0, 'max': 24},
    'wake_up_choices': {'min': 1, 'max': 10},
    'wake_ups': {'min': 0, 'max': 30},
    'weekly_naps': {'min': 1, 'max': 5},
    'noise_light': {'min': 0, 'max': 1},
    'stress_thinking': {'min': 0, 'max': 1},
    'other_person': {'min': 0, 'max': 1},
    'pain_discomfort': {'min': 0, 'max': 1},
    'nightmares': {'min': 0, 'max': 1},
    'bathroom_urges': {'min': 0, 'max': 1},
    'other_reasons': {'min': 0, 'max': 1}
  };
  
  const minMaxNormalization = (value: number, min: number, max: number): number => {
    return (value - min) / (max - min);
  };

  const convertBPMtoBPS = (bpm: number): number => {
    return bpm / 60;
  };
  
  const prepareDataForModel = (data: FirebaseFirestoreTypes.DocumentData | null): number[] => {
    if (!data) return [];
    let value = 0;
    return Object.keys(minMaxValues).map((feature) => {
      const { min, max } = minMaxValues[feature as keyof typeof minMaxValues];
      
      if (feature === 'bodyMass_kg' || feature === 'height_m' || feature === 'bmi' || feature === 'totalSteps' || feature === 'totalDistance') {
        value = parseFloat(data[feature] ?? min);
      } else if (feature === 'mean_hr/s' || feature === 'max_hr' || feature === 'min_hr') {
        value = parseFloat(data[feature] ?? min);
        value = convertBPMtoBPS(value);
      } else if (feature === 'alcoholConsumption') {
        if (data[feature] === 'None') {
          value = 0;
        } else if (data[feature] === '1-7 drinks') {
          value = 1;
        } else if (data[feature] === '8-14 drinks') {
          value = 2;
        } else if (data[feature] === '15-21 drinks') {
          value = 3;
        } else if (data[feature] === '22-28 drinks') {
          value = 4;
        } else if (data[feature] === '29 or more drinks') {
          value = 5;
        }
      } else if (feature === 'basicExpenses') {
        if (data[feature] === 'Very hard') {
          value = 1;
        } else if (data[feature] === 'Hard') {
          value = 2;
        } else if (data[feature] === 'Somewhat hard') {
          value = 3;
        } else if (data[feature] === 'Not very hard') {
          value = 4;
        } else if (data[feature] === 'Don\'t know') {
          value = 5;
        }
      } else if (feature === 'caffeine') {
        value = parseFloat(data[feature] ?? min);
      } else if (feature === 'dailyActivities') {
        if (data[feature] === 'Working full-time (day shifts)') {
          value = 1;
        } else if (data[feature] === 'Working full-time (rotating or night shifts)') {
          value = 2;
        } else if (data[feature] === 'Working part-time (day shifts)') {
          value = 3;
        } else if (data[feature] === 'Working part-time (rotating or night shifts)') {
          value = 4;
        } else if (data[feature] === 'Unemployed') {
          value = 5;
        } else if (data[feature] === 'Student/In school') {
          value = 6;
        } else if (data[feature] === 'Stay-at-home parent/Keeping household') {
          value = 7;
        } else if (data[feature] === 'Retired') {
          value = 8;
        } else if (data[feature] === 'Disabled') {
          value = 9;
        }
      } else if (feature === 'dailySmoking') {
        if (data[feature] === 'Every day') {
          value = 1;
        } else if (data[feature] === 'Some days') {
          value = 2;
        } else if (data[feature] === 'Not at all') {
          value = 3;
        }
      } else if (feature === 'education') {
        if (data[feature] === 'Junior Cycle/Junior Certificate/Inter Cert or less') {
          value = 1;
        } else if (data[feature] === 'Some Leaving Certificate, but did not graduate') {
          value = 2;
        } else if (data[feature] === 'Leaving Certificate or PLC') {
          value = 3;
        } else if (data[feature] === 'Some college or 2-year college graduate') {
          value = 4;
        } else if (data[feature] === '4-year college graduate') {
          value = 5;
        } else if (data[feature] === 'More than 4-year college degree') {
          value = 6;
        }
      } else if (feature === 'flexibleWorkHours') {
        if (data[feature] === 'Yes') {
          value = 1;
        } else if (data[feature] === 'No') {
          value = 2;
        }
      } else if (feature == 'gender') {
        if (data[feature] === 'Female') {
          value = 1;
        } else if (data[feature] === 'Male') {
          value = 2;
        } else if (data[feature] === 'Other') {
          value = 3;
        }
      } else if (feature === 'goodLife') {
        if (data[feature] === 'Strongly disagree') {
          value = 1;
        } else if (data[feature] === 'Disagree') {
          value = 2;
        } else if (data[feature] === 'Neither agree nor disagree') {
          value = 3;
        } else if (data[feature] === 'Agree') {
          value = 4;
        } else if (data[feature] === 'Strongly agree') {
          value = 5;
        }
      } else if (feature === 'hispanic') {
        if (data[feature] === 'No') {
          value = 1;
        } else if (data[feature] === 'Yes-Mexican, Mexican American, Chicano') {
          value = 2;
        } else if (data[feature] === 'Yes-Puerto Rican') {
          value = 3;
        } else if (data[feature] === 'Yes-Cuban') {
          value = 4;
        } else if (data[feature] === 'Yes-South or Central American') {
          value = 5;
        } else if (data[feature] === 'Yes-Other or Mixed Hispanic, Latino(a), or Spanish culture or origin') {
          value = 6;
        }
      } else if (feature === 'income') {
        if (data[feature] === 'Less than €9,500') {
          value = 1;
        } else if (data[feature] === '€9,500-46,500') {
          value = 2;
        } else if (data[feature] === '€46,500-93,000') {
          value = 3;
        } else if (data[feature] === '€93,000-139,000') {
          value = 4;
        } else if (data[feature] === '€139,000-185,500') {
          value = 5;
        } else if (data[feature] === '€185,500-231,500') {
          value = 6;
        } else if (data[feature] === '€231,500 and above') {
          value = 7;
        }
      } else if (feature === 'marital') {
        if (data[feature] === 'Now married') {
          value = 1;
        } else if (data[feature] === 'Unmarried, but living with a partner') {
          value = 2;
        } else if (data[feature] === 'Widowed') {
          value = 3;
        } else if (data[feature] === 'Divorced') {
          value = 4;
        } else if (data[feature] === 'Separated') {
          value = 5;
        } else if (data[feature] === 'Never married') {
          value = 6;
        }
      } else if (data[feature] === 'race') {
        if (data[feature] === 'American Indian or Alaska Native') {
          value = 1;
        } else if (data[feature] === 'Asian (Including South Asian and Asian Indian)') {
          value = 2;
        } else if (data[feature] === 'Black or African American') {
          value = 3;
        } else if (data[feature] === 'Native Hawaiian or Other Pacific Islander') {
          value = 4;
        } else if (data[feature] === 'White') {
          value = 5;
        } else if (data[feature] === 'Multiple') {
          value = 6;
        } else if (data[feature] === 'Other') {
          value = 7;
        } else if (data[feature] === 'Don\'t know') {
          value = 8;
        }
      } else if (feature === 'smoking_status') {
        if (data[feature] === 'Current everyday smoker') {
          value = 1;
        } else if (data[feature] === 'Current some day smoker') {
          value = 2;
        } else if (data[feature] === 'Former smoker') {
          value = 3;
        } else if (data[feature] === 'Never smoker') {
          value = 4;
        } else if (data[feature] === 'Smoker, current status unknown') {
          value = 5;
        } else if (data[feature] === 'Unknown if ever smoked') {
          value = 6;
        } else if (data[feature] === 'Heavy tobacco smoker') {
          value = 7;
        } else if (data[feature] === 'Light tobacco smoker') {
          value = 8;
        }
      } else if (data[feature] === 'menopause') {
        if (data[feature] === 'You may be going through peri-menopause (you have changes in your periods but have not gone 12 months in a row without a period)') {
          value = 1;
        } else if (data[feature] === 'You are postmenopausal') {
          value = 2;
        } else if (data[feature] === 'Neither/None of the above') {
          value = 3;
        }
      } else if (data[feature] === 'recent_births') {
        if (data[feature] === 'I have given birth in the past 6 months') {
          value = 1;
        } else if (data[feature] === 'I am currently pregnant') {
          value = 2;
        } else if (data[feature] === 'I have given birth more than 6 months ago') {
          value = 3;
        } else if (data[feature] === 'None of the above') {
          value = 4;
        }
      } else if (data[feature] === 'current_pregnant') {
        if (data[feature] === '12 weeks or less (1-3 months)') {
          value = 1;
        } else if (data[feature] === '13-27 weeks (4-6 months)') {
          value = 2;
        } else if (data[feature] === '28 weeks or more (7 months or more)') {
          value = 3;
        } else if (data[feature] === 'None of the above') {
          value = 4;
        }
      } else if (data[feature] === 'work_schedule') {
        if (data[feature] === 'Regular day shifts (anytime between 9AM and 5PM)') {
          value = 1;
        } else if (data[feature] === 'Regular evening shifts (anytime between 2PM and midnight)') {
          value = 2;
        } else if (data[feature] === 'Regular night shifts (anytime between 9PM and 8AM)') {
          value = 3;
        } else if (data[feature] === 'Rotating shifts (one that changes periodically from days to evenings)') {
          value = 4;
        } else if (data[feature] === 'A split shift (one consisting of two distinct periods each day') {
          value = 5;
        } else if (data[feature] === 'An irregular schedule (inconsistent, on-call or flexible schedule)') {
          value = 6;
        }
      } else if (data[feature] === 'alarm_dependency') {
        if (data[feature] === 'Not at all') {
          value = 1;
        } else if (data[feature] === 'Slightly') {
          value = 2;
        } else if (data[feature] === 'Somewhat') {
          value = 3;
        } else if (data[feature] === 'Very much') {
          value = 4;
        }
      } else if (data[feature] === 'driving_sleepy') {
        if (data[feature] === '3 or more') {
          value = 1;
        } else if (data[feature] === '1-2 per week') {
          value = 2;
        } else if (data[feature] === '1-2 per month') {
          value = 3;
        } else if (data[feature] === 'Less than 1 per month') {
          value = 4;
        } else if (data[feature] === 'Never') {
          value = 5;
        }
      } else if (data[feature] === 'falling_asleep') {
        if (data[feature] === '<5 minutes') {
          value = 1;
        } else if (data[feature] === '5-10 minutes') {
          value = 2;
        } else if (data[feature] === '10-20 minutes') {
          value = 3;
        } else if (data[feature] === '15-30 minutes') {
          value = 4;
        } else if (data[feature] === '30-45 minutes') {
          value = 5;
        } else if (data[feature] === '45-60 minutes') {
          value = 6;
        } else if (data[feature] === '60+ minutes') {
          value = 7;
        }
      } else if (data[feature] === 'morning_person') {
        if (data[feature] === 'Morning person') {
          value = 1;
        } else if (data[feature] === 'Evening person') {
          value = 2;
        }
      } else if (data[feature] === 'sleep_lost') {
        value = parseFloat(data[feature] ?? min);
      } else if (data[feature] === 'sleep_needed') {
        value = parseFloat(data[feature] ?? min);
      } else if (data[feature] === 'sleep_partner') {
        if (data[feature] === 'Alone') {
          value = 1;
        } else if (data[feature] === 'With your significant other') {
          value = 2;
        } else if (data[feature] === 'With your children') {
          value = 3;
        } else if (data[feature] === 'With a pet') {
          value = 4;
        } else if (data[feature] === 'Multiple (E.G. Partner and pet, partner and children, etc.)') {
          value = 5;
        }
      } else if (data[feature] === 'sleep_time_workday') {
        value = parseFloat(data[feature] ?? min);
      } else if (data[feature] === 'sleep_time_weekend') {
        value = parseFloat(data[feature] ?? min);
      } else if (data[feature] === 'wake_up_choices') {
        if (data[feature] === '5-6AM') {
          value = 1;
        } else if (data[feature] === '6-7AM') {
          value = 2;
        } else if (data[feature] === '7-8AM') {
          value = 3;
        } else if (data[feature] === '8-9AM') {
          value = 4;
        } else if (data[feature] === '9-10AM') {
          value = 5;
        } else if (data[feature] === '10-11AM') {
          value = 6;
        } else if (data[feature] === '11AM-Noon') {
          value = 7;
        } else if (data[feature] === 'Noon-1PM') {
          value = 8;
        } else if (data[feature] === 'After 1PM') {
          value = 9;
        }
      } else if (data[feature] === 'weekly_naps') {
        if (data[feature] === 'None') {
          value = 1;
        } else if (data[feature] === '1-2') {
          value = 2;
        } else if (data[feature] === '3-4') {
          value = 3;
        } else if (data[feature] === 'More than 5') {
          value = 4;
        }
      } else if (data[feature] === 'nap_duration') {
        if (data[feature] === '<15 minutes') {
          value = 1;
        } else if (data[feature] === '15-30 minutes') {
          value = 2;
        } else if (data[feature] === '30-45 minutes') {
          value = 3;
        } else if (data[feature] === '60+ minutes') {
          value = 4;
        } else if (data[feature] === 'Don\'t know') {
          value = 5;
        } else if (data[feature] === 'Rarely nap, hard to say') {
          value = 6;
        }
      } else if (data[feature] === 'wake_ups') {
        value = parseFloat(data[feature] ?? min);
      } else if (data[feature] === 'noise_light') {
        if (data[feature] === 'No') {
          value = 0;
        } else if (data[feature] === 'Yes') {
          value = 1;
        }
      } else if (data[feature] === 'stress_thinking') {
        if (data[feature] === 'No') {
          value = 0;
        } else if (data[feature] === 'Yes') {
          value = 1;
        }
      } else if (data[feature] === 'other_person') {
        if (data[feature] === 'No') {
          value = 0;
        } else if (data[feature] === 'Yes') {
          value = 1;
        }
      } else if (data[feature] === 'pain_discomfort') {
        if (data[feature] === 'No') {
          value = 0;
        } else if (data[feature] === 'Yes') {
          value = 1;
        }
      } else if (data[feature] === 'nightmares') {
        if (data[feature] === 'No') {
          value = 0;
        } else if (data[feature] === 'Yes') {
          value = 1;
        }
      } else if (data[feature] === 'bathroom_urges') {
        if (data[feature] === 'No') {
          value = 0;
        } else if (data[feature] === 'Yes') {
          value = 1;
        }
      } else if (data[feature] === 'other_reasons') {
        if (data[feature] === 'No') {
          value = 0;
        } else if (data[feature] === 'Yes') {
          value = 1;
        }
      }
    
      console.log(`${feature}: ${value}`);

      const normalizedValue = minMaxNormalization(value, min, max);
      console.log("AFTER NORMALISATION")
      console.log(`${feature}: ${normalizedValue}`);

      return normalizedValue;
  });
  };

  const fetchDataForUserFromCollection = async (userId: string): Promise<FirebaseFirestoreTypes.DocumentData | null> => {
    try {
    const activityDataPromise = firestore().collection('activityData').where('userId', '==', userId).get();
    const surveyDataPromise = firestore().collection('surveyresponses').where('userId', '==', userId).get();

    const [activityDataSnapshot, surveyDataSnapshot] = await Promise.all([activityDataPromise, surveyDataPromise]);

    let combinedData: FirebaseFirestoreTypes.DocumentData = {};

    activityDataSnapshot.forEach(doc => {
      console.log("Activity Data for User:", doc.id, " => ", doc.data());
      combinedData[doc.data().question] = doc.data().response;
    });

    surveyDataSnapshot.forEach(doc => {
      console.log("Survey Data for User:", doc.id, " => ", doc.data());
      combinedData[doc.data().question] = doc.data().response;
    });

    console.log("Original Data for User:", combinedData);

    return combinedData;
  } catch (error) {
    console.error("Error fetching user data:", error);
    return null;
  }
};

const savePredictionToFirestore = async (userId: string, predictionValue: number) => {
  const predictionData = {
    predictionValue,
    timestamp: firestore.FieldValue.serverTimestamp(),
  };

  try {
    await firestore()
      .collection('predictions')
      .doc(userId)
      .set(predictionData);
    console.log('Prediction saved successfully.');
    console.log(predictionData);
  } catch (error) {
    console.error('Error saving prediction:', error);
  }
};

const GeneratePredictionScreen: React.FC = () => {
  const navigation = useNavigation();
  const [predictionResult, setPredictionResult] = useState<string>('Loading the model...');
  const [predictionValue, setPredictionValue] = useState<number | null>(null);

  const onBackToHomePressed = () => {
    navigation.navigate('Home');
  };

  const onReccommendationsPressed = () => {
    navigation.navigate('ReccommendationsScreen');
  };
  
    useEffect(() => {
      const loadTFAndModelAndPredict = async () => {
        try {
          const modelJson = require('../../../assets/tfjsmodel/model.json');
          const modelWeights = require('../../../assets/tfjsmodel/group1-shard1of1.bin');

            await tf.ready();
            const model = await tf.loadGraphModel(bundleResourceIO(modelJson, modelWeights));
    
            const user = auth().currentUser;
            if (user) {
                setPredictionResult('Getting your data...');
                const userData = await fetchDataForUserFromCollection(user.uid);
                if (userData) {
                    setPredictionResult('Making a prediction...');
                    const preparedData = prepareDataForModel(userData);
                    console.log("Prepared Data for Prediction:", preparedData);
                    const inputTensor = tf.tensor2d([preparedData]);
    
                    const prediction = model.predict(inputTensor) as tf.Tensor;
                    const predictionArray = await prediction.array();
                    if (predictionArray instanceof Array && predictionArray[0] instanceof Array) {
                      const predictionValue: number = predictionArray[0][0] as number;
                      setPredictionValue(predictionValue);
                      setPredictionResult(`Prediction: ${predictionValue.toFixed(2)}`);
                      await savePredictionToFirestore(user.uid, predictionValue);
                    } else {
                        console.error("Unexpected prediction array structure");
                    }
    
                    prediction.dispose();
                } else {
                    setPredictionResult('Failed to fetch user data or user data is missing.');
                }
            } else {
                setPredictionResult('No user is currently logged in.');
            }
            } catch (error) {
                if (error instanceof Error) {
                    console.error("An error occurred:", error.message);
                    setPredictionResult(`Error: ${error.message}`);
                } else {
                    console.error("An error occurred:", error);
                    setPredictionResult("An unexpected error occurred.");
                }
        }
      };
  
      loadTFAndModelAndPredict();
    }, [auth().currentUser?.uid]);
  
    return (
      <ScrollView>
        <Text style={styles.title}>Your Sleep Quality Prediction...</Text>
        <PredictionDisplay prediction={predictionValue} />
        <CustomButton
            text="See Your Reccommendations"
            onPress={onReccommendationsPressed}
            type='PRIMARY'
            icon={<Icon name="lightbulb-on-outline" size={20} color="#FBFBF2" />}
        />
        <CustomButton
            text="Home"
            onPress={onBackToHomePressed}
            type='PRIMARY'
            icon={<Icon name="home" size={20} color="#FBFBF2" />}
        />
      </ScrollView>
    );
  };

export default GeneratePredictionScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#262626',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FBFBF2',
    textAlign: 'center',
    marginTop: 20,
    padding: 20,
  },
  text: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFD700',
  },
});