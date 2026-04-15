@echo off
chcp 65001 > nul
title 婚前契約書ジェネレーター - 本番プレビュー
echo.
echo  ====================================================
echo   💍 婚前契約書ジェネレーター - 本番ビルドのプレビュー
echo  ====================================================
echo.
echo  ※ 先に build.bat を実行して dist/ を生成してください
echo.
if not exist "dist\" (
    echo  [ERROR] dist/ フォルダが見つかりません。
    echo          先に build.bat を実行してください。
    echo.
    pause
    exit /b 1
)
echo  プレビューサーバーを起動しています...
echo  ブラウザで http://localhost:4173 を開いてください
echo.
echo  終了するには Ctrl+C を押してください
echo.
npm run preview
pause
