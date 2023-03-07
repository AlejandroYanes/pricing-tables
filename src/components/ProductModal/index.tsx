import { useForm } from '@mantine/form';
import { Modal, Stack, Textarea, TextInput } from '@mantine/core';

export default function ProductModal() {
  const form = useForm({
    initialValues: {
      name: '',
      description: '',
    },
  });
  return (
    <Modal opened onClose={() => undefined}>
      <form>
        <Stack>
          <TextInput label="Name" {...form.getInputProps('name')} />
          <Textarea label="Description" minRows={4} maxRows={8} {...form.getInputProps('description')} />
        </Stack>
      </form>
    </Modal>
  );
}
