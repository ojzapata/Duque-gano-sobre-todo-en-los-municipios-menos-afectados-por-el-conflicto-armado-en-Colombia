// https://observablehq.com/@ojzapata/untitled@197
export default function define(runtime, observer) {
  const main = runtime.module();
  main.variable(observer()).define(["md"], function(md){return(
md`# Duque ganó sobre todo en los municipios menos afectados por el conflicto armado en Colombia

¿Un voto por el discurso de seguridad o por el de paz? `
)});
  main.variable(observer("boxplot")).define("boxplot", ["html","d3","data"], function(html,d3,data)
{

      const target = html`
  <style>
  .chart {
    font-family: sans-serif;
  }
  .chart-footer {
    font-style: italic;
    font-size: 10pt;
    color: #aaa;
  }
.tooltip {
  background-color: black;
  border: none;
  border-radius: 5px;
  padding: 15px;
  min-width: 400px;
  text-align: left;
  color: white;
}
  </style>

<script src="https://d3js.org/d3-scale-chromatic.v1.min.js"></script>

  <div class="chart">
    <h4> El voto de los municipios menos afectados históricamente se inclina más por el discurso de la seguridad que de la paz</h4>
    <div>Este diagrama de caja representa la distribución del porcentaje de votos por el candidato presidencial Iván Duque a nivel municipal durante la segunda vuelta del proceso electoral de 2018 en Colombia. Se presentan dos diagramas, segmentando entre los municipios con mayor y menor incidencia histórica del conflicto armado en el país ("Decil 10 IICA", y "Decil 1 IICA", respectivamente).</div>

    <div id="box_plot"></div>

    <div class="chart-footer">Por <a href=https://twitter.com/ozapataquijano?lang=es">Oswaldo Zapata</a>.
      <br>
      <strong>Fuentes</strong>: <br> <a href="https://www.datoselectorales.org/wp-content/uploads/2019/04/MOE-Result.Presi20182daV.Candidato-municipio.xlsx">Datos Electorales, Misión de Observación Electoral</a>  <br>  <a href="https://colaboracion.dnp.gov.co/CDT/Poltica%20de%20Vctimas/Construcci%C3%B3n%20de%20Paz/IICA%20municipal.xls">Índice de Incidencia del Conflicto Armado, Departamento Nacional de Planeación </a>
    </div>



  </div>`;
  
  
  const margin = {top: 10, right: 30, bottom: 50, left: 70}
    const width = 600 - margin.left - margin.right
    const height = 500 - margin.top - margin.bottom
  
  
    const svg = d3.select(target).select("#box_plot")
      .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
      .append("g")
        .attr("transform",
              "translate(" + margin.left + "," + margin.top + ")");


  const y = d3.scaleBand()
    .range([ height, 0 ])
    .domain(["Decil 10 IICA", "Decil 1 IICA"])
    .padding(.4);
  svg.append("g")
    .call(d3.axisLeft(y).tickSize(0))
    .select(".domain").remove()

  d3.selectAll(".yAxis>.tick>text")
  .each(function(d, i){
    d3.select(this).style("font-size","100px");
  });
  
  

  const x = d3.scaleLinear()
    .domain([4,95])
    .range([0, width]);
  svg.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(x).ticks(10))
    .select(".domain").remove()
  

  const myColor = d3.scaleSequential() 
    .domain([4,95]).interpolator(d3.interpolateInferno)
  

  svg.append("text")
      .attr("text-anchor", "end")
      .style("fontSize", "large")
      .attr("x", width)
      .attr("y", height + margin.top + 30)
      .text("% votos por Iván Duque (2a vuelta 2018)");
  
  



  const sumstat = d3.nest() 
    .key(function(d) { return d.decil;})
    .rollup(function(d) {
      const q1 = d3.quantile(d.map(function(g) { return g.porc_cd;}).sort(d3.ascending),.25)
      const median = d3.quantile(d.map(function(g) { return g.porc_cd;}).sort(d3.ascending),.5)
      const q3 = d3.quantile(d.map(function(g) { return g.porc_cd;}).sort(d3.ascending),.75)
      const interQuantileRange = q3 - q1
      const min = q1 - 1.5 * interQuantileRange
      const max = q3 + 1.5 * interQuantileRange
      return({q1: q1, median: median, q3: q3, interQuantileRange: interQuantileRange, min: min, max: max})
      })
    .entries(data);

    

  

  svg
    .selectAll("vertLines")
    .data(sumstat)
    .enter()
    .append("line")
      .attr("x1", function(d){return(x(d.value.min))})
      .attr("x2", function(d){return(x(d.value.max))})
      .attr("y1", function(d){return(y(d.key) + y.bandwidth()/2)})
      .attr("y2", function(d){return(y(d.key) + y.bandwidth()/2)})
      .attr("stroke", "black")
      .style("width", 1000)
  

  svg
    .selectAll("boxes")
    .data(sumstat)
    .enter()
    .append("rect")
        .attr("x", function(d){return(x(d.value.q1))}) // console.log(x(d.value.q1)) ;
        .attr("width", function(d){ ; return(x(d.value.q3)-x(d.value.q1))}) //console.log(x(d.value.q3)-x(d.value.q1))
        .attr("y", function(d) { return y(d.key); })
        .attr("height", y.bandwidth() )
        .attr("stroke", "black")
        .style("fill", "#69b3a2")
        .style("opacity", 0.3)
  
  
  svg
    .selectAll("medianLines")
    .data(sumstat)
    .enter()
    .append("line")
      .attr("y1", function(d){return(y(d.key) + y.bandwidth())})
      .attr("y2", function(d){return(y(d.key) + y.bandwidth())})
      .attr("x1", function(d){return(x(d.value.median))})
      .attr("x2", function(d){return(x(d.value.median))})
      .attr("stroke", "black")
      .style("width", 2000)
  

 const tooltip = d3.select(target).select("#box_plot")
    .append("div")
      .style("opacity", 0)
      .attr("class", "tooltip")
      .style("font-size", "16px")
  

  const mouseover = function(d) {
    tooltip
      .transition()
      .duration(200)
      .style("opacity", 1)
    tooltip
        .html("<span style='color:grey'>Municipio: </span>" + d.municipio + "<br>" + "<span style='color:grey'>Departamento: </span>" + d.depto + "<br>" + "<span style='color:grey'>% Iván Duque: </span>" + d.porc_cd) // + d.Prior_disorder + "<br>" + "HR: " +  d.HR)
        .style("left", (d3.mouse(this)[0]+30) + "px")
        .style("top", (d3.mouse(this)[1]+30) + "px")
  }
  const mousemove = function(d) {
    tooltip
      .style("left", (d3.mouse(this)[0]+30) + "px")
      .style("top", (d3.mouse(this)[1]+30) + "px")
  }
  const mouseleave = function(d) {
    tooltip
      .transition()
      .duration(200)
      .style("opacity", 0)
  }
  

  const jitterWidth = 50
  svg
    .selectAll("indPoints")
    .data(data)
    .enter()
    .append("circle")
      .attr("cx", function(d){ return(x(d.porc_cd))})
      .attr("cy", function(d){ return( y(d.decil) + (y.bandwidth()/2) - jitterWidth/2 + Math.random()*jitterWidth )})
      .attr("r", 4)
      .style("fill", function(d){ return(myColor(+d.porc_cd)) })
      .attr("stroke", "black")
      .on("mouseover", mouseover)
      .on("mousemove", mousemove)
      .on("mouseleave", mouseleave)
  
  
    

  return target;
}
);
  main.variable(observer("data")).define("data", ["d3"], function(d3){return(
d3.csv("https://raw.githubusercontent.com/ojzapata/HW2---viz/master/hw2_decil.csv", d3.autoType)
)});
  main.variable(observer("d3")).define("d3", ["require"], function(require){return(
require("d3@5")
)});
  main.variable(observer()).define(["md"], function(md){return(
md`

En términos generales, la votación por Iván Duque tendió a ser superior en los municipios que padecieron menos el conflicto armado. En efecto, mientras la mediana del porcentaje de votos por este candidato fue del 62.7% en los municipios más afectados ("Decil 10 IICA"), en el otro grupo, el de los menos afectados ("Decil 1 IICA), fue en cambio de 55.5%. Más todavía, la media del primer grupo se ubicó en el 59.8% cuando la del segundo lo hizo en el 52.1%. Haciendo un test de diferencia de medias se encuentra que la distancia de casi 8 puntos porcentuales entre ambas es estadísticamente significativa al 99% de confianza (p-value=0.0041). 

Ahora bien, existe también mucha heterogeneidad entre las preferencias electorales de los territorios con mayor incidencia del conflicto. El rango intercuartil de este grupo es más amplio que el del otro. Esto se denota por el ancho de la caja en el diagrama, que está horizontal. La desviación estándar, que mide la dispersión de los datos en torno a la media, es superior también en ese grupo (25.3 contra 16.8). De hecho, la diferencia del valor máximo en ambas distribuciones no supera un punto porcentual. Y la brecha realmente importante está en los niveles más bajos de las distribuciones, donde se evidencian votaciones de menor tamaño entre los municipios más golpeados por la violencia.

El usuario esperado para esta visualización es uno de nivel intermedio, que tiene una cultura compatible con -y nociones básicas de- análisis de datos. El diagrama de caja se basa en un modismo que representa cinco estadísticas descriptivas univariadas: el valor mínimo, el percentil 25, la mediana, el percentil 75 y el valor máximo. Una persona del común no necesariamente ha adquirido las habilidades mínimas para interpretar este tipo de gráficos sin haber recibido al menos algo de entrenamiento. Más todavía, cuando hay una segmentación entre grupos de municipios por niveles de incidencia del conflicto armado que es también, a su vez, resultado de una derivación con base en distribuciones univariadas.

## **What**
* *Dataset*: tabla, items y atributos. 

El [dataset]("https://raw.githubusercontent.com/ojzapata/HW2---viz/master/hw2_decil.csv") utilizado para esta visualización es una tabla cuyos items corresponden a los municipios de Colombia que se ubican en los extremos de la distribución del "Índice de incidencia del conflicto armado en Colombia" -IICA- diseñado por el Departamento Nacional de Planeación -DNP- para focalizar las estrategias de normalización y posconflicto a nivel territorial (cuya tabla original puede consultarse [aquí]("https://colaboracion.dnp.gov.co/CDT/Poltica%20de%20Vctimas/Construcci%C3%B3n%20de%20Paz/IICA%20municipal.xls")).

En particular, son los municipios que hacen parte del primer y último decil, esto es, los menos y los más afectados, en cada caso. Los atributos de la tabla son: i. la identificación de los municipios de acuerdo con el código que les asigna el Departamento Administrativo Nacional de Estadística DANE; ii. el nombre de los mismos; iii. el nombre del departamento al que pertenecen; iv. el porcentaje de votos por el candidato Iván Duque durante la segunda vuelta de las elecciones presidenciales de 2018; y v. y la identificación de si hace parte del primer o del último decil según el IICA. La obtención de este último atributo corresponde a una *derivación* del dataset original expuesto por el DNP

La participación porcentual de los votos por el candidato Iván Duque entre los votos válidos a nivel municipal proviene de la tabla expuesta por el proyecto de *Datos elctorales* de la Misión de Observación Electoral MOE, y pueden ser consultados directamente haciendo click [aquí]("https://www.datoselectorales.org/wp-content/uploads/2019/04/MOE-Result.Presi20182daV.Candidato-municipio.xlsx")

* *Tipos de atributos*:

Los códigos y descripciones de nombres de municipios y departamentos son datos categóricos. El porcentaje de votos por Iván Duque es una variable ordenada, cuantitativa y secuencial. El identificador del decil en que se encuentran los municipios es una variable ordenada, ordinal y secuencial. El IICA original, del que se derivó este último identificador, es un índice que actúa como dato ordenado, cuantitativo y secuencial.

## **Why**

* *Main Action*: 
compare.
* *Main Target*: 
a univariate distribution between two groups.
* *Main Task*: La visualización pretende facilitar la comparación de la distribución del porcentaje de votos en favor del candidato Iván Duque a nivel municipal durante las elecciones presidenciales de segunda vuelta de 2018 en Colombia, entre los municipios que fueron más afectados por el conflicto armado, por un lado, y los que no, por el otro.


* *Secondary Action*: Browse, when there is a location known, based on the position of a specific point in the box plot, but the user doesn't know what is the target with that position (that is, the name of the municipality, which can be accesed from the information the interaction offers).
* *Secondary Target*: One Attribute, Distribution.
* *Secondary Task*: Identificar los nombres de los municipios según su posición en la distribución univariada del porcentaje municipal de votos por Iván Duque durante la segunda vuelta presidencial de 2018 en Colombia. Esto se resuelve con la interacción que abre una caja con información atributiva sobre un punto cuando el cursor se ubica sobre el mismo.

## **How**

* *Marks*: 

se usan puntos para representar la posición de cada municipio en la distribución, y áreas para representar el espacio donde se distribuye el 50% de los municipios de cada grupo correspondiente a su rango intercuartil. 

* *Channels*: 

se trata de una representación que usa canales de magnitud para atributos ordenados. Los puntos señalan posiciones a partir de una escala común en relación con el eje x; así como las cajas, que son áreas, tienen el mismo referente de escala. Las líneas que indican la longitud entre el valor mínimo y el máximo, también se conocen como "bigotes" en este tipo de diagramas. El tono de color de los puntos enfatiza la magnitud del porcentaje de votos por Iván Duque.

* *Visual encoding and interaction idiom*:

El modismo empleado aquí es el de un diagrama de caja, que se combina con interacciones que le permiten precisar al usuario cuál es el nombre exacto del municipio, cuál el de su departamento y, finalmente, el porcentaje de la votación por Iván Duque.


`
)});
  return main;
}
