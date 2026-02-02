
import React from 'react';
import { Product, WarrantyStatus, AppNotification } from './types';

export const PRODUCTS: Product[] = [
  {
    id: 'p1',
    name: 'Tấm pin Mono Perc 550W',
    category: 'panel',
    model: 'SP-550M',
    price: '2.450.000đ',
    image: 'https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&q=80&w=400',
    specs: {
      'Công suất': '550W',
      'Hiệu suất': '21.3%'
    },
    warrantyMonths: 144
  },
  {
    id: 'p2',
    name: 'Inverter Hybrid 5kW Single Phase',
    category: 'inverter',
    model: 'SOL-H5K',
    price: '18.900.000đ',
    image: 'https://images.unsplash.com/photo-1592833159155-c62df1b35614?auto=format&fit=crop&q=80&w=400',
    specs: {
      'Công suất': '5000W',
      'IP': 'IP65'
    },
    warrantyMonths: 60
  },
  {
    id: 'p3',
    name: 'Pin Lưu Trữ Lithium 10kWh',
    category: 'battery',
    model: 'BAT-L10',
    price: '45.000.000đ',
    image: 'https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d?auto=format&fit=crop&q=80&w=400',
    specs: {
      'Dung lượng': '10kWh',
      'Điện áp': '48V'
    },
    warrantyMonths: 120
  },
  {
    id: 'p4',
    name: 'Biến tần bơm năng lượng mặt trời 2.2kW',
    category: 'pump_inverter',
    model: 'PUMP-2.2K',
    price: '5.200.000đ',
    image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=400',
    specs: {
      'Công suất': '2.2kW',
      'Đầu ra': '3 Pha 380V'
    },
    warrantyMonths: 24
  },
  {
    id: 'p5',
    name: 'Aptomat DC 1000V 32A',
    category: 'electrical',
    model: 'MCB-DC-32A',
    price: '185.000đ',
    image: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc4b?auto=format&fit=crop&q=80&w=400',
    specs: {
      'Dòng định mức': '32A',
      'Điện áp': '1000V DC'
    },
    warrantyMonths: 12
  },
  {
    id: 'p6',
    name: 'Tủ điện Combined Box 4 String',
    category: 'cabinet',
    model: 'CB-4S',
    price: '1.250.000đ',
    image: 'https://images.unsplash.com/photo-1544724569-5f546fd6f2b5?auto=format&fit=crop&q=80&w=400',
    specs: {
      'Số String': '4 In - 1 Out',
      'Tiêu chuẩn': 'Chống nước IP65'
    },
    warrantyMonths: 24
  },
  {
    id: 'p7',
    name: 'Combo Hybrid 5kW Tiết Kiệm',
    category: 'diy_combo',
    model: 'COMBO-H5-DIY',
    price: '62.500.000đ',
    image: 'https://images.unsplash.com/photo-1545259741-2ea3ebf61fa3?auto=format&fit=crop&q=80&w=400',
    specs: {
      'Thành phần': 'Inverter + 2 Pin',
      'Lắp đặt': 'Tự lắp (DIY)'
    },
    warrantyMonths: 36
  }
];

export const MOCK_WARRANTIES: Record<string, WarrantyStatus> = {
  'SP123456': {
    serial: 'SP123456',
    productName: 'Inverter Hybrid 5kW',
    model: 'SOL-H5K',
    activationDate: '2023-01-15',
    expiryDate: '2028-01-15',
    status: 'valid'
  }
};

export const MOCK_NOTIFICATIONS: AppNotification[] = [
  {
    id: 'n1',
    title: 'Kích hoạt bảo hành thành công',
    description: 'Thiết bị Inverter Hybrid 5kW (SN: SP123456) đã được kích hoạt bảo hành đến 15/01/2028.',
    type: 'warranty',
    timestamp: '2 giờ trước',
    isRead: false
  },
  {
    id: 'n2',
    title: 'Bảo trì hệ thống định kỳ',
    description: 'Hệ thống quản lý SOLPOWER sẽ được bảo trì từ 23:00 đến 01:00 đêm nay.',
    type: 'system',
    timestamp: '5 giờ trước',
    isRead: false
  },
  {
    id: 'n3',
    title: 'Sản phẩm mới ra mắt',
    description: 'Khám phá dòng pin Lithium thế hệ mới với hiệu suất vượt trội thêm 20%.',
    type: 'promotion',
    timestamp: '1 ngày trước',
    isRead: true
  },
  {
    id: 'n4',
    title: 'Yêu cầu hỗ trợ đã hoàn tất',
    description: 'Yêu cầu kỹ thuật số TK-88291 đã được xử lý xong. Vui lòng để lại đánh giá.',
    type: 'service',
    timestamp: '3 ngày trước',
    isRead: true
  }
];

export const ISSUE_TYPES = {
  inverter: ['Lỗi kết nối Wi-Fi', 'Lỗi AC Overload', 'Lỗi DC Isolation', 'Màn hình không hiển thị', 'Khác'],
  battery: ['Sạc không vào', 'Dung lượng giảm nhanh', 'Lỗi giao tiếp BMS', 'Nhiệt độ cao', 'Khác'],
  panel: ['Nứt vỡ vật lý', 'Công suất giảm sâu', 'Lỗi đầu nối MC4', 'Điểm nóng (Hotspot)', 'Khác'],
  accessory: ['Lỗi Smart Meter', 'Lỗi cáp kết nối', 'Khác']
};
