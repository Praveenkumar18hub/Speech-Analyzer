# Speech Analyzer Mobile App

## Overview
The Speech Analyzer Mobile App is a cross-platform mobile application for converting voice recordings into text using Google Cloud's Speech-to-Text API. It also offers translation functionality via Google Cloud's Translate API. The app stores transcriptions in Firestore and allows users to analyze their speaking patterns with visual charts using progress bars generated from Firestore data.

## Features
- Supports languages like English, French, and Spanish.
- Translates transcriptions into the most common language, English.
- Integrated with Firebase for secure user authentication.
- Allows users to save and access their past transcriptions with Firestore.
- Word frequency analysis and visualization
- Mobile-friendly interface with responsive design

## Tech Stack Used
- **Frontend**: React Native, Expo, Nativewind
- **Backend**: Firebase (Firestore, Authentication)
- **APIs**: Google (Cloud Speech-to-Text API, Cloud Translation API)

## Installation and Setup

Steps to run this app in your local development environment:

### Prerequisites
1. Install Node.js and npm.
2. Install Expo CLI:

   ```bash
   npm install -g expo-cli
   ```
3. Set up a Google Cloud Project and enable the Speech-to-Text API and Translation API.
4. Set up a Firebase project and enable Firestore and Authentication.
5. Install Firebase CLI:

   ```bash
   npm install -g firebase-tools
   ```

### Clone the Repository
```bash
git clone [GitHub Repository URL]
cd speech-analyzer-app
```

### Install Dependencies
```bash
npm install
```

### Run the App
```bash
npm start  (or)
npx expo start  

```
Scan the QR code displayed in your terminal with the Expo Go app or Enter the URL that is provided in the terminal in Expo Go App

## API Setup
1. Create a project in Google Cloud Platform.
2. Enable the required APIs (Speech-to-Text and Translation APIs).
3. Navigate to **Credentials** and generate an API key.
4. Add the generated Google Cloud API key to the `.env` file in your project.

## Later Updates
- **Similarity Detector**: Compare user transcriptions and provide suggestions for similar speech patterns among users.
- **Real-Time Transcription**: Implement real-time transcription capabilities that allow users to see their speech transcribed live while streaming audio.

## Contact
For any Queries/ Feedback, Kindly Contact me at - **praveen181201@gmail.com**
