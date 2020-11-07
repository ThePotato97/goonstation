/**
 * @file
 * @copyright 2020 Aleksej Komarov
 * @license MIT
 */

import { classes } from 'common/react';
import { Component, createPortal, createRef, Fragment } from 'inferno';
import { Button } from './Button';
import { computeBoxProps } from './Box';
import { Box } from './Box';

import { createPopper } from '@popperjs/core';

import { createLogger } from 'common/logging.js';
const logger = createLogger('ByondUi');

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
    this.self = this;
    this.state = {
      tooltipEnabled: false,
    };
    this.popperInstance = null;
    this.childrenHolder = createRef();
    this.tooltip = createRef();
    this.arrow = createRef();
    this.popperActive = false;
    this.disablePopper = false;
    this.props.overflow = true;
  }

  makePopper() {
    const {
      position = "top",
    } = this.props;
    this.setState({ tooltipEnabled: true });
    if (this.childrenHolder.current && this.tooltip.current)
    {
      this.popperInstance = createPopper(
        this.childrenHolder.current,
        this.tooltip.current, {
          placement: position,
          offset: 10,
          modifiers: [
            {
              name: 'computeStylesGpu',
              options: {
                gpuAcceleration: false,
                adaptive: false,
                applyStyles: true,
              },
            },
            {
              name: 'arrow',
              options: {
                enabled: true,
                element: this.arrow.current,
              },
            },
            {
              name: 'preventOverflow',
              options: {
                altAxis: true,
                padding: 5,
              },
            },
          ],
        });
    }
  }


  isEllipsisActive(e) {
    return e.offsetHeight < e.scrollHeight || e.offsetWidth < e.scrollWidth;
  }



  componentDidUpdate() {
    // this.disablePopper = this.isEllipsisActive(this.childrenHolder.current)
    // && this.props.overflow;
    /*     this.childrenHolder.current.removeEventListener("mouseenter");
    this.childrenHolder.current.removeEventListener("mouseleave"); */
    if (this.props.triggerRef && !this.popperActive)
    {
      logger.log("Hello");
      this.props.triggerRef.current.addEventListener("mouseleave",
        () => this.mouseLeave());
      this.props.triggerRef.current.addEventListener("mouseenter",
        () => this.mouseEnter());
      this.popperActive = true;
    }
  }

  /*   if (!this.disablePopper && !this.popperActive && this.childrenHolder)
  {    } */

  componentDidMount() {
    // this.disablePopper = this.isEllipsisActive(this.childrenHolder.current)
    // && this.props.overflow;
    if (this.childrenHolder && this.childrenHolder.current)
    {
      this.childrenHolder.current.addEventListener("mouseleave", () => this.mouseLeave());
      this.childrenHolder.current.addEventListener("mouseenter", () => this.mouseEnter());
      this.popperActive = true;
    }
  }

  destroy() {
    if (this.popperInstance) {
      this.popperInstance.destroy();
      this.popperInstance = null;
    }
  }

  mouseEnter() {
    this.makePopper();
    this.setState({ tooltipEnabled: true });
  }

  mouseLeave() {
    this.setState({ tooltipEnabled: false });
    this.destroy();
  }

  render() {
    const {
      children,
      content,
      triggerRef,
      ...rest
    } = this.props;
    const boxProps = computeBoxProps(rest);
    return (
      <Fragment>
        {this.childrenHopper && (
          <Box>
            Test
          </Box>
        )}
        {triggerRef && (
          { children }
        )}
        {!triggerRef && (
          <div
            style={{
              'display': 'inline-block',
            }}
            ref={this.childrenHolder}>
            {children}
          </div>
        )}
        {this.state.tooltipEnabled && (
          <Portal>
            <div
              className="Tooltip"
              ref={this.tooltip}>
              {content}
            </div>
          </Portal>
        )}
      </Fragment>
    );
  }
}

class TooltipOverflow extends Component {
  constructor(props) {
    super(props);
    this.overflowed = false;
  }


  render() {
    const {
      className,
      content,
      children,
      ...rest
    } = this.props;
    const boxProps = computeBoxProps(rest);
    return (
      <span
        ref={this.span}
        className="TooltipOverflow"
        {...boxProps}>
        {!!this.disablePopper && (
          <Tooltip
            content={content} />
        )}
        {children}
      </span>
    );
  }
}

Tooltip.Overflow = TooltipOverflow;
