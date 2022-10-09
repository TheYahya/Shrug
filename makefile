include .env

# Add variables from .env
VARS:=$(shell sed -ne 's/ *\#.*$$//; /./ s/=.*$$// p' .env )
$(foreach v,$(VARS),$(eval $(shell echo export $(v)="$($(v))")))
 
run-server: 
	cd server && \
	go run main.go

install-client:
	cd client && \
	npm install

run-client: 
	cd client && \
	npm run dev-server

d-build:
	docker build .

dc-deploy:
	docker-compose up -d


