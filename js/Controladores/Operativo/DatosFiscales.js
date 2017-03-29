app.controller("DatosFiscalesOperativo", function($scope, $rootScope, $http, $q, CONFIG, MEDIOCONTACTO, DOMICILIO, DATOSFISCALES)
{   
    $scope.claseFiscal = {nombre:"entrada", rfc:"entrada", correo:"dropdownlistModal", domicilio:"dropdownlistModal"};
    
    $scope.$on('AgregarDatoFiscal',function()
    {
        $scope.operacion = "Agregar";
        $scope.datoPersona = DATOSFISCALES.GetPersona();
        $scope.nuevoDato = new DatosFiscales();
        
        $('#datoFiscalModal').modal('toggle');
    });
    
    $scope.$on('EditarDatoFiscal',function()
    {
        $scope.operacion = "Editar";
        $scope.datoPersona = DATOSFISCALES.GetPersona();
        $scope.nuevoDato = DATOSFISCALES.GetDatoFiscal();
        
        $('#datoFiscalModal').modal('toggle');
    });
    
    //---------- Interfaz --------------
    $scope.CambiarMedioContacto = function(contacto)
    {
        if(contacto == "Nuevo")
        {            
            MEDIOCONTACTO.AgregarMedioContacto("Fiscal");
        }
        else
        {
            $scope.nuevoDato.CorreoElectronico = contacto;
        }
        
    };
    
    $scope.$on('MedioContactoAgregadoFiscal',function()
    {
        var contacto = MEDIOCONTACTO.GetMedioContacto();
        $scope.nuevoDato.CorreoElectronico = contacto.Contacto;
    });
    
    $scope.CambiarDomicilio = function(domicilio)
    {
        if(domicilio == "Nuevo")
        {
            DOMICILIO.AgregarDomicilio('Fiscal');
            $scope.nuevoDato.DomicilioNuevo  = false;
        }
        else
        {
            $scope.SetDomicilio(domicilio);
            $scope.nuevoDato.DomicilioNuevo  = true;
        }
    };
    
    $scope.$on('DomicilioAgregadoFiscal',function()
    {
        $scope.SetDomicilio(DOMICILIO.GetDomicilio());
    });
    
    $scope.$on('DomicilioEditado',function()
    {
        $scope.SetDomicilio(DOMICILIO.GetDomicilio());
    });
    
    $scope.EditarDomicilio = function()
    {
        DOMICILIO.EditarDomicilioNuevo($scope.nuevoDato, "Fiscal");
    };
    
    $scope.SetDomicilio = function(domicilio)
    {
        $scope.nuevoDato.Domicilio = domicilio.Domicilio;
        $scope.nuevoDato.Codigo = domicilio.Codigo;
        $scope.nuevoDato.Estado = domicilio.Estado;
        $scope.nuevoDato.Municipio = domicilio.Municipio;
        $scope.nuevoDato.Ciudad = domicilio.Ciudad;
        $scope.nuevoDato.Colonia = domicilio.Colonia;
        
        $scope.nuevoDato.Pais = new Pais();
        $scope.nuevoDato.Pais.PaisId = "1";
        
        $scope.nuevoDato.TipoMedioContacto  = new TipoMedioContacto();
        $scope.nuevoDato.TipoMedioContacto.TipoMedioContactoId = domicilio.TipoMedioContacto.TipoMedioContactoId;
        $scope.nuevoDato.TipoMedioContacto.Nombre = domicilio.TipoMedioContacto.Nombre;
    };
    
    
    //----------------- Terminar ---------------------------
    $scope.TerminarDatoFiscal = function(nombreInvalido, rfcInvalido)
    {
        if(!$scope.ValidarDatosFiscales(nombreInvalido, rfcInvalido)) 
        {
            return;
        }
        else
        {
            $scope.nuevoDato.RFC = $scope.nuevoDato.RFC.toUpperCase();
            $scope.nuevoDato.PersonaId = $scope.datoPersona.PersonaId;
            if($scope.operacion == "Agregar")
            {
                $scope.AgregarDatoFiscal();
            }
            if($scope.operacion == "Editar")
            {
                $scope.EditarDatoFiscal();
            }
        }
    };
    
    $scope.AgregarDatoFiscal = function()
    {   
        AgregarDatoFiscalPersona($http, CONFIG, $q, $scope.nuevoDato).then(function(data)
        {
            if(data == "Exitoso")
            {
                $('#datoFiscalModal').modal('toggle');
                $scope.mensaje = "El dato fiscal se ha agregado.";
                
                DATOSFISCALES.DatoFiscalTerminado();
            }
            else
            {
                $scope.mensaje = "Ha ocurrido un error. Intente más tarde";   
            }
            $('#mensajeDatoFiscal').modal('toggle');
        }).catch(function(error)
        {
            $scope.mensaje = "Ha ocurrido un error. Intente más tarde. Error: " + error;
            $('#mensajeDatoFiscal').modal('toggle');
        });
    };
    
    $scope.EditarDatoFiscal = function()
    {   
        EditarDatoFiscalPersona($http, CONFIG, $q, $scope.nuevoDato).then(function(data)
        {
            if(data == "Exitoso")
            {
                $('#datoFiscalModal').modal('toggle');
                $scope.mensaje = "El dato fiscal se ha editado.";
                
                DATOSFISCALES.DatoFiscalTerminado();
            }
            else
            {
                $scope.mensaje = "Ha ocurrido un error. Intente más tarde";   
            }
            $('#mensajeDatoFiscal').modal('toggle');
        }).catch(function(error)
        {
            $scope.mensaje = "Ha ocurrido un error. Intente más tarde. Error: " + error;
            $('#mensajeDatoFiscal').modal('toggle');
        });
    };
    
    $scope.ValidarDatosFiscales = function(nombreInvalido, rfcInvalido)
    {
        $scope.mensajeError = [];
        
        if(nombreInvalido)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*Escribe un nombre válido.";
            $scope.claseFiscal.nombre = "entradaError"; 
        }
        else
        {
            $scope.claseFiscal.nombre = "entrada"; 
        }
        
        if(rfcInvalido)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*Escribe un RFC válido. Ejemplo: ABC-AAMMDD-A1B.";
            $scope.claseFiscal.rfc = "entradaError"; 
        }
        else
        {
            $scope.claseFiscal.rfc = "entrada"; 
        }
        
        if($scope.nuevoDato.CorreoElectronico.length == 0)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*Debes de indicar un correo eletrónico.";
            $scope.claseFiscal.correo = "dropdownlistModalError"; 
        }
        else
        {
            $scope.claseFiscal.correo = "dropdownlistModal"; 
        }
        
        if($scope.nuevoDato.Codigo.length == 0)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*Debes indicar el domicilio.";
            $scope.claseFiscal.domicilio = "dropdownlistModalError"; 
        }
        else
        {
            $scope.claseFiscal.domicilio = "dropdownlistModal"; 
        }
        
        if($scope.mensajeError.length > 0)
        {
            return false;
        }
        else
        {
            return true;
        }
    };
    
    
    $scope.CerrarDatosFiscales = function()
    {
        $scope.mensajeError = [];
        $scope.claseFiscal = {nombre:"entrada", rfc:"entrada", correo:"dropdownlistModal", domicilio:"dropdownlistModal"};
    };
    
    
});

