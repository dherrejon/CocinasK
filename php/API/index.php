<?php

    require 'Slim/Slim.php';
    require 'configuration.php';
    
    /*-----Funciones-----*/
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

    require 'General/Direccion.php';
    require 'General/Sesion.php';
    require 'General/MedioContacto.php';

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
    
    $app->get('/GetUnidadNegocioSencilla', $seguridad, $ChecarSesion, 'GetUnidadNegocioSencilla');
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

    /*--------------Medio Contacto-------------------------------*/
    $app->get('/GetTipoMedioContacto', $seguridad, $ChecarSesion, 'GetTipoMedioContacto');

    /*------------------Permiso-------------------*/
    $app->get('/GetPermiso', $seguridad, $ChecarSesion, 'GetPermiso');

    /*------------------------Tipo Modulo----------------------------*/
    $app->get('/GetTipoModulo', $seguridad, $ChecarSesion, 'GetTipoModulo');
    $app->post('/AgregarTipoModulo', $seguridad, $ChecarSesion, 'AgregarTipoModulo');
    $app->put('/EditarTipoModulo', $seguridad, $ChecarSesion, 'EditarTipoModulo');
    $app->post('/ActivarDesactivarTipoModulo', $seguridad, $ChecarSesion, 'ActivarDesactivarTipoModulo');

    /*------------------------ Modulo ----------------------------*/
    $app->get('/GetModulo', $seguridad, $ChecarSesion, 'GetModulo');
    $app->post('/AgregarModulo', $seguridad, $ChecarSesion, 'AgregarModulo');
    $app->put('/EditarModulo', $seguridad, $ChecarSesion, 'EditarModulo');
    $app->post('/ActivarDesactivarModulo', $seguridad, $ChecarSesion, 'ActivarDesactivarModulo');

    $app->post('/GetMedidasPorModulo', $seguridad, $ChecarSesion, 'GetMedidasPorModulo');
    $app->post('/ActivarDesactivarMedidasPorModulo', $seguridad, $ChecarSesion, 'ActivarDesactivarMedidasPorModulo');
    $app->post('/GetConsumiblePorModulo', $seguridad, $ChecarSesion, 'GetConsumiblePorModulo');
    $app->post('/GetComponentePorModulo', $seguridad, $ChecarSesion, 'GetComponentePorModulo');
    $app->post('/GetPartePorModulo', $seguridad, $ChecarSesion, 'GetPartePorModulo');
    $app->post('/GetSeccionPorModulo', $seguridad, $ChecarSesion, 'GetSeccionPorModulo');
    $app->post('/GetLuzPorSeccion', $seguridad, $ChecarSesion, 'GetLuzPorSeccion');

    $app->put('/EditarMedidaPorModulo', $seguridad, $ChecarSesion, 'EditarMedidaPorModulo');
    $app->post('/GuardarImagenModulo/:id', $seguridad, $ChecarSesion, 'GuardarImagenModulo');

    /*------------------------Pieza----------------------------*/
    $app->get('/GetPieza', $seguridad, $ChecarSesion, 'GetPieza');
    $app->post('/ActivarDesactivarPieza', $seguridad, $ChecarSesion, 'ActivarDesactivarPieza');

    /*------------------------  Componente  ----------------------------*/
    $app->get('/GetComponente', $seguridad, $ChecarSesion, 'GetComponente');
    $app->get('/GetTodosComponente', $seguridad, $ChecarSesion, 'GetTodosComponente');
    $app->get('/GetComponentePuerta', $seguridad, $ChecarSesion, 'GetComponentePuerta');
    
    $app->post('/AgregarComponente', $seguridad, $ChecarSesion, 'AgregarComponente');
    $app->put('/EditarComponente', $seguridad, $ChecarSesion, 'EditarComponente');
    $app->post('/ActivarDesactivarComponente', $seguridad, $ChecarSesion, 'ActivarDesactivarComponente');

    $app->post('/GetPiezaPorComponente', $seguridad, $ChecarSesion, 'GetPiezaPorComponente');

    /*------------------------Tipo Material----------------------------*/
    $app->get('/GetTipoMaterial', $seguridad, $ChecarSesion, 'GetTipoMaterial');
    $app->post('/AgregarTipoMaterial', $seguridad, $ChecarSesion, 'AgregarTipoMaterial');
    $app->put('/EditarTipoMaterial', $seguridad, $ChecarSesion, 'EditarTipoMaterial');
    $app->post('/ActivarDesactivarTipoMaterial', $seguridad, $ChecarSesion, 'ActivarDesactivarTipoMaterial');

    /*------------------------Material Para----------------------------*/
    $app->get('/GetMaterialPara', $seguridad, $ChecarSesion, 'GetMaterialPara');
    $app->get('/GetTipoMaterialParaModulo', $seguridad, $ChecarSesion, 'GetTipoMaterialParaModulo');

    /*------------------------ Grueso Material ----------------------------*/
    $app->get('/GetGruesoMaterial', $seguridad, $ChecarSesion, 'GetGruesoMaterial');
    $app->post('/ActivarDesactivarGruesoMaterial', $seguridad, $ChecarSesion, 'ActivarDesactivarGruesoMaterial');

    /*------------------------Material----------------------------*/
    $app->get('/GetMaterial', $seguridad, $ChecarSesion, 'GetMaterial');
    $app->post('/AgregarMaterial', $seguridad, $ChecarSesion, 'AgregarMaterial');
    $app->put('/EditarMaterial', $seguridad, $ChecarSesion, 'EditarMaterial');
    $app->post('/ActivarDesactivarMaterial', $seguridad, $ChecarSesion, 'ActivarDesactivarMaterial');

    /*------------------------Combinacion Material----------------------------*/
    $app->get('/GetCombinacionMaterial', $seguridad, $ChecarSesion, 'GetCombinacionMaterial');
    $app->post('/AgregarCombinacionMaterial', $seguridad, $ChecarSesion, 'AgregarCombinacionMaterial');
    $app->put('/EditarCombinacionMaterial', $seguridad, $ChecarSesion, 'EditarCombinacionMaterial');
    $app->post('/ActivarDesactivarCombinacionMaterial', $seguridad, $ChecarSesion, 'ActivarDesactivarCombinacionMaterial');

    $app->post('/GetCombinacionPorMaterialComponente', $seguridad, $ChecarSesion, 'GetCombinacionPorMaterialComponente');
    $app->post('/GetCombinacionPorMaterialComponentePorComponente', $seguridad, $ChecarSesion, 'GetCombinacionPorMaterialComponentePorComponente');

    /*------------------------Consumible----------------------------*/
    $app->get('/GetConsumible', $seguridad, $ChecarSesion, 'GetConsumible');
    $app->post('/AgregarConsumible', $seguridad, $ChecarSesion, 'AgregarConsumible');
    $app->put('/EditarConsumible', $seguridad, $ChecarSesion, 'EditarConsumible');
    $app->post('/ActivarDesactivarConsumible', $seguridad, $ChecarSesion, 'ActivarDesactivarConsumible');

    /*------------------------Muestrario----------------*/
    $app->get('/GetMuestrarioPuerta', $seguridad, $ChecarSesion, 'GetMuestrarioPuerta');
    $app->post('/AgregarMuestrario', $seguridad, $ChecarSesion, 'AgregarMuestrario');
    $app->put('/EditarMuestrario', $seguridad, $ChecarSesion, 'EditarMuestrario');
    $app->post('/ActivarDesactivarMuestrario', $seguridad, $ChecarSesion, 'ActivarDesactivarMuestrario');

    $app->post('/GetPuertaPorMuestrario', $seguridad, $ChecarSesion, 'GetPuertaPorMuestrario');

    /*------------------------Puerta----------------*/
    $app->get('/GetPuerta', $seguridad, $ChecarSesion, 'GetPuerta');
    $app->post('/AgregarPuerta', $seguridad, $ChecarSesion, 'AgregarPuerta');
    $app->put('/EditarPuerta', $seguridad, $ChecarSesion, 'EditarPuerta');
    $app->post('/ActivarDesactivarPuerta', $seguridad, $ChecarSesion, 'ActivarDesactivarPuerta');

    $app->post('/GetComponentePorPuerta', $seguridad, $ChecarSesion, 'GetComponentePorPuerta');

    

    $app->run(); 

?>