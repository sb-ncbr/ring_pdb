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

    if not (show_favorable or show_unfavorable):
        return filtered_data.iloc[0:0]

    if selected_values:
        filtered_data = filtered_data[filtered_data['conformation'].isin(selected_values)]

    if not (show_favorable and show_unfavorable):
        favorability_mask = filtered_data.apply(
            lambda row: is_favorable(row['ring_type'], row['conformation']), axis=1
        )
        if show_favorable:
            filtered_data = filtered_data[favorability_mask]
        elif show_unfavorable:
            filtered_data = filtered_data[~favorability_mask]

    return filtered_data


def is_favorable(ring, conf):
    return ((ring == "Cyclohexane" and conf == "Chair") or (ring == "Benzene" and conf == "Flat") or
            (ring == "Cyclopentane" and conf in ["Envelope", "Half chair"]) or (ring == "Oxane" and conf == "4C1"))


def apply_filters(df, filters):
    for key, value in filters.items():
        if not value:
            continue

        if key == 'conformation':
            selected_values = value.get('selectedValues', [])
            show_favorable = value.get('showFavorable', True)
            show_unfavorable = value.get('showUnfavorable', True)

            # Apply selectedValues filter if any
            if selected_values:
                df = df[df['conformation'].isin(selected_values)]

            # Then apply favorable/unfavorable toggles if not both True
            if not (show_favorable and show_unfavorable):
                favorability_mask = df.apply(
                    lambda row: is_favorable(row['ring_type'], row['conformation']), axis=1
                )
                if show_favorable and not show_unfavorable:
                    df = df[favorability_mask]
                elif show_unfavorable and not show_favorable:
                    df = df[~favorability_mask]
                else:
                    df = df.iloc[0:0]

        else:
            # Regular list-like filter check
            if isinstance(value, (list, tuple, set)):
                df = df[df[key].isin(value)]
            else:
                print(f"Warning: unexpected filter format for {key}, skipping.")

    return df
