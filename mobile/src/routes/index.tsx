import {View} from "react-native";
import {NavigationContainer} from "@react-navigation/native";

import {AppRoutes} from "./app.routes";
import {styles} from "./styles";

export function Routes() {
  return (
    <View style={styles.container}>
      <NavigationContainer>
        <AppRoutes />
      </NavigationContainer>
    </View>
  );
}
