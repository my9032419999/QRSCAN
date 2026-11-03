export type Language = 'en' | 'te';

export interface Translations {
  appName: string;
  shortName: string;
  tagline: string;
  developerCredit: string;
  developerName: string;

  // Nav
  navHome: string;
  navScan: string;
  navCreate: string;
  navHistory: string;
  navSettings: string;
  navAndroidProject: string;

  // Home
  scanQrCode: string;
  scanBarcode: string;
  generateQrCode: string;
  scanFromGallery: string;
  quickTools: string;
  myQrCodes: string;
  scanHistory: string;
  shareApp: string;
  recentScans: string;
  noRecentScans: string;
  tapToScan: string;
  instantDetection: string;
  exportProject: string;
  viewSourceCode: string;

  // Scanner
  alignInFrame: string;
  scanning: string;
  flash: string;
  beepSound: string;
  vibration: string;
  pinchZoom: string;
  cameraPermissionNeeded: string;
  grantCamera: string;
  cameraError: string;
  uploadImage: string;
  dragOrChooseImage: string;
  continuousMode: string;
  pausedOnResult: string;
  resumeScan: string;

  // Result
  scanResult: string;
  codeType: string;
  scannedAt: string;
  content: string;
  openWebsite: string;
  unsafeUrlWarning: string;
  proceedWithCaution: string;
  callPhone: string;
  sendSms: string;
  sendEmail: string;
  addToContacts: string;
  openMaps: string;
  connectWifi: string;
  copyPassword: string;
  wifiDetails: string;
  productSearch: string;
  copyText: string;
  share: string;
  copiedToClipboard: string;
  savedToHistory: string;
  favorited: string;
  unfavorited: string;
  deleteEntry: string;
  rescan: string;

  // Generator
  createQrCode: string;
  selectType: string;
  typeUrl: string;
  typeText: string;
  typeWifi: string;
  typePhone: string;
  typeSms: string;
  typeEmail: string;
  typeContact: string;
  typeLocation: string;
  typeEvent: string;
  
  // Generator Form fields
  urlPlaceholder: string;
  textPlaceholder: string;
  ssidLabel: string;
  wifiPasswordLabel: string;
  encryptionLabel: string;
  hiddenNetwork: string;
  phoneNumberLabel: string;
  smsMessageLabel: string;
  emailToLabel: string;
  emailSubjectLabel: string;
  emailBodyLabel: string;
  contactNameLabel: string;
  contactOrgLabel: string;
  latitudeLabel: string;
  longitudeLabel: string;
  eventTitleLabel: string;
  eventStartLabel: string;
  eventLocationLabel: string;

  // Customization
  customizeQr: string;
  foregroundColor: string;
  backgroundColor: string;
  errorCorrection: string;
  includeCenterLogo: string;
  downloadPng: string;
  downloadSvg: string;
  saveToMyQr: string;
  qrSavedSuccess: string;
  preview: string;

  // History
  historyTitle: string;
  searchHistoryPlaceholder: string;
  filterAll: string;
  filterQr: string;
  filterBarcode: string;
  filterFavorites: string;
  sortNewest: string;
  sortOldest: string;
  exportCsv: string;
  clearHistory: string;
  clearHistoryConfirmTitle: string;
  clearHistoryConfirmText: string;
  cancel: string;
  confirmClear: string;
  noHistoryFound: string;

  // Saved QR
  savedCodesTitle: string;
  renameQr: string;
  deleteQr: string;
  noSavedCodes: string;

  // Pro Mode & Google Play Billing
  proBadge: string;
  normalBadge: string;
  proTitle: string;
  proSubtitle: string;
  upgradeToPro: string;
  proPriceInr: string;
  proPriceUsd: string;
  priceIndiaLabel: string;
  priceGlobalLabel: string;
  oneTimePayment: string;
  monthlySubscription: string;
  perMonthLabel: string;
  autoLocationDetected: string;
  detectLocationGps: string;
  adsFreeFeature: string;
  unlimitedScanFeature: string;
  premiumQrExport: string;
  googlePlayBillingDesc: string;
  buyWithGooglePlay: string;
  restorePurchases: string;
  currentPlan: string;
  proActivated: string;
  normalModeActive: string;
  toggleProModeForTesting: string;
  purchasedSuccess: string;
  restoredSuccess: string;

