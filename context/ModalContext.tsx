"use client";

import React, { createContext, useContext, useState, ReactNode } from "react";
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from "lucide-react";

type ModalType = "success" | "error" | "warning" | "info" | "confirm";

interface ModalOptions {
  title: string;
  message: string;
  type: ModalType;
  onConfirm?: () => void;
  onCancel?: () => void;
  confirmText?: string;
  cancelText?: string;
}

interface ModalContextType {
  showAlert: (options: Omit<ModalOptions, "onConfirm" | "onCancel">) => void;
  showConfirm: (options: ModalOptions) => void;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<ModalOptions | null>(null);

  const showAlert = (opts: Omit<ModalOptions, "onConfirm" | "onCancel">) => {
    setOptions({ ...opts, type: opts.type || "info" });
    setIsOpen(true);
  };

  const showConfirm = (opts: ModalOptions) => {
    setOptions(opts);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    if (options?.onCancel) {
      options.onCancel();
    }
  };

  const handleConfirm = () => {
    setIsOpen(false);
    if (options?.onConfirm) {
      options.onConfirm();
    }
  };

  const getIcon = (type: ModalType) => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="w-12 h-12 text-emerald-500 animate-bounce" />;
      case "error":
        return <XCircle className="w-12 h-12 text-rose-500 animate-pulse" />;
      case "warning":
      case "confirm":
        return <AlertTriangle className="w-12 h-12 text-amber-500" />;
      case "info":
      default:
        return <Info className="w-12 h-12 text-sky-500" />;
    }
  };

  const getHeaderColor = (type: ModalType) => {
    switch (type) {
      case "success":
        return "bg-emerald-50 border-emerald-100";
      case "error":
        return "bg-rose-50 border-rose-100";
      case "warning":
      case "confirm":
        return "bg-amber-50 border-amber-100";
      default:
        return "bg-sky-50 border-sky-100";
    }
  };

  return (
    <ModalContext.Provider value={{ showAlert, showConfirm, closeModal }}>
      {children}
      {isOpen && options && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fade-in">
          <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl overflow-hidden shadow-2xl transition-all scale-100 duration-300">
            
            {/* Header Colored Strip */}
            <div className={`p-6 border-b flex flex-col items-center gap-4 text-center ${getHeaderColor(options.type)}`}>
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-black/5 text-slate-400 hover:text-slate-600 transition-all cursor-pointer"
              >
                <X className="w-4.5 h-4.5" />
              </button>
              {getIcon(options.type)}
              <h3 className="text-lg font-black text-slate-800 tracking-tight leading-none">
                {options.title}
              </h3>
            </div>

            {/* Modal Body Message */}
            <div className="p-6 text-center">
              <p className="text-sm font-semibold text-slate-500 leading-relaxed whitespace-pre-line">
                {options.message}
              </p>
            </div>

            {/* Modal Action Footer */}
            <div className="p-6 border-t border-slate-100 flex items-center justify-center gap-3 bg-slate-50">
              {options.type === "confirm" ? (
                <>
                  <button
                    onClick={closeModal}
                    className="flex-1 py-3 px-4 bg-white hover:bg-slate-100 active:scale-98 text-slate-700 font-extrabold rounded-xl border border-slate-200 transition-all text-xs cursor-pointer"
                  >
                    {options.cancelText || "বাতিল"}
                  </button>
                  <button
                    onClick={handleConfirm}
                    className="flex-1 py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-extrabold rounded-xl transition-all shadow-sm text-xs cursor-pointer"
                  >
                    {options.confirmText || "নিশ্চিত করুন"}
                  </button>
                </>
              ) : (
                <button
                  onClick={handleConfirm}
                  className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-extrabold rounded-xl transition-all shadow-sm text-xs cursor-pointer text-center"
                >
                  ঠিক আছে
                </button>
              )}
            </div>

          </div>
        </div>
      )}
    </ModalContext.Provider>
  );
};

export const useModal = () => {
  const context = useContext(ModalContext);
  if (!context) {
    throw new Error("useModal must be used within a ModalProvider");
  }
  return context;
};
