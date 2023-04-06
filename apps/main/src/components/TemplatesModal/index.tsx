/* eslint-disable max-len */
import type { ReactNode } from 'react';
import { useState } from 'react';
import { Button, createStyles, Divider, Group, Modal, rem, ScrollArea, Stack, Text, TextInput, Title, UnstyledButton } from '@mantine/core';
import { IconSearch } from '@tabler/icons';
import type { Feature } from 'models';
import { templatesList, templatesMap } from 'templates';
import { RenderIf } from 'ui';

interface Props {
  opened: boolean;
  onSelect: (template: string) => void;
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

const mockSelectedProducts = [
  {'id':'prod_NRrvBSQC0ZoHY7',object:'product','active':true,'attributes':[],'created':1677709893,'default_price':'price_1Mix29JIZhxRN8vVWAiQKwWu','description':'Basic plan description','images':[],'livemode':false,'metadata':{},'name':'Basic Plan','package_dimensions':null,'shippable':null,'statement_descriptor':null,'tax_code':null,'type':'service','unit_label':null,'updated':1678621196,'url':null,'prices':[{'id':'price_1Mix29JIZhxRN8vVWAiQKwWu','object':'price','active':true,'billing_scheme':'per_unit','created':1678182133,'currency':'gbp','custom_unit_amount':null,'livemode':false,'lookup_key':null,'metadata':{},'nickname':null,'product':'prod_NRrvBSQC0ZoHY7','recurring':{'aggregate_usage':null,'interval':'month','interval_count':1,'trial_period_days':null,'usage_type':'licensed'},'tax_behavior':'unspecified','tiers_mode':null,'transform_quantity':null,'type':'recurring','unit_amount':1000,'unit_amount_decimal':'1000'}],'features':[]},
  {'id':'prod_NRrvLHLkz1aSdI','object':'product','active':true,'attributes':[],'created':1677709939,'default_price':'price_1Mix3QJIZhxRN8vVmiM3xH4p','description':'Premium plan description','images':[],'livemode':false,'metadata':{},'name':'Premium Plan','package_dimensions':null,'shippable':null,'statement_descriptor':null,'tax_code':null,'type':'service','unit_label':null,'updated':1678621159,'url':null,'prices':[{'id':'price_1Mix3QJIZhxRN8vVmiM3xH4p','object':'price','active':true,'billing_scheme':'per_unit','created':1678182212,'currency':'gbp','custom_unit_amount':null,'livemode':false,'lookup_key':null,'metadata':{},'nickname':null,'product':'prod_NRrvLHLkz1aSdI','recurring':{'aggregate_usage':null,'interval':'month','interval_count':1,'trial_period_days':null,'usage_type':'licensed'},'tax_behavior':'unspecified','tiers_mode':null,'transform_quantity':null,'type':'recurring','unit_amount':2500,'unit_amount_decimal':'2500'}],'features':[]},
  {'id':'prod_NRrwPguKtyHVRl','object':'product','active':true,'attributes':[],'created':1677709991,'default_price':'price_1Mix3vJIZhxRN8vV7cvEddpk','description':'Enterprise Plan description','images':[],'livemode':false,'metadata':{},'name':'Enterprise Plan','package_dimensions':null,'shippable':null,'statement_descriptor':null,'tax_code':null,'type':'service','unit_label':null,'updated':1678182255,'url':null,'prices':[{'id':'price_1Mix3vJIZhxRN8vV7cvEddpk','object':'price','active':true,'billing_scheme':'per_unit','created':1678182243,'currency':'gbp','custom_unit_amount':null,'livemode':false,'lookup_key':null,'metadata':{},'nickname':null,'product':'prod_NRrwPguKtyHVRl','recurring':{'aggregate_usage':null,'interval':'month','interval_count':1,'trial_period_days':null,'usage_type':'licensed'},'tax_behavior':'unspecified','tiers_mode':null,'transform_quantity':null,'type':'recurring','unit_amount':5000,'unit_amount_decimal':'5000'}],'features':[]},
];

const mockFeatures: Feature[] = [
  { id: '1', 'name':'Unlimited private repos', type: 'boolean','products':[{ id: 'prod_NRrvBSQC0ZoHY7', value: true },{ id: 'prod_NRrvLHLkz1aSdI', value: true },{ id: 'prod_NRrwPguKtyHVRl', value: true }]},
  { id: '2', 'name':'Jira software integration', type: 'boolean','products':[{ id: 'prod_NRrvBSQC0ZoHY7', value: false },{ id: 'prod_NRrvLHLkz1aSdI', value: true },{ id: 'prod_NRrwPguKtyHVRl', value: true }]},
  {id: '3', 'name':'Required merge checks', type: 'boolean','products':[{ id: 'prod_NRrvBSQC0ZoHY7', value: false },{ id: 'prod_NRrvLHLkz1aSdI', value: false },{ id: 'prod_NRrwPguKtyHVRl', value: true }]},
  {id: '4', 'name':'IP Whitelisting', type: 'boolean','products':[{ id: 'prod_NRrvBSQC0ZoHY7', value: false },{ id: 'prod_NRrvLHLkz1aSdI', value: false },{ id: 'prod_NRrwPguKtyHVRl', value: true }]},
];

export default function TemplatesModal(props: Props) {
  const { opened, onSelect, onClose } = props;

  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const Template = selectedTemplate ? templatesMap[selectedTemplate] : () => null;

  console.log(Template);

  const { classes, cx } = useStyles();

  return (
    <Modal
      transitionProps={{ transition: 'fade', duration: 200 }}
      size="80%"
      opened={opened}
      onClose={onClose}
      title={<Title order={3}>Choose a template</Title>}
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
            <Button onClick={() => onSelect('s')}>Select</Button>
          </Group>
        </Stack>
      </Group>
    </Modal>
  );
}
