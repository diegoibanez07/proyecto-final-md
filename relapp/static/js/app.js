// Guarda toda la informacion que cambia mientras se usa la pagina.
const estadoAplicacion = {
  // Guarda los nombres de los elementos del conjunto A.
  etiquetas: ["1", "2", "3", "4"],

  // Guarda la matriz relacional MR que se analiza.
  matriz: [
    [1, 1, 0, 0],
    [0, 1, 1, 0],
    [0, 0, 1, 1],
    [0, 0, 0, 1],
  ],

  // Guarda el ultimo resultado completo recibido del backend.
  ultimoReporte: null,

  // Guarda una descripcion corta del origen de la matriz actual.
  origenMatriz: "MR inicial ingresada por pantalla",

  // Guarda la instancia del grafo para destruirla antes de dibujar otra.
  grafoActual: null,
};

// Relaciona los nombres internos de las propiedades con textos visibles.
const nombresPropiedades = {
  // Texto visible para reflexividad.
  reflexive: "Reflexiva",

  // Texto visible para irreflexividad.
  irreflexive: "Irreflexiva",

  // Texto visible para simetria.
  symmetric: "Simetrica",

  // Texto visible para asimetria.
  asymmetric: "Asimetrica",

  // Texto visible para antisimetria.
  antisymmetric: "Antisimetrica",

  // Texto visible para transitividad.
  transitive: "Transitiva",
};

// Relaciona las clasificaciones internas con textos visibles.
const nombresClasificaciones = {
  // Texto visible para equivalencia.
  equivalence: "Equivalencia",

  // Texto visible para orden parcial.
  partial_order: "Orden parcial",

  // Texto visible para orden total.
  total_order: "Orden total",

  // Texto visible para orden estricto.
  strict_order: "Orden estricto",
};

// Guarda el temporizador usado para no analizar demasiadas veces seguidas.
let temporizadorAnalisis = null;

// Busca un elemento HTML usando un selector CSS.
const buscarElemento = (selector) => document.querySelector(selector);

// Busca varios elementos HTML usando un selector CSS.
const buscarElementos = (selector) => Array.from(document.querySelectorAll(selector));

// Espera a que el documento HTML este cargado.
document.addEventListener("DOMContentLoaded", () => {
  // Conecta botones y campos con sus funciones.
  conectarEventosDeLaInterfaz();

  // Dibuja la matriz inicial.
  dibujarMatrizEditable();

  // Analiza la matriz inicial.
  analizarTodo();

  // Comprueba que el backend este respondiendo.
  verificarEstadoDelServidor();
});

// Conecta cada boton o campo con una funcion concreta.
function conectarEventosDeLaInterfaz() {
  // Conecta el boton Crear con la creacion de una matriz vacia.
  buscarElemento("#buildMatrixBtn").addEventListener("click", crearMatrizDesdeTamano);

  // Conecta el boton para ir al cuadro de matriz.
  buscarElemento("#goMatrixBtn").addEventListener("click", enfocarEditorDeMatriz);

  // Conecta el boton de generacion aleatoria.
  buscarElemento("#randomMatrixBtn").addEventListener("click", generarMatrizAleatoria);

  // Conecta el boton de ejemplos por propiedad u orden.
  buscarElemento("#exampleMatrixBtn").addEventListener("click", generarMatrizDeEjemploSeleccionada);

  // Conecta el boton para cargar texto pegado.
  buscarElemento("#pasteMatrixBtn").addEventListener("click", cargarMatrizPegada);

  // Conecta el boton para analizar todo.
  buscarElemento("#analyzeBtn").addEventListener("click", analizarTodo);

  // Conecta el boton para limpiar la matriz.
  buscarElemento("#clearBtn").addEventListener("click", limpiarMatriz);

  // Conecta el boton para copiar la relacion R.
  buscarElemento("#copyRelationBtn").addEventListener("click", copiarRelacion);

  // Conecta cada boton de propiedad individual.
  buscarElementos(".property-btn").forEach((botonPropiedad) => {
    // Ejecuta solo la propiedad marcada en el boton.
    botonPropiedad.addEventListener("click", () => analizarPropiedadIndividual(botonPropiedad.dataset.property));
  });
}

// Crea una matriz vacia con el tamano indicado por el usuario.
function crearMatrizDesdeTamano() {
  // Lee y valida el tamano n.
  const tamano = leerTamano();

  // Crea etiquetas automaticas para filas y columnas.
  const etiquetas = crearEtiquetasAutomaticas(tamano);

  // Crea una matriz llena de ceros.
  const matrizVacia = crearMatrizVacia(tamano);

  // Actualiza el estado con la nueva matriz.
  cambiarMatrizActual(matrizVacia, etiquetas, "MR vacia creada para ingreso por pantalla");

  // Marca el modo manual como activo.
  marcarModoDeEntrada("manual");

  // Mueve la pantalla al cuadro editable.
  enfocarEditorDeMatriz();

  // Analiza la matriz nueva.
  analizarTodo();

  // Muestra una guia corta.
  mostrarAviso(`Cuadro ${tamano} x ${tamano} creado. Ahora llena las casillas con clic.`, "success");
}

