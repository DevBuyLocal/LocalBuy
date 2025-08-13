import { MaterialCommunityIcons } from '@expo/vector-icons';
import { format, parseISO } from 'date-fns';
import { useRouter } from 'expo-router';
import React from 'react';
import { Env } from '@env';

import { type TOrder } from '@/api/order';

import { Image, Pressable, Text, View } from '../ui';

// Prefer absolute URLs; if relative, prefix with API base
function toAbsoluteUrl(url?: string | null): string | null {
  if (!url) return null;
  if (/^https?:\/\//i.test(url)) return url;
  const base = Env.API_URL?.replace(/\/$/, '');
  const path = url.startsWith('/') ? url : `/${url}`;
  return base ? `${base}${path}` : url;
}

function resolveOrderItemImage(orderItem: any): string | null {
  const cands: Array<string | undefined> = [
    // Product option images arrays
    orderItem?.productOption?.image?.[0],
    orderItem?.productOption?.images?.[0],
    // Product level images
    orderItem?.product?.image?.[0],
    orderItem?.product?.images?.[0],
    orderItem?.product?.imageUrl,
    orderItem?.image,
  ];
  for (const cand of cands) {
    const abs = toAbsoluteUrl(cand || null);
    if (abs) return abs;
  }
  return null;
}

type Props = {
  item: TOrder;
  handleDelete?: () => void;
  onPress?: () => void;
  isHistory?: boolean;
};

function OrderItem({ item, onPress, isHistory }: Props) {
  const { push } = useRouter();
  // const leftSwipe = () => {
  //   return (
  //     <Pressable onPress={handleDelete}>
  //       <View className="h-full w-[70px] items-center justify-center rounded-lg bg-red-500 p-2">
  //         <Entypo name="trash" color={'white'} size={30} />
  //       </View>
  //     </Pressable>
  //   );
  // };
  const [imgSrc, setImgSrc] = React.useState<string | null>(null);

  // Pick first product image in the order (prefer option image)
  React.useEffect(() => {
    try {
      const firstItem: any = item?.items?.[0];
      const candidate = resolveOrderItemImage(firstItem);
      setImgSrc(candidate);
    } catch {
      setImgSrc(null);
    }
  }, [item?.items]);

  return (
    // <Swipeable
    //   overshootLeft={false}
    //   overshootRight={false}
    //   overshootFriction={8}
    //   renderRightActions={isHistory ? undefined : leftSwipe}
    //   enabled={!isHistory}
    // >
    <Pressable
      onPress={() => {
        if (isHistory && item?.status === 'PENDING') {
          push(
            `/checkout?orderId=${item?.id}&price=${item?.totalPrice}&scheduledDate=${item?.scheduledDate}`
          );
          return;
        }
        if (item?.status !== 'PENDING') {
          push(`/track-order?orderId=${item?.id}&price=${item?.totalPrice}`);
          return;
        }
        onPress && onPress();
      }}
      className="z-50 mt-1 flex-row items-center justify-between rounded-md border-b border-gray-200 bg-white px-5 py-4 dark:bg-[#282828]"
    >
      <View className="flex-row items-center gap-5 ">
        <Image
          source={
            imgSrc
              ? { uri: imgSrc }
              : require('../../../assets/images/img-p-holder.png')
          }
          onError={() => setImgSrc(null)}
          style={{ tintColor: imgSrc ? undefined : '#D5D5D580' }}
          contentFit="contain"
          className="h-[75px] w-[70px] rounded-lg bg-[#F7F7F7]"
        />
        <View className="h-[75px] justify-between ">
          <View>
            <Text numberOfLines={2} className="w-[70%] font-medium">
              {item?.items?.length > 0 
                ? item.items.length === 1 
                  ? item.items[0].product.name
                  : `${item.items[0].product.name} +${item.items.length - 1} more`
                : 'No products'}
            </Text>
          </View>

          <Text className="text-[12px]">
            {item?.scheduledDate
              ? ` Upcoming ${format(parseISO(item.scheduledDate), 'dd - MMM yyyy')}`
              : item?.status}
          </Text>
        </View>
      </View>

      {Boolean(isHistory) && (
        <MaterialCommunityIcons name="chevron-right" size={20} />
      )}
    </Pressable>
    // </Swipeable>
  );
}

export default OrderItem;
