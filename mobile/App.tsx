import {StatusBar} from "react-native";

import {
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
  Inter_800ExtraBold,
  useFonts,
} from "@expo-google-fonts/inter";

import {Loading} from "./src/components/Loading";
import {Routes} from "./src/routes";

export default function App() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });

  if (!fontsLoaded) return <Loading />;

  return (
    <>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="#7C3AED"
        translucent
      />
      <Routes />
    </>
  );
}
