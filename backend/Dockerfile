FROM golang:1.21-alpine

WORKDIR /app

COPY go.mod go.sum ./

RUN go mod download

COPY . .

RUN go build -o main .

ENV GOOGLE_APPLICATION_CREDENTIALS=/app/credentials.json

EXPOSE 8080

CMD ["./main"]
