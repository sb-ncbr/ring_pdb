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


def is_favorable(ring, conf):
    return ((ring == "Cyclohexane" and conf == "Chair") or (ring == "Benzene" and conf == "Flat") or
            (ring == "Cyclopentane" and conf in ["Envelope", "Half chair"]))
