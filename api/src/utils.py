import numpy as np
from typing import Dict, List, Any
import pandas as pd
import logging

IN_FILTER_IDS = {
    'ring_type',
    'conformation',
    'experimental_method',
    'pdb_id',
    'ccd_id',
}

RANGE_FILTER_IDS = {
    'resolution',
    'ring_coverage',
    'rsr',
    'rscc',
}


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


def get_conformation_mask(df: pd.DataFrame, conf_filter: Dict[str, List[str] | bool]) -> pd.Series:
    selected_values = conf_filter.get('selectedValues', [])
    show_favorable = conf_filter.get('showFavorable', True)
    show_unfavorable = conf_filter.get('showUnfavorable', True)

    if not show_favorable and not show_unfavorable:
        return pd.Series(False, index=df.index)

    mask = pd.Series(True, index=df.index)

    if selected_values:
        mask &= df['conf_main_type'].isin(selected_values)

    if show_favorable != show_unfavorable:
        favorability_mask = df['is_favorable']
        mask &= favorability_mask if show_favorable else ~favorability_mask

    return mask


def apply_filters(df: pd.DataFrame, filters: dict) -> pd.DataFrame:
    mask = pd.Series(True, index=df.index)

    for key, value in filters.items():
        if not value:
            continue

        if key == 'conformation':
            mask &= get_conformation_mask(df, value)
        elif key in df.columns and isinstance(value, (list, tuple, set)):
            mask &= df[key].isin(value)
        else:
            logging.warning(f'Unexpected filter format or unknown filter key: {key}')

    return df[mask]


def prepare_filtered_and_sorted_data(current_data: pd.DataFrame,
                                     filters: list[dict[str, Any]],
                                     sorting: list[dict[str, Any]]
                                     ) -> tuple[pd.DataFrame, pd.DataFrame]:

    in_filters = [f for f in filters if f['value'] and f['id'] in IN_FILTER_IDS]
    range_filters = [f for f in filters if f['value'] and f['id'] in RANGE_FILTER_IDS]

    data_before_range_filters = filter_in(current_data, in_filters)
    filtered_data = filter_ranges(data_before_range_filters, range_filters)
    if sorting:
        sort_column = sorting[0].get('id')
        sort_order_desc = sorting[0].get('desc')
        if sort_column == 'ring_coverage':
            sort_column = 'ring_coverage_float'
        filtered_data = filtered_data.sort_values(sort_column, ascending=(not sort_order_desc))

    return data_before_range_filters, filtered_data


def filter_in(filtered_data: pd.DataFrame, in_filters: list[dict[str, Any]]) -> pd.DataFrame:
    mask = pd.Series(True, index=filtered_data.index)
    for filter_item in in_filters:
        filter_id = filter_item['id']
        filter_value = filter_item['value']

        if filter_id == 'conformation':
            mask &= get_conformation_mask(filtered_data, filter_value)
        else:
            mask &= filtered_data[filter_id].isin(filter_value)

    return filtered_data[mask]


def filter_ranges(filtered_data, range_filters: list[dict[str, Any]]) -> pd.DataFrame:
    mask = pd.Series(True, index=filtered_data.index)

    for filter_item in range_filters:
        filter_id = filter_item['id']
        min_value, max_value = filter_item['value']

        if filter_id == 'resolution':
            mask &= filtered_data['resolution'].between(min_value, max_value)
        elif filter_id == 'ring_coverage':
            mask &= (filtered_data['ring_coverage_percent']).between(min_value, max_value)
        elif filter_id == 'rsr':
            mask &= filtered_data['rsr'].between(min_value, max_value)
        elif filter_id == 'rscc':
            mask &= filtered_data['rscc'].between(min_value, max_value)

    return filtered_data[mask]
