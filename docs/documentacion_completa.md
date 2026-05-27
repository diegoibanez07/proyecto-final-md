# Documentacion completa

## 1. Que hace la aplicacion

La aplicacion sirve para estudiar relaciones binarias usando una matriz relacional llamada MR.

Una relacion binaria dice que elementos estan relacionados con otros elementos.

La matriz MR guarda esa informacion usando solo dos valores:

- 1 significa que la relacion existe.
- 0 significa que la relacion no existe.

Con una sola matriz, la aplicacion obtiene automaticamente:

- La relacion R.
- Las propiedades de la relacion.
- La clasificacion como equivalencia, orden parcial, orden total u orden estricto.
- El grafo dirigido.

El usuario no tiene que escribir R aparte. R sale directamente de la matriz.

## 2. Que significa n

n es el tamano de la matriz.

Si n vale 4, la matriz tiene 4 filas y 4 columnas.

Eso se escribe como matriz 4 x 4.

Las filas y columnas se nombran automaticamente:

- 1
- 2
- 3
- 4

Si n vale 6, los elementos serian 1, 2, 3, 4, 5 y 6.

## 3. Como se lee la matriz MR

La fila indica de donde sale la relacion.

La columna indica hacia donde llega la relacion.

Por ejemplo, si en la fila 2 y columna 5 hay un 1, entonces existe el par:

(2, 5)

Eso quiere decir que 2 se relaciona con 5.

Si en esa misma posicion hay un 0, entonces el par (2, 5) no pertenece a la relacion.

## 4. Ejemplo sencillo de matriz y relacion R

Supongamos esta matriz de 3 x 3:

Fila 1: 1 0 1

Fila 2: 0 1 0

Fila 3: 1 0 1

Se revisan las posiciones donde aparece 1.

En la fila 1 hay 1 en columnas 1 y 3.

Eso genera:

- (1, 1)
- (1, 3)

En la fila 2 hay 1 en columna 2.

Eso genera:

- (2, 2)

En la fila 3 hay 1 en columnas 1 y 3.

Eso genera:

- (3, 1)
- (3, 3)

Entonces la relacion completa es:

R = {(1, 1), (1, 3), (2, 2), (3, 1), (3, 3)}

## 5. Formas de ingresar la matriz

La aplicacion permite trabajar con la matriz de varias formas.

Primera forma: llenar matriz manual.

El usuario escribe n, pulsa Crear y llena las casillas haciendo clic.

Segunda forma: generar matriz aleatoria.

La aplicacion crea una matriz de ceros y unos de forma automatica.

Tercera forma: generar matriz de ejemplo.

El usuario elige una propiedad u orden, y la aplicacion crea una matriz que sirve para probar ese caso.

Cuarta forma: pegar matriz completa.

El usuario puede pegar la matriz escrita en texto, siempre que sea cuadrada y tenga solo 0 y 1.

## 6. Validaciones

Antes de calcular resultados, la aplicacion revisa que la entrada sea correcta.

La matriz debe cumplir:

- No puede estar vacia.
- Debe ser cuadrada.
- Todas las filas deben tener la misma cantidad de valores.
- Solo puede contener 0 y 1.

El tamano n debe ser un numero entero positivo.

Si algo no cumple, la aplicacion muestra un error.

## 7. Propiedades relacionales

Las propiedades dicen como se comportan los pares de la relacion.

La aplicacion revisa estas propiedades:

- Reflexiva.
- Irreflexiva.
- Simetrica.
- Asimetrica.
- Antisimetrica.
- Transitiva.

## 8. Propiedad reflexiva

Una relacion es reflexiva cuando todos los elementos se relacionan consigo mismos.

Eso significa que deben existir todos los pares de la forma:

- (1, 1)
- (2, 2)
- (3, 3)
- Y asi hasta n.

En la matriz, esto se ve en la diagonal principal.

La diagonal principal va desde la esquina superior izquierda hasta la esquina inferior derecha.

