import express, {Application} from 'express';
import morgan from 'morgan';
import cors from 'cors';
import path from 'path';
//import fs from 'fs';
//import multer from 'multer';
//const upload = multer({dest: 'public/images'});

//import indexRoutes from './routes/indexRoutes';
import usuarioRoutes from './routes/usuarioRoutes';
import servicioRoutes from './routes/servicioRoutes';
//import adminRoutes from './routes/adminRoutes';
class Server{
    public app:Application;
    //public upload=multer({dest: 'public/images'});
    constructor(){
        this.app = express();
        this.config();
        this.routes();
        //upload = multer({dest: 'public/images'});
    }

    config():void{
        this.app.set('port',process.env.PORT||3000);
        this.app.use(morgan('dev'));
        this.app.use(cors());
        this.app.use(express.json());
        this.app.use(express.urlencoded({extended:false}));
        this.app.use(express.static(path.join(__dirname, 'public')));
    }
    routes():void{
        //this.app.use('/',indexRoutes);
        this.app.use('/usuario',usuarioRoutes);
        this.app.use('/servicio',servicioRoutes);
        //this.app.use('/admin',adminRoutes);
    }
    start():void{
        this.app.listen(this.app.get('port'),()=>{
            console.log("Servidor en puerto",this.app.get('port'));
        });
    }
}

const server = new Server();
server.start();