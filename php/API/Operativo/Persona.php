<?php

function GetCliente($id)
{
    global $app;
    global $session_expiration_time;

    $request = \Slim\Slim::getInstance()->request();
    
    if($id == "-1")
    {
        $sql = "SELECT * FROM ClienteVista";
    }
    else
    {
        $sql = "SELECT * FROM ClienteVista WHERE UnidadNegocioId = ".$id;
    }

    try 
    {

        $db = getConnection();
        $stmt = $db->query($sql);
        $response = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;
    
        
        echo '[ { "Estatus": "Exito"}, {"Cliente":'.json_encode($response).'} ]'; 
    } 
    catch(PDOException $e) 
    {
        //echo($e);
        echo '[ { "Estatus": "Fallo" } ]';
        $app->status(409);
        $app->stop();
    }
}


function GetBuscarPersona()
{
    global $app;
    global $session_expiration_time;

    $request = \Slim\Slim::getInstance()->request();
    $persona = json_decode($request->getBody());
    
    
    $sql = "SELECT PersonaId, Nombre, PrimerApellido, SegundoApellido, MedioCaptacionId, NombreMedioCaptacion FROM BuscarPersonaVista
            WHERE Nombre LIKE '%".$persona->Nombre."%' AND PrimerApellido LIKE '%".$persona->PrimerApellido."%'";
    
    try 
    {
        $db = getConnection();
        $stmt = $db->query($sql);
        $response = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;
        
        echo '[ { "Estatus": "Exito"}, {"Persona":'.json_encode($response).'} ]'; 
    } 
    catch(PDOException $e) 
    {
        //echo $e;
        echo '[ { "Estatus": "Fallo" } ]';
        //$app->status(409);
        $app->stop();
    }
}

function EditarMedioContactoPersona()
{
    global $app;
    $request = \Slim\Slim::getInstance()->request();
    $contacto = json_decode($request->getBody());
   
    $sql = "UPDATE ContactoPersona SET TipoMedioContactoId='".$contacto->TipoMedioContacto->TipoMedioContactoId."', Contacto='".$contacto->Contacto."'  WHERE ContactoPersonaId=".$contacto->ContactoPersonaId."";
    
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
        echo $e;
        $app->status(409);
        $app->stop();
    }
}

function AgregarMedioContactoPersona()
{
    $request = \Slim\Slim::getInstance()->request();
    $contacto = json_decode($request->getBody());
    global $app;
    $sql = "INSERT INTO ContactoPersona (PersonaId, TipoMedioContactoId, Contacto, Activo) VALUES(:PersonaId, :TipoMedioContactoId, :Contacto, 1)";

    try 
    {
        $db = getConnection();
        $stmt = $db->prepare($sql);

        $stmt->bindParam("PersonaId", $contacto->PersonaId);
        $stmt->bindParam("TipoMedioContactoId", $contacto->TipoMedioContacto->TipoMedioContactoId);
        $stmt->bindParam("Contacto", $contacto->Contacto);

        $stmt->execute();

        $db = null;
        echo '[{"Estatus": "Exitoso"}]';

    } catch(PDOException $e) 
    {
        echo $e;
        echo '[{"Estatus": "Fallido"}]';
        $app->status(409);
        $app->stop();
    }
}

function AgregarDomicilioPersona()
{
    $request = \Slim\Slim::getInstance()->request();
    $domicilio = json_decode($request->getBody());
    global $app;
    $sql = "INSERT INTO DireccionPersona (TipoMedioContactoId, PersonaId, PaisId, Codigo, Domicilio, Estado, Municipio, Ciudad, Colonia, Activo) 
            VALUES(:TipoMedioContactoId, :PersonaId, 1, :Codigo, :Domicilio, :Estado, :Municipio, :Ciudad, :Colonia, 1)";

    try 
    {
        $db = getConnection();
        $stmt = $db->prepare($sql);

        $stmt->bindParam("TipoMedioContactoId", $domicilio->TipoMedioContacto->TipoMedioContactoId);
        $stmt->bindParam("PersonaId", $domicilio->PersonaId);
        $stmt->bindParam("Codigo", $domicilio->Codigo);
        $stmt->bindParam("Domicilio", $domicilio->Domicilio);
        $stmt->bindParam("Estado", $domicilio->Estado);
        $stmt->bindParam("Municipio", $domicilio->Municipio);
        $stmt->bindParam("Ciudad", $domicilio->Ciudad);
        $stmt->bindParam("Colonia", $domicilio->Colonia);

        $stmt->execute();

        $db = null;
        echo '[{"Estatus": "Exitoso"}]';

    } catch(PDOException $e) 
    {
        echo $e;
        echo '[{"Estatus": "Fallido"}]';
        $app->status(409);
        $app->stop();
    }
}

