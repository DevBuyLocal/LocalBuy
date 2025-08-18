import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useRouter } from 'expo-router';
import React from 'react';
import { FlatList, Pressable, Text as RNText } from 'react-native';

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
  // Force white text on orange background for visibility
  const primaryTextColor = '#FFFFFF'; // white
  const secondaryTextColor = '#FFFFFF'; // white
  const mutedTextColor = '#FFFFFF'; // white
  const badgeTextColor = '#FFFFFF'; // white for status badge
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
        return <MaterialIcons name="inventory" size={20} color="#6B7280" />;
      case 'ORDER':
        return <MaterialIcons name="shopping-cart" size={20} color="#6B7280" />;
      case 'DELIVERY':
        return <MaterialIcons name="local-shipping" size={20} color="#6B7280" />;
      case 'GENERAL':
        return <MaterialIcons name="help-outline" size={20} color="#6B7280" />;
      default:
        return <MaterialIcons name="support" size={20} color="#6B7280" />;
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
        marginBottom: 12,
        borderRadius: 10,
        borderWidth: 2,
        borderColor: '#EC9F01', // Primary app color
        backgroundColor: '#EC9F01', // Primary app color
        padding: 20, // Reduced padding
        height: 80, // Reduced height
      }}
    >
      <View style={{ 
        flexDirection: 'row', 
        alignItems: 'center', 
        justifyContent: 'center',
        flex: 1,
      }}>
        <RNText style={{ 
          fontSize: 24, 
          fontWeight: '900', 
          color: primaryTextColor,
          textAlign: 'center',
        }}>
          Ticket ID: {item.supportId}
        </RNText>
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

  const requests = requestsData?.data || [];

  // Inline debug (no extra hooks to preserve order)
  console.log('📋 SupportRequests render', {
    count: requests?.length,
    ids: Array.isArray(requests) ? requests.map((r) => r.id) : 'n/a',
    hasData: !!requestsData,
  });

  return (
    <Container.Page
      showHeader
      headerTitle="My Support Requests"
      backPress={() => back()}
    >
      <Container.Box>
        <View className="flex-1">
          {requests.length === 0 ? (
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
            <View>
              <Text className="mb-2 text-xs text-gray-500">
                Debug: rendering {requests.length} items
              </Text>
              {requests.map((item) => {
                console.log('🧵 Mapping item to component', {
                  id: item?.id,
                  supportId: item?.supportId,
                });
                return (
                  <SupportRequestItem
                    key={item.id}
                    item={item}
                    onPress={() => handleItemPress(item)}
                  />
                );
              })}
            </View>
          )}
        </View>
      </Container.Box>
    </Container.Page>
  );
}
