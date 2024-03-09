
const TOKENAPI = "10233796187826030"


$( function(){
    
    
    $("#form").submit( (event)=> {

        event.preventDefault()
        let idHero = $('#heroeIDInput').val()
        if(validarInput( idHero ) ){
            $("#validationMessage").addClass( "d-none" )
            renderHeroById( idHero )
            // Limpiar el input 
            $('#heroeIDInput').val('');
        } else {
            $("#validationMessage").removeClass( "d-none" )
        }
        





        

    } )


    function renderHeroById(id){

        const render = $("#renderContainer")
    
       
        $.ajax({
            url : `https://superheroapi.com/api/${TOKENAPI}/${id}`,
            type: "GET",
            success: function(data){
                
                console.log(data)
                // limpiar resultados anteriores
                render.html("")
                
        
                render.html(`
                <div class="card mb-3" >
                <div class="row g-0">
                <div class="col-md-4">
                    <img src=${data.image.url} class="img-fluid rounded-start h-100" alt="...">
                </div>
                <div class="col-md-8">
                    <div class="card-body">
                    <h2 class="card-title">#${data.id}- ${data.name}</h2>
                    <p class="card-text">
                        <ul>
                            <li>Nombre Real: ${data.biography["full-name"]}</li>
                            <li>Lugar de nacimiento: ${data.biography["place-of-birth"]}</li>
                            <li>Primera aparición: ${data.biography["first-appearance"]}</li>
                            <li>Editorial: ${data.biography.publisher}</li>
                        </ul>
                    </p>
                    
                    </div>
                </div>
                </div>
                </div>
                `)

                //emplear la librería de gráficos CanvasJS, para mostrar dinámicamente información específica de cada superhéroe

                generateStatsGraph(data)
    
            },
            
            error: function(e){ 
                console.log("ERRRROOOORRRR",e)
                showValidationError()
            },
        })
    
        
    }



} )




function generateStatsGraph( data ){

    const stats = data.powerstats
    console.log("stats:",stats)

    // obtener el máximo valor para aplicarle animación
    let maxStatValue = 0 

    for( const [key,value] of Object.entries(stats) ){
        maxStatValue = +value > maxStatValue? +value : maxStatValue
    }

    console.log("maximo valor:", maxStatValue)


    // configuración del grafico

    $("#renderPoderes").html("")

    const chart = new CanvasJS.Chart("renderPoderes", {
        exportEnabled: false,
        animationEnabled: true,
        title:{
            text: "Estadisticas"
        },
        legend:{
            cursor: "pointer",
            itemclick: explodePie
        },
        data: [{
            type: "pie",
            showInLegend: false,
            toolTipContent: "{name}: <strong>{y} puntos</strong>",
            indexLabel: "{small} - {y}",
            dataPoints: [
                { y: stats.intelligence == "null"? 0: stats.intelligence  , name: "Inteligencia", small:"INT" , exploded: stats.intelligence ==  maxStatValue},
                { y: stats.strength == "null"? 0: stats.strength , name: "Fuerza", small:"FRZ", exploded: stats.strength ==  maxStatValue },
                { y: stats.speed== "null"? 0: stats.speed , name: "Velocidad", small:"VEL", exploded: stats.speed ==  maxStatValue },
                { y: stats.durability== "null"? 0: stats.durability , name: "Resistencia", small:"RST", exploded: stats.durability ==  maxStatValue },
                { y: stats.power== "null"? 0: stats.power , name: "Poder", small:"PDR", exploded: stats.power ==  maxStatValue },
                { y: stats.combat== "null"? 0: stats.combat , name: "Combate", small:"CMBT", exploded: stats.combat ==  maxStatValue },
               
            ]
        }]
    });

    chart.render();

    // remover marca de agua u°_°
    $(".canvasjs-chart-credit").remove()
    
}


function explodePie (e) {
	if(typeof (e.dataSeries.dataPoints[e.dataPointIndex].exploded) === "undefined" || !e.dataSeries.dataPoints[e.dataPointIndex].exploded) {
		e.dataSeries.dataPoints[e.dataPointIndex].exploded = true;
	} else {
		e.dataSeries.dataPoints[e.dataPointIndex].exploded = false;
	}
	e.chart.render();
}


// validationes //Implementar estructuras condicionales para generar alertas cuando existan errores en la búsqueda

function validarInput( input ){
    const numero = parseInt(input)
    return !isNaN(numero) && numero > 0 && numero < 731
}