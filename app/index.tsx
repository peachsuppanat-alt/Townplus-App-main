import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  // -------------------------------------------------------------
  // 🔌 ฟังก์ชันสำหรับให้เพื่อน Backend (วิน/พีช) เอาไปเชื่อมต่อ Database
  // -------------------------------------------------------------
  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('แจ้งเตือน', 'กรุณากรอกอีเมลและรหัสผ่านให้ครบถ้วน');
      return;
    }

   //ใส่ ip ให้เป็น wifi เดียวกันกับ server และมือถือ
    try {
      const response = await fetch('http://192.168.174.35:3000/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email, password: password })
      });
      const data = await response.json();
      
      if(data.status === 'success') {
         // เก็บข้อมูล User ลงเครื่อง (เช่น AsyncStorage)
         router.replace('/(tabs)/home');
      } else {
         Alert.alert('เข้าสู่ระบบล้มเหลว', data.message);
      }
    } catch (error) {
      console.error(error);
    }
 

    // 🌟 โค้ดจำลอง (Mock) ระหว่างรอเพื่อนทำ Backend: พอกด Login ให้วิ่งไปหน้า Home เลย
    console.log('Logging in with:', email, password);
    router.replace('/(tabs)/home'); // คำสั่งเปลี่ยนไปหน้า Home
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={styles.content}>
        
        {/* โลโก้และข้อความต้อนรับ */}
        <View style={styles.header}>
          <View style={styles.logoCircle}>
             <Ionicons name="location" size={40} color="#FF385C" />
          </View>
          <Text style={styles.title}>Town Pulse</Text>
          <Text style={styles.subtitle}>เข้าสู่ระบบเพื่อค้นหากิจกรรมรอบตัวคุณ</Text>
        </View>

        {/* ฟอร์มกรอกข้อมูล */}
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={20} color="#6B7280" style={styles.inputIcon} />
            <TextInput 
              style={styles.input} 
              placeholder="อีเมล (Email)" 
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={20} color="#6B7280" style={styles.inputIcon} />
            <TextInput 
              style={styles.input} 
              placeholder="รหัสผ่าน (Password)" 
              secureTextEntry
              value={password}
              onChangeText={setPassword}
            />
          </View>

          <TouchableOpacity style={styles.forgotPassword}>
            <Text style={styles.forgotPasswordText}>ลืมรหัสผ่าน?</Text>
          </TouchableOpacity>

          {/* ปุ่ม Login */}
          <TouchableOpacity style={styles.loginButton} onPress={handleLogin} activeOpacity={0.8}>
            <Text style={styles.loginButtonText}>เข้าสู่ระบบ</Text>
          </TouchableOpacity>
        </View>

        {/* ปุ่มไปหน้าสมัครสมาชิก */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>ยังไม่มีบัญชีใช่ไหม? </Text>
          <TouchableOpacity onPress={() => router.push('/register')}>
            <Text style={styles.registerText}>สมัครสมาชิก</Text>
          </TouchableOpacity>
        </View>

      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  content: { flex: 1, justifyContent: 'center', paddingHorizontal: 30 },
  header: { alignItems: 'center', marginBottom: 40 },
  logoCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#FFE4E6', justifyContent: 'center', alignItems: 'center', marginBottom: 15 },
  title: { fontSize: 28, fontFamily: 'Prompt_700Bold', color: '#1E1B4B', marginBottom: 5 },
  subtitle: { fontSize: 14, fontFamily: 'Prompt_400Regular', color: '#6B7280' },
  form: { width: '100%' },
  inputContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F3F4F6', borderRadius: 15, paddingHorizontal: 15, marginBottom: 15, height: 55 },
  inputIcon: { marginRight: 10 },
  input: { flex: 1, fontFamily: 'Prompt_400Regular', fontSize: 15, color: '#111827' },
  forgotPassword: { alignSelf: 'flex-end', marginBottom: 25 },
  forgotPasswordText: { fontFamily: 'Prompt_500Medium', color: '#FF385C', fontSize: 13 },
  loginButton: { backgroundColor: '#FF385C', borderRadius: 15, height: 55, justifyContent: 'center', alignItems: 'center', elevation: 3, shadowColor: '#FF385C', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8 },
  loginButtonText: { color: '#FFF', fontSize: 16, fontFamily: 'Prompt_700Bold' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: 30 },
  footerText: { fontFamily: 'Prompt_400Regular', color: '#6B7280', fontSize: 14 },
  registerText: { fontFamily: 'Prompt_700Bold', color: '#FF385C', fontSize: 14 },
});