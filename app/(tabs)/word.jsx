import React, { useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, SafeAreaView } from 'react-native';
import { ProgressBar } from 'react-native-paper';
import { collection, getDocs } from 'firebase/firestore';
import { firestore, auth } from '../../firebase';
import Header from '../../components/Header';
import { router } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';

const Word = () => {
  const [userWordsData, setUserWordsData] = useState(null);
  const [globalWordsData, setGlobalWordsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useFocusEffect(
    React.useCallback(() => {
      const fetchWordData = async () => {
        setLoading(true);
        try {
          const userUid = auth.currentUser.uid;
          const userWordCounts = await fetchUserWordCounts(userUid);
          const globalWordCounts = await fetchGlobalWordCounts();
          setUserWordsData(userWordCounts);
          setGlobalWordsData(globalWordCounts);
        } catch (error) {
          console.error("Error fetching word data:", error);
        } finally {
          setLoading(false);
        }
      };

      fetchWordData();
    }, [])
  );

  // Fetch word counts for the current user
  const fetchUserWordCounts = async (userUid) => {
    const wordCountsRef = collection(firestore, "users", userUid, "wordCounts");
    const querySnapshot = await getDocs(wordCountsRef);
    const wordCounts = {};
    querySnapshot.docs.forEach((doc) => {
      wordCounts[doc.id] = doc.data().count;
    });
    return wordCounts;
  };

  // Fetch global word counts from the '/wordCounts' collection
  const fetchGlobalWordCounts = async () => {
    const wordCountsRef = collection(firestore, "wordCounts");
    const querySnapshot = await getDocs(wordCountsRef);
    const wordCounts = {};
    querySnapshot.docs.forEach((doc) => {
      wordCounts[doc.id] = doc.data().totalCount || 0;
    });
    // console.log('Global word counts:', wordCounts);
    return wordCounts;
  };

  if (loading) {
    return (
      <View className="flex-1 bg-prime justify-center items-center">
        <ActivityIndicator size="large" color="#14FFEC" />
      </View>
    );
  }

  if (!userWordsData || !globalWordsData || Object.keys(userWordsData).length === 0) {
    return (
      <SafeAreaView className="flex-1 bg-prime">
        <Header onBackPress={() => router.push('/home')} />
        <View className="mt-4 ml-4 mr-5 flex-1">
          <Text className="text-2xl font-psemibold ml-3 text-secondary opacity-60 mb-5">Word Usage Analysis: </Text>
          <View className="justify-center items-center p-3 ml-5 mr-3 bg-tertiary rounded-xl">
            <Text className="text-xl font-plight  text-[#eeebe3]">No data available. Please transcript text to view analysis. </Text>
          </View>
        </View>
      </SafeAreaView>
    );
  }

  const mergedData = Object.keys(userWordsData).map((word) => {
    const userCount = userWordsData[word] || 0;
    const globalCount = (globalWordsData[word] || 0) - userCount;
    return {
      word,
      userCount,
      globalCount: globalCount < 0 ? 0 : globalCount,  
    };
  });

  const sortedData = mergedData.sort((a, b) => b.userCount - a.userCount).slice(0, 5);

  return (
    <SafeAreaView className="flex-1 bg-prime">
      <Header onBackPress={() => router.push('/home')} />
      <ScrollView>
        <View className="mt-4 ml-5 mr-5 flex-1">
          <Text className="text-2xl ml-3 text-secondary opacity-60 font-psemibold mb-4">Word Usage Analysis</Text>

          {sortedData.map(({ word, userCount, globalCount }) => (
            <View key={word} className="mb-6 ml-6 mr-3">
              <Text className="text-xl text-[#eeebe3] text-end font-pmedium ">{word}</Text>

              <Text className="text-base text-[#eeebe3] font-plight">Current User: {userCount}</Text>
              <ProgressBar
                progress={userCount / (globalCount + userCount)}
                color="#6FCF97"
                style={{ height: 10, borderRadius: 10, marginBottom: 5, backgroundColor:'#6FCF9766'}}
              />

              <Text className="text-base text-[#eeebe3] font-plight">Other Users: {globalCount}</Text>
              <ProgressBar
                progress={globalCount / (globalCount + userCount)}
                color="#56CCF2"
                style={{ height: 10, borderRadius: 10, backgroundColor:'#56CCF266' }}
              />
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Word;
