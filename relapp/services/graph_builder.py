"""Construccion del grafo dirigido para Cytoscape.js."""


def construir_nodos(etiquetas):
    """Convierte cada elemento del conjunto A en un nodo del grafo."""
    nodos = []

    for indice, etiqueta in enumerate(etiquetas):
        nodos.append({"data": {"id": str(indice), "label": etiqueta}})

    return nodos


def construir_aristas(matriz, etiquetas):
    """Convierte cada 1 de la matriz en una arista dirigida."""
    aristas = []

    for indice_fila, fila in enumerate(matriz):
        for indice_columna, valor in enumerate(fila):
            if valor == 1:
                aristas.append(
                    {
                        "data": {
                            "id": f"e{indice_fila}_{indice_columna}",
                            "source": str(indice_fila),
                            "target": str(indice_columna),
                            "label": f"({etiquetas[indice_fila]}, {etiquetas[indice_columna]})",
                        }
                    }
                )

    return aristas


def construir_grafo_dirigido(matriz, etiquetas):
    """Une nodos y aristas en el formato que necesita Cytoscape.js."""
    return {
        "nodes": construir_nodos(etiquetas),
        "edges": construir_aristas(matriz, etiquetas),
    }
