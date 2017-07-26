app.controller("OperativoControlador", function($scope, $rootScope, datosUsuario, $window, $location)
{   
    $scope.titulo = "Operativo";
    
    $scope.text = "Esta es un breve descripción del presupuesto que le aparecerá al cliente en su presupuesto ya que a veces es necesario realizar alguna especificaciones extras del mueble que se le fabricará al cliente. mas cosasa para que se desborde el ltexxto y ver si no se junta con la tabla que quiero despleagr para ve su funcionamiento y suihhifdhisd. Gabriel Rivero"; 
        
    $scope.nombre = ["Gabriel", "Eduardo", "Rivero", "Hernández"];
    console.log(0%2 > 0);
    /*----------------verificar los permisos---------------------*/
    $rootScope.permisoOperativo = {verTodosCliente: false};
    $scope.IdentificarPermisos = function()
    {
        for(var k=0; k < $scope.usuarioLogeado.Permiso.length; k++)
        {
            if($scope.usuarioLogeado.Permiso[k] == "OpeCliConsultar")
            {
                $rootScope.permisoOperativo.verTodosCliente = true;
            }
        }
    };
    
    /*------------------Indentifica cuando los datos del usuario han cambiado-------------------*/
    $scope.usuarioLogeado =  datosUsuario.getUsuario(); 
    
    if($scope.usuarioLogeado !== null)
    {
        if($scope.usuarioLogeado.SesionIniciada)
        {
            if($scope.usuarioLogeado.PerfilSeleccionado === "")
            {
                $window.location = "#Perfil";
            } 
            else if($scope.usuarioLogeado.PerfilSeleccionado == "Operativo")
            {
                $scope.IdentificarPermisos();
                /*if(!$scope.permisoUsuario.consultar)
                {
                   $rootScope.VolverAHome($scope.usuarioLogeado.PerfilSeleccionado);
                }
                else
                {
                    $scope.InicializarModuloCombinacion();
                }*/
            }
            else
            {
                $rootScope.VolverAHome($scope.usuarioLogeado.PerfilSeleccionado);
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
            $location.path('/Login');
            return;
        }
        else
        {
            if($scope.usuarioLogeado.PerfilSeleccionado === "")
            {
                $location.path('/Perfil');
            }
            else if($scope.usuarioLogeado.PerfilSeleccionado == "Operativo")
            {
                $scope.IdentificarPermisos();
                /*if(!$scope.permisoUsuario.consultar)
                {
                   $rootScope.VolverAHome($scope.usuarioLogeado.PerfilSeleccionado);
                }
                else
                {
                    $scope.InicializarModuloCombinacion();
                }*/
            }
            else
            {
                $rootScope.VolverAHome($scope.usuarioLogeado.PerfilSeleccionado);
            }
        }
    });
    
    $scope.EstilosPDF = function(){
    
    console.log("entra");

			var columns = ['ID','Name','Address','Age'];
            var rows = [
            [1,'John','Vilnius',22],
            [2,'Jack','Riga',25]
            ];
        
       
       
            var doc = new jsPDF('p', 'pt');
        
            var com = doc.autoTableHtmlToJson(document.getElementById("basic-table"));

            doc.setFontSize(20);
            doc.text(30, 30, 'Table'); 
        
            doc.autoTable(com.colums, com.data, {
                margin: { top: 50, left: 20, right: 20, bottom: 0 },
                createdHeaderCell: function (cell, data) {
                    if (cell.raw === 'Name') {//cell.raw
                        cell.styles.fontSize= 15;
                       cell.styles.textColor = 111;
                    } else {
                        cell.styles.textColor = 255;
                        cell.styles.fontSize = 10;
                  
                    }
                },
                   createdCell: function (cell, data) {
                    if (cell.raw === 'Jack') {
                       cell.styles.fontSize= 20;
                       cell.styles.textColor = [255,0,0];
										   cell.styles.halign = 'center';
                       cell.styles.fillColor = [0,255,0];
                    } else {
                       cell.styles.fontSize = 10;
                  }
                }
            });
            
            doc.save('output.pdf');
        };
});

