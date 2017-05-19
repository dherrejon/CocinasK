function CalcularCostoModulo(modulo, combinacion)
{   
    
    SetDatosModulo(modulo);
    SetParte(modulo.Parte, modulo.AnchoNumero, modulo.AltoNumero);
    
    //Costo Consumible
    modulo.CostoConsumible = 0;
    for(var k=0; k<modulo.Consumible.length; k++)
    {
        modulo.CostoConsumible += (parseFloat(modulo.Consumible[k].Costo)*parseInt(modulo.Consumible[k].Cantidad));
    }
    
    //consumo frente modulo
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
    
    /*----------- No importa el grueso del material (cambia combinación)--------------------*/
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
    for(var k=0; k<combinacion.length; k++)
    {
        if(combinacion[k].Activo && combinacion[k].PorDefecto)
        {
            SustituirFormulaCompleta(modulo, combinacion[k].CombinacionMaterialId); //componente y pieza
            combinacion[k].PrecioVentaModulo = CalcularPrecioVenta(modulo, combinacion[k].CombinacionMaterialId);
            
            combinacion[k].PrecioVentaModulo = Math.round(combinacion[k].PrecioVentaModulo);
        }
    }
    
   // console.log(modulo);
    
}

function SetParte(parte, ancho, alto)
{
    var cosIzq = 0, cosDer = 0;
    
    for(var k=0; k<parte.length; k++)
    {
        parte[k].Ancho = FraccionADecimal(parte[k].Ancho);
        
        if(parte[k].ParteId == "1")
        {
            cosIzq = parte[k].Ancho;
            parte[k].Largo = alto;
        }
        if(parte[k].ParteId == "2")
        {
            cosDer = parte[k].Ancho;
            parte[k].Largo = alto;
        }
    }
    
    for(var k=0; k<parte.length; k++)
    {   
        if(parte[k].ParteId == "3" || parte[k].ParteId == "4" || parte[k].ParteId == "5")
        {
            parte[k].Largo = ancho - (cosDer+cosIzq);
        }
    }
}

function SetDatosModulo(modulo) //Seccion, Entrepaño y peinazoVeical
{
    var peinazoVerical = [];
    var cosIzq = 0, cosDer = 0;
    var numPiezas = 0;
    var numEntrepano = 0;
    
    for(var k=0; k<modulo.Parte.length; k++)
    {
        if(modulo.Parte[k].ParteId == "1")
        {
            cosIzq = FraccionADecimal(modulo.Parte[k].Ancho);
        }
        if(modulo.Parte[k].ParteId == "2")
        {
            cosDer = FraccionADecimal(modulo.Parte[k].Ancho);
        }
    }
    
    for(var k=0; k<modulo.Seccion.length; k++)
    {
        numPiezas = parseInt(modulo.Seccion[k].NumeroPiezas);
        numEntrepano += parseInt(modulo.Seccion[k].NumeroEntrepano);
        
        modulo.Seccion[k].Alto = FraccionADecimal(modulo.Seccion[k].Luz) + 1;
        modulo.Seccion[k].Ancho = ((modulo.AnchoNumero - (cosIzq+cosDer) - ((numPiezas-1)*FraccionADecimal(modulo.Seccion[k].PeinazoVertical)))/numPiezas) + 1;
        
        if(numPiezas > 1)
        {
            var ind = peinazoVerical.length;
            peinazoVerical[ind] = new Object();
            peinazoVerical[ind].Ancho = FraccionADecimal(modulo.Seccion[k].PeinazoVertical);
            peinazoVerical[ind].Largo = FraccionADecimal(modulo.Seccion[k].Luz);
            peinazoVerical[ind].Cantidad = numPiezas-1;
        }
    }
    
    for(var k=0; k<modulo.ComponenteEspecial.length; k++)
    {
        if(modulo.ComponenteEspecial[k].ComponenteId == "9") //entrepaño
        {
            modulo.ComponenteEspecial[k].NumeroEntrepano = numEntrepano;
            modulo.ComponenteEspecial[k].Ancho = modulo.AnchoNumero - (cosDer+cosIzq) +1;
            modulo.ComponenteEspecial[k].Largo = modulo.ProfundoNumero - 2;
            
            modulo.ComponenteEspecial[k].Consumo = (modulo.ComponenteEspecial[k].Largo*modulo.ComponenteEspecial[k].Ancho*modulo.ComponenteEspecial[k].NumeroEntrepano)/144.0;
            
            break;
        }
    }
    
    modulo.PeinazoVertical = peinazoVerical;
}

