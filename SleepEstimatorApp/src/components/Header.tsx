/**
 * 
 * Header component
 * 
 * 
 */

import React from 'react';
import type {PropsWithChildren} from 'react';
import {StyleSheet, Text, useColorScheme, View} from 'react-native';
import {Colors} from 'react-native/Libraries/NewAppScreen';

type HeaderProps = {
  title: string;
};

// Header component definition
const Header: React.FC<HeaderProps> = ({ title }) => {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>{title}</Text>
      </View>
    );
  };

// StyleSheet for the Header component
const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 70, // Fixed height for the header
        backgroundColor: '#525250', // Light grey background
        alignItems: 'center', // Center items horizontally in the container
        justifyContent: 'center', // Center items vertically in the container
        shadowColor: '#000', // Shadow color
        shadowOffset: { width: 0, height: 2 }, // Shadow offset
        shadowOpacity: 0.25, // Shadow opacity
        shadowRadius: 3.84, // Shadow radius
        elevation: 5, // Elevation for Android
    },
    title: {
        fontSize: 20, // Font size for the title
        fontWeight: 'bold', // Bold font weight for the title
        color: '#eba688', // White text color
        shadowColor: '#332c2c', // Shadow color
        shadowOffset: { width: 10, height: 2 }, // Shadow offset
        shadowOpacity: 0.25, // Shadow opacity
        shadowRadius: 3.84, // Shadow radius
        elevation: 5, // Elevation for Android
    },
  });

export default Header;
