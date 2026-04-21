# 💎 Famiglia Demo Management
# Premium orchestration for the elite agentic stack

.PHONY: help pull up down ps logs restart clean

help:
	@echo "💎 Famiglia Demo Command Center"
	@echo ""
	@echo "Usage:"
	@echo "  make pull      - Fetch the latest production images from GHCR"
	@echo "  make up        - Start the full stack in detached mode"
	@echo "  make down      - Stop and remove all containers"
	@echo "  make ps        - Check the status of the services"
	@echo "  make logs      - Follow the logs from all services"
	@echo "  make restart   - Restart the app service"
	@echo "  make clean     - Remove all containers and volumes (CAUTION)"
	@echo "  make fe-build  - Build frontend (from sibling core repo) locally"

pull:
	docker compose pull

up:
	docker compose up -d

down:
	docker compose down

ps:
	docker compose ps

logs:
	docker compose logs -f

restart:
	docker compose restart app

clean:
	docker compose down -v

# 🎨 Frontend (from sibling repo)
FE_DIR = ../famiglia-core/src/famiglia_core/command_center/frontend

fe-install:
	cd $(FE_DIR) && npm install

fe-dev:
	cd $(FE_DIR) && npm run dev

fe-build:
	cd $(FE_DIR) && VITE_BASE_PATH="/" npm run build
	cp -r $(FE_DIR)/dist ./dist
# 🚀 Deployment (Hetzner)
include .env

deploy:
	@echo "🛰️  Deploying to $(SSH_HOST)..."
	# Sync the Demo repo
	ssh $(SSH_USER)@$(SSH_HOST) "mkdir -p ~/famiglia-demo"
	rsync -avz --exclude '.git' --exclude 'node_modules' --exclude 'data' ./ $(SSH_USER)@$(SSH_HOST):~/famiglia-demo/
	# Note: Ensure famiglia-core is also synced to ~/famiglia-core on the server
	# Start the stack
	ssh $(SSH_USER)@$(SSH_HOST) "cd ~/famiglia-demo && docker compose pull && docker compose up -d"
	@echo "💎 Deployment complete at https://$(PRODUCTION_DOMAIN)"
