# Famiglia Demo

This repository is the deployment and orchestration layer for the Famiglia demo stack. It keeps the Docker Compose setup, CI checks, and Hetzner deployment workflow that tie together:

- [`famiglia-demo`](https://github.com/AI-Passione/famiglia-demo)
- [`famiglia-core`](https://github.com/AI-Passione/famiglia-core)

## Architecture

- `docker-compose.yml` runs the app, frontend, Postgres, Redis, and Ollama as one stack.
- `famiglia-core` provides the frontend source and database schema mounted by the stack.
- `la-passione` provides the backend build context used by the `app` service.
- Deployment happens through GitHub Actions over SSH to a Hetzner host.

## Local Setup

1. Clone this repo alongside `famiglia-core` and `la-passione` so the three folders share the same parent directory.
2. Copy `.env.example` to `.env` and fill in the required secrets.
3. Start the stack with `make up`.
4. Check logs with `make logs`.

## Hetzner Deployment

The deploy workflow in [`.github/workflows/deploy.yml`](/Users/jimmypang/AIPassioneProjects/famiglia-demo/.github/workflows/deploy.yml) connects to your Hetzner box over SSH and updates all three sibling repositories before running `docker compose up -d --build`.

Configure these GitHub Actions secrets:

- `SSH_HOST`
- `SSH_USER`
- `SSH_PRIVATE_KEY` or `SSH_PRIVATE_KEY_BASE64`
- `SSH_PASSPHRASE` (only if the private key is encrypted)
- `SSH_PORT` (optional, defaults to `22`)

`SSH_PRIVATE_KEY` must contain the raw private key block with real line breaks, for example:

```text
-----BEGIN OPENSSH PRIVATE KEY-----
...
-----END OPENSSH PRIVATE KEY-----
```

Do not store the public key, and do not store a shell variable name like `$SSH_PRIVATE_KEY` as the secret value.

If GitHub keeps mangling the multiline key for you, store a base64-encoded version instead:

```bash
base64 < ~/.ssh/your_private_key | tr -d '\n'
```

Save that output as `SSH_PRIVATE_KEY_BASE64`.

The target server also needs:

- Docker with the Compose plugin installed
- a checked-out stack root at `/opt/famiglia` or permission for the workflow to create it
- GitHub SSH access on the server for the three repositories
- a populated `/opt/famiglia/famiglia-demo/.env`

## CI

- `.github/workflows/verify.yml` checks that the three-repo layout resolves correctly and that `docker compose config` succeeds.
- `.github/workflows/test.yml` runs the same verification on non-`main` pushes.