function genPDF() 
{
	
	/*var doc = new jsPDF();
	
    var specialElementHandlers = {
        '#hidediv' : function(element,render) {return true;}
    };
    
    doc.fromHTML($('#pdf').get(0), 20,20,{
                 'width':500,
        		'elementHandlers': specialElementHandlers
    });
	
	doc.save('Test.pdf');*/
    console.log("entra");
	
}

function callme(){
var table = tableToJson($('#table-id').get(0));
var doc = new jsPDF('p', 'pt', 'a4', true);


$.each(table, function(i, row){
	$.each(row, function(j,cell){
	if(j=="email" | j==1){
	 doc.cell(1,10,190,20,cell,i);	
	}
	else{
		doc.cell(1,10,90,20,cell,i);
	}
	
	});
});

doc.save('Safaa.pdf');
}

function tableToJson(table) {
    var data = [];

    // first row needs to be headers
    var headers = [];
    for (var i=0; i<table.rows[0].cells.length; i++) {
        headers[i] = table.rows[0].cells[i].innerHTML.toLowerCase().replace(/ /gi,'');
    }
    data.push(headers);
    // go through cells
    for (var i=1; i<table.rows.length; i++) {

        var tableRow = table.rows[i];
        var rowData = {};

        for (var j=0; j<tableRow.cells.length; j++) {

            rowData[ headers[j] ] = tableRow.cells[j].innerHTML;

        }

        data.push(rowData);
    }       

    return data;
}

