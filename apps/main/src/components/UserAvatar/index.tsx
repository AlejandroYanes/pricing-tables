import { Avatar } from '@mantine/core';
import { resolveInitials } from '@dealo/helpers';

interface Props {
  user: {
    name: string | null;
    image: string | null;
  } | null;
}

export default function UserAvatar(props: Props) {
  const { user } = props;
  return (
    <Avatar src={user?.image} alt={user?.name as string}>
      {user?.name ? resolveInitials(user?.name as string) : 'A/N'}
    </Avatar>
  );
}
