"use client";

import { eliminarServicio } from "../actions/servicios";
import { useState } from "react";
import { botonPeligro } from "@/lib/estilos";

// Este componente muestra un botón para eliminar un servicio, y maneja el estado de error de forma local.
export function BotonEliminarServicio({ id }: { id: number }) {
    const [error, setError] = useState<string | null>(null);

    // Maneja el clic en el botón de eliminar, llamando a la función de eliminación y actualizando el estado de error si falla.
    async function manejarClick() {
        const resultado = await eliminarServicio(id);
        if (!resultado.exito) {
            setError(resultado.mensaje ?? "Error desconocido");
        }
    }

    return (
        <div className="text-right">
            <button onClick={manejarClick} className={botonPeligro}>
                Eliminar
            </button>
            {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
        </div>
    )
}