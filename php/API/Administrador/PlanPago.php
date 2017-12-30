<?php
	
function GetPlanPago()
{
    global $app;
    global $session_expiration_time;

    $request = \Slim\Slim::getInstance()->request();

    $sql = "SELECT PlanPagoId, Nombre, Pagos, FechaEntrega, Activo FROM PlanPago";

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

function AgregarPlanPago()
{
    $request = \Slim\Slim::getInstance()->request();
    $planPago = json_decode($request->getBody());
    global $app;
    $sql = "INSERT INTO PlanPago (Nombre, Pagos, FechaEntrega, Activo) 
            VALUES( :Nombre, :Pagos, :FechaEntrega, :Activo)";

    try 
    {
        $db = getConnection();
        $db->beginTransaction();
        $stmt = $db->prepare($sql);

        $stmt->bindParam("Nombre", $planPago->Nombre);
        $stmt->bindParam("Pagos", $planPago->Pagos);
        $stmt->bindParam("FechaEntrega", $planPago->FechaEntrega);
        $stmt->bindParam("Activo", $planPago->Activo);

        $stmt->execute();
        $planPagoId = $db->lastInsertId();
        

    } catch(PDOException $e) 
    {
        echo $e;
        echo '[{"Estatus": "Fallido"}]';
        $db->rollBack();
        $app->status(409);
        $app->stop();
    }
    
    $countAbono = count($planPago->Abono);

    $sql = "INSERT INTO PlanPagoAbono (PlanPagoId, Abono, NumeroAbono, Dias) VALUES";
    
    $sql .= " (".$planPagoId.", ".$planPago->Anticipo->Abono.", 0, 0),";

    for($k=0; $k<$countAbono; $k++)
    {
        $sql .= " (".$planPagoId.", ".$planPago->Abono[$k]->Abono.", ".$planPago->Abono[$k]->NumeroAbono.", ".$planPago->Abono[$k]->Dias."),";
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

function EditarPlanPago()
{
    global $app;
    $request = \Slim\Slim::getInstance()->request();
    $planPago = json_decode($request->getBody());
   
    $sql = "UPDATE  PlanPago SET Nombre='".$planPago->Nombre."', Pagos='".$planPago->Pagos."', FechaEntrega='".$planPago->FechaEntrega."', Activo='".$planPago->Activo."' WHERE PlanPagoId=".$planPago->PlanPagoId;
    
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
        echo $sql;
        $db->rollBack();
        $app->status(409);
        $app->stop();
    }
    
    $sql = "DELETE FROM PlanPagoAbono WHERE PlanPagoId=".$planPago->PlanPagoId;
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
    
    $countAbono = count($planPago->Abono);

    $sql = "INSERT INTO PlanPagoAbono (PlanPagoId, Abono, NumeroAbono, Dias) VALUES";
    
    $sql .= " (".$planPago->PlanPagoId.", ".$planPago->Anticipo->Abono.", 0, 0),";

    for($k=0; $k<$countAbono; $k++)
    {
        $sql .= " (".$planPago->PlanPagoId.", ".$planPago->Abono[$k]->Abono.", ".$planPago->Abono[$k]->NumeroAbono.", ".$planPago->Abono[$k]->Dias."),";
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

function ActivarDesactivarPlanPago()
{
    global $app;
    $request = \Slim\Slim::getInstance()->request();
    $datos = json_decode($request->getBody());
    try 
    {
        $db = getConnection();
        
        $sql = "UPDATE PlanPago SET Activo = ".$datos[0]." WHERE PlanPagoId = ".$datos[1]."";
        $stmt = $db->prepare($sql);
        $stmt->execute();
    
        $db = null;
        
        echo '[{"Estatus": "Exito"}]';
    }
    catch(PDOException $e) 
    {
        echo $sql;
        echo '[{"Estatus":"Fallo"}]';
        //echo ($sql);
        $app->status(409);
        $app->stop();
    }
}

/*------------- Abonos -------------*/

function GetPlanPagoAbono()
{
    global $app;
    global $session_expiration_time;

    $request = \Slim\Slim::getInstance()->request();
    $planPagoId = json_decode($request->getBody());
    
    
    $sql = "SELECT a.Abono, a.NumeroAbono, a.Dias FROM PlanPago p, PlanPagoAbono a WHERE  a.PlanPagoId = p.PlanPagoId AND p.PlanPagoId ='".$planPagoId[0]."'";
    
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