Para que sea reflexiva, toda esa diagonal debe tener 1.

Ejemplo de diagonal reflexiva:

1, 1, 1, 1

Si falta un solo 1 en la diagonal, ya no es reflexiva.

## 9. Propiedad irreflexiva

Una relacion es irreflexiva cuando ningun elemento se relaciona consigo mismo.

Eso significa que no pueden existir pares como:

- (1, 1)
- (2, 2)
- (3, 3)

En la matriz, toda la diagonal principal debe tener 0.

Ejemplo de diagonal irreflexiva:

0, 0, 0, 0

Si aparece un 1 en la diagonal, ya no es irreflexiva.

## 10. Propiedad simetrica

Una relacion es simetrica cuando cada par tiene su par de regreso.

Si existe (1, 3), tambien debe existir (3, 1).

Si existe (2, 4), tambien debe existir (4, 2).

En la matriz, esto significa que la posicion fila 1 columna 3 debe coincidir con la posicion fila 3 columna 1.

La matriz debe verse igual al compararla con su reflejo sobre la diagonal principal.

Si hay ida pero no hay vuelta, no es simetrica.

## 11. Propiedad asimetrica

Una relacion es asimetrica cuando no permite ida y vuelta entre dos elementos.

Si existe (1, 3), entonces no puede existir (3, 1).

Ademas, una relacion asimetrica no puede tener lazos.

Un lazo es un par donde el origen y el destino son el mismo elemento.

Ejemplos de lazos:

- (1, 1)
- (2, 2)
- (3, 3)

Entonces, para que sea asimetrica:

- La diagonal debe tener 0.
- No puede haber pares opuestos al mismo tiempo.

## 12. Propiedad antisimetrica

Una relacion es antisimetrica cuando dos elementos diferentes no se relacionan en ambos sentidos.

Si existe (1, 3), no deberia existir (3, 1).

Pero los lazos si se permiten.

Esta es la diferencia importante:

- Asimetrica no permite lazos.
- Antisimetrica si permite lazos.

Por eso una matriz identidad puede ser antisimetrica, porque tiene lazos, pero no tiene ida y vuelta entre elementos diferentes.

## 13. Propiedad transitiva

Una relacion es transitiva cuando todo camino de dos pasos tiene tambien el camino directo.

Si existe:

- (1, 2)
- (2, 3)

Entonces debe existir:

- (1, 3)

Si falta (1, 3), la relacion no es transitiva.

En palabras sencillas:

Si puedo ir de 1 a 2 y de 2 a 3, entonces tambien debo poder ir directo de 1 a 3.

## 14. Equivalencia

Una relacion es de equivalencia cuando cumple tres propiedades al mismo tiempo:

- Reflexiva.
- Simetrica.
- Transitiva.

No se calcula como una propiedad separada desde cero.

La aplicacion primero calcula reflexiva, simetrica y transitiva.

Despues revisa si las tres se cumplen.

Si las tres son verdaderas, entonces es equivalencia.

## 15. Orden parcial

Una relacion es orden parcial cuando cumple:

- Reflexiva.
- Antisimetrica.
- Transitiva.

Orden parcial sirve para relaciones donde algunos elementos se pueden comparar y otros no necesariamente.

Ejemplo comun: divisibilidad.

En divisibilidad, 2 divide a 4 y 2 divide a 6, pero 4 y 6 no se dividen entre si.

Por eso puede ser orden parcial sin ser orden total.

## 16. Orden total

Una relacion es orden total cuando cumple dos condiciones.

Primero, debe ser orden parcial.

Eso significa que debe ser:

- Reflexiva.
- Antisimetrica.
- Transitiva.

Segundo, todo par de elementos distintos debe poder compararse.

Comparar significa que entre dos elementos debe existir al menos una direccion.

Por ejemplo, entre 2 y 5 debe pasar una de estas dos cosas:

- (2, 5)
- (5, 2)

Si hay dos elementos diferentes sin ninguna relacion entre ellos, no es orden total.

