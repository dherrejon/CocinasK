<?php

function GetAccesorio()
{
    global $app;
    global $session_expiration_time;

    $request = \Slim\Slim::getInstance()->request();

    $sql = "SELECT * FROM AccesorioVista";

    try 
    {

        $db = getConnection();
        $stmt = $db->query($sql);
        $response = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;
        
        foreach ($response as $aux) 
        {
            $aux->Imagen =  base64_encode($aux->Imagen);
        }
        
        echo json_encode($response);  
    } 
    catch(PDOException $e) 
    {
        echo($e);
        $app->status(409);
        $app->stop();
    }
}

function AgregarAccesorio()
{
    $request = \Slim\Slim::getInstance()->request();
    $accesorio = json_decode($request->getBody());
    global $app;
    
    if($accesorio->TipoAccesorio->ClaseAccesorio->ClaseAccesorioId == "1")
    {
        $sql = "INSERT INTO Accesorio (TipoAccesorioId, MuestrarioId, Nombre, CostoUnidad,  Contable, Obligatorio, Activo) 
                            VALUES( :TipoAccesorioId, :MuestrarioId, :Nombre, :CostoUnidad, :Contable, :Obligatorio, :Activo)";
    }
    
    if($accesorio->TipoAccesorio->ClaseAccesorio->ClaseAccesorioId == "2")
    {
        $sql = "INSERT INTO Accesorio (TipoAccesorioId, MuestrarioId, Nombre, ConsumoUnidad,  Contable, Obligatorio, Activo) 
                            VALUES( :TipoAccesorioId, :MuestrarioId, :Nombre, :ConsumoUnidad, :Contable, :Obligatorio, :Activo)";
    }

    $db;
    $stmt;
    $usuarioId;
    
    try 
    {
        $db = getConnection();
        $db->beginTransaction();
        $stmt = $db->prepare($sql);
    
        $stmt->bindParam("TipoAccesorioId", $accesorio->TipoAccesorio->TipoAccesorioId);
        $stmt->bindParam("MuestrarioId", $accesorio->Muestrario->MuestrarioId);
        $stmt->bindParam("Nombre", $accesorio->Nombre);
        $stmt->bindParam("Contable", $accesorio->Contable);
        $stmt->bindParam("Obligatorio", $accesorio->Obligatorio);
        $stmt->bindParam("Activo", $accesorio->Activo);
        
        if($accesorio->TipoAccesorio->ClaseAccesorio->ClaseAccesorioId == "1")
        {
            $stmt->bindParam("CostoUnidad", $accesorio->CostoUnidad);
        }

        if($accesorio->TipoAccesorio->ClaseAccesorio->ClaseAccesorioId == "2")
        {
            $stmt->bindParam("ConsumoUnidad", $accesorio->ConsumoUnidad);
        }

        $stmt->execute();
        
        $accesorioId = $db->lastInsertId();
    }
    catch(PDOException $e) 
    {
        echo $e;
        $db->rollBack();
        $app->status(409);
        $app->stop();
    }
    
    if($accesorio->TipoAccesorio->ClaseAccesorio->ClaseAccesorioId == "1")
    {
        echo '[{"Estatus": "Exitoso"}, {"AccesorioId":'.$accesorioId.'}]';
        $db->commit();
        $db = null; 
    }
    else if($accesorio->TipoAccesorio->ClaseAccesorio->ClaseAccesorioId == "2")
    {
    
        $countCombinaciones = count($accesorio->Combinacion);

        if($countCombinaciones > 0)
        {
            $sql = "INSERT INTO CombinacionPorMaterialAccesorio (AccesorioId, CombinacionMaterialId, MaterialId, Grueso) VALUES";

            for($k=0; $k<$countCombinaciones; $k++)
            {
                $sql .= " (".$accesorioId.", ".$accesorio->Combinacion[$k]->CombinacionMaterial->CombinacionMaterialId.", ".$accesorio->Combinacion[$k]->Material->MaterialId.", '".$accesorio->Combinacion[$k]->Grueso."'),";
            }

            $sql = rtrim($sql,",");

            try 
            {
                $stmt = $db->prepare($sql);
                $stmt->execute();

                $db->commit();
                $db = null; 

                echo '[{"Estatus": "Exitoso"}, {"AccesorioId":'.$accesorioId.'}]';
            } 
            catch(PDOException $e) 
            {
                echo $e;
                $db->rollBack();
                $app->status(409);
                $app->stop();

                //echo '[{"Estatus": "Fallido"}]';
            }
        }

        else
        {
            echo '[{"Estatus": "Exitoso"}, {"AccesorioId":'.$accesorioId.'}]';
            $db->commit();
            $db = null; 
        }
    }
}

