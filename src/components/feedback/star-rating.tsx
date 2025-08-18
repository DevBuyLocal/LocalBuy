import AntDesign from '@expo/vector-icons/AntDesign';
import React from 'react';
import { Pressable } from 'react-native';

import { View } from '@/components/ui';

interface StarRatingProps {
  rating: number;
  onRatingChange: (rating: number) => void;
  size?: number;
  disabled?: boolean;
}

export default function StarRating({ 
  rating, 
  onRatingChange, 
  size = 32, 
  disabled = false 
}: StarRatingProps) {
  const stars = [1, 2, 3, 4, 5];

  return (
    <View className="flex-row">
      {stars.map((star) => (
        <Pressable
          key={star}
          onPress={() => !disabled && onRatingChange(star)}
          className="mr-1"
          disabled={disabled}
        >
          <AntDesign
            name={star <= rating ? 'star' : 'staro'}
            size={size}
            color={star <= rating ? '#EC9F01' : '#D1D5DB'}
          />
        </Pressable>
      ))}
    </View>
  );
}
