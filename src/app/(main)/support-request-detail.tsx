import AntDesign from '@expo/vector-icons/AntDesign';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React from 'react';
import { ScrollView } from 'react-native';

import { useGetSpecificSupportRequest } from '@/api';
import Container from '@/components/general/container';
import { Text, View } from '@/components/ui';

export default function SupportRequestDetail() {
  const { back } = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  
  // Debug logging
  React.useEffect(() => {
    console.log('🔍 Support Request Detail Page Loaded:', {
      receivedId: id,
      idType: typeof id,
      hasId: !!id,
      queryEnabled: !!id,
      timestamp: new Date().toISOString()
    });
  }, [id]);
  
  const { data, isLoading, error } = useGetSpecificSupportRequest(id as string)();

  // Debug logging for API response
  React.useEffect(() => {
    console.log('🔍 Support Request Detail Debug:', {
      isLoading,
      error: error?.message,
      errorResponse: error?.response?.data,
      errorStatus: error?.response?.status,
      data,
      hasRequest: !!data?.request,
      requestId: data?.request?.id,
      requestSupportId: data?.request?.supportId
    });
  }, [isLoading, error, data]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-300';
      case 'In Progress':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-300';
      case 'Resolved':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-300';
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Product':
        return <MaterialIcons name="inventory" size={24} color="#EC9F01" />;
      case 'Order':
        return <MaterialIcons name="shopping-cart" size={24} color="#EC9F01" />;
      case 'Delivery':
        return <MaterialIcons name="local-shipping" size={24} color="#EC9F01" />;
      case 'General':
        return <MaterialIcons name="help-outline" size={24} color="#EC9F01" />;
      default:
        return <MaterialIcons name="support" size={24} color="#EC9F01" />;
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <Container.Page
        showHeader
        headerTitle="Request Details"
        backPress={() => back()}
      >
        <Container.Box>
          <View className="flex-1 items-center justify-center">
            <Text className="text-gray-500">Loading request details...</Text>
          </View>
        </Container.Box>
      </Container.Page>
    );
  }

  if (error || !data?.request) {
    return (
      <Container.Page
        showHeader
        headerTitle="Request Details"
        backPress={() => back()}
      >
        <Container.Box>
          <View className="flex-1 items-center justify-center">
            <MaterialIcons name="error-outline" size={64} color="#EF4444" />
            <Text className="mt-4 text-center text-red-500">
              Failed to load request details
            </Text>
          </View>
        </Container.Box>
      </Container.Page>
    );
  }

  const request = data.request as any;

  return (
    <Container.Page
      showHeader
      headerTitle="Request Details"
      backPress={() => back()}
    >
      <ScrollView showsVerticalScrollIndicator={false}>
        <Container.Box>
          {/* Header Section */}
          <View className="mb-6 rounded-lg bg-white p-4 dark:bg-gray-800">
            <View className="flex-row items-center">
              {getCategoryIcon(
                typeof request.category === 'string'
                  ? (request.category.includes('PRODUCT') || request.category.includes('Product')
                      ? 'Product'
                      : request.category.includes('ORDER') || request.category.includes('Order')
                      ? 'Order'
                      : request.category.includes('DELIVERY') || request.category.includes('Delivery')
                      ? 'Delivery'
                      : 'General')
                  : 'General'
              )}
              <View className="ml-3 flex-1">
                <Text className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                  {(() => {
                    const rawTitle = String(request.title || request.category || 'Support Request').trim();
                    const normalized = rawTitle.toLowerCase();
                    return normalized.includes('support request') ? rawTitle : `${rawTitle} Support Request`;
                  })()}
                </Text>
                <Text className="text-sm text-gray-600 dark:text-gray-400">
                  Ticket ID: {request.supportId || request.ticketId}
                </Text>
              </View>
              <View className={`rounded-full px-3 py-1 ${getStatusColor(request.status)}`}>
                <Text className="text-sm font-medium">
                  {(request.status || '').replaceAll('_', ' ')}
                </Text>
              </View>
            </View>
          </View>

          {/* Request Information */}
          <View className="mb-6">
            <Text className="mb-3 text-lg font-semibold text-gray-900 dark:text-gray-100">
              Request Information
            </Text>

            {/* Category */}
            <View className="mb-4 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
              <Text className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                Category
              </Text>
              <Text className="text-base text-gray-900 dark:text-gray-100">
                {request.category}
              </Text>
            </View>

            {/* Description */}
            <View className="mb-4 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
              <Text className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Description
              </Text>
              <Text className="text-base leading-6 text-gray-900 dark:text-gray-100">
                {request.description}
              </Text>
            </View>

            {/* Created Date */}
            <View className="mb-4 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
              <Text className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                Created Date & Time
              </Text>
              <Text className="text-base text-gray-900 dark:text-gray-100">
                {formatDate(request.dateSubmitted || request.createdAt)}
              </Text>
            </View>

            {/* Last Updated */}
            <View className="mb-4 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
              <Text className="mb-1 text-sm font-medium text-gray-700 dark:text-gray-300">
                Last Updated
              </Text>
              <Text className="text-base text-gray-900 dark:text-gray-100">
                {formatDate(request.lastUpdated || request.updatedAt)}
              </Text>
            </View>

            {/* Current Status */}
            <View className="mb-4 rounded-lg border border-gray-200 bg-white p-4 dark:border-gray-700 dark:bg-gray-800">
              <Text className="mb-2 text-sm font-medium text-gray-700 dark:text-gray-300">
                Current Status
              </Text>
              <View className={`self-start rounded-full px-3 py-1 ${getStatusColor(request.status)}`}>
                <Text className="text-sm font-medium">
                  {(request.status || '').replaceAll('_', ' ')}
                </Text>
              </View>
            </View>

            {/* Admin Resolution Note */}
            {request.adminResolutionNote && (
              <View className="rounded-lg border border-green-200 bg-green-50 p-4 dark:border-green-800 dark:bg-green-900/20">
                <View className="mb-2 flex-row items-center">
                  <AntDesign name="checkcircle" size={16} color="#22C55E" />
                  <Text className="ml-2 text-sm font-medium text-green-800 dark:text-green-200">
                    Admin Response
                  </Text>
                </View>
                <Text className="text-base leading-6 text-green-700 dark:text-green-300">
                  {request.adminResolutionNote}
                </Text>
              </View>
            )}
          </View>

          {/* Status Information */}
          <View className="mb-6 rounded-lg bg-blue-50 p-4 dark:bg-blue-900/20">
            <View className="flex-row items-start">
              <AntDesign 
                name="infocirlce" 
                size={16} 
                color="#3B82F6" 
                style={{ marginTop: 2 }}
              />
              <View className="ml-2 flex-1">
                <Text className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  What's next?
                </Text>
                {request.status === 'Pending' && (
                  <Text className="mt-1 text-sm text-blue-700 dark:text-blue-300">
                    Your request is in our queue and will be reviewed by our support team shortly. You'll receive an email notification when there's an update.
                  </Text>
                )}
                {request.status === 'In Progress' && (
                  <Text className="mt-1 text-sm text-blue-700 dark:text-blue-300">
                    Our support team is actively working on your request. You'll receive an email notification with the resolution details once it's completed.
                  </Text>
                )}
                {request.status === 'Resolved' && (
                  <Text className="mt-1 text-sm text-blue-700 dark:text-blue-300">
                    Your request has been resolved! If you need further assistance with this issue, please submit a new support request.
                  </Text>
                )}
              </View>
            </View>
          </View>
        </Container.Box>
      </ScrollView>
    </Container.Page>
  );
}
