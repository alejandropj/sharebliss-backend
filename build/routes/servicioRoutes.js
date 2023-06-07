"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const servicioController_1 = require("../controllers/servicioController");
//import {Request, Response} from 'express';
const multer_1 = __importDefault(require("multer"));
const fs_1 = __importDefault(require("fs"));
const upload = (0, multer_1.default)({ dest: 'public/images' });
class ServicioRoutes {
    constructor() {
        this.router = (0, express_1.Router)();
        this.config();
    }
    config() {
        this.router.get('/listar', servicioController_1.servicioController.listarPlataformas);
        this.router.get('/listar/:plataforma', servicioController_1.servicioController.listarPlataforma);
        this.router.post('/agregar', servicioController_1.servicioController.crearPlataforma);
        //this.router.post('/subirImagen',upload.single('logo'), servicioController.subirImagen);
        this.router.post('/subirImagen', upload.single('logo'), (req, res, next) => {
            //fs.renameSync(req.file.path, req.file.path +'.'+ req.file.mimeType.split('/')[1]);
            fs_1.default.renameSync(req.file.path, req.file.path.split('\\')[0] + '\\' + req.file.path.split('\\')[1] + '\\' + req.file.originalname + '.' + req.file.mimetype.split('/')[1]);
            console.log(req.file);
        });
        this.router.get('/mostrarImagen/:logo', (req, res, next) => {
            fs_1.default.readFile('public\\images\\' + req.params.logo /*+'.jpeg'*/, function (err, data) {
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
        this.router.delete('/borrar/:plataforma', servicioController_1.servicioController.borrarPlataforma);
        this.router.put('/actualizar/:plataforma', servicioController_1.servicioController.actualizarPlataforma);
        this.router.get('/addSugerencia/:plataforma', servicioController_1.servicioController.addSugerencia);
        this.router.get('/getSugerencias', servicioController_1.servicioController.listSugerencias);
        this.router.delete('/deleteSugerencia/:plataforma', servicioController_1.servicioController.deleteSugerencia);
    }
}
const servicioRoutes = new ServicioRoutes();
exports.default = servicioRoutes.router;
