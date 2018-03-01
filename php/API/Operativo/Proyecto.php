<?php
	
function GetProyectoPersona()
{
    global $app;
    global $session_expiration_time;

    $request = \Slim\Slim::getInstance()->request();
    $persona = json_decode($request->getBody());
    
    
    $sql = "SELECT * FROM ProyectoPersonaVista WHERE PersonaId = ".$persona->PersonaId;
    
    try 
    {
        $db = getConnection();
        $stmt = $db->query($sql);
        $response = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;
        
        echo '[ { "Estatus": "Exito"}, {"Proyecto":'.json_encode($response).'} ]'; 
    } 
    catch(PDOException $e) 
    {
        echo $e;
        echo '[ { "Estatus": "Fallo" } ]';
        //$app->status(409);
        $app->stop();
    }
}

function GetProyecto($id)
{
    global $app;
    global $session_expiration_time;

    $request = \Slim\Slim::getInstance()->request();
    $persona = json_decode($request->getBody());
    
    
    $sql = "SELECT * FROM ProyectoPersonaVista WHERE ProyectoId = ".$id;
    
    try 
    {
        $db = getConnection();
        $stmt = $db->query($sql);
        $response = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;
        
        echo '[ { "Estatus": "Exito"}, {"Proyecto":'.json_encode($response).'} ]'; 
    } 
    catch(PDOException $e) 
    {
        echo $e;
        echo '[ { "Estatus": "Fallo" } ]';
        //$app->status(409);
        $app->stop();
    }
}

