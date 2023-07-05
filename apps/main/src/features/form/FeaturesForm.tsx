import { DragDropContext, Draggable } from 'react-beautiful-dnd';
import { IconGripVertical, IconTrash } from '@tabler/icons-react';
import type { FeatureType, FormFeature } from '@dealo/models';

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
import { Button } from 'components/ui/button';
import { Input } from 'components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from 'components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from 'components/ui/select';

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

  if (selectedProducts.length === 0) {
    return (
      <div className="flex flex-col mx-auto mt-6 min-w-[90%]">
        <span className="text">Features</span>
        <span className="mb-4">Please add products first</span>
      </div>
    );
  }

  if (features.length === 0) {
    return (
      <div className="flex flex-col mx-auto pt-6 min-w-[90%]">
        <span className="text">Features</span>
        <span className="text text-muted-foreground mb-6">No features added yet</span>
        <Button className="mr-auto" onClick={addNewFeature}>Add new feature</Button>
      </div>
    );
  }

  const rows = features.map((feat, index) => {
    const productsCheck = selectedProducts.map((prod) => {
      const value = resolveFeatureValue(feat, prod.id);
      return (
        <TableCell key={prod.id} className="w-[220px]">
          <FeatureInput type={feat.type} value={value} onChange={(value) => changeFeatureValue(index, prod.id, value)} />
        </TableCell>
      )
    });
    return (
      <Draggable key={feat.id} index={index} draggableId={feat.id}>
        {(provided, snapshot) => (
          <TableRow
            key={feat.id}
            ref={provided.innerRef}
            {...provided.draggableProps}
            className={snapshot.isDragging ? 'table' : ''}
          >
            <TableCell className="w-[80px]">
              <div className="flex items-center justify-center h-full w-[80px]" {...provided.dragHandleProps}>
                <IconGripVertical size="1.05rem" stroke={1.5} />
              </div>
            </TableCell>
            <TableCell className="w-[380px]">
              <Input value={feat.name} onChange={(e) => changeFeatureName(index, e.target.value)} />
            </TableCell>
            <TableCell className="w-[120px]">
              <Select value={feat.type} onValueChange={(value: string) => changeFeatureType(index, value as FeatureType)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {featureTypeOptions.map((option) => (
                    <SelectItem value={option.value} key={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </TableCell>
            {productsCheck}
            <TableCell className="w-[120px]">
              <Button variant="secondary" style={{ float: 'right' }} onClick={() => removeFeature(index)}>
                <IconTrash size={18} />
              </Button>
            </TableCell>
          </TableRow>
        )}
      </Draggable>
    )
  });
  return (
    <div className="flex flex-col mx-auto px-6 w-full">
      <span className="text mb-6">Features</span>
      <DragDropContext onDragEnd={reorderFeatures}>
        <Table style={{ tableLayout: 'fixed' }}>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]" />
              <TableHead className="w-[120px]">Feature</TableHead>
              <TableHead className="w-[320px]">Type</TableHead>
              {selectedProducts.map((prod) => (
                <TableHead key={prod.id} className="w-[220px]">{prod.name}</TableHead>
              ))}
              <TableHeader className="w-[120px]" />
            </TableRow>
          </TableHeader>
          <CustomDroppable droppableId="dnd-list" direction="vertical">
            {(provided) => (
              <TableBody {...provided.droppableProps} ref={provided.innerRef}>
                {rows}
                {provided.placeholder}
              </TableBody>
            )}
          </CustomDroppable>
        </Table>
      </DragDropContext>
      <Button className="mr-auto mt-24" onClick={addNewFeature}>
        Add new feature
      </Button>
    </div>
  );
}
