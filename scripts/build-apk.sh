#!/bin/bash

echo "🚀 Starting LocalBuy APK Build Process..."
echo "📅 Build Date: $(date)"

# Step 1: Clean and reset
echo "🧹 Cleaning project..."
rm -rf node_modules pnpm-lock.yaml
pnpm store prune

# Step 2: Install dependencies with pnpm
echo "📦 Installing dependencies..."
pnpm install

# Step 3: Generate Android project
echo "📱 Generating Android native project..."
pnpm expo prebuild --platform android --clear

# Step 4: Try to build APK with different Java versions
echo "🔨 Building APK..."

# Try to use a compatible Java version
export JAVA_HOME=$(/usr/libexec/java_home -v 17 2>/dev/null || /usr/libexec/java_home -v 11 2>/dev/null || /usr/libexec/java_home)

if [ -z "$JAVA_HOME" ]; then
    echo "❌ No compatible Java version found. Trying with system Java..."
    JAVA_HOME=$(/usr/libexec/java_home)
fi

echo "📋 Using Java: $JAVA_HOME"

cd android

# Try to build with the available Java version
if ./gradlew assembleDebug --no-daemon; then
    echo "✅ Debug APK built successfully!"
    APK_PATH=$(find . -name "*.apk" -type f | grep debug | head -1)
else
    echo "❌ Debug build failed, trying release build..."
    if ./gradlew assembleRelease --no-daemon; then
        echo "✅ Release APK built successfully!"
        APK_PATH=$(find . -name "*.apk" -type f | grep release | head -1)
    else
        echo "❌ Both debug and release builds failed"
        exit 1
    fi
fi

# Step 5: Find and copy APK
echo "📦 Locating APK file..."

if [ -n "$APK_PATH" ]; then
    echo "✅ APK built successfully!"
    echo "📍 APK Location: $APK_PATH"
    
    # Copy to root directory with timestamp
    TIMESTAMP=$(date +"%Y%m%d_%H%M%S")
    cp "$APK_PATH" "../LocalBuy_${TIMESTAMP}.apk"
    echo "📋 Copied to: LocalBuy_${TIMESTAMP}.apk"
    
    # Show file size
    echo "📏 APK Size: $(ls -lh "../LocalBuy_${TIMESTAMP}.apk" | awk '{print $5}')"
else
    echo "❌ APK build failed or not found"
    echo "📋 Checking for build errors..."
    ls -la app/build/outputs/apk/ 2>/dev/null || echo "No APK directory found"
fi

cd ..
echo "🎉 Build process completed!"
echo ""
echo "📲 To install on device:"
echo "   adb install LocalBuy_*.apk"
echo ""
echo "🔄 For OTA updates, use EAS Update:"
echo "   npx eas-cli@latest update --channel staging" 