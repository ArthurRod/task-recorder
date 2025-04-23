import {MaterialIcons} from "@expo/vector-icons";
import {Audio, InterruptionModeAndroid, InterruptionModeIOS} from "expo-av";
import {useEffect, useRef, useState} from "react";
import {Alert, Animated, Pressable, Text, View} from "react-native";
import {Loading} from "../../components/Loading";
import {styles} from "./styles";

export default function Home() {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const pressStartTime = useRef<number>(0);
  const canceledEarly = useRef(false);
  const scaleAnim = useRef(new Animated.Value(1)).current;

  useEffect(() => {
    requestAudioPermissions();
  }, []);

  const requestAudioPermissions = async () => {
    const {granted} = await Audio.getPermissionsAsync();
    if (granted) {
      await setAudioMode();
    } else {
      Alert.alert("Permissão", "Permissão para acessar o microfone negada");
    }
  };

  const setAudioMode = async () => {
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      interruptionModeIOS: InterruptionModeIOS.DoNotMix,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: InterruptionModeAndroid.DoNotMix,
      playThroughEarpieceAndroid: true,
    });
  };

  useEffect(() => {
    if (isRecording) {
      startPulsing();
    } else {
      stopPulsing();
    }
  }, [isRecording]);

  const startPulsing = () => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(scaleAnim, {
          toValue: 1.3,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(scaleAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        }),
      ])
    ).start();
  };

  const stopPulsing = () => {
    scaleAnim.setValue(1);
    scaleAnim.stopAnimation();
  };

  const handleRecordingStart = async () => {
    if (isRecording) return;

    pressStartTime.current = Date.now();
    canceledEarly.current = false;
    setIsRecording(true);

    setTimeout(async () => {
      const pressDuration = Date.now() - pressStartTime.current;

      if (pressDuration >= 500 && !canceledEarly.current) {
        try {
          const {recording} = await Audio.Recording.createAsync();
          setRecording(recording);
        } catch (error) {
          console.log("Erro ao iniciar gravação", error);
          setIsRecording(false);
        }
      } else {
        setIsRecording(false);
      }
    }, 500);
  };

  const handleRecordingStop = async () => {
    const pressDuration = Date.now() - pressStartTime.current;

    if (pressDuration < 500) {
      canceledEarly.current = true;
      setIsRecording(false);
      return;
    }

    try {
      if (recording) {
        await recording.stopAndUnloadAsync();
        const fileUri = recording.getURI();
        setRecording(null);
        setIsRecording(false);

        if (fileUri) {
          await handleAddTask(fileUri);
        }
      }
    } catch (error) {
      console.log("Erro ao parar gravação", error);
    }
  };

  const handleAddTask = async (fileUri: string) => {
    setIsLoading(true);

    try {
      const formData = new FormData();

      formData.append("audio", {
        uri: fileUri,
        name: "nome.m4a",
        type: "audio/x-m4a",
      } as any);

      const response = await fetch(
        `${process.env.API_URL}:${process.env.API_PORT}/tasks`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Erro ao adicionar a tarefa.");
      }

      Alert.alert("Sucesso!", "A tarefa foi adicionada.");
    } catch (error) {
      let errorMessage = "Erro ao adicionar a tarefa.";

      if (error instanceof Error) {
        errorMessage = error.message;
      }

      Alert.alert("Erro!", errorMessage);
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <View
        style={[
          styles.container,
          {backgroundColor: recording ? "#d0f5d8" : "#f5f5f5"},
        ]}
      >
        <Pressable
          onPressIn={handleRecordingStart}
          onPressOut={handleRecordingStop}
        >
          <Animated.View
            style={[
              styles.button,
              {
                transform: [{scale: scaleAnim}],
                backgroundColor: recording ? "#90ee90" : "#d3d3d3",
              },
            ]}
          >
            <MaterialIcons name="mic" size={44} color="black" />
          </Animated.View>
        </Pressable>

        <Text style={styles.recording}>
          {recording ? "Gravando" : "Segure o botão para gravar a task"}
        </Text>
      </View>
      {isLoading && <Loading />}
    </>
  );
}
