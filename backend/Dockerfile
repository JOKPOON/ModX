FROM golang:1.21-alpine

WORKDIR /app

COPY go.mod go.sum ./

RUN go mod download

RUN apk update && apk add --no-cache bash curl && curl -1sLf \
'https://dl.cloudsmith.io/public/infisical/infisical-cli/setup.alpine.sh' | bash \
&& apk update && apk add --no-cache infisical

COPY . .

RUN go build -o main .

EXPOSE 8080

CMD ["infisical", "run", "--", "./main"]
