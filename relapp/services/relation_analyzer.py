"""Analisis matematico de relaciones binarias.

Este archivo contiene solamente logica de relaciones. Cada funcion revisa una
propiedad concreta y la funcion final junta los resultados.
"""

from .validation import validar_solicitud_analisis


NOMBRES_PROPIEDADES = {
    "reflexive": "Reflexiva",
    "irreflexive": "Irreflexiva",
    "symmetric": "Simetrica",
    "asymmetric": "Asimetrica",
    "antisymmetric": "Antisimetrica",
    "transitive": "Transitiva",
}


def crear_resultado_positivo(mensaje):
    """Crea la respuesta comun cuando una propiedad se cumple."""
    return {
        "value": True,
        "message": mensaje,
        "witness": None,
        "matrix_positions": [],
    }


def crear_resultado_negativo(mensaje, contraejemplo=None, posiciones=None):
    """Crea la respuesta comun cuando una propiedad no se cumple."""
    return {
        "value": False,
        "message": mensaje,
        "witness": contraejemplo,
        "matrix_positions": posiciones or [],
    }


def obtener_pares_de_la_relacion(matriz, etiquetas):
    """Obtiene R a partir de las posiciones con 1 en la matriz."""
    pares = []

    for indice_fila, fila in enumerate(matriz):
        for indice_columna, valor in enumerate(fila):
            if valor == 1:
                pares.append([etiquetas[indice_fila], etiquetas[indice_columna]])

    return pares


def convertir_filas_a_bits(matriz):
    """Convierte filas de 0/1 a enteros para revisar transitividad mas rapido."""
    filas_convertidas = []

    for fila in matriz:
        bits_de_la_fila = 0

        for indice_columna, valor in enumerate(fila):
            if valor == 1:
                bits_de_la_fila |= 1 << indice_columna

        filas_convertidas.append(bits_de_la_fila)

    return filas_convertidas


def determinar_reflexiva(matriz, etiquetas):
    """Revisa si todos los elementos tienen lazo en la diagonal."""
    for indice, etiqueta in enumerate(etiquetas):
        if matriz[indice][indice] != 1:
            return crear_resultado_negativo(
                f"No es reflexiva porque falta el lazo ({etiqueta}, {etiqueta}).",
                [etiqueta, etiqueta],
                [{"row": indice + 1, "column": indice + 1}],
            )

    return crear_resultado_positivo("Es reflexiva porque todos los elementos tienen lazo en la diagonal.")


def determinar_irreflexiva(matriz, etiquetas):
    """Revisa si ningun elemento tiene lazo en la diagonal."""
    for indice, etiqueta in enumerate(etiquetas):
        if matriz[indice][indice] != 0:
            return crear_resultado_negativo(
                f"No es irreflexiva porque existe el lazo ({etiqueta}, {etiqueta}).",
                [etiqueta, etiqueta],
                [{"row": indice + 1, "column": indice + 1}],
            )

    return crear_resultado_positivo("Es irreflexiva porque ningun elemento tiene lazo en la diagonal.")


def determinar_simetrica(matriz, etiquetas):
    """Revisa si cada par tiene su par inverso."""
    tamano = len(matriz)

    for indice_fila in range(tamano):
        for indice_columna in range(indice_fila + 1, tamano):
            if matriz[indice_fila][indice_columna] != matriz[indice_columna][indice_fila]:
                par_presente = (
                    (indice_fila, indice_columna)
                    if matriz[indice_fila][indice_columna] == 1
                    else (indice_columna, indice_fila)
                )

                par_faltante = (
                    (indice_columna, indice_fila)
                    if matriz[indice_fila][indice_columna] == 1
                    else (indice_fila, indice_columna)
                )

                return crear_resultado_negativo(
                    "No es simetrica porque hay un par sin su par inverso.",
                    {
                        "present": [etiquetas[par_presente[0]], etiquetas[par_presente[1]]],
                        "missing": [etiquetas[par_faltante[0]], etiquetas[par_faltante[1]]],
                    },
                    [{"row": par_faltante[0] + 1, "column": par_faltante[1] + 1}],
                )

    return crear_resultado_positivo("Es simetrica porque todo par tiene tambien su par inverso.")


