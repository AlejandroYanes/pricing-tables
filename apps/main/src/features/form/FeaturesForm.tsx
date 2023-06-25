import { ActionIcon, Button, createStyles, rem, ScrollArea, Select, Stack, Table, Text, TextInput } from '@mantine/core';
import { DragDropContext, Draggable } from 'react-beautiful-dnd';
import { IconGripVertical, IconTrash } from '@tabler/icons-react';
import type { FeatureType, FormFeature } from 'models';

import FeatureInput from './FeatureInput';
import CustomDroppable from './CustomDroppable';
import { useWidgetFormStore } from './state';
import {
  addNewFeature,
  changeFeatureName,
  changeFeatureType,
  changeFeatureValue,
  removeFeature,
  reorderFeatures,
} from './state/actions';

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

const resolveFeatureValue = (feature: FormFeature, prodId: string) => {
  const prod = feature.products.find((prod) => prod.id === prodId)!;
  return prod.value;
};

const featureTypeOptions: { label: string; value: FeatureType }[] = [
  { label: 'Check', value: 'boolean' },
  { label: 'Text', value: 'string' },
  { label: 'Compose', value: 'compose' },
];

export default function FeaturesForm() {
  const { products: selectedProducts, features } = useWidgetFormStore();

  const { classes, cx } = useStyles();

  if (selectedProducts.length === 0) {
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
        <Button mr="auto" onClick={addNewFeature}>Add new feature</Button>
      </Stack>
    );
  }

  const ths = selectedProducts.map((prod) => (
    <th key={prod.id} style={{ width: rem(200) }}>{prod.name}</th>
  ));

  const rows = features.map((feat, index) => {
    const productsCheck = selectedProducts.map((prod) => {
      const value = resolveFeatureValue(feat, prod.id);
      return (
        <td key={prod.id} style={{ width: rem(200) }}>
          <FeatureInput type={feat.type} value={value} onChange={(value) => changeFeatureValue(index, prod.id, value)} />
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
              <TextInput value={feat.name} onChange={(e) => changeFeatureName(index, e.target.value)} />
            </td>
            <td style={{ width: rem(200) }}>
              <Select
                data={featureTypeOptions}
                value={feat.type}
                onChange={(value: string) => changeFeatureType(index, value as FeatureType)}
              />
            </td>
            {productsCheck}
            <td style={{ width: rem(60) }}>
              <ActionIcon style={{ float: 'right' }} onClick={() => removeFeature(index)}>
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
        <DragDropContext onDragEnd={reorderFeatures}>
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
      <Button variant="filled" mr="auto" onClick={addNewFeature}>
        Add new feature
      </Button>
    </Stack>
  );
}
