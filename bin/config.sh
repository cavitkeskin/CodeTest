#!/usr/bin/env bash

HERE=$(dirname $0)
ROOT=$HERE/..

DBNAME=ct_library
DBUSER=ct_library
DBPASS=ct_library
DBHOST=localhost

MYSQL="$(which mysql) -u root"
MYSQLDUMP="$(which mysqldump) -u root"

# ---=[Color Codes]=---
red=`tput setaf 1`
green=`tput setaf 2`
yellow=`tput setaf 3`
blue=`tput setaf 4`
bold=`tput dim`
dim=`tput setaf 59`
clear=`tput clear`
reset=`tput sgr0`
