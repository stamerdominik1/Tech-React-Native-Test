import React from 'react';
import {
  View,
  StyleSheet,
  FlatList,
  RefreshControl,
  ListRenderItem,
} from 'react-native';
import { useQuery } from '@tanstack/react-query';
import Animated, { FadeInDown } from 'react-native-reanimated';
import { Card, Text as PaperText, ActivityIndicator } from 'react-native-paper';
import { api } from '../services/api';
import { formatRelativeTime } from '../utils/dateUtils';
import type { Donation } from '../interfaces/donation';
import { colors } from '../theme';

interface DonationsListProps {
  fundraiserId: number;
  scrollEnabled?: boolean;
}

function DonationListItem({
  item,
  index,
}: {
  item: Donation;
  index: number;
}) {
  return (
    <Animated.View
      entering={FadeInDown.delay(index * 50).springify().damping(15)}
      style={styles.itemWrapper}
    >
      <Card style={styles.itemCard}>
        <Card.Content>
          <View style={styles.itemHeader}>
            <PaperText variant="titleMedium" style={styles.donorName}>
              {item.donorName}
            </PaperText>
            <PaperText variant="titleMedium" style={styles.amount}>
              ${item.amount.toLocaleString('en-US', {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}
            </PaperText>
          </View>
          {item.message ? (
            <PaperText variant="bodyMedium" style={styles.message}>
              {item.message}
            </PaperText>
          ) : null}
          <PaperText variant="bodySmall" style={styles.timestamp}>
            {formatRelativeTime(item.createdAt)}
          </PaperText>
        </Card.Content>
      </Card>
    </Animated.View>
  );
}

export default function DonationsList({
  fundraiserId,
  scrollEnabled = true,
}: DonationsListProps) {
  const {
    data,
    isLoading,
    error,
    refetch,
    isRefetching,
  } = useQuery({
    queryKey: ['donations', fundraiserId],
    queryFn: () => api.getDonations(fundraiserId),
  });

  const donations: Donation[] = data?.data ?? [];

  const renderItem: ListRenderItem<Donation> = ({ item, index }) => (
    <DonationListItem item={item} index={index} />
  );

  const keyExtractor = (item: Donation) => item.id.toString();

  const ListEmpty = () => {
    if (isLoading) {
      return (
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" />
          <PaperText variant="bodyMedium" style={styles.emptyText}>
            Loading donations...
          </PaperText>
        </View>
      );
    }
    if (error) {
      return (
        <View style={styles.emptyContainer}>
          <PaperText variant="bodyLarge" style={styles.errorTitle}>
            Couldn't load donations
          </PaperText>
          <PaperText variant="bodyMedium" style={styles.errorSubtitle}>
            Pull down to try again.
          </PaperText>
        </View>
      );
    }
    if (donations.length === 0) {
      return (
        <View style={styles.emptyContainer}>
          <PaperText variant="bodyLarge" style={styles.emptyTitle}>
            No donations yet
          </PaperText>
          <PaperText variant="bodyMedium" style={styles.emptyText}>
            Be the first to support this fundraiser!
          </PaperText>
        </View>
      );
    }
    return null;
  };

  const ListHeader = () =>
    donations.length > 0 ? (
      <PaperText variant="titleMedium" style={styles.sectionTitle}>
        Recent donations
      </PaperText>
    ) : null;

  return (
    <View style={styles.container}>
      <FlatList
        data={donations}
        renderItem={renderItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={ListEmpty}
        contentContainerStyle={
          donations.length === 0 ? styles.emptyList : styles.listContent
        }
        scrollEnabled={scrollEnabled && donations.length > 0}
        refreshControl={
          scrollEnabled ? (
            <RefreshControl
              refreshing={isRefetching && !isLoading}
              onRefresh={() => refetch()}
            />
          ) : undefined
        }
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    minHeight: 200,
  },
  listContent: {
    paddingBottom: 24,
  },
  emptyList: {
    flexGrow: 1,
  },
  sectionTitle: {
    marginBottom: 12,
    color: colors.text,
  },
  itemWrapper: {
    marginBottom: 10,
  },
  itemCard: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    overflow: 'hidden',
  },
  itemHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  donorName: {
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  amount: {
    fontWeight: '700',
    color: colors.primary,
  },
  message: {
    color: colors.textSecondary,
    marginBottom: 6,
    fontStyle: 'italic',
  },
  timestamp: {
    color: colors.textMuted,
  },
  emptyContainer: {
    paddingVertical: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    color: colors.textSecondary,
    marginBottom: 8,
  },
  emptyText: {
    color: colors.textMuted,
  },
  errorTitle: {
    color: colors.error,
    marginBottom: 8,
  },
  errorSubtitle: {
    color: colors.textSecondary,
  },
});
