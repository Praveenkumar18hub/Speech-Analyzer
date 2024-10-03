import { collection, doc, setDoc, getDoc, getDocs } from "firebase/firestore";
import { firestore } from '../firebase';

export const fetchTopWordsFromFirestore = async (userUid) => {
  try {
    const wordCountsRef = collection(firestore, "users", userUid, "wordCounts");
    const querySnapshot = await getDocs(wordCountsRef);
    const wordArray = querySnapshot.docs.map(doc => ({
      word: doc.id, // Document ID as the word
      count: doc.data().count || 0 // Get the count from the document data
    }));

    wordArray.sort((a, b) => b.count - a.count); // Sort the array by count
    return wordArray.slice(0, 3); // Return top three words
  } catch (error) {
    console.error('Error fetching top words from Firestore:', error);
    throw new Error('Could not fetch top words from Firestore.');
  }
};

export const fetchTopPhrasesFromFirestore = async (userUid) => {
  try {
    const phrasesRef = collection(firestore, "users", userUid, "phrases");
    const querySnapshot = await getDocs(phrasesRef);
    const phrasesArray = querySnapshot.docs.map(doc => ({
      phrase: doc.id, // Document ID as the phrase
      count: doc.data().count || 0 // Get the count from the document data
    }));

    phrasesArray.sort((a, b) => b.count - a.count); // Sort the array by count
    return phrasesArray.slice(0, 3); // Return top three phrases
  } catch (error) {
    console.error('Error fetching top phrases from Firestore:', error);
    throw new Error('Could not fetch top phrases from Firestore.');
  }
};

export const saveTranscriptionToFirestore = async (transcription, userUid) => {
  const words = transcription.split(' ');
  const wordCount = {};
  
  words.forEach((word) => {
    wordCount[word] = (wordCount[word] || 0) + 1;
  });

  try {
    const transcriptionId = new Date().toISOString();
    const docRef = doc(collection(firestore, "users", userUid, "transcriptions"), transcriptionId);
    await setDoc(docRef, {
      transcription: transcription,
      wordCount: wordCount,
      timestamp: transcriptionId,
    });

    for (const [word, count] of Object.entries(wordCount)) {
      const wordDocRef = doc(collection(firestore, "users", userUid, "wordCounts"), word);
      const wordDocSnapshot = await getDoc(wordDocRef);
      const existingCount = wordDocSnapshot.exists() ? wordDocSnapshot.data().count || 0 : 0;

      await setDoc(wordDocRef, { count: existingCount + count });
      await updateGlobalWordCount(word, count);
    }

    const phrases = {};
    const phraseLength = 2; // Length of phrases (e.g., 2 for bi-grams)

    for (let i = 0; i <= words.length - phraseLength; i++) {
      const phrase = words.slice(i, i + phraseLength).join(' ');
      phrases[phrase] = (phrases[phrase] || 0) + 1;
    }

    for (const [phrase, count] of Object.entries(phrases)) {
      const phraseDocRef = doc(collection(firestore, "users", userUid, "phrases"), phrase);
      const phraseDocSnapshot = await getDoc(phraseDocRef);
      const existingCount = phraseDocSnapshot.exists() ? phraseDocSnapshot.data().count || 0 : 0;

      await setDoc(phraseDocRef, { count: existingCount + count });
    }
  } catch (error) {
    console.error('Error saving transcription to Firestore:', error);
    throw new Error('Could not save transcription to Firestore.');
  }
};

export const updateGlobalWordCount = async (word, count) => {
  try {
    const wordDocRef = doc(firestore, "wordCounts", word);
    const wordDocSnapshot = await getDoc(wordDocRef);
    const existingCount = wordDocSnapshot.exists() ? wordDocSnapshot.data().totalCount || 0 : 0;

    await setDoc(wordDocRef, { totalCount: existingCount + count }, { merge: true });
  } catch (error) {
    console.error('Error updating global word count:', error);
    throw new Error('Could not update global word count.');
  }
};
