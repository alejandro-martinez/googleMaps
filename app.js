angular.module('gMap', ['ngMap'])
.constant('Config', {
	API_GOOGLE: "http://maps.google.com/maps/api",
	CIUDAD: "Rosario, Santa Fe",
	COORDENADAS_CIUDAD: "-32.934015,-60.656181"
})
.service('gMapFct', ['Config', 'NgMap','$http', function( Config, NgMap, $http ) {

	var gMapFct = function() {

		this.getMap = function( callback ) {
			NgMap.getMap().then(function(map) {
				callback(map);
			});
		};
		this.getCoordenadasDireccion = function( direccion, callback ) {
			$http({
				method: 'GET',
				url: Config.API_GOOGLE + "/geocode/json?address=" + direccion + "&sensor=true&region=ARGENTINA"
			}).
			success(function(data, status) {
				if (data.results.length) {
					callback( data.results[0].geometry.location );
				}
			}).
			error(function(data, status) {
				console.log("Error",data)
			});
		};
		this.addMarcador = function( coords ) {
			this.getMap(function( map ){

				var marker = new google.maps.Marker({
					position: new google.maps.LatLng( coords.lat, coords.lng ),
				});
				marker.setMap( map );
			});
		};
	}
	return new gMapFct();
}])
.factory('ComerciosFct', [function() {

	//Testing
	var ComerciosFct = {
		getByRubro: function() {
			return [{direccion: "Suipacha 1135"},
					{direccion: "San Juan 334" }
			];
		}
	}

	return ComerciosFct;
}])
.controller('gMapCtrl', ['gMapFct', 'ComerciosFct','Config',
				function( gMapFct, ComerciosFct, Config ) {

	//Traigo los comercios del rubro
	var comerciosDeRubroX = ComerciosFct.getByRubro();

	//Carga los marcadores en el mapa
	var onSuccess = function( coords ) {
		gMapFct.addMarcador( coords );
	};

	//Recorrer los comercios y obtiene las coordenadas de sus direcciones
	comerciosDeRubroX.forEach(function( c ){
		gMapFct.getCoordenadasDireccion(c.direccion.concat(",",Config.CIUDAD), onSuccess);
	});
}]);
