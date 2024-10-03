import { View, Text, ActivityIndicator, Keyboard, ScrollView } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaView } from 'react-native'
import FormField from '../../components/FormField'
import { Link, router } from 'expo-router'
import CustomButton from '../../components/CustomButton'
import Header from '../../components/Header'
import { signInWithEmailAndPassword } from "firebase/auth"; 
import { auth } from '../../firebase'; 
import { Alert } from 'react-native'
import { TouchableWithoutFeedback } from 'react-native'
import AsyncStorage from '@react-native-async-storage/async-storage'

const SignIn = () => {
  const [isSubmitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
  };

  const submit = async () => {
    const { email, password } = form;

    if (!email || !password) {
      Alert.alert("Error", "Please fill in all fields");
      return;
    }

    setSubmitting(true);
    try {
      await signInWithEmailAndPassword(auth, email, password); 
      await AsyncStorage.setItem('user', JSON.stringify({ email }));
      Alert.alert("Success", "Signed in successfully!");
      router.push('/home'); 
    } catch (error) {
      Alert.alert("Error", error.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView className="bg-prime flex-1">
      <Header onBackPress={() => router.push('/')} />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <ScrollView>

        <View className="justify-center h-[700px] px-4 py-4 ml-5 mr-3 " >
          
            <Text className="text-3xl text-secondary font-psemibold opacity-80">
              Log in to Voice
            </Text>

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
              <ActivityIndicator size="large" color="#fff" />
              ) : (
              <CustomButton
                title="Sign In"
                handlePress={submit}
              />
              )}
            </View>

            <View className="flex justify-center pt-5 flex-row gap-2">
              <Text className="text-xl text-[#eeebe3] font-pregular">
                Don't have an account?
              </Text>
              <Link
                href="/sign-up"
                className="text-xl font-psemibold text-secondary opacity-80"
              >
                Signup
              </Link>
            </View>

        </View>
      </ScrollView>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  )
}

export default SignIn