import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Keyboard } from 'react-native';

type SurveyNumericQuestionBoxProps = {
    question: string;
    onEnterValue: (value: string) => void;
};

const SurveyNumericQuestionBox: React.FC<SurveyNumericQuestionBoxProps> = ({ question, onEnterValue }) => {
    const [inputValue, setInputValue] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [submitted, setSubmitted] = useState<boolean>(false);

    const handleValueSubmission = () => {
        if (isNaN(Number(inputValue)) || inputValue.trim() === '') {
            setError('Please enter a valid number');
            return;
        }
        setError(null);
        onEnterValue(inputValue.trim());
        setSubmitted(true);
        Keyboard.dismiss();
    };

    return (
        <View style={styles.container}>
            <Text style={styles.question}>{question}</Text>
            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    keyboardType="numeric"
                    value={inputValue}
                    onChangeText={(text) => {
                        setInputValue(text);
                        setSubmitted(false);
                    }}
                    placeholder="Enter a number"
                    placeholderTextColor="#ccc"
                />
                {submitted && <Text style={styles.tickMark}>☑</Text>}
            </View>
            {error && <Text style={styles.errorText}>{error}</Text>}
            <TouchableOpacity
                style={styles.submitButton}
                onPress={handleValueSubmission}
            >
                <Text style={styles.submitButtonText}>Submit</Text>
            </TouchableOpacity>
            {/* {submitted && <Text style={styles.tickMark}>hi</Text>}*/}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 20,
        marginVertical: 10,
        borderRadius: 30,
        backgroundColor: '#8B88F8',
        width: '90%',
        alignSelf: 'center',
    },
    question: {
        fontSize: 18,
        marginBottom: 10,
        color: '#FBFBF2',
        textAlign: 'center',
    },
    input: {
        backgroundColor: '#FFFFFF',
        borderRadius: 5,
        color: '#000',
        paddingHorizontal: 10,
        paddingVertical: 8,
        fontSize: 16,
        marginBottom: 5,
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        alignContent: 'center',
        position: 'relative',
        alignSelf: 'center',
    },
    errorText: {
        fontSize: 14,
        color: 'red',
        marginBottom: 5,
        textAlign: 'center',
    },
    submitButton: {
        backgroundColor: '#B57EDC',
        paddingVertical: 10,
        borderRadius: 100,
        marginTop: 10,
        width: '50%',
        alignSelf: 'center',
    },
    submitButtonText: {
        textAlign: 'center',
        color: '#FBFBF2',
        fontSize: 16,
    },
    tickMark: {
        fontSize: 24,
        color: 'green',
        textAlign: 'center',
        marginTop: 10,
        marginLeft: 10,
        marginRight: 10,
        alignSelf: 'baseline',
    },
});

export default SurveyNumericQuestionBox;
