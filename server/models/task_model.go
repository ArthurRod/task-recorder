package models

import (
	"github.com/ArthurRod/task-recorder/server/config"
)

type Task struct {
	ID        int    `json:"id"`
	Title     string `json:"title"`
	Completed bool   `json:"completed"`
}

func GetTasks() ([]Task, error) {
	rows, err := config.DB.Query("SELECT id, title, completed FROM tasks")
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var tasks []Task

	for rows.Next() {
		var task Task
		if err := rows.Scan(&task.ID, &task.Title, &task.Completed); err != nil {
			return nil, err
		}
		tasks = append(tasks, task)
	}

	return tasks, nil
}


func CreateTask(title string, completed bool) (int64, error) {
	stmt, err := config.DB.Prepare("INSERT INTO tasks (title, completed) VALUES (?, ?)")
	if err != nil {
		return 0, err
	}
	result, err := stmt.Exec(title, completed) 
	if err != nil {
		return 0, err
	}
	return result.LastInsertId()
}

func UpdateTaskByID(id int, completed bool) error {
	stmt, err := config.DB.Prepare("UPDATE tasks SET completed = ? WHERE id = ?")
	if err != nil {
		return err
	}
	_, err = stmt.Exec(completed, id)
	return err
}

func DeleteTaskByID(id int) error {
	stmt, err := config.DB.Prepare("DELETE FROM tasks WHERE id = ?")
	if err != nil {
		return err
	}
	_, err = stmt.Exec(id)
	return err
}