// Lee el numero n desde el campo de tamano.
function leerTamano() {
  // Convierte el texto del campo en numero entero.
  const tamano = Number.parseInt(buscarElemento("#sizeInput").value, 10);

  // Valida que n sea un entero positivo.
  if (!Number.isInteger(tamano) || tamano < 1) {
    // Muestra error cuando n no es valido.
    mostrarAviso("Ingrese un tamano n valido. Debe ser un numero entero mayor o igual a 1.", "danger");

    // Devuelve el tamano actual para no romper la interfaz.
    return estadoAplicacion.matriz.length;
  }

  // Devuelve el tamano valido.
  return tamano;
}

// Crea etiquetas automaticas 1,2,3,...,n.
function crearEtiquetasAutomaticas(tamano) {
  // Construye una lista con tantos elementos como indique n.
  return Array.from({ length: tamano }, (_, indice) => String(indice + 1));
}

// Crea una matriz cuadrada llena de ceros.
function crearMatrizVacia(tamano) {
  // Crea cada fila de la matriz.
  return Array.from({ length: tamano }, () => {
    // Crea cada columna de la fila.
    return Array.from({ length: tamano }, () => 0);
  });
}

// Reemplaza la matriz actual por otra matriz.
function cambiarMatrizActual(matriz, etiquetas, origenMatriz) {
  // Guarda la nueva matriz.
  estadoAplicacion.matriz = matriz;

  // Guarda las etiquetas asociadas.
  estadoAplicacion.etiquetas = etiquetas;

  // Guarda la descripcion de origen.
  estadoAplicacion.origenMatriz = origenMatriz;

  // Sincroniza campos visibles.
  sincronizarCamposDeEntrada();

  // Dibuja la matriz editable.
  dibujarMatrizEditable();
}

// Actualiza textos y campos segun el estado actual.
function sincronizarCamposDeEntrada() {
  // Actualiza el campo de tamano.
  buscarElemento("#sizeInput").value = estadoAplicacion.matriz.length;

  // Actualiza el texto de tamano.
  buscarElemento("#matrixMeta").textContent = `${estadoAplicacion.matriz.length} x ${estadoAplicacion.matriz.length}, binaria y cuadrada`;

  // Actualiza el origen de la matriz.
  buscarElemento("#currentInputSummary").textContent = `${estadoAplicacion.origenMatriz}. Filas y columnas: ${estadoAplicacion.etiquetas.join(", ")}`;

  // Actualiza la matriz visible en texto completa.
  buscarElemento("#matrixTextOutput").textContent = convertirMatrizATexto(estadoAplicacion.matriz);

  // Actualiza el cuadro opcional de pegado completo.
  buscarElemento("#pasteMatrix").value = convertirMatrizATexto(estadoAplicacion.matriz);
}

// Convierte una matriz en texto con filas separadas por saltos de linea.
function convertirMatrizATexto(matriz) {
  // Une cada fila con espacios y luego une las filas con saltos de linea.
  return matriz.map((fila) => fila.join(" ")).join("\n");
}

// Dibuja el cuadro editable de la matriz.
function dibujarMatrizEditable() {
  // Sincroniza los textos antes de dibujar.
  sincronizarCamposDeEntrada();

  // Crea la tabla HTML.
  const tabla = document.createElement("table");

  // Asigna la clase visual de tabla.
  tabla.className = "matrix-table";

  // Crea encabezado de columnas.
  tabla.appendChild(crearEncabezadoDeMatriz());

  // Crea cuerpo con filas y celdas.
  tabla.appendChild(crearCuerpoDeMatriz());

  // Reemplaza la tabla anterior por la nueva.
  buscarElemento("#matrixContainer").replaceChildren(tabla);
}

// Crea la fila superior con nombres de columnas.
function crearEncabezadoDeMatriz() {
  // Crea el contenedor del encabezado.
  const encabezado = document.createElement("thead");

  // Crea la fila del encabezado.
  const filaEncabezado = document.createElement("tr");

  // Agrega una celda vacia en la esquina superior izquierda.
  filaEncabezado.appendChild(document.createElement("th"));

  // Recorre las etiquetas del conjunto A.
  estadoAplicacion.etiquetas.forEach((etiqueta) => {
    // Crea una celda de encabezado.
    const celdaEncabezado = document.createElement("th");

    // Escribe la etiqueta.
    celdaEncabezado.textContent = etiqueta;

    // Agrega la celda a la fila.
    filaEncabezado.appendChild(celdaEncabezado);
  });

  // Agrega la fila al encabezado.
  encabezado.appendChild(filaEncabezado);

  // Devuelve el encabezado terminado.
  return encabezado;
}

