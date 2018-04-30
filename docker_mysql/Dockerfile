FROM mysql:5.7.15

MAINTAINER Lucas Funti

ENV MYSQL_DATABASE=competencias \
    MYSQL_ROOT_PASSWORD=''

ADD script_competencias.sql /docker-entrypoint-initdb.d

EXPOSE 8081
