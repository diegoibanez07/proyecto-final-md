from flask import Flask


def create_app(test_config=None):
    app = Flask(__name__)
    app.config.update(
        JSON_SORT_KEYS=False,
        SECRET_KEY="relapp-local-secret",
    )

    if test_config:
        app.config.update(test_config)

    from .routes import bp

    app.register_blueprint(bp)
    return app
