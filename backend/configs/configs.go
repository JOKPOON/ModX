package configs

type Configs struct {
	S3         S3
	AWS        AWS
	PostgreSQL PostgreSQL
	App        Gin
	Omi        Omi
}

type Gin struct {
	Host string
	Port string
}

type PostgreSQL struct {
	Host     string
	Port     string
	Protocol string
	Username string
	Password string
	Database string
	SSLMode  string
}

type AWS struct {
	Region          string
	AccessKeyID     string
	SecretAccessKey string
}

type S3 struct {
	URL        string
	BucketName string
}

type Omi struct {
	PublicKey string
	SecretKey string
}
