import React, { useState, useEffect, useRef } from 'react';
import { useAppContext } from '../AppContext';
import { X, Camera, Search } from 'lucide-react';
import { Html5QrcodeScanner, Html5Qrcode } from 'html5-qrcode';

export default function QRScannerModal({ onClose }: { onClose: () => void }) {
  const { items, setItems } = useAppContext();
  const [scannedItem, setScannedItem] = useState<any>(null);
  const [action, setAction] = useState<'IN' | 'OUT'>('OUT');
  const [error, setError] = useState('');
  const [isScanning, setIsScanning] = useState(true);
  const scannerRef = useRef<Html5Qrcode | null>(null);

  useEffect(() => {
    if (!isScanning) return;

    const startScanner = async () => {
      try {
        scannerRef.current = new Html5Qrcode("qr-reader");
        const config = { fps: 10, qrbox: { width: 250, height: 250 } };
        const onSuccess = (decodedText: string) => handleScanSuccess(decodedText);
        const onError = () => {}; // ignore scan errors

        try {
          // Try environment (back) camera first
          await scannerRef.current.start({ facingMode: "environment" }, config, onSuccess, onError);
        } catch (err1) {
          try {
            // Fallback to user (front) camera
            await scannerRef.current.start({ facingMode: "user" }, config, onSuccess, onError);
          } catch (err2) {
            // Fallback to any available camera
            const cameras = await Html5Qrcode.getCameras();
            if (cameras && cameras.length > 0) {
              await scannerRef.current.start(cameras[0].id, config, onSuccess, onError);
            } else {
              throw new Error("No cameras found.");
            }
          }
        }
      } catch (err) {
        console.error("Error starting scanner:", err);
        setError("Could not access camera. Please check permissions or connect a camera.");
        setIsScanning(false);
      }
    };

    startScanner();

    return () => {
      if (scannerRef.current && scannerRef.current.isScanning) {
        scannerRef.current.stop().catch(console.error);
      }
    };
  }, [isScanning]);

  const handleScanSuccess = (decodedText: string) => {
    if (scannerRef.current && scannerRef.current.isScanning) {
      scannerRef.current.stop().catch(console.error);
    }
    setIsScanning(false);
    
    const item = items.find(i => i.id === decodedText || i.qrCode === decodedText);
    if (item) {
      setScannedItem(item);
      setError('');
    } else {
      setError('Item not found!');
      setScannedItem(null);
    }
  };

  const handleAction = () => {
    if (!scannedItem) return;
    
    const newStatus = action === 'IN' ? 'Available' : 'In Use';
    
    setItems(items.map(i => 
      i.id === scannedItem.id ? { ...i, status: newStatus } : i
    ));
    
    alert(`Item successfully marked as ${newStatus}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-[100] flex items-center justify-center p-4 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-4 border-b border-slate-100">
          <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2">
            <Camera size={20} className="text-emerald-600" />
            Scan QR Code
          </h3>
          <button 
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 overflow-y-auto flex-1">
          {isScanning ? (
            <div className="flex flex-col items-center">
              <div id="qr-reader" className="w-full max-w-[300px] overflow-hidden rounded-xl border-2 border-emerald-100"></div>
              {error && <p className="text-red-500 text-sm mt-4 text-center">{error}</p>}
              <p className="text-sm text-slate-500 text-center mt-4">Position the QR code within the frame to scan automatically.</p>
              
              <div className="mt-8 w-full">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-2 bg-white text-slate-500">Or enter manually</span>
                  </div>
                </div>
                
                <div className="mt-4 flex gap-2">
                  <input 
                    type="text" 
                    placeholder="Enter Item ID..."
                    className="flex-1 px-4 py-2 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        handleScanSuccess(e.currentTarget.value);
                      }
                    }}
                  />
                </div>
              </div>
            </div>
          ) : scannedItem ? (
            <div className="space-y-6">
              <div className="bg-emerald-50 rounded-xl p-4 border border-emerald-100">
                <h4 className="font-semibold text-emerald-800 mb-2">Item Found</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-emerald-600/80">Name:</span>
                    <span className="font-medium text-emerald-900">{scannedItem.name}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-emerald-600/80">Category:</span>
                    <span className="font-medium text-emerald-900">{scannedItem.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-emerald-600/80">Status:</span>
                    <span className="font-medium text-emerald-900">{scannedItem.status}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <p className="text-sm font-medium text-slate-700">Select Action:</p>
                <div className="grid grid-cols-2 gap-3">
                  <label className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all ${action === 'OUT' ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 hover:border-emerald-200'}`}>
                    <input 
                      type="radio" 
                      name="action" 
                      checked={action === 'OUT'} 
                      onChange={() => setAction('OUT')}
                      className="sr-only"
                    />
                    <span className={`font-bold ${action === 'OUT' ? 'text-emerald-700' : 'text-slate-600'}`}>Borrow</span>
                    <span className="text-xs text-slate-500 mt-1">Mark as In Use</span>
                  </label>
                  <label className={`flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all ${action === 'IN' ? 'border-emerald-500 bg-emerald-50' : 'border-slate-200 hover:border-emerald-200'}`}>
                    <input 
                      type="radio" 
                      name="action" 
                      checked={action === 'IN'} 
                      onChange={() => setAction('IN')}
                      className="sr-only"
                    />
                    <span className={`font-bold ${action === 'IN' ? 'text-emerald-700' : 'text-slate-600'}`}>Return</span>
                    <span className="text-xs text-slate-500 mt-1">Mark as Available</span>
                  </label>
                </div>

                <button 
                  onClick={handleAction}
                  className="w-full py-3 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors font-medium mt-4 shadow-sm"
                >
                  Confirm Action
                </button>
                <button 
                  onClick={() => {
                    setScannedItem(null);
                    setIsScanning(true);
                  }}
                  className="w-full py-3 bg-white text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors font-medium"
                >
                  Scan Another Item
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-red-100 text-red-500 rounded-full flex items-center justify-center mx-auto mb-4">
                <X size={32} />
              </div>
              <h4 className="text-lg font-bold text-slate-800 mb-2">Item Not Found</h4>
              <p className="text-slate-500 mb-6">{error}</p>
              <button 
                onClick={() => {
                  setError('');
                  setIsScanning(true);
                }}
                className="px-6 py-2 bg-emerald-600 text-white rounded-xl hover:bg-emerald-700 transition-colors font-medium"
              >
                Try Again
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
