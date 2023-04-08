/* eslint-disable max-len */
import type { ReactNode } from 'react';
import { Fragment, useState } from 'react';
import { Button, createStyles, Divider, Group, Modal, rem, ScrollArea, Stack, Text, TextInput, Title, UnstyledButton } from '@mantine/core';
import { IconSearch } from '@tabler/icons';
import type { FormFeature } from 'models';
import { templatesList, templatesMap } from 'templates';
import { RenderIf } from 'ui';
import { mockFeatures, mockSelectedProducts } from 'helpers';

interface Props {
  opened: boolean;
  loading: boolean;
  onSelect: (template: string) => Promise<any>;
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

const TemplatePreview = ({ children }: { children: ReactNode }) => (
  <div style={{ position: 'relative', transform: 'scale(1)' }}>
    {children}
    <div onClick={(e) => e.stopPropagation()} style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }} />
  </div>
);

function TemplatesModal(props: Props) {
  const { loading, onSelect, onClose } = props;

  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const Template = selectedTemplate ? templatesMap[selectedTemplate] : () => null;

  const { classes, cx } = useStyles();

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
                <TemplatePreview>
                  {/* @ts-ignore */}
                  <Template
                    features={mockFeatures}
                    products={mockSelectedProducts}
                    recommended="prod_NRrvLHLkz1aSdI"
                    color="teal"
                    subscribeLabel="Subscribe"
                    freeTrialLabel="Start free trial"
                    callbacks={[
                      { env: 'development', url: '' },
                      { env: 'production', url: '' },
                    ]}
                  />
                </TemplatePreview>
              </RenderIf>
            </Stack>
          </ScrollArea>
          <Group mt="auto" position="right">
            <Button
              loading={loading}
              disabled={!selectedTemplate}
              onClick={() => onSelect(selectedTemplate!)}
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
