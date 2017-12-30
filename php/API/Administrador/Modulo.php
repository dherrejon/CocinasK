<?php

/*----------------Tipo Modulo----------------------*/
function GetTipoModulo()
{
    global $app;
    global $session_expiration_time;

    $request = \Slim\Slim::getInstance()->request();

    $sql = "SELECT * FROM TipoModulo";

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

function AgregarTipoModulo()
{
    $request = \Slim\Slim::getInstance()->request();
    $tipoModulo = json_decode($request->getBody());
    global $app;
    $sql = "INSERT INTO TipoModulo (Nombre, Activo) VALUES(:Nombre, :Activo)";

    try 
    {
        $db = getConnection();
        $stmt = $db->prepare($sql);

        $stmt->bindParam("Nombre", $tipoModulo->Nombre);
        $stmt->bindParam("Activo", $tipoModulo->Activo);

        $stmt->execute();

        $db = null;
        echo '[{"Estatus": "Exitoso"}]';

    } catch(PDOException $e) 
    {
        echo '[{"Estatus": "Fallido"}]';
    }
}

function EditarTipoModulo()
{
    global $app;
    $request = \Slim\Slim::getInstance()->request();
    $tipoModulo = json_decode($request->getBody());
   
    $sql = "UPDATE TipoModulo SET Nombre='".$tipoModulo->Nombre."', Activo = '".$tipoModulo->Activo."'  WHERE TipoModuloId=".$tipoModulo->TipoModuloId."";
    
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

function ActivarDesactivarTipoModulo()
{
    global $app;
    $request = \Slim\Slim::getInstance()->request();
    $datos = json_decode($request->getBody());
    try 
    {
        $db = getConnection();
        
        $sql = "UPDATE TipoModulo SET Activo = ".$datos[0]." WHERE TipoModuloId = ".$datos[1]."";
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

/*----------------------------Modulos -------------------------------*/
function GetModulo()
{
    global $app;
    global $session_expiration_time;

    $request = \Slim\Slim::getInstance()->request();

    $sql = "SELECT * FROM ModuloVista";

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

function GetModuloPresupuesto()
{
    global $app;
    global $session_expiration_time;

    $request = \Slim\Slim::getInstance()->request();

    $sql = "SELECT ModuloId, TipoModuloId, Nombre, Activo, NombreTipoModulo, Desperdicio, Margen, NumeroSeccion FROM ModuloVista WHERE Activo = 1";

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

function AgregarModulo()
{
    $request = \Slim\Slim::getInstance()->request();
    $modulo = json_decode($request->getBody());
    global $app;
    
    $sql = "INSERT INTO Modulo (TipoModuloId, Nombre, Margen, NumeroSeccion, Desperdicio, Activo) 
                            VALUES( :TipoModuloId, :Nombre, :Margen, :NumeroSeccion, :Desperdicio, :Activo)";
    $db;
    $stmt;
    $moduloId;
    
    try 
    {
        $db = getConnection();
        $db->beginTransaction();
        $stmt = $db->prepare($sql);
    
        $stmt->bindParam("TipoModuloId", $modulo->TipoModulo->TipoModuloId);
        $stmt->bindParam("Nombre", $modulo->Nombre);
        $stmt->bindParam("Margen", $modulo->Margen);
        $stmt->bindParam("NumeroSeccion", $modulo->NumeroSeccion);
        $stmt->bindParam("Desperdicio", $modulo->Desperdicio);
        $stmt->bindParam("Activo", $modulo->Activo);

        $stmt->execute();
        
        $moduloId = $db->lastInsertId();
    }
    catch(PDOException $e) 
    {
        echo $e;
        $db->rollBack();
        $app->status(409);
        $app->stop();
    }

    $numeroMedida = count($modulo->MedidasPorModulo);
        
    if($numeroMedida > 0)
    {
        $sql = "INSERT INTO MedidasPorModulo (ModuloId, Ancho, Alto, Profundo, Activo) VALUES";

        for($k=0; $k<$numeroMedida; $k++)
        {
            $sql .= " (".$moduloId.", '".$modulo->MedidasPorModulo[$k]->Ancho."',  '".$modulo->MedidasPorModulo[$k]->Alto."', '".$modulo->MedidasPorModulo[$k]->Profundo."', '".$modulo->MedidasPorModulo[$k]->Activo."'),";
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
            echo '[{"Estatus": "Fallido"}]';
            $db->rollBack();
            $app->status(409);
            $app->stop();
        }
    }
    
    $numeroConsumible = count($modulo->ConsumiblePorModulo);
        
    if($numeroConsumible > 0)
    {
        $sql = "INSERT INTO ConsumiblePorModulo (ModuloId, ConsumibleId, Cantidad) VALUES";

        for($k=0; $k<$numeroConsumible; $k++)
        {
            $sql .= " (".$moduloId.", '".$modulo->ConsumiblePorModulo[$k]->Consumible->ConsumibleId."',  '".$modulo->ConsumiblePorModulo[$k]->Cantidad."'),";
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
            echo '[{"Estatus": "Fallido"}]';
            $db->rollBack();
            $app->status(409);
            $app->stop();
        }
    }
    
    $numeroComponente = count($modulo->ComponentePorModulo);
    
    if($numeroComponente > 0)
    {
        $sql = "INSERT INTO ComponentePorModulo (ModuloId, ComponenteId, Cantidad) VALUES";

        for($k=0; $k<$numeroComponente; $k++)
        {
            $sql .= " (".$moduloId.", '".$modulo->ComponentePorModulo[$k]->Componente->ComponenteId."',  '".$modulo->ComponentePorModulo[$k]->Cantidad."'),";
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
            echo '[{"Estatus": "Fallido"}]';
            $db->rollBack();
            $app->status(409);
            $app->stop();
        }
    }
    
    $numeroSeccion = count($modulo->SeccionPorModulo);
    
    if($numeroSeccion > 0)
    {
        for($k=0; $k<$numeroSeccion; $k++)
        {
            $sql = "INSERT INTO SeccionPorModulo (ModuloId, SeccionModuloId, NumeroPiezas, PeinazoVertical) VALUES";
            $sql .= " (".$moduloId.", '".$modulo->SeccionPorModulo[$k]->SeccionModulo->SeccionModuloId."',  '".$modulo->SeccionPorModulo[$k]->NumeroPiezas."', '".$modulo->SeccionPorModulo[$k]->PeinazoVertical."'),";
            

            $sql = rtrim($sql,",");

            try 
            {
                $stmt = $db->prepare($sql);
                $stmt->execute();
                
                $seccionPorModuloId = $db->lastInsertId();
                
                $numeroLuz = count($modulo->SeccionPorModulo[$k]->LuzPorSeccion);
                
                if($numeroLuz > 0)
                {
                    $sql = "INSERT INTO LuzPorSeccion (SeccionPorModuloId, Luz, NumeroEntrepano, AltoModulo) VALUES";

                    for($i=0; $i<$numeroLuz; $i++)
                    {
                        $sql .= " (".$seccionPorModuloId.", '".$modulo->SeccionPorModulo[$k]->LuzPorSeccion[$i]->Luz."', '".$modulo->SeccionPorModulo[$k]->LuzPorSeccion[$i]->NumeroEntrepano."', '".$modulo->SeccionPorModulo[$k]->LuzPorSeccion[$i]->AltoModulo."'),";
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
                        echo '[{"Estatus": "Fallido"}]';
                        $db->rollBack();
                        $app->status(409);
                        $app->stop();
                        
                    }
                }

            } 
            catch(PDOException $e) 
            {
                echo $e;
                echo '[{"Estatus": "Fallido"}]';
                $db->rollBack();
                $app->status(409);
                $app->stop();
                
            }
        }
    }
    
    $numeroParte = count($modulo->PartePorModulo);
    
    if($numeroParte > 0)
    {
        $sql = "INSERT INTO PartePorModulo (ModuloId, TipoParteId, Ancho) VALUES";

        for($k=0; $k<$numeroParte; $k++)
        {
            $sql .= " (".$moduloId.", '".$modulo->PartePorModulo[$k]->TipoParteId."',  '".$modulo->PartePorModulo[$k]->Ancho."'),";
        }

        $sql = rtrim($sql,",");
        
        try 
        {
            $stmt = $db->prepare($sql);
            $stmt->execute();
            
            $db->commit();
            $db = null; 
            
            echo '[{"Estatus": "Exitoso"}, {"ModuloId":'.$moduloId.'}]';
        } 
        catch(PDOException $e) 
        {
            echo $e;
            echo '[{"Estatus": "Fallido"}]';
            $db->rollBack();
            $app->status(409);
            $app->stop();
        }
    }
    
    else
    {
        echo '[{"Estatus": "Exitoso"}, {"ModuloId":'.$moduloId.'}]';
        
        $db->commit();
        $db = null; 
    }
}

function EditarModulo()
{
    $request = \Slim\Slim::getInstance()->request();
    $modulo = json_decode($request->getBody());
    global $app;
    
    $sql = "UPDATE Modulo SET TipoModuloId='".$modulo->TipoModulo->TipoModuloId."', Nombre='".$modulo->Nombre."', Margen='".$modulo->Margen."',  NumeroSeccion='".$modulo->NumeroSeccion."',  Desperdicio='".$modulo->Desperdicio."',  Activo='".$modulo->Activo."' WHERE ModuloId=".$modulo->ModuloId."";

    $db;
    $stmt;
    $response;
    
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
    
    $sql = "SELECT SeccionPorModuloId FROM SeccionPorModulo WHERE ModuloId =" .$modulo->ModuloId;
    
    try 
    {

        //$db = getConnection();
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
    
    $numeroSeccion = count($response);
    if($numeroSeccion > 0)
    {
        for($k=0; $k<$numeroSeccion; $k++)
        {
            $sql = "DELETE FROM LuzPorSeccion WHERE SeccionPorModuloId=".$response[$k]->SeccionPorModuloId;
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
    
    $numeroSeccion = count($response);
    if($numeroSeccion > 0)
    {
        for($k=0; $k<$numeroSeccion; $k++)
        {
            $sql = "DELETE FROM SeccionPorModulo WHERE SeccionPorModuloId=".$response[$k]->SeccionPorModuloId;
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
    
    $numeroSeccion = count($modulo->SeccionPorModulo);
    
    if($numeroSeccion > 0)
    {
        for($k=0; $k<$numeroSeccion; $k++)
        {
            $sql = "INSERT INTO SeccionPorModulo (ModuloId, SeccionModuloId, NumeroPiezas, PeinazoVertical) VALUES";
            $sql .= " (".$modulo->ModuloId.", '".$modulo->SeccionPorModulo[$k]->SeccionModulo->SeccionModuloId."',  '".$modulo->SeccionPorModulo[$k]->NumeroPiezas."', '".$modulo->SeccionPorModulo[$k]->PeinazoVertical."'),";
            

            $sql = rtrim($sql,",");

            try 
            {
                $stmt = $db->prepare($sql);
                $stmt->execute();
                
                $seccionPorModuloId = $db->lastInsertId();
                
                $numeroLuz = count($modulo->SeccionPorModulo[$k]->LuzPorSeccion);
                
                if($numeroLuz > 0)
                {
                    $sql = "INSERT INTO LuzPorSeccion (SeccionPorModuloId, Luz, NumeroEntrepano, AltoModulo) VALUES";

                    for($i=0; $i<$numeroLuz; $i++)
                    {
                        $sql .= " (".$seccionPorModuloId.", '".$modulo->SeccionPorModulo[$k]->LuzPorSeccion[$i]->Luz."', '".$modulo->SeccionPorModulo[$k]->LuzPorSeccion[$i]->NumeroEntrepano."', '".$modulo->SeccionPorModulo[$k]->LuzPorSeccion[$i]->AltoModulo."'),";
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
                        echo '[{"Estatus": "Fallido"}]';
                        $db->rollBack();
                        $app->status(409);
                        $app->stop();
                        
                    }
                }

            } 
            catch(PDOException $e) 
            {
                echo $e;
                echo '[{"Estatus": "Fallido"}]';
                $db->rollBack();
                $app->status(409);
                $app->stop();
            }
        }
    }
    
    /*$sql = "DELETE FROM MedidasPorModulo WHERE ModuloId=".$modulo->ModuloId;
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
    }*/
    
    $numeroMedidas = count($modulo->MedidasPorModulo);
    
    if($numeroMedidas > 0)
    {
        $sql = "INSERT INTO MedidasPorModulo (ModuloId, Ancho, Alto, Profundo, Activo) VALUES";

        for($k=0; $k<$numeroMedidas; $k++)
        {
            $sql .= " (".$modulo->ModuloId.", '".$modulo->MedidasPorModulo[$k]->Ancho."', '".$modulo->MedidasPorModulo[$k]->Alto."', '".$modulo->MedidasPorModulo[$k]->Profundo."', '".$modulo->MedidasPorModulo[$k]->Activo."'),";
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
            //echo '[{"Estatus": "Fallido"}]';
            $db->rollBack();
            $app->status(409);
            $app->stop();
        }
    }
    
    
    
    $sql = "DELETE FROM ConsumiblePorModulo WHERE ModuloId=".$modulo->ModuloId;
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
    
    $numeroConsumible = count($modulo->ConsumiblePorModulo);
    
    if($numeroConsumible > 0)
    {
        $sql = "INSERT INTO ConsumiblePorModulo (ModuloId, ConsumibleId, Cantidad) VALUES";

        for($k=0; $k<$numeroConsumible; $k++)
        {
            $sql .= " (".$modulo->ModuloId.", '".$modulo->ConsumiblePorModulo[$k]->Consumible->ConsumibleId."',  '".$modulo->ConsumiblePorModulo[$k]->Cantidad."'),";
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
            //echo '[{"Estatus": "Fallido"}]';
            $db->rollBack();
            $app->status(409);
            $app->stop();
        }
    }
    
    $sql = "DELETE FROM ComponentePorModulo WHERE ModuloId=".$modulo->ModuloId;
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
    
    $numeroComponente = count($modulo->ComponentePorModulo);
    
    if($numeroComponente > 0)
    {
        $sql = "INSERT INTO ComponentePorModulo (ModuloId, ComponenteId, Cantidad) VALUES";

        for($k=0; $k<$numeroComponente; $k++)
        {
            $sql .= " (".$modulo->ModuloId.", '".$modulo->ComponentePorModulo[$k]->Componente->ComponenteId."',  '".$modulo->ComponentePorModulo[$k]->Cantidad."'),";
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
            //echo '[{"Estatus": "Fallido"}]';
            $db->rollBack();
            $app->status(409);
            $app->stop();
        }
    }
    
    $sql = "DELETE FROM PartePorModulo WHERE ModuloId=".$modulo->ModuloId;
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
    
    $numeroParte = count($modulo->PartePorModulo);
    
    if($numeroParte > 0)
    {
        $sql = "INSERT INTO PartePorModulo (ModuloId, TipoParteId, Ancho) VALUES";

        for($k=0; $k<$numeroParte; $k++)
        {
            $sql .= " (".$modulo->ModuloId.", '".$modulo->PartePorModulo[$k]->TipoParteId."', '".$modulo->PartePorModulo[$k]->Ancho."'),";
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
            //echo '[{"Estatus": "Fallido"}]';
            $db->rollBack();
            $app->status(409);
            $app->stop();
        }
    }
    else
    {
        $db->commit();
        $db = null; 
        echo '[{"Estatus": "Exitoso"}]';
    }
}

function GuardarImagenModulo($id)
{
    global $app;
    $request = \Slim\Slim::getInstance()->request();
    $name = $_FILES['file']['tmp_name'];
    
    $imagen = addslashes(file_get_contents($_FILES['file']['tmp_name']));

    $sql = "UPDATE Modulo SET Imagen = '".$imagen."' WHERE ModuloId= ".$id."";

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
        echo $e;
        //echo '[{"Estatus": "Fallido"}]';
        $app->status(409);
        $app->stop();
    }
}

function ActivarDesactivarModulo()
{
    global $app;
    $request = \Slim\Slim::getInstance()->request();
    $datos = json_decode($request->getBody());
    try 
    {
        $db = getConnection();
        
        $sql = "UPDATE Modulo SET Activo = ".$datos[0]." WHERE ModuloId = ".$datos[1]."";
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


/*----Catálogos auxiliares de módulo-----*/
function GetMedidasPorModulo()
{
    global $app;
    global $session_expiration_time;

    $request = \Slim\Slim::getInstance()->request();
    $moduloId = json_decode($request->getBody());
    
    
    $sql = "SELECT * FROM MedidasPorModulo WHERE ModuloId='".$moduloId[0]."'";
    
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

function GetMedidasModulo()
{
    global $app;
    global $session_expiration_time;

    $request = \Slim\Slim::getInstance()->request();
    $moduloId = json_decode($request->getBody());
    
    
    $sql = "SELECT Ancho, Alto, Profundo, ModuloId FROM MedidasPorModulo WHERE Activo = 1";
    
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

function ActivarDesactivarMedidasPorModulo()
{
    global $app;
    $request = \Slim\Slim::getInstance()->request();
    $datos = json_decode($request->getBody());
    try 
    {
        $db = getConnection();
        
        $sql = "UPDATE MedidasPorModulo SET Activo = ".$datos[0]." WHERE MedidasPorModuloId = ".$datos[1]."";
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

function EditarMedidaPorModulo()
{
    global $app;
    $request = \Slim\Slim::getInstance()->request();
    $nuevaMedida = json_decode($request->getBody());
   
    $sql = "UPDATE MedidasPorModulo SET Ancho='".$nuevaMedida->Ancho."', Alto='".$nuevaMedida->Alto."', Profundo='".$nuevaMedida->Profundo."'   WHERE MedidasPorModuloId=".$nuevaMedida->MedidasPorModuloId."";
    
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

function GetConsumiblePorModulo()
{
    global $app;
    global $session_expiration_time;

    $request = \Slim\Slim::getInstance()->request();
    $moduloId = json_decode($request->getBody());
    
    if($moduloId[0] != "-1")
    {
        $sql = "SELECT * FROM ConsumiblePorModuloVista WHERE ModuloId='".$moduloId[0]."'";
    }
    else
    {
        $sql = "SELECT ModuloId, ConsumibleId, Cantidad, Costo FROM ConsumiblePorModuloVista";
    }
    
    try 
    {
        $db = getConnection();
        $stmt = $db->query($sql);
        $response = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;
        
        if($moduloId[0] != "-1")
        {
            echo json_encode($response);  
        }
        else
        {
            echo '[ { "Estatus": "Exitoso" }, {"Consumible":' .json_encode($response). '} ]'; 
        }
        
        
    } 
    catch(PDOException $e) 
    {
        //echo $e;
        echo '[ { "Estatus": "Fallo" } ]';
        $app->status(409);
        $app->stop();
    }
}

function GetComponentePorModulo()
{
    global $app;
    global $session_expiration_time;

    $request = \Slim\Slim::getInstance()->request();
    $moduloId = json_decode($request->getBody());
    
    if($moduloId[0] != "-1" )
    {
        $sql = "SELECT * FROM ComponentePorModuloVista WHERE ModuloId='".$moduloId[0]."'";
    }
    else
    {
        $sql = "SELECT * FROM ComponentePorModuloVista";
    }
    
    
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

function GetPartePorModulo()
{
    global $app;
    global $session_expiration_time;

    $request = \Slim\Slim::getInstance()->request();
    $moduloId = json_decode($request->getBody());
    
    if($moduloId[0] != "-1")
    {
        $sql = "SELECT * FROM PartePorModuloVista WHERE ModuloId='".$moduloId[0]."'";
    }
    else
    {
        $sql = "SELECT * FROM PartePorModuloVista";
    }
    
    
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
        echo '[ { "Estatus": "Fallo" } ]';
        $app->status(409);
        $app->stop();
    }
}

function GetSeccionPorModulo()
{
    global $app;
    global $session_expiration_time;

    $request = \Slim\Slim::getInstance()->request();
    $moduloId = json_decode($request->getBody());
    
    
    $sql = "SELECT * FROM SeccionPorModuloVista WHERE ModuloId='".$moduloId[0]."' ";
    
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

function GetSeccionPorModuloPresupuesto()
{
    global $app;
    global $session_expiration_time;

    $request = \Slim\Slim::getInstance()->request();
    $moduloId = json_decode($request->getBody());
    
    
    $sql = "SELECT * FROM SeccionPorModuloVistaPresupuesto ";
    
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

function GetLuzPorSeccion()
{
    global $app;
    global $session_expiration_time;

    $request = \Slim\Slim::getInstance()->request();
    $seccion = json_decode($request->getBody());
    
    
    $sql = "SELECT * FROM LuzPorSeccion WHERE  SeccionPorModuloId = '".$seccion[0]."'";
    
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

function GetModuloImagen($id)
{
    global $app;
    global $session_expiration_time;

    $request = \Slim\Slim::getInstance()->request();

    $sql = "SELECT Imagen FROM Modulo WHERE ModuloId = ".$id;

    try 
    {
        $db = getConnection();
        $stmt = $db->query($sql);
        $response = $stmt->fetchAll(PDO::FETCH_OBJ);
        
        $response[0]->Imagen =  base64_encode($response[0]->Imagen);
        
        echo '[ { "Estatus": "Exito"}, {"Imagen":'.json_encode($response).'} ]'; 
        $db = null;
 
    } 
    catch(PDOException $e) 
    {
        echo($e);
        echo '[ { "Estatus": "Fallo" } ]';
        $app->status(409);
        $app->stop();
    }
}

?>