function AgregarProyectoPresupuesto()
{
    $request = \Slim\Slim::getInstance()->request();
    $presupuesto = json_decode($request->getBody());
    global $app;
    $sql;

    try 
    {
        $db = getConnection();
        $db->beginTransaction();
        
    } catch(PDOException $e) 
    {
        //echo($e);
        echo '[ { "Estatus": "Fallo" } ]';
        $app->status(409);
        $app->stop();
    }
    
    if($presupuesto->Persona->PersonaId == "0")
    {
        $sql = "INSERT Persona (MedioCaptacionId, TipoPersonaId, Nombre, PrimerApellido, SegundoApellido, NombreMedioCaptacion, Registro) VALUES
        ('".$presupuesto->Persona->MedioCaptacion->MedioCaptacionId."', 2, '".$presupuesto->Persona->Nombre."', '".$presupuesto->Persona->PrimerApellido."', '".$presupuesto->Persona->SegundoApellido."',
        '".$presupuesto->Persona->NombreMedioCaptacion."', NOW() - INTERVAL 9 HOUR)";
        
        try 
        {
            $stmt = $db->prepare($sql);
            $stmt->execute();
            
            $presupuesto->Persona->PersonaId = $db->lastInsertId();
        }
        catch(PDOException $e) 
        {    
            echo $sql;
            echo '[{"Estatus": "Fallido"}]';
            $db->rollBack();
            $app->status(409);
            $app->stop();
        }
    }
    else
    {
        $sql = "DELETE FROM UnidadNegocioPorPersona WHERE PersonaId=".$presupuesto->Persona->PersonaId;
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
        
        $sql = "DELETE FROM PromocionPersona WHERE PersonaId = ".$presupuesto->Persona->PersonaId;
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
            $db = null;
            $app->status(409);
            $app->stop();
        }
    }
    
    $counUnidad = count($presupuesto->Persona->UnidadNegocio);
    if($counUnidad > 0)
    {
        $sql = "INSERT UnidadNegocioPorPersona (PersonaId, UnidadNegocioId) VALUES ";

        for($k=0; $k<$counUnidad; $k++)
        {
            $sql .= " (".$presupuesto->Persona->PersonaId.", ".$presupuesto->Persona->UnidadNegocio[$k]->UnidadNegocioId."),";
        }

        $sql = rtrim($sql,",");

        try 
        {
            $stmt = $db->prepare($sql);
            $stmt->execute();
        }
        catch(PDOException $e) 
        {    
            //echo $sql;
            //echo $e;
            echo '[{"Estatus": "Fallido"}]';
            $db->rollBack();
            $app->status(409);
            $app->stop();
        }
    }   
    
    $counContacto = count($presupuesto->Persona->NuevoContacto);
    if($counContacto > 0)
    {
        $sql = "INSERT INTO ContactoPersona (TipoMedioContactoId, PersonaId, Contacto, Activo) VALUES";

        for($k=0; $k<$counContacto; $k++)
        {
            $sql .= " (".$presupuesto->Persona->NuevoContacto[$k]->TipoMedioContacto->TipoMedioContactoId.", ".$presupuesto->Persona->PersonaId.",
            '".$presupuesto->Persona->NuevoContacto[$k]->Contacto."', 1),";
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
            echo '[{"ContactoPersona": "Fallido"}]';
            $db->rollBack();
            $app->status(409);
            $app->stop();
        }
    }
    
    $counDomicilio = count($presupuesto->Persona->NuevoDomicilio);
    if($counDomicilio > 0)
    {
        for($k=0; $k<$counDomicilio; $k++)
        {
            $sql = "INSERT INTO DireccionPersona (TipoMedioContactoId, PersonaId, PaisId, Domicilio, Codigo, Estado, Municipio, Ciudad, Colonia, Activo) VALUES";


            $sql .= " (".$presupuesto->Persona->NuevoDomicilio[$k]->TipoMedioContacto->TipoMedioContactoId.", ".$presupuesto->Persona->PersonaId.",
            1, '".$presupuesto->Persona->NuevoDomicilio[$k]->Domicilio."', '".$presupuesto->Persona->NuevoDomicilio[$k]->Codigo."', '".$presupuesto->Persona->NuevoDomicilio[$k]->Estado."',
            '".$presupuesto->Persona->NuevoDomicilio[$k]->Municipio."', '".$presupuesto->Persona->NuevoDomicilio[$k]->Ciudad."', '".$presupuesto->Persona->NuevoDomicilio[$k]->Colonia."', 1),";
            
            $sql = rtrim($sql,",");

            try 
            {
                $stmt = $db->prepare($sql);
                $stmt->execute();
                
                if($presupuesto->Persona->NuevoDomicilio[$k]->Seleccionado)
                {
                    $presupuesto->Proyecto->Domicilio->DomicilioId = $db->lastInsertId();
                }
            } 
            catch(PDOException $e) 
            {
                echo $e;
                echo '[{"DireccionPersona": "Fallido"}]';
                $db->rollBack();
                $app->status(409);
                $app->stop();
            }
        }
    }
    
    $countPromocion = count($presupuesto->Promocion);
    if($countPromocion > 0)
    {
       
        for($k=0; $k<$countPromocion; $k++)
        {
            $sql = "INSERT INTO PromocionPersona (PersonaId, TipoPromocionId, TipoVentaId, FechaLimite, DescuentoMinimo, DescuentoMaximo, NumeroPagos, Descripcion) VALUES";
            
            $sql .= "('".$presupuesto->Persona->PersonaId."', '".$presupuesto->Promocion[$k]->TipoPromocion->TipoPromocionId."', '".$presupuesto->Promocion[$k]->TipoVenta->TipoVentaId."',
                :FechaLimite, :DescuentoMinimo, :DescuentoMaximo, :NumeroPagos, :Descripcion),";
        
            
            $sql = rtrim($sql,",");

            try 
            {
                $stmt = $db->prepare($sql);
                
                $stmt->bindParam("FechaLimite", $presupuesto->Promocion[$k]->FechaLimite2);
                $stmt->bindParam("DescuentoMinimo", $presupuesto->Promocion[$k]->DescuentoMinimo);
                $stmt->bindParam("DescuentoMaximo", $presupuesto->Promocion[$k]->DescuentoMaximo);
                $stmt->bindParam("NumeroPagos", $presupuesto->Promocion[$k]->NumeroPagos);
                $stmt->bindParam("Descripcion", $presupuesto->Promocion[$k]->Descripcion);
                
                $stmt->execute();

            } 
            catch(PDOException $e) 
            {
                echo $sql;
                echo $e;
                $db->rollBack();
                $app->status(409);
                $app->stop();
            }
        }
    }
    
    if($presupuesto->Proyecto->ProyectoId == "0")
    {
        $sql = "INSERT INTO Proyecto (PersonaId, TipoProyectoId, EstatusProyectoId, DireccionPersonaId, Nombre, FechaCreacion, UnidadNegocioId) VALUES
                ('".$presupuesto->Persona->PersonaId."', '".$presupuesto->Proyecto->TipoProyecto->TipoProyectoId."', 1,
                :DireccionPersonaId, '".$presupuesto->Proyecto->Nombre."', '".$presupuesto->Proyecto->FechaCreacion."', ".$presupuesto->Proyecto->UnidadNegocioId.")";
        
        try 
        {
            $stmt = $db->prepare($sql);
            $stmt->bindParam("DireccionPersonaId", $presupuesto->Proyecto->Domicilio->DomicilioId);
            
            $stmt->execute();
            
            $presupuesto->Proyecto->ProyectoId = $db->lastInsertId();
        }
        catch(PDOException $e) 
        {    
            echo $sql;
            echo '[{"Estatus": "Fallido"}]';
            $db->rollBack();
            $app->status(409);
            $app->stop();
        }
    }
    else
    {
        $sql = "UPDATE Proyecto SET DireccionPersonaId = :DireccionPersonaId, UnidadNegocioId = :UnidadNegocioId WHERE ProyectoId = ".$presupuesto->Proyecto->ProyectoId."";
        
        try 
        {
            $stmt = $db->prepare($sql);
            
            $stmt->bindParam("DireccionPersonaId", $presupuesto->Proyecto->Domicilio->DomicilioId);
            $stmt->bindParam("UnidadNegocioId", $presupuesto->Proyecto->UnidadNegocioId);
            
            $stmt->execute();

            $presupuesto->PresupuestoId = $db->lastInsertId();
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
   
    $sql = "SELECT (max(PresupuestoId) + 1) as PresupuestoId FROM Presupuesto";
         
    try 
    {
        $stmt = $db->query($sql);
        $response = $stmt->fetchAll(PDO::FETCH_OBJ);
        
        if($response[0]->PresupuestoId == null)
        {
            $presupuesto->PresupuestoId = 1;
        }
        else
        {
            $presupuesto->PresupuestoId = $response[0]->PresupuestoId;
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

    $sql = "INSERT INTO Presupuesto (PresupuestoId, ProyectoId, PersonaId, UsuarioId, FechaCreacion, DescripcionInterna, DescripcionCliente, CantidadMaqueo, Titulo) VALUE
            (".$presupuesto->PresupuestoId.",'".$presupuesto->Proyecto->ProyectoId."', '".$presupuesto->Persona->PersonaId."', '".$presupuesto->UsuarioId."', '".$presupuesto->FechaCreacion."',
            '".$presupuesto->DescripcionInterna."', '".$presupuesto->DescripcionCliente."', '".$presupuesto->CantidadMaqueo."', '".$presupuesto->Titulo."')";
        
    try 
    {
        $stmt = $db->prepare($sql);
        $stmt->execute();

        //$presupuesto->PresupuestoId = $db->lastInsertId();
    }
    catch(PDOException $e) 
    {    
        echo $e;
        echo '[{"Estatus": "Fallido"}]';
        $db->rollBack();
        $app->status(409);
        $app->stop();
    }
    
    
    $countCombinacion = count($presupuesto->CombinacionPresupuesto);
    if($countCombinacion > 0)
    {
        $sql = "INSERT INTO CombinacionPorPresupuesto (CombinacionMaterialId, PresupuestoId, PrecioVenta) VALUES";
        for($k=0; $k<$countCombinacion; $k++)
        {
            
            $sql .= "('".$presupuesto->CombinacionPresupuesto[$k]->CombinacionMaterialId."', '".$presupuesto->PresupuestoId."', '".$presupuesto->CombinacionPresupuesto[$k]->PrecioVenta."'),";
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
            $db->rollBack();
            $app->status(409);
            $app->stop();
        }
    
    }
    
    $countModulo = count($presupuesto->Modulo);
    if($countModulo > 0)
    {
        $sql = "INSERT INTO ModuloPresupuesto (PresupuestoId, ModuloId, Cantidad, Ancho, Alto, Profundo) VALUES";
        for($k=0; $k<$countModulo; $k++)
        {
            
            $sql .= "('".$presupuesto->PresupuestoId."', '".$presupuesto->Modulo[$k]->ModuloId."', '".$presupuesto->Modulo[$k]->Cantidad."',
                     '".$presupuesto->Modulo[$k]->Ancho."', '".$presupuesto->Modulo[$k]->Alto."', '".$presupuesto->Modulo[$k]->Profundo."'),";
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
            $db->rollBack();
            $app->status(409);
            $app->stop();
        }

    }
    
    $countServicio = count($presupuesto->ServicioPresupuesto);
    if($countServicio > 0)
    {
        $sql = "INSERT INTO ServicioPresupuesto (PresupuestoId, ServicioId, Cantidad, PrecioVenta) VALUES";
        for($k=0; $k<$countServicio; $k++)
        {
            
            $sql .= "('".$presupuesto->PresupuestoId."', '".$presupuesto->ServicioPresupuesto[$k]->ServicioId."', '".$presupuesto->ServicioPresupuesto[$k]->Cantidad."', '".$presupuesto->ServicioPresupuesto[$k]->PrecioVenta."'),";
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
            $db->rollBack();
            $app->status(409);
            $app->stop();
        }
        
    }
    
    $countPuerta = count($presupuesto->PuertaPresupuesto);
    if($countPuerta > 0)
    {
        for($k=0; $k<$countPuerta; $k++)
        {
            $sql = "INSERT INTO PuertaPresupuesto (PresupuestoId, MuestrarioId) VALUES";

            $sql .= "('".$presupuesto->PresupuestoId."', '".$presupuesto->PuertaPresupuesto[$k]->MuestrarioId."'),";
            

            $sql = rtrim($sql,",");

            try 
            {
                $stmt = $db->prepare($sql);
                $stmt->execute();
                
                $presupuesto->PuertaPresupuesto[$k]->PuertaPresupuestoId = $db->lastInsertId();
            } 
            catch(PDOException $e) 
            {
                echo $sql;
                echo $e;
                $db->rollBack();
                $app->status(409);
                $app->stop();
            }
            
            $countCombinacionPuerta = count($presupuesto->PuertaPresupuesto[$k]->Combinacion);
            if($countCombinacionPuerta > 0)
            {
                $sql = "INSERT INTO CombinacionPuertaPresupuesto (CombinacionMaterialId, PuertaPresupuestoId, PrecioVenta) VALUES";
                for($j=0; $j<$countCombinacionPuerta; $j++)
                {

                    $sql .= "('".$presupuesto->PuertaPresupuesto[$k]->Combinacion[$j]->CombinacionMaterialId."', '".$presupuesto->PuertaPresupuesto[$k]->PuertaPresupuestoId."', '".$presupuesto->PuertaPresupuesto[$k]->Combinacion[$j]->PrecioVenta."'),";
                }

                $sql = rtrim($sql,",");

                try 
                {
                    $stmt = $db->prepare($sql);
                    $stmt->execute();
                } 
                catch(PDOException $e) 
                {
                    echo $sql;
                    echo $e;
                    $db->rollBack();
                    $app->status(409);
                    $app->stop();
                }
                
            }
        }
        
        
    }
    
    $countMaqueo = count($presupuesto->MaqueoPresupuesto);
    if($countMaqueo > 0)
    {
        $sql = "INSERT INTO MaqueoPresupuesto (PresupuestoId, MaqueoId, PrecioVenta) VALUES";
        for($k=0; $k<$countMaqueo; $k++)
        {
            $sql .= "('".$presupuesto->PresupuestoId."', '".$presupuesto->MaqueoPresupuesto[$k]->MaqueoId."', '".$presupuesto->MaqueoPresupuesto[$k]->PrecioVenta."'),";
        }
            
        $sql = rtrim($sql,",");

        try 
        {
            $stmt = $db->prepare($sql);
            $stmt->execute();
        } 
        catch(PDOException $e) 
        {
            echo $sql;
            echo $e;
            $db->rollBack();
            $app->status(409);
            $app->stop();
        }
    }
    
    $countAccesorio = count($presupuesto->AccesorioPresupuesto);
    if($countAccesorio > 0)
    {
        
        for($k=0; $k<$countAccesorio; $k++)
        {
            $sql = "INSERT INTO AccesorioPresupuesto (PresupuestoId, TipoAccesorioId, Cantidad) VALUES";
            $sql .= "('".$presupuesto->PresupuestoId."', '".$presupuesto->AccesorioPresupuesto[$k]->TipoAccesorioId."', '".$presupuesto->AccesorioPresupuesto[$k]->Cantidad."'),";
            
            $sql = rtrim($sql,",");

            try 
            {
                $stmt = $db->prepare($sql);
                $stmt->execute();
                
                $presupuesto->AccesorioPresupuesto[$k]->AccesorioPresupuestoId = $db->lastInsertId();
            } 
            catch(PDOException $e) 
            {
                echo $sql;
                echo $e;
                $db->rollBack();
                $app->status(409);
                $app->stop();
            }
            
            $countMuestrarioAccesorio = count($presupuesto->AccesorioPresupuesto[$k]->Muestrario);
            if($countMuestrarioAccesorio > 0)
            {
                
                for($j=0; $j<$countMuestrarioAccesorio; $j++)
                {
                    $sql = "INSERT INTO MuestrarioAccesorioPresupuesto (AccesorioPresupuestoId, MuestrarioId, PrecioVenta) VALUES";

                    $sql .= "('".$presupuesto->AccesorioPresupuesto[$k]->AccesorioPresupuestoId."', '".$presupuesto->AccesorioPresupuesto[$k]->Muestrario[$j]->MuestrarioId."', :PrecioVenta),";
                

                    $sql = rtrim($sql,",");

                    try 
                    {
                        $stmt = $db->prepare($sql);
                        $stmt->bindParam("PrecioVenta", $presupuesto->AccesorioPresupuesto[$k]->Muestrario[$j]->PrecioVenta);

                        $stmt->execute();

                        $presupuesto->AccesorioPresupuesto[$k]->Muestrario[$j]->MuestrarioAccesorioPresupuestoId = $db->lastInsertId();
                    } 
                    catch(PDOException $e) 
                    {
                        echo $sql;
                        echo $e;
                        $db->rollBack();
                        $app->status(409);
                        $app->stop();
                    }
                    
                    
                    $countCombinacionMuestrarioAccesorio = count($presupuesto->AccesorioPresupuesto[$k]->Muestrario[$j]->Combinacion);
                    if($countCombinacionMuestrarioAccesorio > 0)
                    {
                         
                        $sql = "INSERT INTO CombinacionMuestrarioAccesorioPresupuesto (CombinacionMaterialId, MuestrarioAccesorioPresupuestoId, PrecioVenta) VALUES";
                        for($l=0; $l<$countCombinacionMuestrarioAccesorio; $l++)
                        {
                            $sql .= "('".$presupuesto->AccesorioPresupuesto[$k]->Muestrario[$j]->Combinacion[$l]->CombinacionMaterialId."', '".$presupuesto->AccesorioPresupuesto[$k]->Muestrario[$j]->MuestrarioAccesorioPresupuestoId."', '".$presupuesto->AccesorioPresupuesto[$k]->Muestrario[$j]->Combinacion[$l]->PrecioVenta."'),";
                        }


                        $sql = rtrim($sql,",");

                        try 
                        {
                            $stmt = $db->prepare($sql);
                            $stmt->bindParam("PrecioVenta", $presupuesto->AccesorioPresupuesto[$k]->Muestrario[$j]->PrecioVenta);

                            $stmt->execute();

                            $presupuesto->AccesorioPresupuesto[$k]->Muestrario[$j]->MuestrarioAccesorioPresupuestoId = $db->lastInsertId();
                        } 
                        catch(PDOException $e) 
                        {
                            echo $sql;
                            echo $e;
                            $db->rollBack();
                            $app->status(409);
                            $app->stop();
                        }
                    }
                }
            }
            
        }
    }
    
    $countCubierta = count($presupuesto->CubiertaPresupuesto);
    if($countCubierta > 0)
    {
        for($k=0; $k<$countCubierta; $k++)
        {
            $sql = "INSERT INTO CubiertaPorPresupuesto (TipoCubiertaId, PresupuestoId) VALUES";
            $sql .= "('".$presupuesto->CubiertaPresupuesto[$k]->TipoCubiertaId."', '".$presupuesto->PresupuestoId."'),";
            
            $sql = rtrim($sql,",");

            try 
            {
                $stmt = $db->prepare($sql);
                $stmt->execute();
                
                $presupuesto->CubiertaPresupuesto[$k]->CubiertaPorPresupuestoId = $db->lastInsertId();
            } 
            catch(PDOException $e) 
            {
                echo $sql;
                echo $e;
                $db->rollBack();
                $app->status(409);
                $app->stop();
            }
            
            
            $countUbicacion = count($presupuesto->CubiertaPresupuesto[$k]->Ubicacion);
            if($countUbicacion > 0)
            {
               
                for($j=0; $j<$countUbicacion; $j++)
                {
                    $sql = "INSERT INTO UbicacionCubiertaPresupuesto (CubiertaPorPresupuestoId, UbicacionCubiertaId, CantidadAglomerado) VALUES";
                    $sql .= "('".$presupuesto->CubiertaPresupuesto[$k]->CubiertaPorPresupuestoId."', '".$presupuesto->CubiertaPresupuesto[$k]->Ubicacion[$j]->UbicacionCubiertaId."',
                    :CantidadAglomerado),";
                

                    $sql = rtrim($sql,",");

                    try 
                    {                
                        $stmt = $db->prepare($sql);

                        $stmt->bindParam("CantidadAglomerado", $presupuesto->CubiertaPresupuesto[$k]->Ubicacion[$j]->CantidadAglomerado);

                        $stmt->execute();
                        
                        $presupuesto->CubiertaPresupuesto[$k]->Ubicacion[$j]->UbicacionCubiertaPresupuestoId = $db->lastInsertId();
                    } 
                    catch(PDOException $e) 
                    {
                        echo $e;
                        $db->rollBack();
                        $app->status(409);
                        $app->stop();
                    }
                
                
                    $countUbicacionElemento = count($presupuesto->CubiertaPresupuesto[$k]->Ubicacion[$j]->Elemento);
                    if($countUbicacionElemento > 0)
                    {
                        $sql = "INSERT INTO SeccionUbicacionCubiertaPresupuesto (UbicacionCubiertaPresupuestoId, Lado1, Lado2) VALUES";
                        for($m=0; $m<$countUbicacionElemento; $m++)
                        {
                            $sql .= "('".$presupuesto->CubiertaPresupuesto[$k]->Ubicacion[$j]->UbicacionCubiertaPresupuestoId."', '".$presupuesto->CubiertaPresupuesto[$k]->Ubicacion[$j]->Elemento[$m]->Lado1."',
                            '".$presupuesto->CubiertaPresupuesto[$k]->Ubicacion[$j]->Elemento[$m]->Lado2."'),";
                        }


                        $sql = rtrim($sql,",");

                        try 
                        {                
                            $stmt = $db->prepare($sql);

                            $stmt->bindParam("Cantidad", $presupuesto->CubiertaPresupuesto[$k]->Ubicacion[$j]->CantidadAglomerado);

                            $stmt->execute();
                        } 
                        catch(PDOException $e) 
                        {
                            echo $e;
                            $db->rollBack();
                            $app->status(409);
                            $app->stop();
                        }
                    }
                }
            }
            
            $countGrupoCubierta = count($presupuesto->CubiertaPresupuesto[$k]->Grupo);
            if($countGrupoCubierta > 0)
            {
                
                for($j=0; $j<$countGrupoCubierta; $j++)
                {
                    $sql = "INSERT INTO MaterialTipoCubiertaPresupuesto (CubiertaPorPresupuestoId, MaterialId, GrupoId) VALUES";
                    
                    $sql .= "('".$presupuesto->CubiertaPresupuesto[$k]->CubiertaPorPresupuestoId."', '".$presupuesto->CubiertaPresupuesto[$k]->Grupo[$j]->MaterialId."', 
                    '".$presupuesto->CubiertaPresupuesto[$k]->Grupo[$j]->GrupoId."'),";
                

                    $sql = rtrim($sql,",");

                    try 
                    {
                        $stmt = $db->prepare($sql);
                        $stmt->execute();
                        
                        $presupuesto->CubiertaPresupuesto[$k]->Grupo[$j]->MaterialTipoCubiertaPresupuestoId = $db->lastInsertId();
                    } 
                    catch(PDOException $e) 
                    {
                        echo $e;
                        $db->rollBack();
                        $app->status(409);
                        $app->stop();
                    }
                    
                    $countUbicacionGrupoCubierta = count($presupuesto->CubiertaPresupuesto[$k]->Grupo[$j]->Ubicacion);
                    if($countUbicacionGrupoCubierta > 0)
                    {
                        
                        $sql = "INSERT INTO PrecioCubiertaPresupuesto (MaterialTipoCubiertaPresupuestoId, UbicacionCubiertaId, PrecioVenta) VALUES";
                        for($m=0; $m<$countUbicacionGrupoCubierta; $m++)
                        {
                            $sql .= "('".$presupuesto->CubiertaPresupuesto[$k]->Grupo[$j]->MaterialTipoCubiertaPresupuestoId."', '".$presupuesto->CubiertaPresupuesto[$k]->Grupo[$j]->Ubicacion[$m]->UbicacionCubiertaId."',
                            '".$presupuesto->CubiertaPresupuesto[$k]->Grupo[$j]->Ubicacion[$m]->PrecioVenta."'),";
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
                            $db->rollBack();
                            $app->status(409);
                            $app->stop();
                        }
                        

                    }
                }
                
            }
        }
    }
    
    $db->commit();
    $db = null;

    echo '[{"Estatus": "Exitoso"}, {"PresupuestoId":"'.$presupuesto->PresupuestoId.'"}, {"PersonaId":"'.$presupuesto->Persona->PersonaId.'"}, {"ProyectoId":"'.$presupuesto->Proyecto->ProyectoId.'"}]';
    
}

