package utils

import (
	"context"
	"fmt"
	"io"
	"log"
	"net/http"
	"os"

	speech "cloud.google.com/go/speech/apiv1"
	"cloud.google.com/go/speech/apiv1/speechpb"
)

func EnsureDir(path string) error {
	if _, err := os.Stat(path); os.IsNotExist(err) {
		return os.Mkdir(path, os.ModePerm)
	}
	return nil
}

func SaveFile(src io.Reader, dstPath string) error {
	dst, err := os.Create(dstPath)
	if err != nil {
		return err
	}
	defer dst.Close()

	_, err = io.Copy(dst, src)
	return err
}

func TranscribeAudio(filePath string) (string, error) {
	ctx := context.Background()
	client, err := speech.NewClient(ctx)
	if err != nil {
		return "", fmt.Errorf("erro ao criar cliente Speech: %w", err)
	}
	defer client.Close()

	audioData, err := os.ReadFile(filePath)
	if err != nil {
		return "", fmt.Errorf("erro ao ler o arquivo de áudio: %w", err)
	}

	resp, err := client.Recognize(ctx, &speechpb.RecognizeRequest{
		Config: &speechpb.RecognitionConfig{
			Encoding:        speechpb.RecognitionConfig_MP3,
			SampleRateHertz: 16000,
			LanguageCode:    "pt-BR",
		},
		Audio: &speechpb.RecognitionAudio{
			AudioSource: &speechpb.RecognitionAudio_Content{Content: audioData},
		},
	})
	if err != nil {
		return "", fmt.Errorf("erro ao reconhecer áudio: %w", err)
	}

	for _, result := range resp.Results {
		for _, alt := range result.Alternatives {
			return alt.Transcript, nil
		}
	}

	return "", fmt.Errorf("nenhuma transcrição encontrada")
}

func HandleError(w http.ResponseWriter, message string, err error, status int) {
	log.Printf("%s: %v", message, err)
	errorResponse := fmt.Sprintf("%s: %v", message, err)

	http.Error(w, errorResponse, status)
}