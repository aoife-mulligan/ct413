import React from 'react';
import { View, TextInput, StyleSheet, TextInputProps } from 'react-native';
import icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface CustomInputProps extends TextInputProps {
    value: string;
    setValue: (value: string) => void;
    placeholder: string;
    icon?: JSX.Element;
    secureTextEntry?: boolean;
}

const CustomInput: React.FC<CustomInputProps> = ({ value, setValue, placeholder, secureTextEntry, icon}) => {
    return (
        <View style={styles.container}>
            {icon && <View style={styles.icon}>{icon}</View>}
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
        borderRadius: 100,
        paddingHorizontal: 10,
        marginVertical: 10,
        alignSelf: 'center',
        flexDirection: 'row',
        alignItems: 'center',
    },
    input: {
        color: 'white',
        flex: 1,
    },
    icon: {
        position: 'relative',
        marginRight: 10,
    },
});

export default CustomInput;
