````markdown
# Clutch Server

This is the backend server for the Clutch application, developed by Earendel Technologies LLC. It provides RESTful API endpoints for user authentication, management, and other functionalities.

## Prerequisites

Before you begin, ensure you have met the following requirements:

- **Node.js**: Make sure you have Node.js installed. You can download it from [nodejs.org](https://nodejs.org/).
- **npm**: Node.js package manager, which is installed with Node.js.
- **PostgreSQL**: The application uses PostgreSQL as its database. Ensure you have it installed and running.
- **Environment Variables**: Create a `.env` file in the root directory and configure the following variables:
  - `DB_NAME`: Your database name
  - `DB_USERNAME`: Your database username
  - `DB_PASSWORD`: Your database password
  - `DB_HOST`: Your database host (e.g., `localhost`)
  - `DB_PORT`: Your database port (default is `5432`)
  - `JWT_SECRET`: Secret key for JWT token generation
  - `MAIL_SENDER_NAME`: Email address for sending emails
  - `MAIL_SENDER_PASS`: Password for the email address
  - `TWILIO_ACCOUNT_SID`: Twilio account SID for sending SMS
  - `TWILIO_AUTH_TOKEN`: Twilio auth token
  - `TWILIO_PHONE_NUMBER`: Twilio phone number for sending SMS

## Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/Earendel-Technologies/Clutch-server.git
   cd Clutch-server
   ```
````

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Set up the database**:
   Ensure your PostgreSQL server is running and the database is created. You can use the Sequelize CLI to run migrations:
   ```bash
   npx sequelize-cli db:migrate
   ```

## Running the Application

### Development

To run the application in development mode, use:

```bash
npm run dev
```

This command uses `nodemon` to watch for file changes and `ts-node` to execute TypeScript files directly.

### Production

To build and run the application in production mode, use:

```bash
npm run build
npm start
```

This will compile the TypeScript files into JavaScript and start the server using Node.js.

## Testing

To run tests, use:

```bash
npm test
```

This command uses `jest` to execute the test suite.

## Linting

To lint the codebase, use:

```bash
npm run lint
```

This command uses `eslint` to check for code quality and style issues.

## API Endpoints

The server exposes several API endpoints for user management, authentication, and more. Refer to the `src/routes` directory for detailed route definitions.

## Contributing

Contributions are welcome! Please fork the repository and submit a pull request for any improvements or bug fixes.

## License

This project is licensed under the ISC License.

## Contact

For any inquiries, please contact Earendel Technologies LLC.

```

### References to Code Blocks

- **package.json**:
  - Start and end lines: 1 to 58
- **src/index.ts**:
  - Start and end lines: 1 to 110
- **src/config/db.ts**:
  - Start and end lines: 1 to 27
```
