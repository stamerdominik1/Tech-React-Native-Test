import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  RefreshControl,
} from 'react-native';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { RouteProp, useRoute } from '@react-navigation/native';
import { api } from '../services/api';
import DonationForm from '../components/DonationForm';
import DonationsList from '../components/DonationsList';
import { colors } from '../theme';

type RootStackParamList = {
  FundraiserDetail: { fundraiserId: number };
};

type FundraiserDetailRouteProp = RouteProp<RootStackParamList, 'FundraiserDetail'>;

interface Fundraiser {
  id: number;
  title: string;
  description: string;
  goal: number;
  raised: number;
  imageUrl: string;
  createdAt: string;
  status: string;
}

export default function FundraiserDetailScreen() {
  const route = useRoute<FundraiserDetailRouteProp>();
  const { fundraiserId } = route.params;
  const queryClient = useQueryClient();

  const {
    data,
    isLoading,
    error,
    refetch: refetchFundraiser,
  } = useQuery({
    queryKey: ['fundraiser', fundraiserId],
    queryFn: () => api.getFundraiser(fundraiserId),
  });

  const fundraiser = data?.data;
  const [refreshing, setRefreshing] = React.useState(false);
  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await Promise.all([
      queryClient.refetchQueries({ queryKey: ['fundraiser', fundraiserId] }),
      queryClient.refetchQueries({ queryKey: ['donations', fundraiserId] }),
    ]);
    setRefreshing(false);
  }, [queryClient, fundraiserId]);

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  if (error || !fundraiser) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Error loading fundraiser</Text>
      </View>
    );
  }

  const progress = (fundraiser.raised / fundraiser.goal) * 100;

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <Image source={{ uri: fundraiser.imageUrl }} style={styles.image} />
      <View style={styles.content}>
        <Text style={styles.title}>{fundraiser.title}</Text>
        <Text style={styles.description}>{fundraiser.description}</Text>
        
        <View style={styles.progressSection}>
          <View style={styles.progressBar}>
            <View style={[styles.progressFill, { width: `${Math.min(progress, 100)}%` }]} />
          </View>
          <View style={styles.amountContainer}>
            <Text style={styles.raised}>${fundraiser.raised.toLocaleString()}</Text>
            <Text style={styles.goal}>of ${fundraiser.goal.toLocaleString()} goal</Text>
          </View>
          <Text style={styles.percentage}>{Math.round(progress)}% funded</Text>
        </View>

        <DonationForm fundraiserId={fundraiserId} />
        <DonationsList fundraiserId={fundraiserId} scrollEnabled={false} />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  image: {
    width: '100%',
    height: 300,
    backgroundColor: colors.surfaceMuted,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 12,
    color: colors.text,
  },
  description: {
    fontSize: 16,
    color: colors.textSecondary,
    marginBottom: 24,
    lineHeight: 24,
  },
  progressSection: {
    backgroundColor: colors.surface,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  progressBar: {
    height: 12,
    backgroundColor: colors.surfaceMuted,
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 12,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  amountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  raised: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.primary,
  },
  goal: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  percentage: {
    fontSize: 14,
    color: colors.textMuted,
    textAlign: 'center',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: colors.error,
    fontSize: 16,
  },
});

