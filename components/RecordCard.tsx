import React from 'react';
import { MedicalRecord } from '../types';
import { FileText, Activity, AlertCircle, Stethoscope, ChevronRight, Calendar } from 'lucide-react';

interface Props {
  record: MedicalRecord;
}

export const RecordCard: React.FC<Props> = ({ record }) => {
  const getIcon = () => {
    switch (record.type) {
      case 'Lab Report': return <Activity className="w-5 h-5 text-teal-600" />;
      case 'Prescription': return <FileText className="w-5 h-5 text-indigo-600" />;
      case 'Diagnosis': return <Stethoscope className="w-5 h-5 text-rose-500" />;
      default: return <AlertCircle className="w-5 h-5 text-slate-500" />;
    }
  };

  const getStatusColor = () => {
    switch (record.status) {
      case 'Critical': return 'bg-rose-50 text-rose-700 border-rose-100';
      case 'Attention': return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'Normal': return 'bg-teal-50 text-teal-700 border-teal-100';
      default: return 'bg-slate-50 text-slate-600 border-slate-100';
    }
  };

  return (
    <div className="group bg-white p-5 rounded-xl border border-slate-100 shadow-sm hover:shadow-md transition-all duration-200 cursor-pointer">
      <div className="flex justify-between items-start">
        <div className="flex gap-4">
          <div className="mt-1 p-2.5 bg-slate-50 rounded-lg group-hover:bg-white group-hover:shadow-sm transition-all border border-transparent group-hover:border-slate-100">
            {getIcon()}
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <h4 className="font-semibold text-slate-900">{record.type}</h4>
              <span className={`text-[10px] px-2 py-0.5 rounded-full border font-medium uppercase tracking-wide ${getStatusColor()}`}>
                {record.status}
              </span>
            </div>
            <p className="text-sm text-slate-600 line-clamp-2">{record.summary}</p>
            
            <div className="flex items-center gap-4 mt-3 text-xs text-slate-400 font-medium">
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {record.date}
              </span>
              <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
              <span>{record.doctor}</span>
              <span className="w-1 h-1 bg-slate-300 rounded-full"></span>
              <span>{record.hospital}</span>
            </div>
          </div>
        </div>
        <div className="text-slate-300 group-hover:text-teal-600 transition-colors">
          <ChevronRight className="w-5 h-5" />
        </div>
      </div>
    </div>
  );
};
