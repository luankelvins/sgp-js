import { BrowserRouter, Route, Routes } from "react-router-dom";
import Login from "../paginas/Login";
import Pagina404 from "../paginas/Pagina404";
import Dashboard from "../paginas/Dashboard";
import Usuarios from "../paginas/Usuarios";
import Tarefas from "../paginas/Tarefas";
import ListaTarefas from "../paginas/TarefasVisualizar";
import EditarUsuario from "../paginas/EditarUsuario";
import AdicionarUsuario from "../paginas/AdicionarUsuario";
import EditarTarefa from "../paginas/EditarTarefas";
import ListarProjetos from "../paginas/Projetos";
import EditarProjeto from "../paginas/EditarProjetos";
import AdicionarProjeto from "../paginas/AdicionarProjetos";
import PerfilUsuario from "../paginas/Perfil";
import EditarPerfilUsuario from "../paginas/EditarPerfil";
import TrocarSenha from "../paginas/Seguranca";
import VisualizarTarefa from "../paginas/TarefaIndividual";
import RotaPrivada from "./Rotaprivada";

function Rotas() {
  return (
    <BrowserRouter>
      <Routes>
        <Route index path="/" element={<Login />} />
        <Route path="*" element={<Pagina404 />} />

        <Route
          path="/dashboard"
          element={
            <RotaPrivada>
              <Dashboard />
            </RotaPrivada>
          }
        />
        <Route
          path="/usuarios"
          element={
            <RotaPrivada>
              <Usuarios />
            </RotaPrivada>
          }
        />
        <Route
          path="/tarefas/novo"
          element={
            <RotaPrivada>
              <Tarefas />
            </RotaPrivada>
          }
        />
        <Route
          path="/tarefas"
          element={
            <RotaPrivada>
              <ListaTarefas />
            </RotaPrivada>
          }
        />
        <Route
          path="/usuarios/:id/editar"
          element={
            <RotaPrivada>
              <EditarUsuario />
            </RotaPrivada>
          }
        />
        <Route
          path="/usuarios/novo"
          element={
            <RotaPrivada>
              <AdicionarUsuario />
            </RotaPrivada>
          }
        />
        <Route
          path="/tarefas/:id/editar"
          element={
            <RotaPrivada>
              <EditarTarefa />
            </RotaPrivada>
          }
        />
        <Route
          path="/projetos"
          element={
            <RotaPrivada>
              <ListarProjetos />
            </RotaPrivada>
          }
        />
        <Route
          path="/projetos/novo"
          element={
            <RotaPrivada>
              <AdicionarProjeto />
            </RotaPrivada>
          }
        />
        <Route
          path="/projetos/:id/editar"
          element={
            <RotaPrivada>
              <EditarProjeto />
            </RotaPrivada>
          }
        />
        <Route
          path="/perfil"
          element={
            <RotaPrivada>
              <PerfilUsuario />
            </RotaPrivada>
          }
        />
        <Route
          path="/perfil/editar"
          element={
            <RotaPrivada>
              <EditarPerfilUsuario />
            </RotaPrivada>
          }
        />
        <Route
          path="/seguranca"
          element={
            <RotaPrivada>
              <TrocarSenha />
            </RotaPrivada>
          }
        />
        <Route
          path="/tarefas/:id"
          element={
            <RotaPrivada>
              <VisualizarTarefa />
            </RotaPrivada>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default Rotas;