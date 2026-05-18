# RelApp - Proyecto Matematicas Discretas

Aplicacion web local orientada al PDF `Proyecto_Final_M.D..pdf`.

## Que hace

- Permite crear una matriz relacional binaria `MR` de tamano `n x n`.
- Permite llenar la matriz con clics o generarla aleatoriamente.
- Obtiene automaticamente la relacion `R`.
- Calcula las propiedades: reflexiva, irreflexiva, simetrica, asimetrica, antisimetrica y transitiva.
- Indica si es equivalencia, orden parcial, orden total u orden estricto.
- Dibuja el grafo dirigido correspondiente.

## Como ejecutar

```powershell
.\.venv\Scripts\python.exe app.py
```

Luego abra:

```text
http://127.0.0.1:5000
```

Tambien puede usar:

```powershell
run_windows.bat
```

## Como se interpreta la matriz

La app nombra automaticamente filas y columnas como `1, 2, 3...`.

Si la celda de la fila `1` y columna `3` vale `1`, entonces existe el par:

```text
(1, 3)
```

Ese par aparece en `R` y se dibuja como una flecha del nodo `1` al nodo `3`.

## Grafo dirigido

El grafo se construye directamente desde `MR`:

- Cada fila/columna es un nodo.
- Cada `1` en la matriz es una flecha.
- La fila indica el origen.
- La columna indica el destino.
- Un `1` en la diagonal crea un lazo del nodo hacia si mismo.
