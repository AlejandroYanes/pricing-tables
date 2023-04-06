import Image from 'next/image'
import { Button, Group, Modal, SimpleGrid, Title } from '@mantine/core';

interface Props {
  opened: boolean;
  onSelect: (template: string) => void;
  onClose: () => void;
}

export default function TemplatesModal(props: Props) {
  const { opened, onSelect, onClose } = props;
  return (
    <Modal size="xl" opened={opened} onClose={onClose} title={<Title order={3}>Choose a template</Title>}>
      <SimpleGrid cols={4}>
        <Image src="/images/templates/basic.png" alt="Basic" width={340} height={340} />
      </SimpleGrid>
      <Group position="right">
        <Button onClick={() => onSelect('s')}>Select</Button>
      </Group>
    </Modal>
  );
}