// Crea todas las filas de la matriz editable.
function crearCuerpoDeMatriz() {
  // Crea el cuerpo de la tabla.
  const cuerpo = document.createElement("tbody");

  // Recorre cada fila de la matriz.
  estadoAplicacion.matriz.forEach((fila, indiceFila) => {
    // Crea una fila HTML.
    const filaHtml = document.createElement("tr");

    // Crea el encabezado lateral de la fila.
    filaHtml.appendChild(crearEncabezadoDeFila(indiceFila));

    // Recorre cada valor de la fila.
    fila.forEach((valor, indiceColumna) => {
      // Crea una celda editable.
      filaHtml.appendChild(crearCeldaEditable(valor, indiceFila, indiceColumna));
    });

    // Agrega la fila al cuerpo.
    cuerpo.appendChild(filaHtml);
  });

  // Devuelve el cuerpo completo.
  return cuerpo;
}

// Crea el encabezado lateral de una fila.
function crearEncabezadoDeFila(indiceFila) {
  // Crea la celda de encabezado.
  const encabezadoFila = document.createElement("th");

  // Escribe la etiqueta de la fila.
  encabezadoFila.textContent = estadoAplicacion.etiquetas[indiceFila];

  // Devuelve la celda creada.
  return encabezadoFila;
}

// Crea una celda que puede cambiar entre 0 y 1.
function crearCeldaEditable(valor, indiceFila, indiceColumna) {
  // Crea la celda de tabla.
  const celdaTabla = document.createElement("td");

  // Crea el boton que representa el valor 0 o 1.
  const botonCelda = document.createElement("button");

  // Define el tipo del boton.
  botonCelda.type = "button";

  // Asigna clases visuales segun el valor.
  botonCelda.className = `matrix-cell value-${valor}`;

  // Muestra el valor dentro del boton.
  botonCelda.textContent = String(valor);

  // Explica que par representa la celda.
  botonCelda.title = `(${estadoAplicacion.etiquetas[indiceFila]}, ${estadoAplicacion.etiquetas[indiceColumna]})`;

  // Conecta el clic con el cambio de valor.
  botonCelda.addEventListener("click", () => cambiarValorDeCelda(indiceFila, indiceColumna));

  // Agrega el boton dentro de la celda.
  celdaTabla.appendChild(botonCelda);

  // Devuelve la celda lista.
  return celdaTabla;
}

// Cambia una posicion de la matriz entre 0 y 1.
function cambiarValorDeCelda(indiceFila, indiceColumna) {
  // Lee el valor actual.
  const valorActual = estadoAplicacion.matriz[indiceFila][indiceColumna];

  // Cambia 1 por 0 o 0 por 1.
  estadoAplicacion.matriz[indiceFila][indiceColumna] = valorActual === 1 ? 0 : 1;

  // Registra de donde viene el cambio.
  estadoAplicacion.origenMatriz = `MR editada por pantalla en (${estadoAplicacion.etiquetas[indiceFila]}, ${estadoAplicacion.etiquetas[indiceColumna]})`;

  // Marca el modo manual como activo.
  marcarModoDeEntrada("manual");

  // Dibuja nuevamente la tabla.
  dibujarMatrizEditable();

  // Programa el analisis automatico.
  programarAnalisis();
}

// Carga una matriz escrita en el cuadro opcional de texto.
function cargarMatrizPegada() {
  // Intenta convertir el texto en matriz.
  try {
    // Convierte el texto pegado en matriz.
    const matriz = convertirTextoAMatriz(buscarElemento("#pasteMatrix").value);

    // Crea etiquetas automaticas para el nuevo tamano.
    const etiquetas = crearEtiquetasAutomaticas(matriz.length);

    // Reemplaza la matriz actual.
    cambiarMatrizActual(matriz, etiquetas, "MR ingresada por teclado");

    // Analiza la matriz cargada.
    analizarTodo();

    // Informa que la carga fue exitosa.
    mostrarAviso("Matriz cargada correctamente.", "success");
  } catch (error) {
    // Informa errores de formato.
    mostrarAviso(error.message, "danger");
  }
}

// Convierte texto con 0 y 1 en una matriz.
function convertirTextoAMatriz(texto) {
  // Separa el texto en filas.
  const filasDeTexto = texto.trim().split(/\n+/).filter(Boolean);

  // Convierte cada fila en una lista de numeros.
  const matriz = filasDeTexto.map(convertirFilaDeTextoANumeros);

  // Valida que la matriz sea cuadrada.
  validarMatrizPegada(matriz);

  // Devuelve la matriz lista.
  return matriz;
}

// Convierte una fila de texto en numeros 0 y 1.
function convertirFilaDeTextoANumeros(filaDeTexto) {
  // Separa valores por espacios, comas o punto y coma.
  const valores = filaDeTexto.trim().split(/[\s,;]+/).filter(Boolean);

  // Convierte y valida cada valor.
  return valores.map((valor) => {
    // Rechaza valores diferentes de 0 y 1.
    if (valor !== "0" && valor !== "1") {
      // Lanza error para mostrarlo al usuario.
      throw new Error("La matriz pegada solo acepta 0 y 1.");
    }

    // Devuelve el valor numerico.
    return Number(valor);
  });
}