function SustituirModulo(formula, ancho, alto, profundo)
{
    var nFormula = formula;
    
    if(formula.includes("[Modulo][Ancho]"))
    {
        nFormula =  nFormula.replace(/\[Modulo\]\[Ancho\]/g, ancho);
    }
    
    if(formula.includes("[Modulo][Alto]"))
    {
        nFormula =  nFormula.replace(/\[Modulo\]\[Alto\]/g, alto);
    }
    
    if(formula.includes("[Modulo][Profundo]"))
    {
        nFormula =  nFormula.replace(/\[Modulo\]\[Profundo\]/g, profundo);
    }
    
    return nFormula;
}

function SustituirParte(pieza, parte)
{
    if(pieza.Ancho == -1 && pieza.FormulaAncho.includes("[Parte]"))
    {
        pieza.FormulaAncho = SustituirParteValor(pieza.FormulaAncho, parte);
        pieza.Ancho = EvaluarFormula(pieza.FormulaAncho);
    }
    if(pieza.Largo == -1 && pieza.FormulaLargo.includes("[Parte]"))
    {
        pieza.FormulaLargo = SustituirParteValor(pieza.FormulaLargo, parte);
        pieza.Largo = EvaluarFormula(pieza.FormulaLargo);
    }
}

function SustituirParteValor(formula, parte)
{
    var index = formula.indexOf("[Parte]");
    var parteId = "";
    var medidaParte = "";
    
    do
    {
        for(var j=index+8; j<formula.length; j++)
        {
            parteId += formula[j];
            if(formula[j+1] == "]")
            {
                index = j+1;
                break;
            }
        }

        for(var j=index+2; j<formula.length; j++)
        {
            medidaParte += formula[j];
            if(formula[j+1] == "]")
            {
                break;
            }
        }

        for(var j=0; j<parte.length; j++)
        {

            if(parte[j].ParteId == parteId)
            {
                var medida = "[Parte][" + parteId + "][" + medidaParte + "]";

                if(medidaParte == "Largo")
                {
                    formula = formula.replace(medida, parte[j].Largo);
                }
                else if(medidaParte == "Ancho")
                {
                    formula = formula.replace(medida, parte[j].Ancho);
                }

                break;
            }
        }

        parteId = "";
        medidaParte = "";

        index = formula.indexOf("[Parte]");

    }while(index > -1);
    
    return formula;
}

function SustituirFormulaCompleta(modulo, combinacion)
{
    //Sustituir componente
    for(var i=0; i<modulo.Componente.length; i++)
    {
        for(var j=0; j<modulo.Componente[i].Pieza.length; j++)
        {
            if(modulo.Componente[i].Pieza[j].Ancho == -1 )
            {
                if(modulo.Componente[i].Pieza[j].FormulaAncho.includes('[Componente]'))
                {
                    modulo.Componente[i].Pieza[j].nFormulaAncho = SustituirComponenteValor(modulo.Componente[i].Pieza[j].FormulaAncho, modulo.Componente, modulo.ComponenteEspecial, combinacion);
                    modulo.Componente[i].Pieza[j].nAncho = EvaluarFormula(modulo.Componente[i].Pieza[j].nFormulaAncho);
                }
            }
            else
            {
                modulo.Componente[i].Pieza[j].nAncho = modulo.Componente[i].Pieza[j].Ancho;
            }
            if(modulo.Componente[i].Pieza[j].Largo == -1)
            {
                if(modulo.Componente[i].Pieza[j].FormulaLargo.includes('[Componente]'))
                {
                    modulo.Componente[i].Pieza[j].nFormulaLargo = SustituirComponenteValor(modulo.Componente[i].Pieza[j].FormulaLargo, modulo.Componente, modulo.ComponenteEspecial, combinacion);
                    modulo.Componente[i].Pieza[j].nLargo = EvaluarFormula(modulo.Componente[i].Pieza[j].nFormulaLargo);
                }
            }
            else
            {
                modulo.Componente[i].Pieza[j].nLargo = modulo.Componente[i].Pieza[j].Largo;
            }
            
        }
    }
    
    //Sustituir Pieza
    for(var i=0; i<modulo.Componente.length; i++)
    {
        for(var j=0; j<modulo.Componente[i].Pieza.length; j++)
        {
            if(modulo.Componente[i].Pieza[j].nAncho == -1  && modulo.Componente[i].Pieza[j].nFormulaAncho.includes('[Pieza]'))
            {
                modulo.Componente[i].Pieza[j].nAncho = SustituirValorPieza(modulo.Componente[i].Pieza[j].nFormulaAncho, modulo.Componente[i].Pieza[j]);
            }
            if(modulo.Componente[i].Pieza[j].nLargo == -1  && modulo.Componente[i].Pieza[j].nFormulaLargo.includes('[Pieza]'))
            {
                modulo.Componente[i].Pieza[j].nLargo = SustituirValorPieza(modulo.Componente[i].Pieza[j].nFormulaLargo, modulo.Componente[i].Pieza[j]);
            }
        }
    }
    
    //console.log(modulo.Componente);
}

