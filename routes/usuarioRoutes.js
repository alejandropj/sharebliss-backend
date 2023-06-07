"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const usuarioController_1 = require("../controllers/usuarioController");
class UsuarioRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.post('/login', usuarioController_1.usuarioController.login);
        this.router.post('/register', usuarioController_1.usuarioController.register);
        //Opciones de Cliente
        this.router.get('/buscar/:alias', usuarioController_1.usuarioController.buscar);
        this.router.delete('/eliminar/:alias', usuarioController_1.usuarioController.verifyToken, usuarioController_1.usuarioController.eliminar);
        this.router.put('/actualizar/:alias', usuarioController_1.usuarioController.verifyToken, usuarioController_1.usuarioController.actualizar);
        //SUSCRIPCION
        this.router.post('/crearSuscripcion', usuarioController_1.usuarioController.crearSuscripcion);
        this.router.delete('/borrarSuscripcion/:data', usuarioController_1.usuarioController.borrarSuscripcion);
        this.router.get('/listarSuscripciones/:alias', usuarioController_1.usuarioController.listarSuscripciones);
        //COMENTARIOS
        this.router.get('/comentario/:plataforma', usuarioController_1.usuarioController.listarComentarios);
        this.router.post('/comentario', usuarioController_1.usuarioController.crearComentario);
        //Opción admin
        this.router.get('/getAlias', usuarioController_1.usuarioController.getAlias);
        this.router.get('/listar', usuarioController_1.usuarioController.verifyToken, usuarioController_1.usuarioController.listarUsuarios);
    }
}
const usuarioRoutes = new UsuarioRoutes();
exports.default = usuarioRoutes.router;
