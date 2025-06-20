# Birthday Greetings

A Node.js application with integrate BullMQ and Prisma

## Installation

1. Clone the repository:

   ```bash
   git clone git@github.com:paperlambda/birthday-greetings.git
   cd birthday-greetings
   ```
2. Install dependencies

   ```bash
    npm install
   ```
3. Set up environment variables by creating a .env file in the project root (refer to provided examples if available)

## Running the Project

### Development
To start the application with Docker services (Postgres & Redis included) and a hot-reload server, run:
```bash
./scripts/dev.sh
```

Alternatively, start the dev server directly:
```bash
npm run dev-server
```

To run background jobs, use npm scripts
```bash
    "scripts": {
        "job:scan-daily-event": "npm run generate && tsx ./src/jobs/scan-daily-event.job.ts",
        "job:send-event-email": "npm run generate && tsx ./src/jobs/send-event-email.job.ts"
    }
```

### Production
TODO

