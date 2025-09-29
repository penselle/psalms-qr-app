import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AttendanceForm } from '@/types';

const API_BASE_URL = 'http://192.168.0.101:8000';

export const login = async (email: string, password: string) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/login`, {
      email,
      password,
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Login did not succeed');
    }
    throw new Error('An unexpected error occurred');
  }
};

export const getUser = async (token: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/api/admin/user`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to fetch user data');
    }
    throw new Error('An unexpected error occurred');
  }
};

export const saveAttendance = async (attendanceData: AttendanceForm) => {
  try {
    const token = await AsyncStorage.getItem('token');
    if (!token) {
      throw new Error('No authentication token found');
    }

    const response = await axios.post(`${API_BASE_URL}/api/admin/attendance`, attendanceData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json', 
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data?.message || 'Failed to save attendance');
    }
    throw new Error('An unexpected error occurred');
  }
};
