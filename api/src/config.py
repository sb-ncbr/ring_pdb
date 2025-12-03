import os

class Config:
    PATH_TO_DATA = os.getenv("PATH_TO_DATA")

class DevelopmentConfig(Config):
    DEBUG = True
    ENV = 'development'


class ProductionConfig(Config):
    DEBUG = False
    ENV = 'production'
