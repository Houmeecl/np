import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Stamp, CheckCircle, XCircle, FileText, Clock, Shield, Eye } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import Navbar from "@/components/layout/navbar";
import CertificationQueue from "@/components/certification-queue";

export default function CertificadorDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedDocument, setSelectedDocument] = useState<any>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  const { data: pendingDocuments } = useQuery({
    queryKey: ["/api/documents/pending"],
  });

  const { data: myDocuments } = useQuery({
    queryKey: ["/api/documents"],
  });

  const { data: commissions } = useQuery({
    queryKey: ["/api/commissions"],
  });

  const certifyMutation = useMutation({
    mutationFn: async ({ documentId, action, rejectionReason }: any) => {
      await apiRequest("PATCH", `/api/documents/${documentId}/certify`, {
        action,
        rejectionReason,
        digitalSignature: action === "approve" ? `CERT_${Date.now()}_${Math.random().toString(36).substr(2, 9)}` : undefined,
      });
    },
    onSuccess: () => {
      toast({
        title: "Éxito",
        description: "Documento procesado correctamente",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/documents/pending"] });
      queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
      queryClient.invalidateQueries({ queryKey: ["/api/commissions"] });
      setSelectedDocument(null);
      setRejectionReason("");
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handleCertify = (action: "approve" | "reject") => {
    if (action === "reject" && !rejectionReason.trim()) {
      toast({
        title: "Error",
        description: "Debe proporcionar una razón para el rechazo",
        variant: "destructive",
      });
      return;
    }

    certifyMutation.mutate({
      documentId: selectedDocument.id,
      action,
      rejectionReason: rejectionReason.trim(),
    });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending_certification":
        return <Badge className="bg-orange-100 text-orange-700">Pendiente</Badge>;
      case "certified":
        return <Badge className="bg-green-100 text-green-700">Certificado</Badge>;
      case "rejected":
        return <Badge className="bg-red-100 text-red-700">Rechazado</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const totalEarnings = commissions?.reduce((sum: number, c: any) => sum + parseFloat(c.certificadorAmount || 0), 0) || 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 role-certificador rounded-xl flex items-center justify-center">
              <Stamp size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Panel del Certificador</h1>
              <p className="text-gray-600">Revisión y certificación de documentos legales</p>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Documentos Pendientes</p>
                  <p className="text-3xl font-bold text-orange-600">
                    {pendingDocuments?.length || 0}
                  </p>
                </div>
                <Clock className="text-orange-600" size={32} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Documentos Certificados</p>
                  <p className="text-3xl font-bold text-green-600">
                    {myDocuments?.filter((d: any) => d.status === "certified").length || 0}
                  </p>
                </div>
                <CheckCircle className="text-green-600" size={32} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Comisiones Ganadas</p>
                  <p className="text-3xl font-bold text-chile-blue">
                    ${totalEarnings.toLocaleString()}
                  </p>
                </div>
                <Shield className="text-chile-blue" size={32} />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Pending Documents Queue */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="text-orange-600" />
                  <span>Documentos Pendientes de Certificación</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <CertificationQueue
                  documents={pendingDocuments || []}
                  onSelectDocument={setSelectedDocument}
                  selectedDocument={selectedDocument}
                />
              </CardContent>
            </Card>
          </div>

          {/* Document Review Panel */}
          <div>
            {selectedDocument ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Eye className="text-chile-blue" />
                    <span>Revisar Documento</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <h3 className="font-semibold text-lg">{selectedDocument.title}</h3>
                    <p className="text-gray-600">{selectedDocument.type}</p>
                    <p className="text-sm text-gray-500">
                      Enviado: {new Date(selectedDocument.createdAt).toLocaleString()}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Información del Solicitante</h4>
                    <div className="text-sm space-y-1">
                      <p><strong>Nombre:</strong> {selectedDocument.content?.nombre || "No especificado"}</p>
                      <p><strong>RUT:</strong> {selectedDocument.content?.rut || "No especificado"}</p>
                      <p><strong>Email:</strong> {selectedDocument.content?.email || "No especificado"}</p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Verificación de Identidad</h4>
                    <div className="flex items-center space-x-2">
                      {selectedDocument.isIdentityVerified ? (
                        <>
                          <CheckCircle className="text-green-600" size={16} />
                          <span className="text-green-600 text-sm">Identidad Verificada</span>
                        </>
                      ) : (
                        <>
                          <XCircle className="text-red-600" size={16} />
                          <span className="text-red-600 text-sm">Identidad No Verificada</span>
                        </>
                      )}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Contenido del Documento</h4>
                    <div className="bg-gray-50 p-3 rounded-lg text-sm max-h-32 overflow-y-auto">
                      {selectedDocument.content?.contenido || "No hay contenido disponible"}
                    </div>
                  </div>

                  <div>
                    <h4 className="font-medium mb-2">Valor del Documento</h4>
                    <p className="text-lg font-bold text-chile-red">
                      ${parseFloat(selectedDocument.price).toLocaleString()} CLP
                    </p>
                  </div>

                  {/* Rejection Reason Input */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Razón de Rechazo (opcional)
                    </label>
                    <Textarea
                      value={rejectionReason}
                      onChange={(e) => setRejectionReason(e.target.value)}
                      placeholder="Especifique la razón del rechazo si es necesario..."
                      rows={3}
                    />
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-3">
                    <Button
                      onClick={() => handleCertify("approve")}
                      disabled={certifyMutation.isPending || !selectedDocument.isIdentityVerified}
                      className="flex-1 bg-green-600 hover:bg-green-700"
                    >
                      <CheckCircle className="mr-2" size={16} />
                      Aprobar y Firmar
                    </Button>
                    <Button
                      onClick={() => handleCertify("reject")}
                      disabled={certifyMutation.isPending}
                      variant="destructive"
                      className="flex-1"
                    >
                      <XCircle className="mr-2" size={16} />
                      Rechazar
                    </Button>
                  </div>

                  {!selectedDocument.isIdentityVerified && (
                    <p className="text-sm text-amber-600 bg-amber-50 p-3 rounded-lg">
                      ⚠️ Este documento no puede ser certificado hasta que la identidad sea verificada.
                    </p>
                  )}
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <Eye className="mx-auto text-gray-400 mb-4" size={48} />
                  <p className="text-gray-500">
                    Seleccione un documento de la lista para revisar y certificar
                  </p>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Recent Activity */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Historial de Certificaciones</CardTitle>
          </CardHeader>
          <CardContent>
            {myDocuments && myDocuments.length > 0 ? (
              <div className="space-y-4">
                {myDocuments.slice(0, 10).map((doc: any) => (
                  <div key={doc.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                    <div>
                      <h4 className="font-medium">{doc.title}</h4>
                      <p className="text-sm text-gray-600">
                        {doc.type} - {new Date(doc.certifiedAt || doc.updatedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      {getStatusBadge(doc.status)}
                      <span className="text-sm font-medium">
                        ${parseFloat(doc.price).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                <FileText size={48} className="mx-auto mb-4 opacity-50" />
                <p>No hay documentos certificados aún</p>
              </div>
            )}
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
