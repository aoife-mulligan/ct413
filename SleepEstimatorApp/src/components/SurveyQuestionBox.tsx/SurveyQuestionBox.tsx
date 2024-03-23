import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

type Props = {
    question: string;
    options: string[];
    onSelectOption: (option: string) => void;
};

const SurveyQuestionBox: React.FC<Props> = ({ question, options, onSelectOption }) => {
    const [selectedOption, setSelectedOption] = useState<string | null>(null);

    const handleOptionSelection = (option: string) => {
        setSelectedOption(option);
        onSelectOption(option); // Call the onSelectOption function with the selected option
    };

    return (
        <View style={styles.container}>
            <Text style={styles.question}>{question}</Text>
            <View style={styles.optionsContainer}>
                {options.map((option, index) => (
                    <TouchableOpacity
                        key={index}
                        style={[styles.optionButton, selectedOption === option && styles.selectedOptionButton]}
                        onPress={() => handleOptionSelection(option)}
                    >
                        <Text style={styles.optionText}>{option}</Text>
                    </TouchableOpacity>
                ))}
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        marginVertical: 10,
        borderRadius: 5,
    },
    question: {
        fontSize: 18,
        marginBottom: 10,
        color: '#FBFBF2',
        textAlign: 'center',
    },
    optionsContainer: {
        flexDirection: 'column',
    },
    optionButton: {
        paddingVertical: 10,
        paddingHorizontal: 3,
        borderWidth: 1,
        borderColor: '#B57EDC',
        backgroundColor: '#B57EDC',
        borderRadius: 100,
        marginBottom: 5,
        alignItems: 'center',
        textAlign: 'center',
    },
    selectedOptionButton: {
        backgroundColor: '#8B88F8',
        borderColor: '#8B88F8',
    },
    optionText: {
        fontSize: 16,
        color: '#FBFBF2',
    },
});

export default SurveyQuestionBox;
