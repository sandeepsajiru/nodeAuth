@echo off
start "" mongod.exe --dbpath %systemdrive%\MongoDB-Data
start "" nodemon
start "" http://localhost:30000