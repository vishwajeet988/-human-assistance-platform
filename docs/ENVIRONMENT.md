# Environment variables

`NODE_ENV`, `PORT`, `DATABASE_URL`, `JWT_SECRET`, `PAYMENT_WEBHOOK_SECRET`, `PERSISTENCE_MODE`, `STORAGE_MODE`, `NOTIFICATION_MODE`, and `MAP_MODE` are validated by the API configuration. Development defaults use in-memory repositories and no external delivery. Production requires PostgreSQL mode, database URL, and non-development secrets. Gateway, storage, notification and map credentials must be supplied through the deployment secret manager rather than committed files.
