<?php

//obtiene los perfiles de un determinado usuario
function GetPerfilPorUsuario()
{
    global $app;
    global $session_expiration_time;

    $request = \Slim\Slim::getInstance()->request();
    $usuarioId = json_decode($request->getBody());
    
    
    $sql = "SELECT p.* FROM Perfil p, Usuario u, PerfilPorusuario pp WHERE u.UsuarioId = pp.UsuarioId AND pp.PerfilId = p.PerfilId AND u.UsuarioId='".$usuarioId[0]."'";
    
    try 
    {

        $db = getConnection();
        $stmt = $db->query($sql);
        $response = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;
        
        echo '[ { "Estatus": "Exito"}, {"Perfil":'.json_encode($response).'} ]';  
    } 
    catch(PDOException $e) 
    {
        echo $e;
        //echo '[ { "Estatus": "Fallo" } ]';
        //$app->status(409);
        $app->stop();
    }
}

function ActivarDesactivarUsuario()
{
    global $app;
    $request = \Slim\Slim::getInstance()->request();
    $datos = json_decode($request->getBody());
    try 
    {
        $db = getConnection();
        
        $sql = "UPDATE Usuario SET Activo = ".$datos[1]." WHERE UsuarioId = ".$datos[0]."";
        $stmt = $db->prepare($sql);
        $stmt->execute();
        

        $db = null;
        echo '[{"Estatus":"Exito"}]';
    }
    catch(PDOException $e) 
    {
        echo '[{"Estatus":"Fallo"}]';
        //echo ($e);
        $app->status(409);
        $app->stop();
    }
}

function AgregarUsuario()
{
    $request = \Slim\Slim::getInstance()->request();
    $usuario = json_decode($request->getBody());
    global $app;
    $sql = "INSERT INTO Usuario (ColaboradorId, Nombre, Password, Activo) 
                            VALUES(:ColaboradorId, :Nombre, :Password, :Activo)";

    $db;
    $stmt;
    $usuarioId;
    
    try 
    {
        $db = getConnection();
        $db->beginTransaction();
        $stmt = $db->prepare($sql);
        
        $stmt->bindParam("ColaboradorId", $usuario->colaborador->ColaboradorId);
        $stmt->bindParam("Nombre", $usuario->colaborador->NombreUsuario);
        $stmt->bindParam("Password", $usuario->colaborador->Password);
        $stmt->bindParam("Activo", $usuario->colaborador->ActivoUsuario);

        $stmt->execute();
        
        $usuarioId = $db->lastInsertId();
    }
    catch(PDOException $e) 
    {
        echo $e;
        $db->rollBack();
        $app->status(409);
        $app->stop();
    }

    $numeroPerfil = count($usuario->perfil);
    
    if($numeroPerfil > 0)
    {
        $sql = "INSERT INTO PerfilPorUsuario (PerfilId, UsuarioId) VALUES";

        for($k=0; $k<$numeroPerfil; $k++)
        {
            if($usuario->perfil[$k]->Activo)
            {
                $sql .= " (".$usuario->perfil[$k]->PerfilId.",  ".$usuarioId."),";
            }
        }

        $sql = rtrim($sql,",");

        try 
        {
            $stmt = $db->prepare($sql);
            $stmt->execute();

        } catch(PDOException $e) 
        {
            $db->rollBack();
            $app->status(409);
            $app->stop();
            echo $e;
        }
    }

    $numeroPermiso = count($usuario->permiso);
    
    if($numeroPermiso > 0)
    {
        $sql = "INSERT INTO PermisoPorUsuario (PermisoId, UsuarioId) VALUES";

        for($k=0; $k<$numeroPermiso; $k++)
        {
            if($usuario->permiso[$k]->Activo)
            {
                for($i=0; $i<$numeroPerfil; $i++)
                {
                    if($usuario->permiso[$k]->NombrePerfil == $usuario->perfil[$i]->Nombre  && $usuario->perfil[$i]->Activo)
                    {
                        $sql .= " (".$usuario->permiso[$k]->PermisoId.",  ".$usuarioId."),";
                        break;
                    }
                }
                
            }
        }

        $sql = rtrim($sql,",");

        try 
        {
            $stmt = $db->prepare($sql);
            $stmt->execute();

            $db->commit();
            $db = null; 

            echo '[{"Estatus":"Exitoso"}]';
        } catch(PDOException $e) 
        {
            $db->rollBack();
            $app->status(409);
            $app->stop();
            echo '[{"Estatus": "Fallido"}]';
        }
    }
    else
    {
        $db->commit();
        $db = null; 
        echo $e;
    }
    
    $numeroContacto = count($usuario->contacto);

    for($k=0; $k<$numeroContacto; $k++)
    {
        if($usuario->contacto[$k]->NombreMedioContacto == "Correo Electrónico")
        {
            $to= $usuario->contacto[$k]->Contacto;
            $subject_message = "Bienvenido al Sistema Integral de Cocinas K";
            $body_message = "Ya puedes acceder al Sistema Integral de Cocinas K tu usuario y " .utf8_decode("contraseña"). " son los siguientes:";
            $body_message .= "\n\n";
            $body_message .="Usario: ". $usuario->colaborador->NombreUsuario;
            $body_message .= "\n  ".utf8_decode("contraseña").": ". base64_decode($usuario->colaborador->Correo);
            $body_message .= "\n\n";
            $body_message .= "Te recomendamos entrar al sistema y cambiar tu".utf8_decode("contraseña"). " inmediatamente." ;


            $header = "De: Cocinas K\r\n";

            $bool = mail($to,$subject_message,$body_message,$header);
        }
    }
}

