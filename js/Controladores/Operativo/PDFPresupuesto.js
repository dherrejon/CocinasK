function PDFPresupuesto(presupuesto)
{
    
     var combinacion = [
         
                            {fillColor: '#262626', color: 'white', text: '', alignment: 'center'},
                            {fillColor: '#262626', color: 'white', text: 'Pino', alignment: 'center'},
                            {fillColor: '#262626', color: 'white', text: 'Alder', alignment: 'center'},
                            {fillColor: '#262626', color: 'white', text: 'Cedro', alignment: 'center'},
                            {fillColor: '#262626', color: 'white', text: 'Cedro Total', alignment: 'center'},
                       ];
    
    var precio = [
                        {text: '', alignment: 'center'},
                        {text: '$232', alignment: 'center'},
                        {text: '$500', alignment: 'center'},
                        {text: '$800', alignment: 'center'},
                        {text: '$1122', alignment: 'center'},
                 ];
    
    var precio2 = [
                        {text: 'Promoción 1', alignment: 'center'},
                        {text: '$232', alignment: 'center'},
                        {text: '$500', alignment: 'center'},
                        {text: '$800', alignment: 'center'},
                        {text: '$1122', alignment: 'center'},
                 ];
    
    var precio3 = [
                        {text: 'Promoción 2', alignment: 'center'},
                        {text: '$232', alignment: 'center'},
                        {text: '$500', alignment: 'center'},
                        {text: '$800', alignment: 'center'},
                        {text: '$1122', alignment: 'center'},
                 ];
    
    var tabla2 = [];
    tabla2[0] = combinacion;
    tabla2[1] = precio;
    tabla2[2] = precio2;
    tabla2[3] = precio3;
    
    var tabla = [
                        [
                            {
                                fillColor: '#262626',
                                color: 'white',
                                text: 'Pino',
                                alignment: 'center'
                            },
                            {
                                fillColor: '#262626',
                                color: 'white',
                                text: 'Alder',
                                alignment: 'center'
                            },
                            {
                                fillColor: '#262626',
                                color: 'white',
                                text: 'Cedro',
                                alignment: 'center'
                            }
                        ],
                        [
                            {
                                text: '$232',
                                alignment: 'center'
                            },
                            {
                                text: '$892',
                                alignment: 'center'
                            },
                            {
                                text: '$203',
                                alignment: 'center'
                            }
                        ],
                        
                    ];
    
    console.log(tabla);
    console.log(tabla2);

     var docDefinition = 
        { content:[
            
            {text:presupuesto.DescripcionCliente},
            {text:"Probando tablas\n"},
            {
			     style: 'tableExample',
			     table: {
                     widths: ['*','*','*', '*', '*'],
                    body: tabla2
                },
                layout: {
				hLineWidth: function (i, node) {
					return (i> 0 || i === node.table.body.length) ? 1 : 0;
				},
				vLineWidth: function (i, node) {
					return (i > 0 || i === node.table.widths.length) ? 0 : 0;
				},
				hLineColor: function (i, node) {
					return (i > 0 || i === node.table.body.length) ? 'black' : 'gray';
				},
				vLineColor: function (i, node) {
					return (i > 0 || i === node.table.widths.length) ? 'black' : 'gray';
				},
				// paddingLeft: function(i, node) { return 4; },
				// paddingRight: function(i, node) { return 4; },
				// paddingTop: function(i, node) { return 2; },
				// paddingBottom: function(i, node) { return 2; },
				// fillColor: function (i, node) { return null; }
			}
            },
            
            ],
         

         
            
            };
        pdfMake.createPdf(docDefinition).download();
}