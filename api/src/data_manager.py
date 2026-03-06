import os
import logging
import pandas as pd


class DataManager:
    _instance = None

    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(DataManager, cls).__new__(cls)
            cls._instance.initialized = False
        return cls._instance

    def __init__(self):
        if self.initialized:
            return
        self._data = None
        self.last_modified_time = None
        self.initialized = True

    @property
    def datafile_path(self):
        return os.getenv('PATH_TO_DATA')

    def _should_reload_data(self) -> bool:
        current_mtime = os.path.getmtime(self.datafile_path)
        return self.last_modified_time is None or current_mtime > self.last_modified_time

    @staticmethod
    def _prepare_data(df: pd.DataFrame) -> pd.DataFrame:
        df['ring_id'] = df.index
        df['ring_coverage_percent'] = df['ring_coverage_float'] * 100
        df['is_favorable'] = (
            ((df['ring_type'] == 'Cyclohexane') & (df['conformation'] == 'Chair')) |
            ((df['ring_type'] == 'Benzene') & (df['conformation'] == 'Flat')) |
            ((df['ring_type'] == 'Cyclopentane') & (df['conformation'].isin(['Envelope', 'Half chair']))) |
            ((df['ring_type'] == 'Oxane') & (df['conformation'] == '4C1'))
        )
        return df

    def _load_from_datafile(self):
        df = pd.read_parquet(self.datafile_path)
        self._data = self._prepare_data(df)
        self.last_modified_time = os.path.getmtime(self.datafile_path)

    @property
    def data(self) -> pd.DataFrame:
        if self._data is None or self._should_reload_data():
            logging.info('Loading fresh data from parquet')
            self._load_from_datafile()

        return self._data