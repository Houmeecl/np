import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { User, FileText, Download, QrCode, Bell, Plus, Eye, Mail, MessageCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import Navbar from "@/components/layout/navbar";
import DocumentViewer from "@/components/document-viewer";
import { useState } from "react";
import { Link } from "wouter";

export default function UsuarioDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedDocument, setSelectedDocument] = useState<any>(null);

  const { data: documents } = useQuery({
    queryKey: ["/api/documents"],
  });

  const { data: notifications } = useQuery({
    queryKey: ["/api/notifications"],
  });

  const markNotificationReadMutation = useMutation({
    mutationFn: async (notificationId: number) => {
      await apiRequest("PATCH", `/api/notifications/${notificationId}/read`, {});
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/notifications"] });
    },
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "draft":
        return <Badge className="status-draft">Borrador</Badge>;
      case "pending_verification":
        return <Badge className="status-pending">Verificando Identidad</Badge>;
      case "pending_certification":
        return <Badge className="status-pending">Pendiente Certificación</Badge>;
      case "certified":
        return <Badge className="status-certified">Certificado</Badge>;
      case "rejected":
        return <Badge className="status-rejected">Rechazado</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const getDocumentTypeName = (type: string) => {
    switch (type) {
      case "declaracion_jurada":
        return "Declaración Jurada";
      case "finiquito_laboral":
        return "Finiquito Laboral";
      case "contrato_simple":
        return "Contrato Simple";
      default:
        return type;
    }
  };

  const handleDownloadDocument = (document: any) => {
    // Simulate PDF download
    toast({
      title: "Descarga iniciada",
      description: `Descargando ${document.title}...`,
    });
  };

  const handleSendDocument = (document: any, method: "email" | "whatsapp") => {
    toast({
      title: "Documento enviado",
      description: `Documento enviado por ${method === "email" ? "correo electrónico" : "WhatsApp"}`,
    });
  };

  const unreadNotifications = notifications?.filter((n: any) => !n.isRead) || [];
  const certifiedDocuments = documents?.filter((d: any) => d.status === "certified") || [];
  const pendingDocuments = documents?.filter((d: any) => d.status === "pending_certification" || d.status === "pending_verification") || [];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 role-usuario rounded-xl flex items-center justify-center">
              <User size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Panel del Usuario</h1>
              <p className="text-gray-600">Gestiona tus documentos certificados</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button asChild className="btn-chile">
              <Link href="/pos">
                <Plus className="mr-2" size={16} />
                Crear Documento
              </Link>
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Documentos</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {documents?.length || 0}
                  </p>
                </div>
                <FileText className="text-purple-600" size={32} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Certificados</p>
                  <p className="text-3xl font-bold text-green-600">
                    {certifiedDocuments.length}
                  </p>
                </div>
                <Download className="text-green-600" size={32} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">En Proceso</p>
                  <p className="text-3xl font-bold text-orange-600">
                    {pendingDocuments.length}
                  </p>
                </div>
                <QrCode className="text-orange-600" size={32} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Notificaciones</p>
                  <p className="text-3xl font-bold text-chile-blue">
                    {unreadNotifications.length}
                  </p>
                </div>
                <Bell className="text-chile-blue" size={32} />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Documents List */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <FileText className="text-purple-600" />
                  <span>Mis Documentos</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {documents && documents.length > 0 ? (
                  <div className="space-y-4">
                    {documents.map((doc: any) => (
                      <div key={doc.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                        <div className="flex items-center justify-between mb-3">
                          <div>
                            <h4 className="font-medium">{doc.title}</h4>
                            <p className="text-sm text-gray-600">{getDocumentTypeName(doc.type)}</p>
                            <p className="text-xs text-gray-500">
                              Creado: {new Date(doc.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            {getStatusBadge(doc.status)}
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => setSelectedDocument(doc)}
                            >
                              <Eye size={16} />
                            </Button>
                          </div>
                        </div>

                        {doc.status === "certified" && (
                          <div className="flex space-x-2 mt-3">
                            <Button
                              size="sm"
                              onClick={() => handleDownloadDocument(doc)}
                              className="btn-chile"
                            >
                              <Download className="mr-1" size={14} />
                              PDF
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleSendDocument(doc, "email")}
                            >
                              <Mail className="mr-1" size={14} />
                              Email
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleSendDocument(doc, "whatsapp")}
                            >
                              <MessageCircle className="mr-1" size={14} />
                              WhatsApp
                            </Button>
                          </div>
                        )}

                        {doc.status === "rejected" && doc.rejectionReason && (
                          <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-800">
                              <strong>Razón del rechazo:</strong> {doc.rejectionReason}
                            </p>
                          </div>
                        )}

                        {doc.qrValidationCode && doc.status === "certified" && (
                          <div className="mt-3 p-3 bg-green-50 border border-green-200 rounded-lg">
                            <p className="text-sm text-green-800">
                              <strong>Código de validación:</strong> {doc.qrValidationCode}
                            </p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <FileText size={48} className="mx-auto mb-4 opacity-50" />
                    <p className="mb-4">No tienes documentos aún</p>
                    <Button asChild className="btn-chile">
                      <Link href="/pos">
                        <Plus className="mr-2" size={16} />
                        Crear Primer Documento
                      </Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Document Viewer / Notifications */}
          <div>
            {selectedDocument ? (
              <DocumentViewer
                document={selectedDocument}
                onClose={() => setSelectedDocument(null)}
              />
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Bell className="text-chile-blue" />
                    <span>Notificaciones</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {notifications && notifications.length > 0 ? (
                    <div className="space-y-4 max-h-96 overflow-y-auto">
                      {notifications.map((notification: any) => (
                        <div
                          key={notification.id}
                          className={`p-4 rounded-lg border ${
                            notification.isRead ? "bg-gray-50 border-gray-200" : "bg-blue-50 border-blue-200"
                          }`}
                        >
                          <div className="flex items-start justify-between">
                            <div className="flex-1">
                              <h4 className={`font-medium ${notification.isRead ? "text-gray-700" : "text-blue-900"}`}>
                                {notification.title}
                              </h4>
                              <p className={`text-sm mt-1 ${notification.isRead ? "text-gray-600" : "text-blue-800"}`}>
                                {notification.message}
                              </p>
                              <p className="text-xs text-gray-500 mt-2">
                                {new Date(notification.createdAt).toLocaleString()}
                              </p>
                            </div>
                            {!notification.isRead && (
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={() => markNotificationReadMutation.mutate(notification.id)}
                              >
                                Marcar leída
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Bell size={48} className="mx-auto mb-4 opacity-50" />
                      <p>No hay notificaciones</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <Button asChild variant="outline" className="h-20 flex-col space-y-2">
                <Link href="/pos">
                  <Plus size={24} />
                  <span>Nuevo Documento</span>
                </Link>
              </Button>
              
              <Button variant="outline" className="h-20 flex-col space-y-2">
                <QrCode size={24} />
                <span>Verificar Documento</span>
              </Button>
              
              <Button variant="outline" className="h-20 flex-col space-y-2">
                <Download size={24} />
                <span>Descargar Todos</span>
              </Button>
              
              <Button variant="outline" className="h-20 flex-col space-y-2">
                <FileText size={24} />
                <span>Ayuda</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
