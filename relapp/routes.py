"""Rutas web y API JSON del analizador de relaciones."""

from flask import Blueprint, jsonify, render_template, request

from .services.generators import generar_matriz_aleatoria
from .services.graph_builder import construir_grafo_dirigido
from .services.relation_analyzer import (
    NOMBRES_PROPIEDADES,
    analizar_solicitud,
    obtener_pares_de_la_relacion,
    revisar_propiedad,
)
from .services.validation import ErrorValidacion, validar_solicitud_analisis


bp = Blueprint("main", __name__)


@bp.errorhandler(ErrorValidacion)
def manejar_error_de_validacion(error):
    """Devuelve errores de validacion en formato JSON."""
    return jsonify(error.convertir_a_diccionario()), 400


@bp.get("/", endpoint="index")
def mostrar_inicio():
    """Renderiza la pagina principal."""
    return render_template("index.html", property_names=NOMBRES_PROPIEDADES)


@bp.get("/manual", endpoint="manual")
def mostrar_manual():
    """Renderiza el manual de usuario."""
    return render_template("manual.html")


@bp.get("/api/health")
def verificar_estado():
    """Permite comprobar que la aplicacion esta encendida."""
    return jsonify({"ok": True, "app": "Analizador de Relaciones", "status": "running"})


@bp.post("/api/analyze")
def analizar_matriz_completa():
    """Recibe una matriz y devuelve el analisis completo."""
    matriz, etiquetas, tamano, propiedades, clasificaciones = analizar_solicitud(
        request.get_json(silent=True)
    )
    pares_de_la_relacion = obtener_pares_de_la_relacion(matriz, etiquetas)

    respuesta = {
        "valid": True,
        "n": tamano,
        "labels": etiquetas,
        "relation": pares_de_la_relacion,
        "properties": propiedades,
        "classifications": clasificaciones,
        "graph": construir_grafo_dirigido(matriz, etiquetas),
    }

    return jsonify(respuesta)


@bp.post("/api/check/<nombre_propiedad>")
def analizar_propiedad_individual(nombre_propiedad):
    """Analiza una sola propiedad seleccionada desde la interfaz."""
    matriz, etiquetas, tamano = validar_solicitud_analisis(request.get_json(silent=True))

    try:
        resultado = revisar_propiedad(matriz, etiquetas, nombre_propiedad)
    except KeyError as error:
        return jsonify({"valid": False, "error": str(error)}), 404

    return jsonify(
        {
            "valid": True,
            "n": tamano,
            "property": nombre_propiedad,
            "display_name": NOMBRES_PROPIEDADES[nombre_propiedad],
            "result": resultado,
        }
    )


@bp.post("/api/generate")
def generar_matriz():
    """Genera una matriz binaria cuadrada aleatoria."""
    datos = request.get_json(silent=True)

    if not isinstance(datos, dict):
        raise ErrorValidacion("La peticion debe enviarse en formato JSON.")

    resultado = generar_matriz_aleatoria(datos.get("n", 3), semilla=datos.get("seed"))

    return jsonify({"valid": True, **resultado})
