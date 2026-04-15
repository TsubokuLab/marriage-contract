@echo off
chcp 65001 > nul
title 婚前契約書ジェネレーター - 開発サーバー
echo.
echo  ====================================================
echo   💍 婚前契約書ジェネレーター - 開発サーバー起動
echo  ====================================================
echo.
echo  開発サーバーを起動しています...
echo  ブラウザで http://localhost:5173 を開いてください
echo.
echo  終了するには Ctrl+C を押してください
echo.
npm run dev
pause
