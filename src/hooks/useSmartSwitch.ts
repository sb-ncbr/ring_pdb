import { useEffect, useState } from 'react';

export function useSmartSwitch(isAvailable: boolean, initialValue = true) {
        const [value, setValue] = useState(initialValue);
        const [disabled, setDisabled] = useState(!isAvailable);
        const [lastEnabledValue, setLastEnabledValue] = useState(initialValue);

        useEffect(() => {
          if (!isAvailable) {
            setLastEnabledValue(value); // remember current value
            setValue(false); // force off
            setDisabled(true);
          } else {
            setValue(lastEnabledValue); // restore
            setDisabled(false);
          }
        }, [isAvailable]);

        return {
          value,
          setValue,
          disabled,
        };
      }