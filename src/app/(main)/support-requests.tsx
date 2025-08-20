import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, ScrollView, Text as RNText } from 'react-native';

import { useGetSupportRequests, type TSupportRequest } from '@/api';
import Container from '@/components/general/container';
import Empty from '@/components/general/empty';
import { Text, View } from '@/components/ui';

const SupportRequestItem = ({ 
  item, 
  onPress 
}: { 
  item: TSupportRequest; 
  onPress: () => void;
}) => {
  // Debug: render of individual item
  console.log('🧩 Rendering SupportRequestItem', {
    id: item?.id,
    supportId: item?.supportId,
    category: item?.category,
    status: item?.status,
  });
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'NEW':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'IN_PROGRESS':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'RESOLVED':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'NEW':
        return 'New';
      case 'IN_PROGRESS':
        return 'In Progress';
      case 'RESOLVED':
        return 'Resolved';
      default:
        return status;
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'PRODUCT':
        return <MaterialIcons name="inventory" size={20} color="#FFFFFF" />;
      case 'ORDER':
        return <MaterialIcons name="shopping-cart" size={20} color="#FFFFFF" />;
      case 'DELIVERY':
        return <MaterialIcons name="local-shipping" size={20} color="#FFFFFF" />;
      case 'GENERAL':
        return <MaterialIcons name="help-outline" size={20} color="#FFFFFF" />;
      default:
        return <MaterialIcons name="support" size={20} color="#FFFFFF" />;
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'PRODUCT':
        return 'Product';
      case 'ORDER':
        return 'Order';
      case 'DELIVERY':
        return 'Delivery';
      case 'GENERAL':
        return 'General';
      default:
        return category;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };



  return (
    <Pressable
      onPress={onPress}
      style={{
        marginBottom: 16,
        borderRadius: 12,
        borderWidth: 2,
        borderColor: '#EC9F01', // App's primary orange/yellow color
        backgroundColor: '#EC9F01', // App's primary orange/yellow color
        padding: 20,
        minHeight: 120, // Increased height
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', flex: 1 }}>
        <View style={{ flex: 1 }}>
          {/* Prominent Ticket Number Display */}
          <RNText style={{ 
            fontSize: 24, 
            fontWeight: '900', 
            color: '#FFFFFF',
            marginBottom: 8,
          }}>
            {item.supportId}
          </RNText>
          
          {/* Category and Status Row */}
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              {getCategoryIcon(item.category)}
              <RNText style={{ 
                marginLeft: 6, 
                fontSize: 14, 
                fontWeight: '600', 
                color: '#FFFFFF'
              }}>
                {getCategoryLabel(item.category)}
              </RNText>
            </View>
            
            {/* Status Badge */}
            <View style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 12,
              paddingHorizontal: 10,
              paddingVertical: 4,
            }}>
              <RNText style={{ 
                fontSize: 12, 
                fontWeight: '700', 
                color: '#EC9F01'
              }}>
                {getStatusLabel(item.status)}
              </RNText>
            </View>
          </View>

          {/* Date */}
          <RNText style={{ 
            marginTop: 8, 
            fontSize: 12, 
            color: '#FFFFFF',
            opacity: 0.9
          }}>
            {formatDate(item.dateSubmitted)}
          </RNText>
        </View>
        
        {/* Arrow Indicator */}
        <View style={{ marginLeft: 16 }}>
          <AntDesign name="right" size={20} color="#FFFFFF" />
        </View>
      </View>
    </Pressable>
  );
};

