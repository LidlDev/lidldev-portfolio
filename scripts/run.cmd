@echo off
setlocal
cd /d "%~dp0.."
for /d %%D in ("%~dp0..\..\.tools\node-runtime\node-*-win-x64") do set "PORTFOLIO_NODE=%%~fD"
if defined PORTFOLIO_NODE (
  set "PATH=%PORTFOLIO_NODE%;%PATH%"
  set "NODE_USE_SYSTEM_CA=1"
  "%PORTFOLIO_NODE%\node.exe" "%PORTFOLIO_NODE%\node_modules\npm\bin\npm-cli.js" %*
) else (
  call npm.cmd %*
)
exit /b %errorlevel%
