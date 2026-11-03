import React, { useEffect, useRef, useState, useCallback } from 'react';
import { 
  Flashlight, 
  Image as ImageIcon, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  Vibrate, 
  Camera, 
  AlertCircle,
  ZoomIn,
  Settings2,
  CheckCircle2
} from 'lucide-react';
import { BrowserMultiFormatReader } from '@zxing/browser';
import { Translations } from '../utils/translations';
import { ParsedBarcodeResult, parseBarcodeContent } from '../utils/barcodeParser';
import { playScannerBeep, triggerScanHaptic } from '../utils/audioFeedback';

interface ScannerScreenProps {
  t: Translations;
  onScanResult: (result: ParsedBarcodeResult) => void;
  soundEnabled: boolean;
  vibrationEnabled: boolean;
  continuousMode: boolean;
  defaultFlashlight: boolean;
  onToggleSound: () => void;
  onToggleVibration: () => void;
  onToggleContinuous: () => void;
}

export const ScannerScreen: React.FC<ScannerScreenProps> = ({
  t,
  onScanResult,
  soundEnabled,
  vibrationEnabled,
  continuousMode,
  defaultFlashlight,
  onToggleSound,
  onToggleVibration,
  onToggleContinuous
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const codeReaderRef = useRef<BrowserMultiFormatReader | null>(null);

  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isFlashlightOn, setIsFlashlightOn] = useState(defaultFlashlight);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isPaused, setIsPaused] = useState(false);
  const [lastScannedText, setLastScannedText] = useState<string | null>(null);
  const [lastScannedTime, setLastScannedTime] = useState(0);
  const [videoTrack, setVideoTrack] = useState<MediaStreamTrack | null>(null);

  // Initialize ZXing reader
  useEffect(() => {
    codeReaderRef.current = new BrowserMultiFormatReader();
    return () => {
      // Cleanup reader
      codeReaderRef.current = null;
    };
  }, []);

  // Handle successful decode
  const handleDecoded = useCallback((rawText: string, format = 'QR_CODE') => {
    const now = Date.now();
    // Duplicate scan prevention in continuous mode (minimum 2.5s window for identical string)
    if (rawText === lastScannedText && now - lastScannedTime < 2500) {
      return;
    }

    setLastScannedText(rawText);
    setLastScannedTime(now);

    if (soundEnabled) {
      playScannerBeep();
    }
    if (vibrationEnabled) {
      triggerScanHaptic();
    }

    const parsed = parseBarcodeContent(rawText, format);

    if (!continuousMode) {
      setIsPaused(true);
      onScanResult(parsed);
    } else {
      // In continuous mode, notify result but keep scanning
      onScanResult(parsed);
    }
  }, [lastScannedText, lastScannedTime, soundEnabled, vibrationEnabled, continuousMode, onScanResult]);

  // Start camera stream
  const startCamera = useCallback(async () => {
    setErrorMessage(null);
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        setHasPermission(false);
        setErrorMessage('Camera API is not supported in this environment.');
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: { ideal: 'environment' },
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.setAttribute('playsinline', 'true');
        await videoRef.current.play();
      }

      const track = stream.getVideoTracks()[0];
      setVideoTrack(track);
      setHasPermission(true);

      // Handle torch if requested
      if (defaultFlashlight && track) {
        try {
          const capabilities = track.getCapabilities?.() as { torch?: boolean };
          if (capabilities?.torch) {
            await (track as unknown as { applyConstraints: (c: unknown) => Promise<void> }).applyConstraints({
              advanced: [{ torch: true }]
            });
            setIsFlashlightOn(true);
          }
        } catch {
          // torch constraint failed
        }
      }

      // Begin continuous decode loop
      if (codeReaderRef.current && videoRef.current) {
        codeReaderRef.current.decodeFromVideoElement(videoRef.current, (result, err) => {
          if (result && !isPaused) {
            const format = result.getBarcodeFormat() ? result.getBarcodeFormat().toString() : 'QR_CODE';
            handleDecoded(result.getText(), format);
          }
        });
      }
    } catch (err: unknown) {
      setHasPermission(false);
      const message = err instanceof Error ? err.message : 'Camera access was denied or is unavailable.';
      setErrorMessage(message);
    }
  }, [defaultFlashlight, handleDecoded, isPaused]);

  // Toggle torch
  const toggleFlashlight = async () => {
    if (!videoTrack) return;
    try {
      const nextState = !isFlashlightOn;
      const capabilities = videoTrack.getCapabilities?.() as { torch?: boolean };
      if (capabilities?.torch) {
        await (videoTrack as unknown as { applyConstraints: (c: unknown) => Promise<void> }).applyConstraints({
          advanced: [{ torch: nextState }]
        });
      }
      setIsFlashlightOn(nextState);
    } catch {
      setIsFlashlightOn(!isFlashlightOn);
    }
  };

  // Zoom control
  const handleZoomChange = async (newZoom: number) => {
    setZoomLevel(newZoom);
    if (videoTrack) {
      try {
        const capabilities = videoTrack.getCapabilities?.() as { zoom?: { min: number; max: number } };
        if (capabilities?.zoom) {
          await (videoTrack as unknown as { applyConstraints: (c: unknown) => Promise<void> }).applyConstraints({
            advanced: [{ zoom: newZoom }]
          });
        }
      } catch {
        // Zoom not natively supported on device
      }
    }
  };

  // Handle Gallery Image Pick
  const handleGalleryFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const imageUrl = URL.createObjectURL(file);
      const img = new Image();
      img.src = imageUrl;
      img.onload = async () => {
        try {
          const reader = new BrowserMultiFormatReader();
          const result = await reader.decodeFromImageElement(img);
          if (result) {
            const format = result.getBarcodeFormat() ? result.getBarcodeFormat().toString() : 'QR_CODE';
            handleDecoded(result.getText(), format);
          } else {
            alert('No valid QR code or barcode found in this image.');
          }
        } catch {
          alert('Could not decode barcode from this image. Please ensure the code is clear and in focus.');
        } finally {
          URL.revokeObjectURL(imageUrl);
        }
      };
    } catch (err) {
      console.error(err);
    }
  };

  // Mount camera
  useEffect(() => {
    startCamera();
    return () => {
      // Stop video tracks when unmounting
      if (videoTrack) {
        videoTrack.stop();
      }
    };
  }, []);

  return (
    <div className="relative w-full h-[calc(100vh-140px)] max-h-[820px] bg-black flex flex-col justify-between overflow-hidden select-none">
      {/* Hidden File Input for Gallery */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleGalleryFile}
        className="hidden"
      />

      {/* Top Controls Bar */}
      <div className="relative z-20 flex items-center justify-between p-4 bg-gradient-to-b from-black/80 via-black/40 to-transparent text-white">
        {/* Flashlight button */}
        <button
          onClick={toggleFlashlight}
          aria-label={t.flash}
          className={`p-3 rounded-full backdrop-blur-md transition ${
            isFlashlightOn ? 'bg-amber-400 text-slate-900 shadow-lg shadow-amber-400/30' : 'bg-white/15 text-white hover:bg-white/25'
          }`}
        >
          <Flashlight className="w-5 h-5" />
        </button>

        {/* Sound & Vibration & Mode Controls */}
        <div className="flex items-center space-x-2">
          <button
            onClick={onToggleSound}
            aria-label={t.beepSound}
            className={`p-3 rounded-full backdrop-blur-md transition ${
              soundEnabled ? 'bg-[#0877ED] text-white shadow-md' : 'bg-white/15 text-white/60'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-5 h-5" /> : <VolumeX className="w-5 h-5" />}
          </button>

          <button
            onClick={onToggleVibration}
            aria-label={t.vibration}
            className={`p-3 rounded-full backdrop-blur-md transition ${
              vibrationEnabled ? 'bg-[#0877ED] text-white shadow-md' : 'bg-white/15 text-white/60'
            }`}
          >
            <Vibrate className="w-5 h-5" />
          </button>

          <button
            onClick={onToggleContinuous}
            aria-label={t.continuousMode}
            title={t.continuousMode}
            className={`px-3 py-2 rounded-full text-xs font-semibold backdrop-blur-md flex items-center space-x-1.5 transition ${
              continuousMode ? 'bg-[#00B8D9] text-white' : 'bg-white/15 text-white/70'
            }`}
          >
            <Settings2 className="w-3.5 h-3.5" />
            <span>{continuousMode ? 'Continuous' : 'Single'}</span>
          </button>
        </div>

        {/* Gallery Pick button */}
        <button
          onClick={() => fileInputRef.current?.click()}
          aria-label={t.scanFromGallery}
          className="p-3 rounded-full bg-white/15 text-white hover:bg-white/25 backdrop-blur-md transition"
        >
          <ImageIcon className="w-5 h-5" />
        </button>
      </div>

      {/* Camera Viewport & Overlay */}
      <div className="relative flex-1 flex items-center justify-center overflow-hidden">
        {/* Real Live Video */}
        <video
          ref={videoRef}
          className="absolute inset-0 w-full h-full object-cover"
          muted
          playsInline
        />

        {/* Torch Screen Glow Simulation when torch hardware unavailable */}
        {isFlashlightOn && (
          <div className="absolute inset-0 bg-white/25 pointer-events-none mix-blend-screen z-10 transition-opacity" />
        )}

        {/* Dark Vignette Mask with Transparent Center Scanner Box */}
        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
          <div className="relative w-64 h-64 sm:w-72 sm:h-72">
            {/* Corner Brackets */}
            <div className="absolute -top-1 -left-1 w-8 h-8 border-t-4 border-l-4 border-[#00B8D9] rounded-tl-xl shadow-sm" />
            <div className="absolute -top-1 -right-1 w-8 h-8 border-t-4 border-r-4 border-[#00B8D9] rounded-tr-xl shadow-sm" />
            <div className="absolute -bottom-1 -left-1 w-8 h-8 border-b-4 border-l-4 border-[#00B8D9] rounded-bl-xl shadow-sm" />
            <div className="absolute -bottom-1 -right-1 w-8 h-8 border-b-4 border-r-4 border-[#00B8D9] rounded-br-xl shadow-sm" />

            {/* Glowing Laser Scan Line */}
            {!isPaused && (
              <div className="absolute left-0 right-0 h-1 bg-gradient-to-r from-transparent via-[#00B8D9] to-transparent shadow-[0_0_12px_#00B8D9] animate-scan-laser" />
            )}

            {/* Scanning Guide Watermark in the Center */}
            <div className="absolute inset-0 flex items-center justify-center opacity-15">
              <Camera className="w-16 h-16 text-white" />
            </div>

            {/* Paused State Notification */}
            {isPaused && (
              <div className="absolute inset-0 bg-black/60 rounded-xl backdrop-blur-sm flex flex-col items-center justify-center p-4 text-center">
                <CheckCircle2 className="w-10 h-10 text-emerald-400 mb-2" />
                <p className="text-white text-xs font-semibold">{t.pausedOnResult}</p>
                <button
                  onClick={() => setIsPaused(false)}
                  className="mt-3 px-4 py-1.5 bg-[#0877ED] hover:bg-[#0766ce] text-white text-xs font-bold rounded-full pointer-events-auto shadow-md"
                >
                  {t.resumeScan}
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Permission / Camera Unavailable Fallback */}
        {hasPermission === false && (
          <div className="absolute inset-0 bg-slate-950/90 z-20 flex flex-col items-center justify-center p-6 text-center text-white">
            <div className="w-16 h-16 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center mb-4 border border-red-500/20">
              <AlertCircle className="w-8 h-8" />
            </div>
            <h3 className="text-lg font-bold mb-2">{t.cameraPermissionNeeded}</h3>
            <p className="text-sm text-slate-300 max-w-xs mb-6">
              {errorMessage || t.cameraError}
            </p>
            <div className="flex flex-col space-y-3 w-full max-w-xs">
              <button
                onClick={startCamera}
                className="w-full py-3 bg-[#0877ED] hover:bg-[#0766ce] text-white font-semibold rounded-xl flex items-center justify-center space-x-2 shadow-lg shadow-[#0877ED]/30"
              >
                <RotateCcw className="w-4 h-4" />
                <span>{t.grantCamera}</span>
              </button>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="w-full py-3 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-xl flex items-center justify-center space-x-2"
              >
                <ImageIcon className="w-4 h-4" />
                <span>{t.scanFromGallery}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Bottom Control Bar */}
      <div className="relative z-20 p-4 bg-gradient-to-t from-black/85 via-black/45 to-transparent text-white">
        {/* Scanner Instructions */}
        <p className="text-center text-xs text-slate-300 font-medium mb-3">
          {t.alignInFrame}
        </p>

        {/* Zoom & Quick Actions */}
        <div className="flex items-center justify-center space-x-4">
          <div className="flex items-center space-x-2 bg-white/15 backdrop-blur-md px-3 py-1.5 rounded-full">
            <ZoomIn className="w-3.5 h-3.5 text-white/70" />
            <span className="text-[11px] font-bold text-white/90">Zoom:</span>
            {[1, 1.5, 2].map((z) => (
              <button
                key={z}
                onClick={() => handleZoomChange(z)}
                className={`w-7 h-7 rounded-full text-xs font-bold transition ${
                  zoomLevel === z ? 'bg-[#0877ED] text-white shadow-sm' : 'text-white/70 hover:text-white'
                }`}
              >
                {z}x
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
