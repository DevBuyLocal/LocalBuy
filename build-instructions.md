# LocalBuy APK Generation Guide

## 🎯 Objective
Generate an APK file for LocalBuy with OTA (Over-The-Air) update capabilities for testing.

## 📋 Prerequisites
- Expo CLI installed
- Android Studio (for local builds)
- Valid Expo account (eniola4049)

## 🚀 Method 1: EAS Build (Recommended for OTA)

### Step 1: Create New EAS Project
1. Visit: https://expo.dev/accounts/eniola4049/projects
2. Click "Create a new project"
3. Project name: `localbuy`
4. Copy the generated Project ID

### Step 2: Update Configuration
Edit `app.config.ts` and replace `YOUR_NEW_PROJECT_ID_HERE` with your actual project ID:

```typescript
extra: {
  ...ClientEnv,
  eas: {
    projectId: "your-actual-project-id-from-expo-dashboard",
  },
},
```

### Step 3: Build APK
```bash
npx eas-cli@latest build --platform android --profile staging
```

## 🔧 Method 2: Local Build (Alternative)

### Step 1: Run Build Script
```bash
./scripts/build-apk.sh
```

### Step 2: Manual Local Build
```bash
# Generate Android project
npx expo prebuild --platform android --clear

# Build APK
cd android
./gradlew assembleRelease

# Find APK
find . -name "*.apk" -type f | grep release
```

## 📱 Method 3: Development Build

### Step 1: Install Expo Development Client
```bash
npx create-expo-app --template
```

### Step 2: Generate Development Build
```bash
npx expo run:android --variant release
```

## 🔄 OTA Updates Setup

### Configure Updates in app.config.ts:
```typescript
updates: {
  url: "https://u.expo.dev/[PROJECT-ID]",
  fallbackToCacheTimeout: 0,
},
```

### Publish Updates:
```bash
npx eas update --branch staging --message "Feature update"
```

## 📦 APK Distribution

### For Testing:
1. Upload APK to Firebase App Distribution
2. Share download link with testers
3. Enable automatic updates

### Commands:
```bash
# Upload to Firebase (if configured)
firebase appdistribution:distribute android/app/build/outputs/apk/release/app-release.apk

# Or use direct sharing
adb install app-release.apk
```

## 🐛 Troubleshooting

### EAS Permission Issues:
- Ensure you're logged in: `npx eas-cli whoami`
- Create new project in Expo dashboard
- Update project ID in configuration

### Java Version Issues:
```bash
# Check Java version
java -version

# Install Java 17 (recommended)
brew install openjdk@17
```

### Gradle Issues:
```bash
# Clean and rebuild
cd android
./gradlew clean
./gradlew assembleRelease
```

## 📋 Next Steps After APK Generation

1. **Test the APK** on physical devices
2. **Set up OTA updates** for seamless updates
3. **Configure Firebase** for app distribution
4. **Implement analytics** for tracking usage
5. **Set up CI/CD** for automated builds

## 🔗 Useful Links

- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [OTA Updates Guide](https://docs.expo.dev/eas-update/introduction/)
- [Firebase App Distribution](https://firebase.google.com/docs/app-distribution)
- [Android Release Build](https://docs.expo.dev/build-reference/apk/) 