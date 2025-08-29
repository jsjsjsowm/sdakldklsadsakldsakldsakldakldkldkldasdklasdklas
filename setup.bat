@echo off
echo 🚀 Driver License App - Setup Script
echo ====================================

echo.
echo 📦 Installing dependencies...
call npm install
if errorlevel 1 (
    echo ❌ Failed to install root dependencies
    exit /b 1
)

echo.
echo 📦 Installing frontend dependencies...
cd frontend
call npm install
if errorlevel 1 (
    echo ❌ Failed to install frontend dependencies
    exit /b 1
)

echo.
echo 📦 Installing backend dependencies...
cd ..\backend
call npm install
if errorlevel 1 (
    echo ❌ Failed to install backend dependencies
    exit /b 1
)

echo.
echo ⚙️ Setting up environment file...
if not exist .env (
    if exist env.example (
        copy env.example .env
        echo ✅ Environment file created from template
    ) else (
        echo ⚠️ Environment template not found
    )
) else (
    echo ⚠️ Environment file already exists
)

echo.
echo 🔨 Building backend...
call npm run build
if errorlevel 1 (
    echo ❌ Backend build failed
    echo ℹ️ You may need to fix TypeScript errors manually
    pause
    exit /b 1
)

echo.
echo 📁 Creating directories...
if not exist uploads mkdir uploads
if not exist uploads\signatures mkdir uploads\signatures
if not exist uploads\photos mkdir uploads\photos
if not exist uploads\certificates mkdir uploads\certificates
if not exist applications mkdir applications
if not exist backups mkdir backups

cd ..

echo.
echo 🎉 Setup completed successfully!
echo =====================================
echo.
echo 📋 Next steps:
echo 1. Configure environment variables in backend\.env
echo 2. Start development servers:
echo    • npm run dev (both servers)
echo    • npm run server (backend only)
echo    • npm run client (frontend only)
echo.
echo 🌐 Access URLs:
echo • Frontend: http://localhost:3000
echo • Admin Panel: http://localhost:3000/admin
echo • Backend API: http://localhost:5000
echo.
echo Press any key to continue...
pause
