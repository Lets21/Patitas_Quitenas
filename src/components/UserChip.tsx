import React, { useEffect, useRef, useState } from "react";
import { ChevronDown, LogOut, User, ListChecks } from "lucide-react";
import { useNavigate } from "react-router-dom";

type UserInfo = {
  name: string;
  email?: string;
  avatarUrl?: string;
};

type Props = {
  user: UserInfo;
  onProfile?: () => void;    // opcional: si no viene, navega a /profile
  onRequests?: () => void;   // opcional: si no viene, navega a /mis-solicitudes
  onLogout: () => void;
};

export function UserChip({ user, onProfile, onRequests, onLogout }: Props) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  // Cerrar al hacer click fuera o con ESC
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onEsc = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onEsc);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onEsc);
    };
  }, []);

  const initials = (user.name || user.email || "?")
    .split(" ")
    .map(s => s[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  // Acciones con fallback de navegación
  const goProfile = () => {
    setOpen(false);
    if (onProfile) onProfile();
    else navigate("/profile");
  };

  const goRequests = () => {
    setOpen(false);
    if (onRequests) onRequests();
    else navigate("/mis-solicitudes");
  };

  const goLogout = () => {
    setOpen(false);
    onLogout();
  };

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        onClick={() => setOpen(v => !v)}
        className="group flex items-center gap-2 rounded-full border border-black/10 bg-white px-2.5 py-1.5 shadow-sm hover:shadow transition
                   max-w-[220px] md:max-w-none"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        {/* Avatar */}
        <span className="relative inline-flex h-8 w-8 items-center justify-center overflow-hidden rounded-full bg-emerald-600/10 ring-1 ring-emerald-700/10">
          {user.avatarUrl ? (
            <img
              src={user.avatarUrl}
              alt={user.name}
              className="h-full w-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <span className="text-[12px] font-semibold text-emerald-800">
              {initials}
            </span>
          )}
        </span>

        {/* Nombre (oculto en xs) */}
        <span className="hidden sm:flex min-w-0 flex-col text-left">
          <span className="truncate text-sm font-medium text-gray-900">{user.name}</span>
          {user.email && (
            <span className="truncate text-[11px] text-gray-500">{user.email}</span>
          )}
        </span>

        <ChevronDown className="ml-1 hidden sm:block h-4 w-4 text-gray-500 group-hover:text-gray-700" />
      </button>

      {/* Dropdown */}
      {open && (
        <div
          role="menu"
          className="absolute right-0 z-50 mt-2 w-56 rounded-xl border border-black/10 bg-white/95 backdrop-blur shadow-lg"
        >
          <button
            role="menuitem"
            onClick={goProfile}
            className="flex w-full items-center gap-2 px-3 py-2.5 text-sm hover:bg-gray-50"
          >
            <User className="h-4 w-4 text-gray-600" />
            Mi perfil
          </button>
          <button
            role="menuitem"
            onClick={goRequests}
            className="flex w-full items-center gap-2 px-3 py-2.5 text-sm hover:bg-gray-50"
          >
            <ListChecks className="h-4 w-4 text-gray-600" />
            Mis solicitudes
          </button>
          <div className="my-1 h-px bg-gray-100" />
          <button
            role="menuitem"
            onClick={goLogout}
            className="flex w-full items-center gap-2 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50"
          >
            <LogOut className="h-4 w-4" />
            Salir
          </button>
        </div>
      )}
    </div>
  );
}
