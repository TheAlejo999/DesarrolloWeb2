"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { z } from "zod";
import { prisma } from "@/lib/prisma";

const EsquemaReserva = z.object({
    nombre: z.string().min(1, "El nombre es obligatorio."),
    correo: z.string().email("El correo no es válido."),
    fecha: z.string().min(1, "La fecha es obligatoria."),
    servicioId: z.coerce.number({message: "Debe seleccionar un servicio"}),
/**
 * Crea una nueva reserva validando que no haya conflicto de horario para el mismo servicio.
 * - Valida los campos del formulario.
 * - Busca el servicio y su duración.
 * - Verifica que no exista otra reserva activa (no cancelada) que se cruce en el horario.
 * - Si hay conflicto, retorna error; si no, crea la reserva.
 */
});


export async function crearReserva(_estadoPrevio: any, formData: FormData) {
    const campos = EsquemaReserva.safeParse({
        nombre: formData.get("nombre"),
        correo: formData.get("correo"),
        fecha: formData.get("fecha"),
        servicioId: formData.get("servicioId"),
    });

    if (!campos.success) {
        return {
            errores: campos.error.flatten().fieldErrors,
            mensaje: "Error de validación.",
        };
    }

    const servicio = await prisma.servicio.findUnique({ where: { id: campos.data.servicioId } });
    if (!servicio) {
        return { errores: { servicioId: ["Servicio no encontrado."] }, mensaje: "" };
    }
    const fechaInicio = new Date(campos.data.fecha);
    const fechaFin = new Date(fechaInicio.getTime() + servicio.duracion * 60000);
    const conflicto = await prisma.reserva.findFirst({
        where: {
            servicioId: campos.data.servicioId,
            estado: { not: "cancelada" },
            OR: [
                {
                    fecha: {
                        gte: fechaInicio,
                        lt: fechaFin,
                    },
                },
                {
                    AND: [
                        { fecha: { lte: fechaInicio } },
                        { fecha: { gt: new Date(fechaInicio.getTime() - servicio.duracion * 60000) } },
                    ],
                },
            ],
        },
    });
    if (conflicto) {
        return {
            errores: { fecha: ["Ya existe una reserva para este servicio en ese horario."] },
            mensaje: "Conflicto de horario.",
        };
    }

    await prisma.reserva.create({
        data: {
            nombre: campos.data.nombre,
            correo: campos.data.correo,
            fecha: fechaInicio,
            servicioId: campos.data.servicioId,
        },
    });

    revalidatePath("/reservas");
/**
 * Cancela una reserva cambiando su estado a "cancelada" (no la elimina físicamente).
 * Esto permite mantener el historial de reservas y distinguir entre reservas activas y canceladas.
 */
    redirect("/reservas");
}

export async function cancelarReserva(id: number) {
    try {
        await prisma.reserva.update({ where: { id }, data: { estado: "cancelada" } });
        revalidatePath("/reservas");
        return { exito: true };
    } catch {
        return { exito: false, mensaje: "No se pudo cancelar la reserva." };
/**
 * Confirma una reserva cambiando su estado a "confirmada".
 * Útil para flujos donde una reserva debe ser aprobada o confirmada manualmente.
 */
    }
}

export async function confirmarReserva(id: number) {
    try {
        await prisma.reserva.update({ where: { id }, data: { estado: "confirmada" } });
        revalidatePath("/reservas");
        return { exito: true };
    } catch {
        return { exito: false, mensaje: "No se pudo confirmar la reserva." };
/**
 * Elimina una reserva de la base de datos (borrado físico).
 * Se recomienda usar cancelarReserva para mantener historial, pero esta función está disponible si se requiere borrado total.
 */
    }
}

export async function eliminarReserva(id: number) {
    try {
        await prisma.reserva.delete({ where: { id } });
        revalidatePath("/reservas");
        return { exito: true };
    } catch {
        return { exito: false, mensaje: "No se pudo eliminar la reserva." };
    }
}