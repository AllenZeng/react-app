import { PropTypes } from 'react';

const Container = props => props.children;

Container.propTypes = {
  children: PropTypes.element,
};

export default Container;