function EditarUsuario()
{
    $request = \Slim\Slim::getInstance()->request();
    $usuario = json_decode($request->getBody());
    global $app;
    
    $sql = "UPDATE Usuario SET Nombre='".$usuario->usuario->NombreUsuario."' WHERE UsuarioId=".$usuario->usuario->UsuarioId."";

    $db;
    $stmt;
    
    try 
    {
        $db = getConnection();
        $db->beginTransaction();
        $stmt = $db->prepare($sql);
        $stmt->execute();
    }
    catch(PDOException $e) 
    {
        //echo '[ { "Estatus": "Fallo" } ]';
        echo $e;
        $db->rollBack();
        $app->status(409);
        $app->stop();
    }
    
    $sql = "DELETE FROM PerfilPorUsuario WHERE UsuarioId=".$usuario->usuario->UsuarioId;
    try 
    {
        $stmt = $db->prepare($sql); 
        $stmt->execute(); 
        
    } 
    catch(PDOException $e) 
    {
        //echo '[ { "Estatus": "Fallo" } ]';
        echo $e;
        $db->rollBack();
        $app->status(409);
        $app->stop();
    }
    
    $sql = "DELETE FROM PermisoPorUsuario WHERE UsuarioId=".$usuario->usuario->UsuarioId;
    try 
    {
        $stmt = $db->prepare($sql); 
        $stmt->execute(); 
        
    } 
    catch(PDOException $e) 
    {
        //echo '[ { "Estatus": "Fallo" } ]';
        echo $e;
        $db->rollBack();
        $app->status(409);
        $app->stop();
    }

    $numeroPerfil = count($usuario->perfil);
    
    if($numeroPerfil > 0)
    {
        $sql = "INSERT INTO PerfilPorUsuario (PerfilId, UsuarioId) VALUES";

        for($k=0; $k<$numeroPerfil; $k++)
        {
            if($usuario->perfil[$k]->Activo)
            {
                $sql .= " (".$usuario->perfil[$k]->PerfilId.",  ".$usuario->usuario->UsuarioId."),";
            }
        }

        $sql = rtrim($sql,",");

        try 
        {
            $stmt = $db->prepare($sql);
            $stmt->execute();

        } catch(PDOException $e) 
        {
            $db->rollBack();
            $app->status(409);
            $app->stop();
            echo $e;
        }
    }

    $numeroPermiso = count($usuario->permiso);
    
    if($numeroPermiso > 0)
    {
        $sql = "INSERT INTO PermisoPorUsuario (PermisoId, UsuarioId) VALUES";

        for($k=0; $k<$numeroPermiso; $k++)
        {
            if($usuario->permiso[$k]->Activo)
            {
                for($i=0; $i<$numeroPerfil; $i++)
                {
                    if($usuario->permiso[$k]->NombrePerfil == $usuario->perfil[$i]->Nombre  && $usuario->perfil[$i]->Activo)
                    {
                        $sql .= " (".$usuario->permiso[$k]->PermisoId.",  ".$usuario->usuario->UsuarioId."),";
                        break;
                    }
                }
                
            }
        }

        $sql = rtrim($sql,",");

        try 
        {
            $stmt = $db->prepare($sql);
            $stmt->execute();

            $db->commit();
            $db = null; 

            echo '[{"Estatus":"Exitoso"}]';
        } catch(PDOException $e) 
        {
            $db->rollBack();
            $app->status(409);
            $app->stop();
            echo '[{"Estatus": "Fallido"}]';
        }
    }
    else
    {
        $db->commit();
        $db = null; 
        echo $e;
    }
}

