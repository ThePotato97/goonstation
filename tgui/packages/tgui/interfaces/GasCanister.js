import { useBackend } from '../backend';
import { Component, createPortal } from 'inferno';
import { classes } from "common/react";
import { Divider, Box, Section, Flex } from '../components';
import { Window } from '../layouts';
import { PaperSheetView } from './PaperSheet';
import { PortableBasicInfo, PortableHoldingTank } from './common/PortableAtmos';
import { ReleaseValve } from './common/ReleaseValve';
import { Detonator } from './GasCanister/Detonator';

export const GasCanister = (props, context) => {
  const { act, data } = useBackend(context);

  const {
    connected,
    holding,
    hasValve,
    valveIsOpen,
    pressure,
    maxPressure,
    releasePressure,
    minRelease,
    maxRelease,
    detonator,
    detonatorAttachments,
    hasPaper,
  } = data;

  const handleSetPressure = releasePressure => {
    act("set-pressure", {
      releasePressure,
    });
  };

  const handleToggleValve = () => {
    act("toggle-valve");
  };

  const handleEjectTank = () => {
    act("eject-tank");
  };

  const handleWireInteract = (toolAction, index) => {
    act("wire-interact", {
      index,
      toolAction,
    });
  };

  const handleToggleAnchor = () => {
    act("anchor");
  };

  const handleToggleSafety = () => {
    act("safety");
  };

  const handlePrimeDetonator = () => {
    act("prime");
  };

  const handleTriggerActivate = () => {
    act("trigger");
  };

  const handleSetTimer = newTime => {
    act("timer", {
      newTime,
    });
  };

  const hasDetonator = !!(detonator);

  return (
    <Window
      resizable
      width={hasDetonator ? hasPaper ? 880 : 550 : 400}
      height={hasDetonator ? 680 : 370}>
      <Window.Content>
        <Flex>
          <Flex.Item width={120}>
            <PortableBasicInfo
              connected={connected}
              pressure={pressure}
              maxPressure={maxPressure}>
              <Divider />
              {
                hasValve
                  ? (
                    <ReleaseValve
                      valveIsOpen={valveIsOpen}
                      releasePressure={releasePressure}
                      minRelease={minRelease}
                      maxRelease={maxRelease}
                      onToggleValve={handleToggleValve}
                      onSetPressure={handleSetPressure} />
                  )
                  : (
                    <Box
                      color="average">The release valve is missing.
                    </Box>
                  )
              }
            </PortableBasicInfo>
            {
              detonator
                ? (
                  <Detonator
                    detonator={detonator}
                    detonatorAttachments={detonatorAttachments}
                    onToggleAnchor={handleToggleAnchor}
                    onToggleSafety={handleToggleSafety}
                    onWireInteract={handleWireInteract}
                    onPrimeDetonator={handlePrimeDetonator}
                    onTriggerActivate={handleTriggerActivate}
                    onSetTimer={handleSetTimer} />
                )
                : (
                  <PortableHoldingTank
                    holding={holding}
                    onEjectTank={handleEjectTank} />
                )
            }
          </Flex.Item>
          {hasPaper && (
            <Flex.Item width={100}>
              <PaperView />
            </Flex.Item>
          )}
        </Flex>
      </Window.Content>
    </Window>
  );
};

class PaperView extends Component {
  constructor(props, context) {
    super(props);
    this.el = document.createElement('div');
  }

  render() {
    const { act, data } = useBackend(this.context);
    const {
      text,
      stamps,
    } = data.paperData;
    return (
      <Section
        scrollable
        width={'400px'} height={'518px'}
        backgroundColor="white"
        style={{ 'overflow-wrap': 'break-word' }}>
        <PaperSheetView
          width={'400'}
          height={'500'}
          value={text}
          stamps={stamps}
          readOnly />
      </Section>
    );
  }
}

