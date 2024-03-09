import { Pressable, StyleSheet, Text } from "react-native";

interface CustomButtonProps {
    text: string;
    onPress: () => void;
    type?: 'PRIMARY' | 'SECONDARY' | 'TERTIARY';
    bgColor?: string;
    fgColor?: string;
}

const CustomButton: React.FC<CustomButtonProps> = ({
    onPress,
    text,
    type = "PRIMARY",
    bgColor,
    fgColor,
  }) => {
    return (
      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.container,
          styles[`container_${type}`],
          bgColor ? { backgroundColor: bgColor } : {},
        ]}
      >
        <Text style={[styles.text, styles[`text_${type}`], fgColor ? { color: fgColor } : {}]}>
          {text}
        </Text>
      </Pressable>
    );
  };

const styles = StyleSheet.create({
    container: {
        width: '80%',
        padding: 15,
        alignSelf: 'center',
        alignItems: 'center',
        borderRadius: 5,
        marginVertical: 10,
    },
    text: {
        fontWeight: 'bold',
    },

    container_PRIMARY: {
        backgroundColor: '#3B71F3',
    },
    container_SECONDARY: {},
    container_TERTIARY: {},

    text_PRIMARY: {
        color: 'white',
    },
    text_SECONDARY: {},
    text_TERTIARY: {
        color: '#FBFBF2'
    },
});

export default CustomButton;