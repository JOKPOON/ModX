# ModX Backend

This is the backend for ModX, a web application developed using Go, Gin, PostgreSQL, and Omise for payment processing.

## Table of Contents

- [Introduction](#introduction)
- [Features](#features)
- [Requirements](#requirements)
- [Getting Started](#getting-started)
  - [Installation](#installation)
  - [Configuration](#configuration)
  - [Running the Server](#running-the-server)
- [API Documentation](#api-documentation)
- [Contribution](#contribution)
- [License](#license)

## Introduction

ModX is an online shopping platform designed specifically for the KMUTT bookstore. It provides a seamless and user-friendly experience for students to buy and sell books.

## Features

- User authentication and authorization
- Content management capabilities
- Integration with Omise for secure payment processing
- Storage and retrieval of files using Google Cloud Storage
- API endpoints for seamless communication with the frontend

## Requirements

Before you start, ensure you have the following installed:

- Omise API credentials
- Google Cloud Storage credentials

## Getting Started

### Configuration

#### Database Configuration

1. Create a PostgreSQL database and configure the connection in the `docker-compose`or `.env` (recommend) file.

#### Omise Configuration

1. Set up your Omise API credentials in the `docker-compose`or `.env` (recommend) file.

#### Google Cloud Storage Configuration

1. Set up your Google Cloud Storage credentials `credentials.json` in the `backend` directory.
   and URL of a bucket in the `docker-compose` or `.env` (recommend) file.

### Installation

```bash
git clone https://gitlab.com/Bukharney/ModX.git
cd backend
```

### Running the Server

```bash
docker-compose up
```

The server will start on http://localhost:8080 by default.

### API Documentation

For detailed information on available API endpoints and how to use them, refer to the [API documentation](https://modx.bukharney.tech/api/docs/index.html).

### Contribution

If you want to contribute to the development of ModX, please follow the contribution guidelines.

## License

The Modx project is licensed under the [MIT License](LICENSE). Feel free to use, modify, and distribute the code as per the terms of the license.
