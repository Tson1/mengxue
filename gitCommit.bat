@echo off
@title bat 交互执行git命令
REM D:
REM cd D:/git/test
git add .
git commit -m %date:~0,4%/%date:~5,2%/%date:~8,2%
git push --set-upstream origin gh-pages
