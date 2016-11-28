@echo off
call npm install
SET DEBUG=myapp:*
rem SET NODE_ENV=production
SET NODE_ENV=development
call npm start