// Valida la matriz cargada desde texto.
function validarMatrizPegada(matriz) {
  // Rechaza matriz vacia.
  if (matriz.length === 0) {
    // Lanza error claro.
    throw new Error("La matriz pegada no puede estar vacia.");
  }

  // Rechaza filas con longitud diferente al numero de filas.
  if (matriz.some((fila) => fila.length !== matriz.length)) {
    // Lanza error claro.
    throw new Error("La matriz pegada debe ser cuadrada.");
  }
}

// Pide al backend una matriz aleatoria.
async function generarMatrizAleatoria() {
  // Deshabilita botones mientras se procesa.
  cambiarEstadoDeProceso(true);

  // Intenta llamar a la API.
  try {
    // Recibe una matriz aleatoria desde Flask.
    const respuesta = await enviarJson("/api/generate", { n: leerTamano() });

    // Reemplaza la matriz actual con la aleatoria.
    cambiarMatrizActual(respuesta.matrix, respuesta.labels, "MR generada aleatoriamente por el sistema");

    // Marca el modo aleatorio como activo.
    marcarModoDeEntrada("aleatoria");

    // Analiza la matriz generada.
    await analizarTodo();

    // Informa que se genero bien.
    mostrarAviso("Matriz aleatoria generada correctamente.", "success");
  } catch (error) {
    // Muestra cualquier error de API.
    mostrarAviso(error.message, "danger");
  } finally {
    // Habilita botones nuevamente.
    cambiarEstadoDeProceso(false);
  }
}

// Genera una matriz de ejemplo segun la opcion elegida.
function generarMatrizDeEjemploSeleccionada() {
  // Lee el tamano actual.
  const tamano = leerTamano();

  // Lee el tipo de ejemplo elegido.
  const tipoEjemplo = buscarElemento("#exampleTypeSelect").value;

  // Crea la matriz de ejemplo.
  const matrizEjemplo = crearMatrizDeEjemplo(tipoEjemplo, tamano);

  // Crea etiquetas automaticas.
  const etiquetas = crearEtiquetasAutomaticas(tamano);

  // Cambia la matriz actual.
  cambiarMatrizActual(matrizEjemplo, etiquetas, `MR de ejemplo para ${obtenerNombreDeEjemplo(tipoEjemplo)}`);

  // Marca el modo ejemplo como activo.
  marcarModoDeEntrada("ejemplo");

  // Analiza el ejemplo.
  analizarTodo();

  // Muestra aviso claro.
  mostrarAviso(`Matriz de ejemplo generada: ${obtenerNombreDeEjemplo(tipoEjemplo)}.`, "success");
}

// Crea una matriz que cumple una propiedad u orden elegido.
function crearMatrizDeEjemplo(tipoEjemplo, tamano) {
  // Usa matriz vacia para irreflexiva.
  if (tipoEjemplo === "irreflexive") {
    return crearMatrizVacia(tamano);
  }

  // Usa matriz identidad para reflexiva y equivalencia.
  if (tipoEjemplo === "reflexive" || tipoEjemplo === "equivalence") {
    return crearMatrizIdentidad(tamano);
  }

  // Usa matriz completa para simetrica.
  if (tipoEjemplo === "symmetric") {
    return crearMatrizCompleta(tamano);
  }

  // Usa relacion menor que para asimetrica y orden estricto.
  if (tipoEjemplo === "asymmetric" || tipoEjemplo === "strict_order") {
    return crearMatrizMenorQue(tamano);
  }

  // Usa relacion menor o igual para antisimetrica, transitiva y orden total.
  if (tipoEjemplo === "antisymmetric" || tipoEjemplo === "transitive" || tipoEjemplo === "total_order") {
    return crearMatrizMenorOIgual(tamano);
  }

  // Usa divisibilidad para un orden parcial no necesariamente total.
  if (tipoEjemplo === "partial_order") {
    return crearMatrizDivisibilidad(tamano);
  }

  // Devuelve matriz vacia si llega una opcion desconocida.
  return crearMatrizVacia(tamano);
}

// Crea una matriz con unos en la diagonal.
function crearMatrizIdentidad(tamano) {
  // Recorre filas y columnas.
  return Array.from({ length: tamano }, (_, fila) => {
    // Coloca 1 solo cuando fila y columna son iguales.
    return Array.from({ length: tamano }, (_, columna) => (fila === columna ? 1 : 0));
  });
}

// Crea una matriz llena de unos.
function crearMatrizCompleta(tamano) {
  // Todas las posiciones pertenecen a la relacion.
  return Array.from({ length: tamano }, () => Array.from({ length: tamano }, () => 1));
}

