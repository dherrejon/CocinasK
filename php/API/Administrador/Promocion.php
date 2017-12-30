<?php
	
function GetPromocion()
{
    global $app;
    global $session_expiration_time;

    $request = \Slim\Slim::getInstance()->request();

    $sql = "SELECT * FROM PromocionVista";

    try 
    {

        $db = getConnection();
        $stmt = $db->query($sql);
        $response = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;
        
        //echo '[ { "Estatus": "Exito"}, {"Color":'.json_encode($response).'} ]'; 
        echo json_encode($response);  
    } 
    catch(PDOException $e) 
    {
        echo($e);
        echo '[ { "Estatus": "Fallo" } ]';
        $app->status(409);
        $app->stop();
    }
}

function AgregarPromocion()
{
    $request = \Slim\Slim::getInstance()->request();
    $promocion = json_decode($request->getBody());
    global $app;
    $sql = "INSERT INTO Promocion (TipoPromocionId, TipoVentaId, Descripcion, DescuentoMaximo, DescuentoMinimo, NumeroPagos, FechaLimite, Vigencia, Activo) 
            VALUES(:TipoPromocionId, :TipoVentaId, :Descripcion, :DescuentoMaximo, :DescuentoMinimo, :NumeroPagos, STR_TO_DATE(:FechaLimite, '%d/%m/%Y') , :Vigencia, :Activo)";

    try 
    {
        $db = getConnection();
        $db->beginTransaction();
        $stmt = $db->prepare($sql);

        $stmt->bindParam("TipoPromocionId", $promocion->TipoPromocion->TipoPromocionId);
        $stmt->bindParam("TipoVentaId", $promocion->TipoVenta->TipoVentaId);
        $stmt->bindParam("Descripcion", $promocion->Descripcion);
        $stmt->bindParam("DescuentoMaximo", $promocion->DescuentoMaximo);
        $stmt->bindParam("DescuentoMinimo", $promocion->DescuentoMinimo);
        $stmt->bindParam("NumeroPagos", $promocion->NumeroPagos);
        $stmt->bindParam("FechaLimite", $promocion->FechaLimite);
        $stmt->bindParam("Vigencia", $promocion->Vigencia);
        $stmt->bindParam("Activo", $promocion->Activo);

        $stmt->execute();
        $promocionId = $db->lastInsertId();
        

    } catch(PDOException $e) 
    {
        echo $e;
        echo '[{"Estatus": "Fallido"}]';
        $db->rollBack();
        $app->status(409);
        $app->stop();
    }
    
    $countUnidad = count($promocion->UnidadNegocio);
    
    if($countUnidad > 0)
    {
        $sql = "INSERT INTO PromocionPorUnidadNegocio (PromocionId, UnidadNegocioId) VALUES";

        for($k=0; $k<$countUnidad; $k++)
        {
            $sql .= " (".$promocionId.", ".$promocion->UnidadNegocio[$k]->UnidadNegocioId."),";
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
            echo '[{"Estatus": "Fallido"}]';
            //echo $e;
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

function EditarPromocion()
{
    global $app;
    $request = \Slim\Slim::getInstance()->request();
    $promocion = json_decode($request->getBody());
   
    $sql = "UPDATE Promocion SET TipoPromocionId='".$promocion->TipoPromocion->TipoPromocionId."', TipoVentaId='".$promocion->TipoVenta->TipoVentaId."', 
    Descripcion='".$promocion->Descripcion."', DescuentoMinimo='".$promocion->DescuentoMinimo."', DescuentoMaximo = '".$promocion->DescuentoMaximo."', 
    NumeroPagos = '".$promocion->NumeroPagos."', FechaLimite = STR_TO_DATE(:FechaLimite, '%d/%m/%Y'), Vigencia = :Vigencia,
    Activo = '".$promocion->Activo."' WHERE PromocionId=".$promocion->PromocionId;
    
    try 
    {
        $db = getConnection();
        $db->beginTransaction();
        $stmt = $db->prepare($sql);
        
        $stmt->bindParam("Vigencia", $promocion->Vigencia);
        $stmt->bindParam("FechaLimite", $promocion->FechaLimite);
        
        $stmt->execute();
    }
    catch(PDOException $e) 
    {    
        echo '[{"Estatus": "Fallido"}]';
        echo $e;
        $db->rollBack();
        $app->status(409);
        $app->stop();
    }
    
    $sql = "DELETE FROM PromocionPorUnidadNegocio WHERE PromocionId=".$promocion->PromocionId;
    try 
    {
        $stmt = $db->prepare($sql); 
        $stmt->execute(); 
        
    } 
    catch(PDOException $e) 
    {
        echo '[ { "Estatus": "Fallo" } ]';
        echo $e;
        $db->rollBack();
        $app->status(409);
        $app->stop();
    }
    
    $countUnidad = count($promocion->UnidadNegocio);
    
    if($countUnidad > 0)
    {
        $sql = "INSERT INTO PromocionPorUnidadNegocio (PromocionId, UnidadNegocioId) VALUES";

        for($k=0; $k<$countUnidad; $k++)
        {
            $sql .= " (".$promocion->PromocionId.", ".$promocion->UnidadNegocio[$k]->UnidadNegocioId."),";
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
            echo '[{"Estatus": "Fallido"}]';
            echo $e;
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

function ActivarDesactivarPromocion()
{
    global $app;
    $request = \Slim\Slim::getInstance()->request();
    $datos = json_decode($request->getBody());
    try 
    {
        $db = getConnection();
        
        $sql = "UPDATE Promocion SET Activo = ".$datos[0]." WHERE PromocionId = ".$datos[1]."";
        $stmt = $db->prepare($sql);
        $stmt->execute();
    
        $db = null;
        
        echo '[{"Estatus": "Exito"}]';
    }
    catch(PDOException $e) 
    {
        echo $e;
        echo '[{"Estatus":"Fallo"}]';
        //echo ($sql);
        $app->status(409);
        $app->stop();
    }
}

/*------------- Unidades de Negocio -------------*/

function GetUnidadNegocionPorPromocion()
{
    global $app;
    global $session_expiration_time;

    $request = \Slim\Slim::getInstance()->request();
    $promocionId = json_decode($request->getBody());
    
    
    $sql = "SELECT u.UnidadNegocioId, u.Nombre, tu.Nombre as NombreTipoUnidadNegocio FROM PromocionPorUnidadNegocio pu, UnidadNegocio u, TipoUnidadNegocio tu WHERE tu.TipoUnidadNegocioId = u.TipoUnidadNegocioId AND pu.UnidadNegocioId = u.UnidadNegocioId AND pu.PromocionId ='".$promocionId[0]."'";
    
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

function GetPromocionPorUnidadNegocio()
{
    global $app;
    global $session_expiration_time;

    $request = \Slim\Slim::getInstance()->request();
    $unidadId = json_decode($request->getBody());
    
    
    $sql = "SELECT p.* FROM PromocionVista p
            INNER JOIN (
            SELECT pu.PromocionId
            FROM PromocionPorUnidadNegocio pu
            WHERE pu.UnidadNegocioId = ".$unidadId[0]."
            ) x  ON x.PromocionId = p.PromocionId 
            WHERE p.Activo = 1";

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