function EditarDireccionPersona()
{
    global $app;
    $request = \Slim\Slim::getInstance()->request();
    $direccion = json_decode($request->getBody());
   
    $sql = "UPDATE DireccionPersona SET TipoMedioContactoId='".$direccion->TipoMedioContacto->TipoMedioContactoId."', Domicilio='".$direccion->Domicilio."',
    Codigo='".$direccion->Codigo."', Estado='".$direccion->Estado."', Municipio='".$direccion->Municipio."', Ciudad='".$direccion->Ciudad."', Colonia='".$direccion->Colonia."'   
    WHERE DireccionPersonaId=".$direccion->DireccionPersonaId."";
    
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
        echo $e;
        $app->status(409);
        $app->stop();
    }
}

function EditarDatosPersona()
{
    global $app;
    $request = \Slim\Slim::getInstance()->request();
    $persona = json_decode($request->getBody());
   
    $sql = "UPDATE Persona SET Nombre = '".$persona->Nombre."', PrimerApellido = '".$persona->PrimerApellido."', SegundoApellido = '".$persona->SegundoApellido."', 
    MedioCaptacionId = '".$persona->MedioCaptacion->MedioCaptacionId."' WHERE PersonaId =" .$persona->PersonaId;
    
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
        echo $e;
        $app->status(409);
        $app->stop();
    }
}

function GetMedioContactoPersona()
{
    global $app;
    global $session_expiration_time;

    $request = \Slim\Slim::getInstance()->request();
    $persona = json_decode($request->getBody());
    
    
    $sql = "SELECT ContactoPersonaId, PersonaId, MedioContactoId,TipoMedioContactoId, Contacto, Activo, NombreMedioContacto, NombreTipoMedioContacto
            FROM MedioContactoPersonaVista WHERE PersonaId = ".$persona->PersonaId;
    
    try 
    {
        $db = getConnection();
        $stmt = $db->query($sql);
        $response = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;
        
        echo '[ { "Estatus": "Exito"}, {"Contacto":'.json_encode($response).'} ]'; 
    } 
    catch(PDOException $e) 
    {
        //echo $e;
        echo '[ { "Estatus": "Fallo" } ]';
        //$app->status(409);
        $app->stop();
    }
}

function GetDireccionPersona()
{
    global $app;
    global $session_expiration_time;

    $request = \Slim\Slim::getInstance()->request();
    $persona = json_decode($request->getBody());
    
    
    $sql = "SELECT *
            FROM DireccionPersonaVista WHERE PersonaId = ".$persona->PersonaId;
    
    try 
    {
        $db = getConnection();
        $stmt = $db->query($sql);
        $response = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;
        
        echo '[ { "Estatus": "Exito"}, {"Direccion":'.json_encode($response).'} ]'; 
    } 
    catch(PDOException $e) 
    {
        //echo $e;
        echo '[ { "Estatus": "Fallo" } ]';
        //$app->status(409);
        $app->stop();
    }
}

