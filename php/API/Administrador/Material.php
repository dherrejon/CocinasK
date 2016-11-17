<?php

/*---------------------Material---------------------*/
function GetMaterial()
{
    global $app;
    global $session_expiration_time;

    $request = \Slim\Slim::getInstance()->request();

    $sql = "SELECT * FROM MaterialVista WHERE MaterialId > 0";

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

function AgregarMaterial()
{
    $request = \Slim\Slim::getInstance()->request();
    $material = json_decode($request->getBody());
    global $app;
    
    $sql = "INSERT INTO Material (TipoMaterialId, Nombre, CostoUnidad, Activo) 
                            VALUES( :TipoMaterialId, :Nombre, :CostoUnidad, :Activo)";
    $db;
    $stmt;
    $materialId;
    
    try 
    {
        $db = getConnection();
        $db->beginTransaction();
        $stmt = $db->prepare($sql);
    
        $stmt->bindParam("TipoMaterialId", $material->TipoMaterial->TipoMaterialId);
        $stmt->bindParam("Nombre", $material->Nombre);
        $stmt->bindParam("CostoUnidad", $material->CostoUnidad);
        $stmt->bindParam("Activo", $material->Activo);

        $stmt->execute();
        
        $materialId = $db->lastInsertId();
    }
    catch(PDOException $e) 
    {
        echo $e;
        $db->rollBack();
        $app->status(409);
        $app->stop();
    }

    $numeroGrueso = count($material->grueso);
        
    if($numeroGrueso > 0)
    {
        $sql = "INSERT INTO GruesoMaterial (MaterialId, Grueso, CostoUnidad, Activo) VALUES";

        for($k=0; $k<$numeroGrueso; $k++)
        {
            $sql .= " (".$materialId.", '".$material->grueso[$k]->Grueso."',  ".$material->grueso[$k]->CostoUnidad.", ".$material->grueso[$k]->Activo."),";
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
            $db->rollBack();
            $app->status(409);
            $app->stop();
            echo $e;
            echo '[{"Estatus": "Fallido"}]';
        }
    }
    
    else
    {
        echo '[{"Estatus": "Exitoso"}]';
        $db->commit();
        $db = null; 
    }
}

function EditarMaterial()
{
    $request = \Slim\Slim::getInstance()->request();
    $material = json_decode($request->getBody());
    global $app;
    
    $sql = "UPDATE Material SET TipoMaterialId='".$material->TipoMaterial->TipoMaterialId."', Nombre='".$material->Nombre."', CostoUnidad='".$material->CostoUnidad."',  Activo='".$material->Activo."' WHERE MaterialId=".$material->MaterialId."";

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
    
    $sql = "DELETE FROM GruesoMaterial WHERE MaterialId=".$material->MaterialId;
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
    

    $numeroGrueso = count($material->grueso);
    
    if($numeroGrueso > 0)
    {
        $sql = "INSERT INTO GruesoMaterial (MaterialId, Grueso, CostoUnidad, Activo) VALUES";

        for($k=0; $k<$numeroGrueso; $k++)
        {
            $sql .= " (".$material->MaterialId.", '".$material->grueso[$k]->Grueso."',  ".$material->grueso[$k]->CostoUnidad.",  ".$material->grueso[$k]->Activo."),";
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
            $db->rollBack();
            $app->status(409);
            $app->stop();
            echo $e;
            //echo '[{"Estatus": "Fallido"}]';
        }
    }
    
    else
    {
        $db->commit();
        $db = null; 
        echo '[{"Estatus": "Exitoso"}]';
    }
}

function ActivarDesactivarMaterial()
{
    global $app;
    $request = \Slim\Slim::getInstance()->request();
    $datos = json_decode($request->getBody());
    try 
    {
        $db = getConnection();
        
        $sql = "UPDATE Material SET Activo = ".$datos[0]." WHERE MAterialId = ".$datos[1]."";
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

/*------------------ Grueso Material ------------------*/
function GetGruesoMaterial()
{
    global $app;
    global $session_expiration_time;

    $request = \Slim\Slim::getInstance()->request();

    $sql = "SELECT * FROM GruesoMaterial";

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

function ActivarDesactivarGruesoMaterial()
{
    global $app;
    $request = \Slim\Slim::getInstance()->request();
    $datos = json_decode($request->getBody());
    try 
    {
        $db = getConnection();
        
        $sql = "UPDATE GruesoMaterial SET Activo = ".$datos[0]." WHERE GruesoMaterialId = ".$datos[1]."";
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

/*---------------------tipo material---------------------*/
function GetTipoMaterial()
{
    global $app;
    global $session_expiration_time;

    $request = \Slim\Slim::getInstance()->request();

    $sql = "SELECT * FROM TipoMaterialVista WHERE TipoMaterialId > 0";

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

function AgregarTipoMaterial()
{
    $request = \Slim\Slim::getInstance()->request();
    $tipoMaterial = json_decode($request->getBody());
    global $app;
    $sql = "INSERT INTO TipoMaterial (MaterialParaId, Nombre, Activo) VALUES(:MaterialParaId, :Nombre, :Activo)";

    try 
    {
        $db = getConnection();
        $stmt = $db->prepare($sql);

        $stmt->bindParam("MaterialParaId", $tipoMaterial->MaterialParaId);
        $stmt->bindParam("Nombre", $tipoMaterial->Nombre);
        $stmt->bindParam("Activo", $tipoMaterial->Activo);

        $stmt->execute();

        $db = null;
        echo '[{"Estatus": "Exitoso"}]';

    } catch(PDOException $e) 
    {
        echo '[{"Estatus": "Fallido"}]';
    }
}

function EditarTipoMaterial()
{
    global $app;
    $request = \Slim\Slim::getInstance()->request();
    $tipoMaterial = json_decode($request->getBody());
   
    $sql = "UPDATE TipoMaterial SET MaterialParaId='".$tipoMaterial->MaterialParaId."', Nombre='".$tipoMaterial->Nombre."', Activo = '".$tipoMaterial->Activo."'  WHERE TipoMaterialID=".$tipoMaterial->TipoMaterialId."";
    
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
        echo '[{"Estatus": "Fallido"}]';
        $app->status(409);
        $app->stop();
    }
}

function ActivarDesactivarTipoMaterial()
{
    global $app;
    $request = \Slim\Slim::getInstance()->request();
    $datos = json_decode($request->getBody());
    try 
    {
        $db = getConnection();
        
        $sql = "UPDATE TipoMaterial SET Activo = ".$datos[0]." WHERE TipoMaterialId = ".$datos[1]."";
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

/*---------------Material para --------*/
function GetMaterialPara()
{
    global $app;
    global $session_expiration_time;

    $request = \Slim\Slim::getInstance()->request();

    $sql = "SELECT * FROM MaterialPara";

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

function GetTipoMaterialParaModulo()
{
    global $app;
    global $session_expiration_time;

    $request = \Slim\Slim::getInstance()->request();

    $sql = "SELECT * FROM TipoMaterial WHERE MaterialParaId=1 AND TipoMaterialId > 0";

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