<?php
    require 'Slim/Slim.php';
    require 'configuration.php';
    
    /*-----Administrador-----*/
    require 'Administrador/UnidadNegocio.php';
    require 'Administrador/Territorio.php';
    require 'Administrador/Plaza.php';
    require 'Administrador/Colaborador.php';
    require 'Administrador/Usuario.php';
    require 'Administrador/Modulo.php';
    require 'Administrador/Pieza.php';
    require 'Administrador/Componente.php';
    require 'Administrador/Material.php';
    require 'Administrador/Combinacion.php';
    require 'Administrador/Consumible.php';
    require 'Administrador/Puerta.php';
    require 'Administrador/Muestrario.php';
    require 'Administrador/Color.php';
    require 'Administrador/Grupo.php';
    require 'Administrador/UbicacionCubierta.php';
    require 'Administrador/FabricacionCubierta.php';
    require 'Administrador/Cubierta.php';
    require 'Administrador/Accesorio.php';
    require 'Administrador/Servicio.php';
    require 'Administrador/Maqueo.php';
    require 'Administrador/Promocion.php';
    require 'Administrador/PlanPago.php';
    require 'Administrador/MedioCaptacion.php';
    require 'Administrador/TipoProyecto.php';
    require 'Administrador/Variable.php';
    require 'Administrador/ConceptoVenta.php';
    require 'Administrador/MedioPago.php';
    require 'Administrador/AcabadoCubierta.php';
    require 'Administrador/DescripcionContrato.php';

    /*------------Operativo-----------*/
    require 'Operativo/Cita.php';
    require 'Operativo/Persona.php';
    require 'Operativo/Proyecto.php';
    require 'Operativo/Contrato.php';
    require 'Operativo/Pago.php';

    /*------------General----------*/
    require 'General/Direccion.php';
    require 'General/Sesion.php';
    require 'General/MedioContacto.php';
    require 'General/Bug.php';

    /*-----Seguridad-----*/
    require 'PHP-JWT/Authentication/JWT.php';
    require 'PHP-JWT/Exceptions/SignatureInvalidException.php';
    require 'PHP-JWT/Exceptions/BeforeValidException.php';
    require 'PHP-JWT/Exceptions/ExpiredException.php';

    $host = $_SERVER['SERVER_NAME'];

    \Slim\Slim::registerAutoloader();
    $app = new \Slim\Slim();

    date_default_timezone_set($time_zone);

    session_start();

    //-------------------------------------------------Seguridad------------------------------------------
    $seguridad = function() use ($key, $host) 
    {

        $app = \Slim\Slim::getInstance();

        $jwt = $app->request->headers->get('X-Api-Key');

        if( null != $jwt )
        {
             try
             {
                    $app->response->headers->set('X-Origin-Response', $host); 
                    $jwtDecoded = JWT::decode($jwt, $key, array('HS256'));
             }
             catch ( SignatureInvalidException $excepcionSE )
             {
                    $app->status(401);
                    $app->stop();
             }
             catch ( BeforeValidException $excepcionBE )
             {
                    $app->status(401);
                    $app->stop();
             }
             catch ( ExpiredException $excepcionEE )
             {

                    try{
                            $app->response->headers->set('X-Api-Key', generateToken(false)); 
                    }
                    catch ( DomainException $excepcion )
                    {
                            $app->status(401);
                            $app->stop();
                    }

             }
             catch ( DomainException $excepcionDE )
             {
                    $app->status(401);
                    $app->stop();
             }
             catch ( UnexpectedValueException $excepcionUE )
             {
                    $app->status(401);
                    $app->stop();               
             }
        }
        else
        {
            $app->status(401);
            $app->stop();
        }        
    };

    //------------------------------------ Inicio de sesion ------------------------------------------------

   
    function generateToken($expired)
    {
        global $key;
        global $host;
        global $app;
        global $token_expiration_time;
        $state;
        
        if(!$expired)
        {
            if ( isset( $_SESSION['Usuario'] ) )
                $state = true;
            else
                $state = false;
        }
        else
            $state = 'expired';
            
        try{
                $newPayload = array(
                    "state" => $state,
                    "iat" => time(),
                    "exp" => strtotime($token_expiration_time)
                );

                $newJWT = JWT::encode($newPayload, $key);

                return $newJWT;
        }
        catch ( DomainException $excepcion )
        {
                $app->status(401);
                $app->stop();
        }
    }

    function quitarSesion()
    {
        
        if( isset( $_SESSION['Usuario'] ) )
        {
            
            if ( ini_get("session.use_cookies") ) 
            {
            
                $params = session_get_cookie_params();
                setcookie(session_name(), 
                                      '', 
                          time() - 42000,
                         $params["path"], 
                       $params["domain"],
                       $params["secure"], 
                    $params["httponly"]);
                
            }
            
            session_unset();
            session_destroy();
            
        }
    }

    $ChecarSesion = function() use ($session_expiration_time)
    {
        
        $app = \Slim\Slim::getInstance();
        
        if( isset( $_SESSION['Usuario'] ) ) 
        {

            if( ( $_SESSION['timeout'] - time() ) < 0 )
            {
                quitarSesion();
                
                $app->response->headers->set('X-Api-Key', generateToken(true));
            }
            else
            {
                $_SESSION['timeout'] = strtotime( $session_expiration_time );   
            }
                
        }        
    };

    //-------------------------------------------------------------------------------------
   
    /*-----------Sesion-------------*/
    $app->post('/Login', $seguridad, 'Login');
    $app->get('/GetEstadoSesion', $seguridad, $ChecarSesion, 'GetEstadoSesion');
    $app->get('/CerrarSesion', $seguridad, 'CerrarSesion');
    $app->put('/SetPerfil', $seguridad, 'SetPerfil');

    /*-----------Unidad de Negocio------------------*/
    $app->get('/GetUnidadNegocio', $seguridad, $ChecarSesion, 'GetUnidadNegocio');
    $app->post('/ActivarDesactivarUnidad', $seguridad, $ChecarSesion, 'ActivarDesactivarUnidad');
    $app->post('/AgregarUnidadNegocio', $seguridad, $ChecarSesion, 'AgregarUnidadNegocio');
    $app->put('/EditarUnidadNegocio', $seguridad, $ChecarSesion, 'EditarUnidadNegocio');
    
    $app->get('/GetDatosUnidadNegocio/:id', $seguridad, $ChecarSesion, 'GetDatosUnidadNegocio');
    $app->get('/GetUnidadNegocioSencilla', $seguridad, $ChecarSesion, 'GetUnidadNegocioSencilla');
    $app->get('/GetUnidadNegocioSencillaPresupuesto', $seguridad, $ChecarSesion, 'GetUnidadNegocioSencillaPresupuesto');
    $app->get('/GetResponsable', $seguridad, $ChecarSesion, 'GetResponsable');

    /*-----------------------Empresa------------------*/
    $app->get('/GetEmpresa', $seguridad, $ChecarSesion, 'GetEmpresa');
    $app->post('/AgregarEmpresa', $seguridad, $ChecarSesion, 'AgregarEmpresa');
    $app->put('/EditarEmpresa', $seguridad, $ChecarSesion, 'EditarEmpresa');
    $app->post('/ActivarDesactivarEmpresa', $seguridad, $ChecarSesion, 'ActivarDesactivarEmpresa');
    
    /*------------------------Tipo Unidad Negocio----------------------------*/
    $app->get('/GetTipoUnidadNegocio', $seguridad, $ChecarSesion, 'GetTipoUnidadNegocio');
    $app->post('/AgregarTipoUnidadNegocio', $seguridad, $ChecarSesion, 'AgregarTipoUnidadNegocio');
    $app->put('/EditarTipoUnidadNegocio', $seguridad, $ChecarSesion, 'EditarTipoUnidadNegocio');
    $app->post('/ActivarDesactivarTipoUnidadNegocio', $seguridad, $ChecarSesion, 'ActivarDesactivarTipoUnidadNegocio');

    /*-----------Codigo Postal----------------------*/
    $app->post('/GetCodigoPostal', $seguridad, $ChecarSesion, 'GetCodigoPostal');
    $app->get('/GetEstadoMexico', $seguridad, $ChecarSesion, 'GetEstadoMexico');

    /*-----------Territorio-------------------------*/
    $app->get('/GetTerritorio', $seguridad, $ChecarSesion, 'GetTerritorio');
    $app->post('/AgregarTerritorio', $seguridad, $ChecarSesion, 'AgregarTerritorio');
    $app->put('/EditarTerritorio', $seguridad, $ChecarSesion, 'EditarTerritorio');
    $app->post('/ActivarDesactivarTerritorio', $seguridad, $ChecarSesion, 'ActivarDesactivarTerritorio');

    $app->post('/GetPlazaTerritorio', $seguridad, $ChecarSesion, 'GetPlazaTerritorio');

    /*-------------Plaza-----------------------------*/
    $app->get('/GetPlaza', $seguridad, $ChecarSesion, 'GetPlaza');
    $app->post('/AgregarPlaza', $seguridad, $ChecarSesion, 'AgregarPlaza');
    $app->put('/EditarPlaza', $seguridad, $ChecarSesion, 'EditarPlaza');
    $app->post('/ActivarDesactivarPlaza', $seguridad, $ChecarSesion, 'ActivarDesactivarPlaza');

    /*-------------Colaborador-----------------------------*/
    $app->get('/GetColaborador', $seguridad, $ChecarSesion, 'GetColaborador');
    $app->post('/AgregarColaborador', $seguridad, $ChecarSesion, 'AgregarColaborador');
    $app->put('/EditarColaborador', $seguridad, $ChecarSesion, 'EditarColaborador');
    $app->post('/ActivarDesactivarColaborador', $seguridad, $ChecarSesion, 'ActivarDesactivarColaborador');

    $app->post('/GetContactoColaborador', $seguridad, $ChecarSesion, 'GetContactoColaborador');
    $app->put('/EditarContactoColabordor', $seguridad, $ChecarSesion, 'EditarContactoColabordor');
    $app->delete('/DeleteContactoColaborador', $seguridad, $ChecarSesion, 'DeleteContactoColaborador');

    /*-------------Usuario-------------------------------*/
    
    $app->post('/ActivarDesactivarUsuario', $seguridad, $ChecarSesion, 'ActivarDesactivarUsuario');
    $app->post('/AgregarUsuario', $seguridad, $ChecarSesion, 'AgregarUsuario');
    $app->put('/EditarUsuario', $seguridad, $ChecarSesion, 'EditarUsuario');
    $app->put('/CambiarPassword', $seguridad, $ChecarSesion, 'CambiarPassword');

    $app->post('/GetPerfilPorUsuario', $seguridad, $ChecarSesion, 'GetPerfilPorUsuario');
    $app->post('/GetPermisoPorUsuario', $seguridad, $ChecarSesion, 'GetPermisoPorUsuario');
    $app->put('/CambiarPasswordPorUsuario', $seguridad, $ChecarSesion, 'CambiarPasswordPorUsuario');

    $app->put('/RecuperarPassword', $seguridad, $ChecarSesion, 'RecuperarPassword');
    $app->post('/ValidarRecuperarPassword', $seguridad, $ChecarSesion, 'ValidarRecuperarPassword');
    $app->put('/ReiniciarPassword', $seguridad, $ChecarSesion, 'ReiniciarPassword');

    /*--------------Medio Contacto-------------------------------*/
    $app->get('/GetTipoMedioContacto', $seguridad, $ChecarSesion, 'GetTipoMedioContacto');
    $app->post('/AgregarTipoMedioContacto', $seguridad, $ChecarSesion, 'AgregarTipoMedioContacto');
    $app->put('/EditarTipoMedioContacto', $seguridad, $ChecarSesion, 'EditarTipoMedioContacto');
    $app->post('/ActivarDesactivarTipoMedioContacto', $seguridad, $ChecarSesion, 'ActivarDesactivarTipoMedioContacto');

    /*------------------Permiso-------------------*/
    $app->get('/GetPermiso', $seguridad, $ChecarSesion, 'GetPermiso');

    /*------------------------Tipo Modulo----------------------------*/
    $app->get('/GetTipoModulo', $seguridad, $ChecarSesion, 'GetTipoModulo');
    $app->post('/AgregarTipoModulo', $seguridad, $ChecarSesion, 'AgregarTipoModulo');
    $app->put('/EditarTipoModulo', $seguridad, $ChecarSesion, 'EditarTipoModulo');
    $app->post('/ActivarDesactivarTipoModulo', $seguridad, $ChecarSesion, 'ActivarDesactivarTipoModulo');

    /*------------------------ Modulo ----------------------------*/
    $app->get('/GetModulo', $seguridad, $ChecarSesion, 'GetModulo');
    $app->get('/GetModuloPresupuesto', $seguridad, $ChecarSesion, 'GetModuloPresupuesto');
    $app->post('/AgregarModulo', $seguridad, $ChecarSesion, 'AgregarModulo');
    $app->put('/EditarModulo', $seguridad, $ChecarSesion, 'EditarModulo');
    $app->post('/ActivarDesactivarModulo', $seguridad, $ChecarSesion, 'ActivarDesactivarModulo');

    $app->post('/GetMedidasPorModulo', $seguridad, $ChecarSesion, 'GetMedidasPorModulo');
    $app->post('/ActivarDesactivarMedidasPorModulo', $seguridad, $ChecarSesion, 'ActivarDesactivarMedidasPorModulo');
    $app->post('/GetConsumiblePorModulo', $seguridad, $ChecarSesion, 'GetConsumiblePorModulo');
    $app->post('/GetComponentePorModulo', $seguridad, $ChecarSesion, 'GetComponentePorModulo');
    $app->post('/GetPartePorModulo', $seguridad, $ChecarSesion, 'GetPartePorModulo');
    $app->post('/GetSeccionPorModulo', $seguridad, $ChecarSesion, 'GetSeccionPorModulo');
    $app->post('/GetSeccionPorModuloPresupuesto', $seguridad, $ChecarSesion, 'GetSeccionPorModuloPresupuesto');
    $app->post('/GetLuzPorSeccion', $seguridad, $ChecarSesion, 'GetLuzPorSeccion');

    $app->put('/EditarMedidaPorModulo', $seguridad, $ChecarSesion, 'EditarMedidaPorModulo');
    $app->post('/GuardarImagenModulo/:id', $seguridad, $ChecarSesion, 'GuardarImagenModulo');
    $app->get('/GetMedidasModulo', $seguridad, $ChecarSesion, 'GetMedidasModulo');
    $app->get('/GetModuloImagen/:id', $seguridad, $ChecarSesion, 'GetModuloImagen');

    /*------------------------Pieza----------------------------*/
    $app->get('/GetPieza', $seguridad, $ChecarSesion, 'GetPieza');
    $app->post('/AgregarPieza', $seguridad, $ChecarSesion, 'AgregarPieza');
    $app->put('/EditarPieza', $seguridad, $ChecarSesion, 'EditarPieza');
    $app->post('/ActivarDesactivarPieza', $seguridad, $ChecarSesion, 'ActivarDesactivarPieza');

    /*------------------------  Componente  ----------------------------*/
    $app->get('/GetComponente', $seguridad, $ChecarSesion, 'GetComponente');
    $app->get('/GetTodosComponente', $seguridad, $ChecarSesion, 'GetTodosComponente');
    $app->get('/GetComponentePuerta', $seguridad, $ChecarSesion, 'GetComponentePuerta');
    
    $app->post('/AgregarComponente', $seguridad, $ChecarSesion, 'AgregarComponente');
    $app->put('/EditarComponente', $seguridad, $ChecarSesion, 'EditarComponente');
    $app->post('/ActivarDesactivarComponente', $seguridad, $ChecarSesion, 'ActivarDesactivarComponente');

    $app->post('/GetPiezaPorComponente', $seguridad, $ChecarSesion, 'GetPiezaPorComponente');
    $app->get('/GetComponenteEspecial', $seguridad, $ChecarSesion, 'GetComponenteEspecial');

    /*------------------------Tipo Material----------------------------*/
    $app->get('/GetTipoMaterial', $seguridad, $ChecarSesion, 'GetTipoMaterial');
    $app->post('/AgregarTipoMaterial', $seguridad, $ChecarSesion, 'AgregarTipoMaterial');
    $app->put('/EditarTipoMaterial', $seguridad, $ChecarSesion, 'EditarTipoMaterial');
    $app->post('/ActivarDesactivarTipoMaterial', $seguridad, $ChecarSesion, 'ActivarDesactivarTipoMaterial');

    /*------------------------Material Para----------------------------*/
    $app->get('/GetTipoMaterialParaModulo', $seguridad, $ChecarSesion, 'GetTipoMaterialParaModulo');
    $app->get('/GetTipoMaterialParaCubierta', $seguridad, $ChecarSesion, 'GetTipoMaterialParaCubierta');

    $app->get('/GetMaterialCubierta', $seguridad, $ChecarSesion, 'GetMaterialCubierta');

    /*------------------------ Grueso Material ----------------------------*/
    $app->get('/GetGruesoMaterial', $seguridad, $ChecarSesion, 'GetGruesoMaterial');
    $app->post('/ActivarDesactivarGruesoMaterial', $seguridad, $ChecarSesion, 'ActivarDesactivarGruesoMaterial');

    /*------------------------Material----------------------------*/
    $app->get('/GetMaterial', $seguridad, $ChecarSesion, 'GetMaterial');
    $app->post('/AgregarMaterial', $seguridad, $ChecarSesion, 'AgregarMaterial');
    $app->put('/EditarMaterial', $seguridad, $ChecarSesion, 'EditarMaterial');
    $app->post('/ActivarDesactivarMaterial', $seguridad, $ChecarSesion, 'ActivarDesactivarMaterial');

    $app->post('/GetCostoMaterial', $seguridad, $ChecarSesion, 'GetCostoMaterial');

    /*------------------------Combinacion Material----------------------------*/
    $app->get('/GetCombinacionMaterial', $seguridad, $ChecarSesion, 'GetCombinacionMaterial');
    $app->post('/AgregarCombinacionMaterial', $seguridad, $ChecarSesion, 'AgregarCombinacionMaterial');
    $app->put('/EditarCombinacionMaterial', $seguridad, $ChecarSesion, 'EditarCombinacionMaterial');
    $app->post('/ActivarDesactivarCombinacionMaterial', $seguridad, $ChecarSesion, 'ActivarDesactivarCombinacionMaterial');

    $app->get('/GetCombinacionMaterialCosto', $seguridad, $ChecarSesion, 'GetCombinacionMaterialCosto');
    $app->post('/GetCombinacionPorMaterialComponente', $seguridad, $ChecarSesion, 'GetCombinacionPorMaterialComponente');
    $app->post('/GetCombinacionPorMaterialComponentePorComponente', $seguridad, $ChecarSesion, 'GetCombinacionPorMaterialComponentePorComponente');
    $app->post('/GetCombinacionPorMaterialComponentePorPuerta', $seguridad, $ChecarSesion, 'GetCombinacionPorMaterialComponentePorPuerta');
    $app->post('/GetCombinacionPorMaterialComponentePorPuertaCombinacion', $seguridad, $ChecarSesion, 'GetCombinacionPorMaterialComponentePorPuertaCombinacion');

    /*------------------------Tipo combinacion Material----------------------------*/
    $app->get('/GetTipoCombinacionMaterial', $seguridad, $ChecarSesion, 'GetTipoCombinacionMaterial');
    $app->post('/AgregarTipoCombiancion', $seguridad, $ChecarSesion, 'AgregarTipoCombiancion');
    $app->put('/EditarTipoCombiancion', $seguridad, $ChecarSesion, 'EditarTipoCombiancion');
    $app->post('/ActivarDesactivarTipoCombinacion', $seguridad, $ChecarSesion, 'ActivarDesactivarTipoCombinacion');

    /*------------------------Consumible----------------------------*/
    $app->get('/GetConsumible', $seguridad, $ChecarSesion, 'GetConsumible');
    $app->post('/AgregarConsumible', $seguridad, $ChecarSesion, 'AgregarConsumible');
    $app->put('/EditarConsumible', $seguridad, $ChecarSesion, 'EditarConsumible');
    $app->post('/ActivarDesactivarConsumible', $seguridad, $ChecarSesion, 'ActivarDesactivarConsumible');

    /*------------------------Muestrario----------------*/
    $app->post('/GetMuestrario', $seguridad, $ChecarSesion, 'GetMuestrario');
    $app->post('/AgregarMuestrario', $seguridad, $ChecarSesion, 'AgregarMuestrario');
    $app->put('/EditarMuestrario', $seguridad, $ChecarSesion, 'EditarMuestrario');
    $app->post('/ActivarDesactivarMuestrario', $seguridad, $ChecarSesion, 'ActivarDesactivarMuestrario');

    $app->post('/GetPuertaPorMuestrario', $seguridad, $ChecarSesion, 'GetPuertaPorMuestrario');
    $app->post('/GetAccesorioPorMuestrario', $seguridad, $ChecarSesion, 'GetAccesorioPorMuestrario');

    /*------------------------Puerta----------------*/
    $app->get('/GetPuerta', $seguridad, $ChecarSesion, 'GetPuerta');
    $app->post('/AgregarPuerta', $seguridad, $ChecarSesion, 'AgregarPuerta');
    $app->put('/EditarPuerta', $seguridad, $ChecarSesion, 'EditarPuerta');
    $app->post('/ActivarDesactivarPuerta', $seguridad, $ChecarSesion, 'ActivarDesactivarPuerta');

    $app->post('/GetComponentePorPuerta', $seguridad, $ChecarSesion, 'GetComponentePorPuerta');
    $app->get('/GetComponentesPorPuertaComponente', $seguridad, $ChecarSesion, 'GetComponentesPorPuertaComponente');
    
    /*----------------------Bug-------------------------------*/
    $app->get('/GetBug', $seguridad, $ChecarSesion, 'GetBug');
    $app->post('/AgregarBug', $seguridad, $ChecarSesion, 'AgregarBug');
    $app->put('/ResolverBug', $seguridad, $ChecarSesion, 'ResolverBug');

    /*---------------------- Color -------------------------------*/
    $app->get('/GetColor', $seguridad, $ChecarSesion, 'GetColor');
    $app->post('/AgregarColor', $seguridad, $ChecarSesion, 'AgregarColor');
    $app->put('/EditarColor', $seguridad, $ChecarSesion, 'EditarColor');
    $app->post('/ActivarDesactivarColor', $seguridad, $ChecarSesion, 'ActivarDesactivarColor');

    $app->post('/GuardarImagenColor/:id', $seguridad, $ChecarSesion, 'GuardarImagenColor');

    /*-------------------  Grupo ----------------------------------*/
    $app->post('/GetGrupo', $seguridad, $ChecarSesion, 'GetGrupo');
    $app->post('/ActivarDesactivarGrupo', $seguridad, $ChecarSesion, 'ActivarDesactivarGrupo');

    $app->post('/AgregarGrupoColorCubierta', $seguridad, $ChecarSesion, 'AgregarGrupoColorCubierta');
    $app->put('/EditarGrupoColorCubierta', $seguridad, $ChecarSesion, 'EditarGrupoColorCubierta');
    $app->post('/GetGrupoPorColor', $seguridad, $ChecarSesion, 'GetGrupoPorColor');
    $app->post('/GetGrupoPorColorTodo', $seguridad, $ChecarSesion, 'GetGrupoPorColorTodo');

    /*----------------- Get Fabricacion Cubierta -----------------------------*/
    $app->get('/GetFabricacionCubierta', $seguridad, $ChecarSesion, 'GetFabricacionCubierta');
    $app->post('/AgregarFabricacionCubierta', $seguridad, $ChecarSesion, 'AgregarFabricacionCubierta');
    $app->put('/EditarFabricacionCubierta', $seguridad, $ChecarSesion, 'EditarFabricacionCubierta');
    $app->post('/ActivarDesactivarFabricacionCubierta', $seguridad, $ChecarSesion, 'ActivarDesactivarFabricacionCubierta');

    $app->post('/GetConsumiblePorFabricacion', $seguridad, $ChecarSesion, 'GetConsumiblePorFabricacion');

    /*----------------- Ubicación Cubierta --------------------*/
    $app->get('/GetUbicacionCubierta', $seguridad, $ChecarSesion, 'GetUbicacionCubierta');
    $app->post('/ActivarDesactivarUbicacionCubierta', $seguridad, $ChecarSesion, 'ActivarDesactivarUbicacionCubierta');

    $app->post('/GetDatosUbicacion', $seguridad, $ChecarSesion, 'GetDatosUbicacion');
    $app->put('/EditarUbicacionFabricacionTipoCubierta', $seguridad, $ChecarSesion, 'EditarUbicacionFabricacionTipoCubierta');

    /*----------------- Acabado Cubierta --------------------*/
    $app->get('/GetAcabadoCubierta', $seguridad, $ChecarSesion, 'GetAcabadoCubierta');
    $app->post('/AgregarAcabadoCubierta', $seguridad, $ChecarSesion, 'AgregarAcabadoCubierta');    
    $app->put('/EditarAcabadoCubierta', $seguridad, $ChecarSesion, 'EditarAcabadoCubierta');
    $app->post('/ActivarDesactivarAcabadoCubierta', $seguridad, $ChecarSesion, 'ActivarDesactivarAcabadoCubierta');

    /*---------------- Cubierta ------------------------*/
    $app->get('/GetCubierta', $seguridad, $ChecarSesion, 'GetCubierta');
    $app->post('/AgregarCubierta', $seguridad, $ChecarSesion, 'AgregarCubierta');
    $app->put('/EditarCubierta', $seguridad, $ChecarSesion, 'EditarCubierta');

    $app->post('/GetCubiertaUbicacion', $seguridad, $ChecarSesion, 'GetCubiertaUbicacion'); 
    $app->post('/GetCubiertaUbicacionTodo', $seguridad, $ChecarSesion, 'GetCubiertaUbicacionTodo');
    $app->post('/GetGrupoColorCubierta', $seguridad, $ChecarSesion, 'GetGrupoColorCubierta');
    $app->post('/GetGrupoColorCubiertaTodo', $seguridad, $ChecarSesion, 'GetGrupoColorCubiertaTodo');

    /*------------------------Tipo Accesorio----------------------------*/
    $app->get('/GetTipoAccesorio', $seguridad, $ChecarSesion, 'GetTipoAccesorio');
    $app->get('/GetTipoAccesorioPresupuesto', $seguridad, $ChecarSesion, 'GetTipoAccesorioPresupuesto');
    $app->post('/AgregarTipoAccesorio', $seguridad, $ChecarSesion, 'AgregarTipoAccesorio');
    $app->put('/EditarTipoAccesorio', $seguridad, $ChecarSesion, 'EditarTipoAccesorio');
    $app->post('/ActivarDesactivarTipoAccesorio', $seguridad, $ChecarSesion, 'ActivarDesactivarTipoAccesorio');

    $app->post('/GuardarInstrucciones/:id', $seguridad, $ChecarSesion, 'GuardarInstrucciones');
    $app->get('/GetInstruccionesTipoAccesorio/:id', $seguridad, $ChecarSesion, 'GetInstruccionesTipoAccesorio');

    /*------------------ Servicio ------------------------------*/
    $app->get('/GetServicio', $seguridad, $ChecarSesion, 'GetServicio');
    $app->post('/AgregarServicio', $seguridad, $ChecarSesion, 'AgregarServicio');
    $app->put('/EditarServicio', $seguridad, $ChecarSesion, 'EditarServicio');
    $app->post('/ActivarDesactivarServicio', $seguridad, $ChecarSesion, 'ActivarDesactivarServicio');

    /*------------------ TipoProyecto ------------------------------*/
    $app->get('/GetTipoProyecto', $seguridad, $ChecarSesion, 'GetTipoProyecto');
    $app->get('/GetTipoProyectoId/:id', $seguridad, $ChecarSesion, 'GetTipoProyectoId');
    $app->post('/AgregarTipoProyecto', $seguridad, $ChecarSesion, 'AgregarTipoProyecto');
    $app->put('/EditarTipoProyecto', $seguridad, $ChecarSesion, 'EditarTipoProyecto');
    $app->post('/ActivarDesactivarTipoProyecto', $seguridad, $ChecarSesion, 'ActivarDesactivarTipoProyecto');


    /*------------------ Maqueo ------------------------------*/
    $app->get('/GetMaqueo', $seguridad, $ChecarSesion, 'GetMaqueo');
    $app->post('/AgregarMaqueo', $seguridad, $ChecarSesion, 'AgregarMaqueo');
    $app->put('/EditarMaqueo', $seguridad, $ChecarSesion, 'EditarMaqueo');
    $app->post('/ActivarDesactivarMaqueo', $seguridad, $ChecarSesion, 'ActivarDesactivarMaqueo');
    
    $app->get('/GetGrupoMaqueo/:id', $seguridad, $ChecarSesion, 'GetGrupoMaqueo');

    /*------------------ Accesorio ------------------------------*/
    $app->get('/GetAccesorio', $seguridad, $ChecarSesion, 'GetAccesorio');
    $app->get('/GetAccesorioPresupuesto', $seguridad, $ChecarSesion, 'GetAccesorioPresupuesto');
    $app->post('/AgregarAccesorio', $seguridad, $ChecarSesion, 'AgregarAccesorio');
    $app->put('/EditarAccesorio', $seguridad, $ChecarSesion, 'EditarAccesorio');
    $app->post('/ActivarDesactivarAccesorio', $seguridad, $ChecarSesion, 'ActivarDesactivarAccesorio');
    
    $app->post('/GetAccesorioClase', $seguridad, $ChecarSesion, 'GetAccesorioClase');
    $app->post('/GetCombinacionPorAccesorio', $seguridad, $ChecarSesion, 'GetCombinacionPorAccesorio');
    $app->post('/GuardarImagenAccesorio/:id', $seguridad, $ChecarSesion, 'GuardarImagenAccesorio');
    $app->get('/GetAccesorioCosto', $seguridad, $ChecarSesion, 'GetAccesorioCosto');
    
    /*------------------ Promoción ------------------------------*/
    $app->get('/GetPromocion', $seguridad, $ChecarSesion, 'GetPromocion');
    $app->post('/AgregarPromocion', $seguridad, $ChecarSesion, 'AgregarPromocion');
    $app->put('/EditarPromocion', $seguridad, $ChecarSesion, 'EditarPromocion');
    $app->post('/ActivarDesactivarPromocion', $seguridad, $ChecarSesion, 'ActivarDesactivarPromocion'); 

    $app->post('/GetUnidadNegocionPorPromocion', $seguridad, $ChecarSesion, 'GetUnidadNegocionPorPromocion');
    $app->post('/GetPromocionPorUnidadNegocio', $seguridad, $ChecarSesion, 'GetPromocionPorUnidadNegocio');

    /*------------------ Plan Pago ------------------------------*/
    $app->get('/GetPlanPago', $seguridad, $ChecarSesion, 'GetPlanPago');
    $app->post('/AgregarPlanPago', $seguridad, $ChecarSesion, 'AgregarPlanPago');
    $app->put('/EditarPlanPago', $seguridad, $ChecarSesion, 'EditarPlanPago');
    $app->post('/ActivarDesactivarPlanPago', $seguridad, $ChecarSesion, 'ActivarDesactivarPlanPago'); 

    $app->post('/GetPlanPagoAbono', $seguridad, $ChecarSesion, 'GetPlanPagoAbono');

    /*------------------ Medio Captación ------------------------------*/
    $app->get('/GetMedioCaptacion', $seguridad, $ChecarSesion, 'GetMedioCaptacion');
    $app->post('/AgregarMedioCaptacion', $seguridad, $ChecarSesion, 'AgregarMedioCaptacion');
    $app->put('/EditarMedioCaptacion', $seguridad, $ChecarSesion, 'EditarMedioCaptacion');
    $app->post('/ActivarDesactivarMedioCaptacion', $seguridad, $ChecarSesion, 'ActivarDesactivarMedioCaptacion');

    $app->get('/GetMedioCaptacionOtro', $seguridad, $ChecarSesion, 'GetMedioCaptacionOtro');
    $app->put('/ActualizarMedioCaptacionAgregar', $seguridad, $ChecarSesion, 'ActualizarMedioCaptacionAgregar');
    $app->put('/ActualizarMedioCaptacion', $seguridad, $ChecarSesion, 'ActualizarMedioCaptacion');

    /*------------------ Cita ----------------------------------------------*/
    $app->post('/AgregarCita', $seguridad, $ChecarSesion, 'AgregarCita');
    $app->put('/EditarCita', $seguridad, $ChecarSesion, 'EditarCita');
    $app->post('/CambiarEstatusCita', $seguridad, $ChecarSesion, 'CambiarEstatusCita');

    /*------------------ Persona ----------------------------------------------*/
    $app->get('/GetCliente/:id', $seguridad, $ChecarSesion, 'GetCliente');
    $app->put('/EditarDatosPersona', $seguridad, $ChecarSesion, 'EditarDatosPersona');

    $app->post('/GetBuscarPersona', $seguridad, $ChecarSesion, 'GetBuscarPersona');
    $app->post('/GetDatoPersona', $seguridad, $ChecarSesion, 'GetDatoPersona');
    $app->post('/GetUnidadNegocioPersona', $seguridad, $ChecarSesion, 'GetUnidadNegocioPersona');
    $app->post('/GetMedioContactoPersona', $seguridad, $ChecarSesion, 'GetMedioContactoPersona');
    $app->post('/GetDireccionPersona', $seguridad, $ChecarSesion, 'GetDireccionPersona');   
    $app->post('/GetContactoAdicional', $seguridad, $ChecarSesion, 'GetContactoAdicional');
    $app->post('/GetDatosFiscales', $seguridad, $ChecarSesion, 'GetDatosFiscales');
    $app->post('/GetCitaPersona', $seguridad, $ChecarSesion, 'GetCitaPersona');

    $app->post('/AgregarMedioContactoPersona', $seguridad, $ChecarSesion, 'AgregarMedioContactoPersona');
    $app->post('/AgregarDomicilioPersona', $seguridad, $ChecarSesion, 'AgregarDomicilioPersona');   
    $app->put('/EditarMedioContactoPersona', $seguridad, $ChecarSesion, 'EditarMedioContactoPersona');
    $app->put('/EditarDireccionPersona', $seguridad, $ChecarSesion, 'EditarDireccionPersona');
    $app->put('/EditarUnidadNegocioPersona', $seguridad, $ChecarSesion, 'EditarUnidadNegocioPersona');

    $app->post('/AgregarContactoAdicional', $seguridad, $ChecarSesion, 'AgregarContactoAdicional');
    $app->put('/EditarContactoAdicional', $seguridad, $ChecarSesion, 'EditarContactoAdicional');

    $app->post('/AgregarDatoFiscalPersona', $seguridad, $ChecarSesion, 'AgregarDatoFiscalPersona');
    $app->put('/EditarDatoFiscalPersona', $seguridad, $ChecarSesion, 'EditarDatoFiscalPersona');

    $app->delete('/DeleteUnidadNegocioPersona', $seguridad, $ChecarSesion, 'DeleteUnidadNegocioPersona');

    $app->post('/GetMargenDireccion', $seguridad, $ChecarSesion, 'GetMargenDireccion');
    $app->get('/GetPromocionPersona/:id', $seguridad, $ChecarSesion, 'GetPromocionPersona');

    /*------------------ Variable del sistema ----------------------------------------------*/
    $app->get('/GetIVA', $seguridad, $ChecarSesion, 'GetIVA');
    $app->put('/EditarIVA', $seguridad, $ChecarSesion, 'EditarIVA');

    $app->get('/GetParametro/:Id', $seguridad, $ChecarSesion, 'GetParametro');
    $app->put('/EditarParametro', $seguridad, $ChecarSesion, 'EditarParametro');
    
    /*------------------------- Presupuesto ------------------------------*/
    $app->get('/GetPresupuestoPorProyecto/:id/:idpresupuesto', $seguridad, $ChecarSesion, 'GetPresupuestoPorProyecto');
    $app->post('/GetDatosPresupuesto', $seguridad, $ChecarSesion, 'GetDatosPresupuesto');

    /*------------------------- Proyecto ------------------------------*/
    $app->get('/GetProyecto/:id', $seguridad, $ChecarSesion, 'GetProyecto');
    $app->post('/AgregarProyectoPresupuesto', $seguridad, $ChecarSesion, 'AgregarProyectoPresupuesto');
    $app->put('/EditarProyectoPresupuesto', $seguridad, $ChecarSesion, 'EditarProyectoPresupuesto');
    $app->post('/GetProyectoPersona', $seguridad, $ChecarSesion, 'GetProyectoPersona');
    $app->post('/CambiarEstatusProyecto', $seguridad, $ChecarSesion, 'CambiarEstatusProyecto');
    $app->put('/EditarProyecto', $seguridad, $ChecarSesion, 'EditarProyecto');

    /*------------------ Medio Pago ------------------------------*/
    $app->get('/GetMedioPago', $seguridad, $ChecarSesion, 'GetMedioPago');
    $app->post('/AgregarMedioPago', $seguridad, $ChecarSesion, 'AgregarMedioPago');
    $app->put('/EditarMedioPago', $seguridad, $ChecarSesion, 'EditarMedioPago');
    $app->post('/ActivarDesactivarMedioPago', $seguridad, $ChecarSesion, 'ActivarDesactivarMedioPago');

    /*------------------ Medio Pago ------------------------------*/
    $app->get('/GetConceptoVenta', $seguridad, $ChecarSesion, 'GetConceptoVenta');
    $app->post('/AgregarConceptoVenta', $seguridad, $ChecarSesion, 'AgregarConceptoVenta');
    $app->put('/EditarConceptoVenta', $seguridad, $ChecarSesion, 'EditarConceptoVenta');
    $app->post('/ActivarDesactivarConceptoVenta', $seguridad, $ChecarSesion, 'ActivarDesactivarConceptoVenta');

    /*-----------------  Descripcion Contrato --------------------*/
    $app->get('/GetDescripcionContrato', $seguridad, $ChecarSesion, 'GetDescripcionContrato');
    $app->post('/AgregarDescripcionContrato', $seguridad, $ChecarSesion, 'AgregarDescripcionContrato');    
    $app->put('/EditarDescripcionContrato', $seguridad, $ChecarSesion, 'EditarDescripcionContrato');
    $app->post('/ActivarDesactivarDescripcion', $seguridad, $ChecarSesion, 'ActivarDesactivarDescripcion');

    /*------------------------- Contratos ------------------------------*/
    $app->get('/GetContrato/:id', $seguridad, $ChecarSesion, 'GetContrato');
    $app->post('/GetDatosContrato', $seguridad, $ChecarSesion, 'GetDatosContrato');
    $app->post('/AgregarContrato', $seguridad, $ChecarSesion, 'AgregarContrato');

    $app->put('/UpdateNumeroFactura', $seguridad, $ChecarSesion, 'UpdateNumeroFactura'); 
    $app->post('/GuardarContratoPDF/:id', $seguridad, $ChecarSesion, 'GuardarContratoPDF');
    $app->get('/DescargarContrato/:id', $seguridad, $ChecarSesion, 'DescargarContrato');
    $app->post('/CambiarEstatusContrato', $seguridad, $ChecarSesion, 'CambiarEstatusContrato');
    $app->post('/GetEstadoCuenta', $seguridad, $ChecarSesion, 'GetEstadoCuenta');
    $app->post('/AgregarPago', $seguridad, $ChecarSesion, 'AgregarPago');
    $app->get('/GetNotaCargo/:nota', $seguridad, $ChecarSesion, 'GetNotaCargo');
    $app->get('/GetNoFactura/:factura', $seguridad, $ChecarSesion, 'GetNoFactura');
    $app->post('/HabilitarEditarContrato', $seguridad, $ChecarSesion, 'HabilitarEditarContrato');
    $app->post('/CancelarPago', $seguridad, $ChecarSesion, 'CancelarPago');

    $app->post('/GetReporteContrato', $seguridad, $ChecarSesion, 'GetReporteContrato');

    /*------------------------- Pagos ------------------------------*/
    $app->post('/GetReportePago', $seguridad, $ChecarSesion, 'GetReportePago');
    
    $app->run(); 

?>