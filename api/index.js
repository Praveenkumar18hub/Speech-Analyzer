import axios from 'axios';
import * as FileSystem from 'expo-file-system'; 
import { GOOGLE_CLOUD_API_KEY } from '@env';

// Function to transcribe audio using Google Cloud Speech-to-Text API
export const transcribeAudio = async (audioUri, language = 'ta-IN') => {
  try {
    const audioFile = await FileSystem.readAsStringAsync(audioUri, {
      encoding: FileSystem.EncodingType.Base64,
    });

    const response = await axios.post(
      `https://speech.googleapis.com/v1/speech:recognize?key=${GOOGLE_CLOUD_API_KEY}`,
      {
        config: {
          encoding: 'AMR_WB', 
          sampleRateHertz: 16000, 
          languageCode: language, 
          alternativeLanguageCodes: ['hi-IN', 'ta-IN', 'te-IN'], // Add more languages if needed
        },
        audio: {
          content: audioFile,
        },
      }
    );

    console.log('API Response:', response.status);

    if (response.data.error) {
      console.error('API Error:', response.data.error);
      throw new Error(`API Error: ${response.data.error.message}`);
    }

    if (response.data.results && response.data.results.length > 0) {
      const transcriptionResult = response.data.results
        .map(result => result.alternatives[0]?.transcript)
        .filter(transcript => transcript)
        .join('\n');
    
        console.log('Transcription Text:', transcriptionResult)
      return transcriptionResult;
      
    } else {
      console.log('No transcription available.');
      return 'No transcription available.';
    }
  } catch (error) {
    console.error('Error transcribing audio:', error);
    throw new Error('Failed to transcribe audio.');
  }
};

// Function to translate text using Google Translate API
export const translateText = async (text, targetLanguage = 'en') => {
  try {
    const response = await axios.post(
      `https://translation.googleapis.com/language/translate/v2?key=${GOOGLE_CLOUD_API_KEY}`,
      {
        q: text,
        target: targetLanguage,
      }
    );

    if (response.data && response.data.data.translations) {
      return response.data.data.translations[0].translatedText;
    }

    return text; // Return the original text if no translation is available
  } catch (error) {
    console.error('Error translating text:', error);
    throw new Error('Failed to translate text.');
  }
};
