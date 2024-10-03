import { View, Text, SafeAreaView } from 'react-native';
import React, { useEffect, useState } from 'react';
import { auth, firestore } from '../../firebase';
import { collection, getDocs, onSnapshot } from 'firebase/firestore';
import { FlashList } from '@shopify/flash-list';
import Header from '../../components/Header';
import { router } from 'expo-router';
import { ActivityIndicator } from 'react-native-paper';

const History = () => {
  const [username, setUsername] = useState('');
  const [transcriptionHistory, setTranscriptionHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setUsername(user.displayName || 'User');
      fetchTranscriptionHistory(user.uid); 
    }
  }, []);

  const fetchTranscriptionHistory = async (userUid) => {
    try {
      const querySnapshot = await getDocs(collection(firestore, "users", userUid, "transcriptions"));
      const history = querySnapshot.docs.map(doc => ({
        timestamp: doc.id, // Using document ID as timestamp
        ...doc.data(),
      }));
      setTranscriptionHistory(history);
      setLoading(false);

      // Real-time listener for new transcriptions
      onSnapshot(collection(firestore, "users", userUid, "transcriptions"), (snapshot) => {
        const updatedHistory = snapshot.docs.map(doc => ({
          timestamp: doc.id, // Using document ID as timestamp
          ...doc.data(),
        }));
        setTranscriptionHistory(updatedHistory.reverse());
      });
    } catch (error) {
      console.error('Error fetching transcription history:', error);
      setLoading(false);
    }
  };

  const renderItem = ({ item }) => (
    <View className="bg-tertiary p-3 ml-6 mr-3 mb-2 rounded-lg">
      <Text className="text-[#eeebe3] text-lg font-pregular">{item.transcription}</Text>
    </View>
  );

  if (loading) {
    return (
      <View className="flex-1 bg-prime justify-center items-center">
        <ActivityIndicator size="large" color="#14FFEC" />
      </View>
    );
  }

  return (
    <SafeAreaView className="bg-prime flex-1">
      <Header onBackPress={() => router.push('/home')} />
      <View className="mt-4 ml-4 mr-5 flex-1">
        <Text className="text-2xl font-psemibold ml-3 text-secondary opacity-60 mb-5">Transcription History: </Text>

        {/* Show "No data available" if transcriptionHistory is empty */}
        {transcriptionHistory.length === 0 ? (
          <View className="justify-center items-center p-3 ml-5 mr-3 bg-tertiary rounded-xl">
            <Text className="text-xl font-plight text-[#eeebe3]">Transcription data is empty, Please transcript to view history. </Text>
          </View>
        ) : (
          <FlashList
            data={transcriptionHistory}
            renderItem={renderItem}
            keyExtractor={(item) => item.timestamp} // Use timestamp as key
            estimatedItemSize={100}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 20 }}
          />
        )}
      </View>
    </SafeAreaView>
  );
};

export default History;
