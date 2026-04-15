@echo off
chcp 65001 > nul
title 婚前契約書ジェネレーター - セットアップ
echo.
echo  ====================================================
echo   💍 婚前契約書ジェネレーター - 初回セットアップ
echo  ====================================================
echo.
echo  依存パッケージをインストールしています...
echo  （数分かかる場合があります）
echo.
npm install
if %errorlevel% neq 0 (
    echo.
    echo  [ERROR] インストールに失敗しました。
    echo          Node.js がインストールされているか確認してください。
    echo          https://nodejs.org/
    pause
    exit /b 1
)
echo.
echo  ====================================================
echo   ✅ セットアップ完了！
echo.
echo   次のステップ:
echo     開発サーバー起動  →  start.bat をダブルクリック
echo     本番ビルド        →  build.bat をダブルクリック
echo  ====================================================
echo.
pause
