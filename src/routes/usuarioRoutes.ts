import {Router} from 'express';

import {usuarioController} from '../controllers/usuarioController'

class UsuarioRoutes{
    public router:Router = Router();

    constructor(){
        this.config();
    }

    config():void{
        this.router.post('/login',usuarioController.login);
        this.router.post('/register',usuarioController.register);


        //Opciones de Cliente
        this.router.get('/buscar/:alias',usuarioController.buscar);
        this.router.delete('/eliminar/:alias',usuarioController.verifyToken,usuarioController.eliminar);
        this.router.put('/actualizar/:alias',usuarioController.verifyToken,usuarioController.actualizar);
        //SUSCRIPCION
        this.router.post('/crearSuscripcion',usuarioController.crearSuscripcion);
        this.router.delete('/borrarSuscripcion/:data',usuarioController.borrarSuscripcion);
        this.router.get('/listarSuscripciones/:alias',usuarioController.listarSuscripciones);
        //COMENTARIOS
        this.router.get('/comentario/:plataforma',usuarioController.listarComentarios);
        this.router.post('/comentario',usuarioController.crearComentario);


        //Opción admin
        this.router.get('/getAlias', usuarioController.getAlias);
        this.router.get('/listar',usuarioController.verifyToken,usuarioController.listarUsuarios);
        

    }
}

const usuarioRoutes = new UsuarioRoutes();
export default usuarioRoutes.router;