export default function SupportRequests() {
  const { back, push } = useRouter();
  const { data: requestsData, isLoading, error, refetch } = useGetSupportRequests();

  // Debug logging
  React.useEffect(() => {
    console.log('🔍 Support Requests Debug:', {
      isLoading,
      error: error?.message,
      errorResponse: error?.response?.data,
      errorStatus: error?.response?.status,
      requestsData,
      requestsLength: requestsData?.data?.length,
      hasData: !!requestsData,
    });
  }, [isLoading, error, requestsData]);

  const handleItemPress = (item: TSupportRequest) => {
    console.log('🔸 Support Request Item Clicked:', {
      itemId: item.id,
      supportId: item.supportId,
      category: item.category,
      status: item.status,
      title: item.title,
      navigationUrl: `/support-request-detail?id=${item.id}`,
      fullItem: item
    });
    push(`/support-request-detail?id=${item.id}`);
  };

  if (isLoading) {
    return (
      <Container.Page
        showHeader
        headerTitle="My Support Requests"
        backPress={() => back()}
      >
        <Container.Box>
          <View className="flex-1 items-center justify-center">
            <Text className="text-gray-500">Loading your support requests...</Text>
          </View>
        </Container.Box>
      </Container.Page>
    );
  }

  if (error) {
    return (
      <Container.Page
        showHeader
        headerTitle="My Support Requests"
        backPress={() => back()}
      >
        <Container.Box>
          <View className="flex-1 items-center justify-center">
            <Text className="text-red-500">Failed to load support requests</Text>
            <Pressable 
              onPress={() => refetch()} 
              className="mt-4 rounded-lg bg-blue-500 px-4 py-2"
            >
              <Text className="text-white">Try Again</Text>
            </Pressable>
          </View>
        </Container.Box>
      </Container.Page>
    );
  }

  // More robust data extraction with multiple fallbacks
  let requests: TSupportRequest[] = [];
  
  try {
    // Based on actual API response: data.requests is the array
    if (requestsData?.data?.requests && Array.isArray(requestsData.data.requests)) {
      requests = requestsData.data.requests;
    } else if (requestsData?.data && Array.isArray(requestsData.data)) {
      // Fallback: if data is directly an array
      requests = requestsData.data;
    } else if (requestsData && Array.isArray(requestsData)) {
      // Fallback: sometimes API might return array directly
      requests = requestsData as TSupportRequest[];
    } else {
      requests = [];
    }
  } catch (e) {
    console.error('🚨 Error processing requests data:', e);
    requests = [];
  }

  // Inline debug (no extra hooks to preserve order)
  console.log('📋 SupportRequests render', {
    count: requests?.length,
    requestsDataStructure: requestsData,
    requestsIsArray: Array.isArray(requests),
    requestsValue: requests,
    rawRequestsData: requestsData?.data?.requests,
    requestsDataType: typeof requestsData?.data?.requests,
    fullApiData: requestsData?.data,
    ids: Array.isArray(requests) ? requests.map((r) => r?.id) : 'n/a',
    hasData: !!requestsData,
  });

  return (
    <Container.Page
      showHeader
      headerTitle="My Support Requests"
      backPress={() => back()}
    >
      <Container.Box>
        {!Array.isArray(requests) || requests.length === 0 ? (
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 32 }}>
            <MaterialIcons name="support-agent" size={64} color="#9CA3AF" />
            <Text className="mt-4 text-lg font-medium text-gray-900 dark:text-gray-100">
              No Support Requests
            </Text>
            <Text className="mt-2 text-center text-gray-600 dark:text-gray-400">
              You haven't submitted any support requests yet.
            </Text>
            <Text className="mt-4 text-center text-xs text-gray-500 dark:text-gray-500">
              Need help? Our support team is here to assist you.
            </Text>
            <Pressable
              onPress={() => push('/contact-support')}
              className="mt-6 rounded-lg bg-blue-500 px-6 py-3"
            >
              <Text className="font-medium text-white">Submit Request</Text>
            </Pressable>
          </View>
        ) : (
          <ScrollView 
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ 
              paddingBottom: 20,
              flexGrow: 1 
            }}
          >
            {Array.isArray(requests) && requests.map((item) => {
              console.log('🧵 Mapping item to component', {
                id: item?.id,
                supportId: item?.supportId,
              });
              return (
                <SupportRequestItem
                  key={item?.id || Math.random()}
                  item={item}
                  onPress={() => handleItemPress(item)}
                />
              );
            })}
          </ScrollView>
        )}
      </Container.Box>
    </Container.Page>
  );
}
