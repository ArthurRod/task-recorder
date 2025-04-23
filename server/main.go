package main

import (
	"log"
	"net/http"
	"os"
	"os/signal"
	"syscall"

	"task-recorder-server/config"
	"task-recorder-server/routes"
)


func main() {
	config.ConnectDB()

	c := make(chan os.Signal, 1)
	signal.Notify(c, os.Interrupt, syscall.SIGTERM)
	
	go func() {
		<-c
		log.Println("Encerrando servidor...")
		config.CloseDB()
		os.Exit(0)
	}()

	r := routes.SetupRoutes()

	log.Println("Servidor rodando na porta 8085...")
	log.Fatal(http.ListenAndServe(":8085", r))
}