function GetContactoAdicional()
{
    global $app;
    global $session_expiration_time;

    $request = \Slim\Slim::getInstance()->request();
    $persona = json_decode($request->getBody());
    
    
    $sql = "SELECT ContactoAdicionalId, Nombre, CorreoElectronico, Telefono
            FROM ContactoAdicional WHERE PersonaId = ".$persona->PersonaId;
    
    try 
    {
        $db = getConnection();
        $stmt = $db->query($sql);
        $response = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;
        
        echo '[ { "Estatus": "Exito"}, {"ContactoAdicional":'.json_encode($response).'} ]'; 
    } 
    catch(PDOException $e) 
    {
        echo $e;
        echo '[ { "Estatus": "Fallo" } ]';
        //$app->status(409);
        $app->stop();
    }
}

function GetDatosFiscales()
{
    global $app;
    global $session_expiration_time;

    $request = \Slim\Slim::getInstance()->request();
    $persona = json_decode($request->getBody());
    
    
    $sql = "SELECT *
            FROM DatosFiscales WHERE PersonaId = ".$persona->PersonaId;
    
    try 
    {
        $db = getConnection();
        $stmt = $db->query($sql);
        $response = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;
        
        echo '[ { "Estatus": "Exito"}, {"DatosFiscales":'.json_encode($response).'} ]'; 
    } 
    catch(PDOException $e) 
    {
        //echo $e;
        echo '[ { "Estatus": "Fallo" } ]';
        //$app->status(409);
        $app->stop();
    }
}

function GetUnidadNegocioPersona()
{
    global $app;
    global $session_expiration_time;

    $request = \Slim\Slim::getInstance()->request();
    $persona = json_decode($request->getBody());
    
    
    $sql = "SELECT u.*, x.Margen
            FROM UnidadNegocioPersonaVista u
            
            INNER JOIN (

            SELECT p.Ciudad, p.Municipio, p.Estado, t.Margen
            FROM Plaza p
            INNER JOIN Territorio t ON t.TerritorioId = p.TerritorioId
            ) x ON u.Estado = x.Estado AND u.Ciudad = x.Ciudad AND u.Municipio = x.Municipio
            
            WHERE u.PersonaId = ".$persona->PersonaId;
    
    try 
    {
        $db = getConnection();
        $stmt = $db->query($sql);
        $response = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;
        
        echo '[ { "Estatus": "Exito"}, {"UnidadNegocio":'.json_encode($response).'} ]'; 
    } 
    catch(PDOException $e) 
    {
        //echo $e;
        echo '[ { "Estatus": "Fallo" } ]';
        //$app->status(409);
        $app->stop();
    }
}

function GetDatoPersona()
{
    global $app;
    global $session_expiration_time;

    $request = \Slim\Slim::getInstance()->request();
    $persona = json_decode($request->getBody());
    
    
    $sql = "SELECT PersonaId, Nombre, PrimerApellido, SegundoApellido, MedioCaptacionId, NombreMedioCaptacion, TipoPersonaId FROM BuscarPersonaVista
            WHERE PersonaId = ".$persona->PersonaId;
    
    try 
    {
        $db = getConnection();
        $stmt = $db->query($sql);
        $response = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;
        
        echo '[ { "Estatus": "Exito"}, {"Persona":'.json_encode($response).'} ]'; 
    } 
    catch(PDOException $e) 
    {
        //echo $e;
        echo '[ { "Estatus": "Fallo" } ]';
        //$app->status(409);
        $app->stop();
    }
}

function EditarUnidadNegocioPersona()
{
    global $app;
    global $session_expiration_time;

    $request = \Slim\Slim::getInstance()->request();
    $unidad = json_decode($request->getBody());
   
    $sql = "DELETE FROM UnidadNegocioPorPersona WHERE PersonaId=".$unidad->Persona->PersonaId;

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
        $db->rollBack();
        $app->status(409);
        $app->stop();
    }
    
    $counUnidad = count($unidad->Unidad);

    if($counUnidad > 0)
    {
        $sql = "INSERT UnidadNegocioPorPersona (PersonaId, UnidadNegocioId) VALUES ";


        for($k=0; $k<$counUnidad; $k++)
        {
            $sql .= " ('".$unidad->Persona->PersonaId."', '".$unidad->Unidad[$k]->UnidadNegocioId."'),";
        }
        
        $sql = rtrim($sql,",");

        try 
        {
            $stmt = $db->prepare($sql);
            $stmt->execute();
            
            $db->commit();
             $db = null;
            echo '[ { "Estatus": "Exitoso" } ]';
           
        }
        catch(PDOException $e) 
        {    
            echo $e;
            $db->rollBack();
            echo '[{"Estatus": "Fallido"}]';
            $db->rollBack();
            $app->status(409);
            $app->stop();
        }
    }
}

