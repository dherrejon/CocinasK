<?php

//Iniciar sesión
function Login()
{
    global $app;
    global $session_expiration_time;

    $request = \Slim\Slim::getInstance()->request();
    $datosUsuario = json_decode($request->getBody());
    
    $sql = "SELECT * FROM UsuarioCompleto WHERE NombreUsuario = '".$datosUsuario[0]."' AND Password = '".$datosUsuario[1]."' AND Activo = 1";
    
    try 
    {

        $db = getConnection();
        $stmt = $db->query($sql);
        $response = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;

        if($stmt->rowCount() > 0)
        {
            if( !isset( $_SESSION['Usuario'] ) )
            {
                foreach ($response as $aux) 
                {
                    $aux->Password = "";
                }

                $_SESSION['Usuario'] = $response;
                $_SESSION['Perfil'] = '';
                $_SESSION['sitio'] = 'www.cocinasK.com';
                $_SESSION['timeout'] = strtotime( $session_expiration_time );

                $rspH = $app->response();
                $rspH['X-Api-Key'] = generateToken(false);
                echo json_encode($response);
            }
            else
            {
               echo '[ { "Estatus": "SesionInicada" } ]';
            } 
        }
        else
        {
           echo '[ { "Estatus": "Error" } ]';
        }
    } 
    catch(PDOException $e) 
    {
        echo($e);
        $app->status(409);
        $app->stop();
    }
}

//Obtiene el estado actual de la sesión del usuario
function GetEstadoSesion()
{
    global $app;

    if( null == $app->response->headers->get('X-Api-Key') )
        $app->response->headers->set('X-Api-Key', generateToken(false));


    if( isset( $_SESSION['Usuario'] ) )
    { 
        //echo json_encode($_SESSION['Usuario']);
        echo '[ { "Estatus": true, "Perfil": "'.$_SESSION['Perfil'].'"}, {"Usuario":'.json_encode($_SESSION['Usuario']).'} ]';        
    }
    else
    {
        echo '[ { "Estatus": false } ]';
    }
}

function CerrarSesion()
{   
    global $app;

    quitarSesion();

    $response = $app->response();
    $response['X-Api-Key'] = generateToken(false);

    echo '[ { "Estatus": true } ]';

}

//guarda el perfil que selecciono el usurio en las variable de php
function SetPerfil()
{
    global $app;
    $request = \Slim\Slim::getInstance()->request();
    $perfil = json_decode($request->getBody());
    
    $_SESSION['Perfil'] = $perfil[0];
    echo $perfil[0];
}

?>