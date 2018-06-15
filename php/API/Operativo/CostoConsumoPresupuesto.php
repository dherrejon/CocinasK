<?php
	
function GetCatalogosCostoConsumo()
{
    $request = \Slim\Slim::getInstance()->request();
    $presupuesto = json_decode($request->getBody());
    global $app;

    
    //-- Combinación --
    //$sql = "SELECT CombinacionMaterialId, Nombre FROM CombinacionMaterial WHERE Activo = 1";
    $count = count($presupuesto);
    $in = "";
    for($k=0; $k<$count; $k++)
    {
        $in .= "'".$presupuesto[$k]."',";
    }
    
    $in = trim($in, ",");
    
    $sql = "SELECT CombinacionMaterialId, Nombre FROM CombinacionMaterialPorPresupuestoVista WHERE PresupuestoId IN (".$in.") GROUP BY CombinacionMaterialId";
    
    try 
    {
        $db = getConnection();
        $stmt = $db->query($sql);
        $combinacion = $stmt->fetchAll(PDO::FETCH_OBJ);
        
    } 
    catch(PDOException $e) 
    {
        echo $e;
        echo '[ { "Estatus": "Fallo" } ]';
        $app->status(409);
        $app->stop();
    }
    
    //-- Material --
    $sql = "SELECT MaterialId, Nombre, CostoUnidad FROM Material WHERE MaterialDe = 'Módulo'";
    
    try 
    {
        $stmt = $db->query($sql);
        $material = $stmt->fetchAll(PDO::FETCH_OBJ);
        
        $countMaterial = count($material);
        
        //-- Grueso costo
        for($k=0; $k<$countMaterial; $k++)
        {
            $sql = "SELECT GruesoMaterialId, Grueso, CostoUnidad FROM GruesoMaterial WHERE MaterialId = ".$material[$k]->MaterialId;
            
            try 
            {
                $stmt = $db->query($sql);
                $material[$k]->Grueso = $stmt->fetchAll(PDO::FETCH_OBJ);
            } 
            catch(PDOException $e) 
            {
                echo $e;
                echo '[ { "Estatus": "Fallo" } ]';
                $app->status(409);
                $app->stop();
            }
        }
    } 
    catch(PDOException $e) 
    {
        echo $e;
        echo '[ { "Estatus": "Fallo" } ]';
        $app->status(409);
        $app->stop();
    }
    
    
    
    $app->status(200);
    $db = null;
    echo '{"combinacion":'.json_encode($combinacion).', "material":'.json_encode($material).'} '; 
}

