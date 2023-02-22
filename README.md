# Short It!

Short It! is a free and open-source URL shortener.

![banner](images/banner.png)

- [Short It!](#short-it)
  - [Feature](#feature)
  - [Deployment](#deployment)
  - [Development](#development)
    - [Databases](#databases)
    - [Build Docker image](#build-docker-image)

中文文件： [設計文件](https://hackmd.io/@stanley2058/short-it-sdd) | [需求達成](https://hackmd.io/@stanley2058/rJQQreQRi) | [開發日誌](https://hackmd.io/@stanley2058/dev-log)

---

## Feature

- Fast URL shortener
- Simple but feature-rich
- Register and log in using social accounts via Auth0
- Login users can edit/delete URLs and see the view count of URLs
- Customize OpenGraph metadata

See a static walkthrough in [INTRODUCTION.md](INTRODUCTION.md).
[![short-it-homepage](images/homepage.png)](https://short.stw.tw)

## Deployment

All the necessary files are inside the [deploy](deploy/) directory.

1. To deploy your own Short It!, you'll have to have an Auth0 application.  
   Follow the guide here: https://auth0.com/docs/quickstart/webapp/express/interactive
2. Copy the [`.env.example`](deploy/.env.example) file to `.env`, then fill in the `AUTH0_CLIENT_ID` and `AUTH0_URI` fields.
3. Fill in the `BASE_URL`, `LOGIN_RETURN_URL`, and `LOGOUT_RETURN_URL` fields with your public domain.
4. Fill in the `SECRET` field, you can use tools like OpenSSL to generate it.

```
# Postgresql
POSTGRES_DB=shortit
POSTGRES_USER=shortit
POSTGRES_PASSWORD=shortit


# Short It

# Change to deploy URI
# e.g.
# BASE_URL=https://mydomain.com
# LOGIN_RETURN_URL=https://mydomain.com
# LOGOUT_RETURN_URL=https://mydomain.com
BASE_URL=
LOGIN_RETURN_URL=
LOGOUT_RETURN_URL=

# goto https://manage.auth0.com/dashboard
AUTH0_CLIENT_ID=
# something like: https://xxxxxxx.xxx.auth0.com
AUTH0_URI=

# openssl rand -hex 32
SECRET=

# available levels: verbose | info | warn | error
LOG_LEVEL=info

DATABASE_URL="postgresql://shortit:shortit@postgresql:5432/shortit?schema=public"
PORT=3000
API_VERSION=v1
```

5. After filling out the environment config file, we can move on to the [docker-compose](deploy/docker-compose.yaml) file.
6. If necessary, change the port or the image to your desire. You can also swap out the path mount to use docker volumes.

```yaml
version: "3"

services:
  redis:
    image: redis
    restart: unless-stopped
    volumes:
      - ./redis:/data
  postgresql:
    image: postgres
    restart: unless-stopped
    environment:
      - POSTGRES_DB
      - POSTGRES_USER
      - POSTGRES_PASSWORD
    volumes:
      - ./postgres:/var/lib/postgresql/data
  shortit:
    image: reg.stw.tw/short-it
    restart: unless-stopped
    ports:
      - 3000:3000
    environment:
      - REDIS_URI=redis://redis:6379
      - DATABASE_URL
      - PORT
      - BASE_URL
      - API_VERSION
      - LOG_LEVEL
      - AUTH0_CLIENT_ID
      - AUTH0_URI
      - SECRET
      - LOGIN_RETURN_URL
      - LOGOUT_RETURN_URL
```

7. After setting up the docker-compose file, run `docker-compose up -d` to start all the services.
8. Before visiting the webpage, you'll have to populate the database first by executing the [migration](deploy/migration.sh) script.
9. Visit your public domain to view the webpage you just deployed.

## Development

See [DEVELOPMENT.md](DEVELOPMENT.md) for more.

### Databases

For local development purposes, you can use the configuration in the [dev-db](dev-db/) directory.

Execute `docker-compose up -d` to spin up a Postgres and a Redis instance.

### Build Docker image

Short It! is built with several steps.

1. Build the [base image](base-image/).
2. Build the [web](web/), which depends on the base image.
3. Build the [server](server/), which depends on the base image and the web image.

The [build-all script](build-all.sh) can do all of these at once.
