import React from 'react';
import { Bell, Download, Edit, Heart, Plus, Search, Settings, Trash2 } from 'react-feather';

import { IconButtonComponent } from './IconButtonComponent';

// Ejemplo de uso del IconButton
const IconButtonExample: React.FC = () => {
  return (
    <div className="p-8 space-y-8">
      <h2 className="text-2xl font-bold text-gray-800">IconButton Examples</h2>

      {/* Variantes */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">Variantes</h3>
        <div className="flex flex-wrap gap-3">
          <IconButtonComponent icon={<Edit />} variant="primary" tooltip="Editar" />
          <IconButtonComponent icon={<Trash2 />} variant="danger" tooltip="Eliminar" />
          <IconButtonComponent icon={<Plus />} variant="success" tooltip="Agregar" />
          <IconButtonComponent icon={<Download />} variant="secondary" tooltip="Descargar" />
          <IconButtonComponent icon={<Heart />} variant="warning" tooltip="Me gusta" />
          <IconButtonComponent icon={<Settings />} variant="info" tooltip="Configuración" />
          <IconButtonComponent icon={<Bell />} variant="ghost" tooltip="Notificaciones" />
          <IconButtonComponent icon={<Search />} variant="outline" tooltip="Buscar" />
          <IconButtonComponent icon={<Edit />} variant="minimal" tooltip="Editar mínimo" />
        </div>
      </div>

      {/* Tamaños */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">Tamaños</h3>
        <div className="flex items-center gap-3">
          <IconButtonComponent icon={<Edit />} size="sm" tooltip="Pequeño" />
          <IconButtonComponent icon={<Edit />} size="md" tooltip="Mediano" />
          <IconButtonComponent icon={<Edit />} size="lg" tooltip="Grande" />
        </div>
      </div>

      {/* Formas */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">Formas</h3>
        <div className="flex gap-3">
          <IconButtonComponent icon={<Edit />} shape="square" tooltip="Cuadrado" />
          <IconButtonComponent icon={<Edit />} shape="rounded" tooltip="Redondeado" />
          <IconButtonComponent icon={<Edit />} shape="circle" tooltip="Circular" />
        </div>
      </div>

      {/* Estados */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">Estados</h3>
        <div className="flex gap-3">
          <IconButtonComponent icon={<Edit />} tooltip="Normal" />
          <IconButtonComponent icon={<Edit />} disabled tooltip="Deshabilitado" />
          <IconButtonComponent icon={<Edit />} loading tooltip="Cargando" />
        </div>
      </div>

      {/* Con badges */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">Con Badges</h3>
        <div className="flex gap-3">
          <IconButtonComponent icon={<Bell />} badge={3} badgeColor="primary" tooltip="3 notificaciones" />
          <IconButtonComponent icon={<Bell />} badge={99} badgeColor="danger" tooltip="99 notificaciones" />
          <IconButtonComponent icon={<Bell />} badge={150} badgeColor="success" tooltip="150+ notificaciones" />
          <IconButtonComponent icon={<Bell />} badge={true} badgeColor="warning" tooltip="Nueva notificación" />
        </div>
      </div>

      {/* Casos de uso reales */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-700">Casos de Uso Reales</h3>
        <div className="flex flex-wrap gap-3">
          <IconButtonComponent
            icon={<Edit />}
            variant="ghost"
            size="sm"
            tooltip="Editar curso"
            onClick={() => console.log('Editando curso...')}
          />
          <IconButtonComponent
            icon={<Trash2 />}
            variant="danger"
            size="sm"
            tooltip="Eliminar curso"
            onClick={() => console.log('Eliminando curso...')}
          />
          <IconButtonComponent
            icon={<Plus />}
            variant="primary"
            shape="circle"
            tooltip="Agregar nuevo curso"
            onClick={() => console.log('Agregando curso...')}
          />
          <IconButtonComponent
            icon={<Download />}
            variant="outline"
            size="sm"
            tooltip="Descargar recursos"
            onClick={() => console.log('Descargando...')}
          />
        </div>
      </div>
    </div>
  );
};

export default IconButtonExample;
