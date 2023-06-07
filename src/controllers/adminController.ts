import {Request, Response} from 'express';

import db from '../database';

class AdminController{
    public async listarPlataformas(req:Request,res:Response){
        const servicios = await db.query('SELECT * FROM servicio');
        res.json(servicios);
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

export const adminController =new AdminController();