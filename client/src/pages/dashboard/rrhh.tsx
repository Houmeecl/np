import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { UserCog, UserPlus, Calendar, GraduationCap, TrendingUp, BarChart3, Clock, Award } from "lucide-react";
import Navbar from "@/components/layout/navbar";

export default function RRHHDashboard() {
  // Mock data for HR functionality
  const employees = [
    {
      id: 1,
      name: "María González",
      role: "Certificador Senior",
      status: "active",
      joinDate: "2023-06-15",
      documentsProcessed: 1250,
      efficiency: 95,
      location: "Santiago"
    },
    {
      id: 2,
      name: "Carlos Mendoza",
      role: "Coordinador POS",
      status: "active",
      joinDate: "2023-08-20",
      documentsProcessed: 890,
      efficiency: 88,
      location: "Valparaíso"
    },
    {
      id: 3,
      name: "Ana Rodríguez",
      role: "Certificador Junior",
      status: "training",
      joinDate: "2024-01-10",
      documentsProcessed: 145,
      efficiency: 76,
      location: "Concepción"
    }
  ];

  const trainingPrograms = [
    {
      id: 1,
      name: "Certificación Digital Avanzada",
      participants: 8,
      duration: "40 horas",
      completion: 75,
      status: "in_progress"
    },
    {
      id: 2,
      name: "Atención al Cliente POS",
      participants: 15,
      duration: "20 horas",
      completion: 100,
      status: "completed"
    },
    {
      id: 3,
      name: "Normativa Legal Chilena",
      participants: 12,
      duration: "60 horas",
      completion: 30,
      status: "in_progress"
    }
  ];

  const onboardingQueue = [
    {
      id: 1,
      name: "Pedro Silva",
      role: "Certificador",
      stage: "documentation",
      progress: 40,
      startDate: "2024-01-15"
    },
    {
      id: 2,
      name: "Laura Torres",
      role: "Coordinador Regional",
      stage: "training",
      progress: 80,
      startDate: "2024-01-08"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-green-100 text-green-700">Activo</Badge>;
      case "training":
        return <Badge className="bg-blue-100 text-blue-700">Capacitación</Badge>;
      case "in_progress":
        return <Badge className="bg-orange-100 text-orange-700">En Progreso</Badge>;
      case "completed":
        return <Badge className="bg-green-100 text-green-700">Completado</Badge>;
      case "documentation":
        return <Badge className="bg-purple-100 text-purple-700">Documentación</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  const totalEmployees = employees.length;
  const activeEmployees = employees.filter(e => e.status === "active").length;
  const averageEfficiency = employees.reduce((sum, e) => sum + e.efficiency, 0) / employees.length;
  const activeTrainings = trainingPrograms.filter(t => t.status === "in_progress").length;

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 role-rrhh rounded-xl flex items-center justify-center">
              <UserCog size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Panel de Recursos Humanos</h1>
              <p className="text-gray-600">Gestión de personal y desarrollo organizacional</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button className="btn-chile">
              <UserPlus className="mr-2" size={16} />
              Contratar Personal
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Empleados</p>
                  <p className="text-3xl font-bold text-teal-600">
                    {totalEmployees}
                  </p>
                </div>
                <UserCog className="text-teal-600" size={32} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Empleados Activos</p>
                  <p className="text-3xl font-bold text-green-600">
                    {activeEmployees}
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
                  <p className="text-sm text-gray-600">Eficiencia Promedio</p>
                  <p className="text-3xl font-bold text-chile-blue">
                    {Math.round(averageEfficiency)}%
                  </p>
                </div>
                <BarChart3 className="text-chile-blue" size={32} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Capacitaciones Activas</p>
                  <p className="text-3xl font-bold text-purple-600">
                    {activeTrainings}
                  </p>
                </div>
                <GraduationCap className="text-purple-600" size={32} />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Employee Management */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <UserCog className="text-teal-600" />
                <span>Gestión de Personal</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {employees.map((employee) => (
                  <div key={employee.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium">{employee.name}</h4>
                        <p className="text-sm text-gray-600">{employee.role}</p>
                        <p className="text-xs text-gray-500">
                          {employee.location} • Desde {new Date(employee.joinDate).toLocaleDateString()}
                        </p>
                      </div>
                      {getStatusBadge(employee.status)}
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-gray-600">Documentos Procesados</p>
                        <p className="font-semibold">{employee.documentsProcessed.toLocaleString()}</p>
                      </div>
                      <div>
                        <p className="text-gray-600">Eficiencia</p>
                        <p className={`font-semibold ${employee.efficiency >= 90 ? "text-green-600" : employee.efficiency >= 80 ? "text-orange-600" : "text-red-600"}`}>
                          {employee.efficiency}%
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 flex space-x-2">
                      <Button variant="outline" size="sm">
                        Ver Perfil
                      </Button>
                      <Button variant="outline" size="sm">
                        Evaluar
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Training Programs */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <GraduationCap className="text-purple-600" />
                <span>Programas de Capacitación</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {trainingPrograms.map((program) => (
                  <div key={program.id} className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <h4 className="font-medium">{program.name}</h4>
                        <p className="text-sm text-gray-600">
                          {program.participants} participantes • {program.duration}
                        </p>
                      </div>
                      {getStatusBadge(program.status)}
                    </div>

                    <div className="mb-3">
                      <div className="flex justify-between text-sm mb-1">
                        <span>Progreso</span>
                        <span>{program.completion}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-purple-600 h-2 rounded-full"
                          style={{ width: `${program.completion}%` }}
                        ></div>
                      </div>
                    </div>

                    <div className="flex space-x-2">
                      <Button variant="outline" size="sm">
                        Ver Detalles
                      </Button>
                      {program.status === "in_progress" && (
                        <Button variant="outline" size="sm">
                          Gestionar
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Onboarding Queue */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <UserPlus className="text-chile-red" />
              <span>Cola de Onboarding</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-6">
              {onboardingQueue.map((candidate) => (
                <div key={candidate.id} className="p-4 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-medium">{candidate.name}</h4>
                      <p className="text-sm text-gray-600">{candidate.role}</p>
                      <p className="text-xs text-gray-500">
                        Inicio: {new Date(candidate.startDate).toLocaleDateString()}
                      </p>
                    </div>
                    {getStatusBadge(candidate.stage)}
                  </div>

                  <div className="mb-3">
                    <div className="flex justify-between text-sm mb-1">
                      <span>Progreso del Onboarding</span>
                      <span>{candidate.progress}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-chile-red h-2 rounded-full"
                        style={{ width: `${candidate.progress}%` }}
                      ></div>
                    </div>
                  </div>

                  <div className="flex space-x-2">
                    <Button variant="outline" size="sm">
                      Revisar
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

        {/* Performance Analytics */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BarChart3 className="text-chile-blue" />
              <span>Métricas de Desempeño</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              {/* Performance by Role */}
              <div>
                <h4 className="font-semibold mb-4">Rendimiento por Rol</h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Certificadores Senior</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: "95%" }}></div>
                      </div>
                      <span className="text-sm text-gray-600">95%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Coordinadores</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-500 h-2 rounded-full" style={{ width: "88%" }}></div>
                      </div>
                      <span className="text-sm text-gray-600">88%</span>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm">Certificadores Junior</span>
                    <div className="flex items-center space-x-2">
                      <div className="w-16 bg-gray-200 rounded-full h-2">
                        <div className="bg-orange-500 h-2 rounded-full" style={{ width: "76%" }}></div>
                      </div>
                      <span className="text-sm text-gray-600">76%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Training Completion */}
              <div>
                <h4 className="font-semibold mb-4">Finalización de Capacitaciones</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-green-50 rounded-lg">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-green-800">Completadas</span>
                      <span className="text-sm font-bold text-green-800">85%</span>
                    </div>
                  </div>
                  <div className="p-3 bg-orange-50 rounded-lg">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-orange-800">En Progreso</span>
                      <span className="text-sm font-bold text-orange-800">12%</span>
                    </div>
                  </div>
                  <div className="p-3 bg-red-50 rounded-lg">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-red-800">Atrasadas</span>
                      <span className="text-sm font-bold text-red-800">3%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Awards & Recognition */}
              <div>
                <h4 className="font-semibold mb-4">Reconocimientos del Mes</h4>
                <div className="space-y-3">
                  <div className="p-3 bg-yellow-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Award className="text-yellow-600" size={16} />
                      <div>
                        <p className="text-sm font-medium text-yellow-800">María González</p>
                        <p className="text-xs text-yellow-700">Mayor eficiencia</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 bg-blue-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Award className="text-blue-600" size={16} />
                      <div>
                        <p className="text-sm font-medium text-blue-800">Carlos Mendoza</p>
                        <p className="text-xs text-blue-700">Mejor colaboración</p>
                      </div>
                    </div>
                  </div>
                  <div className="p-3 bg-purple-50 rounded-lg">
                    <div className="flex items-center space-x-2">
                      <Award className="text-purple-600" size={16} />
                      <div>
                        <p className="text-sm font-medium text-purple-800">Ana Rodríguez</p>
                        <p className="text-xs text-purple-700">Progreso destacado</p>
                      </div>
                    </div>
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
                <UserPlus size={24} />
                <span>Contratar</span>
              </Button>
              
              <Button variant="outline" className="h-20 flex-col space-y-2">
                <GraduationCap size={24} />
                <span>Nueva Capacitación</span>
              </Button>
              
              <Button variant="outline" className="h-20 flex-col space-y-2">
                <Calendar size={24} />
                <span>Programar Evaluación</span>
              </Button>
              
              <Button variant="outline" className="h-20 flex-col space-y-2">
                <BarChart3 size={24} />
                <span>Generar Reporte</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
