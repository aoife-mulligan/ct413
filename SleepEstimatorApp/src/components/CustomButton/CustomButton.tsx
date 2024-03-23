import { Pressable,View, StyleSheet, Text } from "react-native";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

interface CustomButtonProps {
    text: string;
    onPress: () => void;
    type?: 'PRIMARY' | 'SECONDARY' | 'TERTIARY';
    bgColor?: string;
    fgColor?: string;
    icon?: JSX.Element;
}

const CustomButton: React.FC<CustomButtonProps> = ({
    onPress,
    text,
    type = "PRIMARY",
    bgColor,
    fgColor,
    icon,
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
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                {icon && <View style={styles.icon}>{icon}</View>}
                <Text style={[styles.text, styles[`text_${type}`], fgColor ? { color: fgColor } : {}]}>
                    {text}
                </Text>
            </View>
      </Pressable>
    );
  };

const styles = StyleSheet.create({
    container: {
        width: '80%',
        padding: 15,
        alignSelf: 'center',
        alignItems: 'center',
        borderRadius: 100,
        marginVertical: 10,
    },
    text: {
        fontWeight: 'bold',
        fontSize: 18,
    },
    icon: {
        marginRight: 30,
    },

    container_PRIMARY: {
        backgroundColor: '#8B88F8',
    },
    container_SECONDARY: {
        borderColor: '#8B88F8',
        borderWidth: 2,

    },
    container_TERTIARY: {
        width: '70%',
        padding: 15,
    },

    text_PRIMARY: {
        color: '#FBFBF2',
    },
    text_SECONDARY: {
        color: '#8B88F8',
    },
    text_TERTIARY: {
        color: '#FBFBF2',
        fontWeight: 'normal',
        textAlign: 'center',
    },
});

export default CustomButton;