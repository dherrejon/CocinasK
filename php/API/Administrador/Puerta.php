<?php

function GetPuerta()
{
    global $app;
    global $session_expiration_time;

    $request = \Slim\Slim::getInstance()->request();

    $sql = "SELECT * FROM PuertaVista";

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

function AgregarPuerta()
{
    $request = \Slim\Slim::getInstance()->request();
    $puerta = json_decode($request->getBody());
    global $app;
    
    $sql = "INSERT INTO Puerta (MuestrarioId, Nombre, Activo) 
                            VALUES( :MuestrarioId, :Nombre, :Activo)";

    $db;
    $stmt;
    $puertaId;
    
    try 
    {
        $db = getConnection();
        $db->beginTransaction();
        $stmt = $db->prepare($sql);
        
        $stmt->bindParam("MuestrarioId", $puerta->Muestrario->MuestrarioId);
        $stmt->bindParam("Nombre", $puerta->Nombre);
        $stmt->bindParam("Activo", $puerta->Activo);

        $stmt->execute();
        
        $puertaId = $db->lastInsertId();
    }
    catch(PDOException $e) 
    {
        echo $e;
        $db->rollBack();
        $app->status(409);
        $app->stop();
    }
    
    $countComponente = count($puerta->Componente);
    
    if($countComponente > 0)
    {
        for($k=0; $k<$countComponente; $k++)
        {
            if($puerta->Componente[$k]->seleccionado == true)
            {
                $sql = "INSERT INTO ComponentePorPuerta (PuertaId, ComponenteId) VALUES";
                $sql .= " (".$puertaId.", ".$puerta->Componente[$k]->ComponenteId.")";
            
                try 
                {
                    $stmt = $db->prepare($sql);
                    $stmt->execute();

                    $componentePuertaId = $db->lastInsertId();

                    $countPieza = count($puerta->componentePorPuerta);

                    if($countPieza > 0)
                    {
                        $sql = "INSERT INTO PiezaPorComponentePuerta (ComponentePorPuertaId, PiezaId, Cantidad) VALUES";

                        for($i=0; $i<$countPieza; $i++)
                        {
                            if($puerta->Componente[$k]->ComponenteId == $puerta->componentePorPuerta[$i]->ComponenteId)
                            {
                                $sql .= " (".$componentePuertaId.", ".$puerta->componentePorPuerta[$i]->PiezaId.",  ".$puerta->componentePorPuerta[$i]->Cantidad."),";
                            }
                        }

                        $sql = rtrim($sql,",");

                        try 
                        {
                            $stmt = $db->prepare($sql);
                            $stmt->execute();
                        } 
                        catch(PDOException $e) 
                        {
                            echo $e;
                            $app->status(409);
                            echo '[{"Estatus": "Fallido"}]';
                            $db->rollBack();
                            $app->stop();
                        }
                    }
                    
                    $countCombinacion = count($puerta->combinacion);

                    if($countCombinacion > 0)
                    {
                        $sql = "INSERT INTO CombinacionPorMaterialComponente (ComponentePorPuertaId, CombinacionMaterialId, MaterialId, Grueso) VALUES";

                        for($i=0; $i<$countCombinacion; $i++)
                        {
                            if($puerta->Componente[$k]->ComponenteId == $puerta->combinacion[$i]->Componente->ComponenteId)
                            {
                                $sql .= " (".$componentePuertaId.", ".$puerta->combinacion[$i]->CombinacionMaterial->CombinacionMaterialId.",  ".$puerta->combinacion[$i]->Material->MaterialId.", '".$puerta->combinacion[$i]->Grueso."'),";
                            }
                        }

                        $sql = rtrim($sql,",");

                        try 
                        {
                            $stmt = $db->prepare($sql);
                            $stmt->execute();
                        } 
                        catch(PDOException $e) 
                        {
                            echo $e;
                            $app->status(409);
                            echo '[{"Estatus": "Fallido"}]';
                            $db->rollBack();
                            $app->stop();
                        }
                    }
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
        }
    }
    
    echo '[{"Estatus": "Exitoso"}]';
    $db->commit();
    $db = null; 
}

function EditarPuerta()
{
    $request = \Slim\Slim::getInstance()->request();
    $puerta = json_decode($request->getBody());
    global $app;
    
    $sql = "UPDATE Puerta SET MuestrarioId='".$puerta->Muestrario->MuestrarioId."', Nombre='".$puerta->Nombre."', Activo='".$puerta->Activo."' WHERE PuertaId=".$puerta->PuertaId."";

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
    
    $countComponentes = count($puerta->componenteBorrar);
    
    $response;
    if($countComponentes > 0)
    {
        
        for($k=0; $k<$countComponentes; $k++)
        {
            $sql = "SELECT ComponentePorPuertaId FROM ComponentePorPuerta WHERE PuertaId=".$puerta->PuertaId."  AND ComponenteId = ".$puerta->componenteBorrar[$k];

            try 
            {
                $stmt = $db->query($sql);
                $response = $stmt->fetchAll(PDO::FETCH_OBJ);
            } 
            catch(PDOException $e) 
            {
                echo($e);
                $db->rollBack();
                $app->status(409);
                $app->stop();
            }
            
            $sql = "DELETE FROM PiezaPorComponentePuerta WHERE ComponentePorPuertaId = ".$response[0]->ComponentePorPuertaId;
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
            
            $sql = "DELETE FROM CombinacionPorMaterialComponente WHERE ComponentePorPuertaId = ".$response[0]->ComponentePorPuertaId;
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
            
            $sql = "DELETE FROM ComponentePorPuerta WHERE PuertaId=".$puerta->PuertaId." AND ComponenteId=".$puerta->componenteBorrar[$k];
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
        }
    }
    
    $countPieza= count($puerta->piezaPorComponenteBorrar);
    
    if($countPieza > 0)
    {
        for($k=0; $k<$countPieza; $k++)
        {
            $sql = "DELETE FROM PiezaPorComponentePuerta WHERE ComponentePorPuertaId=".$puerta->piezaPorComponenteBorrar[$k]->ComponentePorPuertaId." AND PiezaId=".$puerta->piezaPorComponenteBorrar[$k]->PiezaId;
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
        }
    }
    
    $countComponente = count($puerta->piezaPorComponenteEditar);
    
    if($countComponente > 0)
    {
        for($k=0; $k<$countComponente; $k++)
        {
            $sql = "UPDATE PiezaPorComponentePuerta SET Cantidad='".$puerta->piezaPorComponenteEditar[$k]->Cantidad."' WHERE PiezaPorComponentePuertaId=".$puerta->piezaPorComponenteEditar[$k]->PiezaPorComponentePuertaId."";
            
            try 
            {
                $stmt = $db->prepare($sql);
                $stmt->execute();
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
    }
    
    $countComponente = count($puerta->componenteAgregar);
    
    if($countComponente > 0)
    {
        for($k=0; $k<$countComponente; $k++)
        {
            $sql = "INSERT INTO ComponentePorPuerta (PuertaId, ComponenteId) VALUES";
            $sql .= " (".$puerta->PuertaId.", ".$puerta->componenteAgregar[$k].")";


            try 
            {
                $stmt = $db->prepare($sql);
                $stmt->execute();

                $componentePuertaId = $db->lastInsertId();

                $countPieza = count($puerta->piezaPorComponenteAgregar);

                if($countPieza > 0)
                {
                    $sql = "INSERT INTO PiezaPorComponentePuerta (ComponentePorPuertaId, PiezaId, Cantidad) VALUES";

                    for($i=0; $i<$countPieza; $i++)
                    {
                        if($puerta->componenteAgregar[$k] == $puerta->piezaPorComponenteAgregar[$i]->ComponenteId)
                        {
                            $sql .= " (".$componentePuertaId.", ".$puerta->piezaPorComponenteAgregar[$i]->PiezaId.",  ".$puerta->piezaPorComponenteAgregar[$i]->Cantidad."),";
                        }
                    }

                    $sql = rtrim($sql,",");

                    try 
                    {
                        $stmt = $db->prepare($sql);
                        $stmt->execute();
                    } 
                    catch(PDOException $e) 
                    {
                        echo $e;
                        $app->status(409);
                        echo '[{"Estatus": "Fallido"}]';
                        $db->rollBack();
                        $app->stop();
                    }
                }
                
                $countCombinacion = count($puerta->combinacion);

                if($countCombinacion > 0)
                {
                    $sql = "INSERT INTO CombinacionPorMaterialComponente (ComponentePorPuertaId, CombinacionMaterialId, MaterialId, Grueso) VALUES";

                    for($i=0; $i<$countCombinacion; $i++)
                    {
                        if($puerta->componenteAgregar[$k] == $puerta->combinacion[$i]->Componente->ComponenteId)
                        {
                            $sql .= " (".$componentePuertaId.", ".$puerta->combinacion[$i]->CombinacionMaterial->CombinacionMaterialId.",  ".$puerta->combinacion[$i]->Material->MaterialId.", '".$puerta->combinacion[$i]->Grueso."'),";
                        }
                    }

                    $sql = rtrim($sql,",");

                    try 
                    {
                        $stmt = $db->prepare($sql);
                        $stmt->execute();
                    } 
                    catch(PDOException $e) 
                    {
                        echo $e;
                        $app->status(409);
                        echo '[{"Estatus": "Fallido"}]';
                        $db->rollBack();
                        $app->stop();
                    }
                }
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
    }
    
    $countComponente = count($puerta->componenteEditar);
    
    if($countComponente > 0)
    {
        for($k=0; $k<$countComponente; $k++)
        {
            $sql = "SELECT ComponentePorPuertaId FROM ComponentePorPuerta WHERE PuertaId=".$puerta->PuertaId."  AND ComponenteId = ".$puerta->componenteEditar[$k];

            try 
            {
                $stmt = $db->query($sql);
                $response = $stmt->fetchAll(PDO::FETCH_OBJ);
        
                $componentePuertaId = $response[0]->ComponentePorPuertaId;

                $countPieza = 0;
                $countPiezaComponente  = count($puerta->piezaPorComponenteAgregar);
                
                for($i=0; $i<$countPiezaComponente; $i++)
                {
                    if($puerta->componenteEditar[$k] == $puerta->piezaPorComponenteAgregar[$i]->ComponenteId)
                    {
                        $countPieza++;
                        break;
                    }
                }
                
                if($countPieza > 0)
                {
                    $sql = "INSERT INTO PiezaPorComponentePuerta (ComponentePorPuertaId, PiezaId, Cantidad) VALUES";

                    for($i=0; $i<$countPiezaComponente; $i++)
                    {
                        if($puerta->componenteEditar[$k] == $puerta->piezaPorComponenteAgregar[$i]->ComponenteId)
                        {
                            $sql .= " (".$componentePuertaId.", ".$puerta->piezaPorComponenteAgregar[$i]->PiezaId.",  ".$puerta->piezaPorComponenteAgregar[$i]->Cantidad."),";
                        }
                    }

                    $sql = rtrim($sql,",");

                    try 
                    {
                        $stmt = $db->prepare($sql);
                        $stmt->execute();
                    } 
                    catch(PDOException $e) 
                    {
                        echo $e;
                        $app->status(409);
                        echo '[{"Estatus": "Fallido"}]';
                        $db->rollBack();
                        $app->stop();
                    }
                }
                
                $countCombinacion = count($puerta->combinacion);
                
                if($countCombinacion > 0)
                {
                    for($i=0; $i<$countCombinacion; $i++)
                    {
                        if($puerta->combinacion[$i]->Componente->ComponenteId == $puerta->componenteEditar[$k])
                        {
                            $sql = "UPDATE  CombinacionPorMaterialComponente  SET  
                            MaterialId = ".$puerta->combinacion[$i]->Material->MaterialId." , Grueso = '".$puerta->combinacion[$i]->Grueso."' WHERE
                            ComponentePorPuertaId = ".$componentePuertaId." AND CombinacionMaterialId =".$puerta->combinacion[$i]->CombinacionMaterial->CombinacionMaterialId;


                            $sql = rtrim($sql,",");

                            try 
                            {
                                $stmt = $db->prepare($sql);
                                $stmt->execute();
                            } 
                            catch(PDOException $e) 
                            {
                                echo $e;
                                $app->status(409);
                                echo '[{"Estatus": "Fallido"}]';
                                $db->rollBack();
                                $app->stop();
                            }
                        }
                    }
                }
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
    }
    
    echo '[{"Estatus": "Exitoso"}]';
    $db->commit();
    $db = null;
}

function ActivarDesactivarPuerta()
{
    global $app;
    $request = \Slim\Slim::getInstance()->request();
    $datos = json_decode($request->getBody());
    try 
    {
        $db = getConnection();
        
        $sql = "UPDATE Puerta SET Activo = ".$datos[0]." WHERE PuertaId = ".$datos[1]."";
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

function GetComponentePorPuerta()
{
    global $app;
    global $session_expiration_time;

    $request = \Slim\Slim::getInstance()->request();
    $puertaId = json_decode($request->getBody());
    
    
    $sql = "SELECT * FROM ComponentePorPuertaVista WHERE PuertaId='".$puertaId[0]."'";
    
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
        //$app->status(409);
        $app->stop();
    }
}

function GetComponentesPorPuertaComponente()
{
    global $app;
    global $session_expiration_time;

    $request = \Slim\Slim::getInstance()->request();
    $puertaId = json_decode($request->getBody());
    
    
    $sql = "SELECT * FROM ComponentePorPuertaCombinacionVista";
    
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
        //$app->status(409);
        $app->stop();
    }
}

?>