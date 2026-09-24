import React, { useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertTriangle, Info, XCircle, X } from 'lucide-react';

export const NotificationToast: React.FC = () => {
  const { notification, setNotification } = useApp();

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification, setNotification]);

  if (!notification) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />,
    error: <XCircle className="w-5 h-5 text-red-600 shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-600 shrink-0" />,
  };

  const borders = {
    success: 'border-emerald-300 bg-white',
    warning: 'border-amber-300 bg-white',
    error: 'border-red-300 bg-white',
    info: 'border-blue-300 bg-white',
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-sm w-full p-4 rounded-2xl shadow-xl border-2 animate-in slide-in-from-bottom-3 duration-200">
      <div className={`p-4 rounded-xl border ${borders[notification.type]} shadow-xs flex items-start gap-3`}>
        {icons[notification.type]}
        <div className="flex-1">
          <h4 className="text-xs font-black text-slate-900">{notification.title}</h4>
          <p className="text-xs text-slate-600 mt-0.5 leading-snug">{notification.message}</p>
        </div>
        <button
          onClick={() => setNotification(null)}
          className="text-slate-400 hover:text-slate-700"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
