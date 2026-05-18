# Manual de usuario - RelApp

## Inicio

1. Ejecute `run_windows.bat` o `python app.py`.
2. Abra `http://127.0.0.1:5000`.
3. Seleccione el tamano `n`.
4. Pulse `Crear`.
5. Llene el cuadro `n x n` haciendo clic en las casillas 0/1.

## Concepto clave

El proyecto usa una sola matriz: la matriz relacional `MR`.

La relacion `R` no es otra matriz. `R` es la lista de pares ordenados que se obtiene mirando las celdas con valor 1. Si la fila es `a`, la columna es `b` y la celda vale 1, entonces el par `(a,b)` pertenece a `R`.

## Elementos del conjunto A

Los elementos son los nombres de filas y columnas. No cambian los 0/1.

Si escribe:

```text
a,b,c,d
```

la matriz se lee con esos nombres. Debe escribir exactamente `n` elementos separados por coma y pulsar `Aplicar`.

## Ingreso de matriz

Puede ingresar la matriz de dos formas:

- Principal: editando cada celda en el cuadro `n x n` con clic.
- Opcional: pegando una matriz binaria cuadrada en el cuadro de texto.

Tambien puede usar `Generar matriz aleatoria`, que cumple la opcion del PDF donde el sistema genera la matriz directamente.

## Resultados

El sistema muestra:

- Relacion `R` como pares ordenados.
- Propiedades: reflexiva, irreflexiva, simetrica, asimetrica, antisimetrica y transitiva.
- Equivalencia.
- Orden parcial, orden total y orden estricto.
- Grafo dirigido basado en `MR`.

## Validaciones

El sistema rechaza matrices vacias, matrices no cuadradas, valores diferentes de 0 y 1, etiquetas duplicadas y tamanos fuera del rango 1 a 50.
