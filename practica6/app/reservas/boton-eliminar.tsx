"use client";

import { cancelarReserva, confirmarReserva } from "@/app/actions/reservas";
import { useState } from "react";
import { botonPeligro } from "@/lib/estilos";

export function BotonEliminarReserva({ id }: { id: number }) {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    async function manejarCancelar() {
        setLoading(true);
        const resultado = await cancelarReserva(id);
        setLoading(false);
        if (!resultado.exito) {
            setError(resultado.mensaje ?? "Error desconocido");
        }
    }

    async function manejarConfirmar() {
        setLoading(true);
        const resultado = await confirmarReserva(id);
        setLoading(false);
        if (!resultado.exito) {
            setError(resultado.mensaje ?? "Error desconocido");
        }
    }

    return (
        <div className="text-right shrink-0 ml-4 flex flex-col gap-2">
            <button onClick={manejarCancelar} className={botonPeligro} disabled={loading}>
                Cancelar
            </button>
            <button onClick={manejarConfirmar} className="bg-green-600 text-white px-3 py-1 rounded text-xs hover:bg-green-700" disabled={loading}>
                Confirmar
            </button>
            {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
        </div>
    );
}