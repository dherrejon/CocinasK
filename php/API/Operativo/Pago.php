<?php
	
function GetReportePago()
{
    global $app;
    global $session_expiration_time;

    $request = \Slim\Slim::getInstance()->request();
    $filtro = json_decode($request->getBody());
    
    
    if($filtro->unidadId == -1)
    {
        $sql = "SELECT * FROM ReportePagotoVista WHERE  Fecha >= '".$filtro->fecha1."' AND Fecha <= '".$filtro->fecha2."'";
    }
    else
    {
         $sql = "SELECT * FROM ReportePagotoVista WHERE UnidadNegocioId = ".$filtro->unidadId." AND Fecha >= '".$filtro->fecha1."' AND Fecha <= '".$filtro->fecha2."'";
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
        $db = null;
        echo $e;
        echo '[ { "Estatus": "Fallo" } ]';
        //$app->status(409);
        $app->stop();
    }
}

function GetReportePagoPendiente($id)
{
    global $app;
    global $session_expiration_time;

    $request = \Slim\Slim::getInstance()->request();
    $filtro = json_decode($request->getBody());
    
    
    if($id == -1)
    {
        $sql = "SELECT * FROM ContratoDatosPagoVista";
    }
    else
    {
         $sql = "SELECT * FROM ContratoDatosPagoVista WHERE UnidadNegocioId = ".$id;
    }

    try 
    {
        $db = getConnection();

        $stmt = $db->query($sql);
        $contrato = $stmt->fetchAll(PDO::FETCH_OBJ);
    } 
    catch(PDOException $e) 
    {
        $db = null;
        echo $e;
        echo '[ { "Estatus": "Fallo" } ]';
        //$app->status(409);
        $app->stop();
    }
    
    $numContrato = count($contrato);
    
    if($numContrato > 0)
    {
        for($k=0; $k<$numContrato; $k++)
        {
            $sql = "SELECT FechaCompromiso, Pago FROM PlanPagoContrato WHERE ContratoId = ".$contrato[$k]->ContratoId." ORDER BY NumeroAbono ASC";
             try 
            {
                $stmt = $db->query($sql);
                $contrato[$k]->PlanPago = $stmt->fetchAll(PDO::FETCH_OBJ); 
            } 
            catch(PDOException $e) 
            {
                $db = null;
                echo $e;
                echo '[ { "Estatus": "Fallo" } ]';
                $app->status(409);
                $app->stop();
            }
        }
    }

    $db = null;
    echo json_encode($contrato);  
    
}

    
?>
