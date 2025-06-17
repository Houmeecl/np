import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Store, DollarSign, BarChart3, MapPin, Plus, Settings, TrendingUp, FileText } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import Navbar from "@/components/layout/navbar";
import { Link } from "wouter";

export default function VecinoDashboard() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showAddLocation, setShowAddLocation] = useState(false);
  const [newLocation, setNewLocation] = useState({ name: "", address: "" });

  const { data: posLocations } = useQuery({
    queryKey: ["/api/pos-locations"],
  });

  const { data: commissions } = useQuery({
    queryKey: ["/api/commissions"],
  });

  const addLocationMutation = useMutation({
    mutationFn: async (locationData: any) => {
      await apiRequest("POST", "/api/pos-locations", locationData);
    },
    onSuccess: () => {
      toast({
        title: "Éxito",
        description: "Punto de venta agregado correctamente",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/pos-locations"] });
      setShowAddLocation(false);
      setNewLocation({ name: "", address: "" });
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const totalEarnings = commissions?.reduce((sum: number, c: any) => sum + parseFloat(c.vecinoAmount || 0), 0) || 0;
  const thisMonthEarnings = commissions?.filter((c: any) => {
    const commissionDate = new Date(c.createdAt);
    const now = new Date();
    return commissionDate.getMonth() === now.getMonth() && commissionDate.getFullYear() === now.getFullYear();
  }).reduce((sum: number, c: any) => sum + parseFloat(c.vecinoAmount || 0), 0) || 0;

  const handleAddLocation = () => {
    if (!newLocation.name.trim() || !newLocation.address.trim()) {
      toast({
        title: "Error",
        description: "Todos los campos son obligatorios",
        variant: "destructive",
      });
      return;
    }

    addLocationMutation.mutate(newLocation);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 role-vecino rounded-xl flex items-center justify-center">
              <Store size={24} />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Panel del Vecino</h1>
              <p className="text-gray-600">Gestión de puntos de venta y comisiones</p>
            </div>
          </div>
          <div className="flex items-center space-x-4">
            <Button asChild className="btn-chile">
              <Link href="/pos">
                <Store className="mr-2" size={16} />
                Abrir Terminal POS
              </Link>
            </Button>
            <Button
              variant="outline"
              onClick={() => setShowAddLocation(true)}
            >
              <Plus className="mr-2" size={16} />
              Agregar Punto
            </Button>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Puntos de Venta</p>
                  <p className="text-3xl font-bold text-green-600">
                    {posLocations?.length || 0}
                  </p>
                </div>
                <Store className="text-green-600" size={32} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Ganancias Totales</p>
                  <p className="text-3xl font-bold text-chile-red">
                    ${totalEarnings.toLocaleString()}
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
                  <p className="text-sm text-gray-600">Este Mes</p>
                  <p className="text-3xl font-bold text-chile-blue">
                    ${thisMonthEarnings.toLocaleString()}
                  </p>
                </div>
                <TrendingUp className="text-chile-blue" size={32} />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Comisión Promedio</p>
                  <p className="text-3xl font-bold text-purple-600">40%</p>
                </div>
                <BarChart3 className="text-purple-600" size={32} />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* POS Locations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <MapPin className="text-green-600" />
                <span>Mis Puntos de Venta</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {posLocations && posLocations.length > 0 ? (
                <div className="space-y-4">
                  {posLocations.map((location: any) => (
                    <div key={location.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium">{location.name}</h4>
                        <p className="text-sm text-gray-600">{location.address}</p>
                        <p className="text-xs text-gray-500">
                          Comisión: {location.commissionRate}%
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={location.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}>
                          {location.isActive ? "Activo" : "Inactivo"}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Settings size={16} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <Store size={48} className="mx-auto mb-4 opacity-50" />
                  <p className="mb-4">No tienes puntos de venta registrados</p>
                  <Button
                    onClick={() => setShowAddLocation(true)}
                    className="btn-chile"
                  >
                    <Plus className="mr-2" size={16} />
                    Agregar Primer Punto
                  </Button>
                </div>
              )}

              {/* Add Location Form */}
              {showAddLocation && (
                <div className="mt-6 p-4 bg-blue-50 rounded-lg border">
                  <h4 className="font-semibold mb-4">Agregar Nuevo Punto de Venta</h4>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Nombre del Local</Label>
                      <Input
                        id="name"
                        value={newLocation.name}
                        onChange={(e) => setNewLocation(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Ej: Almacén Don Juan"
                      />
                    </div>
                    <div>
                      <Label htmlFor="address">Dirección</Label>
                      <Input
                        id="address"
                        value={newLocation.address}
                        onChange={(e) => setNewLocation(prev => ({ ...prev, address: e.target.value }))}
                        placeholder="Ej: Av. Principal 123, Comuna, Región"
                      />
                    </div>
                    <div className="flex space-x-3">
                      <Button
                        onClick={handleAddLocation}
                        disabled={addLocationMutation.isPending}
                        className="btn-chile flex-1"
                      >
                        {addLocationMutation.isPending ? "Agregando..." : "Agregar"}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => {
                          setShowAddLocation(false);
                          setNewLocation({ name: "", address: "" });
                        }}
                        className="flex-1"
                      >
                        Cancelar
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Commission History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <DollarSign className="text-chile-red" />
                <span>Historial de Comisiones</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              {commissions && commissions.length > 0 ? (
                <div className="space-y-4">
                  {commissions.slice(0, 10).map((commission: any) => (
                    <div key={commission.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div>
                        <h4 className="font-medium">Documento #{commission.documentId}</h4>
                        <p className="text-sm text-gray-600">
                          {new Date(commission.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-green-600">
                          +${parseFloat(commission.vecinoAmount).toLocaleString()}
                        </p>
                        <Badge className={commission.isPaid ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}>
                          {commission.isPaid ? "Pagado" : "Pendiente"}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <DollarSign size={48} className="mx-auto mb-4 opacity-50" />
                  <p>No hay comisiones registradas aún</p>
                </div>
              )}
            </CardContent>
          </Card>
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
                  <Store size={24} />
                  <span>Terminal POS</span>
                </Link>
              </Button>
              
              <Button variant="outline" className="h-20 flex-col space-y-2">
                <BarChart3 size={24} />
                <span>Reportes</span>
              </Button>
              
              <Button variant="outline" className="h-20 flex-col space-y-2">
                <Settings size={24} />
                <span>Configuración</span>
              </Button>
              
              <Button variant="outline" className="h-20 flex-col space-y-2">
                <FileText size={24} />
                <span>Manual</span>
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Revenue Chart placeholder */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Evolución de Ingresos</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
              <div className="text-center text-gray-500">
                <BarChart3 size={48} className="mx-auto mb-4 opacity-50" />
                <p>Gráfico de ingresos por implementar</p>
                <p className="text-sm">Se mostrará la evolución mensual de comisiones</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}
