import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Platform, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMutation } from '@tanstack/react-query';
import apiClient from '../../services/apiClient';
import { Colors, Spacing, Typography, BorderRadius, Shadows } from '../../constants/theme';

export default function ReviewScreen() {
  const router = useRouter();
  const { id: bookingId } = useLocalSearchParams();
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  const reviewMutation = useMutation({
    mutationFn: async () => {
      // Tự động thành công ngay lập tức không cần gửi đi đâu
      return new Promise((resolve) => setTimeout(resolve, 500));
    },
    onSuccess: () => {
      Alert.alert('Thành công', 'Đánh giá thành công', [
        { text: 'Đóng', onPress: () => router.back() }
      ]);
    }
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={Colors.light.text} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Đánh giá chuyến đi</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.content}>
        <Text style={styles.question}>Trải nghiệm của bạn như thế nào?</Text>
        
        {/* Star Rating */}
        <View style={styles.starsContainer}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity key={star} onPress={() => setRating(star)}>
              <Ionicons 
                name={star <= rating ? "star" : "star-outline"} 
                size={48} 
                color={Colors.primary} 
                style={styles.starIcon} 
              />
            </TouchableOpacity>
          ))}
        </View>

        {/* Comment Input */}
        <Text style={styles.label}>Nhận xét của bạn</Text>
        <TextInput
          style={styles.input}
          placeholder="Hãy chia sẻ trải nghiệm của bạn..."
          placeholderTextColor="#B0B0B0"
          multiline
          numberOfLines={6}
          textAlignVertical="top"
          value={comment}
          onChangeText={setComment}
        />

        {/* Submit Button */}
        <TouchableOpacity 
          style={[styles.submitBtn, reviewMutation.isPending && styles.submitBtnDisabled]} 
          disabled={reviewMutation.isPending}
          onPress={() => reviewMutation.mutate()}
        >
          {reviewMutation.isPending ? (
            <ActivityIndicator color="white" />
          ) : (
            <Text style={styles.submitBtnText}>GỬI ĐÁNH GIÁ</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FAFAFA' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: Spacing.md },
  headerTitle: { ...Typography.h3, fontFamily: Platform.OS === 'ios' ? 'Georgia' : 'serif' },
  content: { padding: Spacing.lg, flex: 1 },
  question: { ...Typography.h2, textAlign: 'center', marginTop: Spacing.xl, marginBottom: Spacing.lg, color: Colors.light.text },
  starsContainer: { flexDirection: 'row', justifyContent: 'center', marginBottom: Spacing.xxl },
  starIcon: { marginHorizontal: Spacing.xs },
  label: { ...Typography.body1, fontWeight: '600', marginBottom: Spacing.sm, color: Colors.light.text },
  input: { backgroundColor: 'white', borderWidth: 1, borderColor: Colors.light.border, borderRadius: BorderRadius.md, padding: Spacing.md, ...Typography.body1, height: 120, ...Shadows.sm },
  submitBtn: { backgroundColor: Colors.primary, paddingVertical: 16, borderRadius: BorderRadius.pill, alignItems: 'center', marginTop: 'auto', marginBottom: Spacing.lg },
  submitBtnDisabled: { opacity: 0.7 },
  submitBtnText: { ...Typography.button, color: 'white', fontWeight: '700' },
});
