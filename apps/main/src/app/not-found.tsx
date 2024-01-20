import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@dealo/ui';

const NotFound = () => {
  return (
    <section className="h-screen flex flex-col items-center gap-10 px-10">
      <Image src="/illustrations/undraw_wilderness.svg" alt="Not found" width={500} height={500} />
      <h1 className="text-3xl text-center">Hey there</h1>
      <p className="text-center">
        It seems like you went exploring into the wilderness. <br />
        When you are ready, you can come back.
      </p>
      <Link href="/">
        <Button>Go Back</Button>
      </Link>
    </section>
  );
};

export default NotFound;
