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
        //echo '[{"Estatus":"Exitoso"}]';
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
            
            /*$from = new SendGrid\Email("azure_eebb7f37323fd82c6794e824362b3679@azure.com", "cocinask@outlook.com");
            $subject = "Cambio de contraseña";
            $to = new SendGrid\Email("Example User", $nuevoUsuario->contacto[$k]->Contacto);
            $content = new SendGrid\Content("text/plain", "and easy to do anywhere, even with PHP");
            $mail = new SendGrid\Mail($from, $subject, $to, $content);
            $apiKey = getenv('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');
            $sg = new \SendGrid($apiKey);
            $response = $sg->client->mail()->send()->post($mail);
            echo json_decode($response->statusCode());
            /*echo json_decode($response->headers());
            echo json_decode($response->body());*/
            
            $from = new SendGrid\Email(null, "test@example.com");
            $subject = "Hello World from the SendGrid PHP Library!";
            $to = new SendGrid\Email(null, "test@example.com");
            $content = new SendGrid\Content("text/plain", "Hello, Email!");
            $mail = new SendGrid\Mail($from, $subject, $to, $content);

            $apiKey = getenv('yV4Xx0mlTxib92kxohvZiQ');
            $sg = new \SendGrid($apiKey);

            $response = $sg->client->mail()->send()->post($mail);
            echo $response->statusCode();
            //echo $response->headers();
            //echo $response->body();

        }
    }
}

function CambiarPasswordPorUsuario()
{
    global $app;
    $request = \Slim\Slim::getInstance()->request();
    $usuario = json_decode($request->getBody());
    
    $db;
    $stmt;
    $response;
    $sql = "SELECT COUNT(*) as count FROM Usuario WHERE UsuarioId='".$usuario[0]."' AND Password = '".$usuario[1]."'";
    
    try 
    {
        $db = getConnection();
        $stmt = $db->query($sql);
        $response = $stmt->fetchAll(PDO::FETCH_OBJ);
    } 
    catch(PDOException $e) 
    {
        //echo $e;
        echo '[ { "Estatus": "Fallo" } ]';
        //$app->status(409);
        $app->stop();
    }
    
    if($response[0]->count != "1")
    {
        echo '[ { "Estatus": "ErrorPassword" } ]';
        $db = null;
        $app->stop();
    }
    else
    {   
        $sql = "UPDATE Usuario SET Password='".$usuario[2]."' WHERE UsuarioId=".$usuario[0]."";

        try 
        {
            $stmt = $db->prepare($sql);
            $stmt->execute();
            $db = null;
            //if($stmt->rowCount() == 1)
            echo '[{"Estatus":"Exitoso"}]';
        }
        catch(PDOException $e) 
        {
            echo ($e);
            echo '[{"Estatus":"Fallo"}]';
            $app->status(409);
            $app->stop();
        }
    }
}

