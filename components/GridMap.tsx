import React from 'react';
import { Ambulance, Coordinate } from '../types';
import { GRID_SIZE } from '../constants';
import { MapPin, Ambulance as AmbIcon } from 'lucide-react';

interface Props {
  userLocation: Coordinate;
  ambulances: Ambulance[];
  nearestAmbulance: Ambulance | null;
}

export const GridMap: React.FC<Props> = ({ userLocation, ambulances, nearestAmbulance }) => {
  // Convert grid coordinates to percentages for CSS positioning
  const getPos = (coord: Coordinate) => ({
    left: `${(coord.x / GRID_SIZE) * 100}%`,
    top: `${(coord.y / GRID_SIZE) * 100}%`
  });

  return (
    <div className="relative w-full aspect-square max-w-md mx-auto bg-gray-900 rounded-2xl overflow-hidden shadow-2xl border-4 border-gray-800">
      {/* Grid Lines Background */}
      <div className="absolute inset-0 opacity-20" 
           style={{ 
             backgroundImage: 'linear-gradient(#444 1px, transparent 1px), linear-gradient(90deg, #444 1px, transparent 1px)',
             backgroundSize: '20px 20px'
           }}>
      </div>

      {/* Radar effect */}
      <div className="absolute top-1/2 left-1/2 w-[140%] h-[140%] -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-transparent via-green-500/10 to-transparent animate-[spin_4s_linear_infinite] rounded-full pointer-events-none opacity-30"></div>

      {/* User Location */}
      <div 
        className="absolute w-6 h-6 -ml-3 -mt-3 flex items-center justify-center z-20"
        style={getPos(userLocation)}
      >
        <div className="absolute inset-0 bg-blue-500 rounded-full animate-ping opacity-75"></div>
        <div className="relative bg-blue-500 text-white rounded-full p-1 shadow-lg ring-2 ring-white">
          <MapPin size={14} />
        </div>
      </div>

      {/* Ambulances */}
      {ambulances.map((amb) => {
        const isNearest = nearestAmbulance?.id === amb.id;
        const isBusy = amb.status === 'Busy';
        
        return (
          <div
            key={amb.id}
            className={`absolute transition-all duration-1000 ease-in-out z-10 ${isNearest ? 'z-30' : ''}`}
            style={getPos(amb.location)}
          >
             {/* Connection Line to Nearest */}
             {isNearest && (
               <svg className="absolute top-0 left-0 w-[500px] h-[500px] pointer-events-none overflow-visible -ml-[250px] -mt-[250px]">
                 <line 
                   x1="250" 
                   y1="250" 
                   x2={250 + ((userLocation.x - amb.location.x) / GRID_SIZE) * 100 * -4 } // Rough visual approximation for SVG line scaling in this container
                   y2={250 + ((userLocation.y - amb.location.y) / GRID_SIZE) * 100 * -4 }
                   stroke="#22c55e" 
                   strokeWidth="2" 
                   strokeDasharray="4"
                   className="animate-pulse"
                 />
               </svg>
             )}

            <div className={`
              -ml-3 -mt-3 p-1.5 rounded-full shadow-lg ring-1 ring-white/50
              ${isNearest ? 'bg-green-600 scale-125' : isBusy ? 'bg-red-500 opacity-60' : 'bg-gray-600'}
            `}>
              <AmbIcon size={12} className="text-white" />
            </div>
            
            {/* Tooltip-like label */}
            {isNearest && (
              <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-green-600 text-white text-[10px] px-2 py-1 rounded whitespace-nowrap font-bold">
                {amb.eta} min
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
