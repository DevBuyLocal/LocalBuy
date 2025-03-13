import Entypo from '@expo/vector-icons/Entypo';
import { parseISO } from 'date-fns';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { FlatList } from 'react-native';
import DatePicker from 'react-native-date-picker';
import { twMerge } from 'tailwind-merge';

import { useScheduleOrder } from '@/api/order/use-schedule-order';
import Container from '@/components/general/container';
import CustomButton from '@/components/general/custom-button';
import { Pressable, Radio, ScrollView, Text, View } from '@/components/ui';
import GetHourlyTimes from '@/lib/get-hourly-times';
import NextFiveDays from '@/lib/get-next-days';
import { useLoader } from '@/lib/hooks/general/use-loader';

function ScheduleOrder() {
  const { replace } = useRouter();
  const { setLoading, setError, setSuccess } = useLoader({
    showLoadingPage: false,
  });
  const [selectedDayIndex, setSelectedDayIndex] = React.useState(0);
  const [selectedTimeIndex, setSelectedTimeIndex] = React.useState(0);
  const [date, setDate] = React.useState<Date>(new Date());

  const [open, setOpen] = React.useState<boolean>(false);
  const getHourlyTimes = GetHourlyTimes();

  const { orderId }: { orderId: string } = useLocalSearchParams();

  const { mutate: mutateSchedule, isPending: schedulePending } =
    useScheduleOrder({
      onSuccess: () => {
        setSuccess('Order scheduled successfully!');
        replace('/(tabs)/scheduled');
      },
      onError: (error) => {
        setError(error?.response?.data);
      },
      onSettled: () => {
        setLoading(false);
      },
    });

  const handleSchedule = () => {
    setLoading(true);
    mutateSchedule({
      orderId: Number(orderId),
      scheduledDate: date,
    });
  };

  return (
    <Container.Page showHeader headerTitle="Schedule Order">
      <Container.Box>
        <Text className="mt-4">
          Need it later? Schedule your delivery for a date and time that suits
          you.
        </Text>
      </Container.Box>

      <View className=" w-full">
        <ScrollView
          horizontal
          // contentContainerClassName="h-[55px]"
          showsHorizontalScrollIndicator={false}
          bounces={false}
        >
          {NextFiveDays.map((day, i) => (
            <Pressable
              key={day.isoString}
              className={twMerge(
                'border-b-[2px] h-[55px]',
                selectedDayIndex === i
                  ? 'border-primaryText'
                  : 'border-[#1212121A]'
              )}
              onPress={() => {
                // console.log(day);
                setDate(parseISO(day.isoString));
                setSelectedDayIndex(i);
              }}
            >
              <View className="flex-1 p-5">
                <Text>{day.formatted}</Text>
              </View>
            </Pressable>
          ))}
        </ScrollView>
      </View>
      <Container.Box containerClassName="h-[65%]">
        <FlatList
          data={getHourlyTimes}
          renderItem={({ item, index }) => (
            <Pressable
              onPress={() => {
                setSelectedTimeIndex(index);
              }}
              className="flex-row items-center gap-2 py-5"
            >
              <Radio.Icon checked={selectedTimeIndex === index} />
              <Radio.Label text={item.formatted} className="text-[16px]" />
            </Pressable>
          )}
          ItemSeparatorComponent={() => (
            <View className="h-px w-[90%] self-end bg-gray-200" />
          )}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={<View className="mb-5" />}
        />
      </Container.Box>
      <View className="absolute bottom-8 w-full flex-1 p-5">
        <CustomButton
          label="Continue"
          loading={schedulePending}
          disabled={schedulePending}
          onPress={handleSchedule}
        />
      </View>

      <Pressable
        className="absolute bottom-36 right-5 size-[60px] items-center justify-center rounded-[12px] bg-primaryText shadow-black"
        onPress={() => setOpen(true)}
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
      <DatePicker
        modal
        open={open}
        date={date}
        minimumDate={new Date(Date.now() + 1000 * 60 * 60)}
        mode="datetime"
        minuteInterval={30}
        onConfirm={(date) => {
          setOpen(false);
          setDate(date);
        }}
        onCancel={() => {
          setOpen(false);
        }}
      />
    </Container.Page>
  );
}

export default ScheduleOrder;
