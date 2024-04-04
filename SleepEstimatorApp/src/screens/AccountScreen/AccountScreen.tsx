import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';
import { useNavigation } from '@react-navigation/native';
import CustomButton from '../../components/CustomButton';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const AccountScreen: React.FC = () => {
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [loading, setLoading] = useState(false);
    const navigation = useNavigation();

    useEffect(() => {
        const user = auth().currentUser;
        if (user) {
            setEmail(user.email || '');
            const unsubscribe = firestore().collection('users').doc(user.uid)
                .onSnapshot(doc => {
                    setUsername(doc.data()?.username || '');
                });

            return () => unsubscribe(); 
        } else {
            navigation.navigate('SignIn');
        }
    }, [navigation]);

    const handleUpdate = async () => {
        setLoading(true);
        const user = auth().currentUser;
        if (user) {
            try {
                await user.updateEmail(email);
                await firestore().collection('users').doc(user.uid).update({ username });
                Alert.alert('Success', 'Your account details have been updated.');
            } catch (error) {
                console.error(error);
                Alert.alert('Update failed', 'There was a problem updating your account details.');
            }
        }
        setLoading(false);
    };

    const handleDeleteAccount = async () => {
        Alert.alert('Confirm Deletion', 'Are you sure you want to delete your account? This action cannot be undone.', [
            { text: 'Cancel', style: 'cancel' },
            {
                text: 'Delete', style: 'destructive', onPress: async () => {
                    setLoading(true);
                    const user = auth().currentUser;
                    if (user) {
                        await firestore().collection('users').doc(user.uid).delete();
                        await user.delete();
                        setLoading(false);
                        Alert.alert('Account Deleted', 'Your account has been deleted successfully.');
                        navigation.navigate('SignIn');
                    }
                }
            },
        ]);
    };

    const handleSignOut = async () => {
        setLoading(true);
        await auth().signOut();
        setLoading(false);
        navigation.navigate('SignIn'); 
    };

    const onHomePressed = () => {
        navigation.navigate('Home');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Account Details</Text>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputContainer}>
                <Icon name="email-outline" size={20} color="#FBFBF2" style={styles.inputIcon} />
                    <TextInput
                    style={[styles.input, {flex: 1}]}
                    value={email}
                    onChangeText={setEmail}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholder="Enter your email"
                    placeholderTextColor="#FBFBF2"
                />
            </View>

            <Text style={styles.label}>Username</Text>

            <View style={styles.inputContainer}>
                <Icon name="account" size={20} color="#FBFBF2" style={styles.inputIcon} />
                    <TextInput
                    style={[styles.input, {flex: 1}]}
                    value={username}
                    onChangeText={setUsername}
                    keyboardType="email-address"
                    autoCapitalize="none"
                    placeholder="Enter your email"
                    placeholderTextColor="#FBFBF2"
                />
            </View>

            <CustomButton
                text={loading ? 'Loading...' : 'Update Details'}
                onPress={handleUpdate}
                type="PRIMARY"
                icon={<Icon name="update" size={20} color="#FBFBF2" />}
            />

            <CustomButton
                text="Home"
                onPress={onHomePressed}
                type="PRIMARY"
                icon={<Icon name="home" size={20} color="#FBFBF2" />}
            />

            <CustomButton
                text="Sign Out"
                onPress={handleSignOut}
                type="SECONDARY"
                icon={<Icon name="logout" size={20} color="#8B88F8" />}
            />

            <Text/>
            <Text/>

            <CustomButton
                text="Delete My Account"
                onPress={handleDeleteAccount}
                type="DELETE"
                icon={<Icon name="delete-forever" size={20} color="red" />}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
        padding: 10,
        borderRadius: 100,
        color: '#FBFBF2',
     },
    inputIcon: {
        marginRight: 10,
        marginBottom: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#FBFBF2',
        marginTop: 10,
        alignContent: 'center',
        textAlign: 'center',
    },
    label: {
        fontSize: 18,
        marginBottom: 10,
        color: '#FBFBF2',
    },
    input: {
        fontSize: 16,
        borderWidth: 1,
        borderColor: 'gray',
        marginBottom: 20,
        padding: 10,
        borderRadius: 100,
        color: '#FBFBF2',
    },
});

export default AccountScreen;
