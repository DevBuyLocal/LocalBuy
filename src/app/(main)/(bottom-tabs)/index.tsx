import Container from '@/components/general/container';
import CustomButton from '@/components/general/custom-button';
import { Text } from '@/components/ui';

export default function Home() {
  // const { setSuccess, loading, setLoading, setError } = useLoader();

  return (
    <Container.Page className="px-0">
      <Container.Box>
        <Text>Home</Text>
        <CustomButton label={'Remind me later'} onPress={() => {}} />
      </Container.Box>
    </Container.Page>
  );
}
