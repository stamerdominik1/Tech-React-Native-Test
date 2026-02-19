import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import type { ToastConfigParams } from 'react-native-toast-message';
import { colors } from '../theme';

type CustomToastProps = ToastConfigParams<unknown> & { leftBorderColor?: string };

const TOAST_MIN_HEIGHT = 60;
const TOAST_WIDTH = 340;
const BORDER_RADIUS = 6;

const baseToastStyle = {
  minHeight: TOAST_MIN_HEIGHT,
  width: TOAST_WIDTH,
  borderRadius: BORDER_RADIUS,
  flexDirection: 'row' as const,
  paddingHorizontal: 25,
  paddingVertical: 14,
  justifyContent: 'center' as const,
  alignItems: 'flex-start' as const,
  shadowOffset: { width: 0, height: 0 },
  shadowOpacity: 0.1,
  shadowRadius: BORDER_RADIUS,
  elevation: 2,
  backgroundColor: '#FFF',
};

const text1Style = {
  fontSize: 18,
  fontWeight: '700' as const,
  marginBottom: 4,
  color: '#000',
  width: '100%' as const,
};

const text2Style = {
  fontSize: 16,
  lineHeight: 22,
  color: '#666',
  width: '100%' as const,
};

function BaseCustomToast({
  text1,
  text2,
  text1Style: customText1Style,
  text2Style: customText2Style,
  onPress,
  leftBorderColor = colors.primary,
}: CustomToastProps) {
  return (
    <TouchableOpacity
      activeOpacity={1}
      onPress={onPress}
      style={[
        baseToastStyle,
        { borderLeftWidth: 5, borderLeftColor: leftBorderColor },
      ]}
    >
      <View style={styles.content}>
        {text1 && text1.length > 0 && (
          <Text
            style={[text1Style, customText1Style]}
            numberOfLines={1}
            ellipsizeMode="tail"
          >
            {text1}
          </Text>
        )}
        {text2 && text2.length > 0 && (
          <Text style={[text2Style, customText2Style]}>{text2}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

export function ErrorToast(props: ToastConfigParams<unknown>) {
  return <BaseCustomToast {...props} leftBorderColor={colors.error} />;
}

export function SuccessToast(props: ToastConfigParams<unknown>) {
  return <BaseCustomToast {...props} leftBorderColor={colors.primary} />;
}

const styles = StyleSheet.create({
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'flex-start',
  },
});
