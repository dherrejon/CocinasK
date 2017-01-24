/*---------------- Tipo Cubierta ------------*/
class TipoCubierta
{
    constructor()           //inicializar datos
    {
        this.TipoCubiertaId = "";
        this.Nombre = "";
    }
}

//Obtien los Tipo Cubierta
function GetTipoCubierta()     
{
    var tipoCubierta = [];
    tipoCubierta[0] = new TipoCubierta();
    tipoCubierta[1] = new TipoCubierta();
    
    tipoCubierta[0].TipoCubiertaId = "1";
    tipoCubierta[0].Nombre = "Formaica";
    
    tipoCubierta[1].TipoCubiertaId = "2";
    tipoCubierta[1].Nombre = "Granito";
    
    return tipoCubierta;
}

function SetTipoCubierta(tipo)
{
    var tipoCubierta = new TipoCubierta();
    
    tipoCubierta.TipoCubiertaId = tipo.TipoCubiertaId;
    tipoCubierta.Nombre = tipo.Nombre;
    
    return tipoCubierta;
}