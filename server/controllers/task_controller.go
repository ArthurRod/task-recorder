package controllers

import (
	"encoding/json"
	"net/http"
	"strconv"

	"github.com/ArthurRod/task-recorder/server/services"
	"github.com/ArthurRod/task-recorder/server/utils"

	"github.com/gorilla/mux"
)

func GetTasks(w http.ResponseWriter, r *http.Request) {
	tasks, err := services.GetTasks()
	if err != nil {
		utils.HandleError(w, "Erro ao buscar tarefas", err, http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(tasks); err != nil {
		utils.HandleError(w, "Erro ao enviar resposta", err, http.StatusInternalServerError)
		return
	}
}


func CreateTask(w http.ResponseWriter, r *http.Request) {
	if err := r.ParseMultipartForm(10 << 20); err != nil {
		utils.HandleError(w, "Erro ao processar o formulário", err, http.StatusBadRequest)
		return
	}

	file, _, err := r.FormFile("audio")
	if err != nil {
		utils.HandleError(w, "Erro ao obter o arquivo de áudio", err, http.StatusBadRequest)
		return
	}
	defer file.Close()

	completed := r.FormValue("completed") == "true"

	task, err := services.CreateTask(file, completed)
	if err != nil {
		utils.HandleError(w, "Erro ao criar tarefa", err, http.StatusInternalServerError)
		return
	}

	w.Header().Set("Content-Type", "application/json")
	if err := json.NewEncoder(w).Encode(task); err != nil {
		utils.HandleError(w, "Erro ao enviar resposta", err, http.StatusInternalServerError)
		return
	}

	w.Write([]byte(`{"message": "Sucesso!"}`))
}

func UpdateTaskByID(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		utils.HandleError(w, "ID inválido", err, http.StatusBadRequest)
		return
	}

	var payload struct {
		Completed bool `json:"completed"`
	}

	if err := json.NewDecoder(r.Body).Decode(&payload); err != nil {
		utils.HandleError(w, "Erro ao decodificar JSON", err, http.StatusBadRequest)
		return
	}

	if err := services.UpdateTaskByID(id, payload.Completed); err != nil {
		utils.HandleError(w, "Erro ao atualizar tarefa", err, http.StatusInternalServerError)
		return
	}

	w.Write([]byte(`{"message": "Sucesso!"}`))
}

func DeleteTaskByID(w http.ResponseWriter, r *http.Request) {
	vars := mux.Vars(r)
	id, err := strconv.Atoi(vars["id"])
	if err != nil {
		utils.HandleError(w, "ID inválido", err, http.StatusBadRequest)
		return
	}

	if err := services.DeleteTaskByID(id); err != nil {
		utils.HandleError(w, "Erro ao deletar tarefa", err, http.StatusInternalServerError)
		return
	}

	w.Write([]byte(`{"message": "Sucesso!"}`))
}