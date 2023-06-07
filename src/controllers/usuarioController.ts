import {NextFunction, Request, Response} from 'express';

import db from '../database';

import jwt, { JwtPayload } from 'jsonwebtoken';

class UsuarioController{

    /**
     * Checks if user is on DB, and its credentials.
     * @param req 
     * @param res 
     * @returns token or error
     */
    public async login(req:Request,res:Response){
        //const {alias,clave} = req.body;
        const alias = await db.query('SELECT alias FROM usuario where alias=?', [req.body.alias]);
        if(alias.length==0) return res.status(401).send("Nombre de usuario no existe.");
        
        const clave = await db.query('SELECT clave FROM usuario where alias = ? AND clave=?', [req.body.alias, req.body.clave]);
        if(clave.length==0) return res.status(401).send("Contraseña incorrecta.");

        const token = jwt.sign({alias:alias},'secretkey');
        return res.status(200).json({token:token});
        //return res.json(alias);
        //const usuario = await db.query('SELECT * FROM usuario where alias=? AND clave=?', [req.body.alias,req.body.clave]);
        //if (usuario.length>0){
            //return res.json(usuario);
        //}

        
        //res.status(404).json({text:"ERROR"});
    }
    /**
     * Checks if alias is on DB, else will add user to DB.
     * @param req 
     * @param res 
     * @returns token or error
     */
    public async register(req:Request,res:Response){
        const alias = await db.query('SELECT alias FROM usuario where alias=?', [req.body.alias]);
        const EMAIL_PATTERN = "^[^@]+@[^@]+\.[a-zA-Z]{2,}$";
        const user = req.body;
        if(alias.length!=0) return res.status(401).send("Nombre de usuario existe.");

        if(user.alias.length<4) return res.status(400).send("Alias inferior a 4 caracteres");
        if(user.nombre.length<4) return res.status(400).send("Nombre inferior a 4 caracteres");
        if(user.apellidos.length<4) return res.status(400).send("Apellidos inferior a 4 caracteres");
        if(!user.email.match(EMAIL_PATTERN)) return res.status(400).send("Email debe ser válido");
        if(user.clave.length<4) return res.status(400).send("Debe introducir una contraseña superior a 4 caracteres");
        await db.query('INSERT INTO usuario SET ?',[req.body]);
        return res.json("Alta realizada correctamente. Inicie sesión.")
        //res.send("Alta realizada correctamente. Inicie sesión.");
        //const token = jwt.sign({alias: req.body.alias}, 'secretkey');

        //res.status(200).json({token:token});
    }

    /**
     * RAN ON ANY CALL.
     * Verifies if headers have auth key, decrypts it to check if alias matches the action.
     * @param req 
     * @param res 
     * @param next 
     * @returns next or error
     */
    public verifyToken(req:Request, res:Response, next:NextFunction){
        if(!req.headers.authorization){
            return res.status(401).send('No tienes permiso a acceder aquí.');
        }

        const token = req.headers.authorization?.split(' ')[1];
        if(token === 'null'){
            return res.status(401).send('No tienes permiso a acceder aquí.');
        }
        const data = <JwtPayload> jwt.verify(token, 'secretkey');
        console.log(req.params.alias==data.alias[0].alias);
        if(data.alias[0].alias == 'admin'){
            console.log("Token corresponde a admin.");
            next();
        }else if(req.params.alias == data.alias[0].alias){
            console.log("Token corresponde a usuario.");
            next();
        }else{
            return res.status(401).send('No tienes permiso a realizar esta operación.');
            //console.log('No eres admin, y estas haciendo algo que no te corresponde');
        }
        //if(req.params.alias == data.alias[0].alias)

        //next();
    }

    /**
     * Checks alias if headers have auth key
     * @param req 
     * @param res 
     * @returns alias or false
     */
    public getAlias(req:Request, res:Response){
        if(!req.headers.authorization){
            return false;
        }
        const token = req.headers.authorization?.split(' ')[1];
        if(token === 'null'){
            return false;
        }
        const data = <JwtPayload> jwt.verify(token, 'secretkey');
        //console.log(data.alias[0].alias);
        return res.json(data.alias[0].alias);
    }


