import { useBackend, useSharedState, useLocalState } from '../backend';
import { Button, Flex, LabeledList, ProgressBar, Section, Slider, NoticeBox, Box, Input } from '../components';
import { Window } from '../layouts';
import { Fragment } from 'inferno';
import { clamp } from 'common/math';

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
  const [xTarget, setxTarget] = useSharedState(context, 'xTarget', 1);
  const [yTarget, setyTarget] = useSharedState(context, 'yTarget', 1);
  const [zTarget, setzTarget] = useSharedState(context, 'zTarget', 1);
  const [updateCoords, setUpdateCoords] = useSharedState(context, 'updateCoords', true);

  const coords = [
    { 'label': 'X', 'coord': xTarget, 'setCoord': setxTarget },
    { 'label': 'Y', 'coord': yTarget, 'setCoord': setyTarget },
    { 'label': 'Z', 'coord': zTarget, 'setCoord': setzTarget },
  ];

  return (
    <Section title="Coordinates">
      <LabeledList>
        {coords.map(item => (
          <LabeledList.Item key={item.label} label={item.label}>
            <Flex inline width="100%">
              <Flex.Item>
                <Button
                  icon="fast-backward"
                  onClick={() =>
                  { item.setCoord(
                    (clamp((item.coord - 10), 1, 500)));
                  setUpdateCoords(true); }} />
                <Button
                  icon="backward"
                  onClick={() =>
                  { item.setCoord(
                    (clamp((item.coord - 1), 1, 500)));
                  setUpdateCoords(true); }} />
              </Flex.Item>
              <Flex.Item grow={1} mx={1}>
                <Slider
                  minValue={1}
                  maxValue={500}
                  value={item.coord}
                  fillValue={0}
                  step={5}
                  stepPixelSize={4}
                  onDrag={(e, value) => { item.setCoord(clamp(value, 1, 500));
                    setUpdateCoords(true); }} />
              </Flex.Item>
              <Flex.Item>
                <Button
                  icon="forward"
                  onClick={() =>
                  { item.setCoord(
                    (clamp((item.coord + 1), 1, 500)));
                  setUpdateCoords(true); }} />
                <Button
                  icon="fast-forward"
                  onClick={() =>
                  { item.setCoord(
                    (clamp((item.coord + 10), 1, 500)));
                  setUpdateCoords(true); }} />
              </Flex.Item>
            </Flex>
          </LabeledList.Item>
        ))}
      </LabeledList>
    </Section>
  );
};

export const TeleportButtons = (props, context) => {
  const { act } = useBackend(context);
  const [xTarget] = useSharedState(context, 'xTarget', 1);
  const [yTarget] = useSharedState(context, 'yTarget', 1);
  const [zTarget] = useSharedState(context, 'zTarget', 1);
  const [updateCoords, setUpdateCoords] = useSharedState(context, 'updateCoords', true);

  const teleButtons = [
    { 'teleAction': 'send' },
    { 'teleAction': 'receive' },
    { 'teleAction': 'portal toggle' },
    { 'teleAction': 'scan' },
  ];

  return (
    <Section>
      {teleButtons.map(button => (
        <Button
          key={button}
          onClick={() => { act('tele', {
            'teleAction': button.teleAction,
            'xTarget': xTarget,
            'yTarget': yTarget,
            'zTarget': zTarget,
            'updateCoords': updateCoords });
          setUpdateCoords(false);
          }}>
          {button.teleAction}
        </Button>
      ))}
    </Section>
  );
};

export const Bookmarks = (props, context) => {
  const { act, data } = useBackend(context);
  const [xTarget, setxTarget] = useSharedState(context, 'xTarget', 1);
  const [yTarget, setyTarget] = useSharedState(context, 'yTarget', 1);
  const [zTarget, setzTarget] = useSharedState(context, 'zTarget', 1);
  const [recordName, setRecordName] = useLocalState(context, 'groupName', "");

  const {
    bookmarks,
  } = data;

  return (
    <Fragment>
      <Section title="Bookmarks"
        mb={0}
        buttons={(
          <Box as="span">
            <Input
              pl={5}
              placeholder="Name"
              value={recordName}
              onInput={(e, value) => setRecordName(value)} />
            <Button
              icon="plus-circle"
              lineHeight={1.75}
              onClick={() => {
                act("bookmark", {
                  'bmtitle': recordName,
                  'xTarget': xTarget,
                  'yTarget': yTarget,
                  'zTarget': zTarget });
                setRecordName("");
              }}>
              Save
            </Button>
          </Box>
        )} />
      <Section
        height="125px"
        scrollable>
        <LabeledList>
          {bookmarks.map(bookmark => (
            <LabeledList.Item
              mt={2}
              label={`${bookmark.name} (X:${bookmark.x}
                Y:${bookmark.y} Z:${bookmark.z})`}
              key={bookmark.name}
              buttons={(
                <Button
                  onClick={() => {
                    setxTarget(bookmark.x);
                    setyTarget(bookmark.y);
                    setzTarget(bookmark.z);
                  }}>
                  Load
                </Button>
              )} />
          ))}
        </LabeledList>
      </Section>
    </Fragment>
  );

};
