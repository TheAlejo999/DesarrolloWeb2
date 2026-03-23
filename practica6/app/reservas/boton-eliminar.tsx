"use client";

import { cancelarReserva, confirmarReserva } from "@/app/actions/reservas";
import { useState } from "react";
import { botonPeligro } from "@/lib/estilos";

// Este componente muestra botones para cancelar o confirmar una reserva, y maneja los estados de carga y error de forma local. 
// Al cancelar, la reserva se marca como "cancelada" en lugar de eliminarse, lo que permite mantener un historial completo de reservas. 
// Al confirmar, la reserva se marca como "confirmada", lo que puede ser útil para flujos donde se requiere aprobación manual.
export function BotonEliminarReserva({ id }: { id: number }) {
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    // Maneja la cancelación de la reserva, cambiando su estado a "cancelada" en lugar de eliminarla físicamente.
    async function manejarCancelar() {
        setLoading(true);
        const resultado = await cancelarReserva(id);
        setLoading(false);
        if (!resultado.exito) {
            setError(resultado.mensaje ?? "Error desconocido");
        }
    }

    // Maneja la confirmación de la reserva, cambiando su estado a "confirmada".
    async function manejarConfirmar() {
        setLoading(true);
        const resultado = await confirmarReserva(id);
        setLoading(false);
        if (!resultado.exito) {
            setError(resultado.mensaje ?? "Error desconocido");
        }
    }

    // El componente muestra botones para cancelar o confirmar la reserva, y muestra mensajes de error si las acciones fallan.
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