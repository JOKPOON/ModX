package databases

import (
	"context"
	"time"

	"cloud.google.com/go/storage"
	"github.com/Bukharney/ModX/configs"
)

func NewGoolgeCloudStorage(cfg *configs.Configs) (*storage.Client, error) {
	ctx := context.Background()
	ctx, cancel := context.WithTimeout(ctx, time.Second*50)
	defer cancel()

	storage, err := storage.NewClient(ctx)
	if err != nil {
		return nil, err
	}

	return storage, nil
}
