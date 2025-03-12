import { Image } from 'expo-image';
import React from 'react';
import { type PressableProps } from 'react-native';
import { twMerge } from 'tailwind-merge';

import { type TProduct } from '@/api';
import { useAddCartItem, useGetCartItems } from '@/api/cart';
import { useAuth } from '@/lib';
import { CartSelector, useCart } from '@/lib/cart';
import { useLoader } from '@/lib/hooks/general/use-loader';

import Container from '../general/container';
import CustomButton from '../general/custom-button';
import { Modal, Pressable, Text, useModal, View } from '../ui';
import DetailsModal from './details-modal';

export interface SavedProductItemProps extends Partial<PressableProps> {
  item: TProduct;
  containerClassname?: string | undefined;
}

// eslint-disable-next-line max-lines-per-function
function SavedProductItem(props: SavedProductItemProps) {
  const { token } = useAuth();
  const { loading, setLoading, setSuccess, setError } = useLoader({
    showLoadingPage: false,
  });

  const [loadingId, setLoadingId] = React.useState<number | null>(null);
  const { addToCart, products_in_cart } = useCart(CartSelector);
  const { data } = useGetCartItems();
  const cartItems = token ? data?.items || [] : products_in_cart || [];
  const { present, ref, dismiss } = useModal();

  const [isOpen, setIsOpen] = React.useState(false);

  const getFirstValidOption = (options: TProduct['options']) => {
    if (!options || !options.length) return null;

    for (let option of options) {
      if (option?.image?.length) {
        return option; // Return the first option that has an image
      }
    }
    return options[0] || null; // If no option has an image, return the first option as a fallback
  };
  const getSelectionInCart = (options: TProduct['options']) => {
    if (!options || options.length === 0) return null;

    const matchedOption = options.find((option) => {
      const isInCart = cartItems.some(
        (item) => item.productOption?.id === option?.id
      );
      return isInCart;
    });

    return matchedOption || null;
  };

  const { mutate } = useAddCartItem({
    onSuccess: () => {
      setSuccess('Item added to cart');
    },
    onError: (error) => {
      setError(error?.response?.data);
    },
    onSettled: () => {
      setLoading(false);
      setLoadingId(null);
    },
  });

  const selectedOption = getFirstValidOption(props?.item?.options);

  const itemIsInCart = getSelectionInCart(props?.item?.options);

  const displayInfo = {
    name: props?.item?.name,
    description: props?.item?.description,
    options: selectedOption
      ? { ...selectedOption }
      : {
          id: 0,
          value: '',
          price: 0,
          moq: 0,
          image: [],
          productId: 0,
          unit: '',
          createdAt: '',
          updatedAt: '',
        },
  };

  const [imgSrc, setImgSrc] = React.useState(
    displayInfo?.options?.image.length ? displayInfo?.options?.image : null
  );

  const foundItem = cartItems.find(
    (item) => item?.productOption?.id === selectedOption?.id
  );

  return (
    <Container.Box className="w-full flex-1 self-center">
      <Pressable
        className={twMerge(
          'w-full rounded-[2px] bg-[#FFFFFF] dark:bg-[#000000] px-[10px] pt-[16px] pb-2 justify-between',
          props.containerClassname
        )}
        onPress={() => {
          setIsOpen(true);
          present();
        }}
      >
        <View className="flex-row items-center justify-between">
          <Image
            source={
              imgSrc?.length
                ? { uri: imgSrc[0] }
                : require('../../../assets/images/img-p-holder.png')
            }
            className="h-[120px] w-[35%] mix-blend-multiply"
            contentFit="cover"
            style={{
              tintColor: imgSrc ? undefined : '#D5D5D580',
            }}
            onError={() => {
              setImgSrc(null);
            }}
          />
          <View className="mb-1 w-3/5 justify-between">
            <View className="mb-1 mt-3 min-h-[78px] gap-2">
              <View>
                <Text numberOfLines={2} className="text-[16px] font-bold">
                  {displayInfo?.name}
                </Text>
              </View>
              <Text numberOfLines={1} className="text-[14px] text-primaryText">
                Minimum purchase: {displayInfo?.options?.moq}
              </Text>
              <Text className="text-[18px] font-bold">
                N{Number(displayInfo?.options?.price).toLocaleString()}
              </Text>
            </View>
            <CustomButton
              label={itemIsInCart ? 'Added to cart' : 'Add to cart'}
              disabled={Boolean(itemIsInCart)}
              loading={loading && loadingId === props.item.id}
              containerClassname="border-primaryText h-[29px] rounded-[4px]"
              textClassName="text-white font-normal text-[12px]"
              onPress={() => {
                if (token && selectedOption) {
                  setLoadingId(props.item.id);
                  setLoading(true);
                  mutate({
                    productOptionId: selectedOption?.id,
                    quantity: 1,
                  });
                }
                if (!token && selectedOption) {
                  addToCart({
                    id: products_in_cart?.length + 1,
                    cartId: 0,
                    productOption: {
                      createdAt: new Date(selectedOption?.createdAt),
                      id: selectedOption?.id,
                      value: selectedOption?.value,
                      price: selectedOption?.price,
                      moq: selectedOption?.moq,
                      image: selectedOption?.image,
                      productId: selectedOption?.productId,
                      unit: selectedOption?.unit,
                      updatedAt: new Date(selectedOption?.updatedAt),
                      product: {
                        id: props.item.id,
                        name: props?.item?.name,
                        description: props?.item?.description,
                        categoryId: props?.item?.categoryId,
                        manufacturerId: props?.item?.manufacturerId,
                        createdAt: new Date(props?.item?.createdAt),
                        updatedAt: new Date(props?.item?.updatedAt),
                      },
                    },
                    quantity: 1,
                  });
                  setSuccess('Item added to cart');
                }
              }}
            />
          </View>
        </View>
      </Pressable>

      <Modal
        ref={ref}
        snapPoints={['90%']}
        style={{ borderRadius: 16, overflow: 'hidden' }}
        onDismiss={() => setIsOpen(false)}
        padTheTop={false}
      >
        {isOpen && (
          <DetailsModal
            dismiss={dismiss}
            isInCart={foundItem}
            addToCart={addToCart}
            item={props.item}
          />
        )}
      </Modal>
    </Container.Box>
  );
}

export default SavedProductItem;