// Crea la relacion menor que sobre 1,2,3,...,n.
function crearMatrizMenorQue(tamano) {
  // Marca 1 cuando la fila es menor que la columna.
  return Array.from({ length: tamano }, (_, fila) => {
    // Compara indices para simular menor que.
    return Array.from({ length: tamano }, (_, columna) => (fila < columna ? 1 : 0));
  });
}

// Crea la relacion menor o igual sobre 1,2,3,...,n.
function crearMatrizMenorOIgual(tamano) {
  // Marca 1 cuando la fila es menor o igual que la columna.
  return Array.from({ length: tamano }, (_, fila) => {
    // Compara indices para simular menor o igual.
    return Array.from({ length: tamano }, (_, columna) => (fila <= columna ? 1 : 0));
  });
}

// Crea la relacion de divisibilidad sobre 1,2,3,...,n.
function crearMatrizDivisibilidad(tamano) {
  // Marca 1 cuando el numero de la fila divide al numero de la columna.
  return Array.from({ length: tamano }, (_, fila) => {
    // Convierte indice de fila en numero natural.
    const numeroFila = fila + 1;

    // Evalua cada columna.
    return Array.from({ length: tamano }, (_, columna) => {
      // Convierte indice de columna en numero natural.
      const numeroColumna = columna + 1;

      // Devuelve 1 si divide exacto.
      return numeroColumna % numeroFila === 0 ? 1 : 0;
    });
  });
}

// Devuelve el nombre visible del ejemplo.
function obtenerNombreDeEjemplo(tipoEjemplo) {
  // Define nombres entendibles para el usuario.
  const nombres = {
    reflexive: "Reflexiva",
    irreflexive: "Irreflexiva",
    symmetric: "Simetrica",
    asymmetric: "Asimetrica",
    antisymmetric: "Antisimetrica",
    transitive: "Transitiva",
    equivalence: "Equivalencia",
    partial_order: "Orden parcial",
    total_order: "Orden total",
    strict_order: "Orden estricto",
  };

  // Devuelve el nombre encontrado o el codigo original.
  return nombres[tipoEjemplo] || tipoEjemplo;
}

// Limpia la matriz actual dejandola en ceros.
function limpiarMatriz() {
  // Crea matriz vacia del mismo tamano.
  const matrizVacia = crearMatrizVacia(estadoAplicacion.matriz.length);

  // Reemplaza la matriz actual.
  cambiarMatrizActual(matrizVacia, estadoAplicacion.etiquetas, "MR limpiada para ingreso por pantalla");

  // Marca el modo manual como activo.
  marcarModoDeEntrada("manual");

  // Analiza la matriz vacia.
  analizarTodo();
}

// Construye el JSON que se envia al backend.
function crearDatosParaAnalisis() {
  // Devuelve etiquetas y matriz actual.
  return {
    labels: estadoAplicacion.etiquetas,
    matrix: estadoAplicacion.matriz,
  };
}

// Analiza todas las propiedades y clasificaciones.
async function analizarTodo() {
  // Deshabilita controles durante la peticion.
  cambiarEstadoDeProceso(true);

  // Intenta pedir analisis completo.
  try {
    // Envia la matriz actual al backend.
    const reporte = await enviarJson("/api/analyze", crearDatosParaAnalisis());

    // Guarda el reporte recibido.
    estadoAplicacion.ultimoReporte = reporte;

    // Muestra todos los resultados.
    mostrarReporteCompleto(reporte);

    // Limpia mensajes anteriores.
    limpiarAviso();

  } catch (error) {
    // Muestra errores de validacion o API.
    mostrarAviso(error.message, "danger");
  } finally {
    // Habilita controles nuevamente.
    cambiarEstadoDeProceso(false);
  }
}

// Analiza una sola propiedad.
async function analizarPropiedadIndividual(nombrePropiedad) {
  // Deshabilita controles durante la peticion.
  cambiarEstadoDeProceso(true);

  // Intenta pedir la propiedad seleccionada.
  try {
    // Envia matriz y propiedad al backend.
    const respuesta = await enviarJson(`/api/check/${nombrePropiedad}`, crearDatosParaAnalisis());

    // Muestra estado corto.
    buscarElemento("#singleCheckStatus").textContent = respuesta.result.value ? "Cumple" : "No cumple";

    // Muestra solo la tarjeta de esa propiedad.
    buscarElemento("#propertiesOutput").replaceChildren(crearTarjetaResultado(respuesta.display_name, respuesta.result));

    // Limpia avisos anteriores.
    limpiarAviso();
  } catch (error) {
    // Muestra errores de validacion o API.
    mostrarAviso(error.message, "danger");
  } finally {
    // Habilita controles nuevamente.
    cambiarEstadoDeProceso(false);
  }
}

