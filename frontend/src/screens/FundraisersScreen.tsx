import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { useQuery } from '@tanstack/react-query';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { useNavigation } from '@react-navigation/native';
import { api } from '../services/api';
import { colors } from '../theme';

type RootStackParamList = {
  Fundraisers: undefined;
  FundraiserDetail: { fundraiserId: number };
};

type NavigationProp = NativeStackNavigationProp<RootStackParamList, 'Fundraisers'>;

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

export default function FundraisersScreen() {
  const navigation = useNavigation<NavigationProp>();

  const { data, isLoading, error } = useQuery({
    queryKey: ['fundraisers'],
    queryFn: () => api.getFundraisers(),
  });

  const fundraisers = data?.data || [];

  const renderFundraiser = ({ item }: { item: Fundraiser }) => {
    const progress = (item.raised / item.goal) * 100;

    return (
      <TouchableOpacity
        style={styles.card}
        onPress={() => navigation.navigate('FundraiserDetail', { fundraiserId: item.id })}
        activeOpacity={0.7}
      >
        <Image source={{ uri: item.imageUrl }} style={styles.image} />
        <View style={styles.content}>
          <Text style={styles.title}>{item.title}</Text>
          <Text style={styles.description} numberOfLines={2}>
            {item.description}
          </Text>
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${Math.min(progress, 100)}%` }]} />
            </View>
            <View style={styles.amountContainer}>
              <Text style={styles.raised}>${item.raised.toLocaleString()}</Text>
              <Text style={styles.goal}>of ${item.goal.toLocaleString()}</Text>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  if (isLoading) {
    return (
      <View style={styles.centerContainer}>
        <Text>Loading fundraisers...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.errorText}>Error loading fundraisers</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={fundraisers}
        renderItem={renderFundraiser}
        keyExtractor={(item) => item.id.toString()}
        contentContainerStyle={styles.list}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  list: {
    padding: 16,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 12,
    marginBottom: 16,
    overflow: 'hidden',
    shadowColor: colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  image: {
    width: '100%',
    height: 200,
    backgroundColor: colors.surfaceMuted,
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 8,
    color: colors.text,
  },
  description: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
  },
  progressContainer: {
    marginTop: 8,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.surfaceMuted,
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: colors.primary,
  },
  amountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  raised: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.primary,
  },
  goal: {
    fontSize: 14,
    color: colors.textSecondary,
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

