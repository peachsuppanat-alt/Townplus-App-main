import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Dimensions, Image, Platform, ScrollView, StatusBar, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

// 🌟 Mockup โดนลบ reviews ออกแล้ว เพื่อรอรับจาก DB ล้วนๆ
const MOCK_EVENTS: any = {
  '1': { dbId: 1, title: 'งานวัดภูเขาทอง 2569', date: '15 - 20 ก.พ. 2569 • 16:00 - 23:00 น.', location: 'วัดสระเกศราชวรมหาวิหาร', distance: '0.5 กม.', price: 'เข้าฟรี', description: 'กลับมาอีกครั้งกับงานวัดที่ยิ่งใหญ่ที่สุดในกรุงเทพฯ สัมผัสบรรยากาศงานวัดย้อนยุค ของกินอร่อยๆ เพียบ ชิงช้าสวรรค์ ม้าหมุน พร้อมชมวิวกรุงเทพฯ แบบ 360 องศา', image: 'https://cms.dmpcdn.com/travel/2024/10/22/bf86a330-9050-11ef-9ac9-8bc58bd3f671_webp_original.webp', tags: ['เทศกาล', 'ของกิน', 'ถ่ายรูปสวย'], lat: 13.7538, lng: 100.5066, adminPicks: [{ id: '1', title: 'ผัดไทยเจ๊ต้อย', desc: 'ผัดไทยเตาถ่านคิวยาว ห้ามพลาด!', image: 'https://images.unsplash.com/photo-1559314809-0d155014e29e?q=80&w=400' }] },
  '2': { dbId: 2, title: 'ตลาดนัดคลองถม (Night Market)', date: 'ทุกวันศุกร์ - อาทิตย์ • 18:00 - 01:00 น.', location: 'ย่านคลองถม กรุงเทพฯ', distance: '1.2 กม.', price: 'เข้าฟรี', description: 'สวรรค์ของนักช้อปปิ้งของมือสอง ของสะสม อะไหล่รถยนต์ และของวินเทจหายาก เดินชิลๆ ยามค่ำคืนพร้อมสตรีทฟู้ดอร่อยๆ ตลอดทาง', image: 'https://shopee.co.th/blog/wp-content/uploads/2023/08/Shopee-Blog-%E0%B8%95%E0%B8%A5%E0%B8%B2%E0%B8%94%E0%B8%82%E0%B8%AD%E0%B8%87%E0%B8%A1%E0%B8%B7%E0%B8%AD%E0%B8%AA%E0%B8%AD%E0%B8%87-%E0%B8%95%E0%B8%A5%E0%B8%B2%E0%B8%94%E0%B8%82%E0%B8%AD%E0%B8%87%E0%B9%80%E0%B8%81%E0%B9%88%E0%B8%B2-%E0%B8%95%E0%B8%A5%E0%B8%B2%E0%B8%94%E0%B8%99%E0%B8%B1%E0%B8%94.jpg', tags: ['ช้อปปิ้ง', 'ของมือสอง', 'สตรีทฟู้ด'], lat: 13.7465, lng: 100.5061, adminPicks: [] },
  '3': { dbId: 3, title: 'เทศกาลดนตรีกลางคืน (Night Vibe Fest)', date: '28 ก.พ. 2569 • 18:00 - 24:00 น.', location: 'ลานคนเมือง', distance: '3.5 กม.', price: '599.-', description: 'ปลดปล่อยความสนุกไปกับเสียงดนตรีจากศิลปินอินดี้ชั้นนำ พร้อมแสงสีเสียงจัดเต็ม', image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?q=80&w=800&auto=format&fit=crop', tags: ['คอนเสิร์ต', 'ดนตรีสด'], lat: 13.7525, lng: 100.5003, adminPicks: [] },
  '4': { dbId: 4, title: 'เทศกาลอาหารไทย', date: '10 มี.ค. 2569 • 10:00 - 21:00 น.', location: 'ศูนย์สิริกิติ์', distance: '2.0 กม.', price: 'เข้าฟรี', description: 'รวมร้านอาหารระดับมิชลินสตาร์และสตรีทฟู้ดชื่อดังจากทั่วประเทศไทยมาไว้ในที่เดียว พร้อมโปรโมชั่นพิเศษเพียบ', image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=800', tags: ['อาหาร', 'สตรีทฟู้ด'], lat: 13.7265, lng: 100.5588, adminPicks: [] },
  '5': { dbId: 5, title: 'นิทรรศการศิลปะดิจิทัล', date: '1-30 พ.ค. 2569 • 10:00 - 19:00 น.', location: 'BACC หอศิลป์ฯ', distance: '4.5 กม.', price: '200.-', description: 'นิทรรศการศิลปะแบบ Immersive Art ที่จะพาคุณดำดิ่งไปในโลกแห่งแสงสีและจินตนาการ ถ่ายรูปสวยทุกมุม', image: 'https://images.unsplash.com/photo-1547891654-e66ed7ebb968?q=80&w=800', tags: ['ศิลปะ', 'นิทรรศการ'], lat: 13.7466, lng: 100.5300, adminPicks: [] },
  '6': { dbId: 6, title: 'Pet Lover Fair 2026', date: '15-18 พ.ค. 2569 • 10:00 - 20:00 น.', location: 'อิมแพ็ค เมืองทองธานี', distance: '6.0 กม.', price: '100.-', description: 'งานแฟร์สำหรับคนรักสัตว์เลี้ยง พบกับสินค้าลดราคา คลินิกตรวจสุขภาพฟรี และการประกวดความสามารถน้องหมาน้องแมว', image: 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?q=80&w=800', tags: ['สัตว์เลี้ยง', 'ช้อปปิ้ง'], lat: 13.9113, lng: 100.5484, adminPicks: [] },
  '7': { dbId: 7, title: 'เวิร์กชอปปั้นเซรามิกมินิมอล', date: 'ทุกเสาร์-อาทิตย์ • 13:00 - 16:00 น.', location: 'สตูดิโอ อารีย์', distance: '2.8 กม.', price: '1,200.-', description: 'เรียนรู้พื้นฐานการปั้นเซรามิกด้วยมือแบบง่ายๆ ได้ผลงานกลับบ้าน 2 ชิ้น รวมอุปกรณ์และเครื่องดื่ม 1 แก้ว', image: 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?q=80&w=800', tags: ['เวิร์กชอป', 'งานคราฟต์'], lat: 13.7797, lng: 100.5446, adminPicks: [] },
  '8': { dbId: 8, title: 'วิ่งมาราธอน ซิตี้รัน', date: '12 เม.ย. 2569 • 04:00 - 10:00 น.', location: 'สวนลุมพินี', distance: '5.0 กม.', price: '850.-', description: 'งานวิ่งมาราธอนใจกลางเมืองหลวง สัมผัสอากาศยามเช้าและวิวตึกระฟ้า มีระยะทาง 5K, 10K และ 21K', image: 'https://plus.unsplash.com/premium_photo-1663134254080-a3e9f79ae748?q=80&w=1708&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', tags: ['กีฬา', 'วิ่ง'], lat: 13.7314, lng: 100.5415, adminPicks: [] },
  '9': { dbId: 9, title: 'อาสาปลูกป่าชายเลน บางปู', date: '20 ส.ค. 2569 • 08:00 - 12:00 น.', location: 'สถานตากอากาศบางปู', distance: '25 กม.', price: 'ฟรี', description: 'ร่วมเป็นส่วนหนึ่งในการอนุรักษ์ธรรมชาติ ปลูกต้นโกงกางและทำความสะอาดป่าชายเลน พร้อมรับประกาศนียบัตร', image: 'https://images.unsplash.com/photo-1622383563227-04401ab4e5ea?q=80&w=774&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', tags: ['จิตอาสา', 'ธรรมชาติ'], lat: 13.5186, lng: 100.6542, adminPicks: [] },
  '10': { dbId: 10, title: 'แคมป์ปิ้งดูดาว เขาใหญ่', date: '5-7 ธ.ค. 2569', location: 'อุทยานแห่งชาติเขาใหญ่', distance: '120 กม.', price: '1,500.-', description: 'ทริปแคมป์ปิ้งหน้าหนาว นอนดูดาวท่ามกลางธรรมชาติที่สมบูรณ์ที่สุด มีผู้เชี่ยวชาญบรรยายเรื่องกลุ่มดาว', image: 'https://images.unsplash.com/flagged/photo-1562307294-4060df701fa3?q=80&w=1016&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', tags: ['ท่องเที่ยว', 'แคมป์ปิ้ง'], lat: 14.4392, lng: 101.3723, adminPicks: [] },
  '11': { dbId: 11, title: 'งานเซลล์แบรนด์เนมประจำปี', date: '1-5 ก.ค. 2569 • 10:00 - 22:00 น.', location: 'Siam Paragon', distance: '1.5 กม.', price: 'เข้าฟรี', description: 'ลดล้างสต๊อกสินค้าแบรนด์เนมระดับไฮเอนด์สูงสุด 80% ทั้งกระเป๋า รองเท้า และเสื้อผ้า', image: 'https://images.unsplash.com/photo-1768775036854-75341e3a022b?q=80&w=1768&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', tags: ['ช้อปปิ้ง', 'แบรนด์เนม'], lat: 13.7468, lng: 100.5346, adminPicks: [] },
  '12': { dbId: 12, title: 'คอนเสิร์ตอินดี้ในสวน', date: '5 เม.ย. 2569 • 16:00 - 22:00 น.', location: 'สวนเบญจกิติ', distance: '2.5 กม.', price: '300.-', description: 'ฟังเพลงอินดี้ฟังสบายท่ามกลางธรรมชาติในสวนสาธารณะใจกลางเมือง พกเสื่อมาปิกนิกได้เลย', image: 'https://images.unsplash.com/photo-1749544292533-65b0ec299191?q=80&w=1750&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D', tags: ['ดนตรี', 'ปิกนิก'], lat: 13.7292, lng: 100.5594, adminPicks: [] }
};

export default function EventDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams(); 
  
  const [eventData, setEventData] = useState<any>(null);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); 
  const [userData, setUserData] = useState<any>(null);
  
  const [reviewText, setReviewText] = useState('');
  const [userRating, setUserRating] = useState(0); 
  const [reviewsList, setReviewsList] = useState<any[]>([]);
  const [avgRating, setAvgRating] = useState('0.0');
  const [totalReviewsCount, setTotalReviewsCount] = useState(0);

  const fetchReviews = async (dbId: number) => {
    try {
      const res = await fetch(`http://192.168.174.35:3000/events/${dbId}/reviews`);
      const result = await res.json();
      if (result.status === 'success') {
        setReviewsList(result.reviews);
        setAvgRating(result.averageRating);
        setTotalReviewsCount(result.totalReviews);
      }
    } catch (e) {
      console.error('Error fetching reviews:', e);
    }
  };

  useEffect(() => {
    const fetchEventAndCheckFavorite = async () => {
      const storedUser = await AsyncStorage.getItem('user_data');
      let currentUser = null;

      if (storedUser) {
        setIsLoggedIn(true);
        currentUser = JSON.parse(storedUser);
        setUserData(currentUser);
      }

      const dataId = id ? (id as string) : '1';
      const data = MOCK_EVENTS[dataId] || { title: 'กิจกรรมนี้ถูกลบแล้ว', date: '-', location: '-', tags: [] };
      setEventData(data);

      if (data.dbId) {
        fetchReviews(data.dbId);
        
        if (currentUser) {
          try {
            const response = await fetch(`http://192.168.174.35:3000/saved-events/${currentUser.id}`);
            const result = await response.json();
            if (result.status === 'success') {
              const isSaved = result.data.some((savedEvent: any) => savedEvent.id === data.dbId);
              setIsFavorite(isSaved);
            }
          } catch (error) {}
        }
      }
    };
    fetchEventAndCheckFavorite();
  }, [id]);

  const handleToggleFavorite = async () => {
    if (!isLoggedIn || !userData) {
      Alert.alert('ต้องเข้าสู่ระบบ', 'คุณต้องเข้าสู่ระบบก่อน จึงจะสามารถบันทึกกิจกรรมได้', [{ text: 'ไปหน้า Login', onPress: () => router.push('/') }]);
      return;
    }
    if (!eventData?.dbId) return;
    setIsFavorite(!isFavorite);
    try {
      await fetch('http://192.168.174.35:3000/toggle-save', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userData.id, event_id: eventData.dbId }) 
      });
    } catch (error) { setIsFavorite(isFavorite); }
  };

  const handleNavigate = () => { /* ฟังก์ชันนำทางคงเดิม */ };

  const handleSubmitReview = async () => {
    if (!isLoggedIn || !userData) {
      Alert.alert('ต้องเข้าสู่ระบบ', 'คุณต้องเข้าสู่ระบบก่อน จึงจะสามารถให้คะแนนและคอมเมนต์ได้', [{ text: 'ไปหน้า Login', onPress: () => router.push('/') }]);
      return;
    }
    if (userRating === 0) {
      Alert.alert('แจ้งเตือน', 'กรุณากดให้คะแนนดาวก่อนส่งรีวิวครับ ⭐');
      return;
    }
    if (!reviewText.trim()) {
      Alert.alert('แจ้งเตือน', 'กรุณาพิมพ์ความคิดเห็นของคุณก่อนส่ง');
      return;
    }

    try {
      const response = await fetch('http://192.168.174.35:3000/add-review', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userData.id, event_id: eventData.dbId, rating: userRating, comment: reviewText })
      });
      const data = await response.json();
      if (data.status === 'success') {
        setUserRating(0); 
        setReviewText(''); 
        fetchReviews(eventData.dbId); // ดึงรีวิวและดาวอัปเดตใหม่ทันที
      }
    } catch (error) {
      Alert.alert('ข้อผิดพลาด', 'ไม่สามารถส่งรีวิวได้ในขณะนี้');
    }
  };

  if (!eventData) return <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}><ActivityIndicator size="large" color="#FF385C" /></View>;

  return (
    <View style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingBottom: 100 }}>
        
        <View style={styles.imageContainer}>
          <Image source={{ uri: eventData?.image }} style={styles.heroImage} />
          <View style={styles.topBar}>
            <TouchableOpacity style={styles.iconCircle} onPress={() => router.back()}><Ionicons name="arrow-back" size={24} color="#0F172A" /></TouchableOpacity>
            <TouchableOpacity style={styles.iconCircle} onPress={handleToggleFavorite}><Ionicons name={isFavorite ? "heart" : "heart-outline"} size={24} color={isFavorite ? "#FF385C" : "#0F172A"} /></TouchableOpacity>
          </View>
        </View>

        <View style={styles.contentContainer}>
          <View style={styles.rowBetween}>
            <View style={{ flexDirection: 'row' }}>
              {(eventData?.tags || []).map((tag: string, index: number) => (
                <View key={index} style={styles.tagBadge}><Text style={styles.tagText}>{tag}</Text></View>
              ))}
            </View>
            <View style={styles.ratingBadge}>
              <Ionicons name="star" size={14} color="#FBBF24" />
              <Text style={styles.ratingText}>{avgRating} <Text style={styles.reviewText}>({totalReviewsCount})</Text></Text>
            </View>
          </View>

          <Text style={styles.title}>{eventData?.title}</Text>
          <View style={styles.divider} />

          <View style={styles.infoRow}>
            <View style={styles.infoIconBox}><Ionicons name="calendar" size={20} color="#FF385C" /></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.infoTitle}>วันและเวลา</Text>
              <Text style={styles.infoDetail}>{eventData?.date}</Text>
            </View>
          </View>

          <View style={styles.infoRow}>
            <View style={styles.infoIconBox}><Ionicons name="location" size={20} color="#FF385C" /></View>
            <View style={{ flex: 1 }}>
              <Text style={styles.infoTitle}>สถานที่จัดงาน</Text>
              <Text style={styles.infoDetail}>{eventData?.location}</Text>
            </View>
          </View>

          <Text style={styles.sectionTitle}>เกี่ยวกับกิจกรรม</Text>
          <Text style={styles.descriptionText}>{eventData?.description}</Text>

          <View style={styles.divider} />

          <View style={{ marginBottom: 30 }}>
            <Text style={styles.sectionTitle}>ความคิดเห็นจากผู้ใช้</Text>
            <View style={styles.reviewForm}>
              <Text style={styles.reviewFormTitle}>คุณคิดอย่างไรกับงานนี้?</Text>
              <View style={{ flexDirection: 'row', marginBottom: 10 }}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity key={star} onPress={() => setUserRating(star)} activeOpacity={0.7}>
                    <Ionicons name={star <= userRating ? "star" : "star-outline"} size={32} color={star <= userRating ? "#FBBF24" : "#D1D5DB"} style={{ marginRight: 8 }} />
                  </TouchableOpacity>
                ))}
              </View>
              <TextInput style={styles.reviewInput} placeholder="แบ่งปันประสบการณ์ของคุณ..." multiline value={reviewText} onChangeText={setReviewText} />
              <TouchableOpacity style={styles.submitReviewBtn} onPress={handleSubmitReview}>
                <Text style={styles.submitReviewText}>ส่งรีวิว</Text>
              </TouchableOpacity>
            </View>

            {/* 🌟 แสดงคอมเมนต์ไดนามิกตรงปก 100% */}
            {reviewsList.length === 0 ? (
              <Text style={{ fontFamily: 'Prompt_400Regular', color: '#94A3B8', textAlign: 'center', marginTop: 10 }}>ยังไม่มีรีวิว เป็นคนแรกที่รีวิวกิจกรรมนี้สิ!</Text>
            ) : (
              reviewsList.map((rev: any) => (
                <View key={rev.id} style={styles.reviewItem}>
                  <View style={styles.reviewHeader}>
                    <View style={styles.reviewAvatar}>
                      <Text style={{ fontFamily: 'Prompt_700Bold', color: '#FFF' }}>{rev.username ? rev.username.charAt(0).toUpperCase() : 'U'}</Text>
                    </View>
                    <View style={{ flex: 1, marginLeft: 10 }}>
                      <Text style={styles.reviewUser}>{rev.username}</Text>
                      <Text style={styles.reviewDate}>{new Date(rev.created_at).toLocaleDateString('th-TH', { year: 'numeric', month: 'short', day: 'numeric' })}</Text>
                    </View>
                    <View style={styles.ratingBadge}>
                      <Ionicons name="star" size={12} color="#FBBF24" />
                      <Text style={styles.ratingText}>{rev.rating}</Text>
                    </View>
                  </View>
                  <Text style={styles.reviewComment}>{rev.comment}</Text>
                </View>
              ))
            )}
          </View>
        </View>
      </ScrollView>

      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.mapButton} onPress={handleNavigate} activeOpacity={0.8}>
          <Ionicons name="navigate-circle" size={28} color="#FFF" />
          <Text style={styles.mapButtonText}>นำทาง</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  imageContainer: { width: '100%', height: 350, position: 'relative' },
  heroImage: { width: '100%', height: '100%' },
  topBar: { position: 'absolute', top: Platform.OS === 'ios' ? 50 : StatusBar.currentHeight! + 10, left: 20, right: 20, flexDirection: 'row', justifyContent: 'space-between' },
  iconCircle: { width: 44, height: 44, borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.95)', justifyContent: 'center', alignItems: 'center', elevation: 4, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 4 },
  contentContainer: { flex: 1, backgroundColor: '#FFF', borderTopLeftRadius: 30, borderTopRightRadius: 30, marginTop: -30, padding: 25 },
  rowBetween: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 15 },
  tagBadge: { backgroundColor: '#F1F5F9', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, marginRight: 8 },
  tagText: { fontFamily: 'Prompt_500Medium', color: '#475569', fontSize: 12 },
  ratingBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.95)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  ratingText: { fontFamily: 'Prompt_700Bold', color: '#D97706', fontSize: 14, marginLeft: 4 },
  reviewText: { fontFamily: 'Prompt_400Regular', color: '#94A3B8', fontSize: 12 },
  title: { fontSize: 24, fontFamily: 'Prompt_700Bold', color: '#0F172A', lineHeight: 32 },
  divider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 20 },
  infoRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  infoIconBox: { width: 44, height: 44, borderRadius: 12, backgroundColor: '#FFE4E6', justifyContent: 'center', alignItems: 'center', marginRight: 15 },
  infoTitle: { fontFamily: 'Prompt_400Regular', color: '#64748B', fontSize: 12, marginBottom: 2 },
  infoDetail: { fontFamily: 'Prompt_500Medium', color: '#0F172A', fontSize: 14 },
  sectionTitle: { fontSize: 18, fontFamily: 'Prompt_700Bold', color: '#0F172A', marginBottom: 15 },
  descriptionText: { fontFamily: 'Prompt_400Regular', color: '#475569', fontSize: 14, lineHeight: 24, marginBottom: 20 },
  adminPickCard: { width: width * 0.6, backgroundColor: '#FFF', borderRadius: 16, marginRight: 15, elevation: 3, shadowColor: '#0F172A', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 8, overflow: 'hidden', marginBottom: 10 },
  adminPickImage: { width: '100%', height: 120 },
  adminPickInfo: { padding: 12 },
  adminPickTitle: { fontFamily: 'Prompt_700Bold', fontSize: 14, color: '#0F172A', marginBottom: 4 },
  adminPickDesc: { fontFamily: 'Prompt_400Regular', fontSize: 12, color: '#64748B', lineHeight: 18 },
  reviewForm: { backgroundColor: '#F8FAFC', padding: 20, borderRadius: 16, marginBottom: 20, borderWidth: 1, borderColor: '#F1F5F9' },
  reviewFormTitle: { fontFamily: 'Prompt_700Bold', fontSize: 14, color: '#0F172A', marginBottom: 10 },
  reviewInput: { backgroundColor: '#FFF', borderRadius: 12, padding: 15, fontFamily: 'Prompt_400Regular', fontSize: 14, minHeight: 80, textAlignVertical: 'top', borderWidth: 1, borderColor: '#E2E8F0', marginBottom: 15 },
  submitReviewBtn: { backgroundColor: '#FF385C', borderRadius: 12, paddingVertical: 12, alignItems: 'center' },
  submitReviewText: { fontFamily: 'Prompt_700Bold', color: '#FFF', fontSize: 14 },
  reviewItem: { borderBottomWidth: 1, borderBottomColor: '#F1F5F9', paddingBottom: 15, marginBottom: 15 },
  reviewHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  reviewAvatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#1E1B4B', justifyContent: 'center', alignItems: 'center' },
  reviewUser: { fontFamily: 'Prompt_700Bold', color: '#0F172A', fontSize: 14 },
  reviewDate: { fontFamily: 'Prompt_400Regular', color: '#94A3B8', fontSize: 11 },
  reviewComment: { fontFamily: 'Prompt_400Regular', color: '#475569', fontSize: 14, lineHeight: 22 },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: '#FFF', padding: 20, paddingBottom: Platform.OS === 'ios' ? 30 : 20, borderTopWidth: 1, borderTopColor: '#F1F5F9', elevation: 15 },
  mapButton: { flexDirection: 'row', height: 55, borderRadius: 16, backgroundColor: '#1E1B4B', justifyContent: 'center', alignItems: 'center', elevation: 4 },
  mapButtonText: { fontFamily: 'Prompt_700Bold', color: '#FFF', fontSize: 16, marginLeft: 8 },
});