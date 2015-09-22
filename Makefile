.SILENT:
.PHONY: help

## Setup environment & Install application
setup:
	ansible-galaxy install -r ansible/roles.yml -p ansible/roles -f --ignore-errors
	vagrant up --provision
	vagrant ssh -c 'cd /srv/app && make install'

## Install
install: prepare-vendor build

## Setup environment & Install application
prepare-vendor:
	npm install

## Build the sources
build:
	gulp

## Watch and build
watch:
	gulp watch

## Run the server
run:
	node bin/curvytron.js
