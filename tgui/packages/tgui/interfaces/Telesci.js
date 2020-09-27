import { useBackend, useSharedState, useLocalState } from '../backend';
import { Button, Flex, LabeledList, ProgressBar, Section, Slider, NoticeBox, Box, Input } from '../components';
import { Window } from '../layouts';
import { Fragment } from 'inferno';
import { clamp } from 'common/math';

const Types = {
  Danger: 'danger',
  Info: 'info',
  Success: 'success',
};

export const TypedNoticeBox = props => {
  const {
    type,
    ...rest
  } = props;
  const typeProps = {
    ...(type === Types.Danger ? { danger: true } : {}),
    ...(type === Types.Info ? { info: true } : {}),
    ...(type === Types.Success ? { success: true } : {}),
  };
  return <NoticeBox {...typeProps} {...rest} />;
};

TypedNoticeBox.Types = Types;

export const Telesci = (props, context) => {
  const { data } = useBackend(context);
  const {
    apcCellCurrentCharge,
    maxCharge,
    readout,
    apcExists,
    apcName,
  } = data;

  const strings = [
    { 'readout': 'No atmosphere.', 'status': 'warning' },
    { 'readout': 'Teleportation prevented by interference.', 'status': 'danger' },
    { 'readout': 'OK', 'status': 'success' },
    { 'readout': 'Scan Results:', 'status': 'info' },
    { 'readout': 'Invalid coordinates', 'status': 'danger' },
  ];
  const status = strings.find(string => readout.includes(string.readout)) || "success";
  return (
    <Window
      width={295}
      height={530}
      theme={'ntos'}>
      <Window.Content>
        {!!apcExists && (
          <Section mb={0} title={apcName}>
            <ProgressBar
              maxValue={maxCharge}
              minValue={0}
              value={apcCellCurrentCharge}
              ranges={{
                good: [0.5, Infinity],
                average: [0.15, 0.5],
                bad: [-Infinity, 0.15],
              }} />
          </Section>
        )}
        <Box height="70px">
          {!!readout && (
            <TypedNoticeBox
              height="70px"
              type={status.status}>
              <Box
                align="center"
                style={{
                  position: 'relative', left: '50%', top: '50%',
                  transform: 'translate(-50%, -50%)',
                }}>
                {readout.split('<br>').map(string => (
                  <Box
                    key={string}>{string}
                  </Box>
                ))}
              </Box>
            </TypedNoticeBox>
          )}
        </Box>
        <CoordinateInput />
        <TeleportButtons />
        <Bookmarks />
      </Window.Content>
    </Window>
  );
};


export const CoordinateInput = (props, context) => {
  const { act } = useBackend(context);
  const [xTarget, setxTarget] = useSharedState(context, 'xTarget', 0);
  const [yTarget, setyTarget] = useSharedState(context, 'yTarget', 0);
  const [zTarget, setzTarget] = useSharedState(context, 'zTarget', 0);
  const [, setUpdateCoords] = useSharedState(context, 'updateCoords', true);

  const coords = [
    { 'label': 'X', 'coord': xTarget, 'setCoord': setxTarget, 'maxCoord': 500 },
    { 'label': 'Y', 'coord': yTarget, 'setCoord': setyTarget, 'maxCoord': 500 },
    { 'label': 'Z', 'coord': zTarget, 'setCoord': setzTarget, 'maxCoord': 14 },
  ];

  return (
    <Section title="Coordinates">
      <LabeledList>
        {coords.map(item => (
          <LabeledList.Item key={item.label} label={item.label}>
            <Flex className="TeleSci-Flex">
              <Flex.Item inline className="TeleSci-CoordinateButtonHolder">
                {item.label !== 'Z' && (
                  <Button
                    className="TeleSci-CoordinateButtons"
                    icon="fast-backward"
                    onClick={() =>
                    { item.setCoord(
                      (clamp((item.coord - 10), 0, item.maxCoord)));
                    setUpdateCoords(true);
                    act("click"); }} />
                )}
                <Button
                  className="TeleSci-CoordinateButtons"
                  icon="backward"
                  onClick={() =>
                  { item.setCoord(
                    (clamp((item.coord - 1), 0, item.maxCoord)));
                  setUpdateCoords(true);
                  act("click"); }} />
              </Flex.Item>
              <Flex.Item inline width="90px" px={1} className="TeleSci-CoordinateButtonHolder">
                <Slider
                  minValue={0}
                  maxValue={item.maxCoord}
                  value={item.coord}
                  fillValue={0}
                  step={1}
                  stepPixelSize={(item.label === "Z") ? 10 : 4}
                  onChange={() =>
                  { act("click"); }}
                  onDrag={(e, value) => { item.setCoord(
                    clamp((value),
                      1, item.maxCoord));
                  setUpdateCoords(true); }} />
              </Flex.Item>
              <Flex.Item inline className="TeleSci-CoordinateButtonHolder">
                <Button
                  className="TeleSci-CoordinateButtons"
                  icon="forward"
                  onClick={() =>
                  { item.setCoord(
                    (clamp((item.coord + 1), 0, item.maxCoord)));
                  setUpdateCoords(true);
                  act("click"); }} />
                {item.label !== 'Z' && (
                  <Button
                    className="TeleSci-CoordinateButtons"
                    icon="fast-forward"
                    onClick={() =>
                    { item.setCoord(
                      (clamp((item.coord + 10), 0, item.maxCoord)));
                    setUpdateCoords(true);
                    act("click"); }} />
                )}
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
      <Flex className="TeleSci-TeleButtons-Flex">
        {teleButtons.map(button => (
          <Flex.Item key={button} className="TeleSci-TeleButtons-FlexItems">
            <Button
              className="TeleSci-TeleButtons"
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
          </Flex.Item>
        ))}
      </Flex>
    </Section>
  );
};

export const Bookmarks = (props, context) => {
  const { act, data } = useBackend(context);
  const [xTarget, setxTarget] = useSharedState(context, 'xTarget', 1);
  const [yTarget, setyTarget] = useSharedState(context, 'yTarget', 1);
  const [zTarget, setzTarget] = useSharedState(context, 'zTarget', 1);
  const [bookmarkName, setBookmarkName] = useLocalState(context, 'groupName', "");

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
              value={bookmarkName}
              onInput={(e, value) => setBookmarkName(value)} />
            <Button
              icon="plus-circle"
              lineHeight={1.75}
              onClick={() => {
                act("bookmark", {
                  'bmtitle': bookmarkName,
                  'xTarget': xTarget,
                  'yTarget': yTarget,
                  'zTarget': zTarget });
                setBookmarkName("");
              }}>
              Add
            </Button>
          </Box>
        )} />
      <Section
        height="132px"
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
                  className="TeleSci-TeleButtons"
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