## 17. Orden estricto

Una relacion es orden estricto cuando cumple:

- Irreflexiva.
- Asimetrica.
- Transitiva.

Orden estricto no permite que un elemento se relacione consigo mismo.

Tampoco permite ida y vuelta.

Ejemplo: la relacion menor que.

Si 1 es menor que 3, entonces existe (1, 3).

Pero no existe (3, 1).

Tampoco existe (1, 1), porque 1 no es menor que si mismo.

## 18. Ejemplos automaticos

La aplicacion incluye ejemplos para generar matrices rapidamente.

Cada opcion crea una matriz que sirve para revisar una propiedad u orden.

Opciones disponibles:

- Reflexiva.
- Irreflexiva.
- Simetrica.
- Asimetrica.
- Antisimetrica.
- Transitiva.
- Equivalencia.
- Orden parcial.
- Orden total.
- Orden estricto.

Estos ejemplos no son otra forma de calculo.

Simplemente llenan la matriz con un caso valido para que el usuario pueda observar el resultado.

## 19. Grafo dirigido

El grafo dirigido es una forma visual de representar la relacion R.

Cada elemento se convierte en un nodo.

Cada par de R se convierte en una flecha.

Si existe (1, 3), se dibuja una flecha desde 1 hacia 3.

Si existe (2, 2), se dibuja un lazo en el nodo 2.

El grafo usa exactamente la misma informacion de la matriz MR.

No se inventan flechas.

No se eliminan flechas.

Todo 1 de la matriz produce una flecha.

## 20. Como se dibuja el grafo

El servidor prepara los datos del grafo.

Primero crea los nodos:

- 1
- 2
- 3
- Hasta n

Luego crea las aristas.

Una arista es una flecha.

Por cada 1 en la matriz, se crea una arista desde la fila hacia la columna.

Despues, JavaScript entrega esos nodos y aristas a Cytoscape.js.

Cytoscape.js es la libreria que dibuja el grafo en el navegador.

## 21. Tecnologias y librerias usadas

Python se usa para la logica del servidor y para los calculos matematicos.

Flask se usa para crear la aplicacion web local y las rutas que reciben y devuelven datos.

HTML se usa para la estructura de la pantalla.

CSS se usa para colores, paneles, botones, matriz, tarjetas y distribucion visual.

JavaScript se usa para la interaccion con el usuario.

Con JavaScript se cambian las celdas entre 0 y 1, se manda la matriz al servidor y se actualizan los resultados.

Bootstrap se usa como apoyo visual para botones, formularios y estilos base.

Cytoscape.js se usa para graficar el grafo dirigido.

## 22. Archivos principales

app.py inicia la aplicacion.

routes.py contiene las rutas web y las rutas de la API.

validation.py valida las entradas.

relation_analyzer.py calcula propiedades, equivalencia y ordenes.

generators.py genera matrices aleatorias.

graph_builder.py convierte la matriz en nodos y flechas.

index.html contiene la pantalla principal.

app.js controla la interaccion de la pantalla.

styles.css contiene los estilos visuales.

## 23. Flujo completo

1. El usuario define n.
2. La aplicacion crea la matriz.
3. El usuario llena o genera la matriz.
4. La matriz se valida.
5. Se obtiene R.
6. Se calculan las propiedades.
7. Se calculan equivalencia y ordenes.
8. Se construye el grafo dirigido.
9. Se muestran los resultados.

## 24. Salidas de la aplicacion

La aplicacion muestra:

- La matriz actual.
- La relacion R completa.
- El numero de pares de R.
- Las propiedades con su estado.
- Equivalencia y ordenes con su estado.
- El grafo dirigido.

## 25. Resumen final

Todo parte de una sola matriz MR.

Los 1 de la matriz crean la relacion R.

La relacion R permite revisar propiedades.

Las propiedades permiten saber si hay equivalencia u ordenes.

La misma matriz tambien permite construir el grafo dirigido.
