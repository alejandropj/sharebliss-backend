"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.usuarioController = void 0;
const database_1 = __importDefault(require("../database"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
class UsuarioController {
    /**
     * Checks if user is on DB, and its credentials.
     * @param req
     * @param res
     * @returns token or error
     */
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            //const {alias,clave} = req.body;
            const alias = yield database_1.default.query('SELECT alias FROM usuario where alias=?', [req.body.alias]);
            if (alias.length == 0)
                return res.status(401).send("Nombre de usuario no existe.");
            const clave = yield database_1.default.query('SELECT clave FROM usuario where alias = ? AND clave=?', [req.body.alias, req.body.clave]);
            if (clave.length == 0)
                return res.status(401).send("Contraseña incorrecta.");
            const token = jsonwebtoken_1.default.sign({ alias: alias }, 'secretkey');
            return res.status(200).json({ token: token });
            //return res.json(alias);
            //const usuario = await db.query('SELECT * FROM usuario where alias=? AND clave=?', [req.body.alias,req.body.clave]);
            //if (usuario.length>0){
            //return res.json(usuario);
            //}
            //res.status(404).json({text:"ERROR"});
        });
    }
    /**
     * Checks if alias is on DB, else will add user to DB.
     * @param req
     * @param res
     * @returns token or error
     */
    register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const alias = yield database_1.default.query('SELECT alias FROM usuario where alias=?', [req.body.alias]);
            const EMAIL_PATTERN = "^[^@]+@[^@]+\.[a-zA-Z]{2,}$";
            const user = req.body;
            if (alias.length != 0)
                return res.status(401).send("Nombre de usuario existe.");
            if (user.alias.length < 4)
                return res.status(400).send("Alias inferior a 4 caracteres");
            if (user.nombre.length < 4)
                return res.status(400).send("Nombre inferior a 4 caracteres");
            if (user.apellidos.length < 4)
                return res.status(400).send("Apellidos inferior a 4 caracteres");
            if (!user.email.match(EMAIL_PATTERN))
                return res.status(400).send("Email debe ser válido");
            if (user.clave.length < 4)
                return res.status(400).send("Debe introducir una contraseña superior a 4 caracteres");
            yield database_1.default.query('INSERT INTO usuario SET ?', [req.body]);
            return res.json("Alta realizada correctamente. Inicie sesión.");
            //res.send("Alta realizada correctamente. Inicie sesión.");
            //const token = jwt.sign({alias: req.body.alias}, 'secretkey');
            //res.status(200).json({token:token});
        });
    }
    /**
     * RAN ON ANY CALL.
     * Verifies if headers have auth key, decrypts it to check if alias matches the action.
     * @param req
     * @param res
     * @param next
     * @returns next or error
     */
    verifyToken(req, res, next) {
        var _a;
        if (!req.headers.authorization) {
            return res.status(401).send('No tienes permiso a acceder aquí.');
        }
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
        if (token === 'null') {
            return res.status(401).send('No tienes permiso a acceder aquí.');
        }
        const data = jsonwebtoken_1.default.verify(token, 'secretkey');
        console.log(req.params.alias == data.alias[0].alias);
        if (data.alias[0].alias == 'admin') {
            console.log("Token corresponde a admin.");
            next();
        }
        else if (req.params.alias == data.alias[0].alias) {
            console.log("Token corresponde a usuario.");
            next();
        }
        else {
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
    getAlias(req, res) {
        var _a;
        if (!req.headers.authorization) {
            return false;
        }
        const token = (_a = req.headers.authorization) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
        if (token === 'null') {
            return false;
        }
        const data = jsonwebtoken_1.default.verify(token, 'secretkey');
        //console.log(data.alias[0].alias);
        return res.json(data.alias[0].alias);
    }
    /**
     * Returns users
     * @param req
     * @param res
     * @returns Usuarios
     */
    listarUsuarios(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const usuarios = yield database_1.default.query('SELECT * FROM usuario');
            if (usuarios.length > 0) {
                return res.json(usuarios);
            }
            res.status(404).json("No hay usuarios.");
        });
    }
    /**
     * Checks if alias exist.
     * @param req alias from params
     * @param res
     * @returns user
     */
    buscar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { alias } = req.params;
            const usuario = yield database_1.default.query('SELECT * FROM usuario where alias=?', [alias]);
            if (usuario.length > 0) {
                console.log(usuario[0]);
                return res.json(usuario[0]);
            }
            res.status(404).json({ text: "Usuario no encontrado" });
        });
    }
    /**
     * Deletes a user.
     * @param req alias from params
     * @param res
     */
    eliminar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { alias } = req.params;
            yield database_1.default.query('DELETE FROM usuario WHERE alias=?', [alias]);
            res.json({ mensaje: 'Usuario ' + alias + ' eliminado.' });
        });
    }
    /**
     * Updates a user.
     * @param req alias from params
     * @param res
     */
    actualizar(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { alias } = req.params;
            yield database_1.default.query('UPDATE usuario SET ? WHERE alias=?', [req.body, alias]);
            res.status(200).json('Usuario actualizado.');
        });
    }
    crearSuscripcion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const alias = req.body[0];
            const plataforma = req.body[1];
            //ASIGNAR GRUPO
            const servicio = yield database_1.default.query('SELECT suscritos,plazas FROM servicio WHERE plataforma=?', plataforma);
            let contSuscritos = JSON.parse(JSON.stringify(servicio))[0]['suscritos'];
            let contPlazas = JSON.parse(JSON.stringify(servicio))[0]['plazas'];
            let numGrupo = Math.ceil(contSuscritos + 1 / contPlazas);
            //SUSCRIPCIÓN
            yield database_1.default.query('INSERT INTO contratar(alias_usuario,plataforma_servicio,grupo) VALUES (?,?,?)', [alias, plataforma, numGrupo]);
            //ACTUALIZAR SUSCRITOS
            yield database_1.default.query('UPDATE servicio SET suscritos=suscritos+1 WHERE plataforma=?', plataforma);
            return res.status(201).json({ mensaje: 'Registro realizado.' });
            //await db.query('INSERT INTO contratar SET ');
            //console.log('Alias'+alias);
            //return res.json('Servicio: '+plataforma);
            //console.log(req.body[0]);
            //const {alias,plataforma} = req.body;
        });
    }
    borrarSuscripcion(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const [id, plataforma] = req.params.data.split(',');
            //BORRAR SUSCRIPCIÓN
            yield database_1.default.query('DELETE FROM contratar WHERE id=?', id);
            //ACTUALIZAR SUSCRITOS
            yield database_1.default.query('UPDATE servicio SET suscritos=suscritos-1 WHERE plataforma=?', plataforma);
            return res.status(201).json('Baja realizada.');
        });
    }
    listarSuscripciones(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { alias } = req.params;
            const suscripciones = yield database_1.default.query('SELECT * FROM contratar WHERE alias_usuario=?', alias);
            return res.json(suscripciones);
        });
    }
    listarComentarios(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const plataforma = req.params.plataforma;
            const comments = yield database_1.default.query('SELECT alias_usuario_comentario, texto FROM comentario WHERE plataforma_servicio_comentario=?', plataforma);
            return res.json(comments);
        });
    }
    crearComentario(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const data = req.body;
            yield database_1.default.query('INSERT INTO comentario (alias_usuario_comentario, plataforma_servicio_comentario, texto) VALUES(?,?,?)', [data.alias, data.room, data.message]);
            //{ room: 'NETFLIX', alias: 'alejandropj', message: 'hjhjhj' }
            //const suscripciones = await db.query('SELECT * FROM contratar WHERE alias_usuario=?',data);
            //return res.json(suscripciones);
        });
    }
}
exports.usuarioController = new UsuarioController();
