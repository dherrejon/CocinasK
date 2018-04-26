/*------ Encuesta ---------*/
class Encuesta
{
    constructor()
    {
        this.EncuestaId = "";
        this.Nombre = "";
        this.Activo = true;
        
        this.Pregunta = [];
    }
}


function SetEncuesta(data, tipo)
{
    var encuesta = new Encuesta();
    
    encuesta.EncuestaId = data.EncuestaId;
    encuesta.Nombre = data.Nombre;
    
    if(tipo == "Iniciar")
    {
        encuesta.Activo = data.Activo == "1" ? true : false;
    }
    else if(tipo == "Editar")
    {
        encuesta.Activo = data.Activo;
    }
    else if(tipo == "Guardar")
    {
        encuesta.Activo = data.Activo ? "1" : "0";
        encuesta.Pregunta = data.Pregunta;
    }
    
    return encuesta;
}

//-------  Pregunta ---------
class Pregunta
{
    constructor()
    {
        this.PreguntaId = "";
        this.TipoPregunta = new TipoPregunta();
        this.Pregunta = "";
        this.Comentario = false;
        this.Otro = false;
        
        this.Respuesta = [];
    }
}

function SetPregunta(data, tipo)
{
    var pregunta = new Pregunta();
    
    pregunta.PreguntaId = data.PreguntaId;
    pregunta.Pregunta = data.Pregunta;
    
    if(tipo == "Iniciar")
    {
        pregunta.Comentario = data.Comentario == "1" ? true:false;
        pregunta.Otro = data.Otro == "1" ? true:false;
        
        pregunta.TipoPregunta.TipoPreguntaId = data.TipoPreguntaId;
        pregunta.TipoPregunta.Nombre = data.NombreTipoPregunta;
        
        pregunta.Eliminada = false;
        pregunta.Editar = false;
        
        pregunta.Respuesta = data.Respuesta;
    }
    else if(tipo == "Editar")
    {
        pregunta.Comentario = data.Comentario;
        pregunta.Otro = data.Otro;
        
        pregunta.TipoPregunta = data.TipoPregunta;
        
        pregunta.Eliminada = data.Eliminada;
        
        
        if(data.Respuesta.length == 0)
        {
            pregunta.Respuesta[0] = new Respuesta();
        }
        else
        {
            for(var k=0; k<data.Respuesta.length; k++)
            {
                pregunta.Respuesta[k] = SetRespuesta(data.Respuesta[k]);
            }
        }
    }
    else if(tipo == "Preguardar")
    {
        pregunta.Comentario = data.Comentario;
        pregunta.Otro = data.Otro;
        
        pregunta.TipoPregunta = data.TipoPregunta;
        
        pregunta.Eliminada = data.Eliminada;
        pregunta.Editar = pregunta.Editar;
        
        pregunta.Respuesta = data.Respuesta;
    }
    else if(tipo == "Guardar")
    {
        pregunta.Comentario = data.Comentario ? "1":"0";
        pregunta.Otro = data.Otro ? "1":"0";
        
        pregunta.TipoPregunta = data.TipoPregunta;
        
        pregunta.Eliminada = data.Eliminada;
        pregunta.Editar = pregunta.Editar;
        
        pregunta.Respuesta = data.Respuesta;
    }
    
    return pregunta;
}

//-------  Respuesta ---------
class Respuesta
{
    constructor()
    {
        this.RespuestaId = "";
        this.Respuesta = "";
    }
}

function SetRespuesta(data)
{
    var respuesta = new Respuesta();
    
    respuesta.RespuestaId = data.RespuestaId;
    respuesta.Respuesta = data.Respuesta;
    
    return respuesta;
}


//------- Tipo Pregunta ---------
class TipoPregunta
{
    constructor()
    {
        this.TipoPreguntaId = "";
        this.Nombre = "";
    }
}

function GetTipoPregunta()
{
    var tipoPregunta = [];
    
    tipoPregunta[0] = new TipoPregunta();
    tipoPregunta[0].TipoPreguntaId = "1";
    tipoPregunta[0].Nombre = "Opción Multiple";
    
    tipoPregunta[1] = new TipoPregunta();
    tipoPregunta[1].TipoPreguntaId = "2";
    tipoPregunta[1].Nombre = "Selección Multiple";
    
    tipoPregunta[2] = new TipoPregunta();
    tipoPregunta[2].TipoPreguntaId = "3";
    tipoPregunta[2].Nombre = "Comentario";
    
    
    return tipoPregunta;
}
