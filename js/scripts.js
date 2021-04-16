
$(function () {


    // *** APIs ***
    // clima, previsão 12 horas e previsão 5 dias: https://developer.accuweather.com/apis
    // pegar coordenadas geográficas pelo nome da cidade: https://docs.mapbox.com/api/
    // pegar coordenadas do IP: http://www.geoplugin.net
    // gerar gráficos em JS: https://www.highcharts.com/demo

    //http://dataservice.accuweather.com/currentconditions/v1/28143?apikey=H5FfZYNCOX8PJdcZrQ9bQJtaYeZXbu9A&language=pt-BR
    var accuweatherAPIkey = "H5FfZYNCOX8PJdcZrQ9bQJtaYeZXbu9A"

    function pegarTempoAtual(localCode) {

        $.ajax({
            url: "http://dataservice.accuweather.com/currentconditions/v1/" + localCode + "?apikey=" + accuweatherAPIkey + "&language=pt-BR",
            type: "GET",
            dataType: "json",
            success: function (data) {
                console.log(data)

            },
            error: function () {
                console.log("erro")
            }

        });
    }

    function pegarLocalUsuario(lat, long) {

        $.ajax({
            url: "http://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=" + accuweatherAPIkey + "&q=" + lat + "%2C" + long + "&language=pt-BR",
            type: "GET",
            dataType: "json",
            success: function (data) {
                var localCode = data.Key;
                pegarTempoAtual(localCode);

            },
            error: function () {
                console.log("erro")
            }

        });
    }
    

    function pegarCoordenadasIP() {
        var lat_padrao = -8.047547;
        var long_padrao = -34.926485;

        $.ajax({
            url: "http://www.geoplugin.net/json.gp",
            type: "GET",
            dataType: "json",
            success: function (data) {

                if(data.geoplugin_latitude && data.geoplugin_longitude){
                    pegarLocalUsuario(data.geoplugin_latitude,data.geoplugin_longitude);
                }else{
                    pegarLocalUsuario(lat_padrao,long_padrao);
                }
                
            },
            error: function () {
                console.log("erro");
                pegarLocalUsuario(lat_padrao,long_padrao);
            }

        });

    }
    pegarCoordenadasIP();
});



