"""Generacion de matrices permitida por el PDF del proyecto."""

import random

from .validation import crear_etiquetas_por_defecto, validar_tamano


def generar_matriz_aleatoria(tamano, semilla=None):
    """Genera una matriz binaria cuadrada de tamano n x n."""
    tamano_validado = validar_tamano(tamano)
    generador_aleatorio = random.Random(semilla)

    matriz = []

    for _ in range(tamano_validado):
        fila = []

        for _ in range(tamano_validado):
            fila.append(generador_aleatorio.randint(0, 1))

        matriz.append(fila)

    return {
        "labels": crear_etiquetas_por_defecto(tamano_validado),
        "matrix": matriz,
        "n": tamano_validado,
        "type": "random",
    }