function SustituirComponenteValor (formula, componente, especial, combinacion)
{
    var newFormula = formula;
    var index = newFormula.indexOf("[Componente]");
    var componenteId = "";

    do
    {
        for(var j=index+13; j<newFormula.length; j++)
        {
            componenteId += newFormula[j];
            if(newFormula[j+1] == "]")
            {
                index = j+1;
                break;
            }
        }

        var medida = "[Componente][" + componenteId + "][Grueso]";

        if(componenteId == "1" || componenteId == "9")
        {
            for(var k=0; k<especial.length; k++)
            {
                if(especial[k].ComponenteId == componenteId)
                {
                    for(var l=0; l<especial[k].Combinacion.length; l++)
                    {
                        if(especial[k].Combinacion[l].CombinacionMaterialId == combinacion)
                        {
                            if(especial[k].Combinacion[l].Grueso != "No Aplica")
                            {
                                newFormula = newFormula.replace(medida, FraccionADecimal(especial[k].Combinacion[l].Grueso));
                            }
                            else
                            {
                                newFormula = newFormula.replace(medida, "0");
                            }
                            break;
                        }
                    }
                    break;
                }
            } 
        }

        else
        {
            for(var j=0; j<componente.length; j++)
            {
                if(componente[j].ComponenteId == componenteId)
                {
                    for(var l=0; l<componente[j].Combinacion.length; l++)
                    {
                        if(componente[j].Combinacion[l].CombinacionMaterialId == combinacion)
                        {
                            if(componente[j].Combinacion[l].Grueso != "No Aplica")
                            {
                                newFormula = newFormula.replace(medida, FraccionADecimal(componente[j].Combinacion[l].Grueso));
                            }
                            else
                            {
                                newFormula = newFormula.replace(medida, "0");
                            }

                            break;
                        }
                    }
                    break;
                }
            }
        }

        componenteId = "";
        

        index = newFormula.indexOf("[Componente]");

    }while(index > -1);

    return newFormula;
}

function SustituirValorPieza(formula, pieza)
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
        
        for(var j=0; j<pieza.length; j++)
        {
            if(pieza[j].PiezaId == piezaId)
            {
                
                if(medidaPieza == "Largo")
                {
                    if(pieza[j].nLargo > -1)
                    {
                        formula = formula.replace(medida, pieza[j].nLargo);
                    }
                    else
                    {
                        pieza[j].nLargo = SustituirValorPieza(pieza[j].nFormulaLargo, pieza);
                        formula = formula.replace(medida, pieza[j].nLargo);
                    }
                }
                else if(medidaPieza == "Ancho")
                {
                    
                    if(pieza[j].nAncho > -1)
                    {
                        formula = formula.replace(medida, pieza[j].nAncho);
                    }
                    else
                    {
                        pieza[j].nAncho = SustituirValorPieza(pieza[j].nFormulaAncho, pieza);
                        formula = formula.replace(medida, pieza[j].nAncho);
                    }
                }

                break;
            }

        }
        
        index = formula.indexOf("[Pieza]");

    }

    return eval(formula);
}

function CalcularPrecioVenta(modulo, combinacion)
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
                CostoTotal += (consumoTotal * parseFloat(modulo.Componente[i].Combinacion[j].CostoUnidad));
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
                CostoTotal += (modulo.ComponenteEspecial[i].Consumo * parseFloat(modulo.ComponenteEspecial[i].Combinacion[j].CostoUnidad));

                break;
            }
        }
    }
    
    CostoTotal = CostoTotal + (CostoTotal*(modulo.Desperdicio/100));
    CostoTotal+= modulo.CostoConsumible;
    PrecioVenta = CostoTotal + (CostoTotal * (modulo.Margen/100));
    PrecioVenta *= modulo.Cantidad;
    
    
    return PrecioVenta;
    
}

function EvaluarFormula(formula)
{
    if(!formula.includes("["))
    {
        return eval(formula);
    }
    else
    {
        return -1;
    }
}