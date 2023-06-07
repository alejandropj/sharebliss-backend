"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
class ServiciosRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        //this.router.get('/',adminController.listarPlataformas);
        //this.router.get('/:plataforma',adminController.listarPlataforma);
        //this.router.post('/',adminController.crearPlataforma);
        //this.router.delete('/:plataforma',adminController.borrarPlataforma);
        //this.router.put('/:plataforma',adminController.actualizarPlataforma);
    }
}
const serviciosRoutes = new ServiciosRoutes();
exports.default = serviciosRoutes.router;
