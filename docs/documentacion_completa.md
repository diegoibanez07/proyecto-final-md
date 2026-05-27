# Documentacion completa

## 1. Idea general

La aplicacion analiza relaciones binarias usando una matriz relacional llamada MR.

MR es una matriz cuadrada formada solamente por ceros y unos.

Un valor 1 significa que existe una relacion entre el elemento de la fila y el elemento de la columna.

Un valor 0 significa que esa relacion no existe.

Con esa matriz, la aplicacion obtiene:

- La relacion R.
- Las propiedades de la relacion.
- Si la relacion es equivalencia.
- Si la relacion es orden parcial.
- Si la relacion es orden total.
- Si la relacion es orden estricto.
- El grafo dirigido.

## 2. Que debe ingresar el usuario

El usuario debe ingresar una sola matriz MR.

No debe ingresar otra matriz para R.

No debe escribir manualmente los pares de R.

La aplicacion nombra filas y columnas automaticamente como 1, 2, 3, hasta n.

La fila representa el origen.

La columna representa el destino.

Si la fila 1 y la columna 3 tienen valor 1, entonces existe el par (1, 3).

## 3. Formas de entrada

La aplicacion permite cuatro formas de trabajar con la matriz:

- Crear una matriz vacia y llenarla manualmente.
- Generar una matriz aleatoria.
- Generar una matriz de ejemplo por propiedad u orden.
- Pegar una matriz completa en texto.

La forma principal es llenar el cuadro de la matriz con clics.

Cada casilla cambia entre 0 y 1.

## 4. Validaciones de entrada

La matriz se valida antes de calcular cualquier resultado.

La matriz debe cumplir:

- Debe existir.
- No puede estar vacia.
- Todas las filas deben tener la misma cantidad de valores.
- Debe tener la misma cantidad de filas y columnas.
- Solo puede contener 0 y 1.

El tamano n debe ser un numero entero positivo.

Si una entrada no cumple, la aplicacion muestra un error claro.

## 5. Relacion R

R es el conjunto de pares ordenados que salen de los unos de MR.

La regla es:

Si MR en la fila i y columna j vale 1, entonces el par (i, j) pertenece a R.

Ejemplo:

Matriz:

0 1

1 0

Relacion obtenida:

R = {(1, 2), (2, 1)}

## 6. Propiedades relacionales

## 6.1 Reflexiva

Una relacion es reflexiva cuando todos los elementos se relacionan consigo mismos.

En matriz, toda la diagonal principal debe valer 1.

Ejemplo de diagonal reflexiva:

1, 1, 1

## 6.2 Irreflexiva

Una relacion es irreflexiva cuando ningun elemento se relaciona consigo mismo.

En matriz, toda la diagonal principal debe valer 0.

Ejemplo de diagonal irreflexiva:

0, 0, 0

## 6.3 Simetrica

Una relacion es simetrica cuando todo par tiene su par inverso.

Si existe (1, 3), tambien debe existir (3, 1).

En matriz, el valor de la fila 1 columna 3 debe coincidir con el valor de la fila 3 columna 1.

## 6.4 Asimetrica

Una relacion es asimetrica cuando no existen pares opuestos al mismo tiempo.

Si existe (1, 3), no puede existir (3, 1).

Ademas, no puede tener lazos.

Un lazo es un par como (1, 1), (2, 2) o (3, 3).

## 6.5 Antisimetrica

Una relacion es antisimetrica cuando dos elementos diferentes no se relacionan en ambos sentidos al mismo tiempo.

Si existe (1, 3) y tambien existe (3, 1), entonces no cumple.

Los lazos si se permiten.

Por eso antisimetrica no es lo mismo que asimetrica.

## 6.6 Transitiva

Una relacion es transitiva cuando un camino de dos pasos obliga a tener el paso directo.

Si existe (1, 2) y existe (2, 3), entonces debe existir (1, 3).

Si falta (1, 3), la relacion no es transitiva.

## 7. Equivalencia y ordenes

## 7.1 Equivalencia

Una relacion es equivalencia si cumple estas tres propiedades:

- Reflexiva.
- Simetrica.
- Transitiva.

## 7.2 Orden parcial

Una relacion es orden parcial si cumple:

- Reflexiva.
- Antisimetrica.
- Transitiva.

## 7.3 Orden total

Una relacion es orden total si primero es orden parcial.

Ademas, todo par de elementos diferentes debe poder compararse.

Comparar significa que entre dos elementos debe existir al menos una direccion.

Por ejemplo, entre 2 y 5 debe existir (2, 5) o (5, 2).

## 7.4 Orden estricto

Una relacion es orden estricto si cumple:

- Irreflexiva.
- Asimetrica.
- Transitiva.

No permite lazos.

No permite ida y vuelta entre dos elementos.

## 8. Ejemplos generados

El menu de ejemplos crea matrices validas para probar resultados rapidamente.

Ejemplos disponibles:

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

Cada ejemplo se analiza igual que una matriz ingresada manualmente.

## 9. Grafo dirigido

El grafo se genera directamente desde MR.

Cada elemento del conjunto se convierte en un nodo.

Cada 1 de la matriz se convierte en una flecha.

La fila indica desde donde sale la flecha.

La columna indica hacia donde llega la flecha.

Si el 1 esta en la diagonal, se dibuja un lazo.

Ejemplo:

Si MR en fila 2 y columna 4 vale 1, se crea una flecha desde 2 hacia 4.

## 10. Archivos principales

app.py inicia la aplicacion.

routes.py define las rutas web y las rutas de la API.

validation.py valida entradas.

relation_analyzer.py calcula propiedades, equivalencia y ordenes.

generators.py crea matrices aleatorias.

graph_builder.py prepara los datos del grafo dirigido.

index.html contiene la pantalla principal.

app.js controla la interaccion de la pantalla.

styles.css contiene los estilos visuales.

## 11. Flujo de funcionamiento

1. El usuario define n.
2. La aplicacion crea una matriz n por n.
3. El usuario llena la matriz o genera una matriz automaticamente.
4. La matriz se valida.
5. Se obtiene R.
6. Se calculan las propiedades.
7. Se calculan equivalencia y ordenes.
8. Se construye el grafo dirigido.
9. Se muestran los resultados.

## 12. Salidas de la aplicacion

La aplicacion muestra:

- La matriz actual.
- La relacion R completa.
- El numero de pares de R.
- Las propiedades con su estado.
- Equivalencia y ordenes con su estado.
- El grafo dirigido.

## 13. Resumen

La aplicacion permite trabajar con relaciones binarias de forma visual.

El usuario ingresa o genera una sola matriz MR.

Desde esa matriz se obtiene todo lo demas:

- R.
- Propiedades.
- Equivalencia.
- Ordenes.
- Grafo dirigido.
