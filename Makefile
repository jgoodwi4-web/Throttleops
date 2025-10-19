.PHONY: install start stop preview seed

install:
	@bash scripts/install-local.sh

start:
	@bash scripts/start-local.sh

stop:
	@bash scripts/stop-local.sh

preview:
	@bash scripts/preview-frontend.sh

seed:
	@bash scripts/seed_admin.sh
