import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// 🌟 Mock Data รอ Backend
const SAVED_EVENTS = [
  { id: 'EVT001', title: 'งานวัดภูเขาทอง 2569', date: '15 - 20 ก.พ.', location: 'วัดสระเกศ', image: 'https://images.unsplash.com/photo-1533900298318-6b8da08a523e?q=80&w=500' },
  { id: 'EVT_HOT_01', title: 'เทศกาลดนตรีกลางคืน', date: '28 ก.พ. 2569', location: 'ลานคนเมือง', image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=500' },
];

export default function SavedScreen() {
  const router = useRouter();
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // 🔌 TODO: Backend ดึงข้อมูลรายการโปรดด้วย User ID
    setTimeout(() => { setEvents(SAVED_EVENTS); setIsLoading(false); }, 500);
  }, []);

  const handleRemove = (id: string) => {
    // 🔌 TODO: Backend ลบข้อมูลออกจาก Table Favorites
    Alert.alert('ลบเรียบร้อย', 'นำกิจกรรมออกจากรายการโปรดแล้ว');
    setEvents(events.filter(e => e.id !== id));
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        {/* เปลี่ยน ❤️ เป็น Ionicons และจัดเรียงแนวนอน */}
        <View style={styles.titleRow}>
          <Text style={styles.title}>ที่บันทึกไว้</Text>
          <Ionicons name="heart" size={24} color="#FF385C" style={styles.headerIcon} />
        </View>
      </View>

      {isLoading ? (
        <View style={styles.center}><ActivityIndicator size="large" color="#FF385C" /></View>
      ) : events.length === 0 ? (
        <View style={styles.center}>
          <Ionicons name="heart-dislike-outline" size={60} color="#CBD5E1" />
          <Text style={styles.emptyText}>คุณยังไม่ได้บันทึกกิจกรรมใดๆ</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.listContainer} showsVerticalScrollIndicator={false}>
          {events.map(event => (
            <TouchableOpacity 
              key={event.id} 
              style={styles.card} 
              onPress={() => router.push({ pathname: '/event/[id]', params: { id: event.id } })}
            >
              <Image source={{ uri: event.image }} style={styles.cardImage} />
              
              <View style={styles.cardInfo}>
                <Text style={styles.cardTitle} numberOfLines={2}>{event.title}</Text>
                
                {/* เปลี่ยน 📅 และ 📍 เป็น Ionicons พร้อมจัด Layout แนวนอน */}
                <View style={styles.subtitleRow}>
                  <Ionicons name="calendar-outline" size={14} color="#64748B" />
                  <Text style={styles.cardSubtitle}>{event.date}</Text>
                  
                  <Text style={styles.dotSeparator}>•</Text>
                  
                  <Ionicons name="location-outline" size={14} color="#64748B" />
                  <Text style={styles.cardSubtitle}>{event.location}</Text>
                </View>

              </View>

              <TouchableOpacity style={styles.heartBtn} onPress={() => handleRemove(event.id)}>
                <Ionicons name="heart" size={24} color="#FF385C" />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC', paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0 },
  header: { padding: 20, backgroundColor: '#FFF', borderBottomWidth: 1, borderBottomColor: '#F1F5F9' },
  
  // เพิ่ม Style สำหรับจัดเรียง Header
  titleRow: { flexDirection: 'row', alignItems: 'center' },
  title: { fontSize: 24, fontFamily: 'Prompt_700Bold', color: '#0F172A' },
  headerIcon: { marginLeft: 8 }, // ดันไอคอนหัวใจให้ห่างจากข้อความเล็กน้อย

  listContainer: { padding: 20 },
  card: { flexDirection: 'row', backgroundColor: '#FFF', borderRadius: 16, marginBottom: 15, elevation: 3, shadowColor: '#0F172A', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 8, overflow: 'hidden', alignItems: 'center' },
  cardImage: { width: 90, height: 90 },
  cardInfo: { flex: 1, padding: 15 },
  cardTitle: { fontFamily: 'Prompt_700Bold', fontSize: 15, color: '#0F172A', marginBottom: 5 },
  
  // เพิ่ม Style สำหรับจัดเรียง Subtitle ที่เป็นไอคอน
  subtitleRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  cardSubtitle: { fontFamily: 'Prompt_400Regular', fontSize: 12, color: '#64748B', marginLeft: 4 },
  dotSeparator: { marginHorizontal: 6, color: '#64748B', fontSize: 12 },

  heartBtn: { padding: 15 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontFamily: 'Prompt_400Regular', color: '#94A3B8', marginTop: 15, fontSize: 15 }
});