function generate() 
{

  /*var doc = new jsPDF('p', 'pt');

  var res = doc.autoTableHtmlToJson(document.getElementById("basic-table"));
  doc.autoTable(res.columns, res.data, {margin: {top: 100}, headerStyles: {fillColor: [250, 97, 21]}});
    
  var header = function(data) 
  {
    doc.setFontSize(12);
    doc.setTextColor(40);
    doc.setFontStyle('normal');
      
      
       // var splitTitle = doc.splitTextToSize(text, 500);
    //doc.addImage(headerImgData, 'JPEG', data.settings.margin.left, 20, 50, 50);
    //doc.text(splitTitle, data.settings.margin.left, 50);
     // dim = doc.getTextDimensions(splitTitle);
      
    console.log(dim);
  };

  var options = 
  {
    beforePageContent: header,
    margin: {
      top: dim.h + 20
    },
    startY: dim.h + 20,
    headerStyles: {fillColor: [250, 97, 21]}
  };

  doc.autoTable(res.columns, res.data, options);*/

    /*var doc = new jsPDF('p', 'pt');
    
    var des = doc.autoTableHtmlToJson(document.getElementById("Descripcion"));
    var com = doc.autoTableHtmlToJson(document.getElementById("basic-table"));
    
    //doc.autoTable(des.columns, des.data, {margin: {top: 50}, headerStyles: {fillColor: [255, 255, 255], textColor: 20, fontStyle: 'normal'}, styles: {overflow: 'linebreak', columnWidth: 'wrap'}});
    
    doc.autoTable(des.columns, des.data, {
        margin: {top: 50},
        headerStyles: {fillColor: [255, 255, 255], textColor: 20, fontStyle: 'normal'}, styles: {overflow: 'linebreak', columnWidth: 'wrap'},
        styles: {overflow: 'linebreak'},
        columnStyles: {text: {columnWidth: 'auto'}}
    });
    
    var options = 
    {
        margin: {
          top: 80
        },
        startY: doc.autoTableEndPosY() + 20,
        headerStyles: {fillColor: [250, 97, 21]}
    };
    //doc.autoTable(com.columns, com.data, options);
    
    var options2 = 
    {
        margin: {
          top: 80
        },
        startY: doc.autoTableEndPosY(),
        headerStyles: {fillColor: [0, 0, 0]}
    };
    
    var tit = doc.autoTableHtmlToJson(document.getElementById("titulo"));
    var inc = doc.autoTableHtmlToJson(document.getElementById("incluye"));
    var acc = doc.autoTableHtmlToJson(document.getElementById("accesorio"));
    var cub = doc.autoTableHtmlToJson(document.getElementById("cubierta"));
    
    doc.autoTable(tit.columns, tit.data, options);
    doc.autoTable(inc.columns, inc.data, options2);
    doc.autoTable(acc.columns, acc.data, options2);
    doc.autoTable(cub.columns, cub.data, options2);*/
    
    var doc = new jsPDF();
    doc.setFontSize(12);
    
    var pageContent = function (data) 
        {
            // HEADER
            if (base64Img) 
            {
                doc.setFontSize(10);
                doc.addImage(base64Img, 'JPEG', 15, 10, 30, 10);
            }
            
            doc.text("25/Jul/2017       No. 1293", data.settings.margin.left + 35, 13);
            doc.text("Gabriel Eduardo Rivero", data.settings.margin.left + 35, 18);

        };
    
    var des = doc.autoTableHtmlToJson(document.getElementById("Descripcion"));
    var com = doc.autoTableHtmlToJson(document.getElementById("basic-table"));
    var inc = doc.autoTableHtmlToJson(document.getElementById("incluye"));
    var enc = doc.autoTableHtmlToJson(document.getElementById("encabezado"));
    var pp = doc.autoTableHtmlToJson(document.getElementById("planPago"));
    var p1 = doc.autoTableHtmlToJson(document.getElementById("precio1"));
    var p2 = doc.autoTableHtmlToJson(document.getElementById("precio2"));
    var ipp = doc.autoTableHtmlToJson(document.getElementById("incluyePlanPago"));
    var dp = doc.autoTableHtmlToJson(document.getElementById("detallePresupuesto"));
    var promo = doc.autoTableHtmlToJson(document.getElementById("promociones"));
    
    //Hoja 1
    doc.autoTable(des.columns, des.data, {
        margin: {top: 22},
        addPageContent: pageContent,
        headerStyles: {fillColor: [255, 255, 255], textColor: 20, fontStyle: 'normal'}, styles: {overflow: 'linebreak', columnWidth: 'wrap'},
        styles: {overflow: 'linebreak'},
        columnStyles: {text: {columnWidth: 'auto'}}
    });
    
    var options = 
    {
        margin: {top: 80},
        startY: doc.autoTable.previous.finalY + 5,
        headerStyles: {fillColor: [250, 97, 21]}
    };
    doc.autoTable(com.columns, com.data, options);
    
    /*let first = doc.autoTable.previous;

    doc.autoTable(com.columns, com.columns, {
        startY: first.finalY + 10,
        showHeader: 'firstPage',
        margin: {right: 107}
    });*/
    
    // Reset page to the same as before previous table
   /* doc.setPage(1 + doc.internal.getCurrentPageInfo().pageNumber - doc.autoTable.previous.pageCount);

    doc.autoTable(com.columns, com.columns, {
        startY: first.finalY + 10,
        showHeader: 'firstPage',
        margin: {left: 107}
    });*/
    
    let first = doc.autoTable.previous;
    
     doc.autoTable(inc.columns, inc.data, {
        startY: first.finalY + 10,
        showHeader: 'firstPage',
        margin: {right: 107},
        headerStyles: {fillColor: [250, 97, 21], fontSize:18, halign: 'center', textColor: [255,255,255]},
        styles: {textColor: [0,0,0], overflow: 'linebreak', halign:'left'},
        theme: 'grid',
         createdCell: function (cell, data) {
                    if(cell.text[0] == "Incluye" || cell.text[0] == "Servicios" || cell.text[0] == "Accesorios" || cell.text[0] == "Cubierta de aglomerado")
                    {
                       cell.styles.fontSize= 10;
                       cell.styles.textColor = [0, 0, 0];
				       cell.styles.halign = 'center';
                       cell.styles.fillColor = [230, 230, 230];
                       cell.styles.fontStyle = 'bold';
                    }

                }
        
    });
    
    for(var k=0; k<6; k++)
    {
        doc.autoTable(com.columns, com.data, {
            margin: {top: 22},
            startY: doc.autoTable.previous.finalY+10, 
            headerStyles: {fillColor: [255, 0, 0], fontSize:12, halign: 'center', textColor: [255,255,255]},
            styles: {textColor: [0,0,0], overflow: 'linebreak', halign: 'center',},
            pageBreak: 'avoid',
            theme: 'grid',
            addPageContent: pageContent,
        });
    }
    
    
    //Hoja 2
    
    doc.addPage();
    
    var tcub = [];
    
    tcub[0]  = doc.autoTableHtmlToJson(document.getElementById("Nombre1"));
    tcub[1]  = doc.autoTableHtmlToJson(document.getElementById("Nombre2"));
    
    
    doc.autoTable(tcub[0].columns, tcub[0].data, {
        margin: {top: 20},
        headerStyles: {fillColor: [255, 255, 255], textColor: 20, fontStyle: 'normal'}, styles: {overflow: 'linebreak', columnWidth: 'wrap'},
        styles: {overflow: 'linebreak'},
        columnStyles: {text: {columnWidth: 'auto'}}
    });
    
    
    doc.setPage(1 + doc.internal.getCurrentPageInfo().pageNumber - doc.autoTable.previous.pageCount);

    doc.autoTable(inc.columns, inc.data, {
        startY: doc.autoTable.previous.finalY ,
        headerStyles: {fillColor: [250, 97, 21], fontSize:18, halign: 'center', textColor: [255,255,255]},
        styles: {textColor: [0,0,0], overflow: 'linebreak', halign: 'center',},
        pageBreak: 'avoid',
        theme: 'grid',
        columnStyles: {text: {columnWidth: 200}},
        columnWidth: 'wrap'
        
        
    });
    
    doc.autoTable(tcub[1].columns, tcub[1].data, {
        startY: doc.autoTable.previous.finalY + 10,
        headerStyles: {fillColor: [255, 255, 255], textColor: 20, fontStyle: 'normal'}, styles: {overflow: 'linebreak', columnWidth: 'wrap'},
        styles: {overflow: 'linebreak'},
        pageBreak: 'avoid',
        theme: 'grid',
        columnStyles: {text: {columnWidth: 200}},
        columnWidth: 'wrap'
    });
    
    doc.autoTable(com.columns, com.data, {
        startY: doc.autoTable.previous.finalY, 
        headerStyles: {fillColor: [255, 0, 0], fontSize:12, halign: 'center', textColor: [255,255,255]},
        styles: {textColor: [0,0,0], overflow: 'linebreak', halign: 'center',},
        pageBreak: 'avoid',
        theme: 'grid',
        columnStyles: {text: {columnWidth: 200}},
        columnWidth: 'wrap'
    });
    
    doc.autoTable(enc.columns, enc.data, {
        startY: doc.autoTable.previous.finalY + 10,
        headerStyles: {fillColor: [0, 255, 0], fontSize:12, halign: 'center', textColor: [255,255,255]},
        styles: {textColor: [0,0,0], overflow: 'linebreak', halign: 'center',},
        pageBreak: 'avoid',
        theme: 'grid',
        columnStyles: {text: {columnWidth: 200}},
        columnWidth: 'wrap'
        
        
    });
    
    doc.addPage();
    
    //Hoja 1
    doc.autoTable(pp.columns, pp.data, {
        margin: {top: 22},
        headerStyles: {fillColor: [250, 97, 21], textColor: [255, 255, 255], fontStyle: 'normal'}, 
        styles: {overflow: 'linebreak', columnWidth: 'wrap'},
        styles: {overflow: 'linebreak'},
        columnStyles: {text: {columnWidth: 'auto'}},
    });
    
    first = doc.autoTable.previous;
    
     doc.autoTable(p1.columns, p1.data, {
        startY: first.finalY + 10,
        showHeader: 'firstPage',
        margin: {right: 107},
        headerStyles: {fillColor: [0, 0, 0], fontSize:14, textColor: [255,255, 255], halign:'center',},
        styles: {fillColor: [250, 97, 21], textColor: [255,255,255], overflow: 'linebreak', halign:'center', fontSize:16},
         theme: 'grid',
    });
    
     doc.autoTable(pp.columns, pp.data, {
        startY: doc.autoTable.previous.finalY,
        showHeader: 'firstPage',
        margin: {right: 107},
        headerStyles: {fillColor: [230, 230, 230], fontSize:10, textColor: [0,0, 0], fontStyle:'bold'},
        styles: {textColor: [0,0,0], overflow: 'linebreak', halign:'left'},
         theme: 'grid',
    });
    
    doc.setPage(1 + doc.internal.getCurrentPageInfo().pageNumber - doc.autoTable.previous.pageCount);
    
    doc.autoTable(p2.columns, p2.data, {
        startY: first.finalY + 10,
        showHeader: 'firstPage',
        margin: {left: 107},
        headerStyles: {fillColor: [0, 0, 0], fontSize:14, textColor: [255,255, 255], halign:'center',},
        styles: {textColor: [255,255,255], overflow: 'linebreak', halign:'center', fontSize:16, fillColor: [250, 97, 21]},
    });
    
    doc.autoTable(pp.columns, pp.data, {
        startY: doc.autoTable.previous.finalY,
        showHeader: 'firstPage',
        margin: {left: 107},
        headerStyles: {fillColor: [230, 230, 230], fontSize:10, textColor: [0,0, 0], fontStyle:'bold'},
        styles: {textColor: [0,0,0], overflow: 'linebreak', halign:'left'},
        theme: 'grid',
    });

    
    
    //----Segunda parte
    
    first = doc.autoTable.previous;
    
     doc.autoTable(pp.columns, pp.data, {
        startY: first.finalY + 10,
        showHeader: 'firstPage',
        margin: {right: 107},
        headerStyles: {fillColor: [0, 0, 0], fontSize:10, textColor: [255,255, 255], fontStyle:'bold'},
        styles: {textColor: [0,0,0], overflow: 'linebreak', halign:'left'},
    });
    
    doc.setPage(1 + doc.internal.getCurrentPageInfo().pageNumber - doc.autoTable.previous.pageCount);
    
    doc.autoTable(pp.columns, pp.data, {
        startY: first.finalY + 10,
        showHeader: 'firstPage',
        margin: {left: 107},
        headerStyles: {fillColor: [0, 0, 0], fontSize:10, textColor: [255,255, 255], fontStyle:'bold'},
        styles: {textColor: [0,0,0], overflow: 'linebreak', halign:'left'},
    });
    
        doc.autoTable(dp.columns, dp.data,  {
                startY: doc.autoTable.previous.finalY ,
                headerStyles: {fillColor: [255, 255, 255], fontSize:0, textColor: [0,0, 0], halign:'center'},
            styles: { overflow: 'linebreak', fontSize:10},
             theme: 'grid',
                columnStyles: { 0: {columnWidth: 91}, 1: {columnWidth: 91}},
                pageBreak: 'avoid',


                });
    
    doc.autoTable(ipp.columns, ipp.data,  {
                startY: doc.autoTable.previous.finalY ,
                headerStyles: {fillColor: [230, 230, 230], fontSize:10, textColor: [0,0, 0], halign:'center'},
            styles: { overflow: 'linebreak', fontSize:10},
             theme: 'grid',
                columnStyles: {text: {columnWidth: 'auto'}},
                pageBreak: 'avoid',


                });
    
     doc.autoTable(promo.columns, promo.data,  {
                startY: doc.autoTable.previous.finalY + 5,
                headerStyles: {fillColor: [255, 255, 255], fontSize:0, textColor: [0,0, 0], halign:'center'},
            styles: { overflow: 'linebreak', fontSize:10, fillColor: [255, 255, 255], textColor: [0, 0, 0], lineWidth: 0},
                columnStyles: {fillColor: [255, 255, 255]},
                pageBreak: 'avoid',
                theme: 'grid',


                });
    

    
    
    
    
    
    doc.save("table.pdf");
    
}

var base64Img = null;

imgToBase64('img/Encabezado/logo.png', function(base64) {
    base64Img = base64; 
});

// You could either use a function similar to this or pre convert an image with for example http://dopiaza.org/tools/datauri
// http://stackoverflow.com/questions/6150289/how-to-convert-image-into-base64-string-using-javascript
function imgToBase64(url, callback) {
    if (!window.FileReader) {
        callback(null);
        return;
    }
    var xhr = new XMLHttpRequest();
    xhr.responseType = 'blob';
    xhr.onload = function() {
        var reader = new FileReader();
        reader.onloadend = function() {
            callback(reader.result.replace('text/xml', 'image/jpeg'));
        };
        reader.readAsDataURL(xhr.response);
    };
    xhr.open('GET', url);
    xhr.send();
}

