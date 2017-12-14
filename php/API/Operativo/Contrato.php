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
        
        //--------------------- Datos contrato ---------------------
        $sql = "INSERT INTO Contrato(ContratoId, PersonaId, EstatusContratoId, ProyectoId, PresupuestoId, PlanPagoId, ConceptoVentaId, UsuarioId, FechaVenta, FechaEntrega, Encabezado, ProyectoNombre, NoFactura) 
                            VALUES (:ContratoId, :PersonaId, 1, :ProyectoId, :PresupuestoId, :PlanPagoId, :ConceptoVentaId, :UsuarioId, NOW() - INTERVAL 9 HOUR, :FechaEntrega, :Encabezado, :ProyectoNombre, :NoFactura)";
        
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
        
        
        //--------------------- Promocion Contrato ------------
        $sql = "INSERT INTO PromocionContrato(ContratoId, TipoVentaId, TipoPromocionId, Descuento, NumeroPago) VALUES";

        if($count > 0)
        {
            $sql .= " ('".$contrato->ContratoId."', '".$contrato->PromocionMueble->TipoVentaId."', '".$contrato->PromocionMueble->TipoPromocionId."', '".$contrato->PromocionMueble->Descuento."', '".$contrato->PromocionMueble->NumeroPagos."'),";
            $sql .= " ('".$contrato->ContratoId."', '".$contrato->PromocionCubierta->TipoVentaId."', '".$contrato->PromocionCubierta->TipoPromocionId."', '".$contrato->PromocionCubierta->Descuento."', '".$contrato->PromocionCubierta->NumeroPagos."'),";

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
        $countContado = count($contrato->PagoMeses);
        $countMeses = count($contrato->PagoContado);
        
        $sql = "INSERT INTO PagoContrato(ContratoId, MedioPagoId, TipoPagoId, Pago, Fecha) VALUES";

        if($contrato->TotalContado > 0)
        {
            for($k=0; $k<$countContado; $k++)
            {
                $sql .= " ('".$contrato->ContratoId."', '".$contrato->PagoContado[$k]->MedioPago->MedioPagoId."', 1, '".$contrato->PagoContado[$k]->Pago."', NOW() - INTERVAL 9 HOUR),";
            }
        }

        if($contrato->TotalMeses > 0)
        {
            for($k=0; $k<$countMeses; $k++)
            {
                $sql .= " ('".$contrato->ContratoId."', '".$contrato->PagoMeses[$k]->MedioPago->MedioPagoId."', 2, '".$contrato->PagoMeses[$k]->Pago."', NOW() - INTERVAL 9 HOUR),";
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

?>
