import {MaterialIcons} from "@expo/vector-icons";
import {useEffect, useState} from "react";
import {Alert, Button, Pressable, Text, View} from "react-native";
import {styles} from "./styles";
import {Audio, InterruptionModeAndroid, InterruptionModeIOS} from "expo-av";

export default function Home() {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [recordingFileURI, setRecordingFileURI] = useState<string | null>(null);

  async function handleRecordingStart() {
    const {granted} = await Audio.getPermissionsAsync();

    if (granted) {
      try {
        const {recording} = await Audio.Recording.createAsync();
        setRecording(recording);
      } catch (error) {
        console.log(error);
        Alert.alert("Erro ao gravar", "Não foi possível iniciar o áudio.");
      }
    }
  }

  async function handleRecordingStop() {
    try {
      if (recording) {
        await recording.stopAndUnloadAsync();
        const fileUri = recording.getURI();
        setRecordingFileURI(fileUri);
        setRecording(null);
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Erro ao pausar", "Não foi possível pausar o áudio.");
    }
  }

  async function handleAudioPlay() {
    try {
      if (recordingFileURI) {
        const {sound} = await Audio.Sound.createAsync(
          {uri: recordingFileURI},
          {shouldPlay: true}
        );

        sound.setPositionAsync(0);
        sound.playAsync();
      }
    } catch (error) {
      console.log(error);
      Alert.alert("Erro ao executar", "Não foi possível executar o áudio.");
    }
  }

  useEffect(() => {
    Audio.requestPermissionsAsync().then(({granted}) => {
      if (granted) {
        Audio.setAudioModeAsync({
          allowsRecordingIOS: true,
          interruptionModeIOS: InterruptionModeIOS.DoNotMix,
          playsInSilentModeIOS: true,
          shouldDuckAndroid: true,
          interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
          playThroughEarpieceAndroid: true,
        });
      }
    });
  }, []);

  return (
    <View style={styles.container}>
      <Pressable
        style={styles.button}
        onPressIn={handleRecordingStart}
        onPressOut={handleRecordingStop}
      >
        <MaterialIcons name="mic" size={44} color="#212121" />
      </Pressable>

      {recording ? (
        <Text style={styles.recording}>Gravando</Text>
      ) : (
        <Text style={styles.recording}>Iniciar gravação</Text>
      )}

      {recordingFileURI && (
        <Button title="Ouvir áudio" onPress={handleAudioPlay} />
      )}
    </View>
  );
}
