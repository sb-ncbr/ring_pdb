
class Config:
    PATH_TO_DATA = 'data/newRings2209.parquet'
    PATH_TO_LOGS = './'


class DevelopmentConfig(Config):
    DEBUG = True
    ENV = 'development'


class ProductionConfig(Config):
    DEBUG = False
    ENV = 'production'
