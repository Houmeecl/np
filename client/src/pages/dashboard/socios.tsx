import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Handshake, TrendingUp, Users, DollarSign, Network, FileText, PieChart, Building } from "lucide-react";
import Navbar from "@/components/layout/navbar";

export default function SociosDashboard() {
  const { data: commissions } = useQuery({
    queryKey: ["/api/commissions"],
  });

  // Mock data for partners functionality
  const partnerships = [
    {
      id: 1,
      name: "Municipalidad de Santiago",
      type: "Gobierno Local",
      status: "active",
      documentsProcessed: 450,
      revenue: 125000,
      startDate: "2024-01-15"
    },
    {
      id: 2,
      name: "SEREMI Valparaíso",
      type: "Gobierno Regional",
      status: "pending",
      documentsProcessed: 0,
      revenue: 0,
      startDate: null
    },
    {
      id: 3,
      name: "Comunidad Mapuche Temuco",
      type: "Comunidad Indígena",
      status: "active",
      documentsProcessed: 89,
      revenue: 45000,
      startDate: "2024-02-20"
    }
  ];

  const projects = [
    {
      id: 1,
      name: "Digitalización Servicios Municipales",
      partner: "Municipalidad de Santiago",
      status: "in_progress",
      completion: 75,
      budget: 500000,
      deadline: "2024-06-30"
    },
    {
      id: 2,
      name: "Certificación Territorial Indígena",
      partner: "Comunidad Mapuche Temuco",
      status: "planning",
      completion: 15,
      budget: 200000,
      deadline: "2024-08-15"
    }
  ];

  const totalRevenue = partnerships.reduce((sum, p) => sum + p.revenue, 0);
  const activePartnerships = partnerships.filter(p => p.status === "active").length;
  const totalDocuments = partnerships.reduce((sum, p) => sum + p.documentsProcessed, 0);

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-700">Activo</Badge>;
      case "pending":
        return <Badge className="bg-orange-100 text-orange-700">Pendiente</Badge>;
      case "in_progress":
        return <Badge className="bg-blue-100 text-blue-700">En Progreso</Badge>;
      case "planning":
        return <Badge className="bg-purple-100 text-purple-700">Planificación</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 role-socios rounded-xl flex items-center justify-center">
              <Handshake size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Panel de Socios</h1>
              <p className="text-gray-600">Gestión de alianzas y colaboraciones empresariales</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button className="btn-chile">
              <Building className="mr-2" size={16} />
              Nueva Alianza
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Alianzas Activas</p>
                  <p className="text-3xl font-bold text-orange-600">
                    {activePartnerships}
                  </p>
                </div>
                <Handshake className="text-orange-600" size={32} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Ingresos Conjuntos</p>
                  <p className="text-3xl font-bold text-chile-red">
                    ${totalRevenue.toLocaleString()}
                  </p>
                </div>
                <DollarSign className="text-chile-red" size={32} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Documentos Procesados</p>
                  <p className="text-3xl font-bold text-chile-blue">
                    {totalDocuments.toLocaleString()}
                  </p>
                </div>
                <FileText className="text-chile-blue" size={32} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Proyectos Activos</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {projects.filter(p => p.status === "in_progress").length}
                  </p>
                </div>
                <TrendingUp className="text-purple-600" size={32} />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Partnerships */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Network className="text-orange-600" />
                <span>Red de Alianzas</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {partnerships.map((partnership) => (
                  <div key={partnership.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium">{partnership.name}</h4>
                        <p className="text-sm text-gray-600">{partnership.type}</p>
                        {partnership.startDate && (
                          <p className="text-xs text-gray-500">
                            Desde: {new Date(partnership.startDate).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                      {getStatusBadge(partnership.status)}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Documentos</p>
                        <p className="font-semibold">{partnership.documentsProcessed.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Ingresos</p>
                        <p className="font-semibold text-green-600">
                          ${partnership.revenue.toLocaleString()}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 flex space-x-2">
                      <Button variant="outline" size="sm">
                        Ver Detalles
                      </Button>
                      <Button variant="outline" size="sm">
                        Contactar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Projects */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <PieChart className="text-chile-blue" />
                <span>Proyectos Especiales</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {projects.map((project) => (
                  <div key={project.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium">{project.name}</h4>
                        <p className="text-sm text-gray-600">{project.partner}</p>
                        <p className="text-xs text-gray-500">
                          Fecha límite: {new Date(project.deadline).toLocaleDateString()}
                        </p>
                      </div>
                      {getStatusBadge(project.status)}
                    </div>

                    <div className="mb-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progreso</span>
                        <span>{project.completion}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-chile-blue h-2 rounded-full"
                          style={{ width: `${project.completion}%` }}
                        ></div>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 gap-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Presupuesto:</span>
                        <span className="font-semibold">${project.budget.toLocaleString()}</span>
                      </div>
                    </div>

                    <div className="mt-3 flex space-x-2">
                      <Button variant="outline" size="sm">
                        Ver Proyecto
                      </Button>
                      <Button variant="outline" size="sm">
                        Actualizar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Collaboration Metrics */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <TrendingUp className="text-purple-600" />
              <span>Métricas de Colaboración</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              {/* Partnership Types Chart */}
              <div className="text-center">
                <h4 className="font-semibold mb-4">Tipos de Alianzas</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Gobierno Local</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: "60%" }}></div>
                      </div>
                      <span className="text-sm text-gray-600">60%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Comunidades</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: "30%" }}></div>
                      </div>
                      <span className="text-sm text-gray-600">30%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Gobierno Regional</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div className="bg-orange-500 h-2 rounded-full" style={{ width: "10%" }}></div>
                      </div>
                      <span className="text-sm text-gray-600">10%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Revenue Distribution */}
              <div className="text-center">
                <h4 className="font-semibold mb-4">Distribución de Ingresos</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-sm">NotaryPro</span>
                    <span className="font-semibold text-chile-red">65%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm">Socios</span>
                    <span className="font-semibold text-orange-600">35%</span>
                  </div>
                  <div className="border-t pt-2">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium">Total Mes</span>
                      <span className="font-bold text-chile-blue">
                        ${totalRevenue.toLocaleString()}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Growth Opportunities */}
              <div>
                <h4 className="font-semibold mb-4">Oportunidades de Crecimiento</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <p className="text-sm font-medium text-green-800">Región de Los Lagos</p>
                    <p className="text-xs text-green-700">3 municipios interesados</p>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <p className="text-sm font-medium text-blue-800">Comunidades Aymaras</p>
                    <p className="text-xs text-blue-700">Certificación territorial</p>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <p className="text-sm font-medium text-purple-800">SEREMI Metropolitana</p>
                    <p className="text-xs text-purple-700">Servicios digitales</p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-4 gap-4">
              <Button variant="outline" className="h-20 flex-col space-y-2">
                <Building size={24} />
                <span>Nueva Alianza</span>
              </Button>
              
              <Button variant="outline" className="h-20 flex-col space-y-2">
                <PieChart size={24} />
                <span>Crear Proyecto</span>
              </Button>
              
              <Button variant="outline" className="h-20 flex-col space-y-2">
                <TrendingUp size={24} />
                <span>Reportes</span>
              </Button>
              
              <Button variant="outline" className="h-20 flex-col space-y-2">
                <Users size={24} />
                <span>Contactos</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
