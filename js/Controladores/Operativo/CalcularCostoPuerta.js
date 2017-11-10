function CalcularCostoPuerta(muestrario, modulo, combinacion, margePresupuesto, iva)
{
    var puerta;
    var precio;
    var precioPuerta;
    
    for(var j=0; j<muestrario.length; j++)
    {
        if(muestrario[j].PorDefecto)
        {    
            for(var m=0; m<muestrario[j].Puerta.length; m++)
            {
                CalcularConsumoPuerta(muestrario[j].Puerta[m], modulo[0]);
            }
            
            
            muestrario[j].Combinacion = [];
            
            for(var i=0; i<combinacion.length; i++)
            {
                if(combinacion[i].PorDefecto && combinacion[i].Activo)
                {
                    var im = muestrario[j].Combinacion.length; //index de la combinacion del muestrario;
                    muestrario[j].Combinacion[im] = new Object();
                    
                    muestrario[j].Combinacion[im].CombinacionMaterialId = combinacion[i].CombinacionMaterialId;
                    muestrario[j].Combinacion[im].Nombre = combinacion[i].Nombre;
                    
                    muestrario[j].Combinacion[im].PrecioVenta = 0;
                    puerta = 0;
                    precio = 0;
                    
                    //Obtener la puerta con el precio más alto del muestrario
                    for(var m=0; m<muestrario[j].Puerta.length; m++)
                    {
                        if(muestrario[j].Puerta[m].Activo)
                        {
                            precioPuerta = CalcularPrecioVentaPuerta(muestrario[j].Puerta[m], combinacion[i].CombinacionMaterialId, modulo[0]);
                            if(precio < precioPuerta)
                            {
                                precio = precioPuerta;
                                puerta = m;
                            }
                        }
                    }
                    
                    muestrario[j].Combinacion[im].PrecioVenta  = precio;
                    muestrario[j].Combinacion[im].Puerta = puerta;
                }
            }
        }
    }
    
    for(var j=0; j<muestrario.length; j++)
    {
        if(muestrario[j].PorDefecto && muestrario[j].Activo)
        {    
            for(var i=0; i<muestrario[j].Combinacion.length; i++)
            {

                for(var k=1; k<modulo.length; k++)
                {
                    CalcularConsumoPuerta(muestrario[j].Puerta[puerta], modulo[k]);

                    muestrario[j].Combinacion[i].PrecioVenta  += CalcularPrecioVentaPuerta(muestrario[j].Puerta[puerta], muestrario[j].Combinacion[i].CombinacionMaterialId, modulo[k]);
                }   
                
                muestrario[j].Combinacion[i].PrecioVenta += ((muestrario[j].Combinacion[i].PrecioVenta*margePresupuesto)/100);
                muestrario[j].Combinacion[i].PrecioVenta += ((muestrario[j].Combinacion[i].PrecioVenta*iva)/100);
                muestrario[j].Combinacion[i].PrecioVenta = Math.round(muestrario[j].Combinacion[i].PrecioVenta);
            }
        }
    }

}

function CalcularPrecioVentaPuerta(puerta, combinacion, modulo)
{
    var PrecioVenta = 0;
    var CostoTotal = 0;
    var consumoTotal = 0;
    
    for(var k=0; k<puerta.Componente.length; k++)
    {
        for(var i=0; i<puerta.Componente[k].Combinacion.length; i++)
        {
            if(puerta.Componente[k].Combinacion[i].CombinacionMaterialId == combinacion)
            {
                consumoTotal = puerta.Componente[k].Consumo + (puerta.Componente[k].Consumo * (modulo.Desperdicio/100.0));
                CostoTotal += consumoTotal * parseFloat(puerta.Componente[k].Combinacion[i].CostoUnidad);
                break;
            }
        }
    }
    
    PrecioVenta = (CostoTotal + (CostoTotal * (modulo.Margen/100.0))) * parseInt(modulo.Cantidad);
    
    return Math.round(PrecioVenta);
    
}

function CalcularConsumoPuerta(puerta, modulo)
{
    for(var k=0; k<modulo.Seccion.length; k++)
    {
        var componenteSeccion = [];
        
        for(var i=0; i<puerta.Componente.length; i++)
        {
            var componenteValido = false;
            switch(modulo.Seccion[k].SeccionModuloId)
            {
                case "1":
                    if(puerta.Componente[i].Nombre.includes("Puerta"))
                    {
                        componenteValido = true;
                    }
                    break;
                    
                case "2":
                    if(puerta.Componente[i].Nombre.includes("Cajón"))
                    {
                        componenteValido = true;
                    }
                    break;
                    
                default:
                    break;
            } 
            
            if(componenteValido)
            {
                SustituirValoresPieza(puerta.Componente[i], modulo, k);
                componenteSeccion.push(puerta.Componente[i]);
            }
        }
        
        for(var i=0; i<componenteSeccion.length; i++)
        {
            SustituirFormulaPieza(componenteSeccion[i], componenteSeccion);
            
            var consumo = 0;
            for(var j=0; j<componenteSeccion[i].Pieza.length; j++)
            {
                consumo += (componenteSeccion[i].Pieza[j].nAncho*componenteSeccion[i].Pieza[j].nLargo/144.0)*parseInt(componenteSeccion[i].Pieza[j].Cantidad);
            }
            
            for(var j=0; j<puerta.Componente.length; j++)
            {
                if(puerta.Componente[j].ComponenteId == componenteSeccion[i].ComponenteId)
                {
                    puerta.Componente[j].Consumo = consumo*parseInt(modulo.Seccion[k].NumeroPiezas); 
                    break;
                }
            }
            
            

            /*for(var j=0; j<componenteSeccion[i].Combinacion.length; j++)
            {
                if(combinacion == componenteSeccion[i].Combinacion[j].CombinacionMaterialId)
                {
                    costo = consumo * parseFloat(componenteSeccion[i].Combinacion[j].CostoUnidad);
                    break;
                }
            }*/
        }
    }

}

