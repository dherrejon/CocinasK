<?php

function GetColaborador()
{
    global $app;
    global $session_expiration_time;

    $request = \Slim\Slim::getInstance()->request();

    $sql = "SELECT * FROM ColaboradorVista";

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

function AgregarColaborador()
{
    $request = \Slim\Slim::getInstance()->request();
    $nuevoColaborador = json_decode($request->getBody());
    global $app;
    $sql = "INSERT INTO Colaborador (Nombre, PrimerApellido, SegundoApellido, UnidadNegocioId, PaisId, Domicilio, Codigo, Estado, Municipio, Ciudad, Colonia, Activo) 
                            VALUES(:Nombre, :PrimerApellido, :SegundoApellido, :UnidadNegocioId, :PaisId, :Domicilio, :Codigo, :Estado, :Municipio, :Ciudad, :Colonia, :Activo)";

    $db;
    $stmt;
    $colaboradorId;

    try 
    {
        $db = getConnection();
        $db->beginTransaction();
        $stmt = $db->prepare($sql);

        $stmt->bindParam("Nombre", $nuevoColaborador->colaborador->Nombre);
        $stmt->bindParam("PrimerApellido", $nuevoColaborador->colaborador->PrimerApellido);
        $stmt->bindParam("SegundoApellido", $nuevoColaborador->colaborador->SegundoApellido);
        $stmt->bindParam("UnidadNegocioId", $nuevoColaborador->colaborador->UnidadNegocioId);
        $stmt->bindParam("PaisId", $nuevoColaborador->colaborador->PaisId);
        $stmt->bindParam("Domicilio", $nuevoColaborador->colaborador->Domicilio);
        $stmt->bindParam("Codigo", $nuevoColaborador->colaborador->Codigo);
        $stmt->bindParam("Estado", $nuevoColaborador->colaborador->Estado);
        $stmt->bindParam("Municipio", $nuevoColaborador->colaborador->Municipio);
        $stmt->bindParam("Ciudad", $nuevoColaborador->colaborador->Ciudad);
        $stmt->bindParam("Colonia", $nuevoColaborador->colaborador->Colonia);
        $stmt->bindParam("Activo", $nuevoColaborador->colaborador->Activo);

        $stmt->execute();
        
        $colaboradorId = $db->lastInsertId();

        //$db = null;
        //echo '[{"Estatus": "Exitoso"}]';

    } catch(PDOException $e) 
    {
        //echo $e;
        $db->rollBack();
        $app->status(409);
        $app->stop();
        echo '[{"Estatus": "Fallido"}]';
    }

    $numeroContacto = count($nuevoColaborador->contacto);
    
    if($numeroContacto > 0)
    {
        $sql = "INSERT INTO ContactoColaborador (TipoMedioContactoId, Contacto, ColaboradorId) VALUES";

        for($k=0; $k<$numeroContacto; $k++)
        {
            $sql .= " (".$nuevoColaborador->contacto[$k]->TipoMedioContactoId.", '".$nuevoColaborador->contacto[$k]->Contacto."', ".$colaboradorId ."),";
        }

        $sql = rtrim($sql,",");

        try 
        {
            $stmt = $db->prepare($sql);
            $stmt->execute();

            $db->commit();
            $db = null; 

            echo '[{"Estatus":"Exitoso"}, {"ColaboradorId":"'.$colaboradorId.'"}]';
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

        echo '[{"Estatus":"Exitoso"}]';
    }
}

function EditarColaborador()
{
    global $app;
    $request = \Slim\Slim::getInstance()->request();
    $nuevoColaborador = json_decode($request->getBody());
   
    $sql = "UPDATE Colaborador SET Nombre='".$nuevoColaborador->colaborador->Nombre."', PrimerApellido='".$nuevoColaborador->colaborador->PrimerApellido."', SegundoApellido='".$nuevoColaborador->colaborador->SegundoApellido."',
    PaisId='".$nuevoColaborador->colaborador->PaisId."', Domicilio='".$nuevoColaborador->colaborador->Domicilio."', Codigo='".$nuevoColaborador->colaborador->Codigo."', Estado='".$nuevoColaborador->colaborador->Estado."', Municipio='".$nuevoColaborador->colaborador->Municipio."',
    Ciudad='".$nuevoColaborador->colaborador->Ciudad."', Colonia='".$nuevoColaborador->colaborador->Colonia."', UnidadNegocioId='".$nuevoColaborador->colaborador->UnidadNegocioId."', Activo = '".$nuevoColaborador->colaborador->Activo."'  WHERE ColaboradorId=".$nuevoColaborador->colaborador->ColaboradorId."";
    
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
        echo '[{"Estatus": "Fallido"}]';
        $app->status(409);
        $app->stop();
    }
    
    $numeroContacto = count($nuevoColaborador->contacto);
    
    if($numeroContacto > 0)
    {
        $sql = "INSERT INTO ContactoColaborador (TipoMedioContactoId, Contacto, ColaboradorId) VALUES";
        $colaboradorId = $nuevoColaborador->colaborador->ColaboradorId;

        for($k=0; $k<$numeroContacto; $k++)
        {
            $sql .= " (".$nuevoColaborador->contacto[$k]->TipoMedioContactoId.", '".$nuevoColaborador->contacto[$k]->Contacto."', ".$colaboradorId ."),";
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

        echo '[{"Estatus":"Exitoso"}]';
    }
}

function ActivarDesactivarColaborador()
{
    global $app;
    $request = \Slim\Slim::getInstance()->request();
    $nuevoColaborador = json_decode($request->getBody());

    $sql = "UPDATE Colaborador SET Activo ='".$nuevoColaborador[1]."' WHERE ColaboradorId='".$nuevoColaborador[0]."'";
    $db;
    $stmt;
    try 
    {
        $db = getConnection();
        $db->beginTransaction();
        $stmt = $db->prepare($sql);
        $stmt = $db->query($sql);
        $stmt->execute();
    }
    catch(PDOException $e) 
    {
        $app->status(409);
        $app->stop();
    }
    
    if($nuevoColaborador[2] != null)
    {
        $sql = "UPDATE Usuario SET Activo = '".$nuevoColaborador[3]."' WHERE UsuarioId='".$nuevoColaborador[2]."'";

        try 
        {
            $stmt = $db->prepare($sql);
            $stmt->execute();

            $db->commit();
            $db = null;     

             echo '[{"Estatus": "Exito"}]';
        } catch(PDOException $e) 
        {
            echo '[{"Estatus": "Fallido"}]';
            $db->rollBack();
            $app->status(409);
            $app->stop();
        }
    }
    else
    {
        $db->commit();
        $db = null;     
        echo '[{"Estatus": "Exito"}]';
    }
}

function GetContactoColaborador()
{
    global $app;
    global $session_expiration_time;

    $request = \Slim\Slim::getInstance()->request();
    $colaboradorId = json_decode($request->getBody());
    
    
    $sql = "SELECT * FROM ContactoColaboradorVista WHERE ColaboradorId = '".$colaboradorId[0]."'";
    
    try 
    {

        $db = getConnection();
        $stmt = $db->query($sql);
        $response = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;
        
        echo '[ { "Estatus": "Exito"}, {"Contacto":'.json_encode($response).'} ]';  
    } 
    catch(PDOException $e) 
    {
        echo '[ { "Estatus": "Fallo" } ]';
        //$app->status(409);
        $app->stop();
    }
}

function DeleteContactoColaborador() 
{
    //echo '[ { "Estatus": "Fallo" } ]';
    global $app;
    global $session_expiration_time;
    
    $request = \Slim\Slim::getInstance()->request();
    $id = json_decode($request->getBody());

    $sql = "DELETE FROM ContactoColaborador WHERE MedioContactoColaboradorId=".$id;
    try 
    {
        $db = getConnection();
        $stmt = $db->prepare($sql); 
        $stmt->execute(); 
        $db = null;
        
        echo '[ { "Estatus": "Exito" } ]';
        //echo '[{"rowcount":'. $stmt->rowCount() .'}]';
    } 
    catch(PDOException $e) 
    {
        echo '[ { "Estatus": "Fallo" } ]';
        $app->status(409);
        $app->stop();
    }
}

function EditarContactoColabordor()
{
    global $app;
    $request = \Slim\Slim::getInstance()->request();
    $nuevoContacto = json_decode($request->getBody());
   
    $sql = "UPDATE ContactoColaborador SET TipoMedioContactoId='".$nuevoContacto->TipoMedioContactoId."', Contacto='".$nuevoContacto->Contacto."'   WHERE MedioContactoColaboradorId=".$nuevoContacto->MedioContactoColaboradorId."";
    
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
}

function EnviarCorreo()
{
    try 
    {
        global $app;
        $request = \Slim\Slim::getInstance()->request();

        $app->status(200);
        echo '[{"Estatus":"Correo enviado"}]';
    }
    catch(PDOException $e) 
    {
        echo '[{"Estatus":"Fallo"}]';
        $app->status(409);
        $app->stop();
    }
    
}



?>