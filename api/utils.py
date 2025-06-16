import numpy as np
from typing import Dict, List

def get_range_with_step(data_series):
    """Calculate min, max, and step while handling NaN values."""
    min_value = data_series.min()
    max_value = data_series.max()

    if np.isnan(min_value) or np.isnan(max_value):
        return {}
    else:
        step = 0.01
        return {'min': min_value, 'max': max_value, 'step': step}


def filter_by_conf(value: Dict[str, List[str] | bool], filtered_data):
    selected_values = value.get('selectedValues', [])
    show_favorable = value.get('showFavorable', True)
    show_unfavorable = value.get('showUnfavorable', True)

    if selected_values:
        return filtered_data[filtered_data['conformation'].isin(selected_values)]

    if not (show_favorable and show_unfavorable):
        return filtered_data[
            filtered_data.apply(
                lambda row: (is_favorable(row['ring_type'], row['conformation']) and show_favorable) or
                            (not is_favorable(row['ring_type'], row['conformation']) and show_unfavorable),
                axis=1
            )
        ]


def is_favorable(ring, conf):
    return ((ring == "Cyclohexane" and conf == "Chair") or (ring == "Benzene" and conf == "Flat") or
            (ring == "Cyclopentane" and conf in ["Envelope", "Half chair"]))
