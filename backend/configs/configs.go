package configs

type Configs struct {
	GCS        GCS
	PostgreSQL PostgreSQL
	App        Gin
	URL        string
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

type GCS struct {
	BucketName string
	ProjectID  string
}
