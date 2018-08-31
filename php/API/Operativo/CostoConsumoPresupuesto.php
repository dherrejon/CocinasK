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
    $sql = "SELECT m.MaterialId, m.Nombre AS NombreMaterial, m.CostoUnidad, tm.Nombre AS NombreTipoMaterial, tm.TipoMaterialId
            FROM Material m
            INNER JOIN TipoMaterial tm ON tm.TipoMaterialId = m.TipoMaterialId
            WHERE MaterialDe = 'Módulo'";
    
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
        $in .= "".$presupuesto[$k].",";
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
        $sql = "SELECT c.ComponenteId, c.Nombre, cm.Cantidad
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
             $sql = "SELECT p.PiezaId, p.Nombre, p.FormulaAncho, p.FormulaLargo, pc.Cantidad
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
                           cm.MaterialId, cm.TipoMaterialId, cm.NombreMaterial, cm.NombreTipoMaterial
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
        $sql = "SELECT sm.SeccionModuloId, sm.NumeroPiezas, sm.PeinazoVertical,  s.Nombre,
                       l.Luz, l.NumeroEntrepano
                FROM SeccionPorModulo sm
                INNER JOIN LuzPorSeccion l ON l.SeccionPorModuloId = sm.SeccionPorModuloId
                INNER JOIN SeccionModulo s ON s.SeccionModuloId = sm.SeccionModuloId
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
        $sql = "SELECT pm.TipoParteId as ParteId, pm.Ancho, tp.Nombre
                FROM PartePorModulo pm
                INNER JOIN TipoParte tp ON tp.TipoParteId = pm.TipoParteId
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
    
    //--Puertas-- 
    $sql = "SELECT  p.NombreMuestrario as Muestrario, p.Nombre as Puerta, p.PuertaId, p.MuestrarioId
            FROM PuertaPresupuesto pp
            INNER JOIN PuertaVista p ON p.MuestrarioId = pp.MuestrarioId
            WHERE PresupuestoId IN (".$in.")
            GROUP BY p.PuertaId";
    
    try 
    {
        $db = getConnection();
        $stmt = $db->query($sql);
        $puerta = $stmt->fetchAll(PDO::FETCH_OBJ);
    } 
    catch(PDOException $e) 
    {
        echo $e;
        echo '[ { "Estatus": "Fallo" } ]';
        $app->status(409);
        $app->stop();
    }
    
    $countPuerta = count($puerta);
    
    for($k=0; $k<$countPuerta; $k++)
    {
        //Componente puerta
        $sql = "SELECT c.ComponenteId, c.Nombre, cp.ComponentePorPuertaId
                FROM Componente c
                INNER JOIN ComponentePorPuerta cp ON cp.ComponenteId = c.ComponenteId
                WHERE cp.PuertaId = ".$puerta[$k]->PuertaId;
        
        try 
        {
            $stmt = $db->query($sql);
            $componente = $stmt->fetchAll(PDO::FETCH_OBJ);
            $puerta[$k]->Componente = $componente;
        } 
        catch(PDOException $e) 
        {
            echo $e;
            echo '[ { "Estatus": "Fallo" } ]';
            $app->status(409);
            $app->stop();
        }
        
        $countComponentePuerta = count($puerta[$k]->Componente);
        
        for($i=0; $i<$countComponentePuerta; $i++)
        {
            //pieza componenete puerta
            $sql = "SELECT p.PiezaId, p.Nombre, p.FormulaAncho, p.FormulaLargo, pp.Cantidad
                    FROM Pieza p
                    INNER JOIN PiezaPorComponentePuerta pp ON pp.PiezaId = p.PiezaId
                    WHERE pp.ComponentePorPuertaId =  ".$puerta[$k]->Componente[$i]->ComponentePorPuertaId;
        
            try 
            {
                $stmt = $db->query($sql);
                $puerta[$k]->Componente[$i]->Pieza = $stmt->fetchAll(PDO::FETCH_OBJ);
            } 
            catch(PDOException $e) 
            {
                echo $e;
                echo '[ { "Estatus": "Fallo" } ]';
                $app->status(409);
                $app->stop();
            }
            
            //Combinacion componenete puerta
            $sql = "SELECT cm.CombinacionMaterialId, c.Nombre, cm.Grueso, 
                           cm.MaterialId, tm.TipoMaterialId, m.Nombre AS NombreMaterial , tm.Nombre AS NombreTipoMaterial
                    FROM CombinacionPorMaterialComponente cm
                    INNER JOIN Material m ON m.MaterialId = cm.MaterialId
                    INNER JOIN TipoMaterial tm ON tm.TipoMaterialId = m.TipoMaterialId
                    INNER JOIN CombinacionMaterial c ON c.CombinacionMaterialId = cm.CombinacionMaterialId
                    WHERE cm.ComponentePorPuertaId =  ".$puerta[$k]->Componente[$i]->ComponentePorPuertaId;
        
            try 
            {
                $stmt = $db->query($sql);
                $puerta[$k]->Componente[$i]->Combinacion = $stmt->fetchAll(PDO::FETCH_OBJ);
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
    
    
    //--Accesorios-- 
    $sql = "SELECT   SUM(ap.Cantidad) AS Cantidad, mp.MuestrarioAccesorioPresupuestoId,
		 a.Nombre, a.AccesorioId,  a.ConsumoUnidad, 
		 ta.TipoAccesorioId, ta.Nombre AS TipoAccesorio,
		 m.MuestrarioId, m.Nombre AS Muestrario, m.Margen
         FROM AccesorioPresupuesto ap
         INNER JOIN TipoAccesorio ta ON ta.TipoAccesorioId = ap.TipoAccesorioid
         INNER JOIN ClaseAccesorio ca ON ca.ClaseAccesorioId = ta.ClaseAccesorioId
         INNER JOIN MuestrarioAccesorioPresupuesto mp ON mp.AccesorioPresupuestoId = ap.AccesorioPresupuestoId
         INNER JOIN Muestrario m ON m.MuestrarioId = mp.MuestrarioId
         INNER JOIN Accesorio a  ON a.MuestrarioId = m.MuestrarioId
         WHERE ap.PresupuestoId IN (".$in.") AND ca.ClaseAccesorioId = 2
         GROUP BY a.AccesorioId";

    try 
    {
        $db = getConnection();
        $stmt = $db->query($sql);
        $accesorio = $stmt->fetchAll(PDO::FETCH_OBJ);
    } 
    catch(PDOException $e) 
    {
        echo $e;
        echo '[ { "Estatus": "Fallo" } ]';
        $app->status(409);
        $app->stop();
    }
    
    
    foreach($accesorio as $acc)
    {
        //Combinacion Accesorio
        $sql = "SELECT SUM(cma.PrecioVenta) AS PrecioVenta,
		ca.Grueso,
		cm.CombinacionMaterialId, cm.Nombre,
		m.MaterialId, m.Nombre AS Material
        FROM AccesorioPresupuesto ap
        INNER JOIN MuestrarioAccesorioPresupuesto mp ON mp.AccesorioPresupuestoId = ap.AccesorioPresupuestoId
        INNER JOIN CombinacionMuestrarioAccesorioPresupuesto cma ON cma.MuestrarioAccesorioPresupuestoId = mp.MuestrarioAccesorioPresupuestoId
        INNER JOIN CombinacionPorMaterialAccesorio ca ON ca.CombinacionMaterialId = cma.CombinacionMaterialId
        INNER JOIN CombinacionMaterial cm ON cm.CombinacionMaterialId = ca.CombinacionMaterialId
        INNER JOIN Material m ON m.MaterialId = ca.MaterialId
        WHERE ca.AccesorioId = ".$acc->AccesorioId." AND  ap.PresupuestoId IN (".$in.")
        GROUP BY cma.CombinacionMaterialId";
        
        try 
        {
            $stmt = $db->query($sql);
            $combinacion = $stmt->fetchAll(PDO::FETCH_OBJ);
            $acc->Combinacion = $combinacion;
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
    echo '{"modulo":'.json_encode($modulo).', "puerta":'.json_encode($puerta).', "accesorio":'.json_encode($accesorio).'}'; 
}

    
?>