// Envia JSON a una ruta del backend y devuelve JSON.
async function enviarJson(ruta, datos) {
  // Ejecuta la peticion HTTP.
  const respuestaHttp = await fetch(ruta, {
    // Usa metodo POST.
    method: "POST",

    // Indica que se envia JSON.
    headers: { "Content-Type": "application/json" },

    // Convierte datos JavaScript a texto JSON.
    body: JSON.stringify(datos),
  });

  // Intenta leer la respuesta como JSON.
  const respuestaJson = await respuestaHttp.json().catch(() => ({}));

  // Revisa errores HTTP o errores de validacion.
  if (!respuestaHttp.ok || respuestaJson.valid === false) {
    // Lanza error con mensaje entendible.
    throw new Error(respuestaJson.error || "No fue posible procesar la solicitud.");
  }

  // Devuelve el JSON valido.
  return respuestaJson;
}

// Muestra todos los bloques del reporte.
function mostrarReporteCompleto(reporte) {
  // Muestra la relacion R.
  mostrarRelacion(reporte.relation);

  // Muestra propiedades relacionales.
  mostrarPropiedades(reporte.properties);

  // Muestra equivalencia y ordenes.
  mostrarClasificaciones(reporte.classifications);

  // Dibuja el grafo dirigido.
  dibujarGrafo(reporte.graph);

  // Muestra cantidad de nodos y aristas.
  buscarElemento("#graphMeta").textContent = `${reporte.graph.node_count ?? reporte.graph.nodes.length} nodos, ${reporte.graph.edge_count ?? reporte.graph.edges.length} aristas`;
}

// Muestra la relacion R como pares ordenados.
function mostrarRelacion(relacion) {
  // Convierte pares a texto matematico.
  const textoRelacion = relacion.map((par) => `(${par[0]}, ${par[1]})`).join(", ");

  // Escribe la relacion en pantalla.
  buscarElemento("#relationOutput").textContent = `R = {${textoRelacion}}`;

  // Escribe la cantidad de pares.
  buscarElemento("#relationCount").textContent = `${relacion.length} pares`;
}

// Muestra todas las propiedades solicitadas.
function mostrarPropiedades(propiedades) {
  // Limpia estado de propiedad individual.
  buscarElemento("#singleCheckStatus").textContent = "";

  // Crea una tarjeta por cada propiedad.
  const tarjetas = Object.entries(propiedades).map(([clave, resultado]) => {
    // Devuelve tarjeta con nombre visible.
    return crearTarjetaResultado(nombresPropiedades[clave] || clave, resultado);
  });

  // Reemplaza tarjetas anteriores.
  buscarElemento("#propertiesOutput").replaceChildren(...tarjetas);
}

// Muestra todas las clasificaciones solicitadas.
function mostrarClasificaciones(clasificaciones) {
  // Crea una tarjeta por cada clasificacion.
  const tarjetas = Object.entries(clasificaciones).map(([clave, resultado]) => {
    // Devuelve tarjeta con nombre visible.
    return crearTarjetaResultado(nombresClasificaciones[clave] || clave, resultado);
  });

  // Reemplaza tarjetas anteriores.
  buscarElemento("#classificationsOutput").replaceChildren(...tarjetas);
}

// Crea una tarjeta visual para un resultado.
function crearTarjetaResultado(titulo, resultado) {
  // Crea el contenedor de la tarjeta.
  const tarjeta = document.createElement("article");

  // Asigna clase segun cumpla o no cumpla.
  tarjeta.className = `result-card ${resultado.value ? "ok" : "bad"}`;

  // Crea el encabezado de la tarjeta.
  const encabezado = crearEncabezadoDeTarjeta(titulo, resultado.value);

  // Crea el mensaje de la tarjeta.
  const mensaje = document.createElement("p");

  // Escribe la explicacion del backend.
  mensaje.textContent = resultado.message || "";

  // Agrega encabezado y mensaje.
  tarjeta.append(encabezado, mensaje);

  // Agrega caso que falla si existe.
  agregarCasoQueFallaSiExiste(tarjeta, resultado);

  // Devuelve la tarjeta terminada.
  return tarjeta;
}

// Crea el encabezado de una tarjeta de resultado.
function crearEncabezadoDeTarjeta(titulo, cumple) {
  // Crea el titulo HTML.
  const encabezado = document.createElement("h3");

  // Crea texto del titulo.
  const nombre = document.createElement("span");

  // Escribe el titulo.
  nombre.textContent = titulo;

  // Crea insignia de cumple o no cumple.
  const insignia = document.createElement("span");

  // Asigna clase visual.
  insignia.className = `badge-soft ${cumple ? "ok" : "bad"}`;

  // Escribe estado.
  insignia.textContent = cumple ? "Cumple" : "No cumple";

  // Agrega titulo e insignia.
  encabezado.append(nombre, insignia);

  // Devuelve encabezado.
  return encabezado;
}

