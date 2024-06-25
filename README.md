# ModX

ModX is an online shopping platform designed specifically for the KMUTT bookstore. It provides a seamless and user-friendly experience for students to buy and sell books.

## Features

- User Registration: Users can create a personal account to buy and sell books.
- Product Listing: Sellers can list their books with details like title, author, price, and condition.
- Search Functionality: Users can search for books using various parameters like title, author, or ISBN.
- Shopping Cart: Users can add books to a shopping cart and checkout when ready.
- Payment Gateway: Integrated payment gateway for secure transactions.
- User Profile: Users can view and edit their profile, view past transactions, and more.

## Technoology Stack

The Modx application is developed using the following technologies:

- React: A TypeScript library for building user interfaces.
- PostgreSQL: A powerful, open-source relational database management system.
- Gin: A web framework written in Go (Golang). It's known for its high performance and efficiency

## Getting Started

To run TradeKub locally on your machine, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://gitlab.com/Bukharney/ModX.git
   ```

2. Set up the environment variables:

   - You need to have a AWS account and an Omise account to run the application.
     - For S3 Storage, you need to create a bucket and create a ACCESS and SECRET keys.
     - For Omise, you need to create an account and generate API keys.
   - Create a `.env` file in the root directory of the project.
   - Add the following environment variables to the `.env` file:

     ```
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
      - POSTGRES_USER=${POSTGRES_USER}
      - POSTGRES_DB=${POSTGRES_DB}
      - POSTGRES_HOST=${POSTGRES_HOST}
      - POSTGRES_PORT=${POSTGRES_PORT}
      - OMISE_PUBLIC_KEY=${OMISE_PUBLIC_KEY}
      - OMISE_SECRET_KEY=${OMISE_SECRET_KEY}
      - AWS_ACCESS_KEY=${AWS_ACCESS_KEY}
      - AWS_SECRET_ACCESS_KEY=${AWS_SECRET_ACCESS_KEY}
      - AWS_REGION=${AWS_REGION}
      - AWS_S3_BUCKET_NAME=${AWS_S3_BUCKET_NAME}
      - AWS_S3_URL=${AWS_S3_URL}
     ```

3. Start the application using the following command:

   ```bash
   docker compose up
   ```

4. Access the ModX in your browser at `http://modx.localhost`.

## Contributing

We welcome contributions to the Modx project. If you would like to contribute, please follow these guidelines:

1. Fork the repository and create a new branch for your contribution.
2. Make your changes and ensure that the code passes all tests.
3. Submit a pull request with a clear description of your changes and their purpose.

## License

The Modx project is licensed under the [MIT License](LICENSE). Feel free to use, modify, and distribute the code as per the terms of the license.
