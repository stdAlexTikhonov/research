#!/usr/bin/env make -f
# This is `Makefile`.
# GNU make manual: <https://clck.ru/DvcHh>
################################################################
.ONESHELL:
.NOTPARALLEL:
.EXPORT_ALL_VARIABLES:
.PHONY: clean clear env version build install
.DEFAULT_GOAL := env
SHELL := bash
MAKE := make
TIME_STYLE := long-iso

################################################################
DWH_WSDL_PATH := $(shell awk '/^DWH_WSDL_PATH/{gsub(/^[^=]+=/,"");print;exit}' .env)
DWH_WSDL_URL := $(shell awk '/^DWH_WSDL_URL/{gsub(/^[^=]+=/,"");print;exit}' .env)
DWH_WSDL_DOMAIN := $(shell awk -F"=" '!/^DWH_WSDL_URL/{next}{print $$2}' .env | awk -F"[:/]" '{printf "%s",$$4}')
DWH_WSDL_PROTOCOL := $(shell awk -F"=" '!/^DWH_WSDL_URL/{next}{print $$2}' .env | awk -F"[:/]" '{printf "%s",$$1}')

# Скачивает SOAP WSDL файл сервиса ХД.
$(DWH_WSDL_PATH): package.json
	wget -qO- "$(DWH_WSDL_URL)" | sed -Ee 's@https?://$(DWH_WSDL_DOMAIN)/([^/]+)/+@$(DWH_WSDL_PROTOCOL)://$(DWH_WSDL_DOMAIN)/\1/@g' > $@

################################################################
# Скачивает и устанавливает зависимости.
node_modules/: package.json
	test -d $@ && npm update || npm install

package-lock.json: node_modules/

package.json: .env build/ data/

###############################################################
env: .env
	@ env -i "$$(sed -En '\/^[^=#]+=.*/p' $<)" printenv | tr -s [:space:]

version: .env
	@ npm version | awk -F"[{:\"' \t}]+" '$$3 { printf "%s\t%s\n", $$2, $$3 }'

install: package-lock.json $(DWH_WSDL_PATH)

build: package-lock.json
	npm run build

# Удаляет временные файлы.
clean:
	$(RM) -rf build/ $(DWH_WSDL_PATH)

# Удаляет установленные пакеты npm.
clear: clean
	$(RM) -rf node_modules/ package-lock.json yarn.lock

# Создает несуществующие каталоги.
%/:
	test -d $@ || mkdir -p $@