function EditarAccesorio()
{
    $request = \Slim\Slim::getInstance()->request();
    $accesorio = json_decode($request->getBody());
    global $app;
    
    if($accesorio->TipoAccesorio->ClaseAccesorio->ClaseAccesorioId == "1")
    {
        $sql = "UPDATE Accesorio SET TipoAccesorioId='".$accesorio->TipoAccesorio->TipoAccesorioId."', MuestrarioId ='".$accesorio->Muestrario->MuestrarioId."', Nombre='".$accesorio->Nombre."', Activo='".$accesorio->Activo."', Contable='".$accesorio->Contable."', Obligatorio='".$accesorio->Obligatorio."', CostoUnidad='".$accesorio->CostoUnidad."' WHERE AccesorioId=".$accesorio->AccesorioId."";
    }
    
    if($accesorio->TipoAccesorio->ClaseAccesorio->ClaseAccesorioId == "2")
    {
        $sql = "UPDATE Accesorio SET TipoAccesorioId='".$accesorio->TipoAccesorio->TipoAccesorioId."', MuestrarioId ='".$accesorio->Muestrario->MuestrarioId."', Nombre='".$accesorio->Nombre."', Activo='".$accesorio->Activo."', Contable='".$accesorio->Contable."', Obligatorio='".$accesorio->Obligatorio."', ConsumoUnidad='".$accesorio->ConsumoUnidad."' WHERE AccesorioId=".$accesorio->AccesorioId."";
    }
    
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
    
    $sql = "DELETE FROM CombinacionPorMaterialAccesorio WHERE AccesorioId=".$accesorio->AccesorioId;
    try 
    {
        $stmt = $db->prepare($sql); 
        $stmt->execute(); 
        
    } 
    catch(PDOException $e) 
    {
        echo '[ { "Estatus": "Fallo" } ]';
        //echo $e;
        $db->rollBack();
        $app->status(409);
        $app->stop();
    }
    
    if($accesorio->TipoAccesorio->ClaseAccesorio->ClaseAccesorioId == "1")
    {
        echo '[{"Estatus": "Exitoso"}]';
        $db->commit();
        $db = null; 
    }
    else if($accesorio->TipoAccesorio->ClaseAccesorio->ClaseAccesorioId == "2")
    {
        $countCombinaciones = count($accesorio->Combinacion);

        if($countCombinaciones > 0)
        {
            $sql = "INSERT INTO CombinacionPorMaterialAccesorio (AccesorioId, CombinacionMaterialId, MaterialId, Grueso) VALUES";

            for($k=0; $k<$countCombinaciones; $k++)
            {
                $sql .= " (".$accesorio->AccesorioId.", ".$accesorio->Combinacion[$k]->CombinacionMaterial->CombinacionMaterialId.", ".$accesorio->Combinacion[$k]->Material->MaterialId.", '".$accesorio->Combinacion[$k]->Grueso."'),";
            }

            $sql = rtrim($sql,",");

            try 
            {
                $stmt = $db->prepare($sql);
                $stmt->execute();

                $db->commit();
                $db = null; 

                echo '[{"Estatus": "Exitoso"}]';
            } 
            catch(PDOException $e) 
            {
                echo $e;
                $db->rollBack();
                $app->status(409);
                $app->stop();

                //echo '[{"Estatus": "Fallido"}]';
            }
        }

        else
        {
            echo '[{"Estatus": "Exitoso"}]';
            $db->commit();
            $db = null; 
        }
    }
}



function ActivarDesactivarAccesorio()
{
    global $app;
    $request = \Slim\Slim::getInstance()->request();
    $datos = json_decode($request->getBody());
    try 
    {
        $db = getConnection();
        
        $sql = "UPDATE Accesorio SET Activo = ".$datos[0]." WHERE AccesorioId = ".$datos[1]."";
        $stmt = $db->prepare($sql);
        $stmt->execute();
    
        $db = null;
        
        echo '[{"Estatus": "Exito"}]';
    }
    catch(PDOException $e) 
    {
        echo '[{"Estatus":"Fallo"}]';
        //echo ($sql);
        $app->status(409);
        $app->stop();
    }
}

function GuardarImagenAccesorio($id)
{
    global $app;
    $request = \Slim\Slim::getInstance()->request();
    $name = $_FILES['file']['name'];
    
    $archivo = addslashes(file_get_contents($_FILES['file']['tmp_name']));

    $sql = "UPDATE Accesorio SET  Imagen = '".$archivo."' WHERE AccesorioId = ".$id."";

    try 
    {
        $db = getConnection();
        $stmt = $db->prepare($sql);
        $stmt->execute();
        $db = null;
        echo '[{"Estatus": "Exitoso"}]';
        //echo '[{"rowcount":'. $stmt->rowCount() .'}]';
    }
    catch(PDOException $e) 
    {
        
        //echo $e;
        echo '[{"Estatus": "Fallido"}]';
        $app->status(409);
        $app->stop();
    }
}