def determinar_antisimetrica(matriz, etiquetas):
    """Revisa que no existan pares dobles entre elementos distintos."""
    tamano = len(matriz)

    for indice_fila in range(tamano):
        for indice_columna in range(indice_fila + 1, tamano):
            existe_ida = matriz[indice_fila][indice_columna] == 1
            existe_vuelta = matriz[indice_columna][indice_fila] == 1

            if existe_ida and existe_vuelta:
                return crear_resultado_negativo(
                    "No es antisimetrica porque dos elementos distintos se relacionan en ambos sentidos.",
                    [
                        [etiquetas[indice_fila], etiquetas[indice_columna]],
                        [etiquetas[indice_columna], etiquetas[indice_fila]],
                    ],
                    [
                        {"row": indice_fila + 1, "column": indice_columna + 1},
                        {"row": indice_columna + 1, "column": indice_fila + 1},
                    ],
                )

    return crear_resultado_positivo("Es antisimetrica porque no hay pares dobles entre elementos distintos.")


def determinar_asimetrica(matriz, etiquetas):
    """Revisa que no existan lazos ni pares opuestos simultaneos."""
    tamano = len(matriz)

    for indice, etiqueta in enumerate(etiquetas):
        if matriz[indice][indice] == 1:
            return crear_resultado_negativo(
                f"No es asimetrica porque contiene el lazo ({etiqueta}, {etiqueta}).",
                [etiqueta, etiqueta],
                [{"row": indice + 1, "column": indice + 1}],
            )

    for indice_fila in range(tamano):
        for indice_columna in range(indice_fila + 1, tamano):
            existe_ida = matriz[indice_fila][indice_columna] == 1
            existe_vuelta = matriz[indice_columna][indice_fila] == 1

            if existe_ida and existe_vuelta:
                return crear_resultado_negativo(
                    "No es asimetrica porque existen pares en ambos sentidos.",
                    [
                        [etiquetas[indice_fila], etiquetas[indice_columna]],
                        [etiquetas[indice_columna], etiquetas[indice_fila]],
                    ],
                    [
                        {"row": indice_fila + 1, "column": indice_columna + 1},
                        {"row": indice_columna + 1, "column": indice_fila + 1},
                    ],
                )

    return crear_resultado_positivo("Es asimetrica porque no tiene lazos ni pares opuestos simultaneos.")


def determinar_transitiva(matriz, etiquetas):
    """Revisa si todo camino (a,b) y (b,c) tambien tiene (a,c)."""
    tamano = len(matriz)
    filas_en_bits = convertir_filas_a_bits(matriz)

    for indice_origen in range(tamano):
        fila_origen_en_bits = filas_en_bits[indice_origen]

        for indice_intermedio in range(tamano):
            if matriz[indice_origen][indice_intermedio] == 1:
                destinos_faltantes = filas_en_bits[indice_intermedio] & ~fila_origen_en_bits

                if destinos_faltantes:
                    for indice_destino in range(tamano):
                        if destinos_faltantes & (1 << indice_destino):
                            return crear_resultado_negativo(
                                "No es transitiva: existen (a,b) y (b,c), pero falta (a,c).",
                                {
                                    "present": [
                                        [etiquetas[indice_origen], etiquetas[indice_intermedio]],
                                        [etiquetas[indice_intermedio], etiquetas[indice_destino]],
                                    ],
                                    "missing": [etiquetas[indice_origen], etiquetas[indice_destino]],
                                },
                                [{"row": indice_origen + 1, "column": indice_destino + 1}],
                            )

    return crear_resultado_positivo("Es transitiva porque cada camino de longitud dos tiene su par directo.")


FUNCIONES_DE_PROPIEDADES = {
    "reflexive": determinar_reflexiva,
    "irreflexive": determinar_irreflexiva,
    "symmetric": determinar_simetrica,
    "asymmetric": determinar_asimetrica,
    "antisymmetric": determinar_antisimetrica,
    "transitive": determinar_transitiva,
}


