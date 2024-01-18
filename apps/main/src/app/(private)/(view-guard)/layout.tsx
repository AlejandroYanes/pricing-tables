import ViewSizeGuard from 'components/ViewSizeGuard';

interface Props {
    children: any;
}

const PrivateLayout = (props: Props) => {
  return (
    <ViewSizeGuard>
      {props.children}
    </ViewSizeGuard>
  );
};

export default PrivateLayout;
