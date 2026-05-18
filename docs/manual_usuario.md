# Manual de usuario - RelApp

## Inicio

1. Ejecute `run_windows.bat` o `python app.py`.
2. Abra `http://127.0.0.1:5000`.
3. Seleccione el tamano `n`.
4. Pulse `Crear`.
5. Llene el cuadro `n x n` haciendo clic en las casillas 0/1.

## Que debe ingresar el usuario

El usuario solo debe ingresar la matriz `MR`.

No necesita escribir los nombres de los elementos. La aplicacion nombra automaticamente las filas y columnas como:

```text
1, 2, 3, ...
```

## Como se lee MR

La fila es el origen y la columna es el destino.

Ejemplo:

```text
      1  2  3
1     0  1  0
2     0  0  1
3     1  0  0
```

Entonces:

```text
R = {(1,2), (2,3), (3,1)}
```

## Ingreso de matriz

Puede ingresar la matriz de dos formas:

- Principal: editando cada celda en el cuadro `n x n` con clic.
- Opcional: pegando una matriz binaria cuadrada en el cuadro de texto.

Tambien puede usar `Generar matriz aleatoria`, que cumple la opcion del PDF donde el sistema genera la matriz directamente.

## Propiedades y explicaciones

Cada tarjeta muestra:

- Si cumple o no cumple.
- El caso que falla, cuando existe uno concreto.

El "caso que falla" no es otra matriz: es un par o grupo de pares que muestra por que la propiedad no se cumple.

## Grafo dirigido

El grafo se genera a partir de `MR`:

- Cada elemento `1, 2, ...` es un nodo.
- Cada valor `1` de la matriz crea una flecha.
- La fila indica desde donde sale la flecha.
- La columna indica hacia donde llega la flecha.
- Si el `1` esta en la diagonal, se dibuja un lazo.

Ejemplo: si la celda de la fila `1` y columna `3` vale `1`, se dibuja una flecha de `1` hacia `3`.

## Validaciones

El sistema rechaza:

- Matrices vacias.
- Matrices que no sean cuadradas.
- Valores diferentes de 0 y 1.
- Tamanos que no sean numeros enteros positivos.