function AgregarContactoAdicional()
{
    $request = \Slim\Slim::getInstance()->request();
    $contacto = json_decode($request->getBody());
    global $app;
    $sql = "INSERT INTO ContactoAdicional (PersonaId, Nombre, Telefono, CorreoElectronico) VALUES(:PersonaId, :Nombre, :Telefono, :CorreoElectronico)";

    try 
    {
        $db = getConnection();
        $stmt = $db->prepare($sql);
        
        $stmt->bindParam("PersonaId", $contacto->PersonaId);
        $stmt->bindParam("Nombre", $contacto->Nombre);
        $stmt->bindParam("Telefono", $contacto->Telefono);
        $stmt->bindParam("CorreoElectronico", $contacto->Correo);

        $stmt->execute();

        $db = null;
        echo '[{"Estatus": "Exitoso"}]';

    } catch(PDOException $e) 
    {
        echo $e;
        echo '[{"Estatus": "Fallido"}]';
        $app->status(409);
        $app->stop();
    }
}

function AgregarDatoFiscalPersona()
{
    $request = \Slim\Slim::getInstance()->request();
    $datoFiscal = json_decode($request->getBody());
    global $app;
    $sql = "INSERT INTO DatosFiscales (PersonaId, Nombre, RFC, CorreoElectronico, Domicilio, Codigo, Estado, Municipio, Ciudad, Colonia) 
                                VALUES(:PersonaId, :Nombre, :RFC, :CorreoElectronico, :Domicilio, :Codigo, :Estado, :Municipio, :Ciudad, :Colonia)";

    try 
    {
        $db = getConnection();
        $stmt = $db->prepare($sql);
        
        $stmt->bindParam("PersonaId", $datoFiscal->PersonaId);
        $stmt->bindParam("Nombre", $datoFiscal->Nombre);
        $stmt->bindParam("RFC", $datoFiscal->RFC);
        $stmt->bindParam("CorreoElectronico", $datoFiscal->CorreoElectronico);
        $stmt->bindParam("Domicilio", $datoFiscal->Domicilio);
        $stmt->bindParam("Codigo", $datoFiscal->Codigo);
        $stmt->bindParam("Estado", $datoFiscal->Estado);
        $stmt->bindParam("Municipio", $datoFiscal->Municipio);
        $stmt->bindParam("Ciudad", $datoFiscal->Ciudad);
        $stmt->bindParam("Colonia", $datoFiscal->Colonia);

        $stmt->execute();
        
        $id = $db->lastInsertId();

        $db = null;
        echo '[{"Estatus": "Exitoso"}, {"Id": "'.$id.'"}]';

    } catch(PDOException $e) 
    {
        echo $e;
        echo '[{"Estatus": "Fallido"}]';
        $app->status(409);
        $app->stop();
    }
}

function EditarDatoFiscalPersona()
{
    global $app;
    $request = \Slim\Slim::getInstance()->request();
    $datos = json_decode($request->getBody());
   
    $sql = "UPDATE DatosFiscales SET Nombre = '".$datos->Nombre."', RFC = '".$datos->RFC."', CorreoElectronico = '".$datos->CorreoElectronico."',
            Codigo = '".$datos->Codigo."', Domicilio = '".$datos->Domicilio."', Estado = '".$datos->Estado."', Municipio = '".$datos->Municipio."',
            Ciudad = '".$datos->Ciudad."', Colonia = '".$datos->Colonia."' WHERE DatosFiscalesId =" .$datos->DatosFiscalesId;
    
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
        echo $e;
        $app->status(409);
        $app->stop();
    }
}

