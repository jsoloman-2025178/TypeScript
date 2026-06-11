"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const readline = __importStar(require("readline"));
const incidentes_1 = require("./incidentes");
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});
function pregunta(texto) {
    return new Promise((resolve) => {
        rl.question(texto, resolve);
    });
}
function validarPrioridad(input) {
    return input === 'alta' || input === 'media' || input === 'baja';
}
function validarEstado(input) {
    return input === 'abierto' || input === 'en progreso' || input === 'resuelto';
}
function validarCampoObligatorio(input, nombreCampo) {
    if (!input || input.trim().length === 0) {
        return `✗ Error: ${nombreCampo} es obligatorio`;
    }
    return null;
}
function mostrarMenu() {
    console.log('\n=== SISTEMA DE INCIDENTES ===');
    console.log('1. Crear incidente');
    console.log('2. Ver incidentes');
    console.log('3. Actualizar estado');
    console.log('4. Salir');
    console.log('===============================');
}
async function crearIncidente() {
    console.log('\n--- NUEVO INCIDENTE ---');
    // Validar titulo (obligatorio)
    let titulo;
    while (true) {
        const input = await pregunta('Titulo: ');
        const error = validarCampoObligatorio(input, 'Titulo');
        if (!error) {
            titulo = input.trim();
            break;
        }
        console.log(error);
    }
    // Validar descripcion (obligatoria)
    let descripcion;
    while (true) {
        const input = await pregunta('Descripcion: ');
        const error = validarCampoObligatorio(input, 'Descripcion');
        if (!error) {
            descripcion = input.trim();
            break;
        }
        console.log(error);
    }
    // Validar reportado por (obligatorio)
    let reportadoPor;
    while (true) {
        const input = await pregunta('Reportado por: ');
        const error = validarCampoObligatorio(input, 'Reportado por');
        if (!error) {
            reportadoPor = input.trim();
            break;
        }
        console.log(error);
    }
    // Validar prioridad
    let prioridad;
    while (true) {
        const input = await pregunta('Prioridad (alta/media/baja): ');
        if (validarPrioridad(input)) {
            prioridad = input;
            break;
        }
        console.log('✗ Prioridad invalida. Use: alta, media o baja');
    }
    const incidente = {
        titulo,
        descripcion,
        reportadoPor,
        prioridad,
        estado: 'abierto',
        fechaCreacion: new Date()
    };
    const id = (0, incidentes_1.agregar)(incidente);
    console.log(`\n✓ Incidente creado con ID: ${id}`);
}
function verIncidentes() {
    const todos = (0, incidentes_1.listar)();
    if (todos.length === 0) {
        console.log('\nNo hay incidentes registrados');
        return;
    }
    console.log('\n--- LISTA DE INCIDENTES ---');
    todos.forEach((inc, idx) => {
        console.log(`\n[ID: ${idx + 1}]`);
        console.log(`Titulo: ${inc.titulo}`);
        console.log(`Prioridad: ${inc.prioridad}`);
        console.log(`Estado: ${inc.estado}`);
        console.log(`Reportado por: ${inc.reportadoPor}`);
        console.log(`Fecha: ${inc.fechaCreacion.toLocaleString()}`);
        console.log(`Descripcion: ${inc.descripcion}`);
        console.log('-'.repeat(30));
    });
}
async function actualizarEstadoIncidente() {
    const todos = (0, incidentes_1.listar)();
    if (todos.length === 0) {
        console.log('\nNo hay incidentes para actualizar');
        return;
    }
    console.log('\n--- INCIDENTES DISPONIBLES ---');
    todos.forEach((inc, idx) => {
        console.log(`${idx + 1}. ${inc.titulo} - Estado actual: ${inc.estado}`);
    });
    // Validar que el ID sea un numero
    let id;
    while (true) {
        const idInput = await pregunta('\nID del incidente: ');
        const parsedId = parseInt(idInput);
        if (isNaN(parsedId)) {
            console.log('✗ Error: Debe ingresar un numero valido');
            continue;
        }
        if (!(0, incidentes_1.existe)(parsedId)) {
            console.log('✗ Error: No existe un incidente con ese ID');
            continue;
        }
        id = parsedId;
        break;
    }
    const inc = (0, incidentes_1.obtener)(id);
    console.log(`\nIncidente: ${inc?.titulo}`);
    console.log(`Estado actual: ${inc?.estado}`);
    // Validar nuevo estado
    let nuevoEstado;
    while (true) {
        const input = await pregunta('Nuevo estado (abierto/en progreso/resuelto): ');
        if (validarEstado(input)) {
            nuevoEstado = input;
            break;
        }
        console.log('✗ Estado invalido. Use: abierto, en progreso o resuelto');
    }
    (0, incidentes_1.actualizarEstado)(id, nuevoEstado);
    console.log(`\n✓ Estado actualizado a: ${nuevoEstado}`);
}
async function main() {
    let continuar = true;
    while (continuar) {
        mostrarMenu();
        const opcion = await pregunta('Seleccione opcion: ');
        switch (opcion) {
            case '1':
                await crearIncidente();
                break;
            case '2':
                verIncidentes();
                break;
            case '3':
                await actualizarEstadoIncidente();
                break;
            case '4':
                console.log('\n¡Hasta luego!\n');
                continuar = false;
                break;
            default:
                console.log('\n✗ Opcion no valida. Elija 1, 2, 3 o 4');
        }
        if (continuar) {
            await pregunta('\nPresione Enter para continuar...');
        }
    }
    rl.close();
}
main();
//# sourceMappingURL=index.js.map