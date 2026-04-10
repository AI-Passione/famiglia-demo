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
