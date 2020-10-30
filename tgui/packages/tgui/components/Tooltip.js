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

export class Tooltip extends Component {
  constructor(props, context) {
    super(props, context);
    this.state = {
      tooltipEnabled: false,
    };
    this.children = createRef();
    this.tooltip = createRef();
  }


  mouseEnter(e) {
    const {
      position = "top",
    } = this.props;

    this.setState({ tooltipEnabled: true });
    if (this.children.current && this.tooltip.current)
    {
      createPopper(this.children.current, this.tooltip.current, {
        placement: position,
        modifiers: {
          name: 'computeStylesGpu',
          options: {
            gpuAcceleration: false,
            adaptive: false,
            applyStyles: true,
          },
        },
      });
    }
  }

  mouseLeave(e) {
    this.setState({ tooltipEnabled: false });
  }

  render() {
    return (
      <Box as="span">
        <span
          onmouseenter={this.mouseEnter.bind(this)}
          onmouseleave={this.mouseLeave.bind(this)}
          ref={this.children}>
          {this.props.children}
        </span>
        {this.state.tooltipEnabled && (
          <Portal>
            <div
              className="Tooltip"
              ref={this.tooltip}>
              <div data-popper-arrow />
              {this.props.content}
            </div>
          </Portal>
        )}
      </Box>
    );
  }
}
