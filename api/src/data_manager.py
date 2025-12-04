import os
import logging
import pandas as pd
import pickle

from pathlib import Path

class DataManager:
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super(DataManager, cls).__new__(cls)
            cls._instance.initialized = False
        return cls._instance
    
    def __init__(self, cache_file="data_cache.pkl"):
        if self.initialized:
            return
        self.cache_file = cache_file
        self._data = None
        self.last_modified_time = None
        self.initialized = True    
        
    def _should_reload_data(self):
        """Check if the source Datafile file has been modified since last load"""
        current_mtime = os.path.getmtime(self.datafile_path)
        return (self.last_modified_time is None or 
                current_mtime > self.last_modified_time)
    
    def _load_from_datafile(self):
        self._data = pd.read_parquet(self.datafile_path)
        self._data['ring_id'] = self._data.index
        self.last_modified_time = os.path.getmtime(self.datafile_path)
        self._save_to_cache(self._data)

    def _load_from_cache(self):
        """Attempt to load data from cache file"""
        try:
            if os.path.exists(self.cache_file):
                with open(self.cache_file, 'rb') as f:
                    cached_data = pickle.load(f)
                logging.info("Data loaded from cache successfully")
                return cached_data
        except Exception as e:
            logging.error(f"Error loading cache: {e}")
        return None
    
    def _save_to_cache(self, data):
        """Save data to cache file"""
        try:
            with open(self.cache_file, 'wb') as f:
                pickle.dump(data, f)
            logging.info("Data cached successfully")
        except Exception as e:
            logging.error(f"Error saving cache: {e}")
    
    def preload_data(self):
        logging.info("Preloading data to cache")
        self._load_from_datafile()
    
    @property
    def datafile_path(self):
        """Get Datafile path from env variable"""
        return os.getenv("PATH_TO_DATA")
        
    @property
    def data(self):
        """Get data with caching mechanism"""
        if self._should_reload_data():
            logging.info("Loading fresh data from Datafile")
            self._load_from_datafile()
        elif self._data is None:
            logging.info("Attempting to load from cache")
            self._data = self._load_from_cache()
            if self._data is None:
                logging.info("Cache miss - loading from Datafile")
                self._load_from_datafile()
        
        return self._data
