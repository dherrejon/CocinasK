function CalcularCostoConsumoPuerta(modulo, combinacion, puerta)
{
    CalcularConsumoPuerta(puerta, modulo);
    
    
    puerta.Combinacion = [];
    for(var componente of puerta.Componente)
    {
        componente.ConsumoDesperdicio =  componente.Consumo + (componente.Consumo * (modulo.Desperdicio/100.0));
    }
}

