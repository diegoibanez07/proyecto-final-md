# Documentacion completa del proyecto RelApp

## 1. Idea general del proyecto

RelApp es una aplicacion web local para analizar relaciones sobre conjuntos y grafos.

El proyecto trabaja con una sola matriz llamada `MR`, que significa matriz relacional.

La matriz `MR` solo puede tener valores:

```text
0 o 1
```

Un `1` significa que si existe una relacion.

Un `0` significa que no existe esa relacion.

La aplicacion toma esa matriz y automaticamente calcula:

- La relacion `R`.
- Las propiedades relacionales.
- Si es relacion de equivalencia.
- Si es orden parcial.
- Si es orden total.
- Si es orden estricto.
- El grafo dirigido de la matriz.

## 2. Que significa la matriz MR

Si el usuario elige:

```text
n = 3
```

la matriz debe tener:

```text
3 filas y 3 columnas
```

Ejemplo:

```text
      1  2  3
1     1  0  1
2     0  1  0
3     1  0  1
```

Las filas son el origen.

Las columnas son el destino.

Entonces:

- Fila 1, columna 1 vale 1: existe `(1,1)`.
- Fila 1, columna 3 vale 1: existe `(1,3)`.
- Fila 2, columna 2 vale 1: existe `(2,2)`.
- Fila 3, columna 1 vale 1: existe `(3,1)`.
- Fila 3, columna 3 vale 1: existe `(3,3)`.

Por eso la relacion queda:

```text
R = {(1,1), (1,3), (2,2), (3,1), (3,3)}
```

## 3. Que es la relacion R

`R` es la lista de pares ordenados que salen de los valores `1` de la matriz.

No se escribe otra matriz.

No se carga aparte.

La aplicacion la obtiene automaticamente.

Regla:

```text
Si MR[i][j] = 1, entonces el par (i,j) pertenece a R.
```

Ejemplo:

```text
MR[1][2] = 1
```

Entonces:

```text
(1,2) pertenece a R
```

## 4. Como se cumple cada punto del PDF

### a) Se debe ingresar una matriz por teclado de n x n elementos

La aplicacion permite ingresar la matriz de dos formas:

1. Manualmente en pantalla, con un cuadro `n x n`.
2. Pegando la matriz completa en texto.

La forma principal es el cuadro visual.

Si el usuario pone:

```text
n = 4
```

la aplicacion crea un cuadro:

```text
4 x 4
```

Cada casilla se puede cambiar con clic entre:

```text
0 y 1
```

### b) La matriz relacional MR debe ser cuadrada y validarse

Una matriz cuadrada tiene la misma cantidad de filas y columnas.

Ejemplo valido:

```text
1 0 1
0 1 0
1 0 1
```

Tiene 3 filas y 3 columnas.

Ejemplo invalido:

```text
1 0
1
```

No es cuadrada porque la primera fila tiene 2 valores y la segunda solo 1.

La aplicacion valida:

- Que exista matriz.
- Que no este vacia.
- Que todas las filas tengan el mismo tamano.
- Que el numero de filas sea igual al numero de columnas.
- Que solo tenga 0 y 1.

Si algo falla, la aplicacion muestra un error.

### c) La matriz puede generarse por el sistema o indicarse por pantalla

La aplicacion tiene tres formas de entrada:

- Llenar matriz manual.
- Generar matriz aleatoria.
- Generar matriz de ejemplo.

La opcion pedida directamente por el PDF es la aleatoria.

La opcion de ejemplos ayuda a probar propiedades, pero sigue generando matrices validas `n x n`.

### d) Captar las relaciones R que genere la matriz y mostrarlas

La aplicacion recorre la matriz.

Si encuentra un `1`, crea un par ordenado.

Ejemplo:

```text
0 1
1 0
```

Resultado:

```text
R = {(1,2), (2,1)}
```

Formula usada:

```text
MR[i][j] = 1  =>  (i,j) pertenece a R
```

### e) Probar una por una o todas las relaciones al mismo tiempo

La aplicacion permite:

- Analizar todo.
- Probar una propiedad individual.

