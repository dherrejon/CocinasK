app.controller("DomicilioOperativoControlador", function($scope, $rootScope, $http, $q, CONFIG, DOMICILIO)
{   
    $scope.nuevoDomicilio = [];
    
    $scope.mensajeError = [];
    $scope.claseDomicilio = {tipoMedio:"dropdownlistModal", tipo:"dropdownlistModal", codigo:"entrada", domicilio:"entrada", estado:"dropdownlistModal", municipio:"dropdownlistModal", ciudad:"dropdownlistModal", colonia:"dropdownlistModal", otra:"entrada"};
    
    $scope.sinCP = false;
    $scope.otraColonia = false;
    $scope.estadoMexico = [];
    $scope.tipoMedioContacto = [];
    
    $scope.$on('AgregarDomicilio',function()
    {
        $scope.operacion = "Agregar";
        $scope.tipoOperacion = "Agregar Sin Registro";
        $scope.nuevoDomicilio = new Domicilio();
        $scope.sinCP = false;
        $scope.otraColonia = false;
        
        $scope.GetCatalogosDomicilio();
        
        $('#domicilioModal').modal('toggle');
    });
    
    $scope.$on('EditarDomicilioNuevo',function()
    {
        $scope.operacion = "Editar";
        $scope.tipoOperacion = "Editar Sin Registro";
        $scope.nuevoDomicilio = DOMICILIO.GetDomicilio();
        $scope.sinCP = false;
        $scope.otraColonia = false;
        
        $scope.GetCatalogosDomicilio();
        $scope.GetDatosDomicilio();
        
        if($scope.nuevoDomicilio.Codigo == "NC.P.")
        {
            $scope.otraColonia = true;
        }
        
        $('#domicilioModal').modal('toggle');
    });
    
    $scope.$on('EditarDomicilioRegistrado',function()
    {
        $scope.operacion = "Editar";
        $scope.tipoOperacion = "Editar Registro";
        $scope.nuevoDomicilio = DOMICILIO.GetDomicilio();
        $scope.sinCP = false;
        $scope.otraColonia = false;
        
        $scope.GetCatalogosDomicilio();
        $scope.GetDatosDomicilio();
        
        if($scope.nuevoDomicilio.Codigo == "NC.P.")
        {
            $scope.otraColonia = true;
        }
        
        $('#domicilioModal').modal('toggle');
    });
    
    $scope.$on('VerDetalle',function()
    {
        $scope.domicilioDetalle = DOMICILIO.GetDomicilio();

        $('#domicilioDetalleModal').modal('toggle');
    });
    
    
    $scope.GetCatalogosDomicilio = function()
    {
        $scope.GetTipoMedioContacto();
    };
    
    /*------------------------ Catálogos ------------------------*/
    $scope.GetMexicoEstados = function()
    {
        GetEstadoMexico($http, $q, CONFIG).then(function(data)
        {
            $scope.estadoMexico = data;
        }).catch(function(error)
        {
            $scope.mensaje = "Ha ocurrido un error. Intenta más tarde." +error;
            $('#mensajeUnidad').modal('toggle'); 
        });
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
    
    $scope.GetDatosDomicilio = function()
    {
        if($scope.nuevoDomicilio.Codigo != "NC.P.")
            {
                GetCodigoPostal($http, $q, CONFIG, $scope.nuevoDomicilio.Codigo).then(function(data)
                {
                    if(data.length > 0)
                    {
                        $scope.codigoPostal = data;
                    }
                }).catch(function(error)
                {
                    $scope.mensaje = "Ha ocurrido un error. Intenta más tarde.";
                    $('#mensajeUnidad').modal('toggle'); 
                });
            }
            else if($scope.nuevoDomicilio.Codigo == "NC.P.")
            {
                $scope.sinCP = true;
                $scope.GetColoniaEstado($scope.nuevoDomicilio.Estado);
            }
    };
    
    /*------------------------------------Dirección------------------------------------------*/
    $scope.CambiarTipoMedioContacto = function(tipo)
    {
        $scope.nuevoDomicilio.TipoMedioContacto = tipo;
    };
    
    //indica si se conoce el codigo postal o no
    $scope.ConocerCP = function()  
    {
        $scope.sinCP = !$scope.sinCP; 
        $scope.otraColonia = false;

        $scope.nuevoDomicilio.Estado  = "";
        $scope.nuevoDomicilio.Municipio  ="";
        $scope.nuevoDomicilio.Colonia  ="";
        $scope.nuevoDomicilio.Ciudad  ="";
        $scope.nuevoDomicilio.Codigo  ="";
        
        if($scope.estadoMexico.length === 0)
        {
            $scope.GetMexicoEstados();
        }
        
    };
    
    //identifica cuando el codigo postal cambia, por lo tanto obtiene los datos relacionados con ese cp
    $scope.CambiarCodigo = function()  
    {
        if($scope.nuevoDomicilio.Codigo != undefined)
        {
            if($scope.nuevoDomicilio.Codigo.length == 5)
            {
                GetCodigoPostal($http, $q, CONFIG, $scope.nuevoDomicilio.Codigo).then(function(data)
                {
                    if(data.length > 0)
                    {
                        $scope.codigoPostal = data;
                        $scope.nuevoDomicilio.Estado = data[0].Estado;
                        $scope.nuevoDomicilio.Municipio = data[0].Municipio;
                        $scope.nuevoDomicilio.Ciudad = data[0].Ciudad;
                        $scope.nuevoDomicilio.Colonia = data[0].Colonia;
                    }
                }).catch(function(error)
                {
                    alert("Ha ocurrido un error. Intenta más tarde." + error);
                });
            }
        }
    };
    
    //Se quieren conocer las colonias de un estado sin conocer el codigo postal
    $scope.GetColoniaEstado = function(estado)
    {
        GetCodigoPostal($http, $q, CONFIG, estado).then(function(data)
        {
            $scope.codigoPostal = data;
        }).catch(function(error)
        {
            alert("Ha ocurrido un error. Intenta más tarde." + error);
        });
    };
    
    //Se selecciono un estado distinto al seleccionado
    $scope.CambiarEstado = function(estado)
    {
        if( $scope.nuevoDomicilio.Estado != estado)
        {
            $scope.nuevoDomicilio.Estado = estado;

            if($scope.sinCP)
            {
                GetCodigoPostal($http, $q, CONFIG, estado).then(function(data)
                {
                    $scope.codigoPostal = data;
                    $scope.nuevoDomicilio.Municipio = "";
                    $scope.nuevoDomicilio.Ciudad = ""; 
                    $scope.nuevoDomicilio.Colonia = ""; 
                    $scope.nuevoDomicilio.Codigo = "";
                    
                }).catch(function(error)
                {
                    alert("Ha ocurrido un error. Intenta más tarde." + error);
                });
            }
        }
    };
    
    //Se selecciono un municipio distinto al seleccionado
    $scope.CambiarMunicipio = function(municipio)
    {
        if($scope.nuevoDomicilio.Municipio != municipio)
        {
            $scope.nuevoDomicilio.Municipio = municipio;
            $scope.nuevoDomicilio.Colonia = ""; 
            $scope.nuevoDomicilio.Codigo = "";
            $scope.nuevoDomicilio.Ciudad = "";
            for(var k=0; k<$scope.codigoPostal.length; k++)
            {
                if($scope.codigoPostal[k].Municipio == $scope.nuevoDomicilio.Municipio)
                {
                    $scope.nuevoDomicilio.Ciudad = $scope.codigoPostal[k].Ciudad;
                    break;
                }
            }
        }
    };
    
    //Se selecciono una ciudad distinto al seleccionado
    $scope.CambiarCiudad = function(ciudad)
    {
        if($scope.nuevoDomicilio.Ciudad != ciudad)
        {
            $scope.nuevoDomicilio.Ciudad = ciudad;
            $scope.nuevoDomicilio.Colonia = "";
            $scope.nuevoDomicilio.Codigo = "";
        }   
    };
    
    //Se selecciono una colonia distinta
    //si se indico que no se conocia el C.P. se obtendra este por medio de todos los datos indicados
    $scope.CambiarColonia = function (colonia)
    {
        if(colonia === "OtraColonia")
        {
            $scope.otraColonia = true; 
            $scope.nuevoDomicilio.Colonia = "";
            if($scope.sinCP)
            {
                $scope.nuevoDomicilio.Codigo = "";
            }
        }
        else
        {
            $scope.otraColonia = false; 
            $scope.nuevoDomicilio.Colonia = colonia;
            
            if($scope.sinCP)                                       //Obteber el código postal 
            {
                for(var k=0; k<$scope.codigoPostal.length; k++)
                {
                    if($scope.codigoPostal[k].Municipio == $scope.nuevoDomicilio.Municipio && $scope.codigoPostal[k].Ciudad == $scope.nuevoDomicilio.Ciudad && $scope.codigoPostal[k].Colonia == $scope.nuevoDomicilio.Colonia)
                    {
                        $scope.nuevoDomicilio.Codigo = $scope.codigoPostal[k].Codigo;
                        break;
                    }
                }
            }
        }
    };
    
    
    //--------------------- Terminar -----------------------
    
    $scope.TerminarDomicilio = function(domicilioInvalido, cpInvalido, coloniaInvalido)
    {
        if(!$scope.ValidarDatos(domicilioInvalido, cpInvalido, coloniaInvalido))
        {
            return;
        }
        else
        {
            if($scope.tipoOperacion == "Agregar Sin Registro")
            {
                DOMICILIO.TerminarNuevoDomicilio($scope.nuevoDomicilio);
                $('#domicilioModal').modal('toggle');
            }
            if($scope.tipoOperacion == "Editar Sin Registro")
            {
                DOMICILIO.TerminarEditarNuevoDomicilio($scope.nuevoDomicilio);
                $('#domicilioModal').modal('toggle');
            }
            
            if($scope.tipoOperacion == "Editar Registro")
            {
                $scope.EditarDireccionPersona();
            }
        }
    };
    
    $scope.EditarDireccionPersona = function()
    {
        EditarDireccionPersona($http, CONFIG, $q, $scope.nuevoDomicilio).then(function(data)
        {
            if(data == "Exitoso")
            {
                $('#domicilioModal').modal('toggle');
                $scope.mensaje = "La dirección se ha editado.";
                
                DOMICILIO.TerminarEditarNuevoDomicilio($scope.nuevoDomicilio);
            }
            else
            {
                $scope.mensaje = "Ha ocurrido un error. Intente más tarde";   
            }
            $('#mensajeDomicilio').modal('toggle');
        }).catch(function(error)
        {
            $scope.mensaje = "Ha ocurrido un error. Intente más tarde. Error: " + error;
            $('#mensajeDomicilio').modal('toggle');
        });
    };
    
    $scope.ValidarDatos = function(domicilioInvalido, cpInvalido, coloniaInvalido)
    {
        $scope.mensajeError = [];
        
        if($scope.nuevoDomicilio.TipoMedioContacto.TipoMedioContactoId.length === 0)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*Selecciona un tipo de domicilio.";
            $scope.claseDomicilio.tipoMedio = "dropdownlistModalError";
        }
        else
        {
            $scope.claseDomicilio.tipoMedio = "dropdownlistModal";
        }
        
        if(domicilioInvalido)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*Escribe un domicilio válido.";
            $scope.claseDomicilio.domicilio = "entradaError";
        }
        else
        {
            $scope.claseDomicilio.domicilio = "entrada";
        }
        
        if(cpInvalido)
        {
            if($scope.nuevoDomicilio.Codigo === "NC.P.")
            {
                $scope.claseDomicilio.codigo = "entrada";
            }
            else if($scope.otraColonia)
            {
                if($scope.nuevoDomicilio.Codigo.length === 0)
                {
                    $scope.nuevoDomicilio.Codigo = "NC.P.";
                    $scope.claseDomicilio.codigo = "entrada";
                }
                else
                {
                    $scope.mensajeError[$scope.mensajeError.length] = "*El C.P. debe de tener 5 números o en dado que no se conosca estar vacio.";
                    $scope.claseDomicilio.codigo = "entradaError";
                }
            }
            else
            {
                $scope.mensajeError[$scope.mensajeError.length]= "*El C.P. debe de tener 5 números.";
                $scope.claseDomicilio.codigo = "entradaError";
            }
        }
        else
        {
            $scope.claseDomicilio.codigo = "entrada";
        }
        
        if($scope.nuevoDomicilio.Estado.length === 0)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*Selecciona un estado.";
            $scope.claseDomicilio.estado = "dropdownlistModalError";
        }
        else
        {
            $scope.claseDomicilio.municipio = "dropdownlistModal";
        }
        
        if($scope.nuevoDomicilio.Municipio.length === 0)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*Selecciona un municipio.";
            $scope.claseDomicilio.municipio = "dropdownlistModalError";
        }
        else
        {
            $scope.claseDomicilio.ciudad = "dropdownlistModal";
        }
        
        if($scope.nuevoDomicilio.Ciudad.length === 0)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*Selecciona una ciudad.";
            $scope.claseDomicilio.ciudad = "dropdownlistModalError";
        }
        else
        {
            $scope.claseDomicilio.estado = "dropdownlistModal";
        }
        
        if($scope.nuevoDomicilio.Colonia.length === 0 || ($scope.otraColonia && coloniaInvalido))
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*Indica una colonia.";
            $scope.claseDomicilio.colonia = "dropdownlistModalError";
        }
        else
        {
            $scope.claseDomicilio.colonia = "dropdownlistModal";
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
    
    $scope.CerrarDireccionModal = function()
    {
        $scope.mensajeError = [];
        $scope.claseDomicilio = {tipoMedio:"dropdownlistModal", tipo:"dropdownlistModal", codigo:"entrada", domicilio:"entrada", estado:"dropdownlistModal", municipio:"dropdownlistModal", ciudad:"dropdownlistModal", colonia:"dropdownlistModal", otra:"entrada"};
    };

});

