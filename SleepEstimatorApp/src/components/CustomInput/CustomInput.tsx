import React from 'react';
import { View, TextInput, StyleSheet, TextInputProps } from 'react-native';

interface CustomInputProps extends TextInputProps {
    value: string;
    setValue: (value: string) => void;
    placeholder: string;
}

const CustomInput: React.FC<CustomInputProps> = ({ value, setValue, placeholder, secureTextEntry }) => {
    return (
        <View style={styles.container}>
            <TextInput
                value={value}
                onChangeText={setValue}
                placeholder={placeholder}
                placeholderTextColor="white"
                style={styles.input}
                secureTextEntry={secureTextEntry}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#424B54',
        width: '80%',
        borderColor: '#424B54',
        borderWidth: 1,
        borderRadius: 5,
        paddingHorizontal: 10,
        marginVertical: 10,
        alignSelf: 'center',
    },
    input: {
        color: 'white',
    },
});

export default CustomInput;
