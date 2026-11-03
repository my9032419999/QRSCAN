export interface AndroidProjectFile {
  path: string;
  category: 'manifest' | 'gradle' | 'kotlin' | 'res' | 'docs';
  description: string;
  content: string;
}

export const ANDROID_PROJECT_FILES: AndroidProjectFile[] = [
  {
    path: 'build.gradle.kts',
    category: 'gradle',
    description: 'Root Gradle build configuration file',
    content: `// Top-level build file where you can add configuration options common to all sub-projects/modules.
plugins {
    alias(libs.plugins.android.application) apply false
    alias(libs.plugins.kotlin.android) apply false
    alias(libs.plugins.kotlin.compose) apply false
    alias(libs.plugins.ksp) apply false
}
`
  },
  {
    path: 'settings.gradle.kts',
    category: 'gradle',
    description: 'Gradle repository and project settings',
    content: `pluginManagement {
    repositories {
        google {
            content {
                includeGroupByRegex("com\\\\.android.*")
                includeGroupByRegex("com\\\\.google.*")
                includeGroupByRegex("androidx.*")
            }
        }
        mavenCentral()
        gradlePluginPortal()
    }
}
dependencyResolutionManagement {
    repositoriesMode.set(RepositoriesMode.FAIL_ON_PROJECT_REPOS)
    repositories {
        google()
        mavenCentral()
    }
}

rootProject.name = "QuickQR"
include(":app")
`
  },
  {
    path: 'app/build.gradle.kts',
    category: 'gradle',
    description: 'App-level build configuration with Compose, CameraX, ML Kit, Room & AdMob',
    content: `plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
    id("org.jetbrains.kotlin.plugin.compose")
    id("com.google.devtools.ksp")
}

android {
    namespace = "com.jagadeesh.quickqr"
    compileSdk = 35

    defaultConfig {
        applicationId = "com.jagadeesh.quickqr"
        minSdk = 26
        targetSdk = 35
        versionCode = 1
        versionName = "1.0.0"

        testInstrumentationRunner = "androidx.test.runner.AndroidJUnitRunner"
        vectorDrawables {
            useSupportLibrary = true
        }

        // AdMob Official Sample App ID for testing
        manifestPlaceholders["admobAppId"] = "ca-app-pub-3940256099942544~3347511713"
    }

    buildTypes {
        release {
            isMinifyEnabled = true
            isShrinkResources = true
            proguardFiles(
                getDefaultProguardFile("proguard-android-optimize.txt"),
                "proguard-rules.pro"
            )
            signingConfig = signingConfigs.getByName("debug") // Replace with production release keystore
        }
        debug {
            applicationIdSuffix = ".debug"
            isDebuggable = true
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions {
        jvmTarget = "17"
    }
    buildFeatures {
        compose = true
        buildConfig = true
    }
    packaging {
        resources {
            excludes += "/META-INF/{AL2.0,LGPL2.1}"
        }
    }
}

dependencies {
    // AndroidX & Core
    implementation("androidx.core:core-ktx:1.15.0")
    implementation("androidx.lifecycle:lifecycle-runtime-ktx:2.8.7")
    implementation("androidx.activity:activity-compose:1.9.3")

    // Jetpack Compose & Material 3
    implementation(platform("androidx.compose:compose-bom:2024.11.00"))
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.ui:ui-graphics")
    implementation("androidx.compose.ui:ui-tooling-preview")
    implementation("androidx.compose.material3:material3:1.3.1")
    implementation("androidx.compose.material:material-icons-extended")
    implementation("androidx.navigation:navigation-compose:2.8.4")

    // CameraX for high-performance live scanning
    val cameraxVersion = "1.4.0"
    implementation("androidx.camera:camera-core:$cameraxVersion")
    implementation("androidx.camera:camera-camera2:$cameraxVersion")
    implementation("androidx.camera:camera-lifecycle:$cameraxVersion")
    implementation("androidx.camera:camera-view:$cameraxVersion")

    // Google ML Kit Barcode Scanning (On-Device, Offline)
    implementation("com.google.mlkit:barcode-scanning:17.3.0")

    // ZXing for high-speed local QR code generation
    implementation("com.google.zxing:core:3.5.3")

    // Room Database (Local Offline Storage)
    val roomVersion = "2.6.1"
    implementation("androidx.room:room-runtime:$roomVersion")
    implementation("androidx.room:room-ktx:$roomVersion")
    ksp("androidx.room:room-compiler:$roomVersion")

    // Google Mobile Ads (AdMob) & UMP SDK
    implementation("com.google.android.gms:play-services-ads:23.5.0")
    implementation("com.google.android.ump:user-messaging-platform:3.1.0")

    // Google Play In-App Billing (Pro Mode ₹149 / $5)
    implementation("com.android.billingclient:billing-ktx:7.1.1")

    // Coroutines & Lifecycle ViewModel
    implementation("org.jetbrains.kotlinx:kotlinx-coroutines-android:1.9.0")
    implementation("androidx.lifecycle:lifecycle-viewmodel-compose:2.8.7")

    // Unit Testing
    testImplementation("junit:junit:4.13.2")
    androidTestImplementation("androidx.test.ext:junit:1.2.1")
    androidTestImplementation("androidx.test.espresso:espresso-core:3.6.1")
}
`
  },
  {
    path: 'app/src/main/AndroidManifest.xml',
    category: 'manifest',
    description: 'Android Manifest with Camera permission, vibration, and AdMob metadata',
    content: `<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    xmlns:tools="http://schemas.android.com/tools">

    <!-- Camera permission for live scanning -->
    <uses-permission android:name="android.permission.CAMERA" />
    <uses-feature
        android:name="android.hardware.camera"
        android:required="false" />
    <uses-feature
        android:name="android.hardware.camera.autofocus"
        android:required="false" />
    <uses-feature
        android:name="android.hardware.camera.flash"
        android:required="false" />

    <!-- Vibration for scan feedback -->
    <uses-permission android:name="android.permission.VIBRATE" />

    <!-- Optional Internet for AdMob and opening external links in browser -->
    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />

    <application
        android:name=".QuickQRApp"
        android:allowBackup="false"
        android:dataExtractionRules="@xml/data_extraction_rules"
        android:fullBackupContent="false"
        android:icon="@mipmap/ic_launcher"
        android:label="@string/app_name"
        android:roundIcon="@mipmap/ic_launcher_round"
        android:supportsRtl="true"
        android:theme="@style/Theme.QuickQR"
        tools:targetApi="35">

        <!-- Google AdMob Application ID -->
        <meta-data
            android:name="com.google.android.gms.ads.APPLICATION_ID"
            android:value="ca-app-pub-3940256099942544~3347511713" />

        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:theme="@style/Theme.QuickQR"
            android:screenOrientation="portrait"
            android:configChanges="orientation|screenSize|screenLayout|keyboardHidden">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>

        <!-- FileProvider for secure sharing of QR PNGs and CSV exports -->
        <provider
            android:name="androidx.core.content.FileProvider"
            android:authorities="\${applicationId}.fileprovider"
            android:exported="false"
            android:grantUriPermissions="true">
            <meta-data
                android:name="android.support.FILE_PROVIDER_PATHS"
                android:resource="@xml/file_paths" />
        </provider>
    </application>
</manifest>
`
  },
  {
    path: 'app/src/main/res/values/strings.xml',
    category: 'res',
    description: 'English localized strings for QuickQR',
    content: `<resources>
    <string name="app_name">QuickQR</string>
    <string name="app_title">QuickQR – QR &amp; Barcode Scanner</string>
    <string name="app_tagline">Scan Fast. Create Easy.</string>
    <string name="developer_credit">Designed by Jagadeesh</string>

    <!-- Navigation -->
    <string name="nav_home">Home</string>
    <string name="nav_scan">Scan</string>
    <string name="nav_create">Create</string>
    <string name="nav_history">History</string>
    <string name="nav_settings">Settings</string>

    <!-- Dashboard -->
    <string name="btn_scan_qr">Scan QR Code</string>
    <string name="btn_scan_barcode">Scan Barcode</string>
    <string name="btn_generate_qr">Generate QR Code</string>
    <string name="btn_scan_gallery">Scan From Gallery</string>
    <string name="quick_tools">Quick Tools</string>
    <string name="my_qr_codes">My QR Codes</string>
    <string name="scan_history">Scan History</string>
    <string name="share_app">Share App</string>
    <string name="recent_scans">Recently Scanned</string>
    <string name="no_recent_scans">No scans yet. Start scanning now!</string>

    <!-- Scanner -->
    <string name="scanner_hint">Align QR code or barcode inside the frame</string>
    <string name="scanner_torch">Flashlight</string>
    <string name="scanner_gallery">Gallery</string>
    <string name="scanner_continuous">Continuous Scan</string>
    <string name="permission_camera_title">Camera Permission Needed</string>
    <string name="permission_camera_desc">QuickQR needs camera access to scan QR codes and barcodes live. No images are uploaded to any server.</string>
    <string name="permission_grant">Grant Access</string>

    <!-- Results & Actions -->
    <string name="result_title">Scan Result</string>
    <string name="action_open_url">Open Website</string>
    <string name="action_call">Call Phone</string>
    <string name="action_sms">Send SMS</string>
    <string name="action_email">Send Email</string>
    <string name="action_contacts">Add to Contacts</string>
    <string name="action_maps">Open in Maps</string>
    <string name="action_wifi">Connect Wi-Fi</string>
    <string name="action_product_search">Search Product</string>
    <string name="action_copy">Copy</string>
    <string name="action_share">Share</string>
    <string name="action_favorite">Favorite</string>
    <string name="warning_unsafe_url">Warning: Verify external destination before proceeding.</string>

    <!-- Settings -->
    <string name="settings_language">Language</string>
    <string name="settings_theme">Theme</string>
    <string name="settings_vibration">Vibration on Scan</string>
    <string name="settings_beep">Beep Sound on Scan</string>
    <string name="settings_auto_copy">Auto-Copy Scanned Result</string>
    <string name="settings_continuous">Continuous Scan Mode</string>
    <string name="settings_clear_data">Clear All Local Data</string>
    <string name="settings_privacy_policy">Privacy Policy</string>
    <string name="settings_terms">Terms &amp; Conditions</string>
    <string name="settings_about">About QuickQR</string>
</resources>
`
  },
  {
    path: 'app/src/main/res/values-te/strings.xml',
    category: 'res',
    description: 'Telugu (తెలుగు) localized strings for QuickQR',
    content: `<resources>
    <string name="app_name">క్విక్ క్యూఆర్</string>
    <string name="app_title">క్విక్ క్యూఆర్ – క్యూఆర్ &amp; బార్‌కోడ్ స్కానర్</string>
    <string name="app_tagline">వేగంగా స్కాన్ చేయండి. సులభంగా సృష్టించండి.</string>
    <string name="developer_credit">జగదీష్ చే రూపొందించబడింది</string>

    <!-- Navigation -->
    <string name="nav_home">హోమ్</string>
    <string name="nav_scan">స్కాన్</string>
    <string name="nav_create">సృష్టించండి</string>
    <string name="nav_history">చరిత్ర</string>
    <string name="nav_settings">సెట్టింగ్‌లు</string>

    <!-- Dashboard -->
    <string name="btn_scan_qr">క్యూఆర్ కోడ్ స్కాన్ చేయండి</string>
    <string name="btn_scan_barcode">బార్‌కోడ్ స్కాన్ చేయండి</string>
    <string name="btn_generate_qr">క్యూఆర్ కోడ్ సృష్టించండి</string>
    <string name="btn_scan_gallery">గ్యాలరీ నుండి స్కాన్</string>
    <string name="quick_tools">త్వరిత సాధనాలు</string>
    <string name="my_qr_codes">నా క్యూఆర్ కోడ్‌లు</string>
    <string name="scan_history">స్కాన్ చరిత్ర</string>
    <string name="share_app">యాప్ షేర్ చేయండి</string>
    <string name="recent_scans">ఇటీవల స్కాన్ చేసినవి</string>
    <string name="no_recent_scans">ఇంకా స్కాన్‌లు లేవు. ఇప్పుడే ప్రారంభించండి!</string>

    <!-- Scanner -->
    <string name="scanner_hint">ఫ్రేమ్ లోపల క్యూఆర్ లేదా బార్‌కోడ్ అమర్చండి</string>
    <string name="scanner_torch">ఫ్లాష్‌లైట్</string>
    <string name="scanner_gallery">గ్యాలరీ</string>
    <string name="scanner_continuous">నిరంతర స్కాన్</string>
    <string name="permission_camera_title">కెమెరా అనుమతి అవసరం</string>
    <string name="permission_camera_desc">కోడ్‌లను స్కాన్ చేయడానికి క్విక్ క్యూఆర్‌కు కెమెరా అనుమతి అవసరం. మీ డేటా మీ ఫోన్‌లో మాత్రమే ఉంటుంది.</string>
    <string name="permission_grant">అనుమతి ఇవ్వండి</string>

    <!-- Results & Actions -->
    <string name="result_title">స్కాన్ ఫలితం</string>
    <string name="action_open_url">వెబ్‌సైట్ తెరవండి</string>
    <string name="action_call">డయలర్ తెరవండి</string>
    <string name="action_sms">ఎస్ఎంఎస్ పంపండి</string>
    <string name="action_email">ఈమెయిల్ పంపండి</string>
    <string name="action_contacts">కాంటాక్ట్‌గా సేవ్ చేయండి</string>
    <string name="action_maps">మ్యాప్స్‌లో తెరవండి</string>
    <string name="action_wifi">వై-ఫై కనెక్ట్ చేయండి</string>
    <string name="action_product_search">ఉత్పత్తిని వెతకండి</string>
    <string name="action_copy">కాపీ</string>
    <string name="action_share">షేర్</string>
    <string name="action_favorite">ఇష్టమైనవి</string>
    <string name="warning_unsafe_url">హెచ్చరిక: తెరవడానికి ముందు ఈ లింక్‌ను నిర్ధారించుకోండి.</string>

    <!-- Settings -->
    <string name="settings_language">భాష</string>
    <string name="settings_theme">థీమ్</string>
    <string name="settings_vibration">స్కాన్ వైబ్రేషన్</string>
    <string name="settings_beep">స్కాన్ బీప్ ధ్వని</string>
    <string name="settings_auto_copy">స్వయంచాలకంగా కాపీ</string>
    <string name="settings_continuous">నిరంతర స్కానింగ్ మోడ్</string>
    <string name="settings_clear_data">అన్ని డేటాను తొలగించండి</string>
    <string name="settings_privacy_policy">గోప్యతా విధానం</string>
    <string name="settings_terms">నిబంధనలు &amp; షరతులు</string>
    <string name="settings_about">క్విక్ క్యూఆర్ గురించి</string>
</resources>
`
  },
  {
    path: 'app/src/main/res/values/colors.xml',
    category: 'res',
    description: 'Material 3 Color resources',
    content: `<resources>
    <color name="primary">#0877ED</color>
    <color name="secondary">#00B8D9</color>
    <color name="background_light">#F5F8FF</color>
    <color name="surface_light">#FFFFFF</color>
    <color name="background_dark">#0B111E</color>
    <color name="surface_dark">#131E32</color>
</resources>
`
  },
  {
    path: 'app/src/main/java/com/jagadeesh/quickqr/QuickQRApp.kt',
    category: 'kotlin',
    description: 'Application class with Google Mobile Ads initialization',
    content: `package com.jagadeesh.quickqr

import android.app.Application
import com.google.android.gms.ads.MobileAds
import com.google.android.gms.ads.RequestConfiguration

/**
 * QuickQR Application Entry Point
 * Designed by Jagadeesh
 */
class QuickQRApp : Application() {
    override fun onCreate() {
        super.onCreate()
        
        // Initialize Google Mobile Ads SDK with test device configuration
        MobileAds.initialize(this) {
            // Initialization complete
        }

        // Set test device ID configuration for development safety
        val configuration = RequestConfiguration.Builder()
            .setTestDeviceIds(listOf(RequestConfiguration.DEVICE_ID_EMULATOR))
            .build()
        MobileAds.setRequestConfiguration(configuration)
    }
}
`
  },
  {
    path: 'app/src/main/java/com/jagadeesh/quickqr/MainActivity.kt',
    category: 'kotlin',
    description: 'Main Jetpack Compose Activity with Navigation & Edge-to-Edge display',
    content: `package com.jagadeesh.quickqr

import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.enableEdgeToEdge
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.*
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.navigation.compose.rememberNavController
import com.jagadeesh.quickqr.navigation.AppNavGraph
import com.jagadeesh.quickqr.ui.components.QuickQRBottomBar
import com.jagadeesh.quickqr.ui.theme.QuickQRTheme

class MainActivity : ComponentActivity() {
    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        enableEdgeToEdge()
        setContent {
            QuickQRTheme {
                val navController = rememberNavController()
                Scaffold(
                    modifier = Modifier.fillMaxSize(),
                    bottomBar = {
                        QuickQRBottomBar(navController = navController)
                    }
                ) { innerPadding ->
                    AppNavGraph(
                        navController = navController,
                        modifier = Modifier.padding(innerPadding)
                    )
                }
            }
        }
    }
}
`
  },
  {
    path: 'app/src/main/java/com/jagadeesh/quickqr/data/local/ScanResultEntity.kt',
    category: 'kotlin',
    description: 'Room Database Entity for local scan records',
    content: `package com.jagadeesh.quickqr.data.local

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "scan_results")
data class ScanResultEntity(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0,
    val rawValue: String,
    val format: String,
    val contentType: String,
    val title: String,
    val timestamp: Long = System.currentTimeMillis(),
    val isFavorite: Boolean = false
)
`
  },
  {
    path: 'app/src/main/java/com/jagadeesh/quickqr/data/local/SavedQrEntity.kt',
    category: 'kotlin',
    description: 'Room Database Entity for user-created QR codes',
    content: `package com.jagadeesh.quickqr.data.local

import androidx.room.Entity
import androidx.room.PrimaryKey

@Entity(tableName = "saved_qr_codes")
data class SavedQrEntity(
    @PrimaryKey(autoGenerate = true)
    val id: Long = 0,
    val title: String,
    val content: String,
    val type: String,
    val foregroundColor: Int,
    val backgroundColor: Int,
    val errorCorrection: String,
    val createdAt: Long = System.currentTimeMillis(),
    val isFavorite: Boolean = false
)
`
  },
  {
    path: 'app/src/main/java/com/jagadeesh/quickqr/data/local/ScanDao.kt',
    category: 'kotlin',
    description: 'Room DAO for scan history queries and operations',
    content: `package com.jagadeesh.quickqr.data.local

import androidx.room.*
import kotlinx.coroutines.flow.Flow

@Dao
interface ScanDao {
    @Query("SELECT * FROM scan_results ORDER BY timestamp DESC")
    fun getAllScans(): Flow<List<ScanResultEntity>>

    @Query("SELECT * FROM scan_results ORDER BY timestamp DESC LIMIT 10")
    fun getRecentScans(): Flow<List<ScanResultEntity>>

    @Query("SELECT * FROM scan_results WHERE isFavorite = 1 ORDER BY timestamp DESC")
    fun getFavorites(): Flow<List<ScanResultEntity>>

    @Insert(onConflict = OnConflictStrategy.REPLACE)
    suspend fun insertScan(scan: ScanResultEntity): Long

    @Update
    suspend fun updateScan(scan: ScanResultEntity)

    @Delete
    suspend fun deleteScan(scan: ScanResultEntity)

    @Query("DELETE FROM scan_results")
    suspend fun clearAll()
}
`
  },
  {
    path: 'app/src/main/java/com/jagadeesh/quickqr/data/local/QuickQRDatabase.kt',
    category: 'kotlin',
    description: 'Room Database definition with thread-safe singleton',
    content: `package com.jagadeesh.quickqr.data.local

import android.content.Context
import androidx.room.Database
import androidx.room.Room
import androidx.room.RoomDatabase

@Database(entities = [ScanResultEntity::class, SavedQrEntity::class], version = 1, exportSchema = false)
abstract class QuickQRDatabase : RoomDatabase() {
    abstract fun scanDao(): ScanDao
    abstract fun savedQrDao(): SavedQrDao

    companion object {
        @Volatile
        private var INSTANCE: QuickQRDatabase? = null

        fun getDatabase(context: Context): QuickQRDatabase {
            return INSTANCE ?: synchronized(this) {
                val instance = Room.databaseBuilder(
                    context.applicationContext,
                    QuickQRDatabase::class.java,
                    "quickqr_database.db"
                ).build()
                INSTANCE = instance
                instance
            }
        }
    }
}
`
  },
  {
    path: 'app/src/main/java/com/jagadeesh/quickqr/scanner/BarcodeAnalyzer.kt',
    category: 'kotlin',
    description: 'CameraX ImageAnalysis analyzer using Google ML Kit Barcode Scanner',
    content: `package com.jagadeesh.quickqr.scanner

import androidx.annotation.OptIn
import androidx.camera.core.ExperimentalGetImage
import androidx.camera.core.ImageAnalysis
import androidx.camera.core.ImageProxy
import com.google.mlkit.vision.barcode.BarcodeScannerOptions
import com.google.mlkit.vision.barcode.BarcodeScanning
import com.google.mlkit.vision.barcode.common.Barcode
import com.google.mlkit.vision.common.InputImage

class BarcodeAnalyzer(
    private val onBarcodeDetected: (Barcode) -> Unit
) : ImageAnalysis.Analyzer {

    // Configure ML Kit to detect all standard 1D & 2D formats
    private val options = BarcodeScannerOptions.Builder()
        .setBarcodeFormats(
            Barcode.FORMAT_QR_CODE,
            Barcode.FORMAT_EAN_13,
            Barcode.FORMAT_EAN_8,
            Barcode.FORMAT_UPC_A,
            Barcode.FORMAT_UPC_E,
            Barcode.FORMAT_CODE_128,
            Barcode.FORMAT_CODE_39,
            Barcode.FORMAT_CODE_93,
            Barcode.FORMAT_ITF,
            Barcode.FORMAT_CODABAR,
            Barcode.FORMAT_PDF417,
            Barcode.FORMAT_DATA_MATRIX,
            Barcode.FORMAT_AZTEC
        )
        .build()

    private val scanner = BarcodeScanning.getClient(options)
    private var isScanning = true

    fun pause() { isScanning = false }
    fun resume() { isScanning = true }

    @OptIn(ExperimentalGetImage::class)
    override fun analyze(imageProxy: ImageProxy) {
        val mediaImage = imageProxy.image
        if (mediaImage != null && isScanning) {
            val image = InputImage.fromMediaImage(mediaImage, imageProxy.imageInfo.rotationDegrees)
            scanner.process(image)
                .addOnSuccessListener { barcodes ->
                    if (barcodes.isNotEmpty()) {
                        onBarcodeDetected(barcodes.first())
                    }
                }
                .addOnCompleteListener {
                    imageProxy.close()
                }
        } else {
            imageProxy.close()
        }
    }
}
`
  },
  {
    path: 'app/src/main/java/com/jagadeesh/quickqr/generator/QrCodeGenerator.kt',
    category: 'kotlin',
    description: 'ZXing-based Bitmap QR code generator with custom colors and logo support',
    content: `package com.jagadeesh.quickqr.generator

import android.graphics.Bitmap
import android.graphics.Canvas
import android.graphics.Color
import com.google.zxing.BarcodeFormat
import com.google.zxing.EncodeHintType
import com.google.zxing.qrcode.QRCodeWriter
import com.google.zxing.qrcode.decoder.ErrorCorrectionLevel
import java.util.EnumMap

object QrCodeGenerator {
    /**
     * Generates a high-quality QR code Bitmap locally with custom colors and error correction
     */
    fun generateQrBitmap(
        content: String,
        width: Int = 800,
        height: Int = 800,
        foregroundColor: Int = Color.parseColor("#0877ED"),
        backgroundColor: Int = Color.WHITE,
        errorCorrection: ErrorCorrectionLevel = ErrorCorrectionLevel.H,
        centerLogo: Bitmap? = null
    ): Bitmap {
        val hints = EnumMap<EncodeHintType, Any>(EncodeHintType::class.java).apply {
            put(EncodeHintType.CHARACTER_SET, "UTF-8")
            put(EncodeHintType.MARGIN, 2)
            put(EncodeHintType.ERROR_CORRECTION, errorCorrection)
        }

        val writer = QRCodeWriter()
        val bitMatrix = writer.encode(content, BarcodeFormat.QR_CODE, width, height, hints)
        val bitmap = Bitmap.createBitmap(width, height, Bitmap.Config.ARGB_8888)

        for (x in 0 until width) {
            for (y in 0 until height) {
                bitmap.setPixel(x, y, if (bitMatrix.get(x, y)) foregroundColor else backgroundColor)
            }
        }

        // Overlay center logo safely if provided
        centerLogo?.let { logo ->
            val canvas = Canvas(bitmap)
            val logoSize = (width * 0.22f).toInt()
            val scaledLogo = Bitmap.createScaledBitmap(logo, logoSize, logoSize, true)
            val left = (width - logoSize) / 2f
            val top = (height - logoSize) / 2f
            canvas.drawBitmap(scaledLogo, left, top, null)
        }

        return bitmap
    }
}
`
  },
  {
    path: 'app/src/main/java/com/jagadeesh/quickqr/ads/AdMobBanner.kt',
    category: 'kotlin',
    description: 'AdMob Adaptive Banner Compose Component conforming to Google Play policies',
    content: `package com.jagadeesh.quickqr.ads

import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.viewinterop.AndroidView
import com.google.android.gms.ads.AdRequest
import com.google.android.gms.ads.AdSize
import com.google.android.gms.ads.AdView

/**
 * Standard AdMob Banner Composable using official test unit ID
 */
@Composable
fun AdMobBanner(
    modifier: Modifier = Modifier,
    adUnitId: String = "ca-app-pub-3940256099942544/6300978111" // Official Google Test Banner ID
) {
    AndroidView(
        modifier = modifier.fillMaxWidth(),
        factory = { context ->
            AdView(context).apply {
                setAdSize(AdSize.BANNER)
                this.adUnitId = adUnitId
                loadAd(AdRequest.Builder().build())
            }
        }
    )
}
`
  },
  {
    path: 'app/src/main/java/com/jagadeesh/quickqr/billing/BillingManager.kt',
    category: 'kotlin',
    description: 'Google Play In-App Billing Client manager for Pro mode (₹149 / $5)',
    content: `package com.jagadeesh.quickqr.billing

import android.app.Activity
import android.content.Context
import com.android.billingclient.api.*
import kotlinx.coroutines.CoroutineScope
import kotlinx.coroutines.Dispatchers
import kotlinx.coroutines.flow.MutableStateFlow
import kotlinx.coroutines.flow.StateFlow
import kotlinx.coroutines.flow.asStateFlow
import kotlinx.coroutines.launch

/**
 * Google Play In-App Billing Manager
 * Handles Pro mode lifetime purchase (₹149 in India / $5.00 International)
 * Designed by Jagadeesh
 */
class BillingManager(
    private val context: Context,
    private val scope: CoroutineScope
) : PurchasesUpdatedListener {

    companion object {
        const val PRODUCT_ID_PRO_MONTHLY = "quickqr_pro_monthly"
    }

    private val _isProUser = MutableStateFlow(false)
    val isProUser: StateFlow<Boolean> = _isProUser.asStateFlow()

    private val _proProductDetails = MutableStateFlow<ProductDetails?>(null)
    val proProductDetails: StateFlow<ProductDetails?> = _proProductDetails.asStateFlow()

    private val billingClient = BillingClient.newBuilder(context)
        .setListener(this)
        .enablePendingPurchases(
            PendingPurchasesParams.newBuilder()
                .enableOneTimeProducts()
                .build()
        )
        .build()

    fun startBillingConnection() {
        billingClient.startConnection(object : BillingClientStateListener {
            override fun onBillingSetupFinished(billingResult: BillingResult) {
                if (billingResult.responseCode == BillingClient.BillingResponseCode.OK) {
                    queryProSubscriptionDetails()
                    restorePurchases()
                }
            }

            override fun onBillingServiceDisconnected() {
                // Auto reconnect on subsequent user interaction
            }
        })
    }

    private fun queryProSubscriptionDetails() {
        val queryProductList = listOf(
            QueryProductDetailsParams.Product.newBuilder()
                .setProductId(PRODUCT_ID_PRO_MONTHLY)
                .setProductType(BillingClient.ProductType.SUBS)
                .build()
        )

        val params = QueryProductDetailsParams.newBuilder()
            .setProductList(queryProductList)
            .build()

        billingClient.queryProductDetailsAsync(params) { billingResult, productDetailsList ->
            if (billingResult.responseCode == BillingClient.BillingResponseCode.OK) {
                val proProduct = productDetailsList.firstOrNull { it.productId == PRODUCT_ID_PRO_MONTHLY }
                _proProductDetails.value = proProduct
            }
        }
    }

    fun launchPurchaseFlow(activity: Activity) {
        val details = _proProductDetails.value ?: return
        val offerToken = details.subscriptionOfferDetails?.firstOrNull()?.offerToken ?: ""

        val productDetailsParamsList = listOf(
            BillingFlowParams.ProductDetailsParams.newBuilder()
                .setProductDetails(details)
                .setOfferToken(offerToken)
                .build()
        )

        val billingFlowParams = BillingFlowParams.newBuilder()
            .setProductDetailsParamsList(productDetailsParamsList)
            .build()

        billingClient.launchBillingFlow(activity, billingFlowParams)
    }

    override fun onPurchasesUpdated(billingResult: BillingResult, purchases: List<Purchase>?) {
        if (billingResult.responseCode == BillingClient.BillingResponseCode.OK && purchases != null) {
            for (purchase in purchases) {
                handlePurchase(purchase)
            }
        }
    }

    private fun handlePurchase(purchase: Purchase) {
        if (purchase.purchaseState == Purchase.PurchaseState.PURCHASED) {
            if (!purchase.isAcknowledged) {
                val acknowledgePurchaseParams = AcknowledgePurchaseParams.newBuilder()
                    .setPurchaseToken(purchase.purchaseToken)
                    .build()
                scope.launch(Dispatchers.IO) {
                    billingClient.acknowledgePurchase(acknowledgePurchaseParams) { ackResult ->
                        if (ackResult.responseCode == BillingClient.BillingResponseCode.OK) {
                            _isProUser.value = true
                        }
                    }
                }
            } else {
                _isProUser.value = true
            }
        }
    }

    fun restorePurchases() {
        val params = QueryPurchasesParams.newBuilder()
            .setProductType(BillingClient.ProductType.SUBS)
            .build()

        billingClient.queryPurchasesAsync(params) { billingResult, purchases ->
            if (billingResult.responseCode == BillingClient.BillingResponseCode.OK) {
                val hasPro = purchases.any { purchase ->
                    purchase.products.contains(PRODUCT_ID_PRO_MONTHLY) &&
                    purchase.purchaseState == Purchase.PurchaseState.PURCHASED
                }
                _isProUser.value = hasPro
            }
        }
    }
}
`
  },
  {
    path: 'BUILD_INSTRUCTIONS.md',
    category: 'docs',
    description: 'Step-by-step instructions for Android Studio compilation, APK & AAB generation',
    content: `# QuickQR – Android Studio Build Instructions

Designed by Jagadeesh
Application Name: QuickQR – QR & Barcode Scanner

## Prerequisites
1. **Android Studio**: Android Studio Ladybug (2024.2.1) or newer.
2. **JDK**: Java Development Kit 17 or 21.
3. **Android SDK**: Android SDK 35 (API 35), Min SDK 26 (Android 8.0).

## Opening the Project
1. Extract or clone this repository.
2. Open Android Studio.
3. Click **Open** and select the root directory containing \`settings.gradle.kts\`.
4. Allow Gradle sync to download dependencies (CameraX, ML Kit, ZXing, Room, Material 3, Play Services Ads).

## Running in Debug Mode
1. Connect an Android phone with USB debugging enabled, or launch an Android Virtual Device (AVD).
2. Select the \`app\` run configuration.
3. Click the green **Run** button (Shift + F10).

## Building a Release APK
1. In Android Studio, go to **Build** > **Build Bundle(s) / APK(s)** > **Build APK(s)**.
2. The generated APK will be in \`app/build/outputs/apk/release/app-release-unsigned.apk\`.

## Building a Signed Android App Bundle (AAB) for Google Play
1. Go to **Build** > **Generate Signed Bundle / APK...**.
2. Select **Android App Bundle** and click Next.
3. Create or specify your Key store path, keystore password, key alias, and key password.
4. Select build variant \`release\` and click **Create**.
5. The signed \`.aab\` bundle will be generated under \`app/release/app-release.aab\`, ready for Google Play Console upload!
`
  },
  {
    path: 'GOOGLE_PLAY_PREPARATION.md',
    category: 'docs',
    description: 'Google Play Store metadata, content rating, and Data Safety declaration',
    content: `# Google Play Store Preparation Guide

## App Information
- **Title**: QuickQR – QR & Barcode Scanner
- **Short Description**: Scan QR codes and barcodes fast. Create, save and share QR codes easily.
- **Category**: Tools / Productivity
- **Content Rating**: Everyone (PEGI 3)

## Data Safety Declaration
- **Data Collected**: None by the app core.
- **Offline First**: All scans and generated QR codes are stored locally in the on-device Room SQLite database.
- **Third-Party SDKs**: Google Mobile Ads SDK (AdMob) processes advertising IDs and crash diagnostic metrics in accordance with Google Play developer policies.

## Google Play Subscriptions (Pro Mode Monthly Auto-Renewing)
- **Product ID**: \`quickqr_pro_monthly\`
- **Product Type**: Auto-renewing subscription (\`BillingClient.ProductType.SUBS\`)
- **Billing Period**: Monthly (1 month recurring)
- **Auto Location & Currency Pricing**:
  - **India**: ₹149.00 INR / month (Base Plan ID: \`monthly-inr\`)
  - **United States & Global**: $5.00 USD / month (Base Plan ID: \`monthly-usd\`)
  - **Eurozone**: €4.99 EUR / month (Base Plan ID: \`monthly-eur\`)
  - **United Kingdom**: £4.49 GBP / month (Base Plan ID: \`monthly-gbp\`)
  - Google Play Store automatically detects the user's localized billing account country, presents their native currency symbol, and applies local taxes automatically.
- **Benefits**:
  - Complete AdMob ads removal (no banner ads, no interstitial ads)
  - Unlimited continuous batch scanning
  - High-resolution 4K and SVG QR code exports with custom logos
- **Google Play Billing Library**: v7.1.1 (\`com.android.billingclient:billing-ktx:7.1.1\`)
- **Play Console Setup**:
  1. Open Google Play Console > **Monetize with Play** > **Subscriptions**.
  2. Click **Create subscription**.
  3. Enter Product ID: \`quickqr_pro_monthly\`.
  4. Name: \`QuickQR Pro Monthly Ad-Free\`.
  5. Description: \`Unlock 100% ad-free experience, unlimited batch scanning, and 4K exports.\`.
  6. Add Base Plan: Monthly Auto-Renewing. Set regional pricing: ₹149 in India, $5.00 in US/Global.
  7. Activate the base plan and subscription!

## Feature Graphic Specs
- **Dimensions**: 1024 x 500 px PNG/JPEG
- **Theme**: Blue (#0877ED) to Cyan (#00B8D9) gradient with glowing scanner brackets, white QR code, and "QuickQR - Scan Fast. Create Easy." tagline.
`
  }
];
