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

  // Conecta el boton Aplicar con el cambio de etiquetas.
  buscarElemento("#applyLabelsBtn").addEventListener("click", aplicarEtiquetas);

  // Permite aplicar etiquetas presionando Enter.
  buscarElemento("#labelsInput").addEventListener("keydown", manejarEnterEnEtiquetas);

  // Conecta el boton para ir al cuadro de matriz.
  buscarElemento("#goMatrixBtn").addEventListener("click", enfocarEditorDeMatriz);

  // Conecta el boton de generacion aleatoria.
  buscarElemento("#randomMatrixBtn").addEventListener("click", generarMatrizAleatoria);

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

  // Prepara etiquetas para el nuevo tamano.
  const etiquetas = obtenerEtiquetasParaTamano(tamano);

  // Crea una matriz llena de ceros.
  const matrizVacia = crearMatrizVacia(tamano);

  // Actualiza el estado con la nueva matriz.
  cambiarMatrizActual(matrizVacia, etiquetas, "MR vacia creada para ingreso por pantalla");

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

  // Valida que n sea un entero entre 1 y 50.
  if (!Number.isInteger(tamano) || tamano < 1 || tamano > 50) {
    // Muestra error cuando n no es valido.
    mostrarAviso("Ingrese un tamano n valido entre 1 y 50.", "danger");

    // Devuelve el tamano actual para no romper la interfaz.
    return estadoAplicacion.matriz.length;
  }

  // Devuelve el tamano valido.
  return tamano;
}

// Obtiene etiquetas validas para un tamano concreto.
function obtenerEtiquetasParaTamano(tamano) {
  // Intenta usar las etiquetas escritas por el usuario.
  try {
    // Devuelve etiquetas si coinciden con el tamano.
    return leerEtiquetasDesdeCampo(tamano);
  } catch {
    // Crea etiquetas numericas si las escritas no sirven.
    const etiquetasPorDefecto = crearEtiquetasNumericas(tamano);

    // Escribe las etiquetas por defecto en el campo.
    buscarElemento("#labelsInput").value = etiquetasPorDefecto.join(",");

    // Devuelve las etiquetas por defecto.
    return etiquetasPorDefecto;
  }
}

// Crea etiquetas 1,2,3,...,n.
function crearEtiquetasNumericas(tamano) {
  // Construye una lista con tantos elementos como indique n.
  return Array.from({ length: tamano }, (_, indice) => String(indice + 1));
}

// Lee las etiquetas escritas por el usuario y las valida.
function leerEtiquetasDesdeCampo(tamano) {
  // Obtiene el texto completo del campo de etiquetas.
  const texto = buscarElemento("#labelsInput").value.trim();

  // Separa el texto por comas.
  const etiquetas = texto.split(",").map((valor) => valor.trim()).filter(Boolean);

  // Si no hay etiquetas, usa etiquetas numericas.
  if (etiquetas.length === 0) {
    // Devuelve etiquetas por defecto.
    return crearEtiquetasNumericas(tamano);
  }

  // Verifica que la cantidad de etiquetas sea igual a n.
  if (etiquetas.length !== tamano) {
    // Lanza error si sobran o faltan etiquetas.
    throw new Error(`Debe escribir exactamente ${tamano} elementos separados por coma.`);
  }

  // Verifica que no existan etiquetas repetidas.
  if (new Set(etiquetas).size !== etiquetas.length) {
    // Lanza error si hay elementos repetidos.
    throw new Error("Los elementos no pueden repetirse.");
  }

  // Verifica que ninguna etiqueta sea demasiado larga.
  if (etiquetas.some((etiqueta) => etiqueta.length > 20)) {
    // Lanza error si una etiqueta supera el limite.
    throw new Error("Cada elemento debe tener maximo 20 caracteres.");
  }

  // Devuelve etiquetas limpias y validadas.
  return etiquetas;
}

// Aplica las etiquetas escritas por el usuario.
function aplicarEtiquetas() {
  // Intenta leer y validar las etiquetas.
  try {
    // Reemplaza las etiquetas actuales.
    estadoAplicacion.etiquetas = leerEtiquetasDesdeCampo(estadoAplicacion.matriz.length);

    // Actualiza la descripcion del origen.
    estadoAplicacion.origenMatriz = "MR con nombres de elementos actualizados";

    // Dibuja otra vez la matriz con encabezados nuevos.
    dibujarMatrizEditable();

    // Analiza otra vez para actualizar R con los nuevos nombres.
    analizarTodo();

    // Informa que el cambio fue aplicado.
    mostrarAviso(`Elementos aplicados: A = {${estadoAplicacion.etiquetas.join(", ")}}`, "success");
  } catch (error) {
    // Muestra el error de etiquetas.
    mostrarAviso(error.message, "warning");
  }
}

