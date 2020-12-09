include .env

# Add variables from .env
VARS:=$(shell sed -ne 's/ *\#.*$$//; /./ s/=.*$$// p' .env )
$(foreach v,$(VARS),$(eval $(shell echo export $(v)="$($(v))")))
 
run-server: 
	cd server && \
	go run main.go

run-client: 
	cd client && \
	yarn dev-server

d-build:
	docker build .

dc-deploy:
	docker-compose up -d

dc-b-deploy:
	docker-compose build --no-cache && docker-compose logs -f

dc-app:
	docker-compose up -d shrug && docker-compose logs -f

dc-dbs:
	docker-compose up -d postgres redis && docker-compose logs -f

dc-dbs-dev:
	docker-compose -f docker-compose.dev.yml up -d postgres redis && docker-compose -f docker-compose.dev.yml logs -f