function SustituirValoresPieza(componente, modulo, indMod)
{
    
    for(var k=0; k<componente.Pieza.length; k++)
    {
        //Modulo
        componente.Pieza[k].nFormulaAncho = SustituirModulo(componente.Pieza[k].FormulaAncho, modulo.AnchoNumero, modulo.AltoNumero, modulo.ProfundoNumero);
        componente.Pieza[k].nFormulaLargo = SustituirModulo(componente.Pieza[k].FormulaLargo, modulo.AnchoNumero, modulo.AltoNumero, modulo.ProfundoNumero);
        
        componente.Pieza[k].nAncho = EvaluarFormula(componente.Pieza[k].nFormulaAncho);
        componente.Pieza[k].nLargo = EvaluarFormula(componente.Pieza[k].nFormulaLargo);
        
        //Puerta
        if(componente.Pieza[k].nAncho < 0)
        {
            componente.Pieza[k].nFormulaAncho = SustituirPuerta(componente.Pieza[k].nFormulaAncho, modulo.Seccion[indMod].Ancho, modulo.Seccion[indMod].Alto);
            componente.Pieza[k].nAncho = EvaluarFormula(componente.Pieza[k].nFormulaAncho);
        }
        if(componente.Pieza[k].nLargo < 0)
        {
            componente.Pieza[k].nFormulaLargo = SustituirPuerta(componente.Pieza[k].nFormulaLargo, modulo.Seccion[indMod].Ancho, modulo.Seccion[indMod].Alto);
            componente.Pieza[k].nLargo = EvaluarFormula(componente.Pieza[k].nFormulaLargo);
        }
        
    }    
}

function SustituirFormulaPieza(componente, componenteSeccion)
{
    for(var k=0; k<componente.Pieza.length; k++)
    {
        //Pieza
        if(componente.Pieza[k].nAncho < 0)
        {
            componente.Pieza[k].nAncho = SustituirValorPiezaPuerta(componente.Pieza[k].nFormulaAncho, componenteSeccion);
        }
        if(componente.Pieza[k].nLargo < 0)
        {
            componente.Pieza[k].nLargo = SustituirValorPiezaPuerta(componente.Pieza[k].nFormulaLargo, componenteSeccion);
        }
    }
}

function SustituirPuerta(formula, ancho, alto)
{
    var nFormula = formula;
    
    if(formula.includes("[Puerta][Ancho]"))
    {
        nFormula =  nFormula.replace(/\[Puerta\]\[Ancho\]/g, ancho);
    }
    
    if(formula.includes("[Puerta][Alto]"))
    {
        nFormula =  nFormula.replace(/\[Puerta\]\[Alto\]/g, alto);
    }

    return nFormula;
}

function SustituirValorPiezaPuerta(formula, componentePuerta)
{   
    var piezaId;
    var medidaPieza;

    var index = formula.indexOf("[Pieza]");
    

    while(index > -1)
    {
        piezaId = "";
        medidaPieza = "";

        for(var j=index+8; j<formula.length; j++)
        {
            piezaId += formula[j];
            if(formula[j+1] == "]")
            {
                index = j+1;
                break;
            }
        }

        for(var j=index+2; j<formula.length; j++)
        {
            medidaPieza += formula[j];
            if(formula[j+1] == "]")
            {
                break;
            }
        }
        
        var medida = "[Pieza][" + piezaId + "][" + medidaPieza + "]";
        
        for(var m=0; m<componentePuerta.length; m++)
        {
            for(var j=0; j<componentePuerta[m].Pieza.length; j++)
            {
                //console.log(componentePuerta[m].Pieza[j]);
                if(componentePuerta[m].Pieza[j].PiezaId == piezaId)
                {

                    if(medidaPieza == "Largo")
                    {
                        if(componentePuerta[m].Pieza[j].nLargo > -1)
                        {
                            formula = formula.replace(medida, componentePuerta[m].Pieza[j].nLargo);
                        }
                        else
                        {
                            componentePuerta[m].Pieza[j].nLargo = SustituirValorPiezaPuerta(componentePuerta[m].Pieza[j].nFormulaLargo, componentePuerta);
                            formula = formula.replace(medida, componentePuerta[m].Pieza[j].nLargo);
                        }
                    }
                    else if(medidaPieza == "Ancho")
                    {

                        if(componentePuerta[m].Pieza[j].nAncho > -1)
                        {
                            //console.log(componentePuerta[m].Pieza[j].nAncho);
                            //console.log(formula);
                            formula = formula.replace(medida, componentePuerta[m].Pieza[j].nAncho);
                            //console.log(formula);
                        }
                        else
                        {
                            componentePuerta[m].Pieza[j].nAncho = SustituirValorPiezaPuerta(componentePuerta[m].Pieza[j].nFormulaAncho, componentePuerta);
                            formula = formula.replace(medida, componentePuerta[m].Pieza[j].nAncho);
                        }
                    }

                    break;
                }

            }
        }
        
        //console.log(medida);
        //console.log(formula);
        index = formula.indexOf("[Pieza]");

    }

    return eval(formula);
}