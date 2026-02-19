import React from 'react';
import {
  View,
  StyleSheet,
  Keyboard,
  TouchableWithoutFeedback,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { customFormResolver } from '../utils/customFormResolver';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
  withSequence,
} from 'react-native-reanimated';
import { Card, TextInput, Button, Text } from 'react-native-paper';
import Spinner from 'react-native-loading-spinner-overlay';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { api, getApiErrorMessage } from '../services/api';
import type { CreateDonationInput } from '../interfaces/donation';
import { colors } from '../theme';

const donationSchema = z.object({
  amount: z
    .string()
    .min(1, { message: 'Amount is required' })
    .refine((val) => !Number.isNaN(Number(val)), {
      message: 'Amount must be a number',
    })
    .refine((val) => Number(val) > 0, {
      message: 'Amount must be greater than 0',
    }),
  donorName: z.string().min(1, { message: 'Donor name is required' }).trim(),
  message: z.string().optional(),
});

type DonationFormData = z.infer<typeof donationSchema>;

const springConfig = { damping: 15, stiffness: 150 };

interface DonationFormProps {
  fundraiserId: number;
}

export default function DonationForm({ fundraiserId }: DonationFormProps) {
  const queryClient = useQueryClient();
  const successOpacity = useSharedValue(0);
  const successScale = useSharedValue(0.8);
  const formScale = useSharedValue(1);

  const {
    control,
    handleSubmit,
    reset,
    setFocus,
    formState: { errors },
  } = useForm<DonationFormData>({
    resolver: customFormResolver(donationSchema),
    mode: 'onBlur',
    defaultValues: {
      amount: '',
      donorName: '',
      message: '',
    },
  });

  const mutation = useMutation({
    mutationFn: (data: CreateDonationInput) =>
      api.createDonation(fundraiserId, {
        amount: Number(data.amount),
        donorName: data.donorName,
        message: data.message || undefined,
      }),
    onSuccess: () => {
      Keyboard.dismiss();
      queryClient.invalidateQueries({ queryKey: ['fundraiser', fundraiserId] });
      queryClient.invalidateQueries({ queryKey: ['donations', fundraiserId] });
      reset({ amount: '', donorName: '', message: '' });
      Toast.show({
        type: 'success',
        text1: 'Thank you!',
        text2: 'Your donation was submitted successfully.',
        visibilityTime: 3000,
        text1Style: styles.toastTitle,
        text2Style: styles.toastMessage,
      });
      successOpacity.value = 1;
      successScale.value = withSpring(1, springConfig);
      formScale.value = 0.98;
      setTimeout(() => {
        successOpacity.value = withSequence(
          withSpring(0, { damping: 20 }),
          withSpring(0)
        );
        successScale.value = withSpring(0.8);
        formScale.value = withSpring(1, springConfig);
      }, 2200);
    },
    onError: (error: unknown) => {
      Keyboard.dismiss();
      Toast.show({
        type: 'error',
        text1: 'Donation failed',
        text2: getApiErrorMessage(error),
        visibilityTime: 4000,
        text1Style: styles.toastTitle,
        text2Style: styles.toastMessage,
      });
    },
  });

  const successAnimatedStyle = useAnimatedStyle(() => ({
    opacity: successOpacity.value,
    transform: [{ scale: successScale.value }],
  }));

  const formAnimatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: formScale.value }],
  }));

  return (
    <>
      <Spinner
        visible={mutation.isPending}
        textContent="Submitting..."
        textStyle={styles.spinnerText}
        overlayColor="rgba(0, 0, 0, 0.4)"
        color={colors.primary}
      />
      <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.wrapper}
        >
        <View style={styles.container}>
          <Animated.View style={[styles.successOverlay, successAnimatedStyle]} pointerEvents="none">
            <Card style={styles.successCard}>
              <Card.Content>
                <Text variant="titleLarge" style={styles.successTitle}>
                  Thank you!
                </Text>
                <Text variant="bodyMedium" style={styles.successSubtitle}>
                  Your donation was submitted successfully.
                </Text>
              </Card.Content>
            </Card>
          </Animated.View>

          <Animated.View style={formAnimatedStyle}>
            <Card style={styles.card}>
              <Card.Content>
                <Text variant="titleMedium" style={styles.sectionTitle}>
                  Make a donation
                </Text>

                <Controller
                  control={control}
                  name="amount"
                  render={({
                    field: { onChange, onBlur, value, ref },
                    fieldState: { error },
                  }) => (
                    <View>
                      <TextInput
                        ref={ref}
                        label="Amount *"
                        mode="outlined"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        keyboardType="decimal-pad"
                        error={!!error}
                        activeOutlineColor={error ? colors.error : colors.primary}
                        placeholder="0.00"
                        style={styles.input}
                        accessibilityLabel="Donation amount"
                        accessibilityHint="Enter the amount you wish to donate in dollars"
                        accessibilityState={{ disabled: mutation.isPending }}
                        returnKeyType="next"
                        onSubmitEditing={() => setFocus('donorName')}
                      />
                      {error?.message && (
                        <Text variant="bodySmall" style={styles.errorText}>
                          {error.message}
                        </Text>
                      )}
                    </View>
                  )}
                />

                <Controller
                  control={control}
                  name="donorName"
                  render={({
                    field: { onChange, onBlur, value, ref },
                    fieldState: { error },
                  }) => (
                    <View>
                      <TextInput
                        ref={ref}
                        label="Your name *"
                        mode="outlined"
                        value={value}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        error={!!error}
                        activeOutlineColor={error ? colors.error : colors.primary}
                        style={styles.input}
                        accessibilityLabel="Donor name"
                        accessibilityHint="Enter your full name"
                        accessibilityState={{ disabled: mutation.isPending }}
                        returnKeyType="next"
                        onSubmitEditing={() => setFocus('message')}
                      />
                      {error?.message && (
                        <Text variant="bodySmall" style={styles.errorText}>
                          {error.message}
                        </Text>
                      )}
                    </View>
                  )}
                />

                <Controller
                  control={control}
                  name="message"
                  render={({
                    field: { onChange, onBlur, value, ref },
                    fieldState: { error },
                  }) => (
                    <View>
                      <TextInput
                        ref={ref}
                        label="Message (optional)"
                        mode="outlined"
                        value={value || ''}
                        onChangeText={onChange}
                        onBlur={onBlur}
                        multiline
                        numberOfLines={3}
                        error={!!error}
                        activeOutlineColor={error ? colors.error : colors.primary}
                        style={[styles.input, styles.messageInput]}
                        accessibilityLabel="Optional message"
                        accessibilityHint="Add a comment or message with your donation"
                        accessibilityState={{ disabled: mutation.isPending }}
                        returnKeyType="done"
                        onSubmitEditing={() => Keyboard.dismiss()}
                      />
                      {error?.message && (
                        <Text variant="bodySmall" style={styles.errorText}>
                          {error.message}
                        </Text>
                      )}
                    </View>
                  )}
                />

                <Button
                  mode="contained"
                  buttonColor={colors.primary}
                  onPress={handleSubmit((data) =>
                    mutation.mutate({
                      amount: Number(data.amount),
                      donorName: data.donorName,
                      message: data.message || undefined,
                    })
                  )}
                  loading={mutation.isPending}
                  disabled={mutation.isPending}
                  style={styles.button}
                  accessibilityLabel="Submit donation"
                  accessibilityHint="Submit your donation"
                >
                  {mutation.isPending ? '' : 'Donate'}
                </Button>
              </Card.Content>
            </Card>
          </Animated.View>
        </View>
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    </>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 24,
  },
  container: {
    position: 'relative',
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    marginBottom: 0,
  },
  sectionTitle: {
    marginBottom: 16,
    color: colors.text,
  },
  input: {
    marginBottom: 8,
    backgroundColor: colors.surface,
  },
  messageInput: {
    minHeight: 80,
  },
  errorText: {
    color: colors.error,
    marginBottom: 8,
    marginTop: -4,
  },
  button: {
    marginTop: 8,
    marginBottom: 8,
  },
  successOverlay: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 10,
  },
  successCard: {
    backgroundColor: colors.successBackground,
    borderRadius: 12,
    padding: 16,
    minWidth: '100%',
  },
  successTitle: {
    color: colors.successTitle,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  successSubtitle: {
    color: colors.successSubtitle,
  },
  spinnerText: {
    color: colors.surface,
    fontSize: 16,
  },
  toastTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  toastMessage: {
    fontSize: 16,
    lineHeight: 22,
  },
});
