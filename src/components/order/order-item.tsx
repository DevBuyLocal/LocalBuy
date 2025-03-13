import { MaterialCommunityIcons } from '@expo/vector-icons';
import { format, parseISO } from 'date-fns';
import { useRouter } from 'expo-router';
import React from 'react';

import { type TOrder } from '@/api/order';

import { Image, Pressable, Text, View } from '../ui';

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
  const [imgSrc, setImgSrc] = React.useState(null);

  const date = format(parseISO(item?.createdAt), 'dd - MMM yyyy • hh:mm a');

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
          push(`/track-order?orderId=${item?.id}`);
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
              Order:# {item?.id}
            </Text>
            <Text className="text-[13px] font-normal opacity-60">{date}</Text>
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