function RecuperarPassword()
{
    global $app;
    $request = \Slim\Slim::getInstance()->request();
    $usuario = json_decode($request->getBody());
   
    $db;
    $stmt;
    $response;
    $contacto;
    $solicitud;
    $codigo;
    $sql = "SELECT UsuarioId, ColaboradorId FROM Usuario WHERE Nombre= '".$usuario->Nombre."' AND Activo = 1";
    
    try 
    {
        $db = getConnection();
        $stmt = $db->query($sql);
        $response = $stmt->fetchAll(PDO::FETCH_OBJ);  
    } 
    catch(PDOException $e) 
    {
        echo '[ { "Estatus": "Fallo" } ]';
        //$app->status(409);
        $app->stop();
    }
    
    $count = count($response);
    if($count != 1)
    {
        echo '[ { "Estatus": "ErrorUsuario" } ]';
        $db = null;
        $app->stop();
    }
    else
    {   
        $sql = "SELECT c.Contacto FROM ContactoColaborador c, TipoMedioContacto t WHERE c.ColaboradorId= '".$response[0]->ColaboradorId."' AND t.MedioContactoId = 1 AND t.TipoMedioContactoId = c.TipoMedioContactoId";
    
        try 
        {
            $db = getConnection();
            $stmt = $db->query($sql);
            $contacto = $stmt->fetchAll(PDO::FETCH_OBJ);
            
        } 
        catch(PDOException $e) 
        {
            echo '[ { "Estatus": "Fallo" } ]';
            //$app->status(409);
            $app->stop();
        }
        
        $countContacto = count($contacto);
        
        if($countContacto == 0)
        {
            echo '[ { "Estatus": "ErrorContacto" } ]';
            $db = null;
            $app->stop();
        }
        else
        {   
            $sql = "SELECT SolicitudRecuperarPasswordId FROM SolicitudRecuperarPassword  WHERE FechaCaducidad > NOW() AND UsuarioId = ".$response[0]->UsuarioId;

            try 
            {
                $db = getConnection();
                $stmt = $db->query($sql);
                $solicitud = $stmt->fetchAll(PDO::FETCH_OBJ);

            } 
            catch(PDOException $e) 
            {
                echo '[ { "Estatus": "Fallo" } ]';
                //$app->status(409);
                $app->stop();
            }
            
            $caracter = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            $numero = strlen($caracter) - 1;
            $codigo = substr($caracter, rand(0, $numero), 1).substr($caracter, rand(0, $numero), 1).substr($caracter, rand(0, $numero), 1).substr($caracter, rand(0, $numero), 1).substr($caracter, rand(0, $numero), 1).substr($caracter, rand(0, $numero), 1).substr($caracter, rand(0, $numero), 1).substr($caracter, rand(0, $numero), 1).substr($caracter, rand(0, $numero), 1);
            $sql = "INSERT INTO SolicitudRecuperarPassword(UsuarioId, Codigo, Fecha, FechaCaducidad) VALUES(".$response[0]->UsuarioId.",'".$codigo."', NOW(), adddate(NOW(), INTERVAL 2 HOUR))";
            
            try 
            {
                $db->beginTransaction();
                $stmt = $db->prepare($sql);
                $stmt->execute();
                
            } catch(PDOException $e) 
            {
                echo $e;
                echo '[{"Estatus": "Fallido"}]';
                $db->rollBack();
                $app->status(409);
                $app->stop();   
            }
            
            $countSolicitud = count($solicitud);
            if($countSolicitud > 0)
            {
                for($k=0; $k<$countSolicitud; $k++)
                {
                    $sql = "UPDATE SolicitudRecuperarPassword SET ESTATUS= 'Usado' WHERE SolicitudRecuperarPasswordId=".$solicitud[$k]->SolicitudRecuperarPasswordId;

                    try 
                    {
                        $stmt = $db->prepare($sql);
                        $stmt->execute();

                    }
                    catch(PDOException $e) 
                    {
                        $db->rollBack();
                        echo '[{"Estatus":"Fallo"}]';
                        $app->status(409);
                        $app->stop();
                    }
                }
                $db->commit();
                $db = null;
                echo '[ { "Estatus": "Exitoso" } ]';
            }
            else
            {
                $db->commit();
                $db = null;
                echo '[ { "Estatus": "Exitoso" } ]';
            }
        } 
    }
    
    $numeroContacto = count($contacto);

    for($k=0; $k<$numeroContacto; $k++)
    {
       
        $to= $contacto[$k]->Contacto;
        $subject_message = "Recuperar contraseña";
        $body_message = "Accede al siguiente enlace para que puedas reiniciar tu " .utf8_decode("contraseña");
        $body_message .= "\n\n";
        $body_message .="Enlace: http://localhost/cocinasK/#/RecuperarPassword/".$response[0]->UsuarioId."/".$codigo;

        $header = "De: Cocinas K\r\n";

        $bool = mail($to,$subject_message,$body_message,$header);
    }
}

function ValidarRecuperarPassword()
{
    global $app;
    global $session_expiration_time;

    $request = \Slim\Slim::getInstance()->request();
    $solicitud = json_decode($request->getBody());
    
    
    $sql = "SELECT SolicitudRecuperarPasswordId FROM SolicitudRecuperarPassword WHERE FechaCaducidad > NOW() AND Estatus IS NULL AND UsuarioId = ".$solicitud->UsuarioId." AND Codigo = '".$solicitud->Codigo."'";
    
    try 
    {
        $db = getConnection();
        $stmt = $db->query($sql);
        $response = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;
        
        echo '[ { "Estatus": "Exitoso"}, {"Solicitud":'.json_encode($response).'} ]';  
    } 
    catch(PDOException $e) 
    {
        //echo $e;
        echo '[ { "Estatus": "Fallo" } ]';
        //$app->status(409);
        $app->stop();
    }
}

function ReiniciarPassword()
{
    global $app;
    $request = \Slim\Slim::getInstance()->request();
    $usuario = json_decode($request->getBody());
   
    $sql = "UPDATE Usuario SET Password='".$usuario->Password."' WHERE UsuarioId=".$usuario->UsuarioId."";
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
        echo ($e);
        $db->rollBack();
        echo '[{"Estatus":"Fallo"}]';
        $app->status(409);
        $app->stop();
    }
    
    $sql = "UPDATE SolicitudRecuperarPassword SET Estatus='Usado' WHERE SolicitudRecuperarPasswordId=".$usuario->SolicitudRecuperarPasswordId."";
    try 
    {
        $stmt = $db->prepare($sql);
        $stmt->execute();
        $db->commit();
        $db = null;
        echo '[{"Estatus":"Exitoso"}]';
    }
    catch(PDOException $e) 
    {
        echo ($e);
        $db->rollBack();
        echo '[{"Estatus":"Fallo"}]';
        $app->status(409);
        $app->stop();
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