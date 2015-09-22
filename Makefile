.SILENT:
.PHONY: help

## Colors
COLOR_RESET   = \033[0m
COLOR_INFO    = \033[32m
COLOR_COMMENT = \033[33m

## Help
help:
	printf "${COLOR_COMMENT}Usage:${COLOR_RESET}\n"
	printf " make [target]\n\n"
	printf "${COLOR_COMMENT}Available targets:${COLOR_RESET}\n"
	awk '/^[a-zA-Z\-\_0-9\.@]+:/ { \
		helpMessage = match(lastLine, /^## (.*)/); \
		if (helpMessage) { \
			helpCommand = substr($$1, 0, index($$1, ":")); \
			helpMessage = substr(lastLine, RSTART + 3, RLENGTH); \
			printf " ${COLOR_INFO}%-16s${COLOR_RESET} %s\n", helpCommand, helpMessage; \
		} \
	} \
	{ lastLine = $$0 }' $(MAKEFILE_LIST)

#########
# Setup #
#########

## Setup environment & Install application
setup: setup-vagrant
	vagrant ssh -c 'cd /srv/app && make install'

setup-vagrant:
	ansible-galaxy install -r ansible/roles.yml -p ansible/roles -f
	vagrant up --provision

###########
# Install #
###########

## Install application
install: install-app install-dep build

install-app:
	npm --no-spin install

install-dep:
	bower install --config.interactive=false

#########
# Build #
#########

## Build application
build: build-assets

build-assets:
	gulp

#########
# Watch #
#########

## Watch application
watch: watch-assets

watch-assets:
	gulp watch

#######
# Run #
#######

## Run application
run: run-app

run-app:
	node bin/curvytron.js

##########
# Custom #
##########