app.factory('DOMICILIO',function($rootScope)
{
  var service = {};
  service.domicilio = null;
    
  service.AgregarDomicilio = function()
  {
      this.domicilio = null;
      $rootScope.$broadcast('AgregarDomicilio');
  };

  service.TerminarNuevoDomicilio = function(domicilio)
  {
      this.domicilio = SetDomicilio(domicilio);
      $rootScope.$broadcast('DomicilioAgregado');
  };
    
  service.EditarDomicilioNuevo = function(domicilio)
  {
      this.domicilio = domicilio;
      $rootScope.$broadcast('EditarDomicilioNuevo');
  };
    
  service.EditarDomicilioRegistrado = function(domicilio)
  {
      this.domicilio = SetDomicilio(domicilio);
      $rootScope.$broadcast('EditarDomicilioRegistrado');
  };
    
  service.TerminarEditarNuevoDomicilio = function(domicilio)
  {
      this.domicilio = domicilio;
      $rootScope.$broadcast('DomicilioEditado');
  };
    
  service.VerDomicilio = function(domicilio)
  {
      this.domicilio = domicilio;
      $rootScope.$broadcast('VerDetalle');
  };

  service.GetDomicilio = function()
  {
      return this.domicilio;
  };
    
  return service;
});


function SetDomicilio(data)
{
    var domicilio = new Domicilio();

    domicilio.DireccionPersonaId = data.DireccionPersonaId;
    domicilio.Domicilio = data.Domicilio;
    domicilio.Codigo = data.Codigo;
    domicilio.Estado = data.Estado;
    domicilio.Municipio = data.Municipio;
    domicilio.Ciudad = data.Ciudad;
    domicilio.Colonia = data.Colonia;
    domicilio.Activo = data.Activo;
    
    domicilio.Pais.PaisId = data.Pais.PaisId;
    
    
    domicilio.TipoMedioContacto.TipoMedioContactoId = data.TipoMedioContacto.TipoMedioContactoId;
    domicilio.TipoMedioContacto.Nombre = data.TipoMedioContacto.Nombre;
    
    return domicilio;
}