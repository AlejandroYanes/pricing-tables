import ViewSizeGuard from 'components/view-size-guard';

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
