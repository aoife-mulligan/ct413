import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export type LogDataBoxType = 'STEPS' | 'HEART_RATE_MAX' | 'HEART_RATE_MIN' | 'HEART_RATE_AVG' | 'DISTANCE';

interface LogDataBoxProps {
  type: LogDataBoxType;
  value: string;
  onEdit: () => void;
}

const LogDataBox: React.FC<LogDataBoxProps> = ({ type, value, onEdit }) => {
  const iconDetails = {
    STEPS: { iconName: 'walk', title: 'Step Count' },
    HEART_RATE_MIN: { iconName: 'heart-pulse', title: 'Min Heart Rate' },
    HEART_RATE_MAX: { iconName: 'heart-pulse', title: 'Max Heart Rate' },
    HEART_RATE_AVG: { iconName: 'heart-pulse', title: 'Avg Heart Rate' },
    DISTANCE: { iconName: 'run-fast', title: 'Distance' }, 
    WEIGHT: { iconName: 'weight-kilogram', title: 'Weight' },
    HEIGHT: { iconName: 'human-male-height-variant', title: 'Height' },
  };

const { iconName, title } = iconDetails[type] || { iconName: 'alert-outline', title: 'Unknown' };

return (
    <View style={styles.container}>
        <Icon name={iconName} size={24} color="#B57EDC" />
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.value}>{value}</Text>
        <TouchableOpacity onPress={() => {
            console.log('Edit pressed');
            onEdit();
        }}>
            <Icon name="plus-circle-outline" size={24} color="#B57EDC" />
        </TouchableOpacity>
    </View>
);
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    borderRadius: 20,
    paddingVertical: 20,
    paddingHorizontal: 15,
    marginVertical: 10,
    width: '80%',
    alignSelf: 'center',
  },
  title: {
    flex: 1,
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FBFBF2',
    marginLeft: 10,
  },
  value: {
    fontSize: 18,
    color: '#FBFBF2',
    marginRight: 10,
  },
});

export default LogDataBox;
