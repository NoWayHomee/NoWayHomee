import React, { useState } from 'react';
import { Image as RNImage, ImageProps as RNImageProps, ImageStyle, StyleProp, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface SafeImageProps extends Omit<RNImageProps, 'style' | 'onError'> {
  style?: StyleProp<ImageStyle>;
  contentFit?: 'cover' | 'contain' | 'fill' | 'none';
  transition?: number;
  cachePolicy?: 'none' | 'disk' | 'memory' | 'memory-disk';
  onError?: (event: { error: string }) => void;
}

export const Image: React.FC<SafeImageProps> = ({
  source,
  style,
  contentFit,
  transition,
  cachePolicy,
  onError,
  ...props
}) => {
  const [hasError, setHasError] = useState(false);

  // Map contentFit to standard React Native resizeMode
  let resizeMode: 'cover' | 'contain' | 'stretch' | 'center' = 'cover';
  if (contentFit === 'contain') resizeMode = 'contain';
  if (contentFit === 'fill') resizeMode = 'stretch';
  if (contentFit === 'none') resizeMode = 'center';

  const handleOnError = (e: any) => {
    setHasError(true);
    if (onError) {
      const errorMsg = e.nativeEvent?.error || 'Failed to load image';
      onError({ error: errorMsg });
    }
  };

  // Fallback placeholder khi ảnh lỗi
  if (hasError) {
    return (
      <View
        style={[
          style as any,
          {
            backgroundColor: '#F0F0F0',
            justifyContent: 'center',
            alignItems: 'center',
          },
        ]}
      >
        <Ionicons name="image-outline" size={40} color="#BDBDBD" />
      </View>
    );
  }

  return (
    <RNImage
      source={source}
      style={style as any}
      resizeMode={resizeMode}
      onError={handleOnError}
      {...props}
    />
  );
};
