import PropTypes from 'prop-types';
import { forwardRef, useImperativeHandle, useState } from 'react';

const ToggleVisible = forwardRef((props, ref) => {
  const [visible, setVisible] = useState(false);

  const { buttonLabel, children } = props;

  const hideWhenVisible = { display: visible ? 'none' : '' };
  const showWhenVisible = { display: visible ? '' : 'none' };

  const toggleVisibility = () => setVisible(!visible);

  useImperativeHandle(ref, () => ({ toggleVisibility }));

  return (
    <div>
      <div style={hideWhenVisible}>
        <button onClick={toggleVisibility}>{buttonLabel}</button>
      </div>
      <div style={showWhenVisible}>
        {children}
        <button onClick={toggleVisibility}>cancel</button>
      </div>
    </div>
  );
});

ToggleVisible.propTypes = {
  buttonLabel: PropTypes.string.isRequired,
};

ToggleVisible.displayName = 'ToggleVisible';

export default ToggleVisible;
