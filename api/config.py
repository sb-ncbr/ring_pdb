class Config:
    WORKFLOW_OUTPUT_DATA = "data"


class DevelopmentConfig(Config):
    DEBUG = True
    ENV = 'development'


class ProductionConfig(Config):
    DEBUG = False
    ENV = 'production'
