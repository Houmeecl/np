import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, Users, DollarSign, FileText, TrendingUp, Crown, Bell, Settings } from "lucide-react";
import Navbar from "@/components/layout/navbar";

export default function SuperAdminDashboard() {
  const { data: documentStats } = useQuery({
    queryKey: ["/api/analytics/documents"],
  });

  const { data: commissionStats } = useQuery({
    queryKey: ["/api/analytics/commissions"],
  });

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 role-superadmin rounded-xl flex items-center justify-center">
              <Crown size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Dashboard Superadmin</h1>
              <p className="text-gray-600">Control total del sistema NotaryPro</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline">
              <Settings className="mr-2" size={16} />
              Configuración
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Documentos</p>
                  <p className="text-3xl font-bold text-chile-red">
                    {documentStats?.total || 0}
                  </p>
                </div>
                <FileText className="text-chile-red" size={32} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Documentos Certificados</p>
                  <p className="text-3xl font-bold text-green-600">
                    {documentStats?.certified || 0}
                  </p>
                </div>
                <TrendingUp className="text-green-600" size={32} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Ingresos Totales</p>
                  <p className="text-3xl font-bold text-chile-blue">
                    ${commissionStats?.totalAmount?.toLocaleString() || 0}
                  </p>
                </div>
                <DollarSign className="text-chile-blue" size={32} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Comisiones Pagadas</p>
                  <p className="text-3xl font-bold text-purple-600">
                    ${commissionStats?.paidAmount?.toLocaleString() || 0}
                  </p>
                </div>
                <BarChart3 className="text-purple-600" size={32} />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Management Sections */}
        <div className="grid lg:grid-cols-2 gap-8 mb-8">
          {/* User Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Users className="text-chile-red" />
                <span>Gestión de Usuarios</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium">Certificadores Activos</h4>
                    <p className="text-sm text-gray-600">12 certificadores</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Ver Todos
                  </Button>
                </div>
                
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium">POS Activos</h4>
                    <p className="text-sm text-gray-600">45 puntos de venta</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Gestionar
                  </Button>
                </div>
                
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium">Usuarios Registrados</h4>
                    <p className="text-sm text-gray-600">1,247 usuarios</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Ver Lista
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Financial Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="text-green-600" />
                <span>Gestión Financiera</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium">Comisiones Pendientes</h4>
                    <p className="text-sm text-gray-600">
                      ${(commissionStats?.totalAmount - commissionStats?.paidAmount)?.toLocaleString() || 0}
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    Procesar
                  </Button>
                </div>
                
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium">Depósitos Automáticos</h4>
                    <p className="text-sm text-gray-600">15 depósitos programados</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Configurar
                  </Button>
                </div>
                
                <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h4 className="font-medium">Informes Financieros</h4>
                    <p className="text-sm text-gray-600">Último: Enero 2024</p>
                  </div>
                  <Button variant="outline" size="sm">
                    Generar
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* AI Agent Section */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="text-purple-600" />
              <span>Agente IA - Recomendaciones Inteligentes</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="font-semibold text-chile-red">Resumen Operacional</h4>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <p className="text-sm text-blue-800">
                    📊 <strong>Hoy:</strong> Se procesaron 23 documentos con una tasa de certificación del 89%.
                    El tiempo promedio de certificación fue de 2.3 horas.
                  </p>
                </div>
                <div className="bg-green-50 p-4 rounded-lg">
                  <p className="text-sm text-green-800">
                    💰 <strong>Ingresos:</strong> Los ingresos de esta semana aumentaron 15% respecto a la semana anterior.
                    Las declaraciones juradas fueron el tipo de documento más solicitado.
                  </p>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="font-semibold text-chile-red">Estrategias de Expansión</h4>
                <div className="bg-orange-50 p-4 rounded-lg">
                  <p className="text-sm text-orange-800">
                    🗺️ <strong>Oportunidad:</strong> Se detectó alta demanda en las comunas de Maipú y Puente Alto.
                    Recomendamos establecer 3 nuevos POS en estas zonas.
                  </p>
                </div>
                <div className="bg-purple-50 p-4 rounded-lg">
                  <p className="text-sm text-purple-800">
                    🏛️ <strong>Municipios:</strong> El Municipio de Valparaíso mostró interés en una alianza.
                    Se sugiere una propuesta para servicios digitales ciudadanos.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-center">
              <Button className="btn-chile">
                <Bell className="mr-2" size={16} />
                Configurar Alertas IA
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* System Status */}
        <div className="grid lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Estado del Sistema</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Servidores</span>
                  <span className="text-green-600 text-sm font-medium">● Operativo</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Base de Datos</span>
                  <span className="text-green-600 text-sm font-medium">● Operativo</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">FaceIO</span>
                  <span className="text-green-600 text-sm font-medium">● Operativo</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">FirmaDigital.cl</span>
                  <span className="text-green-600 text-sm font-medium">● Operativo</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Métricas de Rendimiento</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm">Tiempo de Respuesta</span>
                  <span className="text-green-600 text-sm font-medium">142ms</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Disponibilidad</span>
                  <span className="text-green-600 text-sm font-medium">99.9%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">Usuarios Activos</span>
                  <span className="text-chile-blue text-sm font-medium">234</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm">POS Conectados</span>
                  <span className="text-chile-blue text-sm font-medium">42/45</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  <Users className="mr-2" size={16} />
                  Gestionar Usuarios
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <DollarSign className="mr-2" size={16} />
                  Procesar Pagos
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <BarChart3 className="mr-2" size={16} />
                  Generar Reportes
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  <Settings className="mr-2" size={16} />
                  Configuración
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
