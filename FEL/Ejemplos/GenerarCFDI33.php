<!-- ***Debido a que PHP no es un Lenguaje Orientado a Objetos límita algunas operaciones al consumir el Webservice, en este ejemplo utilizamos SOAP REQUEST ya que es una buena alternativa para Lenguajes No Orientado a Objetos.****-->

<?php
   //Empezamos a crear el SOAP Request basandonos en la estructura que ofrece nuestro Webservice, en este caso usamos el Método "GenerarCFDIv32". En la siguiente liga podrá encontrar todos los Métodos disponibles:
   
   //Encabezado del XML para la peticiòn SOAP
   $soap_request  = "<?xml version=\"1.0\"?>\n";
   $soap_request .= "<soapenv:Envelope xmlns:soapenv=\"http://schemas.xmlsoap.org/soap/envelope/\" xmlns:tem=\"http://tempuri.org/\" xmlns:tes=\"http://schemas.datacontract.org/2004/07/TES.V33.CFDI.Negocios\">\n";  
  $soap_request .= "<soapenv:Header/>\n";
  $soap_request .= "<soapenv:Body>\n";
  $soap_request .= "    <tem:GenerarCFDI>\n";
  
  //Ingreso de Autenticación del Cliente con su Usuario, Cuenta y Contraseña.
  //Si se desea apuntar a otra sucursal, aqui debe indicar el valor referenciado de la sucursal, Ejemplo. "TiendaNorte" (REQUERIDO).
  $soap_request .= "    <tem:credenciales>\n";
  $soap_request .= "    <tes:Cuenta>TES030201001</tes:Cuenta>\n";
  $soap_request .= "    <tes:Password>Pruebas2017$</tes:Password>\n";
  $soap_request .= "    <tes:Usuario>TES030201001</tes:Usuario>\n";
  $soap_request .= "    </tem:credenciales>\n";
  
  //*************************************************************************************
  // Sección de variables para agregar los valores al comprobante CFDi.
  //*************************************************************************************
  $soap_request .= "    <tem:cfdi>\n";
  
  //Forma de pago del documento CFDi (REQUERIDO).
  $soap_request .= "    <tes:ClaveCFDI>FAC</tes:ClaveCFDI>\n";
  
  //Subtotal del documento CFDi (REQUERIDO).
  $soap_request .= "    <tes:Conceptos>\n";
  
  //En caso de existir un descuento, este campo es Requerido.
  //Monto del descuento del documento CFDi (opcional).
  $soap_request .= "  <tes:ConceptoR>\n";
  
  //Moneda en la que es expresado el CFDi (REQUERIDO).
  //Para usar cualquier otra denominaciòn, indique el prefijo.
  $soap_request .= "    <tes:Cantidad>1.7</tes:Cantidad>\n";
  
  //Total del documento CFDi (REQUERIDO).
  $soap_request .= "    <tes:ClaveProdServ>01010101</tes:ClaveProdServ>\n";
        
  //Tipo de documento CFDi a emitir (REQUERIDO).
  //(*) Ejemplo (FACTURA, NOTA DE CREDITO, RECIBO , RECIBO DE DONATIVO, CARTA PORTE)
  $soap_request .= "    <tes:ClaveUnidad>F52</tes:ClaveUnidad>\n";
  
  //Metodo de pago del documento CFDi (REQUERIDO).
  $soap_request .= "    <tes:Descripcion>ZAMAC</tes:Descripcion>\n";
  
  //Lugar de expedicion donde se esta emitiendo el documento CFDi (REQUERIDO).
  $soap_request .= "    <tes:Importe>17000.00</tes:Importe>\n";
  
   /**************************************************************************************
      Sección de variables para identificar y actualizar los datos del Cliente(Receptor).
   **************************************************************************************/
  $soap_request .= "    <tes:Impuestos>\n";
  
  //Nombre del cliente (REQUERIDO).
  $soap_request .= "    <tes:Traslados>\n";
  $soap_request .= "    <tes:TrasladoConceptoR>\n";
  
  //Email del cliente (opcional).
  $soap_request .= "    <tes:Base>17000</tes:Base>\n";
  
  //RFC del receptor (REQUERIDO).
  $soap_request .= "    <tes:Importe>2720.00</tes:Importe>\n";
  $soap_request .= "    <tes:Impuesto>002</tes:Impuesto>\n";
  
  //Calle del receptor (REQUERIDO).
  $soap_request .= "    <tes:TasaOCuota>0.160000</tes:TasaOCuota>\n";
  
  //No. exterior del receptor (REQUERIDO).
  $soap_request .= "    <tes:TipoFactor>Tasa</tes:TipoFactor>\n";
  
  //Colonia del receptor (REQUERIDO).
  $soap_request .= "    </tes:TrasladoConceptoR>\n";
  
  //Localidad del receptor (opcional).
  $soap_request .= "    </tes:Traslados>\n";
  
  //Contacto de referencia del cliente (opcional).
  $soap_request .= "    </tes:Impuestos>\n";
  
  //Municio del receptor (REQUERIDO).
  $soap_request .= "    <tes:NoIdentificacion>00003</tes:NoIdentificacion>\n";
  
  //Estado del receptor (REQUERIDO).
  $soap_request .= "  <tes:Unidad>TONELADA</tes:Unidad>\n";
  
  //País del receptor (REQUERIDO).
  $soap_request .= "    <tes:ValorUnitario>10000.00</tes:ValorUnitario>\n";
  
  //Código postal del receptor (REQUERIDO).
  $soap_request .= "    </tes:ConceptoR>\n";
  $soap_request .= "    </tes:Conceptos>\n";
  
  
  /*************************************************************************************
         Sección de variables para la descripción de los conceptos
   *************************************************************************************/ 
   
   /************************************************************************************
                                     CONCEPTO 1
   ************************************************************************************/ 
  $soap_request .= "    <tes:CondicionesDePago>CONDICIONES</tes:CondicionesDePago>";
  
  //Cantidad, Unidad, Descripcion, ValorUnitario e Importe del Concepto. (REQUERIDOS)
  $soap_request .= "	<tes:Emisor>\n";
  
  //Seccion para detallar el impuesto por partida (Opcional).
  //Se indica el tipo de calculo que se realizara por cada Concepto (PARTIDA, IEPS_GASOLINA, IEPS_TABACO)
  $soap_request .= "    <tes:Nombre>HORACIO LLANOS</tes:Nombre>\n";
  $soap_request .= "    <tes:RegimenFiscal>601</tes:RegimenFiscal>\n";
  
  //Seccion para indicar el descuento por partida.
  $soap_request .= "    </tes:Emisor>\n";
  
  //Seccion para indicar las retenciones por partida.
  $soap_request .= "    <tes:Fecha>2017-06-26T11:36:11</tes:Fecha>\n";
  $soap_request .= "    <tes:Folio>167ABC</tes:Folio>\n";
  $soap_request .= "    <tes:FormaPago>01</tes:FormaPago>\n";
  $soap_request .= "    <tes:LugarExpedicion>45079</tes:LugarExpedicion>\n";
  $soap_request .= "    <tes:MetodoPago>PUE</tes:MetodoPago>\n";
  
  //Seccion para indicar las retenciones locales por partida.
  $soap_request .= "    <tes:Moneda>MXN</tes:Moneda>\n";
  $soap_request .= "    <tes:Receptor>\n";   
  $soap_request .= "    <tes:Nombre>RAFAEL ALEJANDRO HERNÁNDEZ PALACIOS</tes:Nombre>\n";
  $soap_request .= "    <tes:Rfc>TEST010203001</tes:Rfc>\n";
  $soap_request .= "    <tes:UsoCFDI>G01</tes:UsoCFDI>\n";
  
  //Seccion para indicar los impuestos de traslado por partida partida.
  $soap_request .= "    </tes:Receptor>\n";
  $soap_request .= "    <tes:Referencia>0001</tes:Referencia>\n";
  $soap_request .= "    <tes:Serie>A</tes:Serie>\n";
  $soap_request .= "    <tes:SubTotal>17000.00</tes:SubTotal>\n";
  $soap_request .= "    <tes:TipoCambio>1</tes:TipoCambio>\n";
  
  //Seccion para indicar los impuestos de traslado locales por partida partida.
  $soap_request .= "    <tes:Total>19720.00</tes:Total>\n";
  $soap_request .= "    </tem:cfdi>\n";
  $soap_request .= "    </tem:GenerarCFDI>\n";
  $soap_request .= "    </soapenv:Body>\n";
  $soap_request .= "    </soapenv:Envelope>\n";
  
