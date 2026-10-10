@echo off
chcp 65001 > nul
cls
echo ===================================================================
echo     🚀 AeroSport Platform — GitHub Avtorizatsiya va Yuklash
echo ===================================================================
echo.
echo Profil: https://github.com/ElyorMaxsudov/aerosport
echo.
echo 1. Hozir brauzerda GitHub avtorizatsiya oynasi ochiladi.
echo 2. Ekranda ko'rsatilgan 8 xonali bir martalik kodni tasdiqlang.
echo 3. Tasdiqlangach, loyiha darhol avtomatik yuklanadi!
echo.
echo ===================================================================
echo.

"C:\Users\USER\gh\bin\gh.exe" auth login --web -h github.com -p https
"C:\Users\USER\gh\bin\gh.exe" auth setup-git

echo.
echo ===================================================================
echo Loyiha GitHub'ga yuklanmoqda...
echo ===================================================================
echo.

"C:\Users\USER\mingit\cmd\git.exe" remote set-url origin https://github.com/ElyorMaxsudov/aerosport.git
"C:\Users\USER\mingit\cmd\git.exe" push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ===================================================================
    echo ✅ TABRIKLAYMIZ! Loyiha muvaffaqiyatli GitHub'ga yuklandi!
    echo Havola: https://github.com/ElyorMaxsudov/aerosport
    echo ===================================================================
) else (
    echo.
    echo ⚠️ Xatolik yuz berdi. Iltimos qaytadan urinib ko'ring.
)

echo.
pause
