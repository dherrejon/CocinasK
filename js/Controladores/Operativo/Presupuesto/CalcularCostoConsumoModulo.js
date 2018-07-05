function CalcularCostoConsumoModulo(modulo, combinacion, material)
{   
    SetDatosModulo(modulo);
    SetParte(modulo.Parte, modulo.AnchoNumero, modulo.AltoNumero);
    
    //Costo Consumible
    modulo.CostoConsumible = 0;
    
    for(var k=0; k<modulo.Consumible.length; k++)
    {
        modulo.CostoConsumible += (parseFloat(modulo.Consumible[k].Costo)*parseInt(modulo.Consumible[k].Cantidad));
    }
    
    //consumo frente módulo
    var ConsumoFrente = 0;
    for(var k=0; k<modulo.Parte.length; k++)
    {
        ConsumoFrente += ((modulo.Parte[k].Ancho * modulo.Parte[k].Largo)/144.0);
    }
    
    for(var k=0; k<modulo.PeinazoVertical.length; k++)
    {
        ConsumoFrente += ((modulo.PeinazoVertical[k].Ancho * modulo.PeinazoVertical[k].Largo * modulo.PeinazoVertical[k].Cantidad)/144.0);
    }
    
    for(var k=0; k<modulo.ComponenteEspecial.length; k++)
    {
        if(modulo.ComponenteEspecial[k].ComponenteId == "1") //consumo frente mdulo
        {
            modulo.ComponenteEspecial[k].Consumo = ConsumoFrente;
            
            break;
        }
    }
    
    /*----------- No importa el grueso del material (no cambia por combinación) [medidas del módulo y de las partes]--------------------*/
    for(var i=0; i<modulo.Componente.length; i++)
    {
        for(var j=0; j<modulo.Componente[i].Pieza.length; j++)
        {
            // sustituir Modulo
            modulo.Componente[i].Pieza[j].FormulaAncho = SustituirModulo(modulo.Componente[i].Pieza[j].FormulaAncho, modulo.AnchoNumero, modulo.AltoNumero, modulo.ProfundoNumero);
            modulo.Componente[i].Pieza[j].FormulaLargo = SustituirModulo(modulo.Componente[i].Pieza[j].FormulaLargo, modulo.AnchoNumero, modulo.AltoNumero, modulo.ProfundoNumero);
        
            modulo.Componente[i].Pieza[j].Ancho = EvaluarFormula(modulo.Componente[i].Pieza[j].FormulaAncho);
            modulo.Componente[i].Pieza[j].Largo = EvaluarFormula(modulo.Componente[i].Pieza[j].FormulaLargo);
            
            //SustituirParte
            SustituirParte(modulo.Componente[i].Pieza[j], modulo.Parte);            
        }
    }
    
    /*------------ Importa el grueso del material (cambia por combinación)---------------*/
    modulo.Combinacion = [];
    
    for(var k=0; k<combinacion.length; k++)
    {
        if(combinacion[k].Ver)
        {
            SustituirFormulaCompleta(modulo, combinacion[k].CombinacionMaterialId); //componente y pieza
            CalcularConsumoCostoModulo(modulo, combinacion[k].CombinacionMaterialId);
        }
    }
}


function CalcularConsumoCostoModulo(modulo, combinacion)
{
    var CostoTotal = 0;
    var consumoTotal = 0;
    var PrecioVenta = 0;
    
    for(var i=0; i<modulo.Componente.length; i++)
    {
        consumoTotal = 0;
        
        for(var j=0; j<modulo.Componente[i].Pieza.length; j++)
        {
            consumoTotal += (modulo.Componente[i].Pieza[j].nAncho * modulo.Componente[i].Pieza[j].nLargo * parseInt(modulo.Componente[i].Pieza[j].Cantidad)/144.0);
        }
        
        consumoTotal = consumoTotal*parseInt(modulo.Componente[i].Cantidad);
        
        for(var j=0; j<modulo.Componente[i].Combinacion.length; j++)
        {
            if(modulo.Componente[i].Combinacion[j].CombinacionMaterialId == combinacion)
            {
                modulo.Componente[i].Combinacion[j].Consumo = consumoTotal;
                modulo.Componente[i].Combinacion[j].ConsumoDesperdicio =  modulo.Componente[i].Combinacion[j].Consumo + ( modulo.Componente[i].Combinacion[j].Consumo*(modulo.Desperdicio/100));
                CostoTotal += (consumoTotal * parseFloat(modulo.Componente[i].Combinacion[j].Costo));
                break;
            }
        }
    }

    for(var i=0; i<modulo.ComponenteEspecial.length; i++)
    {
        for(var j=0; j<modulo.ComponenteEspecial[i].Combinacion.length; j++)
        {
            if(modulo.ComponenteEspecial[i].Combinacion[j].CombinacionMaterialId == combinacion)
            {
                modulo.ComponenteEspecial[i].Combinacion[j].Consumo = modulo.ComponenteEspecial[i].Consumo;
                modulo.ComponenteEspecial[i].Combinacion[j].ConsumoDesperdicio = modulo.ComponenteEspecial[i].Consumo + (modulo.ComponenteEspecial[i].Consumo*(modulo.Desperdicio/100));
                CostoTotal += (modulo.ComponenteEspecial[i].Consumo * parseFloat(modulo.ComponenteEspecial[i].Combinacion[j].Costo));

                break;
            }
        }
    }
    
    var CostoDesperdicio  = CostoTotal + (CostoTotal*(modulo.Desperdicio/100));
    var CostoConsumible = CostoDesperdicio + modulo.CostoConsumible;
    var CostoMargen = CostoConsumible + (CostoConsumible * (modulo.Margen/100));
    
    combinacion = {CombinacionMaterialId: combinacion, Costo: CostoTotal, CostoDesperdicio: CostoDesperdicio, CostoConsumible: CostoConsumible, CostoMargen: CostoMargen};
    
    modulo.Combinacion.push(combinacion);
    
    //CostoTotal+= modulo.CostoConsumible;
    //PrecioVenta = CostoTotal + (CostoTotal * (modulo.Margen/100));
    //PrecioVenta *= modulo.Cantidad;
}