/*-------------Combinacio-------------*/
function GetCombinacionPorAccesorio()
{    
    global $app;
    global $session_expiration_time;

    $request = \Slim\Slim::getInstance()->request();
    $accesorio = json_decode($request->getBody());
    
    
    $sql = "SELECT * FROM CombinacionAccesorioVista WHERE AccesorioId='".$accesorio[0]."'";
    
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
        echo $e;
        //echo '[ { "Estatus": "Fallo" } ]';
        $app->status(409);
        $app->stop();
    }
}

/*--------------- Tipo Accesorio ----------------------*/
function GetTipoAccesorio()
{
    global $app;
    global $session_expiration_time;

    $request = \Slim\Slim::getInstance()->request();

    $sql = "SELECT * FROM TipoAccesorioVista";

    try 
    {

        $db = getConnection();
        $stmt = $db->query($sql);
        $response = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;
        
        foreach ($response as $aux) 
        {
            $aux->Instrucciones =  base64_encode($aux->Instrucciones);
        }
        
        echo json_encode($response);  
    } 
    catch(PDOException $e) 
    {
        echo($e);
        $app->status(409);
        $app->stop();
    }
}

function AgregarTipoAccesorio()
{
    $request = \Slim\Slim::getInstance()->request();
    $tipoAccesorio = json_decode($request->getBody());
    global $app;
    $sql = "INSERT INTO TipoAccesorio (ClaseAccesorioId, Nombre, Activo) VALUES(:ClaseAccesorioId, :Nombre, :Activo)";

    try 
    {
        $db = getConnection();
        $stmt = $db->prepare($sql);

        $stmt->bindParam("ClaseAccesorioId", $tipoAccesorio->ClaseAccesorio->ClaseAccesorioId);
        $stmt->bindParam("Nombre", $tipoAccesorio->Nombre);
        $stmt->bindParam("Activo", $tipoAccesorio->Activo);

        $stmt->execute();
        
        $tipoAccesorioId = $db->lastInsertId();
        $db = null;
        
        echo '[{"Estatus": "Exitoso"}, {"TipoAccesorioId":'.$tipoAccesorioId.'}]';

    } catch(PDOException $e) 
    {
        echo '[{"Estatus": "Fallido"}]';
    }
}

function EditarTipoAccesorio()
{
    global $app;
    $request = \Slim\Slim::getInstance()->request();
    $tipoAccesorio = json_decode($request->getBody());
   
    $sql = "UPDATE TipoAccesorio SET ClaseAccesorioId = ".$tipoAccesorio->ClaseAccesorio->ClaseAccesorioId.", Nombre='".$tipoAccesorio->Nombre."', Activo = '".$tipoAccesorio->Activo."'  WHERE TipoAccesorioId = ".$tipoAccesorio->TipoAccesorioId;
    
    try 
    {
        $db = getConnection();
        $stmt = $db->prepare($sql);
        $stmt->execute();
        $db = null;
        
       

        echo '[{"Estatus":"Exitoso"}]';
    }
    catch(PDOException $e) 
    {    
        echo $sql;
        echo '[{"Estatus": "Fallido"}]';
        $app->status(409);
        $app->stop();
    }
}

function ActivarDesactivarTipoAccesorio()
{
    global $app;
    $request = \Slim\Slim::getInstance()->request();
    $datos = json_decode($request->getBody());
    try 
    {
        $db = getConnection();
        
        $sql = "UPDATE TipoAccesorio SET Activo = ".$datos[0]." WHERE TipoAccesorioId = ".$datos[1]."";
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

function GuardarInstrucciones($id)
{
    global $app;
    $request = \Slim\Slim::getInstance()->request();
    $name = $_FILES['file']['name'];
    
    $archivo = addslashes(file_get_contents($_FILES['file']['tmp_name']));

    $sql = "UPDATE TipoAccesorio SET NombreArchivo='".$name."', Instrucciones = '".$archivo."' WHERE TipoAccesorioId = ".$id."";

    try 
    {
        $db = getConnection();
        $stmt = $db->prepare($sql);
        $stmt->execute();
        $db = null;
        echo '[{"Estatus": "Exitoso"}]';
        //echo '[{"rowcount":'. $stmt->rowCount() .'}]';
    }
    catch(PDOException $e) 
    {
        
        //echo $e;
        echo '[{"Estatus": "Fallido"}]';
        $app->status(409);
        $app->stop();
    }
}

?>