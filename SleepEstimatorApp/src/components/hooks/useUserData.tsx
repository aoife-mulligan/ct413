// useUserData.ts
import { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import firestore from '@react-native-firebase/firestore';

interface UserData {
    name: string;
    age: number;
  }

const useUserData = () => {
  const [data, setData] = useState<UserData | null>(null);

  const fetchDataFromFirestore = async (): Promise<UserData | null> => {
    const userId = 'yourUserId';
    const userDoc = await firestore().collection('users').doc(userId).get();
    
    if (userDoc.exists) {
      return userDoc.data() as UserData;
    } else {
      
      console.error('No document found for user');
      return null;
    }
  };

  const loadData = async () => {
    const storedDate = await AsyncStorage.getItem('lastUpdateDate');
    const currentDate = new Date().toISOString().split('T')[0];

    if (storedDate !== currentDate) {
      
      const newData = await fetchDataFromFirestore();
      if (newData) {
        await AsyncStorage.setItem('userData', JSON.stringify(newData));
        await AsyncStorage.setItem('lastUpdateDate', currentDate);
        setData(newData);
      }
    } else {
      
      const dataString = await AsyncStorage.getItem('userData');
      if (dataString) {
        setData(JSON.parse(dataString) as UserData);
      }
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  return data;
};

export default useUserData;
