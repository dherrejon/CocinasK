app.controller("ColaboradorControlador", function($scope, $http, $q, CONFIG, datosUsuarioPerfil, md5, $rootScope, datosUsuario, $window)
{   
    $rootScope.clasePrincipal = "";  //si esta en el login muestra una cocina de fondo
    
     /*----------------verificar los permisos---------------------*/
    $scope.permisoUsuario = {consultar:false, agregar:false, editar: false, activar:false, verUsuario: false, agregarUsuario:false, activarUsuario:false}; // esta variable nos indica con que permisos cuenta el usuario en este modulo
    // Indentifica con que permisos cuenta el usuario 
    //si el usuario cuenta con un determinda permiso se le habilitará para que pueda realizar la operacion de dicho permiso
    $scope.IdentificarPermisos = function()
    {
        for(var k=0; k < $scope.usuarioLogeado.Permiso.length; k++)
        {
            if($scope.usuarioLogeado.Permiso[k] == "AdmColConsultar")
            {
                $scope.permisoUsuario.consultar = true;
            }
            else if($scope.usuarioLogeado.Permiso[k] == "AdmColAgregar")
            {
                $scope.permisoUsuario.agregar = true;
            }
            else if($scope.usuarioLogeado.Permiso[k] == "AdmColEditar")
            {
                $scope.permisoUsuario.editar = true;
            }
            else if($scope.usuarioLogeado.Permiso[k] == "AdmColActivar")
            {
                $scope.permisoUsuario.activar = true;
            }
            else if($scope.usuarioLogeado.Permiso[k] == "AdmUsuPerfil")
            {
                $scope.permisoUsuario.verUsuario = true;
            }
            else if($scope.usuarioLogeado.Permiso[k] == "AdmUsuAgregar")
            {
                $scope.permisoUsuario.agregarUsuario = true;
            }
            else if($scope.usuarioLogeado.Permiso[k] == "AdmUsuActivar")
            {
                $scope.permisoUsuario.activarUsuario = true;
            }
        }
    };
    
    $scope.buscar = "";                     //guarda el texto por el cual se esta realizando la búsqueda
    $scope.ordenarPor = "PrimerApellido";  //Guarda el campo por el cual se ordenará la tabla principal
    
    $scope.mostrarFiltro = {tipoUnidad:true, unidad:false, activo:false, usuario:false}; //Muestra las opciones del campo seleccionado para filtrar
    $scope.filtro = {tipoUnidad:[], unidad:[], activo:{activo:false, inactivo:false}, usuario:{activo:false, inactivo:false}};   //Indica las opciones que estan seleccionadas para aplicar el filtro
    $scope.filtroTipoUnidad = [];  //Muestra los tipo de unidades por los que se puede filtrat
    $scope.filtroUnidad = [];      //muestra las unidades de negocio por las que se pueden filtrar
    
    $scope.perfil = GetPerfil();   //guarda los perfiles que puede tener un usuario
    
    //Obtine los colaboradores dados de alta
    $scope.GetColaboradores = function()              
    {
        GetColaboradores($http, $q, CONFIG).then(function(data)
        {
            if(data.length > 0)
            {
                $scope.colaborador = data;
            }
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    /*----------------------------Detalles----------------*/
    
    //Abre le panel de detalles
    //Copia el colaborador seleccionado y lo guarda en una nueva variable los datos del colaborador se muestran en un panel 
    $scope.MostarDetalles = function(colaborador)
    {
        $scope.nuevoColaborador = colaborador;
        $scope.GetContactoColaborador(colaborador.ColaboradorId);
        
        if(colaborador.UsuarioId !== null)
        {
            $scope.GetPerfilPorUsuario(colaborador.UsuarioId);
        }
    };
    
    /*Agregar un usuario desde la tabla principal*/
    //Se copia los datos del colaborador seleccionado en una nueva variable y se abre el panel para agregar un usuario
    $scope.AbrirAgregarUsuarioTabla = function(colaborador)
    {
        $scope.nuevoColaborador = colaborador;
        $scope.AbrirAgregarUsuario();
    };
    
    
    /*-------mostrar el perfil del usuario del colaborador-------------*/
    $scope.MostrarUsuarioPefil = function(usuario)
    {
        datosUsuarioPerfil.setUsuario(usuario);
        $scope.GetContactoColaborador(usuario.ColaboradorId);
        $scope.GetPerfilPorUsuario(usuario.UsuarioId);
    };
    
    //obtiene todos los medio de contacto del colaborador espeficicado
    $scope.GetContactoColaborador = function(id)
    {
        GetContactoColaborador($http, $q, CONFIG, id).then(function(data)
        {
            if(data[0].Estatus == "Exito")
            {
                $scope.contactoColaborador = data[1].Contacto;
                datosUsuarioPerfil.setContacto(data[1].Contacto);
            }
            else
            {
                $scope.contactoColaborador = [];
                alert("Ha ocurrido un error al obtener los medio de contacto del usuario.");            
            }
        }).catch(function(error)
        {
            alert("Ha ocurrido un error al obtener los medio de contacto del usuario." + error);
            $scope.contactoColaborador = [];
        });
    };
    
    //obtiene los perfiles habilitados de un usuario en especifico
    $scope.GetPerfilPorUsuario = function(id)
    {
        GetPerfilPorUsuario($http, $q, CONFIG, id).then(function(data)
        {
            if(data[0].Estatus == "Exito")
            {
                for(var i=0; i<$scope.perfil.length; i++)
                {
                    $scope.perfil[i].Activo = false;
                    for(var j=0; j<data[1].Perfil.length; j++)
                    {
                        if($scope.perfil[i].PerfilId == data[1].Perfil[j].PerfilId)
                        {
                            $scope.perfil[i].Activo = true;
                            break;
                        }
                    }
                }
                 
                datosUsuarioPerfil.setPerfil($scope.perfil);
            }
            else
            {
                $scope.contactoColaborador = [];
                alert("Ha ocurrido un error al obtener los perfiles del usuario.");            
            }
        }).catch(function(error)
        {
            alert("Ha ocurrido un error al obtener los perfiles del usuario." + error);
            $scope.contactoColaborador = [];
        });
    };
    
    /*-------------------------Activar-Desativar usuario---------------------------------------------*/
    // activa- desactiva desde el modal de detalle
    // guarda el colaborador seleccionado en un nueva variable y llama la funcion pra que se confirme la operacion
    $scope.CambiarActivoModal = function()   
    {
        $scope.nuevoColaborador.Activo = !$scope.nuevoColaborador.Activo;
        $scope.ConfirmarCambiarActivo($scope.nuevoColaborador);
    };
    
    //Se abre el panel para que el usuario confirme o no el cambio de estado activo
    $scope.ConfirmarCambiarActivo = function(colaborador)
    {
        $scope.nuevoColaborador = colaborador;
        if(colaborador.Activo)
        {
            $scope.mensajeAdvertencia = "¿Estas seguro de ACTIVAR - " + colaborador.Nombre + " " + colaborador.PrimerApellido + " " + colaborador.SegundoApellido + "? Si activas al colaborador, también se activará su usuario, si es que contaba con uno.";
        }
        else
        {
            $scope.mensajeAdvertencia = "¿Estas seguro de DESACTIVAR - " + colaborador.Nombre + " " + colaborador.PrimerApellido + " " + colaborador.SegundoApellido + "? Si desactiva al colaborador, también se desactivara su usuario, si es que cuenta con uno.";
        }
        $('#modalActivoColaborador').modal('toggle'); 
    };
    
    //Se confirmo que el estatus de activo será cambiado
    //se manda a llamar el método correspondiente para que realice el update en la base de datos
    $scope.ConfirmarActualizarColaborador = function()
    {
        var datos = [4];
        if($scope.nuevoColaborador.Activo)
        {
            datos[1] = 1;
            datos[3] = 1;
        }
        else
        {
            datos[1] = 0;
            datos[3] = 0;
        }
        datos[0] = $scope.nuevoColaborador.ColaboradorId;
        datos[2] = $scope.nuevoColaborador.UsuarioId;
        
        ActivarDesactivarColaborador($http, $q, CONFIG, datos).then(function(data)
        {
            if(data[0].Estatus == "Exito")
            {
                $scope.mensaje = "El colaborador se ha actualizado correctamente.";
                if($scope.nuevoColaborador.Activo)
                {
                    $scope.nuevoColaborador.ActivoN = 1;
                    $scope.nuevoColaborador.ActivoUsuario = true;
                }
                else
                {
                    $scope.nuevoColaborador.ActivoN = 0;
                    $scope.nuevoColaborador.ActivoUsuario = false;
                }
            }
            else
            {
                $scope.nuevoColaborador.Activo = !$scope.nuevoColaborador.Activo;
                $scope.mensaje = "Ha ocurrido un error. Intente más tarde.";
            }
        }).catch(function(error)
        {
            $scope.nuevoColaborador.Activo = !$scope.nuevoColaborador.Activo;
            $scope.mensaje = "Ha ocurrido un error. Intente más tarde." + error;
        });
        $('#mensajeColaborador').modal('toggle');
    };
    
    //Se denego el cambio de estatus de activo
    $scope.CancelarCambioActivo = function()
    {  
        $scope.nuevoColaborador.Activo = !$scope.nuevoColaborador.Activo;
    };
    
    
    /*----------Activar-Desactivar usuario -------------------*/
    //Se abre el panel para confirmar si se cambia el estatus de activo del usuario del colaborador
    $scope.CambiarActivoUsuario = function()
    {
        if(!$scope.nuevoColaborador.Activo && $scope.nuevoColaborador.ActivoUsuario)
        {
            $scope.nuevoColaborador.ActivoUsuario = false;
            $scope.mensaje = "Para poder activar al usuario primeramente debe de activar al colaborador";
            $('#mensajeColaborador').modal('toggle');
            return;
        }
        else if($scope.nuevoColaborador.ActivoUsuario)
        {
            $scope.mensajeAdvertencia = "¿Estas seguro de ACTIVAR el usuario " + $scope.nuevoColaborador.NombreUsuario  + "?";
        }
        else
        {
            $scope.mensajeAdvertencia = "¿Estas seguro de DESACTIVAR el usuario - " + $scope.nuevoColaborador.NombreUsuario +  "?";
        }
        $('#modalActivoUsuario').modal('toggle'); 
    };
    
    //Se confirmo que se desea cambiar el estaus de activo del usuario del colaborador
    //Se manda a llamar el metodo correspondiente para actualizar el usuario
    $scope.ConfirmarActualizarUsuario = function()
    {
        var datos = [2];
        if($scope.nuevoColaborador.ActivoUsuario)
        {
            datos[1] = 1;
        }
        else
        {
            datos[1] = 0;
        }
        datos[0] = $scope.nuevoColaborador.UsuarioId;
        
        ActivarDesactivarUsuario($http, $q, CONFIG, datos).then(function(data)
        {
            if(data[0].Estatus == "Exito")
            {
                $scope.mensaje = "El usuario se ha actualizado correctamente.";
            }
            else
            {
                $scope.nuevoColaborador.ActivoUsuario = !$scope.nuevoColaborador.ActivoUsuario;
                $scope.mensaje = "Ha ocurrido un error. Intente más tarde.";
            }
        }).catch(function(error)
        {
            $scope.nuevoColaborador.ActivoUsuario = !$scope.nuevoColaborador.ActivoUsuario;
            $scope.mensaje = "Ha ocurrido un error. Intente más tarde." + error;
        });
        $('#mensajeColaborador').modal('toggle');
    };
    
    //Se denego la operacion de cambiar el estatus de activo del usuario
    $scope.CancelarCambioActivoUsuario = function()
    {
        $scope.nuevoColaborador.ActivoUsuario = !$scope.nuevoColaborador.ActivoUsuario;
    };
    
    /*----------ordenar-----------------*/
    //oredena por el campo seleccionado, si el campo es el mismo que el anterior lo ordena de manera descendente
    $scope.CambiarOrdenar = function(campoOrdenar)
    {
        if($scope.ordenarPor == campoOrdenar)
        {
            $scope.ordenarPor = "-" + campoOrdenar;
        }
        else
        {
            $scope.ordenarPor = campoOrdenar;
        }
    };
    
    /*---------------Filtrar--------------------------*/
    //Método que se utiliza en el filter del ng-repeat para filtrar los colaboradores
    //regresa true si cumple con algunos de los filtros, regresa "false" sino cumple con ninguno de los filtros
    $scope.FiltrarColaborador = function(colaborador)
    {
        if($scope.filtro.activo.activo !== $scope.filtro.activo.inactivo)
        {
            if($scope.filtro.activo.activo)
            {
                if(!colaborador.Activo)
                {
                    return false;
                }
            }
            
            if($scope.filtro.activo.inactivo)
            {
                if(colaborador.Activo)
                {
                    return false;
                }
            }
        }

        if($scope.filtro.usuario.activo !== $scope.filtro.usuario.inactivo)
        {
            
            if($scope.filtro.usuario.activo)
            {
                if(colaborador.UsuarioId === null)
                {
                    return false;
                }
            }
            
            if($scope.filtro.usuario.inactivo)
            {
                if(colaborador.UsuarioId !== null)
                {
                    return false;
                }
            }
        }
        
        if($scope.filtroTipoUnidad.length === 0 && $scope.filtroUnidad.length === 0)
        {
           return true; 
        }
        
        var cumpleFiltro = false;
        if($scope.filtroTipoUnidad.length === 0)
        {
            cumpleFiltro = true;
        }
        else
        {
            for(var k=0; k<$scope.filtroTipoUnidad.length; k++)
            {
                if($scope.filtroTipoUnidad[k] == colaborador.NombreTipoUnidadNegocio)
                {
                    cumpleFiltro = true;
                    break;
                }
            }
        }
        if(!cumpleFiltro)
        {
            return false;
        }
        
        cumpleFiltro = false;
        if($scope.filtroUnidad.length === 0)
        {
            cumpleFiltro = true;
        }
        else
        {
            for(var k=0; k<$scope.filtroUnidad.length; k++)
            {
                if($scope.filtroUnidad[k] == colaborador.NombreUnidadNegocio)
                {
                    cumpleFiltro = true;
                    break;
                }
            }
        }
        if(!cumpleFiltro)
        {
            return false;
        }
        
        
        return true;
    };
    
    //Se insertan las opciones seleccionadas para filtrar
    $scope.setFilter = function(filtro, campo)
    {
        if(filtro == "tipoUnidad")
        {
            for(var k=0; k<$scope.filtroTipoUnidad.length; k++)
            {
                if($scope.filtroTipoUnidad[k] == campo)
                {
                    $scope.filtroTipoUnidad.splice(k,1);
                    return;
                }
            }
            $scope.filtroTipoUnidad.push(campo);
            return;
        }
        else if(filtro == "unidad")
        {
            for(var k=0; k<$scope.filtroUnidad.length; k++)
            {
                if($scope.filtroUnidad[k] == campo)
                {
                    $scope.filtroUnidad.splice(k,1);
                    return;
                }
            }
            $scope.filtroUnidad.push(campo);
            return;
        }
     };
    
    //muestra o ocultas las opcines de un campo para filtrar
    $scope.MostrarFiltros = function(campo)
    {
        if(campo == "tipoUnidad")
        {
            $scope.mostrarFiltro.tipoUnidad = !$scope.mostrarFiltro.tipoUnidad;
        }
        else if(campo == "unidad")
        {
            $scope.mostrarFiltro.unidad = !$scope.mostrarFiltro.unidad;
        }
        else if(campo == "activo")
        {
            $scope.mostrarFiltro.activo = !$scope.mostrarFiltro.activo;
        }
        else if(campo == "usuario")
        {
            $scope.mostrarFiltro.usuario = !$scope.mostrarFiltro.usuario;
        }
    };
    
    //Limpia todos los filtros que se hayan seleccionado
    $scope.LimpiarFiltro = function()
    {
        $scope.filtroTipoUnidad = [];
        $scope.filtroUnidad = [];
        $scope.mostrarFiltro = {tipoUnidad:true, unidad:false, activo:false, usuario:false};
        $scope.filtro = {tipoUnidad:[], unidad:[], activo:{activo:false, inactivo:false}, usuario:{activo:false, inactivo:false}};
    };
        
    /*----------------------------------------------Abrir modal para agregar o editar colaborador------------------------------*/
    //esta varible cambia la clase de una entrada de dato en especifico
    //indica que existe un error en el momento que se inserto o modifico un dato o indica que dato es invalido
    $scope.clase = {nombre:"entrada", primerApellido:"entrada", segundoApellido:"entrada", domicilio:"entrada", cp:"entrada", estado:"dropdownListModal",
                   municipio:"dropdownListModal", ciudad:"dropdownListModal", colonia:"dropdownListModal", otraColonia:"entrada",
                   telefono:"entrada", telefonoD:"dropdownListModal", correo:"entrada", correoD:"dropdownListModal", tipoUnidad:"dropdownListModal", unidad:"dropdownListModal"};
    
    $scope.unidadNegocio = null;        //guarda las unidades de negocio
    $scope.tipoMedioContacto = null;    //guarda los tipo de medio de contacto
    
    $scope.nuevoTelefono = "";  //guarda un teléfono que se este ingresando
    $scope.nuevoCorreo = "";    //guarda un nuevo correo que se este ingresando
    $scope.tipoTelefonoSeleccionado = {tipo:"", id:""};  //indica que tipo de telefono se seleccionó
    $scope.tipoCorreoSeleccionado = {tipo:"", id:""};   //indica que tipo de email se seleccionó
       
    //abre el modal para editar o agregar un colaborador
    //detecta la operacion correspondiente, si se quiere agregar o editar
    $scope.AbrirColaboradorModal = function(colaborador, operacion)
    {
        $scope.operacion = operacion;
        $scope.sinCP = false;
        
        if(operacion == "Agregar")
        {
            $scope.nuevoColaborador = new Colaborador();
            $scope.contactoColaborador = [];
        }
        else if(operacion == "Editar")
        {
            $scope.nuevoColaborador = SetColaborador(colaborador);
            $scope.GetContactoColaborador(colaborador.ColaboradorId);
            
            if($scope.nuevoColaborador.Codigo != "NC.P.")
            {
                GetCodigoPostal($http, $q, CONFIG, $scope.nuevoColaborador.Codigo).then(function(data)
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
            else if($scope.nuevoColaborador.Codigo == "NC.P.")
            {
                $scope.sinCP = true;
                $scope.GetColoniaEstado($scope.nuevoColaborador.Estado);
            }
                
        }
        
        if($scope.tipoMedioContacto === null)
        {
            $scope.GetTipoMedioContacto();
        }
        else if($scope.tipoTelefonoSeleccionado.tipo === "" || $scope.tipoCorreoSeleccionado.tipo === "")
        {
            $scope.IniciarTipoMedioContacto();
        }
        
        if($scope.unidadNegocio === null)
        {
            $scope.GetUnidadNegocio();
        }
        
        $scope.otraColonia = false;
        $('#colaboradorModal').modal('toggle');
    };
    
    //se cancelo agregar o editar el colaborador
    //se limpian las varibles que se pudieron haber modificado en el panel
    $scope.CerrarColaboradorForma = function()
    {
        $scope.nuevoContactoColaborador = [];
        $scope.mensajeErrorTelefono = [];
        $scope.mensajeErrorCorreo = [];
        $scope.mensajeError = [];
        $scope.nuevoCorreo = "";
        $scope.nuevoTelefono = "";
        
        $scope.editarContacto = {realizar:false, origen:"", tipoContacto:""}; 
        
        $scope.clase = {nombre:"entrada", primerApellido:"entrada", segundoApellido:"entrada", domicilio:"entrada", cp:"entrada", estado:"dropdownListModal",
                   municipio:"dropdownListModal", ciudad:"dropdownListModal", colonia:"dropdownListModal", otraColonia:"entrada",
                   telefono:"entrada", telefonoD:"dropdownListModal", correo:"entrada", correoD:"dropdownListModal", tipoUnidad:"dropdownListModal", unidad:"dropdownListModal"};
    };
    
    /*------------------------Telefono--------------------------------*/
    $scope.nuevoContactoColaborador = []; // guarda todos los telefonos y emails agregados
    $scope.mensajeErrorTelefono = [];     // Indica si existe un error en el teléfono que se desea agregar
    $scope.mensajeErrorCorreo = [];       // Indica si existe un error en el email que se desea agregar
    
    //Se selecciono un tipo de telefono
    $scope.CambiarTelefono = function(tipo)
    {
        $scope.tipoTelefonoSeleccionado.tipo = tipo.Nombre;
        $scope.tipoTelefonoSeleccionado.id = tipo.TipoMedioContactoId;
    };
    
    //verifica que el telefono sea valido y lo agrega si es asi
    $scope.AgregarTelefono = function(telefonoInvalido)
    {
        $scope.mensajeErrorTelefono = [];
        if(telefonoInvalido)
        {
            $scope.clase.telefono = "entradaError";
            $scope.mensajeErrorTelefono[$scope.mensajeErrorTelefono.length] = "*Escribe un número telefónico valido.";
        }
        else
        {
            $scope.clase.telefono = "entrada";
        }
        if($scope.tipoTelefonoSeleccionado.tipo === "")
        {
            $scope.mensajeErrorTelefono[$scope.mensajeErrorTelefono.length] = "*Selecciona un tipo de teléfono.";
            $scope.clase.telefonoD = "dropdownListModalError";
        }
        else
        {
            $scope.clase.telefonoD = "dropdownListModal";
        }
        
        if($scope.mensajeErrorTelefono.length > 0)
        {
            return;
        }
        
        for(var k=0; k<$scope.contactoColaborador.length; k++)
        {
            if($scope.contactoColaborador[k].Contacto == $scope.nuevoTelefono)
            {
                $scope.mensajeErrorTelefono[$scope.mensajeErrorTelefono.length] = "*" + $scope.nuevoTelefono + " ya existe.";
                $scope.clase.telefono = "entradaError";
                return;
            }
        }
        
        for(var k=0; k<$scope.nuevoContactoColaborador.length; k++)
        {
            if($scope.nuevoContactoColaborador[k].Contacto == $scope.nuevoTelefono)
            {
                $scope.mensajeErrorTelefono[$scope.mensajeErrorTelefono.length] = "*" + $scope.nuevoTelefono + " ya existe.";
                $scope.clase.telefono = "entradaError";
                return;
            }
        }
        
        
        console.log($scope.editarContacto.tipoContacto);
        if( $scope.editarContacto.origen != "registrado" || $scope.editarContacto.tipoContacto != "telefono")
        {
            var datosContactoColaborador = {NombreMedioContacto:"", TipoMedioContactoId:"", NombreTipoMedioContacto:"", Contacto:""};
            datosContactoColaborador.NombreMedioContacto = "Teléfono";
            datosContactoColaborador.TipoMedioContactoId = $scope.tipoTelefonoSeleccionado.id;
            datosContactoColaborador.NombreTipoMedioContacto = $scope.tipoTelefonoSeleccionado.tipo;
            datosContactoColaborador.Contacto = $scope.nuevoTelefono;
            $scope.nuevoContactoColaborador[ $scope.nuevoContactoColaborador.length] = datosContactoColaborador;
        }
        else
        {
            $scope.EditarContactoColaborador();
        }
        
        $scope.editarContacto = {realizar:false, origen:"", tipoContacto:""}; 
        $scope.nuevoTelefono = "";
    };
        
    /*Borrar contaco del colaborador*/
    //se abre un panel para confirma borrar un telefono o email del colaborador que esta ya guardado en la base de datos
    $scope.AbrirModalEliminarContacto = function(contacto)
    {
        $scope.contactoCambiar = contacto;
        $scope.mensajeAdvertenciaContacto = "¿Estas seguro de elminar el contacto " + $scope.contactoCambiar.Contacto + "?";
        
        $('#modalEliminarContacto').modal('toggle');
    };
    
    //Se confirma que se eleimina un contacto del colaborador
    $scope.ConfirmarEliminarContacto = function()
    {  
        EliminarContactoColaborador($http, $q, CONFIG, $scope.contactoCambiar.MedioContactoColaboradorId).then(function(data)
        {
            if(data[0].Estatus == "Exito")
            {
                $scope.mensaje = "El contacto del colabodor se elimino correctamente";
                $('#mensajeColaborador').modal('toggle');
                $scope.GetContactoColaborador($scope.nuevoColaborador.ColaboradorId);
            }
            else
            {
                alert("Ha ocurrido un error. Intente más tarde.");
            }
        }).catch(function(error)
        {
            alert("Ha ocurrido un error. Intente más tarde." +error);
            return;
        });
        
        $scope.mensajeAdvertenciaContacto = "";
    };
    
    //Se cancela la peticion para eliminar un contacto del colaborador
    $scope.CancelarEliminarContacto = function()
    {  
        $scope.contactoCambiar = "";
    };
    
    //Se elminará un contacto del colaborador que recien se agrego y aún no esta en la base de datos 
    $scope.BorrarContactoAgregado = function(contacto)
    {
        for(var k=0; k<$scope.nuevoContactoColaborador.length; k++)
        {
            if($scope.nuevoContactoColaborador[k].Contacto == contacto)
            {
                $scope.nuevoContactoColaborador.splice(k,1);
                break;
            }
        }
    };
    /*Editar contacto*/
    //Si el origen del contacto es "nuevo" entonces simplemete se editara si es "registrado" se llama a otro metodo para que se mdifique de la DB
    $scope.EditarContactoAgregado = function(contacto, origen)
    {
        $scope.contactoCambiar = contacto;
        
        if(contacto.NombreMedioContacto == "Teléfono")
        {
            $scope.tipoTelefonoSeleccionado.tipo = contacto.NombreTipoMedioContacto;
            $scope.tipoTelefonoSeleccionado.id = contacto.TipoMedioContactoId;
            $scope.nuevoTelefono = contacto.Contacto;
            
            $scope.editarContacto.tipoContacto = "telefono";
        }
        else if(contacto.NombreMedioContacto == "Correo Electrónico")
        {
            $scope.tipoCorreoSeleccionado.tipo = contacto.NombreTipoMedioContacto;
            $scope.tipoCorreoSeleccionado.id = contacto.TipoMedioContactoId;
            $scope.nuevoCorreo = contacto.Contacto;
            
            $scope.editarContacto.tipoContacto = "correo";
        }
        
        $scope.editarContacto.realizar = true;
        $scope.editarContacto.origen = origen;
        
        if(origen == "nuevo")
        {
            for(var k=0; k<$scope.nuevoContactoColaborador.length; k++)
            {
                if($scope.nuevoContactoColaborador[k] == contacto)
                {
                    $scope.nuevoContactoColaborador.splice(k,1);
                    break;
                }
            }
        }
        else if(origen == "registrado")
        {
            for(var k=0; k<$scope.contactoColaborador.length; k++)
            {
                if($scope.contactoColaborador[k] == contacto)
                {
                    $scope.contactoColaborador.splice(k,1);
                    break;
                }
            } 
        }
    };
    
    //Se edita un contacto del colaborador que se encuentra en la base de datos
    //Se mando a llamar el método correspondiente para que se haga el update en la base de datos
    $scope.EditarContactoColaborador = function()
    {
        var contactoEditado = {Contacto:"", TipoMedioContactoId:"", MedioContactoColaboradorId:""};
        if($scope.editarContacto.tipoContacto == "telefono")
        {
            contactoEditado.Contacto = $scope.nuevoTelefono;
            contactoEditado.TipoMedioContactoId = $scope.tipoTelefonoSeleccionado.id;
        }
        
        if($scope.editarContacto.tipoContacto == "correo")
        {
            contactoEditado.Contacto = $scope.nuevoCorreo;
            contactoEditado.TipoMedioContactoId = $scope.tipoCorreoSeleccionado.id;
        }
        
        contactoEditado.MedioContactoColaboradorId = $scope.contactoCambiar.MedioContactoColaboradorId;
        
        EditarContactoColaborador($http, CONFIG, $q, contactoEditado).then(function(data)
        {
            if(data == "Exitoso")
            {
                $scope.mensaje = "El contacto del colabodor se ha actualizado.";
                $('#mensajeColaborador').modal('toggle');
                $scope.GetContactoColaborador($scope.nuevoColaborador.ColaboradorId);
            }
            else
            {
                $scope.contactoColaborador[$scope.contactoColaborador.length] = $scope.contactoCambiar;
                alert("Ha ocurrido un error. Intente más tarde.");
            }
        }).catch(function(error)
        {
            $scope.contactoColaborador[$scope.contactoColaborador.length] = $scope.contactoCambiar;
            alert("Ha ocurrido un error. Intente más tarde." +error);
            return;
        });
    };
    
    //Se cancelo la edicion del contacto
    //El contacto regresa a lista de contactos de colaborador como se habia registrado anteiormente
    $scope.CancelarEdicion = function()
    {
        if($scope.editarContacto.origen == "nuevo")
        {
            $scope.nuevoContactoColaborador[$scope.nuevoContactoColaborador.length] = $scope.contactoCambiar;
        }
        else if($scope.editarContacto.origen == "registrado")
        {
            $scope.contactoColaborador[$scope.contactoColaborador.length] = $scope.contactoCambiar;
        }
        
        $scope.editarContacto = {realizar:false, origen:"", tipoContacto:""}; 
        $scope.nuevoCorreo = "";
        $scope.nuevoTelefono = "";
    };
    
    /*------------------Correo Electronico--------------------------------*/
    $scope.editarContacto = {realizar:false, origen:"", tipoContacto:""}; //se utiliza para cuando se va a editar un contacto del colaborador
    $scope.contactoCambiar = ""; //indica que contacto se va a editar o eleminar
    
    //se selecciono un tipo de correo electrónico
    $scope.CambiarEmail = function(tipo)
    {
        $scope.tipoCorreoSeleccionado.tipo = tipo.Nombre;
        $scope.tipoCorreoSeleccionado.id = tipo.TipoMedioContactoId;
    };
    
    //Valida que el correo electronico que se desea agregar sea valido, si es así lo agrega temporalmente
    $scope.AgregarCorreo = function(correoInvalido)
    {
        $scope.mensajeErrorCorreo = [];
        if(correoInvalido)
        {
            $scope.clase.correo = "entradaError";
            $scope.mensajeErrorCorreo[$scope.mensajeErrorCorreo.length] = "*Escribe un correo electrónico valido.";
        }
        else
        {
            $scope.clase.correo = "entrada";
        }
        if($scope.tipoCorreoSeleccionado.tipo === "")
        {
            $scope.mensajeErrorCorreo[$scope.mensajeErrorCorreo.length] = "*Selecciona un tipo de correo.";
            $scope.clase.correoD = "dropdownListModalError";
        }
        else
        {
            $scope.clase.correoD = "dropdownListModal";
        }
        
        if($scope.mensajeErrorCorreo.length > 0)
        {
            return;
        }
        
        for(var k=0; k<$scope.contactoColaborador.length; k++)
        {
            if($scope.contactoColaborador[k].Contacto == $scope.nuevoCorreo)
            {
                $scope.mensajeErrorCorreo[$scope.mensajeErrorCorreo.length] = "*" + $scope.nuevoCorreo + " ya existe.";
                $scope.clase.correo = "entradaError";
                return;
            }
        }
        
        for(var k=0; k<$scope.nuevoContactoColaborador.length; k++)
        {
            if($scope.nuevoContactoColaborador[k].Contacto == $scope.nuevoCorreo)
            {
                $scope.mensajeErrorCorreo[$scope.mensajeErrorCorreo.length] = "*" + $scope.nuevoCorreo + " ya existe.";
                $scope.clase.correo = "entradaError";
                return;
            }
        }
        
        if($scope.editarContacto.origen  != "registrado" || $scope.editarContacto.tipoContacto != "correo")
        {
            var datosContactoColaborador = {NombreMedioContacto:"", TipoMedioContactoId:"", NombreTipoMedioContacto:"", Contacto:""};
            datosContactoColaborador.NombreMedioContacto = "Correo Electrónico";
            datosContactoColaborador.TipoMedioContactoId = $scope.tipoCorreoSeleccionado.id;
            datosContactoColaborador.NombreTipoMedioContacto = $scope.tipoCorreoSeleccionado.tipo;
            datosContactoColaborador.Contacto = $scope.nuevoCorreo;
            $scope.nuevoContactoColaborador[ $scope.nuevoContactoColaborador.length] = datosContactoColaborador;
        }
        else
        {
            $scope.EditarContactoColaborador();
        }
        
        $scope.editarContacto = {realizar:false, origen:"", tipoContacto:""}; 
        $scope.nuevoCorreo = "";
    };
    
     /*-------Dirección------*/
    $scope.sinCP = false;
    $scope.otraColonia = false;
    $scope.estadoMexico = null;
    
    //indica si se conoce el codigo postal o no
    $scope.ConocerCP = function()  
    {
        $scope.sinCP = !$scope.sinCP; 
        $scope.otraColonia = false;

        $scope.nuevoColaborador.Estado  = "";
        $scope.nuevoColaborador.Municipio  ="";
        $scope.nuevoColaborador.Colonia  ="";
        $scope.nuevoColaborador.Ciudad  ="";
        $scope.nuevoColaborador.Codigo  ="";
        
        if($scope.estadoMexico === null)
        {
            $scope.GetMexicoEstados();
        }
        
    };
    
    //identifica cuando el codigo postal cambia, por lo tanto obtiene los datos relacionados con ese cp
    $scope.CambiarCodigo = function()  
    {
        if($scope.nuevoColaborador.Codigo.length == 5)
        {
            GetCodigoPostal($http, $q, CONFIG, $scope.nuevoColaborador.Codigo).then(function(data)
            {
                if(data.length > 0)
                {
                    $scope.codigoPostal = data;
                    $scope.nuevoColaborador.Estado = data[0].Estado;
                    $scope.nuevoColaborador.Municipio = data[0].Municipio;
                    $scope.nuevoColaborador.Ciudad = data[0].Ciudad;
                    $scope.nuevoColaborador.Colonia = data[0].Colonia;
                }
            }).catch(function(error)
            {
                alert("Ha ocurrido un error. Intenta más tarde." + error);
            });
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
        if( $scope.nuevoColaborador.Estado != estado)
        {
            $scope.nuevoColaborador.Estado = estado;

            if($scope.sinCP)
            {
                GetCodigoPostal($http, $q, CONFIG, estado).then(function(data)
                {
                    $scope.codigoPostal = data;
                    $scope.nuevoColaborador.Municipio = "";
                    $scope.nuevoColaborador.Ciudad = ""; 
                    $scope.nuevoColaborador.Colonia = ""; 
                    $scope.nuevoColaborador.Codigo = "";
                    
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
        if($scope.nuevoColaborador.Municipio != municipio)
        {
            $scope.nuevoColaborador.Municipio = municipio;
            $scope.nuevoColaborador.Colonia = ""; 
            $scope.nuevoColaborador.Codigo = "";
            $scope.nuevoColaborador.Ciudad = "";
            for(var k=0; k<$scope.codigoPostal.length; k++)
            {
                if($scope.codigoPostal[k].Municipio == $scope.nuevoColaborador.Municipio)
                {
                    $scope.nuevoColaborador.Ciudad = $scope.codigoPostal[k].Ciudad;
                    break;
                }
            }
        }
    };
    
    //Se selecciono una ciudad distinto al seleccionado
    $scope.CambiarCiudad = function(ciudad)
    {
        if($scope.nuevoColaborador.Ciudad != ciudad)
        {
            $scope.nuevoColaborador.Ciudad = ciudad;
            $scope.nuevoColaborador.Colonia = "";
            $scope.nuevoColaborador.Codigo = "";
        }   
    };
    
    //Se selecciono una colonia distinta
    //si se indico que no se conocia el C.P. se obtendra este por medio de todos los datos indicados
    $scope.CambiarColonia = function (colonia)
    {
        if(colonia === "OtraColonia")
        {
            $scope.otraColonia = true; 
            $scope.nuevoColaborador.Colonia = "";
            if($scope.sinCP)
            {
                $scope.nuevoColaborador.Codigo = "";
            }
        }
        else
        {
            $scope.otraColonia = false; 
            $scope.nuevoColaborador.Colonia = colonia;
            
            if($scope.sinCP)                                       //Obteber el código postal 
            {
                for(var k=0; k<$scope.codigoPostal.length; k++)
                {
                    if($scope.codigoPostal[k].Municipio == $scope.nuevoColaborador.Municipio && $scope.codigoPostal[k].Ciudad == $scope.nuevoColaborador.Ciudad && $scope.codigoPostal[k].Colonia == $scope.nuevoColaborador.Colonia)
                    {
                        $scope.nuevoColaborador.Codigo = $scope.codigoPostal[k].Codigo;
                        break;
                    }
                }
            }
        }
    };
    
    //Se obtienen lo estados de México del catálogo
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
    
    /*---------------------agregar - editar colaborador--------------------*/
    //Se preciono el botón "TERMINAR" del panel donde se edita o agrega un colaborar
    //Valida que los datos ingresado sean correctos
    //Si los datos son valido se procede a agregar o editar el colaborador
    $scope.TerminarColaborador = function(nombreInvalido, apellido1Invalido, apellido2Invalido, domicilioInvalido, codigoInvalido, coloniaInvalida)
    {
        $scope.mensajeError = [];
        
        if(nombreInvalido)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*Escribe un nombre valido.";
            $scope.clase.nombre = "entradaError";
        }
        else
        {
            $scope.clase.nombre = "entrada";
        }
        
        if(apellido1Invalido)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*El primer apellido es invalido. Escribe un apellido valido.";
            $scope.clase.primerApellido = "entradaError";
        }
        else
        {
            $scope.clase.primerApellido = "entrada";
        }
        if(apellido2Invalido)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*El segundo apellido es invalido. Escribe un apellido valido.";
            $scope.clase.segundoApellido = "entradaError";
        }
        else
        {
            $scope.clase.segundoApellido = "entrada";
        }
        if(domicilioInvalido)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*El domicilio solo puede tener los siguientes caracteres: letras, números, '.', '+', '-' y '#'.";
            $scope.clase.domicilio = "entradaError";
        }
        else
        {
            $scope.clase.domicilio = "entrada";
        }
        if(codigoInvalido)
        {
            if($scope.nuevoColaborador.Codigo === "NC.P.")
            {
                $scope.clase.cp = "entrada";
            }
            else if($scope.otraColonia)
            {
                if($scope.nuevoColaborador.Codigo.length === 0)
                {
                    $scope.nuevoColaborador.Codigo = "NC.P.";
                    $scope.clase.cp = "entrada";
                }
                else
                {
                    $scope.mensajeError[$scope.mensajeError.length] = "*El C.P. debe de tener 5 números o en dado que no se conosca estar vacio.";
                    $scope.clase.cp = "entradaError";
                }
            }
            else
            {
                $scope.mensajeError[$scope.mensajeError.length]= "*El C.P. debe de tener 5 números.";
                $scope.clase.cp = "entradaError";
            }
        }
        else
        {
            $scope.clase.cp = "entrada";
        }
        if($scope.nuevoColaborador.Estado === "" || $scope.nuevoColaborador.Municipio === "" || $scope.nuevoColaborador.Ciudad === "" || $scope.nuevoColaborador.Colonia === "")
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*Completa todos los campos del domicilio.";
            $scope.clase.estado = "dropdownListModalError";
            $scope.clase.municipio = "dropdownListModalError";
            $scope.clase.ciudad = "dropdownListModalError";
            $scope.clase.colonia = "dropdownListModalError";
        }
        else
        {
            $scope.clase.estado = "dropdownListModal";
            $scope.clase.municipio = "dropdownListModal";
            $scope.clase.ciudad = "dropdownListModal";
            $scope.clase.colonia = "dropdownListModal";
        }
        if(coloniaInvalida)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*La colonia solo puede tener los siguientes caracteres: letras, números, '.', '+', '-' y '#'.";
            $scope.clase.otraColonia = "entradaError";
        }
        else
        {
            $scope.clase.otraColonia = "entrada";
        }
        if($scope.nuevoColaborador.NombreTipoUnidadNegocio === "")
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*Selecciona un tipo de unidad de negocio.";
            $scope.clase.tipoUnidad = "dropdownListModalError";
        }
        else
        {
            $scope.clase.tipoUnidad = "dropdownListModal";
        }
        if($scope.nuevoColaborador.NombreUnidadNegocio === "")
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*Selecciona una unidad de negocio.";
            $scope.clase.unidad = "dropdownListModalError";
        }
        else
        {
            $scope.clase.unidad = "dropdownListModal";
        }
        var telefonoExistente = false;
        var correoExistente = false;
        for(var k=0; k<$scope.nuevoContactoColaborador.length; k++)
        {
            if($scope.nuevoContactoColaborador[k].NombreMedioContacto == "Teléfono" && !telefonoExistente)
            {
                telefonoExistente = true;
            }
            else if($scope.nuevoContactoColaborador[k].NombreMedioContacto == "Correo Electrónico" && !correoExistente)
            {
                correoExistente = true;
            }
            if(telefonoExistente && correoExistente)
            {
                break;
            }
        }
        if(!telefonoExistente || !correoExistente)
        {
            for(var k=0; k<$scope.contactoColaborador.length; k++)
            {
                if($scope.contactoColaborador[k].NombreMedioContacto == "Teléfono" && !telefonoExistente)
                {
                    telefonoExistente = true;
                }
                else if($scope.contactoColaborador[k].NombreMedioContacto == "Correo Electrónico" && !correoExistente)
                {
                    correoExistente = true;
                }
                if(telefonoExistente && correoExistente)
                {
                    break;
                }
            }
        }
        if(!telefonoExistente)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*Debe de haber mínimo un telefono registrado.";
            $scope.clase.telefono = "entradaError";
            $scope.clase.telefonoD = "dropdownListModalError";
        }
        else
        {
            $scope.clase.telefono = "entrada";
            $scope.clase.telefonoD = "dropdownListModal";
        }
        if(!correoExistente)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*Debe de haber mínimo un correo registrado.";
            $scope.clase.correo = "entradaError";
            $scope.clase.correoD = "dropdownListModalError";
        }
        else
        {
            $scope.clase.correo = "entrada";
            $scope.clase.correoD = "dropdownListModal";
        }
        
        if($scope.mensajeError.length > 0)
        {
            return;
        }
        
        for(var k=0; k<$scope.colaborador.length; k++)
        {
            if($scope.operacion == "Agregar" || $scope.nuevoColaborador.ColaboradorId !== $scope.colaborador[k].ColaboradorId)
            {
                if($scope.colaborador[k].Nombre == $scope.nuevoColaborador.Nombre && $scope.colaborador[k].PrimerApellido == $scope.nuevoColaborador.PrimerApellido  && $scope.colaborador[k].SegundoApellido == $scope.nuevoColaborador.SegundoApellido)
                {
                    $scope.mensajeError[$scope.mensajeError.length] = "*El colaborador " + $scope.nuevoColaborador.EsNombretado + " " + $scope.nuevoColaborador.PrimerApellido + " "+ $scope.nuevoColaborador.SegundoApellido + " ya existe.";
                    $scope.clase.nombre = "entradaError";
                    $scope.clase.primerApellido = "entradaError";
                    $scope.clase.segundoApellido = "entradaError";
                    return;
                }
            }
        }
        
        $scope.nuevoColaborador.PaisId = "1";
        
        var datosContacto = {colaborador:"", contacto:""};
        datosContacto.colaborador = $scope.nuevoColaborador;
        datosContacto.contacto = $scope.nuevoContactoColaborador;
                
        if($scope.operacion == "Agregar")
        {
            $scope.AgregarColaborador(datosContacto);
        }
        else if($scope.operacion == "Editar")
        {
            $scope.EditarColaborador(datosContacto);
        }
    };
    
    //agregar colaborador
    //llama al metodo para se realice el insert y verifica que el proceso se haya realizado
    $scope.AgregarColaborador = function(datosContacto)
    {        
        AgregarColaborador($http, CONFIG, $q, datosContacto).then(function(data)
        {
            if(data[0].Estatus == "Exitoso")
            {
                if($scope.opcionUsuario.opcion == "si")
                {
                    $scope.nuevoColaborador.ColaboradorId = data[1].ColaboradorId;
                    $scope.GetContactoColaborador(data[1].ColaboradorId);
                    $scope.AbrirAgregarUsuario();
                }
                
                $scope.GetColaboradores();
                $scope.CerrarColaboradorForma();
                $('#colaboradorModal').modal('toggle');
                $scope.mensaje = "El colaborador se ha agregado.";
                $scope.nuevoContactoColaborador = [];
                $('#mensajeColaborador').modal('toggle');
            }
            else
            {
                $scope.mensaje = "Ha ocurrido un error. Intente más tarde";
                $('#mensajeColaborador').modal('toggle');
            }
        }).catch(function(error)
        {
            $scope.mensaje = "Ha ocurrido un error. Intente más tarde. Error: " +error;
            $('#mensajeColaborador').modal('toggle');
        });
    };
    
    //Edita al colaborador
    $scope.EditarColaborador = function(datosContacto)
    {
        EditarColaborador($http, CONFIG, $q, datosContacto).then(function(data)
        {
            if(data == "Exitoso")
            {
                $scope.GetColaboradores();
                $scope.CerrarColaboradorForma();
                $('#colaboradorModal').modal('toggle');
                $scope.mensaje = "El colaborador se ha editado.";
                 $scope.nuevoContactoColaborador = [];
                $('#mensajeColaborador').modal('toggle');
            }
            else
            {
                $scope.mensaje = "Ha ocurrido un error. Intente más tarde";
                $('#mensajeColaborador').modal('toggle');
            }
        }).catch(function(error)
        {
            $scope.mensaje = "Ha ocurrido un error. Intente más tarde. Error: " +error;
            $('#mensajeColaborador').modal('toggle');
        });
    };
    
    /*Unidad de negocio*/
    //Se selcciono una unidad de negocio
    $scope.CambiarUnidadNegocio = function(unidad)
    {
        $scope.nuevoColaborador.NombreUnidadNegocio = unidad;
        
        for(var k=0; k<$scope.unidadNegocio.length; k++)
        {
            if($scope.nuevoColaborador.NombreUnidadNegocio == $scope.unidadNegocio[k].Nombre && $scope.nuevoColaborador.NombreTipoUnidadNegocio == $scope.unidadNegocio[k].NombreTipoUnidadNegocio)
            {
                $scope.nuevoColaborador.UnidadNegocioId = $scope.unidadNegocio[k].UnidadNegocioId;
                break;
            }
        }
    };
    
    //Se selecciono un tipo de unidad de negoico
    $scope.CambiarTipoUnidadNegocio = function(tipo)
    {
        $scope.nuevoColaborador.NombreTipoUnidadNegocio = tipo;
        
        for(var k=0; k<$scope.unidadNegocio.length; k++)
        {
            if($scope.nuevoColaborador.NombreTipoUnidadNegocio == $scope.unidadNegocio[k].NombreTipoUnidadNegocio)
            {
                $scope.CambiarUnidadNegocio($scope.unidadNegocio[k].Nombre);
                break;
            }
        }
    };
    
    //obtine las unidades de negocio registradas y activas
    $scope.GetUnidadNegocio = function()    
    {
        GetUnidadNegocioSencilla($http, $q, CONFIG).then(function(data)
        {
            if(data.length > 0)
            {
                $scope.unidadNegocio = data;
            }
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    //Cambio la opcion si se desea agregar un usuario
    $scope.OpcionAgregarUsuario = function(opcion)
    {
        if(opcion == "si")
        {
            $scope.opcionUsuario.claseSi = "botonRelleno";
            $scope.opcionUsuario.claseNo = "botonOperacion";
            $scope.opcion = "si";
        }
        else if(opcion == "no")
        {
            $scope.opcionUsuario.claseSi = "botonOperacion";
            $scope.opcionUsuario.claseNo = "botonRelleno";
            $scope.opcion = "no";
        }
    };
    
    /*------------------------------------------Usuario------------------------------------------------------*/
    $scope.claseUsuario = {usuario:"entrada", perfil:"checkBoxActivo"};
    $scope.usuarioTab = "datosUsuario";
    $scope.permiso = null;
    $scope.opcionUsuario = {claseSi:"botonRelleno", claseNo:"botonOperacion", opcion:"si"};
    $scope.mostarCopiarPermisos = {mostrar:false, texto:"Copiar Permisos >>"};
    $scope.buscarUsuario = "";
    
    // se abre el panel para agregar un usuario
    $scope.AbrirAgregarUsuario = function()
    {
        $scope.nuevoColaborador.ActivoUsuario = true;
        
        $scope.perfil[0].Activo = false;
        $scope.perfil[1].Activo = false;
        $scope.perfil[2].Activo = true;
        
        $scope.usuarioTab = "datosUsuario";
        
        $('#usuarioModal').modal('toggle');
    };
    
    //Se dio siguiente para agregar un usurio
    //Verifica que el nombre de usuario sea valido y que al menos se haya seleccionado un perfil, si esto es asi se pasará al siguiente paso
    $scope.TerminarUsuario = function(usuarioInvallido)
    {   
        $scope.mensajeError = [];
        
        if(usuarioInvallido)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*El nombre del usuario puede tener letras en minúscula y números sin espacios. Mínimo debe tener 4 caracteres.";
            $scope.claseUsuario.usuario = "entradaError";
        }
        else
        {
            $scope.claseUsuario.usuario = "entrada";
        }
        var perfilSeleccionado = false;
        for(var k=0; k<$scope.perfil.length; k++)
        {
            if($scope.perfil[k].Activo)
            {
                perfilSeleccionado = true;
                break;
            }
        }
        if(!perfilSeleccionado)
        {
            $scope.mensajeError[$scope.mensajeError.length] = "*Debes seleccionar al menos un perfil.";
            $scope.claseUsuario.perfil = "checkBoxActivoError";
        }
        else
        {
            $scope.claseUsuario.perfil = "checkBoxActivo";
        }
        
        if( $scope.mensajeError.length > 0)
        {
            return;
        }
        
        for(var k=0; k<$scope.colaborador.length; k++)
        {
            if($scope.colaborador[k].NombreUsuario == $scope.nuevoColaborador.NombreUsuario && $scope.colaborador[k].ColaboradorId !== $scope.nuevoColaborador.ColaboradorId)
            {
                $scope.mensajeError[$scope.mensajeError.length] = "*El nombre del usuario " + $scope.nuevoColaborador.NombreUsuario + " ya existe.";
                $scope.claseUsuario.usuario = "entradaError";
                return;
            }
        }
        
        /*validación correcta*/
        
        if($scope.permiso === null)
        {
            $scope.GetPermiso();
        }
        
        var mostrarPrimerPerfil = false;
        for(var k=0; k<$scope.perfil.length; k++)
        {
            if($scope.perfil[k].Activo && !mostrarPrimerPerfil)
            {
                $scope.perfil[k].mostrar = true;
                $scope.perfil[k].texto = "<<";
                mostrarPrimerPerfil = true;
            }
            else
            {
                $scope.perfil[k].mostrar = false;
                $scope.perfil[k].texto = ">>";
            }
        }
        
        $scope.usuarioTab = "permisosUsuario";
    };
    
    //Se cancelo agregar un usurio
    $scope.CerrarUsuario = function()
    {
        $scope.perfil = GetPerfil();
        $scope.usuarioTab = "datosUsuario";
        $scope.nuevoColaborador.NombreUsuario = "";
        $scope.claseUsuario = {usuario:"entrada", perfil:"checkBoxActivo"};
        $scope.mensajeError = [];
    };
    
    //Se seleccionado los permisos del usurio y se confirmo que se desea agregar
    //Verifica que como minimo se haya agregado un permiso de cada perfil del usuario
    $scope.TerminarPermisosUsuario = function()
    {
         $scope.mensajeError = [];
        var permisoPerfilSeleccionado = {adminatrador: false, operativo: false, ejecutivo: false};
        
        for(var k=0; k<$scope.perfil.length; k++)
        {
            if(!$scope.perfil[k].Activo)
            {
                if($scope.perfil[k].Nombre == "Administrador")
                {
                    permisoPerfilSeleccionado.adminatrador = true;
                }
                else if($scope.perfil[k].Nombre == "Ejecutivo")
                {
                    permisoPerfilSeleccionado.ejecutivo = true;
                }
                else if($scope.perfil[k].Nombre == "Operativo")
                {
                    permisoPerfilSeleccionado.operativo = true;
                }
            }
        }
        
        for(var k=0; k<$scope.permiso.length; k++)
        {
            if($scope.permiso[k].Activo)
            {
                if($scope.permiso[k].NombrePerfil == "Administrador" && !permisoPerfilSeleccionado.adminatrador)
                {
                    permisoPerfilSeleccionado.adminatrador = true;
                }
                else if($scope.permiso[k].NombrePerfil  == "Ejecutivo" && !permisoPerfilSeleccionado.ejecutivo)
                {
                    permisoPerfilSeleccionado.ejecutivo = true;
                }
                else if($scope.permiso[k].NombrePerfil  == "Operativo" && !permisoPerfilSeleccionado.operativo)
                {
                    permisoPerfilSeleccionado.operativo = true;
                }
                
                if(permisoPerfilSeleccionado.adminatrador && permisoPerfilSeleccionado.ejecutivo && permisoPerfilSeleccionado.operativo)
                {
                    break;
                }
            }
        }
        
        //console.log(permisoPerfilSeleccionado.adminatrador + " "  + permisoPerfilSeleccionado.ejecutivo + " "+  permisoPerfilSeleccionado.operativo);
        if(!(permisoPerfilSeleccionado.adminatrador && permisoPerfilSeleccionado.ejecutivo && permisoPerfilSeleccionado.operativo))
        {
            $scope.mensajeError[0] = "Debes de seleccionar al menos un permiso por perfil.";
            return;
        }
        
        var password = Math.random().toString(36).slice(-8);
        var correo = $.base64.encode( password );
        $scope.nuevoColaborador.Password = md5.createHash( password );
        $scope.nuevoColaborador.Correo = correo;

        var datos = {colaborador:"", contacto:"", perfil:"", permiso:""};
        datos.colaborador = $scope.nuevoColaborador;
        datos.contacto = $scope.contactoColaborador;
        datos.perfil = $scope.perfil;
        datos.permiso = $scope.permiso;
        
        AgregarUsuario($http, CONFIG, $q, datos).then(function(data)
        {
            if(data == "Exitoso")
            {
                $scope.GetColaboradores();
                $scope.CerrarUsuario();
                $('#usuarioModal').modal('toggle');
                $scope.mensaje = "El usuario se ha agregado.";
                $('#mensajeColaborador').modal('toggle');
            }
            else
            {
                $scope.mensaje = "Ha ocurrido un error. Intente más tarde";
                $('#mensajeColaborador').modal('toggle');
            }
        }).catch(function(error)
        {
            $scope.mensaje = "Ha ocurrido un error. Intente más tarde. Error: " +error;
            $('#mensajeColaborador').modal('toggle');
        });
    };
    
    /*Permisos*/
    //Se muestran u ocultan los permisos de cada perfil
    $scope.MostrarOcultarPermisos = function(perfil)
    {
        perfil.mostrar = !perfil.mostrar;
        if(perfil.mostrar)
        {
            perfil.texto = "<<";
        }
        else
        {
            perfil.texto = ">>";
        }
    };
    
    //Se regresa al primer paso de agregar el usuario
    $scope.AnteriorPermisos = function()
    {
        $scope.usuarioTab = "datosUsuario";
    };
    
    //Se seleccionan todos los permisos de un perfil
    $scope.ActivarPermisos = function(perfil)
    {
        for(var k=0; k<$scope.permiso.length; k++)
        {
            if($scope.permiso[k].NombrePerfil == perfil)
            {
               $scope.permiso[k].Activo = true; 
            }
        }
    };
    
    //Se deseleccionan todos los permisos de un perfil
    $scope.DesactivarPermisos = function(perfil)
    {
        for(var k=0; k<$scope.permiso.length; k++)
        {
            if($scope.permiso[k].NombrePerfil == perfil)
            {
               $scope.permiso[k].Activo = false; 
            }
        }
    };
    
    //Se copian los permisos de un usuario ya registrado al nuevo usuario
    $scope.SetPermisos = function(usuario)
    {
        GetPermisoPorUsuario($http, $q, CONFIG, usuario.UsuarioId).then(function(data)
        {
            if(data[0].Estatus == "Exitoso")
            {
                var permisoActivo = false;
                for(var i=0; i<$scope.permiso.length; i++)
                {
                    permisoActivo = false;
                    for(var j=0; j<data[1].Permiso.length; j++)
                    {
                        if($scope.permiso[i].PermisoId == data[1].Permiso[j].PermisoId)
                        {
                            permisoActivo = true;
                            break;
                        }
                    }
                    $scope.permiso[i].Activo = permisoActivo;
                }
            }
            else
            {
                alert("Ha ocurrido un error al obtener los permisos.");
                return;
            }
        }).catch(function(error)
        {
            alert("Ha ocurrido un error al obtener los permisos." + error);
            return;
        });
    };
    
    //Se muestra o oculta la tabla de usuario para poder copiar sus permisos
    $scope.MostrarCopiarPermisos = function()
    {
        $scope.mostarCopiarPermisos.mostrar = !$scope.mostarCopiarPermisos.mostrar;
        if($scope.mostarCopiarPermisos.mostrar )
        {
            $scope.mostarCopiarPermisos.texto = "Copiar Permisos <<";
        }
        else
        {
            $scope.mostarCopiarPermisos.texto = "Copiar Permisos >>";
        }
    };
     
    /*--------------Inicializar catálogos----------------*/ 
    //obtiene todos los permisos disponibles
    $scope.GetPermiso = function()
    {
        GetPermiso($http, $q, CONFIG).then(function(data)
        {
            if(data.length > 0)
            {
                $scope.permiso = data;
            }
        }).catch(function(error)
        {
            alert("Error al cargar los permisos. Intente más tarde." + error);
        });
    };
    
    //obtiene los tipos de medio de contacto
    $scope.GetTipoMedioContacto = function()
    {
        GetTipoMedioContacto($http, $q, CONFIG) .then(function(data) 
        {
            if(data.length > 0)
            {
                $scope.tipoMedioContacto = data;
                
                $scope.IniciarTipoMedioContacto();
            }
            else
            {
                alert(data);
            }
        }).catch(function(error)
        {
            alert(error);
        });
    };
    
    //Cuando se abre el panel de agregar-editar colaborador se ponen por defecto un tipo de telefono y un tipo de email
    $scope.IniciarTipoMedioContacto = function()
    {
        for(var k=0; k<$scope.tipoMedioContacto.length; k++)
        {
            if($scope.tipoMedioContacto[k].NombreMedioContacto == "Teléfono" && $scope.tipoTelefonoSeleccionado.tipo === "" && $scope.tipoMedioContacto[k].Activo == "1" )
            {
                $scope.tipoTelefonoSeleccionado.tipo = $scope.tipoMedioContacto[k].Nombre;
                $scope.tipoTelefonoSeleccionado.id = $scope.tipoMedioContacto[k].TipoMedioContactoId;
            }
            else if($scope.tipoMedioContacto[k].NombreMedioContacto == "Correo Electrónico" && $scope.tipoCorreoSeleccionado.tipo === "" && $scope.tipoMedioContacto[k].Activo == "1" )
            {
                $scope.tipoCorreoSeleccionado.tipo = $scope.tipoMedioContacto[k].Nombre;
                $scope.tipoCorreoSeleccionado.id = $scope.tipoMedioContacto[k].TipoMedioContactoId;
            }
        }
    };
    
    /*------------------Indentifica cuando los datos del usuario han cambiado-------------------*/
    $scope.usuarioLogeado =  datosUsuario.getUsuario(); 
    
    //verifica queexista un usuario logeado para acceder al catálogo
    if($scope.usuarioLogeado !== null)
    {
        if($scope.usuarioLogeado.SesionIniciada)
        {
            $scope.IdentificarPermisos();
            if(!$scope.permisoUsuario.consultar)
            {
               for(var k=0; k<$rootScope.Perfiles.length; k++)
                {
                    if($scope.usuarioLogeado.PerfilSeleccionado == $rootScope.Perfiles[k].nombre)         //Se verifica con que perfil cuenta el usuario
                    {
                        $window.location = $rootScope.Perfiles[k].paginaPrincipal;
                    }
                } 
            }
            
            else
            {
                $scope.GetColaboradores();
            }
        }
        else
        {
            $window.location = "#Login";
        }
    }
    
    //Se manda a llamar cada ves que los datos de un usuario han cambiado
    $scope.$on('cambioUsuario',function()
    {
        $scope.usuarioLogeado =  datosUsuario.getUsuario();
    
        if(!$scope.usuarioLogeado.SesionIniciada)
        {
            $window.location = "#Login";
            return;
        }
        else
        {
            $scope.IdentificarPermisos();
            
            $scope.usuarioLogeado =  datosUsuario.getUsuario(); 
            
            if(!$scope.permisoUsuario.consultar)
            {
               for(var k=0; k<$rootScope.Perfiles.length; k++)
                {
                    if($scope.usuarioLogeado.PerfilSeleccionado == $rootScope.Perfiles[k].nombre)         //Se verifica con que perfil cuenta el usuario
                    {
                        $window.location = $rootScope.Perfiles[k].paginaPrincipal;
                    }
                } 
            }
            else
            {
                $scope.GetColaboradores();
            }
        }
    });
});

//comparte los datos del usuario seleccionado entre controladores
app.factory('datosUsuarioPerfil',function($rootScope)
{
    var service = {};
    service.usuario = null;
    service.contacto = null;
    service.perfil = null;
    
    //guarda los datos del usuario
    service.setUsuario = function(usuario)
    {
      this.usuario = usuario;
      $rootScope.$broadcast('cambioUsuarioPerfil');
    }; 
    service.getUsuario = function()
    {
    return this.usuario;
    };
    //guardo los datos de los contacto del usuario
    service.setContacto = function(contacto)
    {
      this.contacto = contacto;
      $rootScope.$broadcast('cambioUsuarioPerfil');
    }; 
    service.getContacto = function()
    {
      return this.contacto;
    };
    //guarda los perfiles del usuario
    service.setPerfil = function(perfil)
    {
      this.perfil = perfil;
      $rootScope.$broadcast('cambioUsuarioPerfil');
    }; 
    service.getPerfil = function()
    {
    return this.perfil;
    };

    return service;
});