package routes

import (
	"net/http"

	"github.com/ArthurRod/task-recorder/server/controllers"

	"github.com/gorilla/mux"
)

func SetupRoutes() *mux.Router {
	r := mux.NewRouter()

	r.HandleFunc("/tasks", controllers.GetTasks).Methods(http.MethodGet)
	r.HandleFunc("/tasks", controllers.CreateTask).Methods(http.MethodPost)
	r.HandleFunc("/tasks/{id}", controllers.UpdateTaskByID).Methods(http.MethodPut)
	r.HandleFunc("/tasks/{id}", controllers.DeleteTaskByID).Methods(http.MethodDelete)

	return r
}
