import { Button, createStyles, Select, Stack, Table, Text, TextInput, rem, ActionIcon, ScrollArea } from '@mantine/core';
import type { DropResult } from 'react-beautiful-dnd';
import { DragDropContext, Draggable } from 'react-beautiful-dnd';
import { IconGripVertical, IconTrash } from '@tabler/icons';
import type { Feature, FeatureType, FeatureValue, FormProduct } from 'models';

import FeatureInput from './FeatureInput';
import CustomDroppable from './CustomDroppable';

interface Props {
  products: FormProduct[];
  features: Feature[];
  onAddNew: () => void;
  onDelete: (featureIndex: number) => void;
  onFeatureLabelUpdate: (featureIndex: number, nextLabel: string) => void;
  onFeatureTypeChange: (featureIndex: number, nextType: FeatureType) => void;
  onFeatureValueChange: (featureIndex: number, productId: string, nextValue: FeatureValue) => void;
  onFeatureReorder: (result: DropResult) => void;
}

const useStyles = createStyles((theme) => ({
  draggingRow: {
    display: 'table',
  },
  dragHandle: {
    ...theme.fn.focusStyles(),
    width: rem(40),
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    color: theme.colorScheme === 'dark' ? theme.colors.dark[1] : theme.colors.gray[6],
  },
}));

const resolveFeatureValue = (feature: Feature, prodId: string) => {
  const prod = feature.products.find((prod) => prod.id === prodId);

  if (!prod) {
    return feature.type === 'boolean' ? false : '';
  }
  return prod.value;
};

const featureTypeOptions: { label: string; value: FeatureType }[] = [
  { label: 'Check', value: 'boolean' },
  { label: 'Text', value: 'string' },
  { label: 'Compose', value: 'compose' },
];

export default function FeaturesForm(props: Props) {
  const {
    products,
    features,
    onAddNew,
    onDelete,
    onFeatureLabelUpdate,
    onFeatureTypeChange,
    onFeatureValueChange,
    onFeatureReorder,
  } = props;

  const { classes, cx } = useStyles();

  if (products.length === 0) {
    return (
      <Stack mx="auto" pt="xl" style={{ minWidth: '90%' }}>
        <Text>Features</Text>
        <Text mb="xl">Please add products first</Text>
      </Stack>
    );
  }

  if (features.length === 0) {
    return (
      <Stack mx="auto" pt="xl" style={{ minWidth: '90%' }}>
        <Text>Features</Text>
        <Text color="dimmed" mb="xl">No features added yet</Text>
        <Button mr="auto" onClick={onAddNew}>Add new feature</Button>
      </Stack>
    );
  }

  const ths = products.map((prod) => (
    <th key={prod.id} style={{ width: rem(200) }}>{prod.name}</th>
  ));

  const rows = features.map((feat, index) => {
    const productsCheck = products.map((prod) => {
      const value = resolveFeatureValue(feat, prod.id);
      return (
        <td key={prod.id} style={{ width: rem(200) }}>
          <FeatureInput type={feat.type} value={value} onChange={(value) => onFeatureValueChange(index, prod.id, value)} />
        </td>
      )
    });
    return (
      <Draggable key={feat.id} index={index} draggableId={feat.id}>
        {(provided, snapshot) => (
          <tr
            key={feat.id}
            className={cx({ [classes.draggingRow]: snapshot.isDragging })}
            ref={provided.innerRef}
            {...provided.draggableProps}
          >
            <td style={{ width: rem(40) }}>
              <div className={classes.dragHandle} {...provided.dragHandleProps}>
                <IconGripVertical size="1.05rem" stroke={1.5} />
              </div>
            </td>
            <td style={{ width: rem(360) }}>
              <TextInput value={feat.name} onChange={(e) => onFeatureLabelUpdate(index, e.target.value)} />
            </td>
            <td style={{ width: rem(200) }}>
              <Select
                data={featureTypeOptions}
                value={feat.type}
                onChange={(value: string) => onFeatureTypeChange(index, value as FeatureType)}
              />
            </td>
            {productsCheck}
            <td style={{ width: rem(60) }}>
              <ActionIcon style={{ float: 'right' }} onClick={() => onDelete(index)}>
                <IconTrash size={18} />
              </ActionIcon>
            </td>
          </tr>
        )}
      </Draggable>
    )
  });
  return (
    <Stack mx="auto" pt="xl" style={{ width: '100%' }}>
      <Text mb="xl">Features</Text>
      <ScrollArea type="scroll" scrollbarSize={6} style={{ width: '100%', paddingBottom: '160px' }}>
        <DragDropContext onDragEnd={onFeatureReorder}>
          <Table style={{ tableLayout: 'fixed' }}>
            <thead>
              <tr>
                <th style={{ width: rem(40) }} />
                <th style={{ width: rem(360) }}>Feature</th>
                <th style={{ width: rem(200) }}>Type</th>
                {ths}
                <th style={{ width: rem(60) }} />
              </tr>
            </thead>
            <CustomDroppable droppableId="dnd-list" direction="vertical">
              {(provided) => (
                <tbody {...provided.droppableProps} ref={provided.innerRef}>
                  {rows}
                  {provided.placeholder}
                </tbody>
              )}
            </CustomDroppable>
          </Table>
        </DragDropContext>
      </ScrollArea>
      <Button variant="filled" mr="auto" onClick={onAddNew}>
        Add new feature
      </Button>
    </Stack>
  );
}
