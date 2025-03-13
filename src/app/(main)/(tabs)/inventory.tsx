import Entypo from '@expo/vector-icons/Entypo';
import FontAwesome5 from '@expo/vector-icons/FontAwesome5';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import SimpleLineIcons from '@expo/vector-icons/SimpleLineIcons';
import { useRouter } from 'expo-router';
import { useColorScheme } from 'nativewind';
import React from 'react';
import { twMerge } from 'tailwind-merge';

import Container from '@/components/general/container';
import CustomButton from '@/components/general/custom-button';
import Empty from '@/components/general/empty';
import { colors, Pressable, Text, View, WIDTH } from '@/components/ui';

type Route = {
  key: string;
  title: string;
  icon: React.ReactNode;
  view: JSX.Element;
};

export default function Inventory() {
  // const layout = useWindowDimensions();
  const [index, setIndex] = React.useState(0);
  const { colorScheme } = useColorScheme();

  // const renderScene = SceneMap({
  //   dashboard: Dashboard,
  //   products: Products,
  //   'low-stock': LowStock,
  // });

  const routes: Route[] = [
    {
      key: 'dashboard',
      title: 'Dashboard',
      icon: (
        <SimpleLineIcons
          name="speedometer"
          size={20}
          color={colorScheme === 'dark' ? '#fff' : 'black'}
        />
      ),
      view: <Dashboard />,
    },
    {
      key: 'products',
      title: 'Products',
      icon: (
        <FontAwesome5
          name="prescription-bottle"
          size={18}
          color={colorScheme === 'dark' ? '#fff' : 'black'}
        />
      ),
      view: <Products />,
    },
    {
      key: 'low-stock',
      title: 'Low Stock',
      icon: (
        <MaterialCommunityIcons
          name="signal-cellular-1"
          size={20}
          color={colorScheme === 'dark' ? '#fff' : 'black'}
        />
      ),
      view: <LowStock />,
    },
  ];

  return (
    <Container.Page showHeader headerTitle="Inventory" hideBackButton>
      <View
        className="mt-5 flex-row items-center justify-between"
        style={{ width: WIDTH }}
      >
        {routes.map((e, i) => (
          <Pressable
            key={e.key}
            className={twMerge(
              'flex-row items-center justify-around gap-3  px-7 py-2',
              index === i && 'border-b-2 border-primaryText'
            )}
            onPress={() => setIndex(i)}
          >
            {e.icon}
            <Text className="text-[16px] font-semibold">{e.title}</Text>
          </Pressable>
        ))}
      </View>
      <View className="relative mt-5 flex-1">{routes[index].view}</View>
    </Container.Page>
  );

  return (
    <Container.Page showHeader headerTitle="Inventory" hideBackButton>
      {/* <TabView
        lazy
        navigationState={{ index, routes }}
        renderScene={renderScene}
        onIndexChange={setIndex}
        initialLayout={{ width: layout.width }}
        renderTabBar={(props) => (
          <TabBar
            {...props}
            indicatorStyle={{ backgroundColor: colors.primaryText }}
            style={{
              backgroundColor: colorScheme === 'dark' ? 'black' : 'white',
              marginTop: 14,
            }}
            contentContainerStyle={{
              flexDirection: 'row',
              justifyContent: 'space-around',
            }}
            onTabPress={({ route }) => {
              setIndex(route.key);
            }}
            renderTabBarItem={({ route }) => (
              <Pressable
                className={twMerge(
                  'flex-row items-center justify-center gap-2 py-5'
                )}
                onPress={() => {
                  setIndex(routes.findIndex((r) => r.key === route.key));
                }}
              >
                {route.icon}
                <Text>{route.title}</Text>
              </Pressable>
            )}
          />
        )}
      /> */}
    </Container.Page>
  );
}
const Dashboard = () => {
  const { push } = useRouter();
  return (
    <Container.Box>
      <Empty
        title="Your inventory is empty"
        desc="Build your inventory by shopping on our app or adding products manually"
        containerClassName="my-10"
        image={require('../../../../assets/images/empty-inv.png')}
      />

      <CustomButton label="Start Shopping" onPress={() => push('/')} />
      <CustomButton.Secondary
        label="Add Products Manually"
        onPress={() => {}}
      />
    </Container.Box>
  );
};

const Products = () => {
  const { push } = useRouter();
  const productsOverview = [
    {
      title: 'Total Products in stock',
      quantity: 10,
      color: colors.black,
    },
    {
      title: 'Total Products at hand',
      quantity: 10,
      color: colors.primaryText,
    },
    {
      title: 'Total stock price',
      price: 10,
      color: '#FF0000',
    },
  ];
  return (
    <Container.Page containerClassName="flex-1 relative">
      <View className="mt-3 h-[90px] w-[90%] flex-row items-center justify-between self-center overflow-hidden rounded-[12px] border border-[#12121226] p-5">
        {productsOverview.map((product) => (
          <View
            style={{ borderColor: product.color }}
            key={product.title}
            className={twMerge(
              'h-full w-[34%] justify-between border-l-2 px-3'
            )}
          >
            <Text className="text-[12px] opacity-65">{product?.title}</Text>
            <Text className="text-[14px] font-medium">
              {product?.quantity || product?.price}
            </Text>
          </View>
        ))}
      </View>

      <Empty
        title="No products found"
        desc="Add products to your inventory"
        containerClassName="my-10"
        image={require('../../../../assets/images/empty-inv.png')}
      />

      <Pressable
        className="absolute bottom-10 right-5 size-[60px] items-center justify-center rounded-[12px] bg-primaryText shadow-black"
        onPress={() => push('/add-product')}
        style={{
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 1,
          },
          shadowOpacity: 0.2,
          shadowRadius: 1.41,
          elevation: 2,
        }}
      >
        <Entypo name="plus" size={24} color="white" />
      </Pressable>
    </Container.Page>
  );
};

const LowStock = () => {
  return (
    <Container.Box>
      <Text>Low Stock</Text>
    </Container.Box>
  );
};