//creo un archivo soap_reequest.xml e introduzco la cadena_xml
	$new_xml = fopen ("./soap-request.xml", "w");
	fwrite($new_xml,$soap_request);
	fclose($new_xml);

//Esta parde es el Header de la peticion SOAP y en ella se incluye el contenido de la pagina del servicio
  $header = array(
  	"POST /ConexionRemota33PREPROD/ConexionRemota.svc HTTP/1.1",
	"Host: www.fel.mx",
	"Content-Type: text/xml; charset=UTF-8",
	"Content-Length: ".strlen($soap_request),
	"SOAPAction: \"http://tempuri.org/IConexionRemota/GenerarCFDI\""
  );

//Parametros de la conexion al webservice y URL del servicio
  $soap_do = curl_init();
  curl_setopt($soap_do, CURLOPT_URL, "http://www.fel.mx/ConexionRemota33PREPROD/ConexionRemota.svc");
  curl_setopt($soap_do, CURLOPT_CONNECTTIMEOUT, 30);
  curl_setopt($soap_do, CURLOPT_TIMEOUT,        30);
  curl_setopt($soap_do, CURLOPT_RETURNTRANSFER, true );
  curl_setopt($soap_do, CURLOPT_SSL_VERIFYPEER, false);
  curl_setopt($soap_do, CURLOPT_SSL_VERIFYHOST, false);
  curl_setopt($soap_do, CURLOPT_POST,           true );
  curl_setopt($soap_do, CURLOPT_POSTFIELDS,     $soap_request);
  curl_setopt($soap_do, CURLOPT_HTTPHEADER,     $header);

// Respuesta del webservice
            $response = curl_exec($soap_do); 
            curl_close($soap_do);
			print $response;
//se guarda del web service (Tipo de Respuesta, XML Timbrado y CBB)			
	$new_xml = fopen ("./soap-response.xml", "w");
	fwrite($new_xml, $response);
	fclose($new_xml);

?>