//obtiene los permisos de un usuario determinado
function GetPermisoPorUsuario()
{
    global $app;
    global $session_expiration_time;

    $request = \Slim\Slim::getInstance()->request();
    $usuarioId = json_decode($request->getBody());
    
    
    $sql = "SELECT * FROM PermisoPorUsuario WHERE UsuarioId='".$usuarioId[0]."'";
    
    try 
    {

        $db = getConnection();
        $stmt = $db->query($sql);
        $response = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;
        
        echo '[ { "Estatus": "Exitoso"}, {"Permiso":'.json_encode($response).'} ]';  
    } 
    catch(PDOException $e) 
    {
        //echo $e;
        echo '[ { "Estatus": "Fallo" } ]';
        //$app->status(409);
        $app->stop();
    }
}

function CambiarPassword()
{
    global $app;
    $request = \Slim\Slim::getInstance()->request();
    $nuevoUsuario = json_decode($request->getBody());
   
    $sql = "UPDATE Usuario SET Password='".$nuevoUsuario->usuario->Password."' WHERE UsuarioId=".$nuevoUsuario->usuario->UsuarioId."";
    
    try 
    {
        $db = getConnection();
        $stmt = $db->prepare($sql);
        $stmt->execute();
        $db = null;
        //if($stmt->rowCount() == 1)
        echo '[{"Estatus":"Exitoso"}]';
    }
    catch(PDOException $e) {
        echo ($e);
        echo '[{"Estatus":"Fallo"}]';
        $app->status(409);
        $app->stop();
    }
    
    $numeroContacto = count($nuevoUsuario->contacto);

    for($k=0; $k<$numeroContacto; $k++)
    {
        if($nuevoUsuario->contacto[$k]->NombreMedioContacto == "Correo Electrónico")
        {
            $to= $nuevoUsuario->contacto[$k]->Contacto;
            $subject_message = "Cocinas K: ". utf8_decode("contraseña"). " Reestablecida";
            $body_message = "Tu ". utf8_decode("contraseña"). " fue cambiada. Accede al Sistema Integral de Cococians K y cambia tu ". utf8_decode("contraseña")." inmediatamente.";
            $body_message .= "\n\n";
            $body_message .="Nueva ". utf8_decode("contraseña"). ":";
            $body_message .= base64_decode($nuevoUsuario->usuario->Correo);

            $header = "De: Cocinas K\r\n";

            $bool = mail($to,$subject_message,$body_message,$header);
        }
    }
}


/*-----------Permiso--------------*/
function GetPermiso()
{
    global $app;
    global $session_expiration_time;

    $request = \Slim\Slim::getInstance()->request();

    $sql = "SELECT * FROM PermisoVista";

    try 
    {

        $db = getConnection();
        $stmt = $db->query($sql);
        $response = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;

        
        echo json_encode($response);  
    } 
    catch(PDOException $e) 
    {
        echo($e);
        $app->status(409);
        $app->stop();
    }
}

?>