  // Settings
  settingsTitle: string;
  languageSetting: string;
  themeSetting: string;
  themeLight: string;
  themeDark: string;
  themeSystem: string;
  scannerVibration: string;
  scannerBeep: string;
  autoCopyResult: string;
  continuousScanSetting: string;
  defaultFlashlight: string;
  privacyPolicy: string;
  termsConditions: string;
  rateApp: string;
  aboutApp: string;
  admobTestBanner: string;
  admobNotice: string;
  offlineFirstNotice: string;
  action_favorite: string;
  settings_clear_data: string;
}

export const englishTranslations: Translations = {
  appName: 'QuickQR – QR & Barcode Scanner',
  shortName: 'QuickQR',
  tagline: 'Scan Fast. Create Easy.',
  developerCredit: 'Designed by Jagadeesh',
  developerName: 'Jagadeesh',

  navHome: 'Home',
  navScan: 'Scan',
  navCreate: 'Create',
  navHistory: 'History',
  navSettings: 'Settings',
  navAndroidProject: 'Android Project',

  scanQrCode: 'Scan QR Code',
  scanBarcode: 'Scan Barcode',
  generateQrCode: 'Generate QR Code',
  scanFromGallery: 'Scan From Gallery',
  quickTools: 'Quick Tools',
  myQrCodes: 'My QR Codes',
  scanHistory: 'Scan History',
  shareApp: 'Share App',
  recentScans: 'Recently Scanned',
  noRecentScans: 'No scans yet. Tap below to scan your first code!',
  tapToScan: 'Tap to scan instantly',
  instantDetection: 'Instant on-device detection with ML Kit & CameraX',
  exportProject: 'Android Studio Source Code',
  viewSourceCode: 'Explore & Download Android Project',

  alignInFrame: 'Align QR code or barcode inside the frame',
  scanning: 'Scanning actively...',
  flash: 'Flashlight',
  beepSound: 'Beep Sound',
  vibration: 'Vibration',
  pinchZoom: 'Zoom Control',
  cameraPermissionNeeded: 'Camera Permission Required',
  grantCamera: 'Allow Camera Access',
  cameraError: 'Camera is unavailable. You can also pick an image from your gallery.',
  uploadImage: 'Upload Image to Scan',
  dragOrChooseImage: 'Click or drop a barcode/QR image here',
  continuousMode: 'Continuous Scan',
  pausedOnResult: 'Result Detected (Paused)',
  resumeScan: 'Resume Scanning',

  scanResult: 'Scan Result',
  codeType: 'Format',
  scannedAt: 'Scanned Time',
  content: 'Decoded Content',
  openWebsite: 'Open Website',
  unsafeUrlWarning: 'Security Notice: Verify this destination before opening',
  proceedWithCaution: 'External URL Warning',
  callPhone: 'Open Dialer',
  sendSms: 'Compose SMS',
  sendEmail: 'Compose Email',
  addToContacts: 'Save Contact (.vcf)',
  openMaps: 'Open in Maps',
  connectWifi: 'Wi-Fi Network',
  copyPassword: 'Copy Password',
  wifiDetails: 'Wi-Fi Configuration',
  productSearch: 'Search Product Online',
  copyText: 'Copy Content',
  share: 'Share',
  copiedToClipboard: 'Copied to clipboard!',
  savedToHistory: 'Saved to local history',
  favorited: 'Added to favorites',
  unfavorited: 'Removed from favorites',
  deleteEntry: 'Delete Entry',
  rescan: 'Scan Again',

  createQrCode: 'Create QR Code',
  selectType: 'Select Content Type',
  typeUrl: 'Website URL',
  typeText: 'Plain Text',
  typeWifi: 'Wi-Fi Network',
  typePhone: 'Phone Number',
  typeSms: 'SMS Message',
  typeEmail: 'Email',
  typeContact: 'Contact Card',
  typeLocation: 'Location',
  typeEvent: 'Calendar Event',

  urlPlaceholder: 'https://example.com',
  textPlaceholder: 'Enter any text, note, or code...',
  ssidLabel: 'Network SSID (Name)',
  wifiPasswordLabel: 'Password',
  encryptionLabel: 'Security Type',
  hiddenNetwork: 'Hidden Network',
  phoneNumberLabel: 'Phone number (e.g. +91 9876543210)',
  smsMessageLabel: 'Pre-filled message text',
  emailToLabel: 'Recipient Email Address',
  emailSubjectLabel: 'Subject line',
  emailBodyLabel: 'Email message body',
  contactNameLabel: 'Full Name',
  contactOrgLabel: 'Company / Organization',
  latitudeLabel: 'Latitude (e.g. 17.3850)',
  longitudeLabel: 'Longitude (e.g. 78.4867)',
  eventTitleLabel: 'Event Title',
  eventStartLabel: 'Start Date & Time',
  eventLocationLabel: 'Location or Venue',

  customizeQr: 'Customize Appearance',
  foregroundColor: 'QR Color',
  backgroundColor: 'Background Color',
  errorCorrection: 'Error Correction Level',
  includeCenterLogo: 'Include QuickQR Center Logo',
  downloadPng: 'Download High-Res PNG',
  downloadSvg: 'Download Vector SVG',
  saveToMyQr: 'Save to My QR Codes',
  qrSavedSuccess: 'QR Code saved to My QR Codes!',
  preview: 'Live Preview',

  historyTitle: 'Scan History',
  searchHistoryPlaceholder: 'Search scanned items...',
  filterAll: 'All',
  filterQr: 'QR Codes',
  filterBarcode: 'Barcodes',
  filterFavorites: 'Favorites',
  sortNewest: 'Newest First',
  sortOldest: 'Oldest First',
  exportCsv: 'Export CSV',
  clearHistory: 'Clear History',
  clearHistoryConfirmTitle: 'Clear All History?',
  clearHistoryConfirmText: 'This will permanently remove all scanned records from local storage. This action cannot be undone.',
  cancel: 'Cancel',
  confirmClear: 'Clear All',
  noHistoryFound: 'No scan records found.',

  savedCodesTitle: 'My Saved QR Codes',
  renameQr: 'Rename QR',
  deleteQr: 'Delete',
  noSavedCodes: 'No created QR codes yet. Create your first custom QR code now!',

  // Pro Mode & Google Play Billing
  proBadge: 'PRO',
  normalBadge: 'FREE',
  proTitle: 'QuickQR Pro',
  proSubtitle: '100% Ad-Free Experience & Unlimited Premium Tools',
  upgradeToPro: 'Upgrade to Pro',
  proPriceInr: '₹149',
  proPriceUsd: '$5.00',
  priceIndiaLabel: 'India Plan (Auto-detected)',
  priceGlobalLabel: 'Global Plan',
  oneTimePayment: 'Monthly subscription · Cancel anytime in Google Play Store',
  monthlySubscription: 'Monthly subscription · Cancel anytime in Google Play Store',
  perMonthLabel: '/month',
  autoLocationDetected: 'Location & Currency Auto-Detected',
  detectLocationGps: 'Auto-Detect Currency via Timezone / GPS',
  adsFreeFeature: '100% Ad-Free: Removes all banners, interstitials & demo ads',
  unlimitedScanFeature: 'Fast Continuous Batch Scanning & Unlimited Saves',
  premiumQrExport: 'High-Res 4K Vector/PNG Exports & Custom Center Logos',
  googlePlayBillingDesc: 'Official Google Play Monthly Subscription with 100% buyer protection',
  buyWithGooglePlay: 'Subscribe with Google Play',
  restorePurchases: 'Restore Google Play Purchases',
  currentPlan: 'Membership Status',
  proActivated: 'PRO Active · 100% Ad-Free (Monthly Subscription)',
  normalModeActive: 'Normal Mode (Ad-Supported)',
  toggleProModeForTesting: 'Switch Pro / Normal Mode (Demo)',
  purchasedSuccess: 'Welcome to QuickQR Pro! Your monthly subscription is now active with all ads removed.',
  restoredSuccess: 'Google Play subscription restored! Pro features unlocked.',

  settingsTitle: 'Settings',
  languageSetting: 'App Language',
  themeSetting: 'Theme Mode',
  themeLight: 'Light Theme',
  themeDark: 'Dark Theme',
  themeSystem: 'System Default',
  scannerVibration: 'Haptic Vibration on Scan',
  scannerBeep: 'Audio Beep Chime on Scan',
  autoCopyResult: 'Auto-Copy Decoded Text',
  continuousScanSetting: 'Continuous Scanning Mode',
  defaultFlashlight: 'Start Camera with Flashlight',
  privacyPolicy: 'Privacy Policy',
  termsConditions: 'Terms & Conditions',
  rateApp: 'Rate QuickQR',
  aboutApp: 'About QuickQR',
  admobTestBanner: 'AdMob Test Advertisement Banner',
  admobNotice: 'Google AdMob Test Unit: ca-app-pub-3940256099942544/6300978111 (Compliant placement)',
  offlineFirstNotice: '100% Offline-First. Your scans and QR data are stored securely on your device only.',
  action_favorite: 'Favorite',
  settings_clear_data: 'Clear All Saved Data'
};

