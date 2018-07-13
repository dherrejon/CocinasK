function CalcularCostoConsumoPuerta(modulo, combinacion, puerta)
{
      
    CalcularConsumoPuerta(puerta, modulo);
    
    
    puerta.Combinacion = [];
    for(var componente of puerta.Componente)
    {
        componente.ConsumoDesperdicio =  componente.Consumo + (componente.Consumo * (modulo.Desperdicio/100.0));
    }
    
    
    console.log(puerta);        
        
        

    /*for(var i=0; i<combinacion.length; i++)
    {
        combinacion[i].PrecioVenta  += CalcularPrecioVentaPuerta(puerta, combinacion[i].CombinacionMaterialId, modulo);
           

        muestrario[j].Combinacion[i].PrecioVenta += ((muestrario[j].Combinacion[i].PrecioVenta*margePresupuesto)/100);
        muestrario[j].Combinacion[i].PrecioVenta += ((muestrario[j].Combinacion[i].PrecioVenta*iva)/100);
        muestrario[j].Combinacion[i].PrecioVenta = Math.round(muestrario[j].Combinacion[i].PrecioVenta);
    }*/
        
    

}

/*function CalcularPrecioVentaPuerta(puerta, combinacion, modulo)
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
}*/

