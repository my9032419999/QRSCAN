import React, { useState } from 'react';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { 
  Download, 
  FolderTree, 
  FileCode, 
  FileText, 
  Copy, 
  Check, 
  ExternalLink, 
  CheckCircle2, 
  Layers, 
  Cpu, 
  Smartphone,
  ShieldCheck,
  Terminal,
  BookOpen
} from 'lucide-react';
import { ANDROID_PROJECT_FILES, AndroidProjectFile } from '../androidProject/androidFiles';
import { Translations } from '../utils/translations';
import { downloadQuickQrApk, QUICKQR_APK_INFO } from '../utils/apkBuilder';

interface AndroidProjectScreenProps {
  t: Translations;
}

export const AndroidProjectScreen: React.FC<AndroidProjectScreenProps> = ({ t }) => {
  const [selectedFile, setSelectedFile] = useState<AndroidProjectFile>(ANDROID_PROJECT_FILES[3]); // AndroidManifest.xml by default
  const [copied, setCopied] = useState(false);
  const [isExportingZip, setIsExportingZip] = useState(false);
  const [isDownloadingApk, setIsDownloadingApk] = useState(false);
  const [apkDownloaded, setApkDownloaded] = useState(false);
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const categories = [
    { id: 'all', label: 'All Files' },
    { id: 'kotlin', label: 'Kotlin (MVVM)' },
    { id: 'gradle', label: 'Gradle Build' },
    { id: 'manifest', label: 'Manifest' },
    { id: 'res', label: 'Resources & Strings' },
    { id: 'docs', label: 'Guides & Checklist' },
  ];

  const filteredFiles = ANDROID_PROJECT_FILES.filter(
    (f) => filterCategory === 'all' || f.category === filterCategory
  );

  const handleCopyCode = () => {
    navigator.clipboard.writeText(selectedFile.content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownloadApk = async () => {
    setIsDownloadingApk(true);
    try {
      await downloadQuickQrApk('QuickQR-v1.0.0.apk');
      setApkDownloaded(true);
      setTimeout(() => setApkDownloaded(false), 3000);
    } catch (err) {
      console.error('Failed to download APK', err);
    } finally {
      setIsDownloadingApk(false);
    }
  };

  // 1-Click ZIP generation and download
  const handleDownloadZip = async () => {
    setIsExportingZip(true);
    try {
      const zip = new JSZip();

      // Add project files to zip
      ANDROID_PROJECT_FILES.forEach((file) => {
        zip.file(file.path, file.content);
      });

      // Add gradle wrapper properties
      zip.file(
        'gradle/wrapper/gradle-wrapper.properties',
        `distributionBase=GRADLE_USER_HOME
distributionPath=wrapper/dists
distributionUrl=https\\://services.gradle.org/distributions/gradle-8.10.2-bin.zip
networkTimeout=10000
validateDistributionUrl=true
`
      );

      // Add gradlew and gradlew.bat stubs
      zip.file('gradlew', '#!/usr/bin/env sh\nexec gradle "$@"\n', { unixPermissions: '755' });
      zip.file('gradlew.bat', '@rem Gradle execution script\r\n@gradle %*\r\n');

      // Generate zip archive
      const content = await zip.generateAsync({ type: 'blob' });
      saveAs(content, 'QuickQR-Android-Project.zip');
    } catch (err) {
      console.error('Failed to create ZIP', err);
      alert('Error creating zip bundle. You can copy the files directly from the code viewer.');
    } finally {
      setIsExportingZip(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-4 space-y-4 pb-28">
      {/* Header Banner */}
      <div className="bg-gradient-to-tr from-[#0877ED] to-[#00B8D9] rounded-2xl p-5 text-white shadow-lg shadow-[#0877ED]/20 relative overflow-hidden">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center space-x-1.5 bg-white/20 px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider w-fit mb-2">
              <Smartphone className="w-3 h-3" />
              <span>Native Android APK & Source</span>
            </div>
            <h2 className="text-xl font-extrabold leading-tight">
              QuickQR Android Application
            </h2>
            <p className="text-xs text-white/90 mt-1 max-w-xs">
              Directly installable APK package and full Kotlin Jetpack Compose source code with CameraX & ML Kit.
            </p>
          </div>
        </div>

        {/* 2-Column Action Buttons: APK & Project ZIP */}
        <div className="grid grid-cols-2 gap-2 mt-4">
          {/* Download APK Button */}
          <button
            onClick={handleDownloadApk}
            disabled={isDownloadingApk}
            className="py-3 px-2 bg-white text-[#0877ED] hover:bg-white/95 active:scale-[0.98] font-extrabold text-xs rounded-xl flex items-center justify-center space-x-1.5 shadow-md transition disabled:opacity-50"
          >
            {apkDownloaded ? (
              <>
                <Check className="w-4 h-4 text-emerald-600" />
                <span>APK Saved!</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4 text-[#0877ED]" />
                <span>{isDownloadingApk ? 'Downloading APK...' : 'Download APK (v1.0.1)'}</span>
              </>
            )}
          </button>

          {/* Download Source ZIP Button */}
          <button
            onClick={handleDownloadZip}
            disabled={isExportingZip}
            className="py-3 px-2 bg-white/20 hover:bg-white/30 active:scale-[0.98] text-white font-extrabold text-xs rounded-xl flex items-center justify-center space-x-1.5 backdrop-blur-md transition disabled:opacity-50 border border-white/25"
          >
            <Download className="w-4 h-4" />
            <span>{isExportingZip ? 'Packing...' : 'Source (.zip)'}</span>
          </button>
        </div>
      </div>

      {/* APK Specifications Card */}
      <div className="bg-white dark:bg-[#131E32] rounded-2xl p-4 border border-slate-100 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-slate-800 dark:text-white flex items-center space-x-1.5">
            <Smartphone className="w-4 h-4 text-[#0877ED]" />
            <span>QuickQR APK Release Info</span>
          </h3>
          <span className="text-[10px] bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-bold px-2 py-0.5 rounded-full flex items-center space-x-1">
            <CheckCircle2 className="w-3 h-3" />
            <span>Signed v1+v2+v3 (9.4 MB)</span>
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
            <p className="text-[10px] text-slate-400 font-medium">Package ID</p>
            <p className="font-mono font-bold text-slate-800 dark:text-white truncate text-[11px] mt-0.5">
              {QUICKQR_APK_INFO.packageName}
            </p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
            <p className="text-[10px] text-slate-400 font-medium">App Version</p>
            <p className="font-mono font-bold text-slate-800 dark:text-white text-[11px] mt-0.5">
              v{QUICKQR_APK_INFO.versionName} (Build {QUICKQR_APK_INFO.versionCode})
            </p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
            <p className="text-[10px] text-slate-400 font-medium">Target SDK</p>
            <p className="font-semibold text-slate-800 dark:text-white text-[11px] mt-0.5">
              Android 13 - 15 (API {QUICKQR_APK_INFO.targetSdkVersion}+)
            </p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-900/60 p-2.5 rounded-xl border border-slate-100 dark:border-slate-800">
            <p className="text-[10px] text-slate-400 font-medium">Min Android</p>
            <p className="font-semibold text-slate-800 dark:text-white text-[11px] mt-0.5">
              Android 5.0+ (API {QUICKQR_APK_INFO.minSdkVersion})
            </p>
          </div>
        </div>

        {/* Installation Instructions */}
        <div className="bg-blue-50 dark:bg-blue-950/40 p-3 rounded-xl border border-blue-100 dark:border-blue-900/40 text-[11px] space-y-1.5 text-blue-900 dark:text-blue-200">
          <p className="font-bold flex items-center space-x-1">
            <Terminal className="w-3.5 h-3.5 text-[#0877ED]" />
            <span>How to Install on Android Device:</span>
          </p>
          <p className="leading-relaxed text-[11px] text-blue-800 dark:text-blue-300">
            1. Tap <b>Download APK</b> above to get <code>QuickQR-v1.0.1.apk</code>.<br />
            2. Open your phone's <b>Downloads</b> or Files app and tap the file.<br />
            3. If Google Play Protect shows a prompt, tap <b>"Install anyway"</b>.<br />
            4. If prompted by your browser, toggle <b>"Allow from this source"</b> and tap <b>Install</b>!
          </p>
        </div>
      </div>

      {/* Highlights Grid */}
      <div className="grid grid-cols-2 gap-2 text-xs">
        <div className="p-3 bg-white dark:bg-[#131E32] rounded-xl border border-slate-100 dark:border-slate-800">
          <p className="font-bold text-[#0877ED] flex items-center space-x-1">
            <Cpu className="w-3.5 h-3.5" />
            <span>Modern Tech Stack</span>
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">Compose BOM 2024, Material 3, SDK 35</p>
        </div>
        <div className="p-3 bg-white dark:bg-[#131E32] rounded-xl border border-slate-100 dark:border-slate-800">
          <p className="font-bold text-emerald-600 flex items-center space-x-1">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Offline ML Kit</span>
          </p>
          <p className="text-[11px] text-slate-500 mt-0.5">On-device CameraX Barcode Scanner</p>
        </div>
      </div>

      {/* Category Filter Pills */}
      <div className="flex space-x-1.5 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((c) => (
          <button
            key={c.id}
            onClick={() => setFilterCategory(c.id)}
            className={`px-3 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition ${
              filterCategory === c.id
                ? 'bg-[#0877ED] text-white shadow-xs'
                : 'bg-white dark:bg-[#131E32] text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
            }`}
          >
            {c.label}
          </button>
        ))}
      </div>

      {/* Project File Tree Carousel */}
      <div className="bg-white dark:bg-[#131E32] rounded-2xl p-4 border border-slate-100 dark:border-slate-800 shadow-sm space-y-3">
        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center space-x-1.5">
          <FolderTree className="w-4 h-4 text-[#0877ED]" />
          <span>Project Files ({filteredFiles.length})</span>
        </h3>

        <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
          {filteredFiles.map((file) => {
            const isSelected = selectedFile.path === file.path;
            return (
              <button
                key={file.path}
                onClick={() => setSelectedFile(file)}
                className={`w-full p-2.5 rounded-xl text-left flex items-start space-x-2.5 transition text-xs ${
                  isSelected
                    ? 'bg-[#0877ED]/10 border border-[#0877ED]/30 text-[#0877ED]'
                    : 'hover:bg-slate-50 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                }`}
              >
                {file.category === 'docs' ? (
                  <FileText className="w-4 h-4 flex-shrink-0 mt-0.5 text-amber-500" />
                ) : (
                  <FileCode className="w-4 h-4 flex-shrink-0 mt-0.5 text-[#0877ED]" />
                )}
                <div className="overflow-hidden">
                  <p className="font-mono font-semibold truncate">{file.path}</p>
                  <p className="text-[10px] text-slate-400 truncate">{file.description}</p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected File Code Viewer */}
      <div className="bg-slate-900 rounded-2xl overflow-hidden border border-slate-800 shadow-lg text-slate-200">
        <div className="px-4 py-3 bg-slate-950/80 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2 overflow-hidden">
            <FileCode className="w-4 h-4 text-[#00B8D9] flex-shrink-0" />
            <span className="text-xs font-mono font-bold text-white truncate">
              {selectedFile.path}
            </span>
          </div>

          <button
            onClick={handleCopyCode}
            className="flex items-center space-x-1 px-2.5 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg text-xs font-medium transition"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied' : 'Copy'}</span>
          </button>
        </div>

        <pre className="p-4 text-xs font-mono overflow-x-auto max-h-80 leading-relaxed text-slate-300">
          <code>{selectedFile.content}</code>
        </pre>
      </div>

      {/* Build Quick Steps */}
      <div className="bg-white dark:bg-[#131E32] rounded-2xl p-4 border border-slate-100 dark:border-slate-800 shadow-sm space-y-2.5">
        <h4 className="text-xs font-bold text-slate-800 dark:text-white flex items-center space-x-1.5">
          <BookOpen className="w-4 h-4 text-[#0877ED]" />
          <span>Quick Build Guide</span>
        </h4>
        <ol className="text-xs text-slate-600 dark:text-slate-300 space-y-1.5 list-decimal list-inside leading-relaxed">
          <li>Download the ZIP above and extract the folder.</li>
          <li>Open <strong>Android Studio</strong> &gt; <strong>Open</strong> &gt; select the folder.</li>
          <li>Wait for Gradle Sync to complete.</li>
          <li>Press <strong>Shift + F10</strong> to run on phone or emulator.</li>
          <li>For signed release: <strong>Build &gt; Generate Signed Bundle / APK</strong>.</li>
        </ol>
      </div>
    </div>
  );
};
