package config

import (
	"database/sql"
	"log"

	_ "github.com/mattn/go-sqlite3"
)

var DB *sql.DB

func ConnectDB() {
	var err error
	DB, err = sql.Open("sqlite3", "tasks.db")
	if err != nil {
		log.Fatal("Erro ao conectar ao banco de dados:", err)
	}

	createTable := `CREATE TABLE IF NOT EXISTS tasks (
		id INTEGER PRIMARY KEY AUTOINCREMENT,
		title TEXT NOT NULL,
		completed BOOLEAN NOT NULL DEFAULT 0
	);`

	_, err = DB.Exec(createTable)
	if err != nil {
		log.Fatal("Erro ao criar tabela:", err)
	}

	log.Println("Banco de dados conectado e tabela verificada.")
}

func CloseDB() {
	if DB != nil {
		DB.Close()
		log.Println("Conexão com o banco de dados fechada.")
	}
}