// Detecta Enter en el campo de etiquetas.
function manejarEnterEnEtiquetas(evento) {
  // Revisa si la tecla fue Enter.
  if (evento.key === "Enter") {
    // Evita que el formulario haga otra accion.
    evento.preventDefault();

    // Aplica las etiquetas.
    aplicarEtiquetas();
  }
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

  // Actualiza el campo de etiquetas.
  buscarElemento("#labelsInput").value = estadoAplicacion.etiquetas.join(",");

  // Actualiza el resumen de tamano.
  buscarElemento("#matrixMeta").textContent = `${estadoAplicacion.matriz.length} x ${estadoAplicacion.matriz.length}, binaria y cuadrada`;

  // Actualiza el conjunto A visible.
  buscarElemento("#labelsStatus").textContent = `A = {${estadoAplicacion.etiquetas.join(", ")}}`;

  // Actualiza el origen de la matriz.
  buscarElemento("#currentInputSummary").textContent = `${estadoAplicacion.origenMatriz} sobre A = {${estadoAplicacion.etiquetas.join(", ")}}`;

  // Actualiza la matriz visible en texto.
  buscarElemento("#matrixTextOutput").textContent = convertirMatrizATexto(estadoAplicacion.matriz);

  // Actualiza el cuadro opcional de pegado.
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

    // Crea etiquetas numericas para el nuevo tamano.
    const etiquetas = crearEtiquetasNumericas(matriz.length);

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

// Limpia la matriz actual dejandola en ceros.
function limpiarMatriz() {
  // Crea matriz vacia del mismo tamano.
  const matrizVacia = crearMatrizVacia(estadoAplicacion.matriz.length);

  // Reemplaza la matriz actual.
  cambiarMatrizActual(matrizVacia, estadoAplicacion.etiquetas, "MR limpiada para ingreso por pantalla");

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

    // Advierte si el grafo puede saturarse.
    mostrarAdvertenciaSiLaMatrizEsGrande(reporte.n);
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
  buscarElemento("#graphMeta").textContent = `${reporte.graph.nodes.length} nodos, ${reporte.graph.edges.length} aristas`;
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

// Muestra todas las propiedades.
function mostrarPropiedades(propiedades) {
  // Limpia estado de propiedad individual.
  buscarElemento("#singleCheckStatus").textContent = "";

  // Crea una tarjeta por propiedad.
  const tarjetas = Object.entries(propiedades).map(([clave, resultado]) => {
    // Devuelve tarjeta con nombre visible.
    return crearTarjetaResultado(nombresPropiedades[clave] || clave, resultado);
  });

  // Reemplaza tarjetas anteriores.
  buscarElemento("#propertiesOutput").replaceChildren(...tarjetas);
}

// Muestra equivalencia, orden parcial, orden total y orden estricto.
function mostrarClasificaciones(clasificaciones) {
  // Crea una tarjeta por clasificacion.
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

  // Agrega contraejemplo si existe.
  agregarContraejemploSiExiste(tarjeta, resultado);

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

// Agrega contraejemplo a la tarjeta si el resultado lo trae.
function agregarContraejemploSiExiste(tarjeta, resultado) {
  // Busca contraejemplo directo o de comparabilidad.
  const contraejemplo = resultado.witness || resultado.comparability?.witness;

  // Sale si no hay contraejemplo.
  if (!contraejemplo) {
    return;
  }

  // Crea texto tipo codigo.
  const codigo = document.createElement("code");

  // Asigna clase visual.
  codigo.className = "witness";

  // Escribe el contraejemplo.
  codigo.textContent = `Contraejemplo: ${JSON.stringify(contraejemplo)}`;

  // Agrega el contraejemplo a la tarjeta.
  tarjeta.appendChild(codigo);
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

  // Evita renderizar grafos demasiado grandes.
  if (datosGrafo.nodes.length > 50) {
    // Muestra mensaje de omision.
    contenedor.replaceChildren(crearMensajeDeGrafo("Analisis realizado. Grafo omitido por tamano."));

    // Sale de la funcion.
    return;
  }

  // Elimina grafo anterior si existe.
  destruirGrafoAnterior();

  // Crea el nuevo grafo.
  estadoAplicacion.grafoActual = cytoscape({
    // Indica donde se dibuja.
    container: contenedor,

    // Une nodos y aristas.
    elements: [...datosGrafo.nodes, ...datosGrafo.edges],

    // Organiza los nodos en circulo.
    layout: { name: "circle", padding: 36 },

    // Define estilos visuales.
    style: crearEstilosDelGrafo(),
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
        width: 2,
        "line-color": "#667085",
        "target-arrow-color": "#667085",
        "target-arrow-shape": "triangle",
        "curve-style": "bezier",
        label: "data(label)",
        "font-size": 9,
        color: "#344054",
        "text-background-color": "#ffffff",
        "text-background-opacity": 0.8,
        "text-background-padding": 2,
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

// Muestra advertencia si la matriz es grande.
function mostrarAdvertenciaSiLaMatrizEsGrande(tamano) {
  // Revisa tamano del grafo.
  if (tamano > 30) {
    // Advierte sobre saturacion visual.
    mostrarAviso("La matriz es valida; el grafo puede verse saturado por su tamano.", "warning");
  }
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
