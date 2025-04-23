package services

import (
	"io"
	"os"
	"task-recorder-server/models"
	"task-recorder-server/utils"
)

func GetTasks() ([]models.Task, error) {
	return models.GetTasks()
}

func CreateTask(file io.Reader, completed bool) (*models.Task, error) {
	uploadDir := "./uploads"
	audioFilePath := uploadDir + "/temp.m4a"

	if err := utils.EnsureDir(uploadDir); err != nil {
		return nil, err
	}

	if err := utils.SaveFile(file, audioFilePath); err != nil {
		return nil, err
	}

	transcription, err := utils.TranscribeAudio(audioFilePath)
	if err != nil {
		return nil, err
	}

	id, err := models.CreateTask(transcription, completed)
	if err != nil {
		return nil, err
	}

	os.Remove(audioFilePath)

	return &models.Task{
		ID:        int(id),
		Title:     transcription,
		Completed: completed,
	}, nil
}

func UpdateTaskByID(id int, completed bool) error {
	return models.UpdateTaskByID(id, completed)
}

func DeleteTaskByID(id int) error {
	return models.DeleteTaskByID(id)
}