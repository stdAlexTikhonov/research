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
ifndef ENSURE_ENV
ifeq ($(MAKELEVEL),0)
ENSURE_ENV := $(shell 2>/dev/null >/dev/null $(MAKE) --silent --ignore-errors .env ENSURE_ENV=APP_VERSION)
endif
endif
ifndef APP_VERSION
APP_VERSION := $(shell 2>/dev/null npm version | sed -Ene '2s@^.+:\s+.|..$$@@gp')
endif
ifdef APP_VERSION
PORTAL_SESSION = $(shell awk '/^PORTAL_SESSION/{gsub(/^[^=]+=/,"");print;exit}' .env)
PORTAL_SESSION_PARAM = $(and $(PORTAL_SESSION),biservice_token=$(PORTAL_SESSION))
PORTAL_SESSION_PARAM_ADD = $(and $(PORTAL_SESSION),&$(PORTAL_SESSION_PARAM))
PORTAL_SESSION_PARAM_GET = $(and $(PORTAL_SESSION),?$(PORTAL_SESSION_PARAM))
DWH_WSDL_PATH := $(shell awk '/^DWH_WSDL_PATH/{gsub(/^[^=]+=/,"");print;exit}' .env)
DWH_WSDL_URL := $(shell awk '/^DWH_WSDL_URL/{gsub(/^[^=]+=/,"");print;exit}' .env)$(PORTAL_SESSION_PARAM_ADD)
DWH_WSDL_DOMAIN := $(shell awk -F"=" '!/^DWH_WSDL_URL/{next}{print $$2}' .env | awk -F"[:/]" '{printf "%s",$$4}')
DWH_WSDL_PROTOCOL := $(shell awk -F"=" '!/^DWH_WSDL_URL/{next}{print $$2}' .env | awk -F"[:/]" '{printf "%s",$$1}')
endif
ifdef DWH_WSDL_PATH
# Скачивает SOAP WSDL файл сервиса ХД.
$(DWH_WSDL_PATH): package.json
	wget -qO- "$(DWH_WSDL_URL)" \
 | sed -Ee 's@https?://$(DWH_WSDL_DOMAIN)/([^/]+)/+@$(DWH_WSDL_PROTOCOL)://$(DWH_WSDL_DOMAIN)/\1/@g' \
 | awk '/wsdlsoap:address\s+location/{gsub(/"\s+\/>/,"$(PORTAL_SESSION_PARAM_GET)\" />");print;next}{print}' \
 | sed -Ee 's@schemaLocation="[^"]+\.xsd"@schemaLocation="../config/SDMXGenericData.xsd"@' \
 > $@
endif
################################################################
# Создает файл настроек.
.env: data/.env.version
	test ! -f $@ && cp -pun $< $@

data/.env.version: config/.env.example data/
	@ test -f $@ || sed -Ee 's@^REACT_APP_VERSION=.*@REACT_APP_VERSION=$(APP_VERSION)@g' $< > $@

# Скачивает и устанавливает зависимости.
node_modules/: package.json
	test -d $@ && npm update || npm install

package-lock.json: node_modules/

package.json: .env data/ build/
###############################################################
# Показывает настройки.
env: .env
	@ env -i "$$(sed -En '\/^[^=#]+=.*/p' $<)" printenv | tr -s [:space:]

# Показывает версии.
version: .env
	@ npm version | awk -F"[{:\"' \t}]+" '$$3 { printf "%s\t%s\n", $$2, $$3 }'

# Установка зависимостей.
install: package-lock.json $(DWH_WSDL_PATH)

# Сборка фронтенда.
build: package-lock.json
	npm run build

# Удаляет временные файлы.
clean:
	$(RM) -rf build/ $(DWH_WSDL_PATH) data/.env.version

# Удаляет установленные пакеты npm.
clear: clean
	$(RM) -rf node_modules/ package-lock.json yarn.lock .env

# Создает несуществующие каталоги.
%/:
	test -d $@ || mkdir -p $@
