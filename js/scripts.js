
$(function () {


    // *** APIs ***
    // clima, previsão 12 horas e previsão 5 dias: https://developer.accuweather.com/apis
    // pegar coordenadas geográficas pelo nome da cidade: https://docs.mapbox.com/api/
    // pegar coordenadas do IP: http://www.geoplugin.net
    // gerar gráficos em JS: https://www.highcharts.com/demo

    //http://dataservice.accuweather.com/currentconditions/v1/28143?apikey=H5FfZYNCOX8PJdcZrQ9bQJtaYeZXbu9A&language=pt-BR
    var accuweatherAPIkey = "H5FfZYNCOX8PJdcZrQ9bQJtaYeZXbu9A"

    var weatherObject = {
        cidade: "",
        estado: "",
        pais: "",
        temperatura:"",
        texto_clima:"",
        icone_clima:" "

    };

    function preencherClimaAgora(cidade, estado, pais, temperatura, texto_clima, icone_clima){
        var texto_local = cidade +", " + estado + ". "+ pais;
        $("#texto_local").text(texto_local);
        $("#texto_clima").text(texto_clima);
        $("#texto_temperatura").html( String(temperatura) + "&deg;");
        $("#icone_clima").css("background-image", "url('"+ weatherObject.icone_clima +"')");

    }

    function pegarTempoAtual(localCode) {

        $.ajax({
            url: "http://dataservice.accuweather.com/currentconditions/v1/" + localCode + "?apikey=" + accuweatherAPIkey + "&language=pt-BR",
            type: "GET",
            dataType: "json",
            success: function (data) {
                console.log("curent condicions: ",data);

                weatherObject.temperatura = data[0].Temperature.Metric.Value;
                weatherObject.texto_clima = data[0].WeatherText;

                var iconNumber = data[0].WeatherIcon <= 9 ? "0" + String(data[0].WeatherIcon) : String(data[0].WeatherIcon);

                weatherObject.icone_clima = "https://developer.accuweather.com/sites/default/files/"+ iconNumber +"-s.png";

                preencherClimaAgora(weatherObject.cidade, weatherObject.estado, weatherObject.pais, weatherObject.temperatura, weatherObject.texto_clima, weatherObject.icone_clima);

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
                console.log("geoposion: ",data);

                try{
                    weatherObject.cidade = data.ParentCity.LocalizedName;
                }catch{
                    weatherObject.cidade = data.LocalizedName;
                }

                weatherObject.estado = data.AdministrativeArea.LocalizedName;
                weatherObject.pais = data.Country.LocalizedName;

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



