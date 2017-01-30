<?php

function GetCubierta()
{
    global $app;
    global $session_expiration_time;

    $request = \Slim\Slim::getInstance()->request();

    $sql = "SELECT * FROM CubiertaVista";

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
        echo '[{"Estatus": "Fallido"}]';
        //echo($e);
        $app->status(409);
        $app->stop();
    }
}

function AgregarCubierta()
{
    $request = \Slim\Slim::getInstance()->request();
    $cubierta = json_decode($request->getBody());
    global $app;
    
    $db;
    $stmt;
    
    $sql;
    
    if($cubierta->NuevoMaterial)
    {
        $sql = "INSERT INTO Material (TipoMaterialId, Nombre, CostoUnidad, MaterialDe, Activo) 
                            VALUES( ".$cubierta->Material->TipoMaterial->TipoMaterialId.", '".$cubierta->Material->Nombre."', 0, 'Cubierta', ".$cubierta->Material->Activo.")";
        try 
        {
            $db = getConnection();
            $db->beginTransaction();
            $stmt = $db->prepare($sql);

            $stmt->execute();
            
            $cubierta->Material->MaterialId = $db->lastInsertId();
        }
        catch(PDOException $e) 
        {
            //echo $e;
            echo '[{"Estatus": "Fallido"}]';
            $db->rollBack();
            $app->status(409);
            $app->stop();
        }
    }
    
    $sql = "INSERT INTO DatosCubierta (MaterialId, TipoCubiertaId, Margen, Desperdicio) 
                            VALUES( :MaterialId, :TipoCubiertaId, :Margen, :Desperdicio)";
    try 
    {
        if(!$cubierta->NuevoMaterial)
        {
            $db = getConnection();
            $db->beginTransaction();
        }
        $stmt = $db->prepare($sql);
    
        $stmt->bindParam("MaterialId", $cubierta->Material->MaterialId);
        $stmt->bindParam("TipoCubiertaId", $cubierta->TipoCubierta->TipoCubiertaId);
        $stmt->bindParam("Margen", $cubierta->Margen);
        $stmt->bindParam("Desperdicio", $cubierta->Desperdicio);

        $stmt->execute();
    }
    catch(PDOException $e) 
    {
        //echo $e;
        echo '[{"Estatus": "Fallido"}]';
        $db->rollBack();
        $app->status(409);
        $app->stop();
    }
    
    
    $numeroUbicacion = count($cubierta->Ubicacion);
    if($cubierta->TipoCubierta->TipoCubiertaId == "1")
    {
        for($k=0; $k<$numeroUbicacion; $k++)
        {
            if($cubierta->Ubicacion[$k]->Activo)
            {
                $sql = "INSERT INTO MaterialPorUbicacion (MaterialId, UbicacionCubiertaId) VALUES
                        (".$cubierta->Material->MaterialId.", ".$cubierta->Ubicacion[$k]->UbicacionCubiertaId.")";
                try 
                {
                    $stmt = $db->prepare($sql);
                    $stmt->execute();
                }
                catch(PDOException $e) 
                {
                    //echo $e;
                    echo '[{"Estatus": "Fallido"}]';
                    $db->rollBack();
                    $app->status(409);
                    $app->stop();
                }
            }
        }
    }

    $numeroGrupo = count($cubierta->Color);
        
    if($numeroGrupo > 0)
    {
        $sql = "INSERT INTO ColorPorMaterialCubierta (MaterialId, GrupoId, CostoUnidad, PorDefecto) VALUES";

        for($k=0; $k<$numeroGrupo; $k++)
        {
            $sql .= " (".$cubierta->Material->MaterialId.", ".$cubierta->Color[$k]->Grupo->GrupoId.",  ".$cubierta->Color[$k]->CostoUnidad.", ".$cubierta->Color[$k]->PorDefecto."),";
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
            //echo $e;
            echo '[{"Estatus": "Fallido"}]';
            $db->rollBack();
            $app->status(409);
            $app->stop();
        }
    }
    
    else
    {
        echo '[{"Estatus": "Exitoso"}]';
        $db->commit();
        $db = null; 
    }
}

function EditarCubierta()
{
    $request = \Slim\Slim::getInstance()->request();
    $cubierta = json_decode($request->getBody());
    global $app;
    
    $sql = "UPDATE DatosCubierta SET Margen='".$cubierta->Margen."', Desperdicio='".$cubierta->Desperdicio."' WHERE MaterialId=".$cubierta->Material->MaterialId."";

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
        echo '[ { "Estatus": "Fallo" } ]';
        //echo $e;
        $db->rollBack();
        $app->status(409);
        $app->stop();
    }
    
    $sql = "DELETE FROM MaterialPorUbicacion WHERE MaterialId=".$cubierta->Material->MaterialId;
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
    
    $sql = "DELETE FROM ColorPorMaterialCubierta WHERE MaterialId=".$cubierta->Material->MaterialId;
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

    if($cubierta->TipoCubierta->TipoCubiertaId == "1")
    {
        $numeroUbicacion = count($cubierta->Ubicacion);
        for($k=0; $k<$numeroUbicacion; $k++)
        {
            if($cubierta->Ubicacion[$k]->Activo)
            {
                $sql = "INSERT INTO MaterialPorUbicacion (MaterialId, UbicacionCubiertaId) VALUES
                        (".$cubierta->Material->MaterialId.", ".$cubierta->Ubicacion[$k]->UbicacionCubiertaId.")";
                try 
                {
                    $stmt = $db->prepare($sql);
                    $stmt->execute();
                }
                catch(PDOException $e) 
                {
                    //echo $e;
                    echo '[{"Estatus": "Fallido"}]';
                    $db->rollBack();
                    $app->status(409);
                    $app->stop();
                }
            }
        }
    }

    $numeroGrupo = count($cubierta->Color);
        
    if($numeroGrupo > 0)
    {
        $sql = "INSERT INTO ColorPorMaterialCubierta (MaterialId, GrupoId, CostoUnidad, PorDefecto) VALUES";

        for($k=0; $k<$numeroGrupo; $k++)
        {
            $sql .= " (".$cubierta->Material->MaterialId.", ".$cubierta->Color[$k]->Grupo->GrupoId.",  ".$cubierta->Color[$k]->CostoUnidad.", ".$cubierta->Color[$k]->PorDefecto."),";
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
            //echo $e;
            echo '[{"Estatus": "Fallido"}]';
            $db->rollBack();
            $app->status(409);
            $app->stop();
        }
    }
    
    else
    {
        echo '[{"Estatus": "Exitoso"}]';
        $db->commit();
        $db = null; 
    }
    
}

/*--------------- datos de la cubierta ----------------------*/
function GetCubiertaUbicacion()
{
    global $app;
    global $session_expiration_time;

    $request = \Slim\Slim::getInstance()->request();
    $materialId = json_decode($request->getBody());
    
    
    $sql = "SELECT UbicacionCubiertaId FROM MaterialPorUbicacion WHERE MaterialId ='".$materialId[0]."'";
    
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
        //echo $e;
        echo '[ { "Estatus": "Fallo" } ]';
        $app->status(409);
        $app->stop();
    }
}

function GetGrupoColorCubierta()
{
    global $app;
    global $session_expiration_time;

    $request = \Slim\Slim::getInstance()->request();
    $materialId = json_decode($request->getBody());
    
    
    $sql = "SELECT * FROM ColorPorMaterialCubiertaVista WHERE MaterialId ='".$materialId[0]."'";
    
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
        //echo $e;
        echo '[ { "Estatus": "Fallo" } ]';
        $app->status(409);
        $app->stop();
    }
}


?>