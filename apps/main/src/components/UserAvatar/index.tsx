import { resolveInitials } from '@dealo/helpers';
import { Avatar, AvatarImage, AvatarFallback } from '@dealo/ui';

interface Props {
  user: {
    name: string | null;
    image: string | null;
  } | null;
}

export default function UserAvatar(props: Props) {
  const { user } = props;
  return (
    <Avatar>
      <AvatarImage src={user?.image ?? undefined} alt={user?.name as string} />
      <AvatarFallback>
        {user?.name ? resolveInitials(user?.name as string) : 'A/N'}
      </AvatarFallback>
    </Avatar>
  );
}
