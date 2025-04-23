import {StyleSheet} from "react-native";

export const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  taskItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  deleteText: {
    marginLeft: 10,
    fontSize: 18,
    color: "red",
  },
});
