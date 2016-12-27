function GetBug($http, $q, CONFIG)     
{
    var q = $q.defer();

    $http({      
          method: 'GET',
          url: CONFIG.APIURL + '/GetBug',

      }).success(function(data)
        {
            q.resolve(data);  
        }).error(function(data, status){
            q.resolve(status);
     }); 
    return q.promise;
}

//agrega un bug
function AgregarBug($http, CONFIG, $q, bug)
{    
    var q = $q.defer();
    
    $http({      
          method: 'POST',
          url: CONFIG.APIURL + '/AgregarBug',
          data: bug

      }).success(function(data)
        {
            
            if(data[0].Estatus == "Exitoso") 
            {
                q.resolve("Exitoso");
            }
            else
            {
                q.resolve("Fallido");
            }
            
        }).error(function(data, status){
            q.resolve(status);

     }); 
    return q.promise;
}

//edita una plaza
function ResolverBug($http, CONFIG, $q, bug)
{
    var q = $q.defer();
    

    $http({      
          method: 'PUT',
          url: CONFIG.APIURL + '/ResolverBug',
          data: bug

      }).success(function(data)
        {
            
            if(data[0].Estatus == "Exitoso") 
            {
                q.resolve("Exitoso");
            }
            else
            {
                q.resolve("Fallido");
            }
            
        }).error(function(data, status){
            q.resolve(status);

     }); 
    return q.promise;
}