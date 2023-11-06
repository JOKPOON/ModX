package configs

type Configs struct {
	PostgreSQL PostgreSQL
	App        Gin
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
