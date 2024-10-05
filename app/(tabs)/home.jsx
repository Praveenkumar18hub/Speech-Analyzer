import { View, Text, SafeAreaView, Image, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import React, { useEffect, useState } from 'react';
import * as FileSystem from 'expo-file-system'; 
import { Audio } from 'expo-av'; 
import { auth, firestore } from '../../firebase';
import { decode } from 'he'; 
import { transcribeAudio, translateText } from '../../api'; 
import { fetchTopWordsFromFirestore, fetchTopPhrasesFromFirestore, saveTranscriptionToFirestore } from '../../api/firestoreService';  
import FontAwesome from '@expo/vector-icons/FontAwesome';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { router } from 'expo-router';

const Home = () => {
  const [username, setUsername] = useState('');
  const [isMicActive, setIsMicActive] = useState(false);
  const [transcription, setTranscription] = useState('');
  const [topWords, setTopWords] = useState([]); 
  const [recording, setRecording] = useState(null); 
  const [loading, setLoading] = useState(false); 
  const [topPhrases, setTopPhrases] = useState([]); 
  const [wordsLoading, setWordsLoading] = useState(true); 
  const [phrasesLoading, setPhrasesLoading] = useState(true);
  const [transcribing, setTranscribing] = useState(false); // New state for transcribing

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      setUsername(user.displayName || 'User');
      loadTopWordsAndPhrases(user.uid);
    }
  }, []);

  const loadTopWordsAndPhrases = async (userUid) => {
    try {
      setTopWords(await fetchTopWordsFromFirestore(userUid));
      setTopPhrases(await fetchTopPhrasesFromFirestore(userUid));
    } catch (error) {
      Alert.alert('Error', 'Could not load top words and phrases.');
    } finally {
      setWordsLoading(false);
      setPhrasesLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await auth.signOut(); 
      router.push('/'); // Adjust this to your login screen route
    } catch (error) {
      console.error("Error during logout:", error); 
    }
  };

  const handleMicPress = async () => {
    if (transcribing) {
      Alert.alert('Transcription in Progress', 'Please wait for the current transcription to finish.');
      return;
    }

    if (!isMicActive) {
      const { status } = await Audio.requestPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Required', 'Permission to access microphone is required!');
        return;
      }   
      setIsMicActive(true);
      setTranscription(''); 
      try {
        const recordingOptions = {
          android: {
            extension: '.amr',
            outputFormat: 4,
            audioEncoder: 2,
          },
          ios: {
            extension: '.amr',
            outputFormat: "sawb",
            audioQuality : 96,
          },
        };
        const { recording: newRecording } = await Audio.Recording.createAsync(recordingOptions);
        setRecording(newRecording);
      } catch (error) {
        console.error('Error starting recording:', error);
        Alert.alert('Error', 'Could not start recording.');
      }
    } else {
      setIsMicActive(false);
      if (recording) {
        await recording.stopAndUnloadAsync();
        const uri = recording.getURI();
        setRecording(null);
        checkFileExists(uri);
      }
    }
  };

  const checkFileExists = async (uri) => {
    const decodedUri = decode(uri); 
    const fileInfo = await FileSystem.getInfoAsync(decodedUri);
    if (!fileInfo.exists) {
      console.error('Audio file does not exist:', decodedUri);
      Alert.alert('Error', 'Audio file does not exist.');
      return;
    }
    transcribeAudioAndTranslate(decodedUri);
  };

  const transcribeAudioAndTranslate = async (audioUri) => {
    setLoading(true);
    setTranscribing(true); // Set transcribing to true to block further actions

    try {
      const transcriptionResult = await transcribeAudio(audioUri);
      if (!transcriptionResult || transcriptionResult.trim() === 'No transcription available.') {
        setTranscription('No audio detected for transcription.');
        return; 
      }
  
      setTranscription(transcriptionResult);
      const translatedText = await translateText(transcriptionResult);
      if (translatedText) {
        setTranscription(translatedText);
      } else {
        setTranscription(transcriptionResult);
      }

      await saveTranscriptionToFirestore(translatedText, auth.currentUser.uid);
      loadTopWordsAndPhrases(auth.currentUser.uid);
    } catch (error) {
      console.error('Error during transcription or translation:', error);
      Alert.alert('Error', 'Could not transcribe or translate audio.');
    } finally {
      setLoading(false);
      setTranscribing(false); // Reset transcribing flag when done
    }
  };
  

  return (
    <SafeAreaView className="bg-prime flex-1">
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="mt-12 ml-5 mr-5 flex-1">
          <View className="flex-row justify-between items-center px-4">
            <View className="flex-row items-center">
              <Text className="font-pmedium text-2xl text-white">Hello,</Text>
              <Text className="text-2xl font-psemibold text-secondary opacity-90 ml-2">{username}</Text>
            </View>

            <TouchableOpacity onPress={handleLogout} className="w-[42px] h-[42px] rounded-xl pl-1 justify-center items-center bg-tertiary opacity-80" activeOpacity={0.4}> 
              <MaterialIcons name="logout" size={20} color="red" style={{ }} /> 
            </TouchableOpacity>
          </View>

          <View className="flex-col gap-y-5 mt-2 justify-center items-center">
            <TouchableOpacity onPress={handleMicPress} disabled={transcribing} activeOpacity={transcribing ? 1 : 0.4} className="w-[130px] h-[130px] justify-center items-center rounded-full p-3" style={{backgroundColor: isMicActive ? "#f7a07222" : "#14FFEC22"}}>
                <FontAwesome name="microphone" size={60} style={{ color: isMicActive ? '#f7a072' : '#14FFEC' }}/>
            </TouchableOpacity>

            <Text className="text-2xl text-center font-pregular mb-5" style={{ color: isMicActive ? '#f7a072' : '#14ffec99' }}>
              {isMicActive ? "Click the Mic to Stop" : "Click the Mic to Start"}
            </Text>
          </View>

          <View>
            {loading ? (
              <ActivityIndicator size="large" color="#14FFEC" style={{ marginVertical: 20 , opacity: 60}} />
            ) : (
              <ScrollView
                style={{ maxHeight: 500, backgroundColor: '#323232', padding: 20, borderRadius: 10, minHeight:100 }}
                contentContainerStyle={{ paddingBottom: 10 }}
              >
                <Text className="text-[#eeebe3] text-lg font-pmedium">
                  {transcription || 'Transcription will appear here...'}
                </Text>
              </ScrollView>
            )}
          </View>

          <View className="mt-6">
            <Text className="text-2xl font-psemibold text-secondary opacity-60">Most Used Words</Text>
            <View className="border border-tertiary rounded-xl border-t-0 mt-3 ml-3 mr-3">
              {wordsLoading ? (
                <ActivityIndicator size="small" color="#14FFEC" style={{ marginVertical: 20}} />
              ) : topWords.length > 0 ? (
                <>
                  <View className="flex-row justify-between px-4 rounded-t-xl py-2 bg-tertiary">
                    <Text className="text-lg font-psemibold text-white">Word</Text>
                    <Text className="text-lg font-psemibold text-white">Count</Text>
                  </View>
                  {topWords.map((item, index) => (
                    <View key={index} className="flex-row justify-between px-4 py-2">
                      <Text className="text-lg font-pregular text-[#eeebe3]">{item.word}</Text>
                      <Text className="text-lg font-pregular text-[#eeebe3]">{item.count}</Text>
                    </View>
                  ))}
                </>
              ) : (
                <Text className="text-lg font-pregular text-[#eeebe3] px-4 py-4">No data available</Text>
              )}
            </View>
          </View>

          <View className="mt-6">
            <Text className="text-2xl font-psemibold text-secondary opacity-60">Top Unique Phrases</Text>
            <View className="border border-tertiary rounded-xl border-t-0 mt-3 ml-3 mr-3">
              {phrasesLoading ? (
                <ActivityIndicator size="small" color="#14FFEC" style={{ marginVertical: 20 }} />
              ) : topPhrases.length > 0 ? (
                <>
                  <View className="flex-row justify-between px-4 py-2 rounded-t-xl bg-tertiary">
                    <Text className="text-lg font-psemibold text-white">Phrases</Text>
                  </View>
                  {topPhrases.map((item, index) => (
                    <View key={index} className="flex-row justify-between px-4 py-2">
                      <Text className="text-lg font-pregular text-[#eeebe3]">{item.phrase}</Text>
                    </View>
                  ))}
                </>
              ) : (
                <Text className="text-lg font-pregular text-[#eeebe3] px-4 py-4">No data available</Text>
              )}
            </View>
          </View>    

        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Home;
