package databases

import (
	"fmt"

	"github.com/Bukharney/ModX/configs"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/credentials"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
)

func NewAwsS3(cfg *configs.Configs) (*s3.S3, error) {
	sess, err := session.NewSession(&aws.Config{
		Region: aws.String(cfg.AWS.Region),
		Credentials: credentials.NewStaticCredentials(
			cfg.AWS.AccessKeyID,
			cfg.AWS.SecretAccessKey,
			""),
	})

	if err != nil {
		fmt.Println("Error creating session:", err)
		return nil, err
	}
	svc := s3.New(sess)

	return svc, nil
}
