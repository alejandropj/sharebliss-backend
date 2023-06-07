import {Router} from 'express';

import {adminController} from '../controllers/adminController'

class ServiciosRoutes{
    public router:Router = Router();

    constructor(){
        this.config();
    }

    config():void{
        //this.router.get('/',adminController.listarPlataformas);
        //this.router.get('/:plataforma',adminController.listarPlataforma);
        //this.router.post('/',adminController.crearPlataforma);
        //this.router.delete('/:plataforma',adminController.borrarPlataforma);
        //this.router.put('/:plataforma',adminController.actualizarPlataforma);

        
    }
}

const serviciosRoutes = new ServiciosRoutes();
export default serviciosRoutes.router;