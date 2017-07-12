<?php

function GetUnidadNegocio()
{
    global $app;
    global $session_expiration_time;

    $request = \Slim\Slim::getInstance()->request();

    $sql = "SELECT * FROM VistaUnidadNegocio";

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

function AgregarUnidadNegocio()
{
    $request = \Slim\Slim::getInstance()->request();
        $nuevaUnidad = json_decode($request->getBody());
        global $app;
        $sql = "INSERT INTO UnidadNegocio (TipoUnidadNegocioId, EmpresaId, Nombre, Telefono, ColaboradorId, Domicilio, Codigo, Estado, Municipio, Ciudad, Colonia, PaisId, Activo) 
        VALUES(:TipoUnidadNegocioId, :EmpresaId, :Nombre, :Telefono, :ColaboradorId, :Domicilio, :Codigo, :Estado, :Municipio, :Ciudad, :Colonia, :PaisId, :Activo)";
 
        try 
        {
            $db = getConnection();
            $stmt = $db->prepare($sql);

            $stmt->bindParam("TipoUnidadNegocioId", $nuevaUnidad->TipoUnidadNegocio->TipoUnidadNegocioId);
            $stmt->bindParam("EmpresaId", $nuevaUnidad->Empresa->EmpresaId);
            $stmt->bindParam("Nombre", $nuevaUnidad->Nombre);
            $stmt->bindParam("Telefono", $nuevaUnidad->Telefono);
            $stmt->bindParam("ColaboradorId", $nuevaUnidad->ColaboradorId);
            $stmt->bindParam("Domicilio", $nuevaUnidad->Domicilio);
            $stmt->bindParam("Codigo", $nuevaUnidad->Codigo);
            $stmt->bindParam("Estado", $nuevaUnidad->Estado);
            $stmt->bindParam("Municipio", $nuevaUnidad->Municipio);
            $stmt->bindParam("Ciudad", $nuevaUnidad->Ciudad);
            $stmt->bindParam("Colonia", $nuevaUnidad->Colonia);
            $stmt->bindParam("PaisId", $nuevaUnidad->Pais->PaisId);
            $stmt->bindParam("Activo", $nuevaUnidad->Activo);
            
            $stmt->execute();
            
            //$userId = $db->lastInsertId();
            $db = null;
            echo '[{"Estatus": "Exitoso"}]';
            
        } catch(PDOException $e) 
        {
            echo $e;
        }
}

function EditarUnidadNegocio()
{
    global $app;
    $request = \Slim\Slim::getInstance()->request();
    $nuevaUnidad = json_decode($request->getBody());
   
    $sql = "UPDATE UnidadNegocio SET TipoUnidadNegocioId='".$nuevaUnidad->TipoUnidadNegocio->TipoUnidadNegocioId."', EmpresaId='".$nuevaUnidad->Empresa->EmpresaId."',  Nombre = '".$nuevaUnidad->Nombre."', Telefono = '".$nuevaUnidad->Telefono."', 
            ColaboradorId = '".$nuevaUnidad->ColaboradorId."', Domicilio = '".$nuevaUnidad->Domicilio."', Codigo = '".$nuevaUnidad->Codigo."', Estado = '".$nuevaUnidad->Estado."', Municipio = '".$nuevaUnidad->Municipio."', Ciudad = '".$nuevaUnidad->Ciudad."',
            Colonia = '".$nuevaUnidad->Colonia."', PaisId = '".$nuevaUnidad->Pais->PaisId."', Activo = '".$nuevaUnidad->Activo."'  WHERE UnidadNegocioId=".$nuevaUnidad->UnidadNegocioId."";
    
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
        $app->status(409);
        $app->stop();
    }
}

function ActivarDesactivarUnidad()
{
    global $app;
    $request = \Slim\Slim::getInstance()->request();
    $datos = json_decode($request->getBody());
    try 
    {
        $db = getConnection();
        
        $sql = "UPDATE UnidadNegocio SET Activo = ".$datos[0]." WHERE UnidadNegocioId = ".$datos[1]."";
        $stmt = $db->prepare($sql);
        $stmt->execute();
        

        $db = null;
        echo '[{"renglones":'. $stmt->rowCount() .'}]';
    }
    catch(PDOException $e) {
        echo ($e);
        $app->status(409);
        $app->stop();
    }
}

