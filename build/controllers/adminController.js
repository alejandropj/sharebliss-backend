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
exports.adminController = void 0;
const database_1 = __importDefault(require("../database"));
class AdminController {
    listarPlataformas(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const servicios = yield database_1.default.query('SELECT * FROM servicio');
            res.json(servicios);
        });
    }
    listarPlataforma(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { plataforma } = req.params;
            const servicio = yield database_1.default.query('SELECT * FROM servicio where plataforma=?', [plataforma]);
            if (servicio.length > 0) {
                return res.json(servicio[0]);
            }
            res.status(404).json({ text: "El servicio no existe" });
        });
    }
    crearPlataforma(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            yield database_1.default.query('INSERT INTO servicio SET ?', [req.body]);
            res.json({ mensaje: 'Servicio guardado.' });
        });
    }
    borrarPlataforma(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { plataforma } = req.params;
            yield database_1.default.query('DELETE FROM servicio WHERE plataforma=?', [plataforma]);
            res.json({ mensaje: 'Servicio ' + plataforma + ' eliminado.' });
        });
    }
    actualizarPlataforma(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { plataforma } = req.params;
            yield database_1.default.query('UPDATE servicio SET ? WHERE plataforma=?', [req.body, plataforma]);
            res.json({ mensaje: 'Servicio ' + plataforma + ' actualizado.' });
        });
    }
}
exports.adminController = new AdminController();