El boton `Analizar todo` calcula:

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

Los botones individuales permiten probar una sola propiedad.

### f) Mostrar propiedades y relaciones de orden

La aplicacion muestra si cada propiedad cumple o no cumple.

Tambien muestra si la matriz representa:

- Equivalencia.
- Orden parcial.
- Orden total.
- Orden estricto.

### g) Generar el grafo dirigido basado en MR

La aplicacion genera un grafo dirigido.

Reglas:

- Cada fila/columna es un nodo.
- Cada `1` de la matriz es una flecha.
- La fila indica desde donde sale la flecha.
- La columna indica hacia donde llega la flecha.
- Si el `1` esta en la diagonal, se dibuja un lazo.

Ejemplo:

```text
MR[1][3] = 1
```

Entonces se dibuja:

```text
1 -> 3
```

Si:

```text
MR[2][2] = 1
```

entonces se dibuja un lazo:

```text
2 -> 2
```

### h) Validar entradas y salidas

La aplicacion valida:

- Tamano `n`.
- Matriz vacia.
- Matriz no cuadrada.
- Valores diferentes de 0 y 1.
- Datos enviados al backend.
- Propiedades solicitadas individualmente.

## 5. Propiedades relacionales

## 5.1 Reflexiva

Una relacion es reflexiva cuando todos los elementos se relacionan consigo mismos.

Formula:

```text
Para todo a en A, (a,a) pertenece a R.
```

En matriz:

```text
La diagonal principal debe ser 1.
```

Ejemplo reflexivo:

```text
1 0 0
0 1 0
0 0 1
```

La diagonal es:

```text
1, 1, 1
```

Por eso cumple.

## 5.2 Irreflexiva

Una relacion es irreflexiva cuando ningun elemento se relaciona consigo mismo.

Formula:

```text
Para todo a en A, (a,a) no pertenece a R.
```

En matriz:

```text
La diagonal principal debe ser 0.
```

Ejemplo:

```text
0 1 0
0 0 1
1 0 0
```

La diagonal es:

```text
0, 0, 0
```

Por eso cumple.

## 5.3 Simetrica

Una relacion es simetrica cuando todo par tiene su par inverso.

Formula:

```text
Si (a,b) pertenece a R, entonces (b,a) tambien pertenece a R.
```

En matriz:

```text
MR[i][j] debe ser igual a MR[j][i].
```

Ejemplo:

```text
1 1 0
1 1 1
0 1 1
```

Si existe `(1,2)`, tambien existe `(2,1)`.

Si existe `(2,3)`, tambien existe `(3,2)`.

## 5.4 Asimetrica

Una relacion es asimetrica cuando no existen pares en ambos sentidos.

Formula:

```text
Si (a,b) pertenece a R, entonces (b,a) no pertenece a R.
```

Ademas, no puede tener lazos.

Ejemplo:

```text
0 1 1
0 0 1
0 0 0
```

Existe `(1,2)`, pero no existe `(2,1)`.

Existe `(1,3)`, pero no existe `(3,1)`.

La diagonal es 0.

## 5.5 Antisimetrica

Una relacion es antisimetrica cuando dos elementos distintos no se relacionan en ambos sentidos.

Formula:

```text
Si (a,b) y (b,a) pertenecen a R, entonces a = b.
```

En palabras simples:

```text
Entre elementos diferentes no puede haber ida y vuelta al mismo tiempo.
```

Los lazos si se permiten.

Ejemplo:

```text
1 1 0
0 1 1
0 0 1
```

Existe `(1,2)`, pero no `(2,1)`.

Existe `(2,3)`, pero no `(3,2)`.

## 5.6 Transitiva

Una relacion es transitiva cuando un camino de dos pasos obliga a tener el paso directo.

Formula:

```text
Si (a,b) pertenece a R y (b,c) pertenece a R,
entonces (a,c) tambien debe pertenecer a R.
```

Ejemplo que no cumple:

```text
0 1 0
0 0 1
0 0 0
```

Aqui existen:

```text
(1,2) y (2,3)
```

