import {Request, Response} from 'express';

import db from '../database';

//const path = require('path');
//import fs from 'fs';
//import multer from 'multer';
//const upload = multer({dest: 'public/images'});

class ServicioController{
    public async listarPlataformas(req:Request,res:Response){
        const servicios = await db.query('SELECT * FROM servicio');
        res.json(servicios);
    }
    
    public async addSugerencia(req:Request,res:Response){
        const plataforma = req.params.plataforma.toString().trimStart().toLowerCase();

        const servicio = await db.query('SELECT plataforma FROM servicio where plataforma=?', plataforma);
        if(servicio.length>0){
            return res.status(500).json({text: "El servicio ya existe"});
        }

        const sugerencias = await db.query('SELECT plataforma FROM sugerencias WHERE plataforma = ?',plataforma);
        if(sugerencias.length>0){
            await db.query('UPDATE sugerencias SET conteo=conteo+1 WHERE plataforma=?',plataforma);
            return res.json("Registrado correctamente");
        }else{
            await db.query('INSERT INTO sugerencias (plataforma) VALUES (?)',plataforma);
            return res.json("Registrado correctamente");
        }
    }

    public async listSugerencias(req:Request,res:Response){
        const sugerencias = await db.query('SELECT * FROM sugerencias');
        res.json(sugerencias);
    }

    public async deleteSugerencia(req:Request,res:Response){
        const { plataforma } = req.params;
        await db.query('DELETE FROM sugerencias WHERE plataforma=?',[plataforma]);
        res.json({mensaje:'Sugerencia ' + plataforma + ' eliminada.'});
    } 

    public async listarPlataforma(req:Request,res:Response){
        const { plataforma } = req.params;
        const servicio = await db.query('SELECT * FROM servicio where plataforma=?', [plataforma]);
        if (servicio.length>0){
            return res.json(servicio[0]);
        }
        res.status(404).json({text:"El servicio no existe"});
    } 
    public async crearPlataforma(req:Request,res:Response): Promise<void>{
        
        await db.query('INSERT INTO servicio SET ?',[req.body]);
        res.json({mensaje:'Servicio guardado.'});
    }
    public async borrarPlataforma(req:Request,res:Response){
        const { plataforma } = req.params;
        await db.query('DELETE FROM servicio WHERE plataforma=?',[plataforma]);
        res.json({mensaje:'Servicio ' + plataforma + ' eliminado.'});
    } 
    public async actualizarPlataforma(req:Request,res:Response){
        const { plataforma } = req.params;
        await db.query('UPDATE servicio SET ? WHERE plataforma=?', [req.body, plataforma]);
        res.json({mensaje: 'Servicio ' + plataforma + ' actualizado.'});
    }

}

export const servicioController =new ServicioController();