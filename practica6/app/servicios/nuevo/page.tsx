"use client";

import { useActionState } from "react";
import { useFormStatus } from "react-dom";
import { crearServicio } from "@/app/actions/servicios";
import { input, label, botonPrimario } from "@/lib/estilos";

const estadoInicial = { errores: {} as Record<string, string[]>, mensaje: "" };

function BotonEnviar() {
    const { pending } = useFormStatus();
    return (
        <button type="submit" className={botonPrimario} disabled={pending}>
            {pending ? "Guardando..." : "Crear Servicio"}
        </button>
    );
}