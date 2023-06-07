"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const morgan_1 = __importDefault(require("morgan"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
//import fs from 'fs';
//import multer from 'multer';
//const upload = multer({dest: 'public/images'});
//import indexRoutes from './routes/indexRoutes';
const usuarioRoutes_1 = __importDefault(require("./routes/usuarioRoutes"));
const servicioRoutes_1 = __importDefault(require("./routes/servicioRoutes"));
//import adminRoutes from './routes/adminRoutes';
class Server {
    //public upload=multer({dest: 'public/images'});
    constructor() {
        this.app = (0, express_1.default)();
        this.config();
        this.routes();
        //upload = multer({dest: 'public/images'});
    }
    config() {
        this.app.set('port', process.env.PORT || 3000);
        this.app.use((0, morgan_1.default)('dev'));
        this.app.use((0, cors_1.default)());
        this.app.use(express_1.default.json());
        this.app.use(express_1.default.urlencoded({ extended: false }));
        this.app.use(express_1.default.static(path_1.default.join(__dirname, 'public')));
    }
    routes() {
        this.app.use('/',indexRoutes);
        this.app.use('/usuario', usuarioRoutes_1.default);
        this.app.use('/servicio', servicioRoutes_1.default);
        //this.app.use('/admin',adminRoutes);
    }
    start() {
        this.app.listen(this.app.get('port'), () => {
            console.log("Servidor en puerto", this.app.get('port'));
        });
    }
}
const server = new Server();
server.start();
