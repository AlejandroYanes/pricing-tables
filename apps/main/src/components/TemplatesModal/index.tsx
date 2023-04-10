/* eslint-disable max-len */
import { useState } from 'react';
import { Button, createStyles, Divider, Group, Modal, rem, ScrollArea, Stack, Text, TextInput, UnstyledButton } from '@mantine/core';
import { IconSearch } from '@tabler/icons';
import { skeletonMap, templatesList } from 'templates';
import { RenderIf } from 'ui';

interface Props {
  opened: boolean;
  loading: boolean;
  onSelect: (values: { name: string; template: string }) => any;
  onClose: () => void;
}

const useStyles = createStyles((theme) => ({
  mainLink: {
    display: 'flex',
    alignItems: 'center',
    width: '100%',
    fontSize: theme.fontSizes.xs,
    padding: `${rem(8)} ${theme.spacing.xs}`,
    borderRadius: theme.radius.sm,
    border: `1px solid transparent`,
    fontWeight: 500,
    color: theme.colorScheme === 'dark' ? theme.colors.dark[0] : theme.colors.gray[7],

    '&:hover': {
      backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[6] : theme.colors.gray[0],
      color: theme.colorScheme === 'dark' ? theme.white : theme.black,
    },
  },
  selectedLink: {
    borderColor: theme.colors.teal[5],
  },
}));

function TemplatesModal(props: Props) {
  const { loading, onSelect, onClose } = props;

  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [name, setName] = useState('');
  const [showError, setShowError] = useState(false);

  const Skeleton = selectedTemplate ? skeletonMap[selectedTemplate] : () => null;

  const { classes, cx } = useStyles();

  const handleSelect = () => {
    if (!name) {
      setShowError(true);
      return;
    }
    onSelect({ name, template: selectedTemplate! });
  };

  return (
    <Modal
      transitionProps={{ transition: 'fade', duration: 200 }}
      size="80%"
      opened
      onClose={onClose}
      title={<Text size="lg" weight="bold">Choose a template</Text>}
    >
      <Group align="stretch" style={{ height: '600px' }}>
        <Stack style={{ width: '220px', minHeight: '220px', flexShrink: 0 }}>
          <TextInput
            placeholder="Search"
            size="xs"
            mb="md"
            icon={<IconSearch size="0.8rem" stroke={1.5} />}
            rightSectionWidth={70}
          />
          {templatesList.map((template) => (
            <UnstyledButton
              key={template.id}
              className={cx(classes.mainLink, { [classes.selectedLink]: selectedTemplate === template.id })}
              onClick={() => setSelectedTemplate(template.id)}
            >
              <Text>{template.name}</Text>
            </UnstyledButton>
          ))}
        </Stack>
        <Divider orientation="vertical" />
        <Stack style={{ flex: 1 }}>
          <ScrollArea style={{ flex: 1 }}>
            <Stack align="center">
              <RenderIf condition={selectedTemplate !== null}>
                {/* @ts-ignore */}
                <Skeleton scale={0.8} />
              </RenderIf>
            </Stack>
          </ScrollArea>
          <Group mt="auto" position="right" align="flex-end">
            <TextInput
              label="Name"
              value={name}
              error={showError}
              disabled={!selectedTemplate || loading}
              onChange={(e) => {
                setName(e.target.value);
                setShowError(false);
              }}
            />
            <Button
              loading={loading}
              disabled={!selectedTemplate}
              onClick={handleSelect}
            >
              Select
            </Button>
          </Group>
        </Stack>
      </Group>
    </Modal>
  );
}

export default function Wrapper(props: Props) {
  if (props.opened) {
    return <TemplatesModal {...props} />;
  }

  return null;
}
