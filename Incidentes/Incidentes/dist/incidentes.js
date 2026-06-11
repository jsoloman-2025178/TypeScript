"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.listar = listar;
exports.agregar = agregar;
exports.actualizarEstado = actualizarEstado;
exports.existe = existe;
exports.obtener = obtener;
exports.limpiar = limpiar;
let incidentes = [];
let siguienteId = 1;
function listar() {
    return incidentes;
}
function agregar(incidente) {
    incidentes.push(incidente);
    return siguienteId++;
}
function actualizarEstado(id, nuevoEstado) {
    const index = id - 1;
    if (index < 0 || index >= incidentes.length)
        return false;
    const incidente = incidentes[index];
    if (!incidente)
        return false;
    incidente.estado = nuevoEstado;
    return true;
}
function existe(id) {
    return id > 0 && id <= incidentes.length;
}
function obtener(id) {
    const index = id - 1;
    if (index < 0 || index >= incidentes.length)
        return undefined;
    return incidentes[index];
}
function limpiar() {
    incidentes = [];
    siguienteId = 1;
}
//# sourceMappingURL=incidentes.js.map