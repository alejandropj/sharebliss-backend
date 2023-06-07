import {Router} from 'express';

import {servicioController} from '../controllers/servicioController';
//import {Request, Response} from 'express';

import multer from 'multer';
import fs from 'fs';
const upload = multer({dest: 'public/images'});

class ServicioRoutes{
    public router:Router = Router();

    constructor(){
        this.config();
    }

    config():void{
        this.router.get('/listar',servicioController.listarPlataformas);
        this.router.get('/listar/:plataforma',servicioController.listarPlataforma);
        this.router.post('/agregar',servicioController.crearPlataforma);
        //this.router.post('/subirImagen',upload.single('logo'), servicioController.subirImagen);
        this.router.post('/subirImagen',upload.single('logo'), (req:any,res,next)=>{
            //fs.renameSync(req.file.path, req.file.path +'.'+ req.file.mimeType.split('/')[1]);
            fs.renameSync(req.file.path, req.file.path.split('\\')[0]+'\\'+req.file.path.split('\\')[1] +'\\'+ <String>req.file.originalname +'.'+ req.file.mimetype.split('/')[1]);
            console.log(req.file);
        });
        this.router.get('/mostrarImagen/:logo',(req,res,next)=>{
            fs.readFile('public\\images\\'+req.params.logo/*+'.jpeg'*/, function (err, data) {
                //if (err) throw err;
                //res.write(data);
                /*const reader = new FileReader();
                var base64;
                reader.onload = () => {
                    base64= reader.result as string;
                };
                reader.readAsDataURL(data);*/
                return res.json(Buffer.from(data).toString('base64'));
                //console.log(Buffer.from(data).toString('base64'));
            });
            //fs.renameSync(req.file?.path, req.file?.path.split('\\')[0]+'\\'+req.file?.path.split('\\')[1] +'\\'+ <String>req.file?.originalname +'.'+ req.file?.mimetype.split('/')[1]);
            //console.log(req.file);
        });
        this.router.delete('/borrar/:plataforma',servicioController.borrarPlataforma);
        this.router.put('/actualizar/:plataforma',servicioController.actualizarPlataforma);


        this.router.get('/addSugerencia/:plataforma', servicioController.addSugerencia);
        this.router.get('/getSugerencias', servicioController.listSugerencias);
        this.router.delete('/deleteSugerencia/:plataforma',servicioController.deleteSugerencia);
 
    }
}

const servicioRoutes = new ServicioRoutes();
export default servicioRoutes.router;