    /**
     * Returns users
     * @param req 
     * @param res 
     * @returns Usuarios
     */
    public async listarUsuarios(req:Request,res:Response){
        const usuarios = await db.query('SELECT * FROM usuario');
        if (usuarios.length>0){
            return res.json(usuarios);
        }
        res.status(404).json("No hay usuarios.");
    }

    /**
     * Checks if alias exist.
     * @param req alias from params
     * @param res 
     * @returns user
     */
    public async buscar(req:Request,res:Response){
        const { alias } = req.params;
        const usuario = await db.query('SELECT * FROM usuario where alias=?', [alias]);
        if (usuario.length>0){
            console.log(usuario[0]);
            return res.json(usuario[0]);
        }
        res.status(404).json({text:"Usuario no encontrado"});
    } 

    /**
     * Deletes a user.
     * @param req alias from params
     * @param res 
     */
    public async eliminar(req:Request,res:Response){
        const { alias } = req.params;
        await db.query('DELETE FROM usuario WHERE alias=?',[alias]);
        res.json({mensaje:'Usuario ' + alias + ' eliminado.'});
    }

    /**
     * Updates a user.
     * @param req alias from params
     * @param res 
     */
    public async actualizar(req:Request,res:Response){
        const { alias } = req.params;
        await db.query('UPDATE usuario SET ? WHERE alias=?', [req.body, alias]);
        res.status(200).json('Usuario actualizado.');
    }



    public async crearSuscripcion(req:Request,res:Response){
        const alias = req.body[0];
        const plataforma = req.body[1];

        //ASIGNAR GRUPO
        const servicio = await db.query('SELECT suscritos,plazas FROM servicio WHERE plataforma=?',plataforma);
        let contSuscritos = JSON.parse(JSON.stringify(servicio))[0]['suscritos'];
        let contPlazas = JSON.parse(JSON.stringify(servicio))[0]['plazas'];
        let numGrupo= Math.ceil(contSuscritos+1/contPlazas);

        //SUSCRIPCIÓN
        await db.query('INSERT INTO contratar(alias_usuario,plataforma_servicio,grupo) VALUES (?,?,?)',[alias,plataforma,numGrupo]);

        //ACTUALIZAR SUSCRITOS
        await db.query('UPDATE servicio SET suscritos=suscritos+1 WHERE plataforma=?',plataforma);

        return res.status(201).json({mensaje:'Registro realizado.'});

        //await db.query('INSERT INTO contratar SET ');
        
        //console.log('Alias'+alias);
        //return res.json('Servicio: '+plataforma);
        //console.log(req.body[0]);
        //const {alias,plataforma} = req.body;
    }
    public async borrarSuscripcion(req:Request,res:Response){
        const [id,plataforma] = req.params.data.split(',');

        //BORRAR SUSCRIPCIÓN
        await db.query('DELETE FROM contratar WHERE id=?',id);

        //ACTUALIZAR SUSCRITOS
        await db.query('UPDATE servicio SET suscritos=suscritos-1 WHERE plataforma=?',plataforma);

        return res.status(201).json('Baja realizada.');
    }
    public async listarSuscripciones(req:Request,res:Response){
        const { alias } = req.params;
        const suscripciones = await db.query('SELECT * FROM contratar WHERE alias_usuario=?',alias);
        return res.json(suscripciones);
    }

    public async listarComentarios(req:Request,res:Response){
        const plataforma = req.params.plataforma;
        const comments = await db.query('SELECT alias_usuario_comentario, texto FROM comentario WHERE plataforma_servicio_comentario=?',plataforma);
        return res.json(comments);
    }
    public async crearComentario(req:Request,res:Response){
        const data  = req.body;
        await db.query('INSERT INTO comentario (alias_usuario_comentario, plataforma_servicio_comentario, texto) VALUES(?,?,?)', [data.alias, data.room, data.message]);
        //{ room: 'NETFLIX', alias: 'alejandropj', message: 'hjhjhj' }
        //const suscripciones = await db.query('SELECT * FROM contratar WHERE alias_usuario=?',data);
        //return res.json(suscripciones);
    }
}

export const usuarioController =new UsuarioController();