app.factory('DATOSFISCALES',function($rootScope)
{
    var service = {};
    service.datoFiscal = null;

    service.AgregarDatoFiscal = function(persona)
    {
      this.datoFiscal = null;
      this.persona = persona;
      $rootScope.$broadcast('AgregarDatoFiscal');
    };
    
    service.EditarDatoFiscal = function(datoFiscal, persona)
    {
      this.datoFiscal = SetDatosFiscales(datoFiscal);
      this.persona = persona;
      $rootScope.$broadcast('EditarDatoFiscal');
    };
    
    service.DatoFiscalTerminado = function()
    {
        $rootScope.$broadcast('DatoFiscalTerminado');
    };
    
    service.GetDatoFiscal = function()
    {
        return this.datoFiscal;
    };
    
    service.GetPersona = function()
    {
        return this.persona;
    };
    

    
  return service;
});

function SetDatosFiscales(data)
{
    var fiscal = new DatosFiscales();
    
    fiscal.DatosFiscalesId = data.DatosFiscalesId;
    fiscal.Nombre = data.Nombre;
    fiscal.RFC = data.RFC;
    fiscal.CorreoElectronico = data.CorreoElectronico;
    
    fiscal.Codigo = data.Codigo;
    fiscal.Domicilio = data.Domicilio;
    fiscal.Estado = data.Estado;
    fiscal.Municipio = data.Municipio;
    fiscal.Ciudad = data.Ciudad;
    fiscal.Colonia = data.Colonia;
    
    return fiscal;
}
