# APK Signing Setup Documentation

## Overview
This document explains the APK signing setup for DegenCasino production releases. The signing process ensures APK authenticity and enables secure distribution.

## ✅ Setup Complete

### What Was Configured

1. **Keystore Creation** 
   - Generated RSA 2048-bit keystore: `dghrt-keystore.jks`
   - Alias: `dghrt_main_key` 
   - Validity: 10 years (expires 2035-10-08)
   - Organization: "Degen With Heart, DegenCasino"

2. **Android Build Configuration**
   - Added signing configuration to `android/app/build.gradle`
   - Configured gradle.properties with keystore credentials
   - Enabled AndroidX support

3. **Build Scripts**
   - `build-signed-apk.sh` - Builds signed release APK
   - `deploy-production-apk.sh` - Complete deployment workflow  
   - Updated `build-and-deploy-apk.sh` to prefer release builds

4. **Security**
   - Added keystore files to `.gitignore`
   - Credentials stored in local gradle.properties (not committed)

## 📁 File Structure

```
mobile-app/
├── config/
│   ├── create_keystore.sh          # Keystore generation script
│   ├── gradle-properties-template.txt
│   └── keystore-config.json        # Reference configuration
├── build-signed-apk.sh             # 🆕 Signed APK builder
├── deploy-production-apk.sh         # 🆕 Full deployment workflow
└── build/capacitor/android/
    └── gradle.properties            # 🆕 Signing credentials (local only)

dghrt-keystore.jks                   # 🆕 Signing keystore (gitignored)
public/mobile/
└── degencasino-latest.apk          # 🆕 Signed production APK (54MB)
```

## 🚀 Usage

### Quick Production Build
```bash
cd mobile-app
./deploy-production-apk.sh
```

### Manual APK Build
```bash
cd mobile-app
./build-signed-apk.sh
```

### Standard Development Build 
```bash
cd mobile-app
./build-and-deploy-apk.sh  # Now builds signed APK when possible
```

## 📋 Build Process

### Automated Workflow (deploy-production-apk.sh)
1. Verify prerequisites (keystore, Java)
2. Build main web app (`npm run build:compress`)
3. Build signed APK with Capacitor
4. Verify APK signature and size
5. Provide deployment instructions

### APK Build Details (build-signed-apk.sh)
1. Sync Capacitor project
2. Clean previous builds (`./gradlew clean`)
3. Build signed release APK (`./gradlew assembleRelease`)
4. Verify signature with `jarsigner`
5. Deploy to `public/mobile/degencasino-latest.apk`

## 🔒 Security Information

### Keystore Details
- **Algorithm**: RSA 2048-bit
- **Signature**: SHA384withRSA
- **Type**: PKCS12 (Java 9+)
- **Location**: `/Users/degenwithheart/GitHub/DegenCasino/dghrt-keystore.jks`

### Certificate Information
```
CN=Degen With Heart
OU=DegenCasino  
O=BlockchainDev
L=London
ST=England
C=GB
```

### Password Security
- Store password and key password are identical (PKCS12 requirement)
- Credentials stored in local `gradle.properties` only
- **Never commit keystore or passwords to git**

## 📱 APK Information

### Current Production APK
- **Location**: `public/mobile/degencasino-latest.apk`
- **Size**: ~54MB (signed release)
- **Target SDK**: 34 (Android 14)
- **Min SDK**: 24 (Android 7.0)
- **App ID**: `com.degenheart.casino`

### APK Features
- ✅ Signed with production certificate
- ✅ Custom logo icons (all densities)
- ✅ Mobile viewport fixes applied
- ✅ Capacitor v7 with Browser plugin
- ✅ Full DegenCasino web app embedded

## 🔍 Verification

### Check APK Signature
```bash
# Verify signature
jarsigner -verify -verbose -certs public/mobile/degencasino-latest.apk

# Check certificate details  
keytool -printcert -jarfile public/mobile/degencasino-latest.apk
```

### Test Installation
```bash
# Install on connected Android device
adb install public/mobile/degencasino-latest.apk

# Check installed app
adb shell pm list packages | grep degenheart
```

## 🚨 Important Notes

### Certificate Warnings (Normal)
The following warnings are expected for self-signed certificates:
- "certificate chain is invalid" - Expected for self-signed certs
- "signer certificate is self-signed" - Expected for internal distribution  
- "no timestamp" - Optional for APK signing
- Certificate expires in 2035 - Plan renewal before expiry

### Security Best Practices
1. **Keep keystore secure** - Back up `dghrt-keystore.jks` safely
2. **Never commit credentials** - Keystore files are gitignored
3. **Use same keystore** - Always use same keystore for app updates
4. **Monitor expiry** - Certificate expires 2035-10-08

## 🔄 Deployment Workflow

### Production Release Process
1. **Build**: `./deploy-production-apk.sh`
2. **Test**: Install and test APK locally
3. **Commit**: `git add public/mobile/ && git commit -m "Deploy signed APK"`
4. **Deploy**: `git push origin main` (triggers Vercel deployment)
5. **Verify**: Test download from https://degenheart.casino/mobile

### APK URL
- **Production**: `https://degenheart.casino/mobile/degencasino-latest.apk`
- **Mobile App Page**: `https://degenheart.casino/mobile`

## 🆘 Troubleshooting

### Common Issues

**Keystore not found**
```bash
cd mobile-app/config && ./create_keystore.sh
```

**Gradle build fails**
```bash
# Clean and retry
cd mobile-app/build/capacitor/android
./gradlew clean
./gradlew assembleRelease
```

**Java version issues**
```bash
export JAVA_HOME=$(/usr/libexec/java_home -v 21)
```

**APK signature verification fails**
- Ensure keystore passwords match in gradle.properties
- Regenerate keystore if corrupted

### Getting Help
- Check build logs in `mobile-app/build/capacitor/android/`
- Verify Android SDK setup with `npx cap doctor`
- Test with debug build first: `./gradlew assembleDebug`

---

## ✅ Status: Production Ready

The APK signing setup is complete and production-ready. The signed APK is available at `public/mobile/degencasino-latest.apk` and ready for deployment.