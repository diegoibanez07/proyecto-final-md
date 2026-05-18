"""Construccion del grafo dirigido para Cytoscape.js.

La matriz relacional MR se interpreta asi:

- Cada fila y cada columna representan el mismo elemento del conjunto A.
- Si MR[i][j] vale 1, entonces existe el par ordenado (ai, aj).
- Ese par ordenado se dibuja como una flecha desde el nodo ai hasta el nodo aj.
- Si i == j y MR[i][i] vale 1, la flecha sale y llega al mismo nodo; eso es un lazo.

Este archivo no calcula propiedades matematicas. Solo transforma la matriz ya
validada al formato que Cytoscape.js necesita para pintar nodos y aristas.
"""


def construir_nodos(etiquetas):
    """Convierte cada elemento del conjunto A en un nodo del grafo."""
    nodos = []

    for indice, etiqueta in enumerate(etiquetas):
        # Cytoscape identifica cada nodo con un id de texto.
        # La etiqueta es lo que ve el usuario dentro del nodo.
        nodos.append({"data": {"id": str(indice), "label": etiqueta}})

    return nodos


def construir_aristas(matriz, etiquetas):
    """Convierte cada 1 de la matriz en una arista dirigida."""
    aristas = []

    for indice_fila, fila in enumerate(matriz):
        for indice_columna, valor in enumerate(fila):
            if valor == 1:
                # La fila es el origen de la flecha.
                origen = str(indice_fila)

                # La columna es el destino de la flecha.
                destino = str(indice_columna)

                # La etiqueta muestra el par ordenado que representa la flecha.
                etiqueta_arista = f"({etiquetas[indice_fila]}, {etiquetas[indice_columna]})"

                aristas.append(
                    {
                        "data": {
                            "id": f"e{indice_fila}_{indice_columna}",
                            "source": origen,
                            "target": destino,
                            "label": etiqueta_arista,
                        }
                    }
                )

    return aristas


def contar_aristas(matriz):
    """Cuenta cuantos unos tiene la matriz sin construir todas las aristas."""
    return sum(sum(fila) for fila in matriz)


def construir_grafo_dirigido(matriz, etiquetas):
    """Une nodos y aristas en el formato que necesita Cytoscape.js."""
    tamano = len(matriz)
    total_aristas = contar_aristas(matriz)

    return {
        "nodes": construir_nodos(etiquetas),
        "edges": construir_aristas(matriz, etiquetas),
        "node_count": tamano,
        "edge_count": total_aristas,
    }
