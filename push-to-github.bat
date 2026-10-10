@echo off
chcp 65001 > nul
cls
echo ===================================================================
echo     🚀 AeroSport Platform — GitHub'ga Bir Bosishda Yuklash
echo ===================================================================
echo.
echo Profil: https://github.com/ElyorMaxsudov
echo Repozitoriya: aerosport
echo.
echo DIQQAT: Agar GitHub'da hali "aerosport" repozitoriyasi ochilmagan bo'lsa:
echo 1. https://github.com/new manziliga kiring
echo 2. Repository name ga "aerosport" deb yozing
echo 3. "Create repository" tugmasini bosing
echo.
echo ===================================================================
echo Yuklash boshlanmoqda...
echo.

"C:\Users\USER\mingit\cmd\git.exe" remote set-url origin https://github.com/ElyorMaxsudov/aerosport.git
"C:\Users\USER\mingit\cmd\git.exe" branch -M main
"C:\Users\USER\mingit\cmd\git.exe" add .
"C:\Users\USER\mingit\cmd\git.exe" commit -m "feat: complete sports platform with regional chat and MongoDB Atlas" > nul 2>&1
"C:\Users\USER\mingit\cmd\git.exe" push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ===================================================================
    echo ✅ TABRIKLAYMIZ! Loyiha GitHub'ga muvaffaqiyatli yuklandi!
    echo Havola: https://github.com/ElyorMaxsudov/aerosport
    echo ===================================================================
) else (
    echo.
    echo ⚠️ Agar yuqorida xatolik chiqqan bo'lsa:
    echo 1) https://github.com/new ga kirib "aerosport" nomli bo'sh repo ochganingizga ishonch hosil qiling.
    echo 2) GitHub login yoki Personal Access Token kiriting.
)

echo.
pause
