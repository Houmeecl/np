import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import QrGenerator from "@/components/qr-generator";
import { Camera, Smartphone, Shield, CheckCircle, AlertCircle, Timer, RefreshCw, Eye, FileText } from "lucide-react";

interface IdentityVerificationProps {
  documentId: number;
  onComplete: (verificationData: any) => void;
  isLoading?: boolean;
}

export default function IdentityVerification({ documentId, onComplete, isLoading }: IdentityVerificationProps) {
  const [step, setStep] = useState<"qr" | "mobile" | "biometric" | "completed">("qr");
  const [verificationCode, setVerificationCode] = useState("");
  const [progress, setProgress] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(300); // 5 minutes
  const [mobileData, setMobileData] = useState({
    phone: "",
    smsCode: "",
    faceVerified: false,
    idVerified: false,
    livenessVerified: false,
    documentData: null as any
  });

  // Generate verification code when component mounts
  const qrCode = `VERIFY_${documentId}_${Date.now()}`;

  // Timer countdown
  useEffect(() => {
    if (step === "mobile" || step === "biometric") {
      const timer = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            setStep("qr");
            return 300;
          }
          return prev - 1;
        });
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [step]);

  const handleQrScan = () => {
    setStep("mobile");
    setVerificationCode(qrCode);
    setProgress(25);
  };

  const sendSmsCode = () => {
    // Simulate SMS sending
    setTimeout(() => {
      setMobileData(prev => ({ ...prev, smsCode: "123456" }));
      setProgress(40);
    }, 1000);
  };

  const verifyBiometrics = () => {
    setStep("biometric");
    setProgress(60);
    
    // Simulate biometric verification steps
    setTimeout(() => {
      setMobileData(prev => ({ ...prev, livenessVerified: true }));
      setProgress(70);
    }, 2000);
    
    setTimeout(() => {
      setMobileData(prev => ({ ...prev, faceVerified: true }));
      setProgress(85);
    }, 3500);
    
    setTimeout(() => {
      setMobileData(prev => ({ 
        ...prev, 
        idVerified: true,
        documentData: {
          rut: "12.345.678-9",
          nombre: "Juan Pérez García",
          nacimiento: "01/01/1985",
          emisión: "15/06/2020",
          vencimiento: "15/06/2025"
        }
      }));
      setProgress(100);
    }, 5000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleComplete = () => {
    const verificationData = {
      verificationCode: qrCode,
      timestamp: new Date().toISOString(),
      method: "biometric_full",
      phone: mobileData.phone,
      faceVerified: mobileData.faceVerified,
      idVerified: mobileData.idVerified,
      livenessVerified: mobileData.livenessVerified,
      documentData: mobileData.documentData,
      ipAddress: "192.168.1.1",
      deviceInfo: "Mobile Device",
      securityLevel: "high"
    };

    onComplete(verificationData);
  };

  return (
    <div className="space-y-6">
      {/* Step: QR Code Generation */}
      {step === "qr" && (
        <div className="text-center space-y-6">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
              <Smartphone className="text-blue-600" size={24} />
            </div>
            <div className="text-left">
              <h3 className="text-lg font-semibold">Verificación de Identidad</h3>
              <p className="text-sm text-gray-600">Escanee el código QR con su teléfono</p>
            </div>
          </div>

          <Card className="max-w-md mx-auto">
            <CardContent className="p-8">
              <QrGenerator value={qrCode} size={200} />
              <p className="text-sm text-gray-600 mt-4">
                Escanee este código QR con la cámara de su teléfono para continuar con la verificación
              </p>
            </CardContent>
          </Card>

          <div className="flex flex-col space-y-3">
            <Button onClick={handleQrScan} className="btn-chile max-w-md mx-auto">
              <Camera className="mr-2" size={16} />
              Simular Escaneo QR
            </Button>
            <p className="text-xs text-gray-500">
              En producción, este paso se activa automáticamente al escanear el código
            </p>
          </div>
        </div>
      )}

      {/* Step: Mobile Verification */}
      {step === "mobile" && (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="text-green-600" size={32} />
            </div>
            <h3 className="text-lg font-semibold">Verificación en Curso</h3>
            <p className="text-sm text-gray-600">Complete la verificación en su dispositivo móvil</p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {/* Phone Input */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <Label htmlFor="phone">Número de Teléfono</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={mobileData.phone}
                    onChange={(e) => setMobileData(prev => ({ ...prev, phone: e.target.value }))}
                    placeholder="+56 9 1234 5678"
                  />
                  <p className="text-xs text-gray-500">
                    Se enviará un código de verificación a este número
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Verification Steps */}
            <Card>
              <CardContent className="p-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Pasos de Verificación</h4>
                  
                  {/* Face Verification */}
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Camera size={20} className="text-blue-600" />
                      <span className="text-sm">Verificación Facial</span>
                    </div>
                    {mobileData.faceVerified ? (
                      <CheckCircle className="text-green-600" size={20} />
                    ) : (
                      <Button
                        size="sm"
                        onClick={simulateFaceVerification}
                        disabled={!mobileData.phone}
                      >
                        Verificar
                      </Button>
                    )}
                  </div>

                  {/* ID Verification */}
                  <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <Shield size={20} className="text-purple-600" />
                      <span className="text-sm">Cédula de Identidad</span>
                    </div>
                    {mobileData.idVerified ? (
                      <CheckCircle className="text-green-600" size={20} />
                    ) : (
                      <Button
                        size="sm"
                        onClick={simulateIdVerification}
                        disabled={!mobileData.faceVerified}
                      >
                        Verificar
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Progress Indicator */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                <Smartphone className="text-white" size={14} />
              </div>
              <div>
                <p className="text-sm font-medium text-blue-800">
                  Verificación en proceso
                </p>
                <p className="text-xs text-blue-700">
                  Siga las instrucciones en su dispositivo móvil
                </p>
              </div>
            </div>
          </div>

          {/* Complete Button */}
          {mobileData.faceVerified && mobileData.idVerified && (
            <div className="text-center">
              <Button
                onClick={handleComplete}
                disabled={isLoading}
                className="btn-chile min-w-[200px]"
              >
                {isLoading ? "Procesando..." : "Completar Verificación"}
              </Button>
            </div>
          )}
        </div>
      )}

      {/* Security Notice */}
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertCircle className="text-yellow-600 flex-shrink-0 mt-0.5" size={16} />
          <div>
            <p className="text-sm font-medium text-yellow-800">
              Información de Seguridad
            </p>
            <p className="text-xs text-yellow-700 mt-1">
              Su información biométrica se procesa de forma segura y cumple con las normativas 
              de protección de datos personales. Los datos no se almacenan permanentemente.
            </p>
          </div>
        </div>
      </div>

      {/* Technical Info */}
      <Card className="bg-gray-50">
        <CardContent className="p-4">
          <h4 className="font-medium text-sm mb-2">Información Técnica</h4>
          <div className="grid grid-cols-2 gap-4 text-xs text-gray-600">
            <div>
              <span className="font-medium">Código de Verificación:</span><br />
              <span className="font-mono">{qrCode}</span>
            </div>
            <div>
              <span className="font-medium">Método:</span><br />
              FaceID + Validación de Cédula
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
