import { Image } from 'expo-image';
import React from 'react';
import { type PressableProps } from 'react-native';
import { twMerge } from 'tailwind-merge';

import { type TProduct } from '@/api';
import { useAddCartItem, useGetCartItems } from '@/api/cart';
import { useAuth } from '@/lib';
import { CartSelector, useCart } from '@/lib/cart';
import { useLoader } from '@/lib/hooks/general/use-loader';

import CustomButton from '../general/custom-button';
import { Modal, Pressable, Text, useModal, View } from '../ui';
import DetailsModal from './details-modal';

export interface ProductItemProps extends Partial<PressableProps> {
  item: TProduct;
  containerClassname?: string | undefined;
}

// eslint-disable-next-line max-lines-per-function
function ProductItem(props: ProductItemProps) {
  const { token } = useAuth();
  const { loading, setLoading, setSuccess, setError } = useLoader({
    showLoadingPage: false,
  });
  const { addToCart, products_in_cart } = useCart(CartSelector);
  const { data } = useGetCartItems();
  const cartItems = token ? data?.items || [] : products_in_cart || [];
  const { present, ref, dismiss } = useModal();
  // const isInCart = products_in_cart?.find(
  //   (item: any) => item?.id === props?.item?.id
  // );

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
      // if (isInCart) {
      //   console.log(`Variant in cart: ${option?.id}`);
      // }
      return isInCart;
    });

    return matchedOption || null;
    // return matchedOption || options[0] || null;
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
    },
  });

  // const getSelectionInCart = (options: TProduct['options']) => {
  //   if (!options || !options.length) return null;

  //   for (let option of options) {
  //     if (
  //       cartItems.filter((item) => item.productOption?.id === option?.id).length
  //     ) {
  //       console.log(
  //         cartItems.filter((item) => item.productOption?.id === option?.id)
  //           .length
  //       );
  //       return option; // Return the first option found in cart
  //     }
  //   }
  //   return options[0] || null;
  // };
  const selectedOption = getFirstValidOption(props?.item?.options);

  const itemIsInCart = getSelectionInCart(props?.item?.options);
  // console.log('🚀 ~ ProductItem ~ itemIsInCart:', itemIsInCart);

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

  // console.log('🚀 ~ ProductItem ~ fem:', foundItem);

  // React.useEffect(() => {
  //   if (displayInfo?.options?.image.length) {
  //     setImgSrc(displayInfo.options.image);
  //   } else {
  //     setImgSrc(null);
  //   }
  // }, [displayInfo?.options?.image]);
  return (
    <>
      <Pressable
        className={twMerge(
          'w-[148px] rounded-[2px] bg-[#FFFFFF] dark:bg-[#000000] px-[10px] pt-[16px] pb-2 justify-between',
          props.containerClassname
        )}
        onPress={() => {
          setIsOpen(true);
          present();
        }}
      >
        <View>
          <Image
            source={
              imgSrc?.length
                ? { uri: imgSrc[0] }
                : require('../../../assets/images/img-p-holder.png')
            }
            className="h-[95px] w-full mix-blend-multiply"
            contentFit="cover"
            transition={1000}
            style={{
              tintColor: imgSrc ? undefined : '#D5D5D580',
            }}
            onError={() => {
              setImgSrc(null);
            }}
          />
          <View className="mb-1 mt-3 min-h-[78px] justify-between">
            <View>
              <Text numberOfLines={2} className="text-[12px] font-normal">
                {displayInfo?.name}
              </Text>
            </View>
            <Text className="text-[14px] font-bold">
              N{Number(displayInfo?.options?.price).toLocaleString()}
            </Text>
            <Text numberOfLines={1} className="text-[10px] text-primaryText">
              Minimum purchase: {displayInfo?.options?.moq}
            </Text>
          </View>
        </View>
        <View>
          <CustomButton
            label={itemIsInCart ? 'Added to cart' : 'Add to cart'}
            disabled={Boolean(itemIsInCart)}
            loading={loading}
            containerClassname="border-primaryText h-[29px] rounded-[4px]"
            textClassName="text-white font-normal text-[12px]"
            onPress={() => {
              if (token && selectedOption) {
                setLoading(true);
                mutate({
                  productOptionId: selectedOption?.id,
                  quantity: 1,
                });
              }
              // addToCart(props.item);
              // showMessage({
              //   message: 'Added to cart!',
              //   type: 'success',
              //   duration: 2000,
              // });
            }}
          />
          {/* {itemIsInCart ? (
            <QuantitySelect
              itemId={itemIsInCart?.id}
              cartItemId={
                cartItems?.filter((e) => e?.id === itemIsInCart?.id)[0]?.id
              }
            />
          ) : (
            <CustomButton
              label="Add to cart"
              containerClassname="border-primaryText h-[29px] rounded-[4px]"
              textClassName="text-white font-normal text-[12px]"
              onPress={() => {
                addToCart(props.item);
                showMessage({
                  message: 'Added to cart!',
                  type: 'success',
                  duration: 2000,
                });
              }}
            />
          )} */}
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
    </>
  );
}

export default ProductItem;
