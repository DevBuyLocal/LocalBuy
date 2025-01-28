import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import React, { type Dispatch, type SetStateAction } from 'react';
import { Pressable, StyleSheet } from 'react-native';
import { AvoidSoftInputView } from 'react-native-avoid-softinput';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useCodeScanner,
} from 'react-native-vision-camera';

import Container from '@/components/general/container';
import CustomButton from '@/components/general/custom-button';
import CustomInput from '@/components/general/custom-input';
import { ScrollView, Text, View } from '@/components/ui';

type Product = {
  name?: string;
  quantity?: number;
  productId?: string;
};

function AddProduct() {
  const [showCamera, setShowCamera] = React.useState(false);

  const [product, setProduct] = React.useState<Product | null>({
    name: '',
    quantity: 0,
    productId: '',
  });
  const ScanBarcode = () => {
    setShowCamera(true);
  };

  if (showCamera)
    return <CameraView {...{ setShowCamera, product, setProduct }} />;

  return (
    <Container.Page showHeader headerTitle="Add Product">
      <AvoidSoftInputView>
        <ScrollView
          className="h-full px-5"
          contentContainerClassName="flex-1 h-full"
        >
          <CustomInput placeholder="Product name" />
          <CustomInput
            placeholder="Product ID"
            value={product?.productId}
            onChangeText={(text) => setProduct({ ...product, productId: text })}
            rightIcon={
              <Pressable onPress={() => ScanBarcode()}>
                <MaterialCommunityIcons
                  name="barcode-scan"
                  size={24}
                  color="black"
                />
              </Pressable>
            }
          />
          <CustomInput placeholder="Product quantity" />

          <View className="absolute bottom-[120px] w-full flex-1">
            <CustomButton label="Save Product" />
          </View>
        </ScrollView>
      </AvoidSoftInputView>
    </Container.Page>
  );
}

export default AddProduct;

const CameraView = ({
  setShowCamera,
  setProduct,
  product,
}: {
  setShowCamera: Dispatch<SetStateAction<boolean>>;
  setProduct: Dispatch<SetStateAction<Product | null>>;
  product: Product | null;
}) => {
  const { hasPermission, requestPermission } = useCameraPermission();
  if (!hasPermission) {
    requestPermission();
  }
  const device = useCameraDevice('back');

  const codeScanner = useCodeScanner({
    codeTypes: ['qr', 'ean-13'],
    onCodeScanned: (codes) => {
      console.log(`Scanned ${codes.length} codes!`);
      setProduct({ ...product, productId: codes[0].value });
    },
  });

  if (device == null)
    return (
      <Container.Page
        showHeader
        headerTitle="Scan Barcode"
        backPress={() => setShowCamera(false)}
      >
        <Text>No camera device</Text>
      </Container.Page>
    );

  return (
    <Camera
      device={device}
      isActive
      style={StyleSheet.absoluteFill}
      codeScanner={codeScanner}
    />
  );
};
