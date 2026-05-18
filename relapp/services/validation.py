"""Validaciones de entrada para la matriz relacional.

Este archivo no calcula propiedades matematicas. Su unica responsabilidad es
revisar que los datos enviados por la interfaz sean correctos antes de analizar.
"""


class ErrorValidacion(ValueError):
    """Error controlado para responder mensajes claros al usuario."""

    def __init__(self, mensaje, campo=None, detalles=None):
        super().__init__(mensaje)
        self.mensaje = mensaje
        self.campo = campo
        self.detalles = detalles or {}

    def convertir_a_diccionario(self):
        """Convierte el error en un formato JSON entendible por la interfaz."""
        respuesta = {"valid": False, "error": self.mensaje}
        if self.campo:
            respuesta["field"] = self.campo
        if self.detalles:
            respuesta["details"] = self.detalles
        return respuesta


def validar_tamano(tamano, minimo=1, maximo=50):
    """Valida que n sea un entero dentro del rango permitido."""
    if isinstance(tamano, bool):
        raise ErrorValidacion("Ingrese un tamano n valido entre 1 y 50.", "n")

    try:
        tamano_convertido = int(tamano)
    except (TypeError, ValueError):
        raise ErrorValidacion("Ingrese un tamano n valido entre 1 y 50.", "n")

    if tamano_convertido < minimo or tamano_convertido > maximo:
        raise ErrorValidacion("Ingrese un tamano n valido entre 1 y 50.", "n")

    return tamano_convertido


def validar_matriz(matriz):
    """Valida que la matriz exista, sea cuadrada y contenga solo 0 y 1."""
    if matriz is None:
        raise ErrorValidacion("La matriz es obligatoria.", "matrix")

    if not isinstance(matriz, list) or len(matriz) == 0:
        raise ErrorValidacion("La matriz no puede estar vacia.", "matrix")

    tamano = len(matriz)

    for indice_fila, fila in enumerate(matriz):
        if not isinstance(fila, list):
            raise ErrorValidacion(
                "Cada fila de la matriz debe ser una lista.",
                "matrix",
                {"row": indice_fila + 1},
            )

        if len(fila) != tamano:
            raise ErrorValidacion(
                "La matriz debe ser cuadrada: todas las filas deben tener exactamente n elementos.",
                "matrix",
                {"row": indice_fila + 1, "expected": tamano, "received": len(fila)},
            )

        for indice_columna, valor in enumerate(fila):
            if isinstance(valor, bool) or valor not in (0, 1):
                raise ErrorValidacion(
                    "La matriz solo acepta valores binarios 0 o 1.",
                    "matrix",
                    {
                        "row": indice_fila + 1,
                        "column": indice_columna + 1,
                        "value": valor,
                    },
                )

    return tamano


def crear_etiquetas_por_defecto(tamano):
    """Crea etiquetas simples cuando el usuario no envia nombres."""
    return [str(indice + 1) for indice in range(tamano)]


def validar_etiquetas(etiquetas, tamano):
    """Valida que las etiquetas coincidan con el tamano de la matriz."""
    if etiquetas is None or etiquetas == []:
        return crear_etiquetas_por_defecto(tamano)

    if not isinstance(etiquetas, list):
        raise ErrorValidacion("Las etiquetas deben enviarse como una lista.", "labels")

    if len(etiquetas) != tamano:
        raise ErrorValidacion(
            "La cantidad de etiquetas debe coincidir con el tamano de la matriz.",
            "labels",
            {"expected": tamano, "received": len(etiquetas)},
        )

    etiquetas_limpias = []

    for posicion, etiqueta in enumerate(etiquetas):
        texto_etiqueta = str(etiqueta).strip()

        if not texto_etiqueta:
            raise ErrorValidacion(
                "Las etiquetas no pueden estar vacias.",
                "labels",
                {"position": posicion + 1},
            )

        if len(texto_etiqueta) > 20:
            raise ErrorValidacion(
                "Cada etiqueta debe tener maximo 20 caracteres.",
                "labels",
                {"position": posicion + 1},
            )

        etiquetas_limpias.append(texto_etiqueta)

    if len(set(etiquetas_limpias)) != len(etiquetas_limpias):
        raise ErrorValidacion("Las etiquetas no pueden repetirse.", "labels")

    return etiquetas_limpias


def validar_solicitud_analisis(datos):
    """Valida el JSON completo que llega desde la interfaz."""
    if not isinstance(datos, dict):
        raise ErrorValidacion("La solicitud debe enviarse en formato JSON.")

    matriz = datos.get("matrix")
    tamano = validar_matriz(matriz)
    etiquetas = validar_etiquetas(datos.get("labels"), tamano)

    return matriz, etiquetas, tamano
