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
        $sql = "INSERT Persona (MedioCaptacionId, TipoPersonaId, Nombre, PrimerApellido, SegundoApellido, NombreMedioCaptacion) VALUES
        ('".$presupuesto->Persona->MedioCaptacion->MedioCaptacionId."', 2, '".$presupuesto->Persona->Nombre."', '".$presupuesto->Persona->PrimerApellido."', '".$presupuesto->Persona->SegundoApellido."',
        '".$presupuesto->Persona->NombreMedioCaptacion."')";
        
        try 
        {
            $stmt = $db->prepare($sql);
            $stmt->execute();
            
            $presupuesto->Persona->PersonaId = $db->lastInsertId();
        }
        catch(PDOException $e) 
        {    
            echo $e;
            echo '[{"Estatus": "Fallido"}]';
            $db->rollBack();
            $app->status(409);
            $app->stop();
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
        
        $counUnidad = count($presupuesto->Persona->UnidadNegocio);
        if($counUnidad > 0)
        {
            $sql = "INSERT UnidadNegocioPorPersona (PersonaId, UnidadNegocioId) VALUES ";
            
            for($k=0; $k<$counUnidad; $k++)
            {
                $sql .= " ('".$presupuesto->Persona->PersonaId."', '".$presupuesto->Persona->UnidadNegocio[$k]->UnidadNegocioId."'),";
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
    
    if($presupuesto->Proyecto->ProyectoId == "0")
    {
        $sql = "INSERT INTO Proyecto (PersonaId, TipoProyectoId, EstatusProyectoId, DireccionPersonaId, Nombre, FechaCreacion) VALUES
                ('".$presupuesto->Persona->PersonaId."', '".$presupuesto->Proyecto->TipoProyecto->TipoProyectoId."', 1,
                :DireccionPersonaId, '".$presupuesto->Proyecto->Nombre."', '".$presupuesto->Proyecto->FechaCreacion."')";
        
        try 
        {
            $stmt = $db->prepare($sql);
            $stmt->bindParam("DireccionPersonaId", $presupuesto->Proyecto->Domicilio->DomicilioId);
            
            $stmt->execute();
            
            $presupuesto->Proyecto->ProyectoId = $db->lastInsertId();
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
        $sql = "UPDATE Proyecto SET DireccionPersonaId = :DireccionPersonaId WHERE ProyectoId = ".$presupuesto->Proyecto->ProyectoId."";
        
        try 
        {
            $stmt = $db->prepare($sql);
            
            $stmt->bindParam("DireccionPersonaId", $presupuesto->Proyecto->Domicilio->DomicilioId);
            
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
    
    $sql = "INSERT INTO Presupuesto (ProyectoId, PersonaId, UsuarioId, FechaCreacion, DescripcionInterna, DescripcionCliente, CantidadMaqueo, Titulo) VALUE
            ('".$presupuesto->Proyecto->ProyectoId."', '".$presupuesto->Persona->PersonaId."', '".$presupuesto->UsuarioId."', '".$presupuesto->FechaCreacion."',
            '".$presupuesto->DescripcionInterna."', '".$presupuesto->DescripcionCliente."', '".$presupuesto->CantidadMaqueo."', '".$presupuesto->Titulo."')";
        
    try 
    {
        $stmt = $db->prepare($sql);
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
    
    $countPromocion = count($presupuesto->Promocion);
    if($countPromocion > 0)
    {
       
        for($k=0; $k<$countPromocion; $k++)
        {
            $sql = "INSERT INTO PromocionPresupuesto (PresupuestoId, TipoPromocionId, TipoVentaId, FechaLimite, DescuentoMinimo, DescuentoMaximo, NumeroPagos, Descripcion) VALUES";
            
            $sql .= "('".$presupuesto->PresupuestoId."', '".$presupuesto->Promocion[$k]->TipoPromocion->TipoPromocionId."', '".$presupuesto->Promocion[$k]->TipoVenta->TipoVentaId."',
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

    $db->commit();
    $db = null;

    echo '[{"Estatus": "Exitoso"}, {"PresupuestoId":"'.$presupuesto->PresupuestoId.'"}, {"PersonaId":"'.$presupuesto->Persona->PersonaId.'"}]';
    
}

    
?>