def revisar_propiedad(matriz, etiquetas, nombre_propiedad):
    """Ejecuta una sola propiedad seleccionada por el usuario."""
    funcion_propiedad = FUNCIONES_DE_PROPIEDADES.get(nombre_propiedad)

    if funcion_propiedad is None:
        propiedades_permitidas = ", ".join(FUNCIONES_DE_PROPIEDADES)
        raise KeyError(f"Propiedad desconocida. Use una de: {propiedades_permitidas}.")

    return funcion_propiedad(matriz, etiquetas)


def determinar_comparabilidad(matriz, etiquetas):
    """Revisa si todo par de elementos distintos es comparable."""
    tamano = len(matriz)

    for indice_fila in range(tamano):
        for indice_columna in range(indice_fila + 1, tamano):
            no_hay_ida = matriz[indice_fila][indice_columna] == 0
            no_hay_vuelta = matriz[indice_columna][indice_fila] == 0

            if no_hay_ida and no_hay_vuelta:
                return crear_resultado_negativo(
                    "No todos los elementos son comparables.",
                    [etiquetas[indice_fila], etiquetas[indice_columna]],
                    [
                        {"row": indice_fila + 1, "column": indice_columna + 1},
                        {"row": indice_columna + 1, "column": indice_fila + 1},
                    ],
                )

    return crear_resultado_positivo("Todo par de elementos distintos es comparable.")


def analizar_propiedades(matriz, etiquetas):
    """Calcula todas las propiedades relacionales solicitadas por el PDF."""
    resultados = {}

    for nombre_propiedad, funcion_propiedad in FUNCIONES_DE_PROPIEDADES.items():
        resultados[nombre_propiedad] = funcion_propiedad(matriz, etiquetas)

    return resultados


def analizar_clasificaciones(matriz, etiquetas, propiedades):
    """Calcula equivalencia y tipos de orden a partir de las propiedades."""
    es_equivalencia = (
        propiedades["reflexive"]["value"]
        and propiedades["symmetric"]["value"]
        and propiedades["transitive"]["value"]
    )

    es_orden_parcial = (
        propiedades["reflexive"]["value"]
        and propiedades["antisymmetric"]["value"]
        and propiedades["transitive"]["value"]
    )

    comparabilidad = determinar_comparabilidad(matriz, etiquetas)

    es_orden_total = es_orden_parcial and comparabilidad["value"]

    es_orden_estricto = (
        propiedades["irreflexive"]["value"]
        and propiedades["asymmetric"]["value"]
        and propiedades["transitive"]["value"]
    )

    return {
        "equivalence": {
            "value": es_equivalencia,
            "message": "Es relacion de equivalencia."
            if es_equivalencia
            else "No es equivalencia: requiere reflexividad, simetria y transitividad.",
        },
        "partial_order": {
            "value": es_orden_parcial,
            "message": "Es orden parcial."
            if es_orden_parcial
            else "No es orden parcial: requiere reflexividad, antisimetria y transitividad.",
        },
        "total_order": {
            "value": es_orden_total,
            "message": "Es orden total."
            if es_orden_total
            else "No es orden total: debe ser orden parcial y todos los elementos deben ser comparables.",
            "comparability": comparabilidad,
        },
        "strict_order": {
            "value": es_orden_estricto,
            "message": "Es orden estricto."
            if es_orden_estricto
            else "No es orden estricto: requiere irreflexividad, asimetria y transitividad.",
        },
    }


def analizar_matriz(matriz, etiquetas):
    """Funcion conciliadora: junta propiedades y clasificaciones finales."""
    propiedades = analizar_propiedades(matriz, etiquetas)
    clasificaciones = analizar_clasificaciones(matriz, etiquetas, propiedades)

    return propiedades, clasificaciones


def analizar_solicitud(datos):
    """Valida los datos recibidos y luego analiza la matriz."""
    matriz, etiquetas, tamano = validar_solicitud_analisis(datos)
    propiedades, clasificaciones = analizar_matriz(matriz, etiquetas)

    return matriz, etiquetas, tamano, propiedades, clasificaciones
