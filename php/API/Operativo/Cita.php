<?php
	
/*function GetColor()
{
    global $app;
    global $session_expiration_time;

    $request = \Slim\Slim::getInstance()->request();

    $sql = "SELECT * FROM Color";

    try 
    {

        $db = getConnection();
        $stmt = $db->query($sql);
        $response = $stmt->fetchAll(PDO::FETCH_OBJ);
        $db = null;
        
        foreach ($response as $img) 
        {
            $img->Imagen =  base64_encode($img->Imagen);
        }
        
        //echo '[ { "Estatus": "Exito"}, {"Color":'.json_encode($response).'} ]'; 
        echo json_encode($response);  
    } 
    catch(PDOException $e) 
    {
        //echo($e);
        echo '[ { "Estatus": "Fallo" } ]';
        $app->status(409);
        $app->stop();
    }
}*/

function AgregarCita()
{
    $request = \Slim\Slim::getInstance()->request();
    $cita = json_decode($request->getBody());
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
    
    if($cita->Persona->PersonaId == "0")
    {
        $sql = "INSERT Persona (MedioCaptacionId, TipoPersonaId, Nombre, PrimerApellido, SegundoApellido, NombreMedioCaptacion) VALUES
        ('".$cita->Persona->MedioCaptacion->MedioCaptacionId."', 2, '".$cita->Persona->Nombre."', '".$cita->Persona->PrimerApellido."', '".$cita->Persona->SegundoApellido."',
        '".$cita->Persona->NombreMedioCaptacion."')";
        
        try 
        {
            $stmt = $db->prepare($sql);
            $stmt->execute();
            
            $cita->Persona->PersonaId = $db->lastInsertId();
        }
        catch(PDOException $e) 
        {    
            echo $e;
            echo '[{"Estatus": "Fallido"}]';
            $db->rollBack();
            $app->status(409);
            $app->stop();
        }
        
        $counUnidad = count($cita->Persona->UnidadNegocio);
        if($counUnidad > 0)
        {
            $sql = "INSERT UnidadNegocioPorPersona (PersonaId, UnidadNegocioId) VALUES ";
            
            for($k=0; $k<$counUnidad; $k++)
            {
                $sql .= " (".$cita->Persona->PersonaId.", ".$cita->Persona->UnidadNegocio[$k]->UnidadNegocioId."),";
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
        $sql = "DELETE FROM UnidadNegocioPorPersona WHERE PersonaId=".$cita->Persona->PersonaId;
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
        
        $counUnidad = count($cita->Persona->UnidadNegocio);
        if($counUnidad > 0)
        {
            $sql = "INSERT UnidadNegocioPorPersona (PersonaId, UnidadNegocioId) VALUES ";
            
            for($k=0; $k<$counUnidad; $k++)
            {
                $sql .= " ('".$cita->Persona->PersonaId."', '".$cita->Persona->UnidadNegocio[$k]->UnidadNegocioId."'),";
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
    
    $counContacto = count($cita->Persona->NuevoContacto);
    if($counContacto > 0)
    {
        $sql = "INSERT INTO ContactoPersona (TipoMedioContactoId, PersonaId, Contacto, Activo) VALUES";

        for($k=0; $k<$counContacto; $k++)
        {
            $sql .= " (".$cita->Persona->NuevoContacto[$k]->TipoMedioContacto->TipoMedioContactoId.", ".$cita->Persona->PersonaId.",
            '".$cita->Persona->NuevoContacto[$k]->Contacto."', 1),";
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
    
    $counDomicilio = count($cita->Persona->NuevoDomicilio);
    if($counDomicilio > 0)
    {
        for($k=0; $k<$counDomicilio; $k++)
        {
            $sql = "INSERT INTO DireccionPersona (TipoMedioContactoId, PersonaId, PaisId, Domicilio, Codigo, Estado, Municipio, Ciudad, Colonia, Activo) VALUES";


            $sql .= " (".$cita->Persona->NuevoDomicilio[$k]->TipoMedioContacto->TipoMedioContactoId.", ".$cita->Persona->PersonaId.",
            1, '".$cita->Persona->NuevoDomicilio[$k]->Domicilio."', '".$cita->Persona->NuevoDomicilio[$k]->Codigo."', '".$cita->Persona->NuevoDomicilio[$k]->Estado."',
            '".$cita->Persona->NuevoDomicilio[$k]->Municipio."', '".$cita->Persona->NuevoDomicilio[$k]->Ciudad."', '".$cita->Persona->NuevoDomicilio[$k]->Colonia."', 1),";
            
            $sql = rtrim($sql,",");

            try 
            {
                $stmt = $db->prepare($sql);
                $stmt->execute();
                
                if($cita->Persona->NuevoDomicilio[$k]->Seleccionado)
                {
                    $cita->DireccionCitaId = $db->lastInsertId();
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
    
    if($cita->Responsable->Colaborador)
    {
        $cita->Responsable->Colaborador = $cita->Responsable->ResponsableId;
        $cita->Responsable->UnidadNegocio = "null";
    }
    else if($cita->Responsable->UnidadNegocio)
    {
        $cita->Responsable->UnidadNegocio = $cita->Responsable->ResponsableId;
        $cita->Responsable->Colaborador = "null";
    }
    
    if($cita->Tarea->TareaCitaId != "1")
    {
        $cita->DireccionCitaId = "null";
    }

    $sql = "INSERT Cita (TareaCitaId, PersonaId, EstatusCitaId, ColaboradorId, UnidadNegocioId, ProyectoId, DireccionPersonaId, Asunto, Fecha, HoraInicio, HoraFin, Descripcion) VALUES 
    ('".$cita->Tarea->TareaCitaId."', '".$cita->Persona->PersonaId."', 2, ".$cita->Responsable->Colaborador.", ".$cita->Responsable->UnidadNegocio.", 
    null, ".$cita->DireccionCitaId.", '".$cita->Asunto."', STR_TO_DATE('".$cita->Fecha."', '%d-%m-%Y') , '".$cita->HoraInicio."', '".$cita->HoraFin."', '".$cita->Descripcion."')";
    
     try 
    {
        $stmt = $db->prepare($sql);
        $stmt->execute();
        
        $db->commit();
        $db = null;

        echo '[{"Estatus":"Exitoso"}]';
    } 
    catch(PDOException $e) 
    {
        echo $e;
        echo '[{"Cita": "Fallido"}]';
        $db->rollBack();
        $app->status(409);
        $app->stop();
    }
   
}

/*function EditarColor()
{
    global $app;
    $request = \Slim\Slim::getInstance()->request();
    $color = json_decode($request->getBody());
   
    $sql = "UPDATE Color SET Nombre='".$color->Nombre."', Activo = '".$color->Activo."'  WHERE ColorId=".$color->ColorId."";
    
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
}*/

function CambiarEstatusCita()
{
    global $app;
    $request = \Slim\Slim::getInstance()->request();
    $datos = json_decode($request->getBody());
    try 
    {
        $db = getConnection();
        
        $sql = "UPDATE Cita SET EstatusCitaId = ".$datos->EstatusCitaId." WHERE CitaId = ".$datos->CitaId."";
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

/*function GuardarImagenColor($id)
{
    global $app;
    $request = \Slim\Slim::getInstance()->request();
    $name = $_FILES['file']['tmp_name'];
    
    $imagen = addslashes(file_get_contents($_FILES['file']['tmp_name']));

    $sql = "UPDATE Color SET Imagen = '".$imagen."' WHERE ColorId= ".$id."";

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
        
        //echo $e;
        echo '[{"Estatus": "Fallido"}]';
        $app->status(409);
        $app->stop();
    }
}*/
    
?>
