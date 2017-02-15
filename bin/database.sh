#!/usr/bin/env bash

source $(dirname $0)/config.sh

WHAT=$1

# drop database if exists then create with all objects ...
create()
{
    echo "-- drop and create database $DBNAME"
    echo "DROP DATABASE IF EXISTS $DBNAME;"
    echo "CREATE DATABASE IF NOT EXISTS $DBNAME DEFAULT CHARACTER SET utf8;"
    echo "GRANT ALL ON $DBNAME.* TO '$DBUSER'@'$DBHOST' IDENTIFIED BY '$DBPASS';"
	echo "\u $DBNAME"
    cat $ROOT/db/init.sql
	echo "show tables;"
    echo ""
}

# insert default data
initialize()
{
	echo "\. $ROOT/db/init.data.sql"
	echo ""
}

backup()
{
  DATE=$(date +%Y%m%d_%H%M%S)
  FILENAME="$(dirname $0)/../db/backup/$DBNAME.$DATE.$(hostname).mysql.gz"
  mkdir -p $(dirname $FILENAME)
  echo "$DBNAME database backing up to $FILENAME"
  $MYSQLDUMP $DBNAME --set-gtid-purged=OFF | gzip > $FILENAME
}

restore()
{
  FILE=$1
  [ -z "$FILE" ] && die "Usage: $0 $WHAT backup_file.gz"
  [ -f $FILE ] || die "$FILE file not found"
  echo "$DBNAME restoring from $FILE ...";
  gunzip -c $FILE | $MYSQL $DBNAME
}

alteration()
{
    echo "\cd $LOCAL_PATH/db";
	echo "begin;"
	echo ""
	if [ ! -z "$1" ]; then
		restore
	fi
	echo ""
	echo "-- Alter Tables etc..."
	echo "\i alter.sql"
	echo ""
	echo "drop schema bak cascade;"
	echo ""
	echo "-- Permission"
	echo "GRANT USAGE ON SCHEMA public TO \"$DBUSER\";"
	echo "GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA PUBLIC TO \"$DBUSER\";"
	echo "GRANT USAGE ON ALL SEQUENCEs IN SCHEMA PUBLIC TO \"$DBUSER\";"
	echo "GRANT EXECUTE ON ALL FUNCTIONs IN SCHEMA PUBLIC TO \"$DBUSER\";"
	echo ""
	echo "commit;"
}

die()
{
	echo -e "\n\n\t$1\n\n";
	exit 1
}

#[ "$WHICH" != "app" ] && [ "$WHICH" != "auth" ] && die "Usage: $0 [backup|create|update] [app|auth]"

case "$WHAT" in
	create)
		echo "${yellow}Creating database...${reset}"
  		create | $MYSQL
		echo "${yellow}setting default data${reset}"
    	initialize | $MYSQL $DBNAME -t
		;;
	backup)
    	backup
    ;;
	restore)
    	restore $2
		;;
	update)
        FILE=/tmp/$DBNAME.data
        #[ "$2" = "force" ] && rm -f $FILE
        #[ -f $FILE ] && echo -e "\n\t${blue}$FILE already exists, it will be used to ingest data${reset}\n"
		if [ -f $FILE ]; then
			echo -e "\n\t${blue}$FILE already exists, your current data will be replaced with this file${reset}"
			echo -en "\ttype 'current' to save current data in your database, otherwite just hit enter: "
			read answer
			case $answer in
				'current')
					echo "$FILE backing up, new one will be created"
					mv $FILE $FILE.$(date +%Y%m%d_%H%M%S)
					;;
				'')
					echo "last backup file will be used"
					;;
				*)
					die 'invalid option'
					;;
			esac
		fi

		[ -f $FILE ] || $MYSQLDUMP -c --no-create-info --skip-add-locks --skip-triggers --set-gtid-purged=OFF $DBNAME > /tmp/$DBNAME.data

		echo "${yellow}Creating database...${reset}"
        create | $MYSQL
		echo "${yellow}Ingest data from $FILE...${reset}"
        cat /tmp/$DBNAME.data | $MYSQL $DBNAME

		;;

	connect)
		$MYSQL $DBNAME
		;;
	sql)
        if [ -f "$2" ]
        then cat "$2" | $MYSQL -t $DBNAME
    	else echo "$2" | $MYSQL -t $DBNAME
        fi
		;;
	*)
		echo ""
		echo -e "\tUsage: $0 [backup|restore|create|update|sql file/script]"
		echo ""
		echo ""
		echo ""
		echo "what do you want to do?"
		select choice in 'backup' 'restore' 'create' 'update' 'connect' 'quit'; do
			case $choice in
				'backup')
					$0 backup
					break
					;;
				'restore')
					select file in $(dirname $0)/../db/backup/*; do
						$0 restore $file
						break
					done
					break
					;;
				'create')
					$0 create
					break
					;;
				'update')
					$0 update
					break
					;;
				'connect')
					$0 connect
					break
					;;
				'quit')
					break
					;;
			esac
		done

esac

exit 0
