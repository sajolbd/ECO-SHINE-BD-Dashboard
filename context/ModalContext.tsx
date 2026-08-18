"use client";

import React, { createContext, useContext, useState, useRef, ReactNode } from "react";
import { CheckCircle2, AlertTriangle, XCircle, Info, X, Trash2 } from "lucide-react";

type ModalType = "success" | "error" | "warning" | "info" | "danger";

interface AlertOptions {
  title: string;
  message: string;
  type: ModalType;
}

interface ConfirmOptions {
  title: string;
  message: string;
  type?: ModalType;
  confirmText?: string;
  cancelText?: string;
}

interface ModalContextType {
  showAlert: (options: AlertOptions) => void;
  showConfirm: (options: ConfirmOptions) => Promise<boolean>;
  closeModal: () => void;
}

const ModalContext = createContext<ModalContextType | undefined>(undefined);

interface ModalState {
  isOpen: boolean;
  isConfirm: boolean;
  title: string;
  message: string;
  type: ModalType;
  confirmText: string;
  cancelText: string;
}

export const ModalProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [modal, setModal] = useState<ModalState>({
    isOpen: false,
    isConfirm: false,
    title: "",
    message: "",
    type: "info",
    confirmText: "নিশ্চিত করুন",
    cancelText: "বাতিল",
  });

  // Hold promise resolver for confirm
  const resolverRef = useRef<((val: boolean) => void) | null>(null);

  const showAlert = (opts: AlertOptions) => {
    setModal({
      isOpen: true,
      isConfirm: false,
      title: opts.title,
      message: opts.message,
      type: opts.type,
      confirmText: "ঠিক আছে",
      cancelText: "বাতিল",
    });
  };

  const showConfirm = (opts: ConfirmOptions): Promise<boolean> => {
    return new Promise((resolve) => {
      resolverRef.current = resolve;
      setModal({
        isOpen: true,
        isConfirm: true,
        title: opts.title,
        message: opts.message,
        type: opts.type || "warning",
        confirmText: opts.confirmText || "নিশ্চিত করুন",
        cancelText: opts.cancelText || "বাতিল",
      });
    });
  };

  const closeModal = () => {
    setModal((prev) => ({ ...prev, isOpen: false }));
    if (resolverRef.current) {
      resolverRef.current(false);
      resolverRef.current = null;
    }
  };

  const handleConfirm = () => {
    setModal((prev) => ({ ...prev, isOpen: false }));
    if (resolverRef.current) {
      resolverRef.current(true);
      resolverRef.current = null;
    }
  };

  const getIcon = (type: ModalType) => {
    switch (type) {
      case "success":
        return <CheckCircle2 className="w-12 h-12 text-emerald-500" />;
      case "error":
        return <XCircle className="w-12 h-12 text-rose-500" />;
      case "danger":
        return <Trash2 className="w-12 h-12 text-red-500" />;
      case "warning":
        return <AlertTriangle className="w-12 h-12 text-amber-500" />;
      case "info":
      default:
        return <Info className="w-12 h-12 text-sky-500" />;
    }
  };

  const getColors = (type: ModalType) => {
    switch (type) {
      case "success":
        return {
          header: "bg-emerald-50 border-emerald-100",
          btn: "bg-emerald-600 hover:bg-emerald-700",
          title: "text-emerald-700",
        };
      case "error":
        return {
          header: "bg-rose-50 border-rose-100",
          btn: "bg-rose-600 hover:bg-rose-700",
          title: "text-rose-700",
        };
      case "danger":
        return {
          header: "bg-red-50 border-red-100",
          btn: "bg-red-600 hover:bg-red-700",
          title: "text-red-700",
        };
      case "warning":
        return {
          header: "bg-amber-50 border-amber-100",
          btn: "bg-amber-600 hover:bg-amber-700",
          title: "text-amber-700",
        };
      default:
        return {
          header: "bg-sky-50 border-sky-100",
          btn: "bg-sky-600 hover:bg-sky-700",
          title: "text-sky-700",
        };
    }
  };

  const colors = getColors(modal.type);

  return (
    <ModalContext.Provider value={{ showAlert, showConfirm, closeModal }}>
      {children}

      {/* Beautiful Custom Modal */}
      {modal.isOpen && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-slate-900/55 backdrop-blur-sm">
          {/* Backdrop click closes modal */}
          <div className="absolute inset-0" onClick={closeModal} />

          <div
            className="relative w-full max-w-sm bg-white rounded-3xl overflow-hidden shadow-2xl z-10"
            style={{ animation: "modalPop 0.2s cubic-bezier(0.34,1.56,0.64,1)" }}
          >
            {/* Colored Header */}
            <div className={`p-7 border-b flex flex-col items-center gap-3 text-center ${colors.header}`}>
              {/* Close X */}
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 p-1.5 rounded-full hover:bg-black/8 text-slate-400 hover:text-slate-600 transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Animated icon */}
              <div className="p-3 rounded-full bg-white/70 shadow-sm">
                {getIcon(modal.type)}
              </div>

              <h3 className={`text-lg font-black tracking-tight leading-tight ${colors.title}`}>
                {modal.title}
              </h3>
            </div>

            {/* Message Body */}
            <div className="px-7 py-5 text-center">
              <p className="text-sm font-semibold text-slate-500 leading-relaxed whitespace-pre-line">
                {modal.message}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="px-7 pb-7 flex items-center gap-3">
              {modal.isConfirm ? (
                <>
                  <button
                    onClick={closeModal}
                    className="flex-1 py-3 px-4 bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold rounded-xl border border-slate-200 transition-all text-sm cursor-pointer"
                  >
                    {modal.cancelText}
                  </button>
                  <button
                    onClick={handleConfirm}
                    className={`flex-1 py-3 px-4 ${colors.btn} text-white font-extrabold rounded-xl transition-all shadow-sm text-sm cursor-pointer`}
                  >
                    {modal.confirmText}
                  </button>
                </>
              ) : (
                <button
                  onClick={handleConfirm}
                  className={`w-full py-3 px-4 ${colors.btn} text-white font-extrabold rounded-xl transition-all shadow-sm text-sm cursor-pointer`}
                >
                  {modal.confirmText}
                </button>
              )}
            </div>
          </div>

          <style>{`
            @keyframes modalPop {
              0% { opacity: 0; transform: scale(0.8) translateY(20px); }
              100% { opacity: 1; transform: scale(1) translateY(0); }
            }
          `}</style>
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
