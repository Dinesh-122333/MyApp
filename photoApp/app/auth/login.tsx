import React, { useState } from 'react'
import {
  Alert,
  StyleSheet,
  View,
  AppState,
  Button,
  TextInput,
  useColorScheme,
} from 'react-native'
import { supabase } from '../../utils/supabase'
import { useAuth } from '@/Provider/Authprovider'
import { Redirect } from 'expo-router'

AppState.addEventListener('change', (state) => {
  if (state === 'active') {
    supabase.auth.startAutoRefresh()
  } else {
    supabase.auth.stopAutoRefresh()
  }
})

export default function Auth() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const theme = useColorScheme()

  const {user} = useAuth();
    
    if (user){
      return <Redirect href= '/(tabs)'/>
    }
  

  const isDark = theme === 'dark'

  async function signInWithEmail() {
    setLoading(true)
    const { error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })

    if (error) Alert.alert(error.message)
    setLoading(false)
  }

  async function signUpWithEmail() {
    setLoading(true)
    const {
      data: { session },
      error,
    } = await supabase.auth.signUp({
      email: email,
      password: password,
    })

    if (error) Alert.alert(error.message)
    if (!session) Alert.alert('Please check your inbox for email verification!')
    setLoading(false)
  }

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDark ? '#000' : '#fff' },
      ]}
    >
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <TextInput
          onChangeText={(text) => setEmail(text)}
          value={email}
          placeholder="email@address.com"
          autoCapitalize="none"
          placeholderTextColor={isDark ? '#aaa' : '#666'}
          style={[
            styles.input,
            {
              color: isDark ? '#fff' : '#000',
              backgroundColor: isDark ? '#1e1e1e' : '#f2f2f2',
            },
          ]}
        />
      </View>
      <View style={styles.verticallySpaced}>
        <TextInput
          onChangeText={(text) => setPassword(text)}
          value={password}
          secureTextEntry
          placeholder="Password"
          autoCapitalize="none"
          placeholderTextColor={isDark ? '#aaa' : '#666'}
          style={[
            styles.input,
            {
              color: isDark ? '#fff' : '#000',
              backgroundColor: isDark ? '#1e1e1e' : '#f2f2f2',
            },
          ]}
        />
      </View>
      <View style={[styles.verticallySpaced, styles.mt20]}>
        <Button title="Sign in" disabled={loading} onPress={signInWithEmail} />
      </View>
      <View style={styles.verticallySpaced}>
        <Button title="Sign up" disabled={loading} onPress={signUpWithEmail} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 40,
    padding: 12,
  },
  verticallySpaced: {
    paddingTop: 4,
    paddingBottom: 4,
    alignSelf: 'stretch',
  },
  mt20: {
    marginTop: 20,
  },
  input: {
    padding: 10,
    borderRadius: 6,
    fontSize: 16,
  },
})
