export type ContentType = 
  | 'url' 
  | 'wifi' 
  | 'contact' 
  | 'phone' 
  | 'email' 
  | 'sms' 
  | 'geo' 
  | 'calendar' 
  | 'text' 
  | 'product';

export interface WifiData {
  ssid: string;
  password?: string;
  encryption: 'WPA' | 'WEP' | 'nopass' | string;
  hidden?: boolean;
}

export interface ContactData {
  name: string;
  phone?: string;
  email?: string;
  organization?: string;
  title?: string;
  address?: string;
  note?: string;
}

export interface GeoData {
  latitude: number;
  longitude: number;
  query?: string;
}

export interface CalendarData {
  title: string;
  startTime?: string;
  endTime?: string;
  location?: string;
  description?: string;
}

export interface ParsedBarcodeResult {
  raw: string;
  format: string; // e.g. "QR_CODE", "EAN_13", "CODE_128", "UPC_A", etc.
  type: ContentType;
  title: string;
  displayValue: string;
  isPotentiallyUnsafeUrl?: boolean;
  wifi?: WifiData;
  contact?: ContactData;
  geo?: GeoData;
  calendar?: CalendarData;
  phone?: string;
  email?: { to: string; subject?: string; body?: string };
  sms?: { number: string; message?: string };
}

/**
 * Parses raw barcode / QR content into structured metadata
 */
