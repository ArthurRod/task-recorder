import {MaterialIcons} from "@expo/vector-icons";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import Home from "../screens/Home";
import Tasks from "../screens/Tasks";

const Tab = createBottomTabNavigator();

const routes = [
  {name: "Home", component: Home, icon: "home"},
  {name: "Tasks", component: Tasks, icon: "list"},
];

export function AppRoutes() {
  return (
    <Tab.Navigator
      screenOptions={({route}) => ({
        tabBarIcon: ({color, size}) => {
          const currentRoute = routes.find((r) => r.name === route.name);
          const iconName = currentRoute?.icon ?? "help";

          return (
            <MaterialIcons name={iconName as any} size={size} color={color} />
          );
        },
        tabBarActiveTintColor: "green",
        tabBarInactiveTintColor: "black",
      })}
    >
      {routes.map((route) => (
        <Tab.Screen
          key={route.name}
          name={route.name}
          component={route.component}
        />
      ))}
    </Tab.Navigator>
  );
}
