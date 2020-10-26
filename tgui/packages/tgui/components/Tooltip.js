/**
 * @file
 * @copyright 2020 Aleksej Komarov
 * @license MIT
 */

import { classes } from 'common/react';
import { Component, createPortal, createRef } from 'inferno';
import { Button } from './Button';
import { Box } from './Box';

import { createPopper } from '@popperjs/core';

import { createLogger } from 'common/logging.js';
const logger = createLogger('Tooltip');

export const Tooltipold = props => {
  const {
    content,
    overrideLong = false,
    position = 'bottom',
  } = props;
  // Empirically calculated length of the string,
  // at which tooltip text starts to overflow.
  const long = typeof content === 'string'
  && (content.length > 35 && !overrideLong);
  return (
    <div
      className={classes([
        'Tooltip',
        long && 'Tooltip--long',
        position && 'Tooltip--' + position,
      ])}
      data-tooltip={content} />
  );
};


class Portal extends Component {
  constructor(props, context) {
    super(props, context);
  }

  componentWillUnmount() {
    if (this.defaultNode) {
      document.body.removeChild(this.defaultNode);
    }
    this.defaultNode = null;
  }

  render() {
    if (!this.defaultNode) {
      this.defaultNode = document.createElement('div');
      document.body.appendChild(this.defaultNode);
    }
    return createPortal(this.props.children, this.defaultNode);
  }
}

const CustomPositionModifier = {
  name: 'CustomPositionModifier',
  enabled: true,
  phase: 'main',
  fn({ data }) {
    const isVisible = this.state.isVisible;
    logger.log(isVisible);
    const left = Math.floor(data.popper.left);
    const top = Math.floor(data.popper.top);
    const newTop = isVisible ? top : top - 10;

    const popper = { ...data.popper, left, top: newTop };
    const offsets = { ...data.offsets, popper };
    const styles = { ...data.styles };

    return { ...data, offsets, styles };
  },
};

const topLogger = {
  name: 'topLogger',
  enabled: true,
  phase: 'main',
  fn({ state }) {
    if (state.placement === 'top') {
      logger.log('Popper is on the top');
    }
  },
};


export class Tooltip extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {};
    this._popper = null;
    this._popperParentNode = null;
    this._popoutNode = null;
    this._arrow = null;

    this.children = document.querySelector('#children');
    this.tooltip = document.querySelector('#tooltip');
  }

  componentDidMount() {
    logger.log("Mounted");
  }


  /*   {
    name: 'computeStylesGpu',
    options: {
      gpuAcceleration: false,
      adaptive: false,
      applyStyle: true,
      [CustomPositionModifier]: true,
    },
  }, */

  render() {
    this._popper = createPopper(this.children, this.tooltip, {
      modifiers: [topLogger],
    });
    let state = this.state;
    return (
      <Box>
        <div
          id="children" />
        {this._popper.length}
        {this.props.children}
        <Portal>
          <Box
            className="Tooltip"
            id="tooltip">
            {this.props.content}
          </Box>
        </Portal>
      </Box>
    );
  }
}
