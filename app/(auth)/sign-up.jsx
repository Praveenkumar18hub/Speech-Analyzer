import { View, Text, SafeAreaView, Alert, ActivityIndicator, TouchableWithoutFeedback, Keyboard, ScrollView } from 'react-native';
import React, { useState } from 'react';
import Header from '../../components/Header';
import FormField from '../../components/FormField';
import CustomButton from '../../components/CustomButton';
import { Link, router } from 'expo-router';
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth } from '../../firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';

const SignUp = () => {
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleChange = (key, value) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const submit = async () => {
    const { username, email, password } = form;
  
    if (!username || !email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return; 
    }
  
    setSubmitting(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      await updateProfile(user, { displayName: username, });
  
      await AsyncStorage.setItem('user', JSON.stringify({ email, username }));
  
      Alert.alert("Success", "Account created successfully! Please log in.");
      router.push('/sign-in');
    } catch (error) {
      Alert.alert("Error", error.message);
      console.error('Error during sign up:', error);
    } finally {
      setSubmitting(false);
    }
  };
  
  return (
    <SafeAreaView className="bg-prime flex-1">
      <Header onBackPress={() => router.push('/')} />
      
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <ScrollView>

      <View className="justify-center h-[700px] px-4 py-4 ml-5 mr-3 ">
        
        <Text className="text-3xl text-secondary font-psemibold opacity-80">
          Sign Up to Voice
        </Text>

        <FormField
          title="Username"
          value={form.username}
          handleChangeText={(value) => handleChange('username', value)}
          otherStyles="mt-10"
        />

        <FormField
          title="Email"
          value={form.email}
          handleChangeText={(value) => handleChange('email', value)}
          otherStyles="mt-7"
          keyboardType="email-address"
        />

        <FormField
          title="Password"
          value={form.password}
          handleChangeText={(value) => handleChange('password', value)}
          otherStyles="mt-7"
        />

        <View className="mt-7">
          {isSubmitting ? (
          <ActivityIndicator size="large" color="#eeebe3" />
          ) : (
          <CustomButton
            title="Sign Up"
            handlePress={submit}
          />
          )}
        </View>

        <View className="flex justify-center pt-5 flex-row gap-2">
          <Text className="text-xl text-[#eeebe3] font-pregular">
            Have an account already?
          </Text>
          <Link
            href="/sign-in"
            className="text-xl font-psemibold text-secondary opacity-80"
          >
            Login
          </Link>
        </View>

      </View>
      </ScrollView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  )
}

export default SignUp;