export const teluguTranslations: Translations = {
  appName: 'క్విక్ క్యూఆర్ – క్యూఆర్ & బార్‌కోడ్ స్కానర్',
  shortName: 'క్విక్ క్యూఆర్',
  tagline: 'వేగంగా స్కాన్ చేయండి. సులభంగా సృష్టించండి.',
  developerCredit: 'జగదీష్ చే రూపొందించబడింది',
  developerName: 'జగదీష్',

  navHome: 'హోమ్',
  navScan: 'స్కాన్',
  navCreate: 'సృష్టించండి',
  navHistory: 'చరిత్ర',
  navSettings: 'సెట్టింగ్‌లు',
  navAndroidProject: 'ఆండ్రాయిడ్ ప్రాజెక్ట్',

  scanQrCode: 'క్యూఆర్ కోడ్ స్కాన్ చేయండి',
  scanBarcode: 'బార్‌కోడ్ స్కాన్ చేయండి',
  generateQrCode: 'క్యూఆర్ కోడ్ సృష్టించండి',
  scanFromGallery: 'గ్యాలరీ నుండి స్కాన్',
  quickTools: 'త్వరిత సాధనాలు',
  myQrCodes: 'నా క్యూఆర్ కోడ్‌లు',
  scanHistory: 'స్కాన్ చరిత్ర',
  shareApp: 'యాప్ షేర్ చేయండి',
  recentScans: 'ఇటీవల స్కాన్ చేసినవి',
  noRecentScans: 'ఇంకా స్కాన్‌లు లేవు. మొదటి కోడ్‌ను స్కాన్ చేయడానికి కింద నొక్కండి!',
  tapToScan: 'తక్షణమే స్కాన్ చేయడానికి నొక్కండి',
  instantDetection: 'ML Kit & CameraX తో తక్షణ డిటెక్షన్',
  exportProject: 'ఆండ్రాయిడ్ స్టూడియో సోర్స్ కోడ్',
  viewSourceCode: 'ప్రాజెక్ట్‌ను చూడండి & డౌన్‌లోడ్ చేయండి',

  alignInFrame: 'ఫ్రేమ్ లోపల క్యూఆర్ లేదా బార్‌కోడ్ అమర్చండి',
  scanning: 'స్కాన్ చేస్తోంది...',
  flash: 'ఫ్లాష్‌లైట్',
  beepSound: 'బీప్ ధ్వని',
  vibration: 'వైబ్రేషన్',
  pinchZoom: 'జూమ్ నియంత్రణ',
  cameraPermissionNeeded: 'కెమెరా అనుమతి అవసరం',
  grantCamera: 'కెమెరా అనుమతిని ఇవ్వండి',
  cameraError: 'కెమెరా అందుబాటులో లేదు. మీరు గ్యాలరీ నుండి చిత్రాన్ని ఎంచుకోవచ్చు.',
  uploadImage: 'స్కాన్ చేయడానికి చిత్రాన్ని అప్‌లోడ్ చేయండి',
  dragOrChooseImage: 'ఇక్కడ చిత్రాన్ని క్లిక్ చేయండి లేదా డ్రాప్ చేయండి',
  continuousMode: 'నిరంతర స్కాన్ మోడ్',
  pausedOnResult: 'కోడ్ గుర్తించబడింది (ఆగింది)',
  resumeScan: 'మళ్లీ స్కాన్ కొనసాగించండి',

  scanResult: 'స్కాన్ ఫలితం',
  codeType: 'రకం',
  scannedAt: 'స్కాన్ చేసిన సమయం',
  content: 'డీకోడ్ చేసిన సమాచారం',
  openWebsite: 'వెబ్‌సైట్ తెరవండి',
  unsafeUrlWarning: 'భద్రతా గమనిక: తెరవడానికి ముందు ఈ లింక్‌ను నిర్ధారించుకోండి',
  proceedWithCaution: 'బాహ్య లింక్ హెచ్చరిక',
  callPhone: 'డయలర్ తెరవండి',
  sendSms: 'ఎస్ఎంఎస్ పంపండి',
  sendEmail: 'ఈమెయిల్ పంపండి',
  addToContacts: 'కాంటాక్ట్‌గా సేవ్ చేయండి (.vcf)',
  openMaps: 'మ్యాప్స్‌లో తెరవండి',
  connectWifi: 'వై-ఫై నెట్‌వర్క్',
  copyPassword: 'పాస్‌వర్డ్ కాపీ చేయండి',
  wifiDetails: 'వై-ఫై వివరాలు',
  productSearch: 'ఆన్‌లైన్‌లో ఉత్పత్తిని వెతకండి',
  copyText: 'కాపీ చేయండి',
  share: 'షేర్ చేయండి',
  copiedToClipboard: 'క్లిప్‌బోర్డ్‌కి కాపీ చేయబడింది!',
  savedToHistory: 'చరిత్రలో సేవ్ చేయబడింది',
  favorited: 'ఇష్టమైన వాటికి జోడించబడింది',
  unfavorited: 'ఇష్టమైన వాటి నుండి తీసివేయబడింది',
  deleteEntry: 'తొలగించండి',
  rescan: 'మళ్లీ స్కాన్ చేయండి',

  createQrCode: 'క్యూఆర్ కోడ్ సృష్టించండి',
  selectType: 'సమాచార రకాన్ని ఎంచుకోండి',
  typeUrl: 'వెబ్‌సైట్ లింక్ (URL)',
  typeText: 'సాధారణ వచనం',
  typeWifi: 'వై-ఫై నెట్‌వర్క్',
  typePhone: 'ఫోన్ నంబర్',
  typeSms: 'ఎస్ఎంఎస్ సందేశం',
  typeEmail: 'ఈమెయిల్',
  typeContact: 'కాంటాక్ట్ కార్డ్',
  typeLocation: 'స్థానం (GPS)',
  typeEvent: 'క్యాలెండర్ ఈవెంట్',

  urlPlaceholder: 'https://example.com',
  textPlaceholder: 'ఏదైనా వచనం లేదా సందేశాన్ని నమోదు చేయండి...',
  ssidLabel: 'నెట్‌వర్క్ పేరు (SSID)',
  wifiPasswordLabel: 'పాస్‌వర్డ్',
  encryptionLabel: 'రక్షణ రకం',
  hiddenNetwork: 'దాచబడిన నెట్‌వర్క్',
  phoneNumberLabel: 'ఫోన్ నంబర్ (+91...)',
  smsMessageLabel: 'ముందుగా నింపిన సందేశం',
  emailToLabel: 'స్వీకర్త ఈమెయిల్',
  emailSubjectLabel: 'విషయం (Subject)',
  emailBodyLabel: 'సందేశం (Body)',
  contactNameLabel: 'పూర్తి పేరు',
  contactOrgLabel: 'కంపెనీ / సంస్థ',
  latitudeLabel: 'అక్షాంశం (Latitude)',
  longitudeLabel: 'రేఖాంశం (Longitude)',
  eventTitleLabel: 'ఈవెంట్ శీర్షిక',
  eventStartLabel: 'ప్రారంభ సమయం',
  eventLocationLabel: 'ప్రదేశం',

  customizeQr: 'క్యూఆర్ రూపాన్ని అనుకూలీకరించండి',
  foregroundColor: 'క్యూఆర్ రంగు',
  backgroundColor: 'నేపథ్య రంగు',
  errorCorrection: 'లోపం దిద్దుబాటు స్థాయి',
  includeCenterLogo: 'క్విక్ క్యూఆర్ లోగోను చేర్చండి',
  downloadPng: 'హై-రెస్ PNG డౌన్‌లోడ్ చేయండి',
  downloadSvg: 'వెక్టర్ SVG డౌన్‌లోడ్ చేయండి',
  saveToMyQr: 'నా క్యూఆర్ కోడ్‌లలో సేవ్ చేయండి',
  qrSavedSuccess: 'క్యూఆర్ కోడ్ విజయవంతంగా సేవ్ చేయబడింది!',
  preview: 'లైవ్ ప్రివ్యూ',

  historyTitle: 'స్కాన్ చరిత్ర',
  searchHistoryPlaceholder: 'శోధించండి...',
  filterAll: 'అన్నీ',
  filterQr: 'క్యూఆర్ కోడ్‌లు',
  filterBarcode: 'బార్‌కోడ్‌లు',
  filterFavorites: 'ఇష్టమైనవి',
  sortNewest: 'కొత్తవి మొదట',
  sortOldest: 'పాతవి మొదట',
  exportCsv: 'CSV ఎగుమతి',
  clearHistory: 'చరిత్రను క్లియర్ చేయండి',
  clearHistoryConfirmTitle: 'మొత్తం చరిత్రను తొలగించాలా?',
  clearHistoryConfirmText: 'ఇది మీ డివైస్ నుండి అన్ని స్కాన్ రికార్డులను శాశ్వతంగా తొలగిస్తుంది.',
  cancel: 'రద్దు చేయండి',
  confirmClear: 'అన్నీ తొలగించండి',
  noHistoryFound: 'స్కాన్ రికార్డులు ఏవీ కనుగొనబడలేదు.',

  savedCodesTitle: 'సేవ్ చేసిన క్యూఆర్ కోడ్‌లు',
  renameQr: 'పేరు మార్చండి',
  deleteQr: 'తొలగించండి',
  noSavedCodes: 'ఇంకా సృష్టించిన కోడ్‌లు లేవు. మీ మొదటి క్యూఆర్ కోడ్‌ను సృష్టించండి!',

  // Pro Mode & Google Play Billing
  proBadge: 'ప్రో',
  normalBadge: 'ఉచితం',
  proTitle: 'క్విక్ క్యూఆర్ ప్రో',
  proSubtitle: '100% ప్రకటన రహిత అనుభవం & అపరిమిత ప్రీమియం సాధనాలు',
  upgradeToPro: 'ప్రో కి అప్‌గ్రేడ్ అవ్వండి',
  proPriceInr: '₹149',
  proPriceUsd: '$5.00',
  priceIndiaLabel: 'భారతదేశం ప్లాన్ (ఆటో-డిటెక్ట్)',
  priceGlobalLabel: 'గ్లోబల్ ప్లాన్',
  oneTimePayment: 'నెలవారీ సభ్యత్వం · గూగుల్ ప్లే లో ఎప్పుడైనా రద్దు చేసుకోవచ్చు',
  monthlySubscription: 'నెలవారీ సభ్యత్వం · గూగుల్ ప్లే లో ఎప్పుడైనా రద్దు చేసుకోవచ్చు',
  perMonthLabel: '/నెలకు',
  autoLocationDetected: 'ప్రదేశం మరియు కరెన్సీ స్వయంచాలకంగా గుర్తించబడ్డాయి',
  detectLocationGps: 'GPS / టైమ్‌జోన్ ద్వారా కరెన్సీని ఆటో-డిటెక్ట్ చేయండి',
  adsFreeFeature: '100% ప్రకటనలు లేవు: అన్ని బ్యానర్లు మరియు వీడియో ప్రకటనలు తొలగించబడతాయి',
  unlimitedScanFeature: 'వేగవంతమైన నిరంతర బ్యాచ్ స్కానింగ్ మరియు అపరిమిత సేవ్స్',
  premiumQrExport: 'హై-రెస్ 4K క్యూఆర్ ఎగుమతి మరియు కస్టమ్ సెంటర్ లోగోలు',
  googlePlayBillingDesc: 'గూగుల్ ప్లే నెలవారీ సబ్‌స్క్రిప్షన్ ద్వారా అధికారిక సురక్షిత చెల్లింపు',
  buyWithGooglePlay: 'గూగుల్ ప్లే తో సబ్‌స్క్రైబ్ చేసుకోండి',
  restorePurchases: 'కొనుగోళ్లను పునరుద్ధరించండి',
  currentPlan: 'సభ్యత్వ స్థితి',
  proActivated: 'ప్రో యాక్టివ్ · 100% ప్రకటనలు లేవు (నెలవారీ సభ్యత్వం)',
  normalModeActive: 'సాధారణ మోడ్ (ప్రకటనలతో కూడినది)',
  toggleProModeForTesting: 'ప్రో / సాధారణ మోడ్ మార్చండి (పరీక్ష కోసం)',
  purchasedSuccess: 'క్విక్ క్యూఆర్ ప్రో కి స్వాగతం! మీ నెలవారీ సభ్యత్వం ప్రారంభమైంది మరియు అన్ని ప్రకటనలు తొలగించబడ్డాయి.',
  restoredSuccess: 'గూగుల్ ప్లే సభ్యత్వం పునరుద్ధరించబడింది! ప్రో ఫీచర్లు అన్‌లాక్ అయ్యాయి.',

  settingsTitle: 'సెట్టింగ్‌లు',
  languageSetting: 'యాప్ భాష',
  themeSetting: 'థీమ్ మోడ్',
  themeLight: 'లైట్ థీమ్',
  themeDark: 'డార్క్ థీమ్',
  themeSystem: 'సిస్టమ్ డిఫాల్ట్',
  scannerVibration: 'స్కాన్ చేసినప్పుడు వైబ్రేషన్',
  scannerBeep: 'స్కాన్ చేసినప్పుడు బీప్ ధ్వని',
  autoCopyResult: 'ఫలితాన్ని స్వయంచాలకంగా కాపీ చేయండి',
  continuousScanSetting: 'నిరంతర స్కానింగ్ మోడ్',
  defaultFlashlight: 'కెమెరాతో పాటు ఫ్లాష్ ఆన్ చేయండి',
  privacyPolicy: 'గోప్యతా విధానం (Privacy Policy)',
  termsConditions: 'నిబంధనలు & షరతులు',
  rateApp: 'క్విక్ క్యూఆర్ రేట్ చేయండి',
  aboutApp: 'క్విక్ క్యూఆర్ గురించి',
  admobTestBanner: 'AdMob టెస్ట్ ప్రకటన బ్యానర్',
  admobNotice: 'గూగుల్ AdMob టెస్ట్ యూనిట్: ca-app-pub-3940256099942544/6300978111',
  offlineFirstNotice: '100% ఆఫ్‌లైన్-మొదట. మీ డేటా మీ ఫోన్‌లో మాత్రమే సురక్షితంగా ఉంటుంది.',
  action_favorite: 'ఇష్టమైనది',
  settings_clear_data: 'అన్ని సేవ్ చేసిన డేటాను క్లియర్ చేయండి'
};

export function getTranslations(lang: Language): Translations {
  return lang === 'te' ? teluguTranslations : englishTranslations;
}
