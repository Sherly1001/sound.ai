# Backend Services

## Installation

```bash
$ yarn install
```

## Environments

```bash
PORT=3000 # runing port

DATABASE_URL=               # database connection string
DATABASE_LOG=               # database query loging
DATABASE_SYNC=              # sync database, set to false when running production
DATABASE_RUN_MIGRATIONS=    # run migrations, set to false when runing production

JWT_SECRET_KEY=             # jwt key
JWT_EXPIRE='60 days'        # jwt expire

STORAGE_DIRECTORY='./data'  # the directory where models, audio, and images are stored
```

## Running the app

- For the initial run to initialize tables before running migrations, set `DATABASE_SYNC=true` and `DATABASE_RUN_MIGRATIONS=false`
- To execute migrations, set `DATABASE_SYNC=true` and `DATABASE_RUN_MIGRATIONS=true`

```bash
# development
$ yarn run start

# watch mode
$ yarn run start:dev

# production mode
$ yarn run start:prod
```
