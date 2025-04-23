import {useEffect, useState} from "react";
import {
  Alert,
  FlatList,
  RefreshControl,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import {Task} from "../../@types/Task";
import {styles} from "./styles";
import {MaterialIcons} from "@expo/vector-icons";

export default function Tasks() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await fetch(
        `${process.env.API_URL}:${process.env.API_PORT}/tasks`
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Erro ao buscar as tarefas.");
      }

      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.log(error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchTasks();
    setRefreshing(false);
  };

  const updateTask = async (id: number, completed: boolean) => {
    try {
      const response = await fetch(
        `${process.env.API_URL}:${process.env.API_PORT}/tasks/${id}`,
        {
          method: "PUT",
          headers: {"Content-Type": "application/json"},
          body: JSON.stringify({completed}),
        }
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Erro ao atualizar a tarefa.");
      }

      setTasks((prev) =>
        prev.map((task) => (task.id === id ? {...task, completed} : task))
      );
    } catch (error) {
      console.log(error);
    }
  };

  const deleteTask = async (id: number) => {
    try {
      const response = await fetch(
        `${process.env.API_URL}:${process.env.API_PORT}/tasks/${id}`,
        {method: "DELETE"}
      );

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(errorText || "Erro ao deletar a tarefa.");
      }

      setTasks((prev) => prev.filter((task) => task.id !== id));
    } catch (error) {
      console.log(error);
    }
  };

  const renderItem = ({item}: {item: Task}) => (
    <View style={styles.taskItem}>
      <Text style={{flex: 1}}>{item.title}</Text>
      <Switch
        value={item.completed}
        onValueChange={(value) => updateTask(item.id, value)}
      />
      <TouchableOpacity
        onPress={() =>
          Alert.alert("Excluir Tarefa", "Tem certeza?", [
            {text: "Cancelar"},
            {
              text: "Excluir",
              onPress: () => deleteTask(item.id),
              style: "destructive",
            },
          ])
        }
      >
        <MaterialIcons name="delete" size={44} color="gray" />
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={tasks}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
}