function GetModuloPresupuestoCostoConsumo()
{
    $request = \Slim\Slim::getInstance()->request();
    $presupuesto = json_decode($request->getBody());
    global $app;

    //-- presupuestos --
    $count = count($presupuesto);
    $in = "";
    for($k=0; $k<$count; $k++)
    {
        $in .= "'".$presupuesto[$k]."',";
    }
    
    $in = trim($in, ",");
    //-- modulos --
    $sql = "SELECT mp.ModuloId, mp.Ancho, mp.Alto, mp.Profundo, SUM(mp.Cantidad) AS Cantidad,
		           m.Nombre, m.TipoModuloId, m.Margen, m.NumeroSeccion, m.Desperdicio, m.NombreTipoModulo
            FROM ModuloPresupuesto mp
            INNER JOIN ModuloVista m ON m.ModuloId = mp.ModuloId
            WHERE PresupuestoId IN (".$in.")
            GROUP BY mp.ModuloId, mp.Ancho, mp.Alto, mp.Profundo";
    
    try 
    {
        $db = getConnection();
        $stmt = $db->query($sql);
        $modulo = $stmt->fetchAll(PDO::FETCH_OBJ);
    } 
    catch(PDOException $e) 
    {
        echo $e;
        echo '[ { "Estatus": "Fallo" } ]';
        $app->status(409);
        $app->stop();
    }
    
    
    //ComponenteEspecial
    $frentemodulo = new stdClass();
    $frentemodulo->Nombre = "Frente Módulo";
    $frentemodulo->ComponenteId = "1";

    $entrepano = new stdClass();
    $entrepano->Nombre = "Entrepaño";
    $entrepano->ComponenteId = "9";
    
    
    $countmodulo = count($modulo);
    
    for($k=0; $k<$countmodulo; $k++)
    {
        //componenteEspecial
        $modulo[$k]->ComponenteEspecial = array();
        array_push($modulo[$k]->ComponenteEspecial, $frentemodulo);
        array_push($modulo[$k]->ComponenteEspecial, $entrepano);
        
        //Componente
        $sql = "SELECT c.ComponenteId, c.Nombre
                FROM Componente c
                INNER JOIN ComponentePorModulo cm ON cm.ComponenteId = c.ComponenteId
                WHERE cm.ModuloId = ".$modulo[$k]->ModuloId;
        
        try 
        {
            $stmt = $db->query($sql);
            $componente = $stmt->fetchAll(PDO::FETCH_OBJ);
            $modulo[$k]->Componente = $componente;
        } 
        catch(PDOException $e) 
        {
            echo $e;
            echo '[ { "Estatus": "Fallo" } ]';
            $app->status(409);
            $app->stop();
        }
        
        $countcomponente = count($componente);
        
        //piezas
        for($i=0; $i<$countcomponente; $i++)
        {
             $sql = "SELECT p.PiezaId, p.Nombre, p.FormulaAncho, p.FormulaLargo
                    FROM Pieza p
                    INNER JOIN PiezaPorComponente pc ON pc.PiezaId = p.PiezaId
                    WHERE pc.ComponenteId = ".$componente[$i]->ComponenteId;
        
            try 
            {
                $stmt = $db->query($sql);
                $modulo[$k]->Componente[$i]->Pieza = $stmt->fetchAll(PDO::FETCH_OBJ);
            } 
            catch(PDOException $e) 
            {
                echo $e;
                echo '[ { "Estatus": "Fallo" } ]';
                $app->status(409);
                $app->stop();
            }
        }
        
        //Combinacion del componente
        for($i=0; $i<$countcomponente; $i++)
        {
            $sql = "SELECT cm.CombinacionMaterialId, cm.Nombre, cm.Grueso, 
                           cm.MaterialId, cm.TipoMaterialId, cm.NombreMaterial 
                    FROM CombinacionMaterialVista cm
                    WHERE cm.ComponenteId = ".$componente[$i]->ComponenteId;
        
            try 
            {
                $stmt = $db->query($sql);
                $modulo[$k]->Componente[$i]->Combinacion = $stmt->fetchAll(PDO::FETCH_OBJ);
            } 
            catch(PDOException $e) 
            {
                echo $e;
                echo '[ { "Estatus": "Fallo" } ]';
                $app->status(409);
                $app->stop();
            }
        }
        
        //Combinacion del componente ESPECIAL
        $countcomponenteespecial = count($modulo[$k]->ComponenteEspecial );
        for($i=0; $i<$countcomponenteespecial; $i++)
        {
            $sql = "SELECT cm.CombinacionMaterialId, cm.Nombre, cm.Grueso, 
                           cm.MaterialId, cm.TipoMaterialId, cm.NombreMaterial 
                    FROM CombinacionMaterialVista cm
                    WHERE cm.ComponenteId = ".$modulo[$k]->ComponenteEspecial[$i]->ComponenteId;
        
            try 
            {
                $stmt = $db->query($sql);
                $modulo[$k]->ComponenteEspecial[$i]->Combinacion = $stmt->fetchAll(PDO::FETCH_OBJ);
            } 
            catch(PDOException $e) 
            {
                echo $e;
                echo '[ { "Estatus": "Fallo" } ]';
                $app->status(409);
                $app->stop();
            }
        }
        
        //consumible
        $sql = "SELECT c.ConsumibleId, c.Nombre, c.Costo, cm.Cantidad
                FROM Consumible c
                INNER JOIN ConsumiblePorModulo cm ON cm.ConsumibleId = c.ConsumibleId 
                WHERE ModuloId = ".$modulo[$k]->ModuloId;
        
        try 
        {
            $stmt = $db->query($sql);
            $modulo[$k]->Consumible = $stmt->fetchAll(PDO::FETCH_OBJ);
        } 
        catch(PDOException $e) 
        {
            echo $e;
            echo '[ { "Estatus": "Fallo" } ]';
            $app->status(409);
            $app->stop();
        }
        
        //Seccion 
        $sql = "SELECT sm.SeccionModuloId, sm.NumeroPiezas, sm.PeinazoVertical,
                       l.Luz, l.NumeroEntrepano
                FROM SeccionPorModulo sm
                INNER JOIN LuzPorSeccion l ON l.SeccionPorModuloId = sm.SeccionPorModuloId
                WHERE sm.ModuloId = ".$modulo[$k]->ModuloId." AND l.AltoModulo = '".$modulo[$k]->Alto."'";
        
        try 
        {
            $stmt = $db->query($sql);
            $modulo[$k]->Seccion = $stmt->fetchAll(PDO::FETCH_OBJ);
        } 
        catch(PDOException $e) 
        {
            echo $e;
            echo '[ { "Estatus": "Fallo" } ]';
            $app->status(409);
            $app->stop();
        }
        
        //Parte 
        $sql = "SELECT pm.TipoParteId, pm.Ancho
                FROM PartePorModulo pm
                WHERE pm.ModuloId = ".$modulo[$k]->ModuloId;
        
        try 
        {
            $stmt = $db->query($sql);
            $modulo[$k]->Parte = $stmt->fetchAll(PDO::FETCH_OBJ);
        } 
        catch(PDOException $e) 
        {
            echo $e;
            echo '[ { "Estatus": "Fallo" } ]';
            $app->status(409);
            $app->stop();
        }
    }    
    
    $app->status(200);
    $db = null;
    echo '{"modulo":'.json_encode($modulo).'} '; 
}

    
?>
