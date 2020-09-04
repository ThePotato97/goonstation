import { useBackend } from '../backend';
import { Button, Flex, LabeledList, ProgressBar, Section, Slider, NoticeBox } from '../components';
import { Window } from '../layouts';

export const Telesci = (props, context) => {
  const { data } = useBackend(context);
  const APCNotExist = Boolean(data.APCNotExist);
  const {
    APCCellCurrentCharge,
    MaxCharge,
    readout,
  } = data;

  return (
    <Window
      width={340}
      height={560}
      theme={'ntos'}>
      <Window.Content>
        {!!readout && (
          <NoticeBox info>
            {readout}
          </NoticeBox>
        )}
        <Section title="Local APC Power">
          <ProgressBar
            maxValue={MaxCharge}
            minValue={0}
            value={APCCellCurrentCharge}
            ranges={{
              good: [0.5, Infinity],
              average: [0.15, 0.5],
              bad: [-Infinity, 0.15],
            }} />
        </Section>

        <CoordinateInput />
        <TeleportButtons />
        <Bookmarks />
      </Window.Content>
    </Window>
  );
};


export const CoordinateInput = (props, context) => {
  const { act, data } = useBackend(context);
  const {
    xtarget,
    ytarget,
    ztarget,
  } = data;

  return (
    <Section title="Coordinates">
      <LabeledList>
        <LabeledList.Item label="X">
          <Flex inline width="100%">
            <Flex.Item>
              <Button
                icon="fast-backward"
                disabled={xtarget === 0}
                onClick={() => act('changecoord', {
                  axis: 'xtarget',
                  setto: xtarget - 10,
                })} />
              <Button
                icon="backward"
                disabled={xtarget === 0}
                onClick={() => act('changecoord', {
                  axis: 'xtarget',
                  setto: xtarget - 1,
                })} />
            </Flex.Item>
            <Flex.Item grow={1} mx={1}>
              <Slider
                value={xtarget}
                fillValue={0}
                step={5}
                stepPixelSize={4}
                onDrag={(e, value) => act('changecoord', {
                  axis: 'xtarget',
                  setto: value,
                })} />
            </Flex.Item>
            <Flex.Item>
              <Button
                icon="forward"
                disabled={xtarget===500}
                onClick={() => act('changecoord', {
                  axis: 'xtarget',
                  setto: xtarget + 1,
                })} />
              <Button
                icon="fast-forward"
                disabled={xtarget===500}
                onClick={() => act('changecoord', {
                  axis: 'xtarget',
                  setto: xtarget + 10,
                })} />
            </Flex.Item>
          </Flex>
        </LabeledList.Item>
        <LabeledList.Item label="Y">
          <Flex inline width="100%">
            <Flex.Item>
              <Button
                icon="fast-backward"
                disabled={ytarget === 0}
                onClick={() => act('changecoord', {
                  axis: 'ytarget',
                  setto: ytarget - 10,
                })} />
              <Button
                icon="backward"
                disabled={ytarget === 0}
                onClick={() => act('changecoord', {
                  axis: 'ytarget',
                  setto: ytarget - 1,
                })} />
            </Flex.Item>
            <Flex.Item grow={1} mx={1}>
              <Slider
                value={ytarget}
                fillValue={0}
                step={5}
                stepPixelSize={4}
                onDrag={(e, value) => act('changecoord', {
                  axis: 'ytarget',
                  setto: value,
                })} />
            </Flex.Item>
            <Flex.Item>
              <Button
                icon="forward"
                disabled={xtarget===500}
                onClick={() => act('changecoord', {
                  axis: 'ytarget',
                  setto: ytarget + 1,
                })} />
              <Button
                icon="fast-forward"
                disabled={xtarget===500}
                onClick={() => act('changecoord', {
                  axis: 'ytarget',
                  setto: ytarget + 10,
                })} />
            </Flex.Item>
          </Flex>
        </LabeledList.Item>
        <LabeledList.Item label="Z">
          <Flex inline width="100%">
            <Flex.Item>
              <Button
                icon="fast-backward"
                disabled={ztarget === 0}
                onClick={() => act('changecoord', {
                  axis: 'ztarget',
                  setto: ztarget - 10,
                })} />
              <Button
                icon="backward"
                disabled={ztarget === 0}
                onClick={() => act('changecoord', {
                  axis: 'ztarget',
                  setto: ztarget - 1,
                })} />
            </Flex.Item>
            <Flex.Item grow={1} mx={1}>
              <Slider
                value={ztarget}
                fillValue={0}
                step={5}
                stepPixelSize={4}
                onDrag={(e, value) => act('changecoord', {
                  axis: 'ztarget',
                  setto: value,
                })} />
            </Flex.Item>
            <Flex.Item>
              <Button
                icon="forward"
                disabled={ztarget===500}
                onClick={() => act('changecoord', {
                  axis: 'ztarget',
                  setto: ztarget + 1,
                })} />
              <Button
                icon="fast-forward"
                disabled={ztarget===500}
                onClick={() => act('changecoord', {
                  axis: 'ztarget',
                  setto: ztarget + 10,
                })} />
            </Flex.Item>
          </Flex>
        </LabeledList.Item>
      </LabeledList>
    </Section>
  );
};

export const TeleportButtons = (props, context) => {
  const { act } = useBackend(context);

  return (
    <Section>
      <Button
        onClick={() => act('tele', {
          teleaction: 'send',
        })}>
        Send
      </Button>
      <Button
        onClick={() => act('tele', {
          teleaction: 'send',
        })}>
        Recieve
      </Button>
      <Button
        onClick={() => act('tele', {
          teleaction: 'portal toggle',
        })}>
        Portal Toggle
      </Button>
      <Button
        onClick={() => act('tele', {
          teleaction: 'scan',
        })}>
        Scan
      </Button>
    </Section>
  );
};

export const Bookmarks = (props, context) => {
  const { act, data } = useBackend(context);

  return (
    <Section title="Bookmarks">
      aaa
    </Section>
  );

};
