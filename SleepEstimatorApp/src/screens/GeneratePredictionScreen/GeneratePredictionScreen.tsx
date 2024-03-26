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
  
  const prepareDataForModel = (data: FirebaseFirestoreTypes.DocumentData | null): number[] => {
    if (!data) return [];
    return Object.keys(minMaxValues).map((feature) => {
      const { min, max } = minMaxValues[feature as keyof typeof minMaxValues];
      const value = parseFloat(data[feature] ?? min);
      return (value - min) / (max - min);
    });
  };

  const fetchDataForUserFromCollection = async (userId: string): Promise<FirebaseFirestoreTypes.DocumentData | null> => {
    try {
    const activityDataPromise = firestore().collection('activitydata').where('userId', '==', userId).get();
    const surveyDataPromise = firestore().collection('surveyresponses').where('userId', '==', userId).get();

    const [activityDataSnapshot, surveyDataSnapshot] = await Promise.all([activityDataPromise, surveyDataPromise]);

    let combinedData: FirebaseFirestoreTypes.DocumentData = {};

    activityDataSnapshot.forEach(doc => {
      combinedData = { ...combinedData, ...doc.data() };
    });

    surveyDataSnapshot.forEach(doc => {
      combinedData = { ...combinedData, ...doc.data() };
    });

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
            text="Home"
            onPress={onBackToHomePressed}
            type='PRIMARY'
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