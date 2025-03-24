import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import Home from "../screens/Home";
import Tasks from "../screens/Tasks";

const Tab = createBottomTabNavigator();

export function AppRoutes() {
  return (
    <Tab.Navigator>
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Tasks" component={Tasks} />
    </Tab.Navigator>
  );
}
