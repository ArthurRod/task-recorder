import {ActivityIndicator, View} from "react-native";

export function Loading() {
  return (
    <View
      style={{
        position: "absolute",
        width: "100%",
        height: "100%",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "rgba(150, 150, 150, 0.7)",
      }}
    >
      <ActivityIndicator color="black" size="large" />
    </View>
  );
}
