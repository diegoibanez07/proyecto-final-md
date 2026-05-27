# Analizador de Relaciones

Aplicacion web local para analizar matrices relacionales binarias. Permite ingresar una matriz MR, obtener la relacion R, revisar propiedades, revisar relaciones de orden y dibujar el grafo dirigido correspondiente.

## Ejecucion

En Windows puede abrir el proyecto con run_windows.bat.

Tambien puede ejecutarlo desde terminal con Python usando app.py.

Despues de iniciar la aplicacion, abra esta direccion en el navegador:

http://127.0.0.1:5000

## Uso basico

1. Escriba el tamano n de la matriz.
2. Pulse Crear.
3. Llene la matriz con clics sobre las casillas 0 y 1.
4. Revise la relacion R, las propiedades, los ordenes y el grafo dirigido.

## Entradas disponibles

La matriz puede ingresarse de estas formas:

- Llenar matriz manual.
- Generar matriz aleatoria.
- Generar matriz de ejemplo por propiedad u orden.
- Pegar una matriz completa en texto.

## Como se interpreta MR

La matriz usa los numeros 1, 2, 3, ..., n para filas y columnas.

La fila indica el origen.
La columna indica el destino.

Si la casilla de la fila 1 y columna 3 tiene valor 1, entonces existe el par (1, 3). Ese par aparece en R y se dibuja como una flecha desde 1 hacia 3.

## Resultados

La aplicacion muestra:

- Relacion R completa.
- Propiedades: reflexiva, irreflexiva, simetrica, asimetrica, antisimetrica y transitiva.
- Equivalencia.
- Orden parcial.
- Orden total.
- Orden estricto.
- Grafo dirigido.

## Validaciones

La aplicacion valida que la matriz:

- No este vacia.
- Sea cuadrada.
- Contenga solo 0 y 1.

Tambien valida que n sea un numero entero positivo.
