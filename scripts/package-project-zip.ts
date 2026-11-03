import fs from 'fs';
import path from 'path';
import JSZip from 'jszip';
import { ANDROID_PROJECT_FILES } from '../src/androidProject/androidFiles';

async function generateProjectZip() {
  const rootDir = process.cwd();
  const publicDir = path.join(rootDir, 'public');
  const distDir = path.join(rootDir, 'dist');
  const zip = new JSZip();

  // Add all Android Studio source files
  for (const file of ANDROID_PROJECT_FILES) {
    zip.file(file.path, file.content);
  }

  // Add gradle wrapper
  zip.file(
    'gradle/wrapper/gradle-wrapper.properties',
    `distributionBase=GRADLE_USER_HOME\ndistributionPath=wrapper/dists\ndistributionUrl=https\\://services.gradle.org/distributions/gradle-8.10.2-bin.zip\nnetworkTimeout=10000\nvalidateDistributionUrl=true\n`
  );

  // Add launcher icon
  const iconSource = path.join(publicDir, 'playstore-icon-512.png');
  if (fs.existsSync(iconSource)) {
    const iconBuf = fs.readFileSync(iconSource);
    zip.file('app/src/main/res/mipmap-xxxhdpi/ic_launcher.png', iconBuf);
    zip.file('app/src/main/res/mipmap-xxhdpi/ic_launcher.png', iconBuf);
    zip.file('app/src/main/res/mipmap-xhdpi/ic_launcher.png', iconBuf);
    zip.file('app/src/main/res/mipmap-hdpi/ic_launcher.png', iconBuf);
    zip.file('app/src/main/res/mipmap-mdpi/ic_launcher.png', iconBuf);
  }

  // Generate buffer
  const content = await zip.generateAsync({ type: 'nodebuffer', compression: 'DEFLATE' });
  fs.writeFileSync(path.join(publicDir, 'QuickQR-Android-Project.zip'), content);
  if (fs.existsSync(distDir)) {
    fs.writeFileSync(path.join(distDir, 'QuickQR-Android-Project.zip'), content);
  }
  console.log(`Generated QuickQR-Android-Project.zip (${(content.length / 1024).toFixed(1)} KB)`);
}

generateProjectZip().catch(console.error);
