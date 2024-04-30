package configs

type Configs struct {
	GCS        GCS
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

type GCS struct {
	URL        string
	BucketName string
	ProjectID  string
}

type Omi struct {
	PublicKey string
	SecretKey string
}
