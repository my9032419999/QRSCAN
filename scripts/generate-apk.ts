import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

async function buildRealAndroidApk() {
  console.log('=== Building Genuine Android QuickQR APK Package ===');

  const rootDir = process.cwd();
  const buildDir = path.join(rootDir, 'android-build');
  const publicDir = path.join(rootDir, 'public');
  const distDir = path.join(rootDir, 'dist');
  const keystorePath = path.join(rootDir, 'release.keystore');

  // Clean previous APKs so Vite build does not copy them into dist
  fs.rmSync(path.join(publicDir, 'QuickQR.apk'), { force: true });
  fs.rmSync(path.join(publicDir, 'QuickQR-v1.0.0.apk'), { force: true });
  if (fs.existsSync(distDir)) {
    fs.rmSync(distDir, { recursive: true, force: true });
  }

  // 1. Ensure production web assets are built
  console.log('Step 1: Building production web assets (Vite)...');
  execSync('npm run build', { stdio: 'inherit' });

  // 2. Prepare build directory structure
  console.log('Step 2: Preparing Android APK packaging workspace...');
  if (fs.existsSync(buildDir)) {
    fs.rmSync(buildDir, { recursive: true, force: true });
  }
  fs.mkdirSync(buildDir, { recursive: true });

  const srcDir = path.join(buildDir, 'src/com/jagadeesh/quickqr');
  const classesDir = path.join(buildDir, 'classes');
  const resDir = path.join(buildDir, 'res');
  const valuesDir = path.join(resDir, 'values');
  const mipmapHdpi = path.join(resDir, 'mipmap-hdpi');
  const mipmapXhdpi = path.join(resDir, 'mipmap-xhdpi');
  const mipmapXxhdpi = path.join(resDir, 'mipmap-xxhdpi');
  const mipmapXxxhdpi = path.join(resDir, 'mipmap-xxxhdpi');
  const assetsDir = path.join(buildDir, 'assets/www');

  fs.mkdirSync(srcDir, { recursive: true });
  fs.mkdirSync(classesDir, { recursive: true });
  fs.mkdirSync(valuesDir, { recursive: true });
  fs.mkdirSync(mipmapHdpi, { recursive: true });
  fs.mkdirSync(mipmapXhdpi, { recursive: true });
  fs.mkdirSync(mipmapXxhdpi, { recursive: true });
  fs.mkdirSync(mipmapXxxhdpi, { recursive: true });
  fs.mkdirSync(assetsDir, { recursive: true });

  // 3. Copy production web assets to assets/www (excluding any existing APK archives)
  console.log('Step 3: Copying web assets to APK assets/www...');
  execSync(`cp -r ${distDir}/* ${assetsDir}/`);
  execSync(`find ${assetsDir} -name "*.apk" -delete 2>/dev/null || true`);

  // 4. Create AndroidManifest.xml
  console.log('Step 4: Creating AndroidManifest.xml...');
  const manifestContent = `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.jagadeesh.quickqr"
    android:versionCode="2"
    android:versionName="1.0.1">

    <uses-sdk
        android:minSdkVersion="24"
        android:targetSdkVersion="34" />

    <uses-permission android:name="android.permission.CAMERA" />
    <uses-permission android:name="android.permission.VIBRATE" />
    <uses-permission android:name="android.permission.FLASHLIGHT" />
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

    <uses-feature android:name="android.hardware.camera" android:required="false" />
    <uses-feature android:name="android.hardware.camera.autofocus" android:required="false" />
    <uses-feature android:name="android.hardware.camera.flash" android:required="false" />

    <application
        android:label="@string/app_name"
        android:icon="@mipmap/ic_launcher"
        android:theme="@android:style/Theme.NoTitleBar"
        android:hardwareAccelerated="true">
        <activity
            android:name="com.jagadeesh.quickqr.MainActivity"
            android:label="@string/app_name"
            android:configChanges="orientation|screenSize|keyboardHidden"
            android:windowSoftInputMode="adjustResize"
            android:exported="true">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>`;
  fs.writeFileSync(path.join(buildDir, 'AndroidManifest.xml'), manifestContent);

  // 5. Create strings.xml
  fs.writeFileSync(
    path.join(valuesDir, 'strings.xml'),
    `<?xml version="1.0" encoding="utf-8"?>\n<resources>\n    <string name="app_name">QuickQR</string>\n</resources>`
  );

  // 6. Copy App Launcher Icons (Using 1:1 Square QuickQR App Logo)
  console.log('Step 5: Setting up app icons...');
  const iconSource = path.join(rootDir, 'src/assets/quickqr-logo.png');
  if (fs.existsSync(iconSource)) {
    fs.copyFileSync(iconSource, path.join(mipmapHdpi, 'ic_launcher.png'));
    fs.copyFileSync(iconSource, path.join(mipmapXhdpi, 'ic_launcher.png'));
    fs.copyFileSync(iconSource, path.join(mipmapXxhdpi, 'ic_launcher.png'));
    fs.copyFileSync(iconSource, path.join(mipmapXxxhdpi, 'ic_launcher.png'));
  }

  // 7. Write MainActivity.java (Native WebView with CameraX / WebRTC permission bridging)
  console.log('Step 6: Writing MainActivity.java...');
  const javaCode = `package com.jagadeesh.quickqr;

import android.app.Activity;
import android.os.Bundle;
import android.os.Build;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.webkit.WebChromeClient;
import android.webkit.PermissionRequest;
import android.webkit.WebSettings;
import android.view.Window;
import android.view.WindowManager;
import android.content.pm.PackageManager;
import android.Manifest;
import android.graphics.Color;
import android.content.Intent;
import android.net.Uri;

public class MainActivity extends Activity {
    private WebView mWebView;

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        requestWindowFeature(Window.FEATURE_NO_TITLE);
        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP) {
            Window window = getWindow();
            window.addFlags(WindowManager.LayoutParams.FLAG_DRAWS_SYSTEM_BAR_BACKGROUNDS);
            window.setStatusBarColor(0xFF0877ED);
        }

        if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.M) {
            if (checkSelfPermission(Manifest.permission.CAMERA) != PackageManager.PERMISSION_GRANTED) {
                requestPermissions(new String[]{
                    Manifest.permission.CAMERA,
                    Manifest.permission.VIBRATE
                }, 101);
            }
        }

        mWebView = new WebView(this);
        mWebView.setBackgroundColor(0xFF0A0F1D);

        WebSettings settings = mWebView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        settings.setAllowFileAccessFromFileURLs(true);
        settings.setAllowUniversalAccessFromFileURLs(true);
        settings.setMediaPlaybackRequiresUserGesture(false);
        settings.setUseWideViewPort(true);
        settings.setLoadWithOverviewMode(true);
        settings.setSupportZoom(false);
        settings.setBuiltInZoomControls(false);
        settings.setDisplayZoomControls(false);

        mWebView.setWebChromeClient(new WebChromeClient() {
            @Override
            public void onPermissionRequest(final PermissionRequest request) {
                runOnUiThread(new Runnable() {
                    @Override
                    public void run() {
                        request.grant(request.getResources());
                    }
                });
            }
        });

        mWebView.setWebViewClient(new WebViewClient() {
            @Override
            public boolean shouldOverrideUrlLoading(WebView view, String url) {
                if (url.startsWith("file://") || url.startsWith("data:") || url.startsWith("blob:")) {
                    return false;
                }
                try {
                    Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                    startActivity(intent);
                    return true;
                } catch (Exception e) {
                    return false;
                }
            }
        });

        setContentView(mWebView);
        mWebView.loadUrl("file:///android_asset/www/index.html");
    }

    @Override
    public void onBackPressed() {
        if (mWebView != null && mWebView.canGoBack()) {
            mWebView.goBack();
        } else {
            super.onBackPressed();
        }
    }
}
`;
  fs.writeFileSync(path.join(srcDir, 'MainActivity.java'), javaCode);

  // 8. Compile Java source to class files
  console.log('Step 7: Compiling Java source with javac...');
  const androidJar = '/usr/lib/android-sdk/platforms/android-23/android.jar';
  execSync(`javac -source 8 -target 8 -bootclasspath ${androidJar} -d ${classesDir} ${path.join(srcDir, 'MainActivity.java')}`);

  // 9. Convert classes to Dalvik DEX format using dx
  console.log('Step 8: Converting to classes.dex with dx...');
  const dxBinary = '/usr/lib/android-sdk/build-tools/debian/dx';
  execSync(`${dxBinary} --dex --output=${path.join(buildDir, 'classes.dex')} ${classesDir}`);

  // 10. Package resources and assets using AAPT
  console.log('Step 9: Packaging binary resources and assets with aapt...');
  const unalignedApk = path.join(buildDir, 'QuickQR.unaligned.apk');
  execSync(`aapt package -f -M ${path.join(buildDir, 'AndroidManifest.xml')} -S ${resDir} -A ${path.join(buildDir, 'assets')} -I ${androidJar} -F ${unalignedApk}`);

  // 11. Add classes.dex into APK
  console.log('Step 10: Adding classes.dex into APK archive...');
  execSync(`cd ${buildDir} && aapt add QuickQR.unaligned.apk classes.dex`);

  // 12. 4-byte Zipalign
  console.log('Step 11: Aligning APK with zipalign...');
  const alignedApk = path.join(buildDir, 'QuickQR.aligned.apk');
  execSync(`zipalign -v -p 4 ${unalignedApk} ${alignedApk}`);

  // 13. Create Release Keystore if needed
  if (!fs.existsSync(keystorePath)) {
    console.log('Step 12: Generating release keystore...');
    execSync(`keytool -genkeypair -v -keystore ${keystorePath} -storepass quickqr123 -alias quickqr -keypass quickqr123 -keyalg RSA -keysize 2048 -validity 10000 -dname "CN=Jagadeesh, OU=QuickQR, O=QuickQR, L=Bangalore, ST=Karnataka, C=IN"`);
  }

  // 14. Sign APK with apksigner (v1 + v2 + v3 scheme)
  console.log('Step 13: Signing APK with apksigner (v1 + v2 + v3)...');
  const finalApk = path.join(publicDir, 'QuickQR.apk');
  execSync(`apksigner sign --v1-signing-enabled true --v2-signing-enabled true --v3-signing-enabled true --ks ${keystorePath} --ks-pass pass:quickqr123 --key-pass pass:quickqr123 --out ${finalApk} ${alignedApk}`);

  // 15. Create copies for alternate download routes
  const versionedApk = path.join(publicDir, 'QuickQR-v1.0.0.apk');
  const versionedApk101 = path.join(publicDir, 'QuickQR-v1.0.1.apk');
  fs.copyFileSync(finalApk, versionedApk);
  fs.copyFileSync(finalApk, versionedApk101);
  fs.copyFileSync(finalApk, path.join(distDir, 'QuickQR.apk'));
  fs.copyFileSync(finalApk, path.join(distDir, 'QuickQR-v1.0.0.apk'));
  fs.copyFileSync(finalApk, path.join(distDir, 'QuickQR-v1.0.1.apk'));

  // 16. Verify APK integrity
  console.log('Step 14: Verifying APK signature and package info...');
  const verifyOutput = execSync(`apksigner verify --verbose ${finalApk}`).toString();
  console.log(verifyOutput.trim());

  const stat = fs.statSync(finalApk);
  console.log(`\n========================================`);
  console.log(`APK BUILD SUCCESSFUL!`);
  console.log(`Package: com.jagadeesh.quickqr`);
  console.log(`File: ${finalApk}`);
  console.log(`Size: ${(stat.size / (1024 * 1024)).toFixed(2)} MB (${stat.size.toLocaleString()} bytes)`);
  console.log(`========================================\n`);
}

buildRealAndroidApk().catch((err) => {
  console.error('APK Build failed:', err);
  process.exit(1);
});