Pero falta:

```text
(1,3)
```

Por eso no es transitiva.

## 6. Relaciones compuestas

## 6.1 Equivalencia

Una relacion es de equivalencia si cumple:

```text
Reflexiva + Simetrica + Transitiva
```

La aplicacion no la calcula aparte desde cero.

Primero calcula las tres propiedades y luego revisa si las tres son verdaderas.

## 6.2 Orden parcial

Una relacion es orden parcial si cumple:

```text
Reflexiva + Antisimetrica + Transitiva
```

Importante:

Orden parcial usa antisimetrica, no asimetrica.

## 6.3 Orden total

Una relacion es orden total si:

```text
Es orden parcial
```

y ademas:

```text
Todo par de elementos se puede comparar.
```

Comparar significa que para dos elementos distintos `a` y `b`, debe pasar al menos una:

```text
(a,b) pertenece a R
```

o

```text
(b,a) pertenece a R
```

## 6.4 Orden estricto

Una relacion es orden estricto si cumple:

```text
Irreflexiva + Asimetrica + Transitiva
```

No permite lazos.

No permite ida y vuelta.

Debe ser transitiva.

## 7. Como se calculan las propiedades en el codigo

El archivo principal de calculos es:

```text
relapp/services/relation_analyzer.py
```

Cada propiedad tiene su propia funcion:

```text
determinar_reflexiva
determinar_irreflexiva
determinar_simetrica
determinar_asimetrica
determinar_antisimetrica
determinar_transitiva
```

Luego existe una funcion que junta todas:

```text
analizar_propiedades
```

Y otra que calcula equivalencia y ordenes:

```text
analizar_clasificaciones
```

Finalmente:

```text
analizar_matriz
```

junta todo el resultado final.

## 8. Como se genera el grafo dirigido

El archivo del grafo es:

```text
relapp/services/graph_builder.py
```

El grafo se arma en dos partes.

Primero se crean los nodos:

```text
1, 2, 3, ..., n
```

Luego se crean las aristas.

Una arista es una flecha.

Regla:

```text
Si MR[fila][columna] = 1,
entonces se crea una flecha desde fila hasta columna.
```

Ejemplo:

```text
MR[2][4] = 1
```

Entonces:

```text
2 -> 4
```

La aplicacion usa Cytoscape.js solo para dibujar.

Los calculos matematicos los hace Python.

## 9. Como se valida la matriz

El archivo de validaciones es:

```text
relapp/services/validation.py
```

La funcion principal valida:

```text
validar_solicitud_analisis
```

Esa funcion llama:

```text
validar_matriz
validar_etiquetas
```

La matriz debe cumplir:

- Ser lista.
- No estar vacia.
- Tener filas del mismo tamano.
- Ser cuadrada.
- Tener solo 0 y 1.

## 10. Como funciona la interfaz

La interfaz esta en:

```text
relapp/templates/index.html
relapp/static/js/app.js
relapp/static/css/styles.css
```

HTML define la pantalla.

CSS define el estilo.

JavaScript se encarga de:

- Crear el cuadro de matriz.
- Cambiar celdas entre 0 y 1.
- Pedir analisis al backend.
- Mostrar resultados.
- Dibujar el grafo.

## 11. Flujo completo de uso

1. El usuario pone el tamano `n`.
2. La app crea la matriz `n x n`.
3. El usuario llena 0 y 1.
4. La app manda la matriz a Flask.
5. Flask valida la matriz.
6. Flask calcula propiedades.
7. Flask calcula equivalencia y ordenes.
8. Flask obtiene la relacion `R`.
9. Flask arma datos del grafo.
10. La interfaz muestra todo en pantalla.

## 12. Resumen final

El proyecto cumple con la solicitud porque:

- Usa matriz binaria `n x n`.
- Valida que sea cuadrada.
- Permite ingreso manual.
- Permite generacion aleatoria.
- Obtiene `R`.
- Calcula propiedades.
- Calcula relaciones de orden.
- Dibuja grafo dirigido.
- Valida entradas y salidas.
