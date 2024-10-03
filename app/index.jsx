import { View, Text, Image, ActivityIndicator } from 'react-native';
import React, { useCallback, useEffect, useState } from 'react';
import { SafeAreaView } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import images from '../constants/images';
import { router } from 'expo-router';
import CustomButton from '../components/CustomButton';
import { onAuthStateChanged } from 'firebase/auth'; 
import { auth } from '../firebase'; 

export default function App() {
    const [loading, setLoading] = useState(true);
    const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);

    const handleAuthStateChange = useCallback((user) => {
        setLoading(false);
        if (user) {
            setIsUserLoggedIn(true);
            router.push('/home')
        } else {
            setIsUserLoggedIn(false);
        }
    }, []);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, handleAuthStateChange);
        return () => unsubscribe();
    }, [handleAuthStateChange]);

    if (loading) {
        return (
            <SafeAreaView className="bg-prime flex-1 items-center justify-center">
                <ActivityIndicator size="large" color="#fff" />
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView className="bg-prime flex-1">
          <View className="mt-12 ml-3 mr-3">

            <View className="justify-start items-center flex-row ml-3">
                <Image
                  source={images.logo}
                  className="w-[50px] h-[50px] rounded-full"
                  resizeMode="contain"
                />
                <Text className="text-secondary opacity-80 font-psemibold text-2xl">Speech Analyzer</Text>
            </View>

            <View className="ml-2 mr-2 justify-center relative" style={{ height: 400 }}>
              <Image
                source={images.sec}
                className="w-[180px] h-[200px] rounded-3xl left-[-10px] top-[-30px]"
                resizeMode="contain"
                style={{ transform: [{ rotate: '8deg' }] }}
              />
              <Image
                source={images.hero}
                className="w-[180px] h-[180px] rounded-3xl absolute right-[-10px] top-[180px]"
                resizeMode="contain"
                style={{ transform: [{ rotate: '15deg' }] }}
              />
              <Image
                source={images.hello}
                className="w-[90px] h-[80px] rounded-3xl absolute right-[50px] top-[115px]"
                resizeMode="contain"
                style={{ transform: [{ rotate: '8deg' }], tintColor:'#14ffec' }}
              />
              <Image
                source={images.hola}
                className="w-[100px] h-[100px] rounded-3xl absolute right-[170px] top-[25px]"
                resizeMode="contain"
                style={{ transform: [{ rotate: '-2deg' }] }}
              />
              <Image
                source={images.translate}
                className="w-[40px] h-[60px] rounded-3xl absolute left-[30px] top-[300px]"
                resizeMode="contain"
                style={{ transform: [{ rotate: '8deg' }], tintColor:'#eeebe3' }}
              />
              <Image
                source={images.world}
                className="w-[30px] h-[40px] rounded-3xl absolute right-[30px] top-[40px]"
                resizeMode="contain"
                style={{ transform: [{ rotate: '-20deg' }], tintColor:'#eeebe3' }}
              />
              <Image
                source={images.connect}
                className="w-[155px] h-[62px] rounded-3xl absolute left-[96px] top-[220px]"
                resizeMode="cover"
                style={{ transform: [{ rotate: '35deg' }], tintColor:'#eeebe3' }}
              />
            </View>

            <View className="mt-7 rounded-border-inherit">
              <Text className="text-white opacity-100 font-psemibold text-5xl py-2 text-center">
                Communicate
              </Text>
              <Text className="text-white opacity-75 font-pregular text-4xl text-center">
                Without Limits
              </Text>
              <Text className="text-lg font-pregular text-[#eeebe3] mt-5 text-center">
                Speak freely in any language! Our Speech Analyzer transcribes and translates your words in real-time, making communication effortless.
              </Text>
            </View>

            <View className="flex-row justify-evenly ml-5 mr-3 mt-3">
              <CustomButton
                title="Sign In"
                handlePress={() => router.push("/sign-in")}
                containerStyles="mt-7 w-[150px]"
              />
              <CustomButton
                title="Sign Up"
                handlePress={() => router.push("/sign-up")}
                containerStyles="mt-7 w-[150px]"
              />
            </View>
                
          </View>
          <StatusBar backgroundColor="#212121" style="light"/>
        </SafeAreaView>
    );
}