// Agrega el caso que falla si el resultado lo trae.
function agregarCasoQueFallaSiExiste(tarjeta, resultado) {
  // Busca caso directo o de comparabilidad.
  const casoQueFalla = resultado.witness || resultado.comparability?.witness;

  // Sale si no hay caso que falla.
  if (!casoQueFalla) {
    return;
  }

  // Crea texto tipo codigo.
  const codigo = document.createElement("code");

  // Asigna clase visual.
  codigo.className = "witness";

  // Escribe el caso que falla en lenguaje sencillo.
  codigo.textContent = `Caso que falla: ${formatearCasoQueFalla(casoQueFalla)}`;

  // Agrega el caso a la tarjeta.
  tarjeta.appendChild(codigo);
}

// Convierte el caso que falla en texto mas legible.
function formatearCasoQueFalla(casoQueFalla) {
  // Formatea objetos especiales de simetria o transitividad.
  if (casoQueFalla.present && casoQueFalla.missing) {
    return `existe ${JSON.stringify(casoQueFalla.present)}, pero falta ${JSON.stringify(casoQueFalla.missing)}`;
  }

  // Formatea listas simples.
  return JSON.stringify(casoQueFalla);
}

// Dibuja el grafo dirigido con Cytoscape.js.
function dibujarGrafo(datosGrafo) {
  // Busca el contenedor del grafo.
  const contenedor = buscarElemento("#graphCanvas");

  // Verifica que Cytoscape este cargado.
  if (!window.cytoscape) {
    // Muestra mensaje si falta la libreria.
    contenedor.replaceChildren(crearMensajeDeGrafo("Cytoscape.js no esta cargado."));

    // Sale de la funcion.
    return;
  }

  // Elimina grafo anterior si existe.
  destruirGrafoAnterior();

  // Limpia cualquier mensaje o contenido anterior.
  contenedor.replaceChildren();

  // Une todos los nodos y todas las aristas sin quitar ninguna.
  const elementosDelGrafo = [...datosGrafo.nodes, ...datosGrafo.edges];

  // Crea el nuevo grafo.
  estadoAplicacion.grafoActual = cytoscape({
    // Indica donde se dibuja.
    container: contenedor,

    // Une nodos y aristas.
    elements: elementosDelGrafo,

    // Organiza los nodos en circulo.
    layout: { name: "circle", padding: 48, animate: false },

    // Define estilos visuales.
    style: crearEstilosDelGrafo(),

    // Mejora el rendimiento al mover o cargar grafos densos.
    textureOnViewport: true,
    hideEdgesOnViewport: false,
    hideLabelsOnViewport: true,
    motionBlur: false,
    wheelSensitivity: 0.2,
  });

  // Fuerza a Cytoscape a recalcular medidas cuando el panel ya esta pintado.
  requestAnimationFrame(() => {
    estadoAplicacion.grafoActual.resize();
    estadoAplicacion.grafoActual.fit(undefined, 36);
  });
}

// Destruye el grafo anterior para evitar duplicados.
function destruirGrafoAnterior() {
  // Revisa si existe un grafo previo.
  if (estadoAplicacion.grafoActual) {
    // Destruye el grafo previo.
    estadoAplicacion.grafoActual.destroy();

    // Limpia la referencia.
    estadoAplicacion.grafoActual = null;
  }
}

// Crea los estilos usados por Cytoscape.
function crearEstilosDelGrafo() {
  // Devuelve estilos de nodos y aristas.
  return [
    // Estilo de los nodos.
    {
      selector: "node",
      style: {
        "background-color": "#1769aa",
        color: "#ffffff",
        label: "data(label)",
        "text-valign": "center",
        "text-halign": "center",
        "font-size": 13,
        width: 42,
        height: 42,
      },
    },

    // Estilo de las aristas.
    {
      selector: "edge",
      style: {
        width: 1,
        "line-color": "#4b5563",
        "target-arrow-color": "#4b5563",
        "target-arrow-shape": "triangle",
        "curve-style": "bezier",
        opacity: 0.35,
      },
    },
  ];
}

// Crea un mensaje para el espacio del grafo.
function crearMensajeDeGrafo(texto) {
  // Crea contenedor del mensaje.
  const mensaje = document.createElement("div");

  // Centra el mensaje.
  mensaje.style.display = "grid";

  // Centra el mensaje horizontal y verticalmente.
  mensaje.style.placeItems = "center";

  // Ocupa toda la altura del area.
  mensaje.style.height = "100%";

  // Usa color secundario.
  mensaje.style.color = "#667085";

  // Resalta texto.
  mensaje.style.fontWeight = "700";

  // Escribe el mensaje.
  mensaje.textContent = texto;

  // Devuelve el elemento.
  return mensaje;
}

// Copia la relacion R al portapapeles.
async function copiarRelacion() {
  // Lee el texto visible de R.
  const textoRelacion = buscarElemento("#relationOutput").textContent;

  // Intenta copiar usando el navegador.
  try {
    // Copia el texto.
    await navigator.clipboard.writeText(textoRelacion);

    // Informa exito.
    mostrarAviso("Relacion copiada.", "success");
  } catch {
    // Informa error si el navegador no permite copiar.
    mostrarAviso("No fue posible copiar al portapapeles.", "warning");
  }
}