function CambiarEstatusProyecto()
{
    global $app;
    $request = \Slim\Slim::getInstance()->request();
    $datos = json_decode($request->getBody());
    try 
    {
        $db = getConnection();
        
        $sql = "UPDATE Proyecto SET EstatusProyectoId = ".$datos->EstatusProyectoId." WHERE ProyectoId = ".$datos->ProyectoId."";
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

function EditarProyecto()
{
    global $app;
    $request = \Slim\Slim::getInstance()->request();
    $proyecto = json_decode($request->getBody());
    
    $sql = "UPDATE Proyecto SET Nombre = '".$proyecto->Nombre."', DireccionPersonaId = :domicilio WHERE ProyectoId = ".$proyecto->ProyectoId."";
    
    try 
    {
        $db = getConnection();
        $stmt = $db->prepare($sql);
    
        $stmt->bindParam("domicilio", $proyecto->Domicilio->DireccionPersonaId);
        
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

function GetPresupuestoPorProyecto($id, $idpresupuesto)
{
    global $app;
    global $session_expiration_time;

    $request = \Slim\Slim::getInstance()->request();
    $sql = "SELECT * FROM PresupuestoVista WHERE ProyectoId = ".$id;
    
    if($idpresupuesto > 0)
    {
        $sql .= " AND PresupuestoId = ".$idpresupuesto;
    }
    
    try 
    {
        $db = getConnection();
        $stmt = $db->query($sql);
        $response = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;
        
        echo '[{"Estatus": "Exitoso"}, {"Presupuesto":'.json_encode($response).'} ]';
    }
    catch(PDOException $e) 
    {
        echo '[{"Estatus":"Fallo"}]';
        //echo ($sql);
        $app->status(409);
        $app->stop();
    }
}

function GetDatosPresupuesto()
{
    global $app;
    global $session_expiration_time;

    $request = \Slim\Slim::getInstance()->request();
    $presupuesto = json_decode($request->getBody());
    
    //Usuario Creador
    $sql = "SELECT NombreCompletoColaborador FROM UsuarioCompleto WHERE UsuarioId = ".$presupuesto->UsuarioId;
    
    try 
    {
        $db = getConnection();
        
        $stmt = $db->query($sql);
        $response = $stmt->fetchAll(PDO::FETCH_OBJ);
        
        $presupuesto->NombreColaborador = $response[0]->NombreCompletoColaborador;
    } 
    catch(PDOException $e) 
    {
        $db = null;
        echo $e;
        echo '[ { "Estatus": "Fallo" } ]';
        //$app->status(409);
        $app->stop();
    }
    
    //Combinaciones
    $sql = "SELECT cp.CombinacionMaterialId, cp.PrecioVenta, cm.Nombre, cm.Frente, cm.Interior
            FROM CombinacionPorPresupuesto cp
            INNER JOIN CombinacionMaterial cm ON cm.CombinacionMaterialId = cp.CombinacionMaterialId
            WHERE cp.PresupuestoId = ".$presupuesto->PresupuestoId. " ORDER BY cp.PrecioVenta";
    
    try 
    {   
        $stmt = $db->query($sql);
        $response = $stmt->fetchAll(PDO::FETCH_OBJ);
        
        $presupuesto->CombinacionMaterial = $response;
    } 
    catch(PDOException $e) 
    {
        $db = null;
        echo $e;
        echo '[ { "Estatus": "Fallo" } ]';
        //$app->status(409);
        $app->stop();
    }
    
    //Cubiertas
    $sql = "SELECT cp.TipoCubiertaId, tc.Nombre, cp.CubiertaPorPresupuestoId
            FROM CubiertaPorPresupuesto cp
            INNER JOIN TipoCubierta tc ON tc.TipoCubiertaId = cp.TipoCubiertaId
            WHERE cp.PresupuestoId = ".$presupuesto->PresupuestoId;
    
    try 
    {   
        $stmt = $db->query($sql);
        $response = $stmt->fetchAll(PDO::FETCH_OBJ);
        
        $presupuesto->TipoCubierta = $response;
        
        $countCubierta = count($response);
        
        for($k=0; $k<$countCubierta; $k++)
        {
            //Mateiales de la cubierta
            $sql = "SELECT mp.MaterialId, mp.GrupoId, m.Nombre as NombreMaterial, g.Nombre as NombreGrupo, mp.MaterialTipoCubiertaPresupuestoId
                    FROM MaterialTipoCubiertaPresupuesto mp
                    INNER JOIN Material m ON m.MaterialId = mp.MaterialId
                    INNER JOIN Grupo g ON g.GrupoId = mp.GrupoId
                    WHERE mp.CubiertaPorPresupuestoId = ".$presupuesto->TipoCubierta[$k]->CubiertaPorPresupuestoId;

            try 
            {   
                $stmt = $db->query($sql);
                $response = $stmt->fetchAll(PDO::FETCH_OBJ);

                $presupuesto->TipoCubierta[$k]->Material = $response;
                
                $countMaterial = count($response);
                for($i=0; $i<$countMaterial; $i++)
                {
                    //Precio Venta Material
                    $sql = "SELECT pc.UbicacionCubiertaId, pc.PrecioVenta
                            FROM PrecioCubiertaPresupuesto pc
                            WHERE pc.MaterialTipoCubiertaPresupuestoId = ".$presupuesto->TipoCubierta[$k]->Material[$i]->MaterialTipoCubiertaPresupuestoId;

                    try 
                    {   
                        $stmt = $db->query($sql);
                        $response = $stmt->fetchAll(PDO::FETCH_OBJ);

                        $presupuesto->TipoCubierta[$k]->Material[$i]->Ubicacion = $response;
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
            } 
            catch(PDOException $e) 
            {
                $db = null;
                echo $e;
                echo '[ { "Estatus": "Fallo" } ]';
                //$app->status(409);
                $app->stop();
            }
            
            //Cubierta de aglomerado
            if($presupuesto->TipoCubierta[$k]->TipoCubiertaId == "1")
            {
                $sql = "SELECT cp.UbicacionCubiertaId, cp.CantidadAglomerado as Cantidad, uc.Nombre
                        FROM UbicacionCubiertaPresupuesto cp
                        INNER JOIN UbicacionCubierta uc ON uc.UbicacionCubiertaId = cp.UbicacionCubiertaId
                        WHERE cp.CubiertaPorPresupuestoId = ".$presupuesto->TipoCubierta[$k]->CubiertaPorPresupuestoId;

                try 
                {   
                    $stmt = $db->query($sql);
                    $response = $stmt->fetchAll(PDO::FETCH_OBJ);

                    $presupuesto->TipoCubierta[$k]->Ubicacion = $response;
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
            else if($presupuesto->TipoCubierta[$k]->TipoCubiertaId == "2")
            {
                //Cubierta de piedra
                $sql = "SELECT cp.UbicacionCubiertaId, uc.Nombre, cp.UbicacionCubiertaPresupuestoId
                        FROM UbicacionCubiertaPresupuesto cp
                        INNER JOIN UbicacionCubierta uc ON uc.UbicacionCubiertaId = cp.UbicacionCubiertaId
                        WHERE cp.CubiertaPorPresupuestoId = ".$presupuesto->TipoCubierta[$k]->CubiertaPorPresupuestoId;

                try 
                {   
                    $stmt = $db->query($sql);
                    $response = $stmt->fetchAll(PDO::FETCH_OBJ);

                    $presupuesto->TipoCubierta[$k]->Ubicacion = $response;
                    
                    $countUbicacion = count($response);
                    
                    //Secciones
                    for($i=0; $i<$countUbicacion; $i++)
                    {
                         
                        $sql = "SELECT sc.Lado1, sc.Lado2
                                FROM SeccionUbicacionCubiertaPresupuesto sc
                                WHERE sc.UbicacionCubiertaPresupuestoId = ".$presupuesto->TipoCubierta[$k]->Ubicacion[$i]->UbicacionCubiertaPresupuestoId;

                        try 
                        {   
                            $stmt = $db->query($sql);
                            $response = $stmt->fetchAll(PDO::FETCH_OBJ);

                            $presupuesto->TipoCubierta[$k]->Ubicacion[$i]->Seccion = $response;
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
        }
        
    } 
    catch(PDOException $e) 
    {
        $db = null;
        echo $e;
        echo '[ { "Estatus": "Fallo" } ]';
        //$app->status(409);
        $app->stop();
    }
    
    //Modulos
    $sql = "SELECT mp.ModuloId, mp.Cantidad, mp.Ancho, mp.Alto, mp.Profundo, m.Nombre, m.TipoModuloId, m.NombreTipoModulo, m.Desperdicio, m.Margen
            FROM ModuloPresupuesto mp
            INNER JOIN ModuloVista m ON m.ModuloId = mp.ModuloId
            WHERE mp.PresupuestoId = ".$presupuesto->PresupuestoId;
    
    try 
    {   
        $stmt = $db->query($sql);
        $response = $stmt->fetchAll(PDO::FETCH_OBJ);
        
        $presupuesto->Modulo = $response;
    } 
    catch(PDOException $e) 
    {
        $db = null;
        echo $e;
        echo '[ { "Estatus": "Fallo" } ]';
        //$app->status(409);
        $app->stop();
    }
    
    //Servicio
    $sql = "SELECT sp.ServicioId, sp.Cantidad, sp.PrecioVenta, s.Nombre
            FROM ServicioPresupuesto sp
            INNER JOIN Servicio s ON s.ServicioId = sp.ServicioId
            WHERE sp.PresupuestoId = ".$presupuesto->PresupuestoId. " ORDER BY sp.PrecioVenta";
    
    try 
    {   
        $stmt = $db->query($sql);
        $response = $stmt->fetchAll(PDO::FETCH_OBJ);
        
        $presupuesto->Servicio = $response;
    } 
    catch(PDOException $e) 
    {
        $db = null;
        echo $e;
        echo '[ { "Estatus": "Fallo" } ]';
        //$app->status(409);
        $app->stop();
    }
    
    //Maqueo
    $sql = "SELECT mp.MaqueoId, mp.PrecioVenta, m.Nombre
            FROM MaqueoPresupuesto mp
            INNER JOIN Maqueo m ON m.MaqueoId = mp.MaqueoId
            WHERE mp.PresupuestoId = ".$presupuesto->PresupuestoId. " ORDER BY mp.PrecioVenta";
    
    try 
    {   
        $stmt = $db->query($sql);
        $response = $stmt->fetchAll(PDO::FETCH_OBJ);
        
        $presupuesto->Maqueo = $response;
    } 
    catch(PDOException $e) 
    {
        $db = null;
        echo $e;
        echo '[ { "Estatus": "Fallo" } ]';
        //$app->status(409);
        $app->stop();
    }
    
    //Promociones
    /*$sql = "SELECT *
            FROM PromocionPresupuestoVista 
            WHERE PresupuestoId = ".$presupuesto->PresupuestoId. " ORDER BY DescuentoMinimo";
    
    try 
    {   
        $stmt = $db->query($sql);
        $response = $stmt->fetchAll(PDO::FETCH_OBJ);
        
        $presupuesto->PromocionMueble = array();
        $presupuesto->PromocionCubierta = array();
        
        $countPromo = count($response);
        
        for($k=0; $k<$countPromo; $k++)
        {
            if($response[$k]->TipoVentaId == "1")
            {
                array_push($presupuesto->PromocionMueble, $response[$k]);
            }
            else if($response[$k]->TipoVentaId == "2")
            {
                array_push($presupuesto->PromocionCubierta, $response[$k]);
            }
        }
    } 
    catch(PDOException $e) 
    {
        $db = null;
        echo $e;
        echo '[ { "Estatus": "Fallo" } ]';
        //$app->status(409);
        $app->stop();
    }*/
    
    //Puertas
    $sql = "SELECT pp.MuestrarioId, pp.PuertaPresupuestoId, m.Nombre
            FROM PuertaPresupuesto pp
            INNER JOIN Muestrario m ON m.MuestrarioId = pp.MuestrarioId
            WHERE pp.PresupuestoId = ".$presupuesto->PresupuestoId;
    
    try 
    {   
        $stmt = $db->query($sql);
        $response = $stmt->fetchAll(PDO::FETCH_OBJ);
        
        $presupuesto->Puerta = $response;
        
        $countPuerta = count($presupuesto->Puerta);
        if($countPuerta > 0)
        {
            for($k=0; $k<$countPuerta; $k++)
            {
                $sql = "SELECT cp.CombinacionMaterialId, cp.PrecioVenta, m.Nombre
                        FROM CombinacionPuertaPresupuesto cp
                        INNER JOIN CombinacionMaterial m ON m.CombinacionMaterialId = cp.CombinacionMaterialId
                        WHERE cp.PuertaPresupuestoId = ".$presupuesto->Puerta[$k]->PuertaPresupuestoId. " ORDER BY cp.PrecioVenta";
                
                try 
                {   
                    $stmt = $db->query($sql);
                    $response = $stmt->fetchAll(PDO::FETCH_OBJ);

                    $presupuesto->Puerta[$k]->Combinacion = $response;
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
        }
    
    } 
    catch(PDOException $e) 
    {
        $db = null;
        echo $e;
        echo '[ { "Estatus": "Fallo" } ]';
        //$app->status(409);
        $app->stop();
    }
    
    //accesorios
    $sql = "SELECT ap.AccesorioPresupuestoId, ap.Cantidad, ta.Nombre, ta.ClaseAccesorioId, ap.TipoAccesorioId, ta.Obligatorio, ta.Contable
            FROM AccesorioPresupuesto ap
            INNER JOIN TipoAccesorio ta ON ta.TipoAccesorioId = ap.TipoAccesorioId
            WHERE ap.PresupuestoId = ".$presupuesto->PresupuestoId;
    
    try 
    {   
        $stmt = $db->query($sql);
        $response = $stmt->fetchAll(PDO::FETCH_OBJ);
        
        $presupuesto->Accesorio = $response;
        
        $countAccesorio = count($presupuesto->Accesorio);
        if($countAccesorio > 0)
        {
            for($k=0; $k<$countAccesorio; $k++)
            {
                $sql = "SELECT ma.MuestrarioAccesorioPresupuestoId, ma.MuestrarioId, ma.PrecioVenta, m.Nombre 
                        FROM MuestrarioAccesorioPresupuesto ma
                        INNER JOIN Muestrario m ON m.MuestrarioId = ma.MuestrarioId
                        WHERE AccesorioPresupuestoId = ".$presupuesto->Accesorio[$k]->AccesorioPresupuestoId. " ORDER BY ma.PrecioVenta";
                
                try 
                {   
                    $stmt = $db->query($sql);
                    $response = $stmt->fetchAll(PDO::FETCH_OBJ);

                    $presupuesto->Accesorio[$k]->Muestrario = $response;
                    
                    if($presupuesto->Accesorio[$k]->ClaseAccesorioId == "2")
                    {
                        $countMuestrario = count($presupuesto->Accesorio[$k]->Muestrario);
                        
                        if($countMuestrario > 0)
                        {
                        
                            for($i=0; $i<$countMuestrario; $i++)
                            {
                                $sql = "SELECT cm.CombinacionMaterialId, cm.PrecioVenta, m.Nombre
                                        FROM CombinacionMuestrarioAccesorioPresupuesto cm
                                        INNER JOIN CombinacionMaterial m ON m.CombinacionMaterialId = cm.CombinacionMaterialId
                                        WHERE MuestrarioAccesorioPresupuestoId = ".$presupuesto->Accesorio[$k]->Muestrario[$i]->MuestrarioAccesorioPresupuestoId. " ORDER BY cm.PrecioVenta";

                                try 
                                {   
                                    $stmt = $db->query($sql);
                                    $response = $stmt->fetchAll(PDO::FETCH_OBJ);

                                    $presupuesto->Accesorio[$k]->Muestrario[$i]->Combinacion = $response;

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
                        }
                    }
                    
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
        }
    } 
    catch(PDOException $e) 
    {
        $db = null;
        echo $e;
        echo '[ { "Estatus": "Fallo" } ]';
        //$app->status(409);
        $app->stop();
    }
    
    
    echo '[{"Estatus": "Exitoso"}, {"Presupuesto":'.json_encode($presupuesto).'} ]';
}

function EditarProyectoPresupuesto()
{
    global $app;
    $request = \Slim\Slim::getInstance()->request();
    $presupuesto = json_decode($request->getBody());
    
    $sql = "DELETE FROM Presupuesto WHERE PresupuestoId = ".$presupuesto->PresupuestoId;
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
        $db = null;
        $app->status(409);
        $app->stop();
    }
    
    $sql = "DELETE FROM PromocionPersona WHERE PersonaId = ".$presupuesto->Persona->PersonaId;
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
        $db = null;
        $app->status(409);
        $app->stop();
    }
    
    $countPromocion = count($presupuesto->Promocion);
    if($countPromocion > 0)
    {
       
        for($k=0; $k<$countPromocion; $k++)
        {
            $sql = "INSERT INTO PromocionPersona (PersonaId, TipoPromocionId, TipoVentaId, FechaLimite, DescuentoMinimo, DescuentoMaximo, NumeroPagos, Descripcion) VALUES";
            
            $sql .= "('".$presupuesto->Persona->PersonaId."', '".$presupuesto->Promocion[$k]->TipoPromocion->TipoPromocionId."', '".$presupuesto->Promocion[$k]->TipoVenta->TipoVentaId."',
                :FechaLimite, :DescuentoMinimo, :DescuentoMaximo, :NumeroPagos, :Descripcion),";
        
            
            $sql = rtrim($sql,",");

            try 
            {
                $stmt = $db->prepare($sql);
                
                $stmt->bindParam("FechaLimite", $presupuesto->Promocion[$k]->FechaLimite2);
                $stmt->bindParam("DescuentoMinimo", $presupuesto->Promocion[$k]->DescuentoMinimo);
                $stmt->bindParam("DescuentoMaximo", $presupuesto->Promocion[$k]->DescuentoMaximo);
                $stmt->bindParam("NumeroPagos", $presupuesto->Promocion[$k]->NumeroPagos);
                $stmt->bindParam("Descripcion", $presupuesto->Promocion[$k]->Descripcion);
                
                $stmt->execute();

            } 
            catch(PDOException $e) 
            {
                echo $sql;
                echo $e;
                $db->rollBack();
                $app->status(409);
                $app->stop();
            }
        }
    }
    
    $sql = "UPDATE Proyecto SET UnidadNegocioId = '".$presupuesto->Proyecto->UnidadNegocioId."' WHERE ProyectoId = ".$presupuesto->Proyecto->ProyectoId;
        
    try 
    {
        $stmt = $db->prepare($sql);
        $stmt->execute();

        //$presupuesto->PresupuestoId = $db->lastInsertId();
    }
    catch(PDOException $e) 
    {    
        echo $sql;
        echo '[{"Estatus": "Fallido"}]';
        $db->rollBack();
        $app->status(409);
        $app->stop();
    }
    
    $sql = "INSERT INTO Presupuesto (PresupuestoId, ProyectoId, PersonaId, UsuarioId, FechaCreacion, DescripcionInterna, DescripcionCliente, CantidadMaqueo, Titulo) VALUE
            (".$presupuesto->PresupuestoId.",'".$presupuesto->Proyecto->ProyectoId."', '".$presupuesto->Persona->PersonaId."', '".$presupuesto->UsuarioId."', '".$presupuesto->FechaCreacion."',
            '".$presupuesto->DescripcionInterna."', '".$presupuesto->DescripcionCliente."', '".$presupuesto->CantidadMaqueo."', '".$presupuesto->Titulo."')";
        
    try 
    {
        $stmt = $db->prepare($sql);
        $stmt->execute();

        //$presupuesto->PresupuestoId = $db->lastInsertId();
    }
    catch(PDOException $e) 
    {    
        echo $sql;
        echo '[{"Estatus": "Fallido"}]';
        $db->rollBack();
        $app->status(409);
        $app->stop();
    }
    
    
    $countCombinacion = count($presupuesto->CombinacionPresupuesto);
    if($countCombinacion > 0)
    {
        $sql = "INSERT INTO CombinacionPorPresupuesto (CombinacionMaterialId, PresupuestoId, PrecioVenta) VALUES";
        for($k=0; $k<$countCombinacion; $k++)
        {
            
            $sql .= "('".$presupuesto->CombinacionPresupuesto[$k]->CombinacionMaterialId."', '".$presupuesto->PresupuestoId."', '".$presupuesto->CombinacionPresupuesto[$k]->PrecioVenta."'),";
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
            $db->rollBack();
            $app->status(409);
            $app->stop();
        }
    
    }
    
    $countModulo = count($presupuesto->Modulo);
    if($countModulo > 0)
    {
        $sql = "INSERT INTO ModuloPresupuesto (PresupuestoId, ModuloId, Cantidad, Ancho, Alto, Profundo) VALUES";
        for($k=0; $k<$countModulo; $k++)
        {
            
            $sql .= "('".$presupuesto->PresupuestoId."', '".$presupuesto->Modulo[$k]->ModuloId."', '".$presupuesto->Modulo[$k]->Cantidad."',
                     '".$presupuesto->Modulo[$k]->Ancho."', '".$presupuesto->Modulo[$k]->Alto."', '".$presupuesto->Modulo[$k]->Profundo."'),";
        }
            
        $sql = rtrim($sql,",");

        try 
        {
            $stmt = $db->prepare($sql);
            $stmt->execute();

        } 
        catch(PDOException $e) 
        {
            echo $sql;
            $db->rollBack();
            $app->status(409);
            $app->stop();
        }

    }
    
    $countServicio = count($presupuesto->ServicioPresupuesto);
    if($countServicio > 0)
    {
        $sql = "INSERT INTO ServicioPresupuesto (PresupuestoId, ServicioId, Cantidad, PrecioVenta) VALUES";
        for($k=0; $k<$countServicio; $k++)
        {
            
            $sql .= "('".$presupuesto->PresupuestoId."', '".$presupuesto->ServicioPresupuesto[$k]->ServicioId."', '".$presupuesto->ServicioPresupuesto[$k]->Cantidad."', '".$presupuesto->ServicioPresupuesto[$k]->PrecioVenta."'),";
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
            $db->rollBack();
            $app->status(409);
            $app->stop();
        }
        
    }
    
    $countPuerta = count($presupuesto->PuertaPresupuesto);
    if($countPuerta > 0)
    {
        for($k=0; $k<$countPuerta; $k++)
        {
            $sql = "INSERT INTO PuertaPresupuesto (PresupuestoId, MuestrarioId) VALUES";

            $sql .= "('".$presupuesto->PresupuestoId."', '".$presupuesto->PuertaPresupuesto[$k]->MuestrarioId."'),";
            

            $sql = rtrim($sql,",");

            try 
            {
                $stmt = $db->prepare($sql);
                $stmt->execute();
                
                $presupuesto->PuertaPresupuesto[$k]->PuertaPresupuestoId = $db->lastInsertId();
            } 
            catch(PDOException $e) 
            {
                echo $sql;
                echo $e;
                $db->rollBack();
                $app->status(409);
                $app->stop();
            }
            
            $countCombinacionPuerta = count($presupuesto->PuertaPresupuesto[$k]->Combinacion);
            if($countCombinacionPuerta > 0)
            {
                $sql = "INSERT INTO CombinacionPuertaPresupuesto (CombinacionMaterialId, PuertaPresupuestoId, PrecioVenta) VALUES";
                for($j=0; $j<$countCombinacionPuerta; $j++)
                {

                    $sql .= "('".$presupuesto->PuertaPresupuesto[$k]->Combinacion[$j]->CombinacionMaterialId."', '".$presupuesto->PuertaPresupuesto[$k]->PuertaPresupuestoId."', '".$presupuesto->PuertaPresupuesto[$k]->Combinacion[$j]->PrecioVenta."'),";
                }

                $sql = rtrim($sql,",");

                try 
                {
                    $stmt = $db->prepare($sql);
                    $stmt->execute();
                } 
                catch(PDOException $e) 
                {
                    echo $sql;
                    echo $e;
                    $db->rollBack();
                    $app->status(409);
                    $app->stop();
                }
                
            }
        }
        
        
    }
    
    $countMaqueo = count($presupuesto->MaqueoPresupuesto);
    if($countMaqueo > 0)
    {
        $sql = "INSERT INTO MaqueoPresupuesto (PresupuestoId, MaqueoId, PrecioVenta) VALUES";
        for($k=0; $k<$countMaqueo; $k++)
        {
            $sql .= "('".$presupuesto->PresupuestoId."', '".$presupuesto->MaqueoPresupuesto[$k]->MaqueoId."', '".$presupuesto->MaqueoPresupuesto[$k]->PrecioVenta."'),";
        }
            
        $sql = rtrim($sql,",");

        try 
        {
            $stmt = $db->prepare($sql);
            $stmt->execute();
        } 
        catch(PDOException $e) 
        {
            echo $sql;
            echo $e;
            $db->rollBack();
            $app->status(409);
            $app->stop();
        }
    }
    
    $countAccesorio = count($presupuesto->AccesorioPresupuesto);
    if($countAccesorio > 0)
    {
        
        for($k=0; $k<$countAccesorio; $k++)
        {
            $sql = "INSERT INTO AccesorioPresupuesto (PresupuestoId, TipoAccesorioId, Cantidad) VALUES";
            $sql .= "('".$presupuesto->PresupuestoId."', '".$presupuesto->AccesorioPresupuesto[$k]->TipoAccesorioId."', '".$presupuesto->AccesorioPresupuesto[$k]->Cantidad."'),";
            
            $sql = rtrim($sql,",");

            try 
            {
                $stmt = $db->prepare($sql);
                $stmt->execute();
                
                $presupuesto->AccesorioPresupuesto[$k]->AccesorioPresupuestoId = $db->lastInsertId();
            } 
            catch(PDOException $e) 
            {
                echo $sql;
                echo $e;
                $db->rollBack();
                $app->status(409);
                $app->stop();
            }
            
            $countMuestrarioAccesorio = count($presupuesto->AccesorioPresupuesto[$k]->Muestrario);
            if($countMuestrarioAccesorio > 0)
            {
                
                for($j=0; $j<$countMuestrarioAccesorio; $j++)
                {
                    $sql = "INSERT INTO MuestrarioAccesorioPresupuesto (AccesorioPresupuestoId, MuestrarioId, PrecioVenta) VALUES";

                    $sql .= "('".$presupuesto->AccesorioPresupuesto[$k]->AccesorioPresupuestoId."', '".$presupuesto->AccesorioPresupuesto[$k]->Muestrario[$j]->MuestrarioId."', :PrecioVenta),";
                

                    $sql = rtrim($sql,",");

                    try 
                    {
                        $stmt = $db->prepare($sql);
                        $stmt->bindParam("PrecioVenta", $presupuesto->AccesorioPresupuesto[$k]->Muestrario[$j]->PrecioVenta);

                        $stmt->execute();

                        $presupuesto->AccesorioPresupuesto[$k]->Muestrario[$j]->MuestrarioAccesorioPresupuestoId = $db->lastInsertId();
                    } 
                    catch(PDOException $e) 
                    {
                        echo $sql;
                        echo $e;
                        $db->rollBack();
                        $app->status(409);
                        $app->stop();
                    }
                    
                    
                    $countCombinacionMuestrarioAccesorio = count($presupuesto->AccesorioPresupuesto[$k]->Muestrario[$j]->Combinacion);
                    if($countCombinacionMuestrarioAccesorio > 0)
                    {
                         
                        $sql = "INSERT INTO CombinacionMuestrarioAccesorioPresupuesto (CombinacionMaterialId, MuestrarioAccesorioPresupuestoId, PrecioVenta) VALUES";
                        for($l=0; $l<$countCombinacionMuestrarioAccesorio; $l++)
                        {
                            $sql .= "('".$presupuesto->AccesorioPresupuesto[$k]->Muestrario[$j]->Combinacion[$l]->CombinacionMaterialId."', '".$presupuesto->AccesorioPresupuesto[$k]->Muestrario[$j]->MuestrarioAccesorioPresupuestoId."', '".$presupuesto->AccesorioPresupuesto[$k]->Muestrario[$j]->Combinacion[$l]->PrecioVenta."'),";
                        }


                        $sql = rtrim($sql,",");

                        try 
                        {
                            $stmt = $db->prepare($sql);
                            $stmt->bindParam("PrecioVenta", $presupuesto->AccesorioPresupuesto[$k]->Muestrario[$j]->PrecioVenta);

                            $stmt->execute();

                            $presupuesto->AccesorioPresupuesto[$k]->Muestrario[$j]->MuestrarioAccesorioPresupuestoId = $db->lastInsertId();
                        } 
                        catch(PDOException $e) 
                        {
                            echo $sql;
                            echo $e;
                            $db->rollBack();
                            $app->status(409);
                            $app->stop();
                        }
                    }
                }
            }
            
        }
    }
    
    $countCubierta = count($presupuesto->CubiertaPresupuesto);
    if($countCubierta > 0)
    {
        for($k=0; $k<$countCubierta; $k++)
        {
            $sql = "INSERT INTO CubiertaPorPresupuesto (TipoCubiertaId, PresupuestoId) VALUES";
            $sql .= "('".$presupuesto->CubiertaPresupuesto[$k]->TipoCubiertaId."', '".$presupuesto->PresupuestoId."'),";
            
            $sql = rtrim($sql,",");

            try 
            {
                $stmt = $db->prepare($sql);
                $stmt->execute();
                
                $presupuesto->CubiertaPresupuesto[$k]->CubiertaPorPresupuestoId = $db->lastInsertId();
            } 
            catch(PDOException $e) 
            {
                echo $sql;
                echo $e;
                $db->rollBack();
                $app->status(409);
                $app->stop();
            }
            
            
            $countUbicacion = count($presupuesto->CubiertaPresupuesto[$k]->Ubicacion);
            if($countUbicacion > 0)
            {
               
                for($j=0; $j<$countUbicacion; $j++)
                {
                    $sql = "INSERT INTO UbicacionCubiertaPresupuesto (CubiertaPorPresupuestoId, UbicacionCubiertaId, CantidadAglomerado) VALUES";
                    $sql .= "('".$presupuesto->CubiertaPresupuesto[$k]->CubiertaPorPresupuestoId."', '".$presupuesto->CubiertaPresupuesto[$k]->Ubicacion[$j]->UbicacionCubiertaId."',
                    :CantidadAglomerado),";
                

                    $sql = rtrim($sql,",");

                    try 
                    {                
                        $stmt = $db->prepare($sql);

                        $stmt->bindParam("CantidadAglomerado", $presupuesto->CubiertaPresupuesto[$k]->Ubicacion[$j]->CantidadAglomerado);

                        $stmt->execute();
                        
                        $presupuesto->CubiertaPresupuesto[$k]->Ubicacion[$j]->UbicacionCubiertaPresupuestoId = $db->lastInsertId();
                    } 
                    catch(PDOException $e) 
                    {
                        echo $e;
                        $db->rollBack();
                        $app->status(409);
                        $app->stop();
                    }
                
                
                    $countUbicacionElemento = count($presupuesto->CubiertaPresupuesto[$k]->Ubicacion[$j]->Elemento);
                    if($countUbicacionElemento > 0)
                    {
                        $sql = "INSERT INTO SeccionUbicacionCubiertaPresupuesto (UbicacionCubiertaPresupuestoId, Lado1, Lado2) VALUES";
                        for($m=0; $m<$countUbicacionElemento; $m++)
                        {
                            $sql .= "('".$presupuesto->CubiertaPresupuesto[$k]->Ubicacion[$j]->UbicacionCubiertaPresupuestoId."', '".$presupuesto->CubiertaPresupuesto[$k]->Ubicacion[$j]->Elemento[$m]->Lado1."',
                            '".$presupuesto->CubiertaPresupuesto[$k]->Ubicacion[$j]->Elemento[$m]->Lado2."'),";
                        }


                        $sql = rtrim($sql,",");

                        try 
                        {                
                            $stmt = $db->prepare($sql);

                            $stmt->bindParam("Cantidad", $presupuesto->CubiertaPresupuesto[$k]->Ubicacion[$j]->CantidadAglomerado);

                            $stmt->execute();
                        } 
                        catch(PDOException $e) 
                        {
                            echo $e;
                            $db->rollBack();
                            $app->status(409);
                            $app->stop();
                        }
                    }
                }
            }
            
            $countGrupoCubierta = count($presupuesto->CubiertaPresupuesto[$k]->Grupo);
            if($countGrupoCubierta > 0)
            {
                
                for($j=0; $j<$countGrupoCubierta; $j++)
                {
                    $sql = "INSERT INTO MaterialTipoCubiertaPresupuesto (CubiertaPorPresupuestoId, MaterialId, GrupoId) VALUES";
                    
                    $sql .= "('".$presupuesto->CubiertaPresupuesto[$k]->CubiertaPorPresupuestoId."', '".$presupuesto->CubiertaPresupuesto[$k]->Grupo[$j]->MaterialId."', 
                    '".$presupuesto->CubiertaPresupuesto[$k]->Grupo[$j]->GrupoId."'),";
                

                    $sql = rtrim($sql,",");

                    try 
                    {
                        $stmt = $db->prepare($sql);
                        $stmt->execute();
                        
                        $presupuesto->CubiertaPresupuesto[$k]->Grupo[$j]->MaterialTipoCubiertaPresupuestoId = $db->lastInsertId();
                    } 
                    catch(PDOException $e) 
                    {
                        echo $e;
                        $db->rollBack();
                        $app->status(409);
                        $app->stop();
                    }
                    
                    $countUbicacionGrupoCubierta = count($presupuesto->CubiertaPresupuesto[$k]->Grupo[$j]->Ubicacion);
                    if($countUbicacionGrupoCubierta > 0)
                    {
                        
                        $sql = "INSERT INTO PrecioCubiertaPresupuesto (MaterialTipoCubiertaPresupuestoId, UbicacionCubiertaId, PrecioVenta) VALUES";
                        for($m=0; $m<$countUbicacionGrupoCubierta; $m++)
                        {
                            $sql .= "('".$presupuesto->CubiertaPresupuesto[$k]->Grupo[$j]->MaterialTipoCubiertaPresupuestoId."', '".$presupuesto->CubiertaPresupuesto[$k]->Grupo[$j]->Ubicacion[$m]->UbicacionCubiertaId."',
                            '".$presupuesto->CubiertaPresupuesto[$k]->Grupo[$j]->Ubicacion[$m]->PrecioVenta."'),";
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
                            $db->rollBack();
                            $app->status(409);
                            $app->stop();
                        }
                        

                    }
                }
                
            }
        }
    }

    $db->commit();
    $db = null;

    echo '[{"Estatus": "Exitoso"}]';
}

function GetReporteProyecto()
{
    global $app;
    global $session_expiration_time;

    $request = \Slim\Slim::getInstance()->request();
    $filtro = json_decode($request->getBody());
    
    
    if($filtro->unidadId != -1 && $filtro->fecha1 == -1 && $filtro->fecha2 == -1)
    {
         $sql = "SELECT * FROM ProyectoReporteVista WHERE UnidadNegocioId = ".$filtro->unidadId."";
    }
    else if($filtro->unidadId == -1 && $filtro->fecha1 != -1 && $filtro->fecha2 != -1)
    {
         $sql = "SELECT * FROM ProyectoReporteVista WHERE FechaInicio >= '".$filtro->fecha1."' AND FechaFin <= '".$filtro->fecha2."'";
    }
    else
    {
        $sql = "SELECT * FROM ProyectoReporteVista WHERE UnidadNegocioId = ".$filtro->unidadId." AND FechaInicio >= '".$filtro->fecha1."' AND FechaFin <= '".$filtro->fecha2."'";
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
    
?>
