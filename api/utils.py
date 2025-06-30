import numpy as np
from typing import Dict, List

def get_range_with_step(data_series, column_name=None):
    """Calculate min, max, and step while handling NaN values."""
    min_value = data_series.min()
    max_value = data_series.max()

    if np.isnan(min_value) or np.isnan(max_value):
        return {}
    else:
        step = 0.01

        if column_name == 'ring_coverage_float':
            min_value = round(min_value, 0)
            max_value = round(max_value, 0)
            step = 1

        return {'min': min_value, 'max': max_value, 'step': step}


def filter_by_conf(value: Dict[str, List[str] | bool], filtered_data):
    selected_values = value.get('selectedValues', [])
    show_favorable = value.get('showFavorable', True)
    show_unfavorable = value.get('showUnfavorable', True)

    if selected_values:
        return filtered_data[filtered_data['conformation'].isin(selected_values)]

    favorability_mask = filtered_data.apply(
        lambda row: is_favorable(row['ring_type'], row['conformation']), axis=1
    )
    if not (show_favorable and show_unfavorable):
        if show_favorable:
            filtered_data = filtered_data[favorability_mask]
        elif show_unfavorable:
            filtered_data = filtered_data[~favorability_mask]
        else:
            filtered_data = filtered_data.iloc[0:0]

    return filtered_data


def is_favorable(ring, conf):
    return ((ring == "Cyclohexane" and conf == "Chair") or (ring == "Benzene" and conf == "Flat") or
            (ring == "Cyclopentane" and conf in ["Envelope", "Half chair"]))


def apply_filters(df, filters):
    for key in filters:
        value = filters[key]
        if value:
            df = df[df[key].isin(value)]
    return df