// Muestra un aviso Bootstrap.
function mostrarAviso(mensaje, tipo) {
  // Escribe el HTML del aviso.
  buscarElemento("#alertBox").innerHTML = `<div class="alert alert-${tipo}" role="alert">${escaparHtml(mensaje)}</div>`;
}

// Limpia el area de avisos.
function limpiarAviso() {
  // Elimina hijos del contenedor.
  buscarElemento("#alertBox").replaceChildren();
}

// Activa o desactiva controles durante procesos.
function cambiarEstadoDeProceso(estaProcesando) {
  // Actualiza indicador superior.
  buscarElemento("#healthStatus").textContent = estaProcesando ? "Procesando" : "Listo";

  // Bloquea o desbloquea analizar todo.
  buscarElemento("#analyzeBtn").disabled = estaProcesando;

  // Bloquea o desbloquea matriz aleatoria.
  buscarElemento("#randomMatrixBtn").disabled = estaProcesando;

  // Bloquea o desbloquea ejemplo rapido.
  buscarElemento("#exampleMatrixBtn").disabled = estaProcesando;

  // Bloquea o desbloquea propiedades individuales.
  buscarElementos(".property-btn").forEach((boton) => {
    // Aplica el estado disabled.
    boton.disabled = estaProcesando;
  });
}

// Programa analisis despues de editar una celda.
function programarAnalisis() {
  // Cancela analisis pendiente.
  window.clearTimeout(temporizadorAnalisis);

  // Programa un analisis nuevo.
  temporizadorAnalisis = window.setTimeout(() => {
    // Ejecuta analisis completo.
    analizarTodo();
  }, 350);
}

// Mueve la pantalla al cuadro editable de la matriz.
function enfocarEditorDeMatriz() {
  // Marca el modo manual como activo.
  marcarModoDeEntrada("manual");

  // Busca el panel de matriz.
  const panelMatriz = buscarElemento("#matrixPanel");

  // Hace scroll suave al panel.
  panelMatriz.scrollIntoView({ behavior: "smooth", block: "start" });

  // Quita animacion anterior.
  panelMatriz.classList.remove("flash-panel");

  // Reactiva animacion visual.
  window.setTimeout(() => panelMatriz.classList.add("flash-panel"), 10);

  // Quita animacion despues de terminar.
  window.setTimeout(() => panelMatriz.classList.remove("flash-panel"), 1400);
}

// Cambia el estilo de los botones de entrada.
function marcarModoDeEntrada(modo) {
  // Busca el boton de entrada manual.
  const botonManual = buscarElemento("#goMatrixBtn");

  // Busca el boton de matriz aleatoria.
  const botonAleatorio = buscarElemento("#randomMatrixBtn");

  // Busca el boton de ejemplos.
  const botonEjemplo = buscarElemento("#exampleMatrixBtn");

  // Revisa si el modo actual es manual.
  const modoManualActivo = modo === "manual";

  // Revisa si el modo actual es aleatorio.
  const modoAleatorioActivo = modo === "aleatoria";

  // Revisa si el modo actual es ejemplo.
  const modoEjemploActivo = modo === "ejemplo";

  // Pinta manual como activo si corresponde.
  botonManual.classList.toggle("btn-primary", modoManualActivo);

  // Pinta manual como inactivo si corresponde.
  botonManual.classList.toggle("btn-outline-primary", !modoManualActivo);

  // Pinta aleatorio como activo si corresponde.
  botonAleatorio.classList.toggle("btn-primary", modoAleatorioActivo);

  // Pinta aleatorio como inactivo si corresponde.
  botonAleatorio.classList.toggle("btn-outline-primary", !modoAleatorioActivo);

  // Pinta ejemplo como activo si corresponde.
  botonEjemplo.classList.toggle("btn-success", modoEjemploActivo);

  // Pinta ejemplo como inactivo si corresponde.
  botonEjemplo.classList.toggle("btn-outline-success", !modoEjemploActivo);
}

// Verifica que la API este activa.
async function verificarEstadoDelServidor() {
  // Intenta consultar salud de la API.
  try {
    // Pide estado al backend.
    const respuesta = await fetch("/api/health");

    // Convierte respuesta a JSON.
    const datos = await respuesta.json();

    // Muestra estado listo si todo funciona.
    buscarElemento("#healthStatus").textContent = datos.ok ? "Listo" : "Revision";
  } catch {
    // Muestra fallo si no hay API.
    buscarElemento("#healthStatus").textContent = "Sin API";
  }
}

// Evita que mensajes externos rompan el HTML.
function escaparHtml(valor) {
  // Convierte el valor a texto.
  return String(valor).replace(/[&<>"']/g, (caracter) => {
    // Define equivalencias seguras.
    const equivalencias = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#039;",
    };

    // Devuelve el caracter escapado.
    return equivalencias[caracter];
  });
}
