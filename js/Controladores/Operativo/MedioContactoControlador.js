app.controller("MedioContactoOperativo", function($scope, $rootScope, $http, $q, CONFIG, MEDIOCONTACTO)
{   
    $scope.medioContacto = [];
    $scope.tipoMedioContacto = [];
    
    $scope.nuevoContacto = null;
    
    $scope.claseContacto = {medio:"dropdownlistModal", tipo:"dropdownlistModal", contacto:"entrada"};
    
    $scope.$on('AgregarMedioContacto',function()
    {

        $scope.tipoOperacion = "Agregar Sin Registro";
       
         $scope.InicializarMedioContacto(); 
    });
    
    $scope.$on('AgregarMedioContactoPersona',function()
    {
        $scope.tipoOperacion = "Agregar Registro";
         $scope.InicializarMedioContacto();
    });
    
    $scope.InicializarMedioContacto = function()
    {
        $scope.operacion = "Agregar";
        $scope.nuevoContacto = new Contacto();
        $scope.fuente = MEDIOCONTACTO.GetFuente();
        
        $scope.GetCatalogosMedioContacto();
        
        if($scope.fuente == "Fiscal")
        {
            $scope.nuevoContacto.MedioContacto.MedioContactoId = "1";
            $scope.nuevoContacto.MedioContacto.Nombre = "Correo Electrónico";
        }
        
        $('#medioContactoModal').modal('toggle');
    };
    
    
    $scope.$on('EditarMedioContactoRegistrado',function()
    {
        $scope.operacion = "Editar";
        $scope.tipoOperacion = "Editar Registro";
        $scope.nuevoContacto = MEDIOCONTACTO.GetMedioContacto();
        
        $scope.GetCatalogosMedioContacto();
        
        $('#medioContactoModal').modal('toggle');
    });
    
    $scope.$on('EditarMedioContacto',function()
    {
        $scope.operacion = "Editar";
        $scope.tipoOperacion = "Editar Sin Registro";
        $scope.nuevoContacto = MEDIOCONTACTO.GetMedioContacto();
        
        $scope.GetCatalogosMedioContacto();
        
        $('#medioContactoModal').modal('toggle');
    });
    
    $scope.GetCatalogosMedioContacto = function()
    {
        $scope.GetMedioContacto();
        $scope.GetTipoMedioContacto();
    };
    
    $scope.GetMedioContacto = function()
    {
        $scope.medioContacto = GetMedioContacto();
    };
    
    $scope.GetTipoMedioContacto = function()
    {
        GetTipoMedioContacto($http, $q, CONFIG) .then(function(data) 
        {
            if(data.length > 0)
            {
                $scope.tipoMedioContacto = data;
            }
            else
            {
                $scope.tipoMedioContacto = [];
            }
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    //--------------------------------------- Medio Contacto ----------------------
    $scope.CambiarMedioContacto = function(medio)
    {
        if($scope.nuevoContacto.MedioContacto  != medio)
        {
            $scope.nuevoContacto.MedioContacto = medio;
            $scope.nuevoContacto.TipoMedioContacto = new TipoMedioContacto();
            $scope.nuevoContacto.Contacto = "";
        }
    };
    
    $scope.CambiarTipoMedioContacto = function(tipo)
    {
        $scope.nuevoContacto.TipoMedioContacto = tipo;
    };
    
    $scope.MostrarMedioContacto = function(medio)
    {
        if(MEDIOCONTACTO.GetFuente() == "Fiscal" && medio.MedioContactoId == "2")
        {
            return false;
        }
        else
        {
            return true;
        }
    };
    
    $scope.MostarTipoMedioContacto = function(tipo)
    {
        var val  = parseInt(tipo.TipoMedioContactoId);
                       
        if(val > 0)
        {
            return true;
        }
        else
        {
            var fuente = MEDIOCONTACTO.GetFuente();
            if(fuente == "Fiscal" && val == -4)
            {
                return true;
            }
            else
            {
                return false;
            }
        }
    };
    
    
    //---------------- Terminar Medio Contacto
    $scope.TerminarMedioContacto = function(telefonoInvalido, correoInvalido)
    {
        if(!$scope.ValidarDatosMedioContacto(telefonoInvalido, correoInvalido))
        {
            return;
        }
        else
        {
            if($scope.tipoOperacion == "Agregar Sin Registro")
            {
                MEDIOCONTACTO.TerminarNuevoContacto($scope.nuevoContacto);
                $('#medioContactoModal').modal('toggle');
            }
            else if($scope.tipoOperacion == "Editar Sin Registro")
            {
                MEDIOCONTACTO.TerminarEditarNuevoContacto($scope.nuevoContacto);
                $('#medioContactoModal').modal('toggle');
            }
            if($scope.tipoOperacion == "Agregar Registro")
            {
                $scope.AgregarMedioContactoPersona();
            }
            else if($scope.tipoOperacion == "Editar Registro")
            {
                $scope.EditarMedioContactoPersona();
            }
            
            
        }
    };
    
    $scope.AgregarMedioContactoPersona = function()
    {
        $scope.nuevoContacto.PersonaId = MEDIOCONTACTO.GetPersonaId();
        
        AgregarMedioContactoPersona($http, CONFIG, $q, $scope.nuevoContacto).then(function(data)
        {
            if(data == "Exitoso")
            {
                $('#medioContactoModal').modal('toggle');
                $scope.mensaje = "El medio de contacto se ha agregado.";
                
                MEDIOCONTACTO.TerminarNuevoContactoPersona();
            }
            else
            {
                $scope.mensaje = "Ha ocurrido un error. Intente más tarde";   
            }
            $('#mensajeMedioContacto').modal('toggle');
        }).catch(function(error)
        {
            $scope.mensaje = "Ha ocurrido un error. Intente más tarde. Error: " + error;
            $('#mensajeMedioContacto').modal('toggle');
        });
    };
    
    $scope.EditarMedioContactoPersona = function()
    {
        EditarMedioContactoPersona($http, CONFIG, $q, $scope.nuevoContacto).then(function(data)
        {
            if(data == "Exitoso")
            {
                $('#medioContactoModal').modal('toggle');
                $scope.mensaje = "El medio de contacto se ha editado.";
                
                MEDIOCONTACTO.TerminarEditarNuevoContacto($scope.nuevoContacto);
            }
            else
            {
                $scope.mensaje = "Ha ocurrido un error. Intente más tarde";   
            }
            $('#mensajeMedioContacto').modal('toggle');
        }).catch(function(error)
        {
            $scope.mensaje = "Ha ocurrido un error. Intente más tarde. Error: " + error;
            $('#mensajeMedioContacto').modal('toggle');
        });
    };
    
    $scope.ValidarDatosMedioContacto = function(telefonoInvalido, correoInvalido)
    {
        $scope.mensajeError = [];
        
        if($scope.nuevoContacto.MedioContacto.MedioContactoId.length === 0)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*Selecciona un medio de contacto.";
            $scope.claseContacto.medio = "dropdownlistModalError";
        }
        else
        {
            $scope.claseContacto.medio = "dropdownlistModal";
        }
        
        if($scope.nuevoContacto.TipoMedioContacto.TipoMedioContactoId.length === 0 &&  $scope.fuente != "Fiscal")
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*Selecciona un tipo de medio de contacto.";
            $scope.claseContacto.tipo = "dropdownlistModalError";
        }
        else
        {
            $scope.claseContacto.tipo = "dropdownlistModal";
        }
        
        $scope.claseContacto.contacto = "entrada";
        if($scope.nuevoContacto.MedioContacto.MedioContactoId == "1" && correoInvalido)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*Escribe un correo electrónico válido.";
            $scope.claseContacto.contacto = "entradaError";
        }
        
        if($scope.nuevoContacto.MedioContacto.MedioContactoId == "2" && telefonoInvalido)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*Escribe un teléfono válido.";
            $scope.claseContacto.contacto = "entradaError";
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
    
    $scope.CerrarContactoModal = function()
    {
        $scope.mensajeError =[];
        $scope.claseContacto = {medio:"dropdownlistModal", tipo:"dropdownlistModal", contacto:"entrada"};
    };
    
});

app.factory('MEDIOCONTACTO',function($rootScope)
{
  var service = {};
  service.medio = null;
    
  service.AgregarMedioContacto = function(fuente)
  {
      this.medio = null;
      this.fuente = fuente;
      $rootScope.$broadcast('AgregarMedioContacto');
  };
    
  service.AgregarMedioContactoPersona = function(id, fuente)
  {
      this.medio = null;
      this.personaId = id;
      this.fuente = fuente;
      $rootScope.$broadcast('AgregarMedioContactoPersona');
  };
    
  service.EditarMedioContacto = function(contacto, fuente)
  {
      this.medio = SetMedioContacto(contacto);
      this.fuente = fuente;
      $rootScope.$broadcast('EditarMedioContacto');
  };
    
  service.EditarMedioContactoRegistrado = function(contacto, fuente)
  {
      this.medio = SetMedioContacto(contacto);
      this.fuente = fuente;
      $rootScope.$broadcast('EditarMedioContactoRegistrado');
  };
    
  service.TerminarNuevoContacto = function(contacto)
  {
      this.medio = contacto;
      if(this.fuente != "Fiscal")
      {
          $rootScope.$broadcast('MedioContactoAgregado');
      }
      else
      {
           $rootScope.$broadcast('MedioContactoAgregadoFiscal');
      }
      
  };
    
  service.TerminarNuevoContactoPersona = function()
  {
      $rootScope.$broadcast('TerminarNuevoContactoPersona');
  };
    
  service.TerminarEditarNuevoContacto = function(contacto)
  {
      this.medio = contacto;
      $rootScope.$broadcast('MedioContactoEditado');
  };
    
  service.GetMedioContacto = function()
  {
      return this.medio;
  };
    
  service.GetPersonaId = function()
  {
      return this.personaId;
  };
    
  service.GetFuente = function()
  {
      return this.fuente;
  };
    
  return service;
});


function SetMedioContacto(data)
{
    var contacto = new Contacto();
    
    contacto.Contacto = data.Contacto;
    contacto.Activo = data.Activo;
    contacto.ContactoPersonaId = data.ContactoPersonaId;
    
    
    contacto.MedioContacto.MedioContactoId = data.MedioContacto.MedioContactoId;
    contacto.MedioContacto.Nombre = data.MedioContacto.Nombre;
    
    contacto.TipoMedioContacto.TipoMedioContactoId = data.TipoMedioContacto.TipoMedioContactoId;
    contacto.TipoMedioContacto.Nombre = data.TipoMedioContacto.Nombre;
    
    
    
    return contacto;
}