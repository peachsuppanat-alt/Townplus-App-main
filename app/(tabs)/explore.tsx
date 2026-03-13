import { Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Image, Platform, SafeAreaView, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

// 🌟 เพิ่มข้อมูลแบบจัดเต็ม ครอบคลุมหลายหมวดหมู่
const MOCK_EVENTS = [
  { id: 'EVT001', title: 'งานวัดภูเขาทอง 2569', category: 'เทศกาลและงานวัด', date: '15 - 20 ก.พ.', distance: '0.5 กม.', image: 'https://cms.dmpcdn.com/travel/2024/10/22/bf86a330-9050-11ef-9ac9-8bc58bd3f671_webp_original.webp' },
  { id: 'EVT002', title: 'ตลาดนัดคลองถม', category: 'ตลาดและช้อปปิ้ง', date: 'ทุกวันศุกร์ - อาทิตย์', distance: '1.2 กม.', image: 'https://shopee.co.th/blog/wp-content/uploads/2023/08/Shopee-Blog-%E0%B8%95%E0%B8%A5%E0%B8%B2%E0%B8%94%E0%B8%82%E0%B8%AD%E0%B8%87%E0%B8%A1%E0%B8%B7%E0%B8%AD%E0%B8%AA%E0%B8%AD%E0%B8%87-%E0%B8%95%E0%B8%A5%E0%B8%B2%E0%B8%94%E0%B8%82%E0%B8%AD%E0%B8%87%E0%B9%80%E0%B8%81%E0%B9%88%E0%B8%B2-%E0%B8%95%E0%B8%A5%E0%B8%B2%E0%B8%94%E0%B8%99%E0%B8%B1%E0%B8%94.jpg' },
  { id: 'EVT_HOT_01', title: 'เทศกาลดนตรีกลางคืน', category: 'ดนตรีและคอนเสิร์ต', date: '28 ก.พ. 2569', distance: '3.5 กม.', image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=500' },
  { id: 'EVT_FOOD', title: 'เทศกาลอาหารไทย', category: 'อาหารและเครื่องดื่ม', date: '10 มี.ค. 2569', distance: '2.0 กม.', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=500' },
  
  // 🌟 ข้อมูลใหม่
  { id: 'EVT_ART', title: 'นิทรรศการศิลปะดิจิทัล', category: 'ศิลปะและนิทรรศการ', date: '1-30 พ.ค. 2569', distance: '4.5 กม.', image: 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?q=80&w=500' },
  { id: 'EVT_PET', title: 'Pet Lover Fair 2026', category: 'สัตว์เลี้ยง', date: '15-18 พ.ค. 2569', distance: '6.0 กม.', image: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?q=80&w=500' },
  { id: 'EVT_WS', title: 'เวิร์กชอปปั้นเซรามิกมินิมอล', category: 'เวิร์กชอปและสัมมนา', date: 'ทุกเสาร์-อาทิตย์', distance: '2.8 กม.', image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=500' },
  { id: 'EVT_RUN', title: 'วิ่งมาราธอน ซิตี้รัน', category: 'กีฬาและเอาท์ดอร์', date: '12 เม.ย. 2569', distance: '5.0 กม.', image: 'https://plus.unsplash.com/premium_photo-1663134254080-a3e9f79ae748?q=80&w=1708&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  { id: 'EVT_VOL', title: 'อาสาปลูกป่าชายเลน บางปู', category: 'ชุมชนและจิตอาสา', date: '20 ส.ค. 2569', distance: '25 กม.', image: 'https://images.unsplash.com/photo-1622383563227-04401ab4e5ea?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  { id: 'EVT_CAMP', title: 'แคมป์ปิ้งดูดาว เขาใหญ่', category: 'ท่องเที่ยวธรรมชาติ', date: '5-7 ธ.ค. 2569', distance: '120 กม.', image: 'https://images.unsplash.com/flagged/photo-1562307294-4060df701fa3?q=80&w=1016&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  { id: 'EVT_SHOP2', title: 'งานเซลล์แบรนด์เนมประจำปี', category: 'ตลาดและช้อปปิ้ง', date: '1-5 ก.ค. 2569', distance: '1.5 กม.', image: 'https://images.unsplash.com/photo-1768775036854-75341e3a022b?q=80&w=1768&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' },
  { id: 'EVT_MUSIC2', title: 'คอนเสิร์ตอินดี้ในสวน', category: 'ดนตรีและคอนเสิร์ต', date: '5 เม.ย. 2569', distance: '2.5 กม.', image: 'https://images.unsplash.com/photo-1749544292533-65b0ec299191?q=80&w=1750&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D' }
];

// 🌟 อัปเดตตัวกรองให้ตรงกับชื่อหมวดหมู่
const FILTERS = [
  'ทั้งหมด', 'อาหารและเครื่องดื่ม', 'ตลาดและช้อปปิ้ง', 'ดนตรีและคอนเสิร์ต', 
  'เทศกาลและงานวัด', 'กีฬาและเอาท์ดอร์', 'ศิลปะและนิทรรศการ', 'สัตว์เลี้ยง', 'ท่องเที่ยวธรรมชาติ'
];

export default function ExploreScreen() {
  const router = useRouter();
  const params = useLocalSearchParams(); 
  
  const [searchQuery, setSearchQuery] = useState('');
  
  const initialCategory = typeof params.category === 'string' ? params.category : 'ทั้งหมด';
  const [activeFilter, setActiveFilter] = useState(initialCategory);
  
  const [events, setEvents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchEventsData = () => {
      setIsLoading(true);
      
      setTimeout(() => {
        let result = [...MOCK_EVENTS]; 
        
        if (activeFilter !== 'ทั้งหมด') {
          result = result.filter(e => e.category === activeFilter);
        }
        
        if (searchQuery.trim() !== '') {
          result = result.filter(e => e.title.toLowerCase().includes(searchQuery.toLowerCase()));
        }
        
        setEvents(result);
        setIsLoading(false); 
      }, 600);
    };

    fetchEventsData();
  }, [activeFilter, searchQuery]); 

  const handleFilter = (filter: string) => { 
    setActiveFilter(filter); 
  };

  const clearSearch = () => {
    setSearchQuery('');
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>สำรวจกิจกรรม</Text>
          <Ionicons name="compass" size={26} color="#FF385C" style={{ marginLeft: 8 }} />
        </View>

        <View style={styles.searchBar}>
          <Ionicons name="search" size={20} color="#94A3B8" />
          <TextInput 
            style={styles.searchInput} 
            placeholder="ค้นหางาน, สถานที่ หรือ คอนเสิร์ต..." 
            value={searchQuery} 
            onChangeText={setSearchQuery} 
          />
          {searchQuery !== '' && (
            <TouchableOpacity onPress={clearSearch}>
              <Ionicons name="close-circle" size={20} color="#94A3B8" />
            </TouchableOpacity>
          )}
        </View>
      </View>

      <View style={{ paddingVertical: 15 }}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20 }}>
          {FILTERS.map(filter => (
            <TouchableOpacity 
              key={filter} 
              onPress={() => handleFilter(filter)}
              style={[styles.filterChip, activeFilter === filter && styles.activeFilterChip]}
            >
              <Text style={[styles.filterText, activeFilter === filter && styles.activeFilterText]}>{filter}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {isLoading ? (
        <View style={styles.center}><ActivityIndicator size="large" color="#FF385C" /></View>
      ) : events.length === 0 ? (
        <View style={styles.center}>
          <Ionicons name="search-outline" size={60} color="#CBD5E1" />
          <Text style={styles.emptyText}>ไม่พบกิจกรรมที่คุณค้นหา</Text>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.listContainer} showsVerticalScrollIndicator={false}>
          {events.map(event => (
            <TouchableOpacity 
              key={event.id} 
              style={styles.eventCard} 
              onPress={() => router.push({ pathname: '/event/[id]', params: { id: event.id } })}
            >
              <Image source={{ uri: event.image }} style={styles.eventImage} />
              <View style={styles.eventInfo}>
                <Text style={styles.eventCategory}>{event.category}</Text>
                <Text style={styles.eventTitle} numberOfLines={2}>{event.title}</Text>
                
                <View style={styles.eventFooter}>
                  <View style={styles.iconTextRow}>
                    <Ionicons name="calendar-outline" size={14} color="#64748B" />
                    <Text style={styles.eventDate}>{event.date}</Text>
                  </View>
                  
                  <View style={styles.iconTextRow}>
                    <Ionicons name="location" size={14} color="#FF385C" />
                    <Text style={styles.eventDistance}>{event.distance}</Text>
                  </View>
                </View>
              </View>
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
  titleContainer: { flexDirection: 'row', alignItems: 'center', marginBottom: 15 },
  title: { fontSize: 24, fontFamily: 'Prompt_700Bold', color: '#0F172A' },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F1F5F9', borderRadius: 12, paddingHorizontal: 15, height: 50 },
  searchInput: { flex: 1, marginLeft: 10, fontFamily: 'Prompt_400Regular', fontSize: 15, color: '#0F172A' },
  filterChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#FFF', borderWidth: 1, borderColor: '#E2E8F0', marginRight: 10 },
  activeFilterChip: { backgroundColor: '#1E1B4B', borderColor: '#1E1B4B' },
  filterText: { fontFamily: 'Prompt_500Medium', color: '#64748B', fontSize: 13 },
  activeFilterText: { color: '#FFF' },
  listContainer: { padding: 20, paddingBottom: 40 },
  eventCard: { flexDirection: 'row', backgroundColor: '#FFF', borderRadius: 16, marginBottom: 15, elevation: 3, shadowColor: '#0F172A', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 8, overflow: 'hidden' },
  eventImage: { width: 110, height: 110 },
  eventInfo: { flex: 1, padding: 12, justifyContent: 'space-between' },
  eventCategory: { fontFamily: 'Prompt_700Bold', fontSize: 10, color: '#FF385C', textTransform: 'uppercase' },
  eventTitle: { fontFamily: 'Prompt_700Bold', fontSize: 15, color: '#0F172A', lineHeight: 22 },
  eventFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  iconTextRow: { flexDirection: 'row', alignItems: 'center' },
  eventDate: { fontFamily: 'Prompt_400Regular', fontSize: 11, color: '#64748B', marginLeft: 4 }, 
  eventDistance: { fontFamily: 'Prompt_500Medium', fontSize: 11, color: '#475569', marginLeft: 4 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  emptyText: { fontFamily: 'Prompt_400Regular', color: '#94A3B8', marginTop: 15, fontSize: 15 }
});