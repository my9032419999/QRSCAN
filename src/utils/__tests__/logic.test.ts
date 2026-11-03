import test from 'node:test';
import assert from 'node:assert/strict';
import { parseBarcodeContent } from '../barcodeParser';
import { exportScanHistoryToCsv, escapeCsvField } from '../csvExporter';
import { englishTranslations, teluguTranslations } from '../translations';

test('parseBarcodeContent correctly identifies URLs and flags suspicious IPs', () => {
  const result = parseBarcodeContent('https://example.com/item/123');
  assert.equal(result.type, 'url');
  assert.equal(result.raw, 'https://example.com/item/123');
  assert.equal(result.isPotentiallyUnsafeUrl, false);

  const ipResult = parseBarcodeContent('http://192.168.1.1/admin');
  assert.equal(ipResult.type, 'url');
  assert.equal(ipResult.isPotentiallyUnsafeUrl, true);
});

test('parseBarcodeContent correctly parses Wi-Fi QR configuration', () => {
  const wifiRaw = 'WIFI:S:MyHomeWifi;T:WPA;P:SuperSecret123;H:false;;';
  const result = parseBarcodeContent(wifiRaw);
  assert.equal(result.type, 'wifi');
  assert.equal(result.wifi?.ssid, 'MyHomeWifi');
  assert.equal(result.wifi?.password, 'SuperSecret123');
  assert.equal(result.wifi?.encryption, 'WPA');
  assert.equal(result.wifi?.hidden, false);
});

test('parseBarcodeContent correctly parses vCard contact cards', () => {
  const vcard = `BEGIN:VCARD
VERSION:3.0
FN:Jagadeesh
TEL;CELL:+919876543210
EMAIL:jagadeesh@example.com
ORG:QuickQR Tech
END:VCARD`;
  const result = parseBarcodeContent(vcard);
  assert.equal(result.type, 'contact');
  assert.equal(result.contact?.name, 'Jagadeesh');
  assert.equal(result.contact?.phone, '+919876543210');
  assert.equal(result.contact?.email, 'jagadeesh@example.com');
  assert.equal(result.contact?.organization, 'QuickQR Tech');
});

test('parseBarcodeContent correctly identifies Product Barcodes like EAN-13 and UPC-A', () => {
  const eanResult = parseBarcodeContent('8901030383792', 'EAN_13');
  assert.equal(eanResult.type, 'product');
  assert.equal(eanResult.format, 'EAN_13');
  assert.equal(eanResult.displayValue, '8901030383792');
});

test('escapeCsvField correctly handles commas, quotes, and newlines', () => {
  assert.equal(escapeCsvField('normal text'), '"normal text"');
  assert.equal(escapeCsvField('hello, world'), '"hello, world"');
  assert.equal(escapeCsvField('quote "here"'), '"quote ""here"""');
  assert.equal(escapeCsvField(null), '""');
});

test('exportScanHistoryToCsv formats rows properly with header', () => {
  const csv = exportScanHistoryToCsv([
    {
      id: 'rec-1',
      timestamp: 1700000000000,
      rawContent: 'https://example.com',
      format: 'QR_CODE',
      type: 'url',
      title: 'Website Link',
      isFavorite: true
    }
  ]);
  assert.ok(csv.includes('"ID","Date & Time","Format","Type","Title","Content","Favorite"'));
  assert.ok(csv.includes('"rec-1"'));
  assert.ok(csv.includes('"https://example.com"'));
  assert.ok(csv.includes('"Yes"'));
});

test('English and Telugu translations have matching keys', () => {
  const enKeys = Object.keys(englishTranslations).sort();
  const teKeys = Object.keys(teluguTranslations).sort();
  assert.deepEqual(enKeys, teKeys, 'English and Telugu dictionaries must contain the exact same keys');
});

test('Pro pricing plans return correct 149 INR and 5 USD monthly pricing and ad rules', async () => {
  const { getProPrice, shouldShowAds, detectUserRegionAndCurrency } = await import('../billing');
  const inrPlan = getProPrice('INR');
  assert.equal(inrPlan.amount, 149);
  assert.equal(inrPlan.formattedMonthly, '₹149');
  assert.equal(inrPlan.perMonthSuffix, '/month');
  assert.equal(inrPlan.symbol, '₹');

  const usdPlan = getProPrice('USD');
  assert.equal(usdPlan.amount, 5);
  assert.equal(usdPlan.formattedMonthly, '$5.00');
  assert.equal(usdPlan.perMonthSuffix, '/month');
  assert.equal(usdPlan.symbol, '$');

  // Ad rules: Normal mode shows ads, Pro mode disables all ads
  assert.equal(shouldShowAds(false), true, 'Free normal mode must show ads');
  assert.equal(shouldShowAds(true), false, 'Pro mode must be 100% ad-free');

  // Auto location detection
  const detected = detectUserRegionAndCurrency();
  assert.ok(detected.currency, 'Must detect a valid currency code');
  assert.ok(detected.plan.formattedMonthly, 'Must provide formatted monthly price');
  assert.ok(detected.plan.symbol, 'Must provide valid currency symbol');
});