//obtiene los datos basicos de los colaboradores para seleccionarlos como responsable de una unidad de negocio
function GetResponsable()
{
    global $app;
    global $session_expiration_time;

    $request = \Slim\Slim::getInstance()->request();

    $sql = "SELECT CONCAT(c.PrimerApellido, ' ', c.SegundoApellido, ' ', c.Nombre) AS Nombre, c.ColaboradorId, c.UnidadNegocioId FROM Colaborador c WHERE Activo = 1";

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

//obtiene las unidades de negocio pero solamente con sus datos escenciales
function GetUnidadNegocioSencilla()
{
    global $app;
    global $session_expiration_time;

    $request = \Slim\Slim::getInstance()->request();

    $sql = "SELECT u.Nombre, u.UnidadNegocioId, tu.Nombre as NombreTipoUnidadNegocio FROM UnidadNegocio u, TipoUnidadNegocio tu WHERE tu.TipoUnidadNegocioId = u.TipoUnidadNegocioId AND u.Activo=1";

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


function GetUnidadNegocioSencillaPresupuesto()
{
    global $app;
    global $session_expiration_time;

    $request = \Slim\Slim::getInstance()->request();

    $sql = "SELECT u.Nombre, u.UnidadNegocioId, u.Activo, tu.Nombre as NombreTipoUnidadNegocio, x.Margen
    FROM TipoUnidadNegocio tu, UnidadNegocio u

    INNER JOIN (

    SELECT p.Ciudad, p.Municipio, p.Estado, t.Margen
    FROM Plaza p
    INNER JOIN Territorio t ON t.TerritorioId = p.TerritorioId
    ) x ON u.Estado = x.Estado AND u.Ciudad = x.Ciudad AND u.Municipio = x.Municipio


    WHERE tu.TipoUnidadNegocioId = u.TipoUnidadNegocioId";

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

/* -------------------------- Tipo Unidad Negocio ------------------------- */
function GetTipoUnidadNegocio()
{
    global $app;
    global $session_expiration_time;

    $request = \Slim\Slim::getInstance()->request();

    $sql = "SELECT * FROM TipoUnidadNegocio";

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

function AgregarTipoUnidadNegocio()
{
    $request = \Slim\Slim::getInstance()->request();
        $nuevoTipoUnidad = json_decode($request->getBody());
        global $app;
        $sql = "INSERT INTO TipoUnidadNegocio (Nombre, Activo) VALUES(:Nombre, :Activo)";
 
        try 
        {
            $db = getConnection();
            $stmt = $db->prepare($sql);

            $stmt->bindParam("Nombre", $nuevoTipoUnidad->Nombre);
            $stmt->bindParam("Activo", $nuevoTipoUnidad->Activo);
            
            $stmt->execute();
            
            //$userId = $db->lastInsertId();
            $db = null;
            echo '[{"Estatus": "Exitoso"}]';
            
        } catch(PDOException $e) 
        {
            echo '[{"Estatus": "Fallido"}]';
        }
}

function EditarTipoUnidadNegocio()
{
    global $app;
    $request = \Slim\Slim::getInstance()->request();
    $nuevoTipoUnidad = json_decode($request->getBody());
   
    $sql = "UPDATE TipoUnidadNegocio SET Nombre='".$nuevoTipoUnidad->Nombre."', Activo = '".$nuevoTipoUnidad->Activo."'  WHERE TipoUnidadNegocioId=".$nuevoTipoUnidad->TipoUnidadNegocioId."";
    
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
        //echo ($e);
        echo '[{"Estatus": "Fallido"}]';
        $app->status(409);
        $app->stop();
    }
}

function ActivarDesactivarTipoUnidadNegocio()
{
    global $app;
    $request = \Slim\Slim::getInstance()->request();
    $datos = json_decode($request->getBody());
    try 
    {
        $db = getConnection();
        
        $sql = "UPDATE TipoUnidadNegocio SET Activo = ".$datos[0]." WHERE TipoUnidadNegocioId = ".$datos[1]."";
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


/* -------------------------- Empresa ------------------------- */
function GetEmpresa()
{
    global $app;
    global $session_expiration_time;

    $request = \Slim\Slim::getInstance()->request();

    $sql = "SELECT e.*, p.Nombre as NombrePais FROM Empresa e, Pais p WHERE p.PaisId = e.PaisId";

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

function AgregarEmpresa()
{
    $request = \Slim\Slim::getInstance()->request();
        $nuevaEmpresa = json_decode($request->getBody());
        global $app;
        $sql = "INSERT INTO Empresa (PaisId, Nombre, RFC, email, Domicilio, Estado, Municipio, Ciudad, Colonia, Codigo, Activo) 
                VALUES(:PaisId, :Nombre, :RFC, :email, :Domicilio, :Estado, :Municipio, :Ciudad, :Colonia, :Codigo, :Activo)";
 
        try 
        {
            $db = getConnection();
            $stmt = $db->prepare($sql);
            
            $stmt->bindParam("PaisId", $nuevaEmpresa->Pais->PaisId);
            $stmt->bindParam("Nombre", $nuevaEmpresa->Nombre);
            $stmt->bindParam("RFC", $nuevaEmpresa->RFC);
            $stmt->bindParam("email", $nuevaEmpresa->email);
            $stmt->bindParam("Domicilio", $nuevaEmpresa->Domicilio);
            $stmt->bindParam("Estado", $nuevaEmpresa->Estado);
            $stmt->bindParam("Municipio", $nuevaEmpresa->Municipio);
            $stmt->bindParam("Ciudad", $nuevaEmpresa->Ciudad);
            $stmt->bindParam("Colonia", $nuevaEmpresa->Colonia);
            $stmt->bindParam("Codigo", $nuevaEmpresa->Codigo);
            $stmt->bindParam("Activo", $nuevaEmpresa->Activo);
            
            $stmt->execute();
            
            //$userId = $db->lastInsertId();
            $db = null;
            echo '[{"Estatus": "Exitoso"}]';
            
        } catch(PDOException $e) 
        {
            echo $e;
            //echo '[{"Estatus": "Fallido"}]';
        }
}

function EditarEmpresa()
{
    global $app;
    $request = \Slim\Slim::getInstance()->request();
    $nuevaEmpresa = json_decode($request->getBody());
   
    $sql = "UPDATE Empresa SET PaisId='".$nuevaEmpresa->Pais->PaisId."',  Nombre='".$nuevaEmpresa->Nombre."', RFC='".$nuevaEmpresa->RFC."', email='".$nuevaEmpresa->email."', 
            Domicilio='".$nuevaEmpresa->Domicilio."', Estado='".$nuevaEmpresa->Estado."', Municipio ='".$nuevaEmpresa->Municipio."', Ciudad='".$nuevaEmpresa->Ciudad."', 
            Codigo='".$nuevaEmpresa->Codigo."', Colonia='".$nuevaEmpresa->Colonia."', Activo = '".$nuevaEmpresa->Activo."' WHERE EmpresaId=".$nuevaEmpresa->EmpresaId."";
    
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
        //echo ($e);
        echo '[{"Estatus": "Fallido"}]';
        $app->status(409);
        $app->stop();
    }
}

function ActivarDesactivarEmpresa()
{
    global $app;
    $request = \Slim\Slim::getInstance()->request();
    $datos = json_decode($request->getBody());

    try 
    {
        $db = getConnection();
        
        $sql = "UPDATE Empresa SET Activo = ".$datos[0]." WHERE EmpresaId = ".$datos[1]."";
        $stmt = $db->prepare($sql);
        $stmt->execute();
        

        $db = null;
        echo '[{"Estatus":"Exito"}]';
    }
    catch(PDOException $e) 
    {
        //echo ($e);
        echo '[{"Estatus":"Fallo"}]';
        $app->status(409);
        $app->stop();
    }
}

?>