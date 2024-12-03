import numpy as np

def get_range_with_step(data_series):
    """Calculate min, max, and step while handling NaN values."""
    min_value = data_series.min()
    max_value = data_series.max()

    if np.isnan(min_value) or np.isnan(max_value):
        return {}
    else:
        step = 0.01
        return {'min': min_value, 'max': max_value, 'step': step}
