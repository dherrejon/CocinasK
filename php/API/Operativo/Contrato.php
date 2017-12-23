<?php

function AgregarContrato()
{
    $request = \Slim\Slim::getInstance()->request();
    $contrato = json_decode($request->getBody());
    global $app;
    $sql;

    //--------------- Contrato Id ------------------------------
    $sql = "SELECT (max(ContratoId) + 1) as ContratoId FROM Contrato";

    try 
    {
        $db = getConnection();
        $db->beginTransaction();

        $stmt = $db->query($sql);
        $response = $stmt->fetchAll(PDO::FETCH_OBJ);

        if($response[0]->ContratoId == null)
        {
            $contrato->ContratoId = 1;
        }
        else
        {
            $contrato->ContratoId = $response[0]->ContratoId;
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

    //--------------- Tiempo Modificar------------------------------
    $sql = "SELECT Valor FROM Parametro WHERE ParametroId = 2";

    try 
    {   
        $stmt = $db->query($sql);
        $response = $stmt->fetchAll(PDO::FETCH_OBJ);


        $tiempoModificar = $response[0]->Valor;
    }
    catch(PDOException $e) 
    {    
        echo $e;
        echo '[{"Estatus": "Fallido"}]';
        $db->rollBack();
        $app->status(409);
        $app->stop();
    }
    
    $estatus = 1;
    
    if($contrato->TotalContrato == ($contrato->TotalContado + $contrato->TotalMeses))
    {
        $estatus = 2;
    }
    
    //--------------------- Datos contrato ---------------------
    $sql = "INSERT INTO Contrato(ContratoId, PersonaId, EstatusContratoId, ProyectoId, PresupuestoId, PlanPagoId, ConceptoVentaId, UsuarioId, FechaVenta, FechaEntrega, Encabezado, ProyectoNombre, NoFactura, NoNotaCargo, Modificar) 
                        VALUES (:ContratoId, :PersonaId, ".$estatus.", :ProyectoId, :PresupuestoId, :PlanPagoId, :ConceptoVentaId, :UsuarioId, NOW() - INTERVAL 9 HOUR, :FechaEntrega, :Encabezado, :ProyectoNombre, :NoFactura, :NoNotaCargo, NOW() + INTERVAL ".$tiempoModificar." HOUR)";

    try 
    {
        $stmt = $db->prepare($sql);

        $stmt->bindParam("ContratoId", $contrato->ContratoId);
        $stmt->bindParam("PersonaId", $contrato->PersonaId);
        $stmt->bindParam("ProyectoId", $contrato->ProyectoId);
        $stmt->bindParam("PresupuestoId", $contrato->PresupuestoId);
        $stmt->bindParam("PlanPagoId", $contrato->PlanPago->PlanPagoId);
        $stmt->bindParam("ConceptoVentaId", $contrato->ConceptoVenta->ConceptoVentaId);
        $stmt->bindParam("UsuarioId", $contrato->UsuarioId);
        $stmt->bindParam("FechaEntrega", $contrato->PlanPago->FechaFin);
        $stmt->bindParam("Encabezado", $contrato->Encabezado);
        $stmt->bindParam("ProyectoNombre", $contrato->ProyectoNombre);
        $stmt->bindParam("NoFactura", $contrato->NoFactura);
        $stmt->bindParam("NoNotaCargo", $contrato->NoNotaCargo);

        $stmt->execute();
    } 
    catch(PDOException $e) 
    {
        echo($e);
        $db->rollBack();
        echo '[ { "Estatus": "Fallo" } ]';
        $app->status(409);
        $app->stop();
    }

    //--------------------- Opcion contrato ------------
    if($contrato->Proyecto->TipoProyecto->Mueble)
    {
        $sql = "INSERT INTO OpcionContrato(ContratoId, CombinacionMaterialId, MuestrarioPuertaId, PuertaId, PrecioPuerta, MaqueoId, ColorMaqueoId, PrecioMaqueo) 
                            VALUES (:ContratoId, :CombinacionMaterialId, :MuestrarioPuertaId, :PuertaId, :PrecioPuerta, :MaqueoId, :ColorMaqueoId, :PrecioMaqueo)";

        try 
        {            
            $stmt = $db->prepare($sql);

            $stmt->bindParam("ContratoId", $contrato->ContratoId);
            $stmt->bindParam("CombinacionMaterialId", $contrato->Combinacion->CombinacionMaterialId);
            $stmt->bindParam("MuestrarioPuertaId", $contrato->Puerta->MuestrarioId);
            $stmt->bindParam("PuertaId", $contrato->Puerta->PuertaSeleccionada->PuertaId);
            $stmt->bindParam("PrecioPuerta", $contrato->Puerta->Precio);
            $stmt->bindParam("MaqueoId", $contrato->Maqueo->MaqueoId);
            $stmt->bindParam("ColorMaqueoId", $contrato->Maqueo->ColorSel->ColorId);
            $stmt->bindParam("PrecioMaqueo", $contrato->Maqueo->PrecioVenta);

            $stmt->execute();
        } 
        catch(PDOException $e) 
        {
            echo($e);
            $db->rollBack();
            echo '[ { "Estatus": "Fallo" } ]';
            $app->status(409);
            $app->stop();
        }


        //--------------------- Servicio Contrato ------------
        $count = count($contrato->Servicio);
        $sql = "INSERT INTO ServicioContrato(ContratoId, ServicioId, PrecioVenta) VALUES";

        if($count > 0)
        {
            for($k=0; $k<$count; $k++)
            {
                $sql .= " ('".$contrato->ContratoId."', '".$contrato->Servicio[$k]->ServicioId."', '".$contrato->Servicio[$k]->PrecioVenta."'),";
            }

            $sql = rtrim($sql, ",");

            try 
            {            
                $stmt = $db->prepare($sql);
                $stmt->execute();
            } 
            catch(PDOException $e) 
            {
                echo($sql);
                $db->rollBack();
                echo '[ { "Estatus": "Fallo" } ]';
                $app->status(409);
                $app->stop();
            }
        }

        //--------------------- Accesorio Contrato ------------
        $count = count($contrato->Accesorio);
        if($count > 0)
        {
            for($k=0; $k<$count; $k++)
            {
                if($contrato->Accesorio[$k]->Contrato)
                {
                    $sql = "INSERT INTO AccesorioContrato(ContratoId, TipoAccesorioId, MuestrarioId, AccesorioId, PrecioVenta) 
                                                  VALUES (:ContratoId, :TipoAccesorioId, :MuestrarioId, :AccesorioId, :PrecioVenta)";


                    $sql = rtrim($sql, ",");

                    try 
                    {            
                        $stmt = $db->prepare($sql);

                        $stmt->bindParam("ContratoId", $contrato->ContratoId);
                        $stmt->bindParam("TipoAccesorioId", $contrato->Accesorio[$k]->TipoAccesorioId);
                        $stmt->bindParam("MuestrarioId", $contrato->Accesorio[$k]->MuestrarioSel->MuestrarioId);
                        $stmt->bindParam("AccesorioId", $contrato->Accesorio[$k]->MuestrarioSel->AccesorioSel->AccesorioId);
                        $stmt->bindParam("PrecioVenta", $contrato->Accesorio[$k]->MuestrarioSel->PrecioVenta);

                        $stmt->execute();
                    } 
                    catch(PDOException $e) 
                    {
                        echo($e);
                        $db->rollBack();
                        echo '[ { "Estatus": "Fallo" } ]';
                        $app->status(409);
                        $app->stop();
                    }
                }
            }
        }
    }

    //--------------------- Total Contrato ------------
    $sql = "INSERT INTO TotalContrato(ContratoId, SubtotalMueble, DescuentoMueble, IVAMueble, TotalMueble, SubtotalCubierta, DescuentoCubierta, IVACubierta, TotalCubierta, TotalContrato) 
                              VALUES (:ContratoId, :SubtotalMueble, :DescuentoMueble, :IVAMueble, :TotalMueble, :SubtotalCubierta, :DescuentoCubierta, :IVACubierta, :TotalCubierta, :TotalContrato)";


    try 
    {            
        $stmt = $db->prepare($sql);

        $stmt->bindParam("ContratoId", $contrato->ContratoId);
        $stmt->bindParam("SubtotalMueble", $contrato->SubtotalMueble);
        $stmt->bindParam("DescuentoMueble", $contrato->DescuentoMueble);
        $stmt->bindParam("IVAMueble", $contrato->IVAMueble);
        $stmt->bindParam("TotalMueble", $contrato->TotalMueble);
        $stmt->bindParam("SubtotalCubierta", $contrato->SubtotalCubierta2);
        $stmt->bindParam("DescuentoCubierta", $contrato->DescuentoCubierta);
        $stmt->bindParam("IVACubierta", $contrato->IVACubierta);
        $stmt->bindParam("TotalCubierta", $contrato->TotalCubierta);
        $stmt->bindParam("TotalContrato", $contrato->TotalContrato);

        $stmt->execute();
    } 
    catch(PDOException $e) 
    {
        echo($e);
        $db->rollBack();
        echo '[ { "Estatus": "Fallo" } ]';
        $app->status(409);
        $app->stop();
    }

    //--------------------- Especificacion Contrato ------------
    $count = count($contrato->Especificacion);

    if($count > 0)
    {
        $sql = "INSERT INTO EspecificacionContrato(ContratoId, Ubicacion, Descripcion) VALUES";

        if($count > 0)
        {
            for($k=0; $k<$count; $k++)
            {
                $sql .= " ('".$contrato->ContratoId."', '".$contrato->Especificacion[$k]->Ubicacion."', '".$contrato->Especificacion[$k]->Descripcion."'),";
            }

            $sql = rtrim($sql, ",");

            try 
            {            
                $stmt = $db->prepare($sql);
                $stmt->execute();
            } 
            catch(PDOException $e) 
            {
                echo($e);
                $db->rollBack();
                echo '[ { "Estatus": "Fallo" } ]';
                $app->status(409);
                $app->stop();
            }
        }
    }

    //--------------------- Descripcion Contrato ------------
    $count = count($contrato->Descripcion);

    if($count > 0)
    {
        $sql = "INSERT INTO DescricpcionPorContrato(ContratoId, Descripcion) VALUES";

        if($count > 0)
        {
            for($k=0; $k<$count; $k++)
            {
                $sql .= " ('".$contrato->ContratoId."', '".$contrato->Descripcion[$k]->Descripcion."'),";
            }

            $sql = rtrim($sql, ",");

            try 
            {            
                $stmt = $db->prepare($sql);
                $stmt->execute();
            } 
            catch(PDOException $e) 
            {
                echo($e);
                $db->rollBack();
                echo '[ { "Estatus": "Fallo" } ]';
                $app->status(409);
                $app->stop();
            }
        }
    }

    //--------------------- Datos Fiscales ------------
    $sql = "INSERT INTO DatoFiscalContrato(ContratoId, Nombre, RFC, CorreoElectronico, Codigo, Estado, Municipio, Ciudad, Colonia, Domicilio) 
                              VALUES (:ContratoId, :Nombre, :RFC, :CorreoElectronico, :Codigo, :Estado, :Municipio, :Ciudad, :Colonia, :Domicilio)";


    try 
    {            
        $stmt = $db->prepare($sql);

        $stmt->bindParam("ContratoId", $contrato->ContratoId);
        $stmt->bindParam("Nombre", $contrato->DatoFiscal->Nombre);
        $stmt->bindParam("RFC", $contrato->DatoFiscal->RFC);
        $stmt->bindParam("CorreoElectronico", $contrato->DatoFiscal->CorreoElectronico);
        $stmt->bindParam("Codigo", $contrato->DatoFiscal->Codigo);
        $stmt->bindParam("Estado", $contrato->DatoFiscal->Estado);
        $stmt->bindParam("Municipio", $contrato->DatoFiscal->Municipio);
        $stmt->bindParam("Ciudad", $contrato->DatoFiscal->Ciudad);
        $stmt->bindParam("Colonia", $contrato->DatoFiscal->Colonia);
        $stmt->bindParam("Domicilio", $contrato->DatoFiscal->Domicilio);

        $stmt->execute();
    } 
    catch(PDOException $e) 
    {
        echo($e);
        $db->rollBack();
        echo '[ { "Estatus": "Fallo" } ]';
        $app->status(409);
        $app->stop();
    }

    //--------------------- Cubierta Contrato ------------
    if(($contrato->Proyecto->TipoProyecto->CubiertaAglomerado || $contrato->Proyecto->TipoProyecto->CubiertaPiedra) && $contrato->TipoCubierta->TipoCubiertaId != null)
    {
        $sql = "INSERT INTO CubiertaContrato(ContratoId, TipoCubiertaId, MaterialId, GrupoId, ColorId, AcabadoCubiertaId, Precio) 
                            VALUES (:ContratoId, :TipoCubiertaId, :MaterialId, :GrupoId, :ColorId, :AcabadoCubiertaId, :Precio)";

        try 
        {            
            $stmt = $db->prepare($sql);

            $stmt->bindParam("ContratoId", $contrato->ContratoId);
            $stmt->bindParam("TipoCubiertaId", $contrato->TipoCubierta->TipoCubiertaId);
            $stmt->bindParam("MaterialId", $contrato->TipoCubierta->GrupoUbicacion[0]->MaterialSel->MaterialId);
            $stmt->bindParam("GrupoId", $contrato->TipoCubierta->GrupoUbicacion[0]->MaterialSel->GrupoId);
            $stmt->bindParam("ColorId", $contrato->TipoCubierta->GrupoUbicacion[0]->MaterialSel->ColorId);
            $stmt->bindParam("AcabadoCubiertaId", $contrato->TipoCubierta->Acabado->AcabadoCubiertaId);
            $stmt->bindParam("Precio", $contrato->TipoCubierta->GrupoUbicacion[0]->MaterialSel->PrecioVenta);

            $stmt->execute();
        } 
        catch(PDOException $e) 
        {
            echo($e);
            $db->rollBack();
            echo '[ { "Estatus": "Fallo" } ]';
            $app->status(409);
            $app->stop();
        }


        //--------------------- Ubicación Cubierta ------------
        $count = count($contrato->TipoCubierta->Ubicacion);
        $sql = "INSERT INTO UbicacionCubiertaContrato(ContratoId, UbicacionCubiertaId) VALUES";

        for($k=0; $k<$count; $k++)
        {
            if($contrato->TipoCubierta->Ubicacion[$k]->Contrato)
            {
                $sql .= " ('".$contrato->ContratoId."', '".$contrato->TipoCubierta->Ubicacion[$k]->UbicacionCubiertaId."'),";

            }
        }

        $sql = rtrim($sql, ",");

        try 
        {            
            $stmt = $db->prepare($sql);
            $stmt->execute();
        } 
        catch(PDOException $e) 
        {
            echo($e);
            $db->rollBack();
            echo '[ { "Estatus": "Fallo" } ]';
            $app->status(409);
            $app->stop();
        }
    }


    //--------------------- Promocion Contrato ------------
    $count = 0;
    $sql = "INSERT INTO PromocionContrato(ContratoId, TipoVentaId, TipoPromocionId, Descuento, NumeroPago) VALUES";

    if($contrato->TotalMueble > 0  && $contrato->PromocionMueble->TipoPromocionId != "")
    {
        $count = 1;
        $sql .= " ('".$contrato->ContratoId."', '".$contrato->PromocionMueble->TipoVentaId."', '".$contrato->PromocionMueble->TipoPromocionId."', '".$contrato->PromocionMueble->Descuento."', '".$contrato->PromocionMueble->NumeroPagos."'),";
    }

    if($contrato->TotalCubierta > 0 && $contrato->PromocionCubierta->TipoPromocionId != "")
    {
        $count = 1;
        $sql .= " ('".$contrato->ContratoId."', '".$contrato->PromocionCubierta->TipoVentaId."', '".$contrato->PromocionCubierta->TipoPromocionId."', '".$contrato->PromocionCubierta->Descuento."', '".$contrato->PromocionCubierta->NumeroPagos."'),";
    }

    $sql = rtrim($sql, ",");
    if($count > 0)
    {
        try 
        {            
            $stmt = $db->prepare($sql);
            $stmt->execute();
        } 
        catch(PDOException $e) 
        {
            echo($e);
            $db->rollBack();
            echo '[ { "Estatus": "Fallo" } ]';
            $app->status(409);
            $app->stop();
        }
    }

    //--------------------- Plan pago Contrato ------------
    $count = count($contrato->PlanPago->Abono);

    if($count > 0)
    {
        $sql = "INSERT INTO PlanPagoContrato(ContratoId, Pago, Concepto, FechaCompromiso, NumeroAbono) VALUES";

        if($count > 0)
        {
            for($k=0; $k<$count; $k++)
            {
                $sql .= " ('".$contrato->ContratoId."', '".$contrato->PlanPago->Abono[$k]->Pago."', '".$contrato->PlanPago->Abono[$k]->Concepto."', '".$contrato->PlanPago->Abono[$k]->FechaCompromiso."', '".$contrato->PlanPago->Abono[$k]->NumeroAbono."'),";
            }

            $sql = rtrim($sql, ",");

            try 
            {            
                $stmt = $db->prepare($sql);
                $stmt->execute();
            } 
            catch(PDOException $e) 
            {
                echo($e);
                $db->rollBack();
                echo '[ { "Estatus": "Fallo" } ]';
                $app->status(409);
                $app->stop();
            }
        }
    }

    //--------------------- Pago Contrato ------------
    $countMeses = count($contrato->PagoMeses);
    $countContado = count($contrato->PagoContado);

    $sql = "INSERT INTO PagoContrato(ContratoId, MedioPagoId, TipoPagoId, Pago, Fecha, NoNotaCargo, Concepto) VALUES";

    if($contrato->TotalContado > 0)
    {
        for($k=0; $k<$countContado; $k++)
        {
            $sql .= " ('".$contrato->ContratoId."', '".$contrato->PagoContado[$k]->MedioPago->MedioPagoId."', 1, '".$contrato->PagoContado[$k]->Pago."', NOW() - INTERVAL 9 HOUR, '".$contrato->NoNotaCargo."', 'Anticipo'),";
        }
    }

    if($contrato->TotalMeses > 0)
    {
        for($k=0; $k<$countMeses; $k++)
        {
            $sql .= " ('".$contrato->ContratoId."', '".$contrato->PagoMeses[$k]->MedioPago->MedioPagoId."', 2, '".$contrato->PagoMeses[$k]->Pago."', NOW() - INTERVAL 9 HOUR, '".$contrato->NoNotaCargo."', 'Anticipo'),";
        }
    }

    $sql = rtrim($sql, ",");

    try 
    {            
        $stmt = $db->prepare($sql);
        $stmt->execute();
    } 
    catch(PDOException $e) 
    {
        echo($e);
        $db->rollBack();
        echo '[ { "Estatus": "Fallo" } ]';
        $app->status(409);
        $app->stop();
    }

    //-------------------- Actualizar Estus Presupuesto ------
    $sql = "UPDATE Proyecto SET EstatusProyectoId = 2 WHERE ProyectoId = '".$contrato->ProyectoId."'";

    try 
    {
        $stmt = $db->prepare($sql); 
        $stmt->execute(); 
    } 
    catch(PDOException $e) 
    {
        echo '[ { "Estatus": "Fallo" } ]';
        echo $sql;
        $db->rollBack();
        $app->status(409);
        $app->stop();
    }

    //--------------------- Actualizar persona a cliente ------------
    $sql = "UPDATE Persona SET TipoPersonaId = 1 WHERE PersonaId = '".$contrato->PersonaId."'";

    try 
    {
        $stmt = $db->prepare($sql); 
        $stmt->execute(); 

        $db->commit();
        $db = null;

        echo '[{"Estatus": "Exitoso"}, {"ContratoId":'.$contrato->ContratoId.'} ]';
    } 
    catch(PDOException $e) 
    {
        echo '[ { "Estatus": "Fallo" } ]';
        echo $sql;
        $db->rollBack();
        $app->status(409);
        $app->stop();
    }

}

function GetContrato($id)
{
    global $app;
    global $session_expiration_time;

    $request = \Slim\Slim::getInstance()->request();

    $sql = "SELECT *  FROM ContratoVista WHERE PersonaId = ".$id." ORDER BY ContratoId DESC";

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
        echo '[{"Estatus":"Fallo"}]';
        //echo($e);
        $app->status(409);
        $app->stop();
    }
}

function UpdateNumeroFactura()
{
    global $app;
    $request = \Slim\Slim::getInstance()->request();
    $factura = json_decode($request->getBody());

    $sql = "UPDATE Contrato SET NoFactura='".$factura->NoFactura."'  WHERE ContratoId=".$factura->ContratoId."";

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

function GuardarContratoPDF($id)
{
    global $app;
    $request = \Slim\Slim::getInstance()->request();
    $name = $_FILES['file']['tmp_name'];

    if($_FILES['file']['error'] == 0)
    {
        $contrato = addslashes(file_get_contents($_FILES['file']['tmp_name']));

        $sql = "UPDATE Contrato SET Archivo = '".$contrato."' WHERE ContratoId = ".$id."";

        try 
        {
            $db = getConnection();
            $stmt = $db->prepare($sql);
            $stmt->execute();
            $db = null;
            echo '[{"Estatus": "Exitoso"}]';
        }
        catch(PDOException $e) 
        {

            //echo $sql;
            echo '[{"Estatus": "Fallido"}]';
            $app->status(409);
            $app->stop();
        }
    }
    else
    {
         echo '[{"Estatus": "Fallido"}]';
    }
}

function DescargarContrato($id)
{
    global $app;
    global $session_expiration_time;

    $request = \Slim\Slim::getInstance()->request();

    $sql = "SELECT Archivo FROM Contrato WHERE ContratoId = ".$id;

    try 
    {
        $db = getConnection();
        $stmt = $db->query($sql);
        $response = $stmt->fetchAll(PDO::FETCH_OBJ);

        $response[0]->Archivo =  base64_encode($response[0]->Archivo);

        echo '[ { "Estatus": "Exito"}, {"Archivo":'.json_encode($response).'} ]'; 
        $db = null;
    } 
    catch(PDOException $e) 
    {
        //echo($e);
        echo '[ { "Estatus": "Fallo" } ]';
        $app->status(409);
        $app->stop();
    }
}

function CambiarEstatusContrato()
{
    global $app;
    $request = \Slim\Slim::getInstance()->request();
    $datos = json_decode($request->getBody());
    try 
    {
        $db = getConnection();

        $sql = "UPDATE Contrato SET EstatusContratoId = ".$datos->EstatusContratoId." WHERE ContratoId = ".$datos->ContratoId."";
        $stmt = $db->prepare($sql);
        $stmt->execute();

        $db = null;

        echo '[{"Estatus": "Exitoso"}]';
    }
    catch(PDOException $e) 
    {
        echo '[{"Estatus":"Fallo"}]';
        //echo ($sql);
        $app->status(409);
        $app->stop();
    }
}

function GetEstadoCuenta()
{
    global $app;
    $request = \Slim\Slim::getInstance()->request();
    $contrato = json_decode($request->getBody());

    $sql = "SELECT * FROM PagoContratoVista WHERE ContratoId = ".$contrato->ContratoId." ORDER BY Fecha DESC, Hora DESC";
    try 
    {
        $db = getConnection();
        $stmt = $db->query($sql);
        $response = $stmt->fetchAll(PDO::FETCH_OBJ);

        $contrato->Pagos =  $response;
    } 
    catch(PDOException $e) 
    {
        //echo($e);
        echo '[ { "Estatus": "Fallo" } ]';
        $app->status(409);
        $app->stop();
    }

    $sql = "SELECT * FROM PlanPagoContrato WHERE ContratoId = ".$contrato->ContratoId." ORDER BY NumeroAbono ASC";
    try 
    {
        $stmt = $db->query($sql);
        $response = $stmt->fetchAll(PDO::FETCH_OBJ);

        $contrato->PlanPagos =  $response;

        $db = null;
        echo '[ { "Estatus": "Exito"}, {"Contrato":'.json_encode($contrato).'} ]'; 
    } 
    catch(PDOException $e) 
    {
        //echo($e);
        echo '[ { "Estatus": "Fallo" } ]';
        $app->status(409);
        $app->stop();
    }
}

function AgregarPago()
{
    global $app;
    $request = \Slim\Slim::getInstance()->request();
    $pago = json_decode($request->getBody());

    $count = count($pago->Pago);

    $sql = "INSERT INTO PagoContrato(ContratoId, MedioPagoId, TipoPagoId, Pago, Fecha, NoNotaCargo, Concepto) VALUES";


    if($count > 0)
    {
        for($k=0; $k<$count; $k++)
        {
            $sql .= " ('".$pago->ContratoId."', '".$pago->Pago[$k]->MedioPago->MedioPagoId."', 2, '".$pago->Pago[$k]->Pago."', NOW() - INTERVAL 9 HOUR, '".$pago->NoNotaCargo."', 'Abono'),";
        }
    }

    $sql = rtrim($sql, ",");

    try 
    {   
        $db = getConnection();
        $db->beginTransaction();
        $stmt = $db->prepare($sql);
        $stmt->execute();
    } 
    catch(PDOException $e) 
    {
        echo($e);
        $db->rollBack();
        echo '[ { "Estatus": "Fallo" } ]';
        $app->status(409);
        $app->stop();
    }

    if($pago->Pagado)
    {
        $sql = "UPDATE Contrato SET EstatusContratoId = 2 WHERE ContratoId = ".$pago->ContratoId;

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
            echo '[{"Estatus":"Fallo"}]';
            //echo ($sql);
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

function GetNotaCargo($nota)
{
    global $app;
    global $session_expiration_time;

    $request = \Slim\Slim::getInstance()->request();

    $sql = "SELECT count(*) as Count FROM PagoContrato WHERE Cancelado = 0 AND NoNotaCargo = '".$nota."'";

    try 
    {
        $db = getConnection();
        $stmt = $db->query($sql);
        $response = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;

        echo '[ { "Estatus": "Exito"}, {"Count":'.json_encode($response[0]->Count).'} ]'; 
    } 
    catch(PDOException $e) 
    {
        echo '[{"Estatus":"Fallo"}]';
        $app->status(409);
        $app->stop();
    }
}

function GetNoFactura($factura)
{
    global $app;
    global $session_expiration_time;

    $request = \Slim\Slim::getInstance()->request();

    $sql = "SELECT count(*) as Count FROM Contrato WHERE NoFactura = '".$factura."'";

    try 
    {
        $db = getConnection();
        $stmt = $db->query($sql);
        $response = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;

        echo '[ { "Estatus": "Exito"}, {"Count":'.json_encode($response[0]->Count).'} ]'; 
    } 
    catch(PDOException $e) 
    {
        echo '[{"Estatus":"Fallo"}]';
        $app->status(409);
        $app->stop();
    }
}

function HabilitarEditarContrato()
{
    global $app;
    $request = \Slim\Slim::getInstance()->request();
    $datos = json_decode($request->getBody());

    $sql = "SELECT Valor FROM Parametro WHERE ParametroId = 2";

    try 
    {   
        $db = getConnection();
        $db->beginTransaction();

        $stmt = $db->query($sql);
        $response = $stmt->fetchAll(PDO::FETCH_OBJ);


        $tiempoModificar = $response[0]->Valor;
    }
    catch(PDOException $e) 
    {    
        echo $e;
        echo '[{"Estatus": "Fallido"}]';
        $db->rollBack();
        $app->status(409);
        $app->stop();
    }

    $sql = "UPDATE Contrato SET Modificar = NOW() + INTERVAL ".$tiempoModificar." HOUR WHERE ContratoId = ".$datos->ContratoId."";
    try 
    {
        $stmt = $db->prepare($sql);
        $stmt->execute();

        $db = null;

        echo '[{"Estatus": "Exitoso"}]';
    }
    catch(PDOException $e) 
    {
        echo '[{"Estatus":"Fallo"}]';
        $db->rollBack();
        //echo ($sql);
        $app->status(409);
        $app->stop();
    }
}

function GetDatosContrato()
{
    global $app;
    global $session_expiration_time;

    $request = \Slim\Slim::getInstance()->request();
    $contrato = json_decode($request->getBody());

    //Usuario Creador
    $sql = "SELECT NombreCompletoColaborador FROM UsuarioCompleto WHERE UsuarioId = ".$contrato->UsuarioId;

    try 
    {
        $db = getConnection();

        $stmt = $db->query($sql);
        $response = $stmt->fetchAll(PDO::FETCH_OBJ);

        $contrato->NombreColaborador = $response[0]->NombreCompletoColaborador;
    } 
    catch(PDOException $e) 
    {
        $db = null;
        echo $e;
        echo '[ { "Estatus": "Fallo" } ]';
        //$app->status(409);
        $app->stop();
    }
    
    
    //cliente
    $sql = "SELECT CONCAT(Nombre, ' ', PrimerApellido, ' ', SegundoApellido) as NombreCliente FROM Persona WHERE PersonaId = ".$contrato->PersonaId;

    try 
    {
        $stmt = $db->query($sql);
        $response = $stmt->fetchAll(PDO::FETCH_OBJ);

        $contrato->NombreCliente = $response[0]->NombreCliente;
    } 
    catch(PDOException $e) 
    {
        $db = null;
        echo $e;
        echo '[ { "Estatus": "Fallo" } ]';
        //$app->status(409);
        $app->stop();
    }
    
    //Proyecto
    $sql = "SELECT ProyectoId, Nombre, NombreTipoProyecto, TipoProyectoId FROM ProyectoPersonaVista WHERE ProyectoId = ".$contrato->ProyectoId;

    try 
    {
        $stmt = $db->query($sql);
        $response = $stmt->fetchAll(PDO::FETCH_OBJ);

        $contrato->Proyecto = $response[0];
    } 
    catch(PDOException $e) 
    {
        $db = null;
        echo $e;
        echo '[ { "Estatus": "Fallo" } ]';
        //$app->status(409);
        $app->stop();
    }
    
    //Presupuesto
    $sql = "SELECT PresupuestoId, Titulo FROM PresupuestoVista WHERE PresupuestoId = ".$contrato->PresupuestoId;

    try 
    {
        $stmt = $db->query($sql);
        $response = $stmt->fetchAll(PDO::FETCH_OBJ);

        $contrato->Presupuesto = $response[0];
    } 
    catch(PDOException $e) 
    {
        $db = null;
        echo $e;
        echo '[ { "Estatus": "Fallo" } ]';
        //$app->status(409);
        $app->stop();
    }
    
    //Plan Pagos Nombre
    $sql = "SELECT Nombre FROM PlanPago WHERE PlanPagoId = ".$contrato->PlanPagoId;

    try 
    {
        $stmt = $db->query($sql);
        $response = $stmt->fetchAll(PDO::FETCH_OBJ);

        $contrato->NombrePlanPagos = $response[0]->Nombre;
    } 
    catch(PDOException $e) 
    {
        $db = null;
        echo $e;
        echo '[ { "Estatus": "Fallo" } ]';
        //$app->status(409);
        $app->stop();
    }
    
    //Concepto de venta
    $sql = "SELECT Nombre, ConceptoVentaId FROM ConceptoVenta WHERE ConceptoVentaId = ".$contrato->ConceptoVentaId;

    try 
    {
        $stmt = $db->query($sql);
        $response = $stmt->fetchAll(PDO::FETCH_OBJ);

        $contrato->ConceptoVenta = $response[0];
    } 
    catch(PDOException $e) 
    {
        $db = null;
        echo $e;
        echo '[ { "Estatus": "Fallo" } ]';
        //$app->status(409);
        $app->stop();
    }
    
    //opcion contrato
    $sql = "SELECT * FROM OpcionContratoVista WHERE ContratoId = ".$contrato->ContratoId;

    try 
    {
        $stmt = $db->query($sql);
        $response = $stmt->fetchAll(PDO::FETCH_OBJ);

        $contrato->OpcionContrato = $response[0];
    } 
    catch(PDOException $e) 
    {
        $db = null;
        echo $e;
        echo '[ { "Estatus": "Fallo" } ]';
        //$app->status(409);
        $app->stop();
    }
    
    //Promocion
    $sql = "SELECT TipoVentaId, TipoPromocionId, Descuento, NumeroPago FROM PromocionContrato WHERE ContratoId = ".$contrato->ContratoId;

    try 
    {
        $stmt = $db->query($sql);
        $response = $stmt->fetchAll(PDO::FETCH_OBJ);

        $contrato->Promocion = $response;
    } 
    catch(PDOException $e) 
    {
        $db = null;
        echo $e;
        echo '[ { "Estatus": "Fallo" } ]';
        //$app->status(409);
        $app->stop();
    }
    
    //Cubierta
    $sql = "SELECT * FROM CubiertaContratoVista WHERE ContratoId = ".$contrato->ContratoId;

    try 
    {
        $stmt = $db->query($sql);
        $response = $stmt->fetchAll(PDO::FETCH_OBJ);

        $contrato->Cubierta = $response[0];
    } 
    catch(PDOException $e) 
    {
        $db = null;
        echo $e;
        echo '[ { "Estatus": "Fallo" } ]';
        //$app->status(409);
        $app->stop();
    }
    
    //Ubicacion Cubierta
    $sql = "SELECT u.*, c.Nombre
            FROM UbicacionCubiertaContrato u 
            INNER JOIN UbicacionCubierta c ON c.UbicacionCubiertaId = u.UbicacionCubiertaId WHERE ContratoId = ".$contrato->ContratoId;

    try 
    {
        $stmt = $db->query($sql);
        $response = $stmt->fetchAll(PDO::FETCH_OBJ);

        $contrato->UbicacionCubierta = $response;
    } 
    catch(PDOException $e) 
    {
        $db = null;
        echo $e;
        echo '[ { "Estatus": "Fallo" } ]';
        //$app->status(409);
        $app->stop();
    }
    
    //Servicios
    $sql = "SELECT sc.*, s.Nombre
            FROM ServicioContrato sc 
            INNER JOIN Servicio s ON s.ServicioId = sc.ServicioId WHERE ContratoId = ".$contrato->ContratoId;

    try 
    {
        $stmt = $db->query($sql);
        $response = $stmt->fetchAll(PDO::FETCH_OBJ);

        $contrato->Servico = $response;
    } 
    catch(PDOException $e) 
    {
        $db = null;
        echo $e;
        echo '[ { "Estatus": "Fallo" } ]';
        //$app->status(409);
        $app->stop();
    }
    
    //Totales
    $sql = "SELECT *
            FROM TotalContrato  WHERE ContratoId = ".$contrato->ContratoId;

    try 
    {
        $stmt = $db->query($sql);
        $response = $stmt->fetchAll(PDO::FETCH_OBJ);

        $contrato->Total = $response[0];
    } 
    catch(PDOException $e) 
    {
        $db = null;
        echo $e;
        echo '[ { "Estatus": "Fallo" } ]';
        //$app->status(409);
        $app->stop();
    }
    
     //DatoFiscal
    $sql = "SELECT *
            FROM DatoFiscalContrato  WHERE ContratoId = ".$contrato->ContratoId;

    try 
    {
        $stmt = $db->query($sql);
        $response = $stmt->fetchAll(PDO::FETCH_OBJ);

        $contrato->DatoFiscal = $response[0];
    } 
    catch(PDOException $e) 
    {
        $db = null;
        echo $e;
        echo '[ { "Estatus": "Fallo" } ]';
        //$app->status(409);
        $app->stop();
    }
    
    //Especificaciones
    $sql = "SELECT *
            FROM EspecificacionContrato  WHERE ContratoId = ".$contrato->ContratoId;

    try 
    {
        $stmt = $db->query($sql);
        $response = $stmt->fetchAll(PDO::FETCH_OBJ);

        $contrato->Especificacion = $response;
    } 
    catch(PDOException $e) 
    {
        $db = null;
        echo $e;
        echo '[ { "Estatus": "Fallo" } ]';
        //$app->status(409);
        $app->stop();
    }
    
    //Descripcion
    $sql = "SELECT *
            FROM DescricpcionPorContrato  WHERE ContratoId = ".$contrato->ContratoId;

    try 
    {
        $stmt = $db->query($sql);
        $response = $stmt->fetchAll(PDO::FETCH_OBJ);

        $contrato->Descripcion = $response;
    } 
    catch(PDOException $e) 
    {
        $db = null;
        echo $e;
        echo '[ { "Estatus": "Fallo" } ]';
        //$app->status(409);
        $app->stop();
    }
    
    //Accesorios
    $sql = "SELECT *
            FROM AccesorioContratoVista  WHERE ContratoId = ".$contrato->ContratoId;

    try 
    {
        $stmt = $db->query($sql);
        $response = $stmt->fetchAll(PDO::FETCH_OBJ);

        $contrato->Accesorio = $response;
    } 
    catch(PDOException $e) 
    {
        $db = null;
        echo $e;
        echo '[ { "Estatus": "Fallo" } ]';
        //$app->status(409);
        $app->stop();
    }
    
    //Pagos
    $sql = "SELECT * FROM PagoContratoVista WHERE ContratoId = ".$contrato->ContratoId." ORDER BY Fecha DESC, Hora DESC";
    try 
    {
        $stmt = $db->query($sql);
        $response = $stmt->fetchAll(PDO::FETCH_OBJ);

        $contrato->Pago =  $response;
    } 
    catch(PDOException $e) 
    {
        //echo($e);
        echo '[ { "Estatus": "Fallo" } ]';
        $app->status(409);
        $app->stop();
    }
    
    //Plan de pagos
    $sql = "SELECT * FROM PlanPagoContrato WHERE ContratoId = ".$contrato->ContratoId." ORDER BY NumeroAbono ASC";
    try 
    {
        $stmt = $db->query($sql);
        $response = $stmt->fetchAll(PDO::FETCH_OBJ);

        $contrato->PlanPagos =  $response;

        $db = null;
        echo '[ { "Estatus": "Exitoso"}, {"Contrato":'.json_encode($contrato).'} ]'; 
    } 
    catch(PDOException $e) 
    {
        //echo($e);
        echo '[ { "Estatus": "Fallo" } ]';
        $app->status(409);
        $app->stop();
    }
}

function CancelarPago()
{
    global $app;
    $request = \Slim\Slim::getInstance()->request();
    $datos = json_decode($request->getBody());

    $sql = "SELECT COUNT(*) as Numero FROM UsuarioCompleto WHERE NombreUsuario = '".$datos->Usuario."' AND Password = '".$datos->Password2."' AND Clave='OpeCaPConsultar'";

    try 
    {   
        $db = getConnection();
        $stmt = $db->query($sql);
        $response = $stmt->fetchAll(PDO::FETCH_OBJ);

        $count = $response[0]->Numero;
    }
    catch(PDOException $e) 
    {    
        echo $e;
        echo '[{"Estatus": "Fallido"}]';
        $app->status(409);
        $app->stop();
    }
    
    if($count == 1)
    {
        $sql = "INSERT INTO PagoContrato(ContratoId, MedioPagoId, TipoPagoId, Pago, Fecha, NoNotaCargo, Concepto, MotivoCancelacion, Cancelado) VALUES
                ('".$datos->ContratoId."', 0, 1, '".$datos->Descuento."', NOW() - INTERVAL 9 HOUR, '".$datos->NoNotaCargo."', 'Cancelación', '".$datos->Motivo."', '1')";


        try 
        {
            $db->beginTransaction();
            $stmt = $db->prepare($sql);
            $stmt->execute();
        }
        catch(PDOException $e) 
        {
            echo '[{"Estatus":"Fallo"}]';
            $db->rollBack();
            //echo ($sql);
            $app->status(409);
            $app->stop();
        }
        
        $count = count($datos->Pago);
         
        for($k=0; $k<$count; $k++)
        {
            $sql = "UPDATE PagoContrato SET Cancelado = 1 WHERE PagoContratoId  = '".$datos->Pago[$k]->PagoContratoId."'";
            try 
            {
                $stmt = $db->prepare($sql);
                $stmt->execute();
            }
            catch(PDOException $e) 
            {
                echo '[{"Estatus":"Fallo"}]';
                $db->rollBack();
                //echo ($sql);
                $app->status(409);
                $app->stop();
            }
        }
            
        
        $db->commit();
        $db = null;
        echo '[{"Estatus": "Exitoso"}]';
    }
    else if($count == 0)
    {
        $db = null;
        echo '[{"Estatus": "Permiso"}]';
    }
    else
    {
        $db = null;
        echo '[{"Estatus": "Fallido"}]';
    }
}

?>