export function parseBarcodeContent(raw: string, format = 'QR_CODE'): ParsedBarcodeResult {
  const trimmed = raw.trim();
  const upper = trimmed.toUpperCase();

  // 1. Check Product Barcodes
  const productFormats = ['EAN_13', 'EAN_8', 'UPC_A', 'UPC_E', 'CODE_128', 'CODE_39', 'CODE_93', 'ITF', 'CODABAR'];
  if (productFormats.includes(format) || /^[0-9]{8,14}$/.test(trimmed) && format !== 'QR_CODE') {
    return {
      raw,
      format,
      type: 'product',
      title: `${format.replace('_', ' ')} Product Code`,
      displayValue: trimmed
    };
  }

  // 2. Wi-Fi: WIFI:S:MySSID;T:WPA;P:MyPassword;;
  if (upper.startsWith('WIFI:')) {
    const ssidMatch = trimmed.match(/S:([^;]+)/i);
    const passMatch = trimmed.match(/P:([^;]*)/i);
    const typeMatch = trimmed.match(/T:([^;]+)/i);
    const hiddenMatch = trimmed.match(/H:(true|false)/i);

    const ssid = ssidMatch ? ssidMatch[1] : 'Unknown Wi-Fi';
    const password = passMatch ? passMatch[1] : '';
    const encryption = typeMatch ? typeMatch[1].toUpperCase() : 'WPA';

    return {
      raw,
      format,
      type: 'wifi',
      title: `Wi-Fi Network: ${ssid}`,
      displayValue: `Network: ${ssid} (${encryption})`,
      wifi: {
        ssid,
        password,
        encryption,
        hidden: hiddenMatch ? hiddenMatch[1].toLowerCase() === 'true' : false
      }
    };
  }

  // 3. vCard Contact: BEGIN:VCARD...
  if (upper.startsWith('BEGIN:VCARD')) {
    const fnMatch = trimmed.match(/FN:(.+?)(?:\r?\n|$)/i);
    const nMatch = trimmed.match(/N:(.+?)(?:\r?\n|$)/i);
    const telMatch = trimmed.match(/TEL.*?:(.+?)(?:\r?\n|$)/i);
    const emailMatch = trimmed.match(/EMAIL.*?:(.+?)(?:\r?\n|$)/i);
    const orgMatch = trimmed.match(/ORG:(.+?)(?:\r?\n|$)/i);
    const titleMatch = trimmed.match(/TITLE:(.+?)(?:\r?\n|$)/i);
    const noteMatch = trimmed.match(/NOTE:(.+?)(?:\r?\n|$)/i);

    const name = fnMatch ? fnMatch[1].trim() : (nMatch ? nMatch[1].replace(/;/g, ' ').trim() : 'Contact');

    return {
      raw,
      format,
      type: 'contact',
      title: `Contact: ${name}`,
      displayValue: name,
      contact: {
        name,
        phone: telMatch ? telMatch[1].trim() : undefined,
        email: emailMatch ? emailMatch[1].trim() : undefined,
        organization: orgMatch ? orgMatch[1].trim() : undefined,
        title: titleMatch ? titleMatch[1].trim() : undefined,
        note: noteMatch ? noteMatch[1].trim() : undefined
      }
    };
  }

  // 4. URL
  if (/^https?:\/\//i.test(trimmed) || /^(www\.)[a-z0-9-]+(\.[a-z]{2,})/i.test(trimmed)) {
    const fullUrl = trimmed.startsWith('http') ? trimmed : `https://${trimmed}`;
    let isPotentiallyUnsafeUrl = false;
    try {
      const parsed = new URL(fullUrl);
      // Warning flag for IP addresses or suspicious TLDs or excessive subdomains
      if (/^\d{1,3}\.\d{1,3}\.\d{1,3}\.\d{1,3}$/.test(parsed.hostname) || parsed.hostname.split('.').length > 4) {
        isPotentiallyUnsafeUrl = true;
      }
    } catch {
      // ignore
    }

    return {
      raw: fullUrl,
      format,
      type: 'url',
      title: 'Website Link',
      displayValue: fullUrl,
      isPotentiallyUnsafeUrl
    };
  }

  // 5. Phone: tel:+1234567890
  if (upper.startsWith('TEL:') || /^\+?[0-9\s-]{7,15}$/.test(trimmed)) {
    const phone = trimmed.replace(/^tel:/i, '').trim();
    return {
      raw,
      format,
      type: 'phone',
      title: 'Phone Number',
      displayValue: phone,
      phone
    };
  }

  // 6. SMS: SMSTO:123456:message or sms:123456?body=...
  if (upper.startsWith('SMSTO:') || upper.startsWith('SMS:')) {
    let number = '';
    let message = '';
    if (upper.startsWith('SMSTO:')) {
      const parts = trimmed.substring(6).split(':');
      number = parts[0] || '';
      message = parts.slice(1).join(':') || '';
    } else {
      const parts = trimmed.substring(4).split('?');
      number = parts[0] || '';
      const bodyMatch = parts[1]?.match(/body=([^&]+)/i);
      message = bodyMatch ? decodeURIComponent(bodyMatch[1]) : '';
    }
    return {
      raw,
      format,
      type: 'sms',
      title: 'SMS Message',
      displayValue: `To: ${number}`,
      sms: { number, message }
    };
  }

  // 7. Email: mailto:user@example.com or MATMSG:
  if (upper.startsWith('MAILTO:') || upper.startsWith('MATMSG:') || /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(trimmed)) {
    let to = trimmed;
    let subject = '';
    let body = '';

    if (upper.startsWith('MAILTO:')) {
      const urlParts = trimmed.substring(7).split('?');
      to = urlParts[0] || '';
      if (urlParts[1]) {
        const subMatch = urlParts[1].match(/subject=([^&]+)/i);
        const bodyMatch = urlParts[1].match(/body=([^&]+)/i);
        subject = subMatch ? decodeURIComponent(subMatch[1]) : '';
        body = bodyMatch ? decodeURIComponent(bodyMatch[1]) : '';
      }
    } else if (upper.startsWith('MATMSG:')) {
      const toMatch = trimmed.match(/TO:([^;]+)/i);
      const subMatch = trimmed.match(/SUB:([^;]+)/i);
      const bodyMatch = trimmed.match(/BODY:([^;]+)/i);
      to = toMatch ? toMatch[1] : '';
      subject = subMatch ? subMatch[1] : '';
      body = bodyMatch ? bodyMatch[1] : '';
    }

    return {
      raw,
      format,
      type: 'email',
      title: 'Email Address',
      displayValue: to,
      email: { to, subject, body }
    };
  }

  // 8. Geographic coordinates: geo:37.7749,-122.4194
  if (upper.startsWith('GEO:')) {
    const coords = trimmed.substring(4).split('?')[0].split(',');
    const lat = parseFloat(coords[0]);
    const lng = parseFloat(coords[1]);
    const queryMatch = trimmed.match(/\?q=([^&]+)/i);

    return {
      raw,
      format,
      type: 'geo',
      title: 'Map Location',
      displayValue: `${lat.toFixed(5)}, ${lng.toFixed(5)}`,
      geo: {
        latitude: lat || 0,
        longitude: lng || 0,
        query: queryMatch ? decodeURIComponent(queryMatch[1]) : undefined
      }
    };
  }

  // 9. Calendar: BEGIN:VEVENT
  if (upper.startsWith('BEGIN:VEVENT')) {
    const sumMatch = trimmed.match(/SUMMARY:(.+?)(?:\r?\n|$)/i);
    const locMatch = trimmed.match(/LOCATION:(.+?)(?:\r?\n|$)/i);
    const descMatch = trimmed.match(/DESCRIPTION:(.+?)(?:\r?\n|$)/i);
    const startMatch = trimmed.match(/DTSTART:(.+?)(?:\r?\n|$)/i);
    const endMatch = trimmed.match(/DTEND:(.+?)(?:\r?\n|$)/i);

    return {
      raw,
      format,
      type: 'calendar',
      title: sumMatch ? sumMatch[1].trim() : 'Calendar Event',
      displayValue: sumMatch ? sumMatch[1].trim() : 'Event',
      calendar: {
        title: sumMatch ? sumMatch[1].trim() : 'Event',
        startTime: startMatch ? startMatch[1].trim() : undefined,
        endTime: endMatch ? endMatch[1].trim() : undefined,
        location: locMatch ? locMatch[1].trim() : undefined,
        description: descMatch ? descMatch[1].trim() : undefined
      }
    };
  }

  // 10. Fallback: Plain Text
  return {
    raw,
    format,
    type: 'text',
    title: 'Plain Text',
    displayValue: trimmed.length > 60 ? trimmed.substring(0, 60) + '...' : trimmed
  };
}