function EditarContactoAdicional()
{
    global $app;
    $request = \Slim\Slim::getInstance()->request();
    $contacto = json_decode($request->getBody());
   
    $sql = "UPDATE ContactoAdicional SET PersonaId = ".$contacto->PersonaId.", Nombre = '".$contacto->Nombre."', Telefono = '".$contacto->Telefono."', CorreoElectronico = '".$contacto->Correo."' 
            WHERE ContactoAdicionalId =" .$contacto->ContactoAdicionalId;
    
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
        echo $e;
        $app->status(409);
        $app->stop();
    }
}

function DeleteUnidadNegocioPersona() 
{
    global $app;
    global $session_expiration_time;
    
    $request = \Slim\Slim::getInstance()->request();
    $id = json_decode($request->getBody());

    $sql = "DELETE FROM UnidadNegocioPorPersona WHERE UnidadNegocioPorPersonaId=".$id;
    try 
    {
        $db = getConnection();
        $stmt = $db->prepare($sql); 
        $stmt->execute(); 
        $db = null;
        
        echo '[ { "Estatus": "Exito" } ]';
        //echo '[{"rowcount":'. $stmt->rowCount() .'}]';
    } 
    catch(PDOException $e) 
    {
        echo $sql;
        echo '[ { "Estatus": "Fallo" } ]';
        $app->status(409);
        $app->stop();
    }
}

function GetCitaPersona()
{
    global $app;
    global $session_expiration_time;

    $request = \Slim\Slim::getInstance()->request();
    $persona = json_decode($request->getBody());
    
    
    $sql = "SELECT * FROM CitaVista WHERE PersonaId = ".$persona->PersonaId;
    
    try 
    {
        $db = getConnection();
        $stmt = $db->query($sql);
        $response = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;
        
        echo '[ { "Estatus": "Exito"}, {"Cita":'.json_encode($response).'} ]'; 
    } 
    catch(PDOException $e) 
    {
        echo $e;
        echo '[ { "Estatus": "Fallo" } ]';
        //$app->status(409);
        $app->stop();
    }
}

function GetMargenDireccion()
{
    global $app;
    global $session_expiration_time;

    $request = \Slim\Slim::getInstance()->request();
    $domicilio = json_decode($request->getBody());
    
    
    
   $sql = "SELECT t.Margen, x.UnidadNegocioId FROM Territorio t INNER JOIN  (
            
            SELECT p.TerritorioId, p.UnidadNegocioId  FROM Plaza p
            WHERE p.Estado = '".$domicilio->Estado."' AND p.Municipio = '".$domicilio->Municipio."' AND p.Ciudad = '".$domicilio->Ciudad."') x ON t.TerritorioId = x.TerritorioId";
    
    try 
    {
        $db = getConnection();
        $stmt = $db->query($sql);
        $response = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;
        
        $size = count($response);
        
        if($size == 1)
        {
            echo '[ { "Estatus": "Exito"}, {"Margen":'.$response[0]->Margen.'}, {"UnidadNegocioId":'.$response[0]->UnidadNegocioId.'} ]'; 
        }
        else
        {
            echo '[ { "Estatus": "Exito"}, {"Margen":"-1"}, {"UnidadNegocioId":"0"}]'; 
        }
    } 
    catch(PDOException $e) 
    {
        echo $e;
        echo '[ { "Estatus": "Fallo" } ]';
        //$app->status(409);
        $app->stop();
    }
}

