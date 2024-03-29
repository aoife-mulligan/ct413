import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { StyleSheet, View, Text } from 'react-native';

interface PredictionDisplayProps {
    prediction: number | null;
}

const PredictionDisplay: React.FC<PredictionDisplayProps> = ({ prediction }) => {
    const navigation = useNavigation();

    if (prediction !== null) {
        const totalStars = 5;
        const scaledPrediction = Math.round(prediction * 4 + 1);
        const starRating = Math.round(scaledPrediction * 2) / 2;
        const fullStars = Math.floor(starRating);
        const emptyStars = totalStars - fullStars;

        const goldStars = ' ★ '.repeat(fullStars);
        const greyStars = ' ★ '.repeat(emptyStars);

        let explanation = 'Your Sleep Quality Prediction...'

        if (scaledPrediction == 1) {
            explanation = 'Very Poor'
        } else if (scaledPrediction == 2) {
            explanation = 'Poor'
        } else if (scaledPrediction == 3) {
            explanation = 'Fair'
        } else if (scaledPrediction == 4) {
            explanation = 'Good'
        } else if (scaledPrediction == 5) {
            explanation = 'Very Good'
        } else {
            explanation = 'Unknown Sleep Quality \n Have you logged your data?'
        }

        return (
            <View style={styles.container}>
                <Text style={styles.text}>Prediction: {scaledPrediction}</Text>
                <Text style={styles.text}>{explanation}</Text>
                <View style={{ flexDirection: 'row' }}>
                    <Text style={styles.goldStar}>{[goldStars]}</Text>
                    <Text style={styles.greyStar}>{[greyStars]}</Text>
                </View>
            </View>
        );
    } else {
        return <Text style={styles.smalltext}>No prediction available!</Text>;
    }
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#262626',
    },
    smalltext: {
        fontSize: 16,
        color: '#FBFBF2',
        padding: 20,
        textAlign: 'center',
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        color: '#FBFBF2',
        padding: 20,
        textAlign: 'center',
    },
    goldStar: {
        fontSize: 50,
        fontWeight: 'bold',
        color: '#D4AF37', 
        paddingBottom: 20,
        paddingTop: 20,
    },
    greyStar: {
        fontSize: 50,
        fontWeight: 'bold',
        color: '#4F4F4F',
        paddingBottom: 20,
        paddingTop: 20,
    },
});

export default PredictionDisplay;
