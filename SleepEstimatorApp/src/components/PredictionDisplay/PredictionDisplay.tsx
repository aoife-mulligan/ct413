import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { ScrollView } from 'react-native-gesture-handler';

interface PredictionDisplayProps {
    prediction: string;
}

const PredictionDisplay: React.FC<PredictionDisplayProps> = ({ prediction }) => {
    return (
        //scrollview with text displaying the prediction
        <ScrollView>
            <Text style={styles.text}>{prediction}</Text>
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignSelf: 'center',
        justifyContent: 'center',
        alignContent: 'center',
        alignItems: 'center',
    },
    text: {
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
        margin: 16,
        color: '#FBFBF2',
    },
});

export default PredictionDisplay;