function GetPromocionPersona($id)
{
    global $app;
    global $session_expiration_time;

    $request = \Slim\Slim::getInstance()->request();
    
     $sql = "SELECT COUNT(*) as NumeroPresupuesto
            FROM Presupuesto
            WHERE PersonaId = " .$id;
    
    try 
    {   
        $db = getConnection();
        $stmt = $db->query($sql);
        $response = $stmt->fetchAll(PDO::FETCH_OBJ);
        $numPresupuesto = $response[0]->NumeroPresupuesto;
        
    } 
    catch(PDOException $e) 
    {
        $db = null;
        echo $e;
        echo '[ { "Estatus": "Fallo" } ]';
        //$app->status(409);
        $app->stop();
    }
    
    $sql = "SELECT *
            FROM PromocionPersonaVista 
            WHERE PersonaId = ".$id. " ORDER BY DescuentoMinimo";
    
    try 
    {   
        $stmt = $db->query($sql);
        $response = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;
        
        
        $promo = new stdClass();
        $promo->PromocionMueble = array();
        $promo->PromocionCubierta = array();
        
        $countPromo = count($response);
        
        for($k=0; $k<$countPromo; $k++)
        {
            if($response[$k]->TipoVentaId == "1")
            {
                array_push($promo->PromocionMueble, $response[$k]);
            }
            else if($response[$k]->TipoVentaId == "2")
            {
                array_push($promo->PromocionCubierta, $response[$k]);
            }
        }
        
        echo '[{"Estatus": "Exitoso"}, {"Promocion":'.json_encode($promo).'}, {"NumeroPresupuesto":'.$numPresupuesto.'} ]';
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

function GuardarPersona()
{
    $request = \Slim\Slim::getInstance()->request();
    $persona = json_decode($request->getBody());
    global $app;
    

    try 
    {
        $db = getConnection();
        $db->beginTransaction();

    } catch(PDOException $e) 
    {
        echo $e;
        $app->status(409);
        $app->stop();
        echo '[{"Estatus": "Fallido"}]';
    }
    
    //editar
    if($persona->PersonaId !=  "0")
    {
        $sql = "DELETE FROM UnidadNegocioPorPersona WHERE PersonaId=".$persona->PersonaId;
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
    }
    else
    {
        $sql = "INSERT Persona (MedioCaptacionId, TipoPersonaId, Nombre, PrimerApellido, SegundoApellido, NombreMedioCaptacion, Registro) VALUES
        ('".$persona->MedioCaptacion->MedioCaptacionId."', 2, '".$persona->Nombre."', '".$persona->PrimerApellido."', '".$persona->SegundoApellido."',
        '".$persona->NombreMedioCaptacion."', NOW() - INTERVAL 9 HOUR)";
        
        try 
        {
            $stmt = $db->prepare($sql);
            $stmt->execute();
            
            $persona->PersonaId = $db->lastInsertId();
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
    
    $counUnidad = count($persona->UnidadNegocio);
    if($counUnidad > 0)
    {
        $sql = "INSERT UnidadNegocioPorPersona (PersonaId, UnidadNegocioId) VALUES ";

        for($k=0; $k<$counUnidad; $k++)
        {
            $sql .= " (".$persona->PersonaId.", ".$persona->UnidadNegocio[$k]->UnidadNegocioId."),";
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

    $counContacto = count($persona->NuevoContacto);
    if($counContacto > 0)
    {
        $sql = "INSERT INTO ContactoPersona (TipoMedioContactoId, PersonaId, Contacto, Activo) VALUES";

        for($k=0; $k<$counContacto; $k++)
        {
            $sql .= " (".$persona->NuevoContacto[$k]->TipoMedioContacto->TipoMedioContactoId.", ".$persona->PersonaId.",
            '".$persona->NuevoContacto[$k]->Contacto."', 1),";
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
    
    echo '[{"Estatus": "Exitoso"}, {"Id": "'.$persona->PersonaId.'"}]';
    $app->status(200);
    $db->commit();
    $db = null;
}

function GetReportePersonaRegistrada()
{
    global $app;
    global $session_expiration_time;

    $request = \Slim\Slim::getInstance()->request();
    $filtro = json_decode($request->getBody());
    
    
    if($filtro->unidadId == -1)
    {
        $sql = "SELECT * FROM ReportePersonaRegistroVista WHERE  Registro >= '".$filtro->fecha1."' AND Registro <= '".$filtro->fecha2."'";
    }
    else
    {
         $sql = "SELECT * FROM ReportePersonaRegistroVista WHERE UnidadNegocioId = ".$filtro->unidadId." AND Registro >= '".$filtro->fecha1."' AND Registro <= '".$filtro->fecha2."'";
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
