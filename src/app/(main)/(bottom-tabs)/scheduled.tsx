import Container from '@/components/general/container';
import { Text } from '@/components/ui';

export default function Scheduled() {
  return (
    <Container.Page showHeader hideBackButton headerTitle="Scheduled Orders">
      <Container.Box>
        <Text onPress={() => {}}>Scheduled Orders</Text>
      </Container.Box>
    </Container.Page>
  );
}
