
import React, { useState, useMemo, useEffect } from 'react';
import Layout from './components/Layout';
import SupportForm from './components/SupportForm';
import { TabType, ProductCategory, AppNotification, Product } from './types';
import { PRODUCTS, MOCK_NOTIFICATIONS } from './constants';

const App: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [ticketId, setTicketId] = useState<string | null>(null);
  const [supportSubPage, setSupportSubPage] = useState<'menu' | 'warranty' | 'history' | null>('menu');
  const [accountSubPage, setAccountSubPage] = useState<'menu' | 'edit' | 'history' | null>('menu');
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  
  // Quản lý lịch sử các tab đã truy cập
  const [tabHistory, setTabHistory] = useState<TabType[]>(['home']);
  const [notifications, setNotifications] = useState<AppNotification[]>(MOCK_NOTIFICATIONS);

  // Theo dõi thay đổi tab để lưu lịch sử
  useEffect(() => {
    if (activeTab === tabHistory[tabHistory.length - 1]) return;
    setTabHistory(prev => [...prev, activeTab]);
  }, [activeTab]);

  const unreadCount = useMemo(() => 
    notifications.filter(n => !n.isRead).length, 
  [notifications]);

  const handleMarkAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  const handleReadSingle = (id: string) => {
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, isRead: true } : n));
  };

  // Logic xử lý quay lại trang trước
  const handleBack = () => {
    if (selectedProduct) {
      setSelectedProduct(null);
      return;
    }

    if (activeTab === 'support' && supportSubPage !== 'menu') {
      if (ticketId) {
        setTicketId(null);
      }
      setSupportSubPage('menu');
      return;
    }

    if (activeTab === 'account' && accountSubPage !== 'menu') {
      setAccountSubPage('menu');
      return;
    }

    if (activeTab === 'home') return;

    if (tabHistory.length > 1) {
      const newHistory = [...tabHistory];
      newHistory.pop();
      const prevTab = newHistory[newHistory.length - 1];
      setTabHistory(newHistory);
      setActiveTab(prevTab);
    } else {
      setActiveTab('home');
    }
  };

  const getTitle = () => {
    if (selectedProduct) return 'Chi tiết thiết bị';
    if (activeTab === 'support' && supportSubPage === 'warranty') return 'Kiểm tra bảo hành';
    if (activeTab === 'account' && accountSubPage === 'edit') return 'Chỉnh sửa thông tin';
    switch(activeTab) {
      case 'home': return 'SOLPOWER';
      case 'products': return 'Danh mục thiết bị';
      case 'support': return 'Hỗ trợ kỹ thuật';
      case 'notifications': return 'Thông báo';
      case 'account': return 'Tài khoản';
      default: return 'SOLPOWER';
    }
  };

  const renderContent = () => {
    if (!isLoggedIn) {
      return <AuthScreen onLoginSuccess={() => setIsLoggedIn(true)} />;
    }

    if (selectedProduct) {
      return <ProductDetailView 
        product={selectedProduct} 
        onBack={() => setSelectedProduct(null)} 
        onSupport={() => {
          setSelectedProduct(null);
          setActiveTab('support');
          setSupportSubPage('warranty');
        }}
      />;
    }

    switch (activeTab) {
      case 'home':
        return <HomeScreen onWarranty={() => { setActiveTab('support'); setSupportSubPage('warranty'); }} onSupport={() => setActiveTab('support')} />;
      case 'products':
        return <ProductsScreen onSelectProduct={(p) => setSelectedProduct(p)} />;
      case 'notifications':
        return <NotificationsScreen 
          notifications={notifications} 
          onMarkAllRead={handleMarkAllRead} 
          onReadSingle={handleReadSingle}
        />;
      case 'support':
        if (ticketId) return <TicketSuccessScreen ticketId={ticketId} onReset={() => { setTicketId(null); setSupportSubPage('menu'); }} />;
        if (supportSubPage === 'warranty') return <SupportForm onSuccess={(id) => setTicketId(id)} onBack={handleBack} />;
        return <SupportMenu onNavigate={(page) => setSupportSubPage(page as any)} />;
      case 'account':
        if (accountSubPage === 'edit') return <ProfileEditScreen onBack={() => setAccountSubPage('menu')} />;
        return <AccountScreen 
          onLogout={() => { setIsLoggedIn(false); setTabHistory(['home']); }} 
          onEditProfile={() => setAccountSubPage('edit')}
        />;
      default:
        return null;
    }
  };

  return (
    <Layout 
      activeTab={activeTab} 
      setActiveTab={(t) => { 
        setActiveTab(t); 
        setSupportSubPage('menu'); 
        setAccountSubPage('menu');
        setSelectedProduct(null);
      }} 
      title={getTitle()} 
      hideNav={!isLoggedIn}
      unreadNotificationsCount={unreadCount}
      // Fixed: Simplified logic to avoid TypeScript narrowing errors.
      // If activeTab is not 'home', it is already 'account', 'support', 'products', or 'notifications',
      // so the redundant checks for subpages are not needed here just to decide if the back button shows.
      onBack={(activeTab !== 'home' || !!selectedProduct) ? handleBack : undefined}
    >
      {renderContent()}
    </Layout>
  );
};

// --- PROFILE EDIT SCREEN ---
const ProfileEditScreen = ({ onBack }: { onBack: () => void }) => {
  const [formData, setFormData] = useState({
    name: 'Nguyễn Văn An',
    phone: '0987 654 321',
    email: 'vanan.solar@gmail.com',
    currentPass: '',
    newPass: '',
    confirmPass: ''
  });

  const handleSave = () => {
    // Logic lưu thông tin ở đây
    alert('Thông tin đã được cập nhật thành công!');
    onBack();
  };

  return (
    <div className="page-transition px-6 pb-20 space-y-8">
      {/* Avatar Section */}
      <div className="flex flex-col items-center gap-4 py-4">
        <div className="relative group">
          <div className="size-28 rounded-[2.5rem] bg-white p-1 shadow-soft overflow-hidden border-2 border-primary/10">
            <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" className="size-full rounded-[2.2rem] object-cover" alt="Avatar" />
          </div>
          <button className="absolute bottom-0 right-0 size-9 bg-primary text-white rounded-full border-4 border-bgLight flex items-center justify-center shadow-lg active:scale-90 transition-all">
            <span className="material-symbols-outlined text-lg">photo_camera</span>
          </button>
        </div>
        <p className="text-[10px] font-bold text-primary uppercase tracking-widest">Thay đổi ảnh đại diện</p>
      </div>

      {/* Profile Form */}
      <div className="space-y-5">
        <h3 className="text-primary text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Thông tin cá nhân</h3>
        <div className="space-y-4">
          <EditInput label="Họ và tên" value={formData.name} icon="person" onChange={(v) => setFormData({...formData, name: v})} />
          <EditInput label="Số điện thoại" value={formData.phone} icon="call" onChange={(v) => setFormData({...formData, phone: v})} />
          <EditInput label="Email" value={formData.email} icon="mail" onChange={(v) => setFormData({...formData, email: v})} />
        </div>
      </div>

      {/* Password Form */}
      <div className="space-y-5 pt-4">
        <h3 className="text-primary text-[10px] font-black uppercase tracking-[0.2em] opacity-60">Bảo mật & Mật khẩu</h3>
        <div className="space-y-4">
          <EditInput label="Mật khẩu hiện tại" value={formData.currentPass} icon="lock" isPassword placeholder="••••••••" onChange={(v) => setFormData({...formData, currentPass: v})} />
          <EditInput label="Mật khẩu mới" value={formData.newPass} icon="key" isPassword placeholder="••••••••" onChange={(v) => setFormData({...formData, newPass: v})} />
          <EditInput label="Xác nhận mật khẩu mới" value={formData.confirmPass} icon="verified_user" isPassword placeholder="••••••••" onChange={(v) => setFormData({...formData, confirmPass: v})} />
        </div>
      </div>

      {/* Save Button */}
      <div className="pt-6">
        <button 
          onClick={handleSave}
          className="w-full bg-primary text-white py-4 rounded-2xl font-black text-sm uppercase tracking-widest shadow-lg shadow-primary/20 active:scale-95 transition-all"
        >
          Lưu thay đổi
        </button>
      </div>
    </div>
  );
};

const EditInput = ({ label, value, icon, isPassword, placeholder, onChange }: any) => {
  const [show, setShow] = useState(false);
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-bold text-textMuted uppercase tracking-wider ml-1">{label}</label>
      <div className="relative">
        <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-primary/40 text-lg">{icon}</span>
        <input 
          type={isPassword && !show ? "password" : "text"}
          value={value}
          placeholder={placeholder}
          onChange={(e) => onChange(e.target.value)}
          className="w-full pl-12 pr-12 py-3.5 bg-white border-none rounded-xl text-sm font-semibold text-textMain focus:ring-2 focus:ring-primary/20 transition-all shadow-card"
        />
        {isPassword && (
          <button onClick={() => setShow(!show)} className="absolute right-4 top-1/2 -translate-y-1/2 text-primary/40">
            <span className="material-symbols-outlined text-lg">{show ? 'visibility_off' : 'visibility'}</span>
          </button>
        )}
      </div>
    </div>
  );
};

// --- PRODUCT DETAIL VIEW ---
const ProductDetailView = ({ product, onBack, onSupport }: { product: Product, onBack: () => void, onSupport: () => void }) => {
  return (
    <div className="page-transition pb-40">
      {/* Product Image Hero */}
      <div className="px-4">
        <div className="relative bg-white rounded-3xl overflow-hidden shadow-soft border border-gray-100 aspect-[4/3]">
          <img src={product.image} className="size-full object-cover" alt={product.name} />
          <div className="absolute top-4 left-4">
            <span className="px-3 py-1 bg-primary/90 backdrop-blur-md text-white text-[10px] font-black uppercase rounded-full tracking-wider shadow-sm">
              {product.category.replace('_', ' ')}
            </span>
          </div>
        </div>
      </div>

      {/* Basic Info */}
      <div className="px-6 py-6 space-y-2">
        <div className="flex justify-between items-start gap-4">
          <h2 className="text-xl font-black text-textMain leading-tight flex-1">{product.name}</h2>
          <span className="text-lg font-black text-secondary whitespace-nowrap">{product.price || 'Liên hệ'}</span>
        </div>
        <p className="text-sm font-bold text-textMuted uppercase tracking-tight">Model: {product.model}</p>
      </div>

      {/* Action Buttons Quick */}
      <div className="px-4 grid grid-cols-2 gap-3 mb-8">
        <button onClick={onSupport} className="flex items-center justify-center gap-2 py-3.5 bg-secondary/10 text-secondary rounded-2xl font-bold text-xs active:scale-95 transition-all">
          <span className="material-symbols-outlined text-lg">verified_user</span>
          Bảo hành
        </button>
        <button className="flex items-center justify-center gap-2 py-3.5 bg-primary/10 text-primary rounded-2xl font-bold text-xs active:scale-95 transition-all">
          <span className="material-symbols-outlined text-lg">download</span>
          Tài liệu PDF
        </button>
      </div>

      {/* Specifications */}
      <div className="px-6 space-y-4">
        <h3 className="text-[11px] font-black text-primary uppercase tracking-[0.2em] opacity-60">Thông số kỹ thuật</h3>
        <div className="grid grid-cols-1 gap-3">
          {Object.entries(product.specs).map(([key, val]) => (
            <div key={key} className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-card border border-gray-50">
              <span className="text-sm font-bold text-textMuted">{key}</span>
              <span className="text-sm font-black text-textMain">{val}</span>
            </div>
          ))}
          <div className="flex items-center justify-between p-4 bg-white rounded-2xl shadow-card border border-gray-50">
            <span className="text-sm font-bold text-textMuted">Bảo hành</span>
            <span className="text-sm font-black text-primary">{product.warrantyMonths} tháng</span>
          </div>
        </div>
      </div>

      {/* Description / Content Placeholder */}
      <div className="px-6 mt-8 space-y-4">
        <h3 className="text-[11px] font-black text-primary uppercase tracking-[0.2em] opacity-60">Đặc điểm nổi bật</h3>
        <div className="prose prose-sm text-textMuted leading-relaxed">
          <p>Sản phẩm chính hãng SOLPOWER được sản xuất trên dây chuyền công nghệ hiện đại, đáp ứng các tiêu chuẩn khắt khe nhất về an toàn năng lượng. Thiết kế bền bỉ, dễ dàng lắp đặt và bảo trì.</p>
          <ul className="list-disc pl-5 space-y-2 mt-2 font-medium">
            <li>Hiệu suất chuyển đổi năng lượng tối ưu.</li>
            <li>Chống chịu thời tiết khắc nghiệt (IP65/IP67).</li>
            <li>Hỗ trợ giám sát thông minh qua ứng dụng.</li>
          </ul>
        </div>
      </div>

      {/* BOTTOM ACTION BAR */}
      <div className="fixed bottom-20 left-0 right-0 z-40 max-w-md mx-auto px-4 pb-4">
        <div className="bg-white/80 backdrop-blur-xl border border-white/20 p-3 rounded-[2.5rem] shadow-[0_8px_32px_rgba(0,0,0,0.12)] flex items-center gap-2">
          {/* Chat/Message Button */}
          <button className="size-12 rounded-full bg-bgLight flex items-center justify-center text-primary active:scale-90 transition-all shrink-0">
            <span className="material-symbols-outlined filled-icon">chat</span>
          </button>
          
          {/* Add to Cart Button */}
          <button className="flex-1 flex items-center justify-center gap-2 bg-secondary/10 text-secondary py-3.5 rounded-[1.5rem] font-black text-[10px] uppercase tracking-wider active:scale-95 transition-all">
            <span className="material-symbols-outlined text-lg">add_shopping_cart</span>
            Thêm giỏ
          </button>

          {/* Buy Now / Contact Button */}
          <button className="flex-[1.5] flex items-center justify-center gap-2 bg-primary text-white py-3.5 rounded-[1.5rem] font-black text-[10px] uppercase tracking-wider shadow-lg shadow-primary/20 active:scale-95 transition-all">
            <span className="material-symbols-outlined text-lg filled-icon">bolt</span>
            Mua ngay
          </button>
        </div>
      </div>
    </div>
  );
};

// --- PRODUCTS SCREEN ---
const CATEGORY_DATA: { label: string; value: ProductCategory; icon: string }[] = [
  { label: 'Tất cả', value: 'all', icon: 'apps' },
  { label: 'Tấm pin', value: 'panel', icon: 'solar_power' },
  { label: 'Biến tần', value: 'inverter', icon: 'settings_input_component' },
  { label: 'Pin lưu trữ', value: 'battery', icon: 'battery_charging_full' },
  { label: 'Bơm nước', value: 'pump_inverter', icon: 'water_drop' },
  { label: 'Combo tự lắp', value: 'diy_combo', icon: 'package_2' },
  { label: 'Thiết bị điện', value: 'electrical', icon: 'electrical_services' },
  { label: 'Tủ điện', value: 'cabinet', icon: 'door_open' },
];

const ProductsScreen = ({ onSelectProduct }: { onSelectProduct: (p: Product) => void }) => {
  const [selectedCategory, setSelectedCategory] = useState<ProductCategory>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchQuery, setSearchQuery] = useState('');

  const filteredProducts = useMemo(() => {
    return PRODUCTS.filter(p => {
      const matchCategory = selectedCategory === 'all' || p.category === selectedCategory;
      const matchSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.model.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="page-transition space-y-5 pb-10">
      {/* Search Bar */}
      <div className="px-4">
        <div className="relative group">
          <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors text-xl">search</span>
          <input 
            type="text" 
            placeholder="Tìm tên hoặc mã sản phẩm..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-11 pr-4 py-3 bg-white border-none rounded-2xl shadow-sm text-sm font-medium focus:ring-2 focus:ring-primary/20 transition-all"
          />
        </div>
      </div>

      {/* 8-Item Category Grid */}
      <div className="px-4 space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-primary text-[10px] font-black uppercase tracking-[0.15em] opacity-80">Phân loại thiết bị</h3>
          <button 
            onClick={() => setViewMode(viewMode === 'grid' ? 'list' : 'grid')}
            className="flex items-center gap-1.5 text-textMuted active:scale-95 transition-transform"
          >
            <span className="material-symbols-outlined text-[20px]">{viewMode === 'grid' ? 'view_list' : 'grid_view'}</span>
          </button>
        </div>
        
        <div className="grid grid-cols-4 gap-x-2 gap-y-3">
          {CATEGORY_DATA.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setSelectedCategory(cat.value)}
              className={`flex flex-col items-center justify-center py-2.5 px-1 rounded-2xl transition-all border text-center relative ${
                selectedCategory === cat.value
                  ? 'bg-primary text-white border-primary shadow-lg shadow-primary/20 translate-y-[-2px]'
                  : 'bg-white text-textMuted border-transparent shadow-card hover:border-primary/10'
              }`}
            >
              <div className={`size-8 rounded-lg flex items-center justify-center mb-1.5 transition-colors ${
                selectedCategory === cat.value ? 'bg-white/20' : 'bg-bgLight'
              }`}>
                <span className={`material-symbols-outlined text-[18px] ${selectedCategory === cat.value ? 'filled-icon' : ''}`}>
                  {cat.icon}
                </span>
              </div>
              <span className={`text-[9px] font-bold leading-tight px-1 ${
                selectedCategory === cat.value ? 'opacity-100' : 'opacity-80'
              }`}>
                {cat.label}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* Product Display */}
      <div className={`px-4 mt-2 ${
        viewMode === 'grid' 
        ? 'grid grid-cols-2 gap-4' 
        : 'space-y-4'
      }`}>
        {filteredProducts.length > 0 ? (
          filteredProducts.map(p => (
            <ProductCard key={p.id} product={p} mode={viewMode} onClick={() => onSelectProduct(p)} />
          ))
        ) : (
          <div className="col-span-full text-center py-20 bg-white/50 rounded-3xl border-2 border-dashed border-gray-200">
            <span className="material-symbols-outlined text-5xl text-gray-300 mb-3">manage_search</span>
            <p className="text-gray-400 font-bold">Không tìm thấy sản phẩm nào</p>
            <button onClick={() => {setSearchQuery(''); setSelectedCategory('all');}} className="mt-4 text-primary font-bold text-sm">Xóa bộ lọc</button>
          </div>
        )}
      </div>
    </div>
  );
};

const ProductCard = ({ product, mode, onClick }: { product: Product, mode: 'grid' | 'list', onClick: () => void }) => {
  if (mode === 'grid') {
    return (
      <div 
        onClick={onClick}
        className="bg-white rounded-2xl overflow-hidden shadow-card border border-transparent hover:border-primary/10 transition-all flex flex-col group active:scale-95 cursor-pointer"
      >
        <div className="aspect-square w-full overflow-hidden bg-gray-50 relative">
          <img src={product.image} className="size-full object-cover group-hover:scale-110 transition-transform duration-500" alt={product.name} />
          <div className="absolute top-2 right-2 px-2 py-0.5 bg-white/90 backdrop-blur-sm rounded-lg text-[8px] font-black text-primary shadow-sm uppercase tracking-tighter">
            {product.category}
          </div>
        </div>
        <div className="p-3 flex-1 flex flex-col">
          <h4 className="font-bold text-[13px] text-textMain line-clamp-2 leading-snug">{product.name}</h4>
          <p className="text-[9px] font-bold text-textMuted mt-1 mb-3">SN: {product.model}</p>
          <div className="mt-auto pt-2 flex items-center justify-between border-t border-gray-50">
             <div className="flex gap-1">
                <span className="text-[10px] font-black text-secondary">{product.price || 'LIÊN HỆ'}</span>
             </div>
             <span className="material-symbols-outlined text-secondary text-base">arrow_forward</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      onClick={onClick}
      className="bg-white p-4 rounded-2xl shadow-card flex gap-4 border border-transparent hover:border-primary/10 transition-all active:scale-[0.98] group cursor-pointer"
    >
      <div className="size-20 rounded-xl overflow-hidden bg-gray-50 flex-shrink-0">
        <img src={product.image} className="size-full object-cover group-hover:scale-110 transition-transform duration-500" alt={product.name} />
      </div>
      <div className="flex-1 flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-start">
            <h4 className="font-bold text-sm text-textMain line-clamp-1 flex-1">{product.name}</h4>
          </div>
          <p className="text-[10px] font-bold text-textMuted mt-0.5">Model: {product.model}</p>
          <div className="mt-2 flex flex-wrap gap-x-2 gap-y-1">
            {Object.entries(product.specs).slice(0, 2).map(([key, val]) => (
              <span key={key} className="text-[9px] text-gray-400 font-medium bg-bgLight px-1.5 py-0.5 rounded">
                {key}: {val}
              </span>
            ))}
          </div>
        </div>
        <div className="flex gap-2 mt-2 pt-2 border-t border-gray-50">
          <button className="flex-1 text-primary text-[10px] font-black uppercase text-left">
            GIÁ: {product.price || 'LIÊN HỆ'}
          </button>
          <span className="material-symbols-outlined text-primary text-base">chevron_right</span>
        </div>
      </div>
    </div>
  );
};

// --- AUTH SCREEN ---
const AuthScreen = ({ onLoginSuccess }: any) => {
  const [authMode, setAuthMode] = useState<'login' | 'signup' | 'forgot'>('login');
  const [viewPolicy, setViewPolicy] = useState<'terms' | 'privacy' | null>(null);

  const renderAuthView = () => {
    if (viewPolicy) {
      return <PolicyView type={viewPolicy} onBack={() => setViewPolicy(null)} />;
    }

    switch (authMode) {
      case 'signup':
        return <SignUpView 
          onBack={() => setAuthMode('login')} 
          onShowTerms={() => setViewPolicy('terms')}
          onShowPrivacy={() => setViewPolicy('privacy')}
        />;
      case 'forgot':
        return <ForgotPassView onBack={() => setAuthMode('login')} />;
      default:
        return <LoginView 
          onLoginSuccess={onLoginSuccess} 
          onGoToSignUp={() => setAuthMode('signup')} 
          onGoToForgot={() => setAuthMode('forgot')} 
        />;
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {renderAuthView()}
    </div>
  );
};

// --- POLICY VIEW ---
const PolicyView = ({ type, onBack }: { type: 'terms' | 'privacy'; onBack: () => void }) => {
  const content = {
    terms: {
      title: 'Điều khoản sử dụng',
      sections: [
        { title: '1. Chấp thuận điều khoản', content: 'Bằng việc đăng ký tài khoản SOLPOWER, bạn đồng ý tuân thủ các điều khoản này. Chúng tôi có quyền cập nhật điều khoản bất kỳ lúc nào.' },
        { title: '2. Sử dụng dịch vụ', content: 'Ứng dụng được cung cấp để hỗ trợ kỹ thuật và quản lý bảo hành thiết bị năng lượng mặt trời. Mọi hành vi phá hoại hoặc sử dụng sai mục đích sẽ bị đình chỉ tài khoản.' },
        { title: '3. Trách nhiệm dữ liệu', content: 'Người dùng có trách nhiệm cung cấp thông tin thiết bị (S/N) chính xác để nhận được hỗ trợ tốt nhất.' },
        { title: '4. Giới hạn trách nhiệm', content: 'SOLPOWER không chịu trách nhiệm cho các hư hỏng do việc tự ý lắp đặt hoặc sửa chữa không theo hướng dẫn kỹ thuật.' }
      ]
    },
    privacy: {
      title: 'Chính sách bảo mật',
      sections: [
        { title: '1. Thu thập thông tin', content: 'Chúng tôi thu thập Email, SĐT và thông tin hệ thống điện mặt trời của bạn để phục vụ việc bảo hành và tối ưu hiệu suất.' },
        { title: '2. Sử dụng thông tin', content: 'Thông tin được sử dụng để liên hệ hỗ trợ, gửi thông báo bảo trì và xác thực quyền lợi bảo hành.' },
        { title: '3. Bảo mật', content: 'Dữ liệu được mã hóa và lưu trữ an toàn trên máy chủ của chúng tôi. Chúng tôi cam kết không bán dữ liệu cho bên thứ ba.' },
        { title: '4. Quyền của bạn', content: 'Bạn có quyền yêu cầu xóa tài khoản và dữ liệu cá nhân bất kỳ lúc nào thông qua phần cài đặt tài khoản.' }
      ]
    }
  };

  const data = content[type];

  return (
    <div className="flex flex-col h-screen page-transition bg-bgLight">
      <div className="bg-white px-6 py-4 flex items-center justify-between border-b border-gray-100 shadow-sm sticky top-0 z-10">
        <h3 className="text-lg font-bold text-primary">{data.title}</h3>
        <button onClick={onBack} className="size-10 flex items-center justify-center rounded-full bg-gray-50 text-gray-400">
          <span className="material-symbols-outlined">close</span>
        </button>
      </div>
      <div className="flex-1 overflow-y-auto p-6 space-y-8">
        {data.sections.map((s, i) => (
          <section key={i} className="space-y-2">
            <h4 className="font-bold text-textMain">{s.title}</h4>
            <p className="text-sm text-textMuted leading-relaxed">{s.content}</p>
          </section>
        ))}
        <div className="pt-8 pb-12">
          <button onClick={onBack} className="w-full py-4 bg-primary text-white rounded-xl font-bold shadow-lg shadow-primary/20">
            Tôi đã hiểu
          </button>
        </div>
      </div>
    </div>
  );
};

// --- LOGIN VIEW ---
const LoginView = ({ onLoginSuccess, onGoToSignUp, onGoToForgot }: any) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="px-8 py-12 flex flex-col justify-center min-h-screen page-transition">
      <div className="text-center mb-10">
        <div className="size-20 bg-primary rounded-[2rem] flex items-center justify-center text-white mx-auto mb-6 shadow-soft">
          <span className="material-symbols-outlined text-4xl filled-icon">bolt</span>
        </div>
        <h2 className="text-2xl font-bold text-textMain">Chào mừng bạn</h2>
        <p className="text-textMuted text-sm mt-2">Đăng nhập để quản lý hệ thống năng lượng</p>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); onLoginSuccess(); }} className="space-y-4">
        <div className="space-y-1.5">
          <label className="text-[11px] font-bold text-textMuted uppercase tracking-wider ml-1">Tài khoản / Email</label>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl">person</span>
            <input 
              type="text" 
              placeholder="Nhập tên đăng nhập hoặc email..."
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full pl-12 pr-4 py-3.5 bg-bgLight border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary/20 transition-all"
              required
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <div className="flex justify-between items-center px-1">
            <label className="text-[11px] font-bold text-textMuted uppercase tracking-wider">Mật khẩu</label>
            <button type="button" onClick={onGoToForgot} className="text-[11px] font-bold text-primary">Quên mật khẩu?</button>
          </div>
          <div className="relative">
            <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl">lock</span>
            <input 
              type={showPassword ? "text" : "password"} 
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-12 pr-12 py-3.5 bg-bgLight border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary/20 transition-all"
              required
            />
            <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400">
              <span className="material-symbols-outlined text-xl">{showPassword ? 'visibility_off' : 'visibility'}</span>
            </button>
          </div>
        </div>

        <button type="submit" className="w-full bg-primary text-white py-4 rounded-xl font-bold shadow-lg shadow-primary/20 active:scale-95 transition-all mt-2">
          Đăng nhập
        </button>
      </form>

      <div className="flex items-center gap-4 my-8">
        <div className="h-px bg-gray-100 flex-1"></div>
        <span className="text-[10px] font-bold text-gray-300 uppercase tracking-widest">Hoặc đăng nhập nhanh</span>
        <div className="h-px bg-gray-100 flex-1"></div>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <button onClick={onLoginSuccess} className="flex items-center justify-center gap-2 py-3.5 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors active:scale-95">
          <svg className="size-5" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.66l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
          <span className="text-xs font-bold text-textMain">Google</span>
        </button>
        <button onClick={onLoginSuccess} className="flex items-center justify-center gap-2 py-3.5 bg-[#0068FF] rounded-xl active:scale-95 transition-all">
          <span className="bg-white text-[#0068FF] rounded p-0.5 font-black text-[10px] w-5 h-5 flex items-center justify-center">Z</span>
          <span className="text-xs font-bold text-white">Zalo</span>
        </button>
      </div>

      <p className="text-center mt-10 text-xs text-textMuted font-medium">
        Chưa có tài khoản? <button onClick={onGoToSignUp} className="text-primary font-bold">Đăng ký ngay</button>
      </p>
    </div>
  );
};

// --- SIGN UP VIEW ---
const SignUpView = ({ onBack, onShowTerms, onShowPrivacy }: any) => {
  return (
    <div className="px-8 py-12 flex flex-col min-h-screen page-transition">
      <button onClick={onBack} className="flex items-center text-primary font-bold text-xs uppercase mb-8 self-start">
        <span className="material-symbols-outlined text-sm mr-1">arrow_back_ios</span> Quay lại
      </button>

      <div className="mb-8">
        <h2 className="text-2xl font-bold text-textMain">Đăng ký tài khoản</h2>
        <p className="text-textMuted text-sm mt-2">Bắt đầu quản lý năng lượng sạch cùng SOLPOWER.</p>
      </div>

      <form className="space-y-4">
        <AuthInput label="Họ và tên" icon="person" placeholder="Nhập họ và tên của bạn..." />
        <AuthInput label="Số điện thoại / Email" icon="mail" placeholder="Nhập email hoặc SĐT..." />
        <AuthInput label="Mật khẩu" icon="lock" placeholder="Tạo mật khẩu mạnh..." isPassword />
        <AuthInput label="Xác nhận mật khẩu" icon="verified_user" placeholder="Nhập lại mật khẩu..." isPassword />

        <div className="flex items-start gap-3 py-2">
          <input type="checkbox" className="mt-1 rounded text-primary focus:ring-primary/20 border-gray-200" id="terms" />
          <label htmlFor="terms" className="text-xs text-textMuted leading-relaxed">
            Tôi đồng ý với các <button type="button" onClick={onShowTerms} className="text-primary font-bold">Điều khoản sử dụng</button> và <button type="button" onClick={onShowPrivacy} className="text-primary font-bold">Chính sách bảo mật</button>.
          </label>
        </div>

        <button type="button" className="w-full bg-primary text-white py-4 rounded-xl font-bold shadow-lg shadow-primary/20 active:scale-95 transition-all mt-4">
          Tạo tài khoản
        </button>
      </form>

      <p className="text-center mt-auto pt-10 text-xs text-textMuted font-medium">
        Đã có tài khoản? <button onClick={onBack} className="text-primary font-bold">Đăng nhập</button>
      </p>
    </div>
  );
};

// --- FORGOT PASSWORD VIEW ---
const ForgotPassView = ({ onBack }: any) => {
  return (
    <div className="px-8 py-12 flex flex-col min-h-screen page-transition">
      <button onClick={onBack} className="flex items-center text-primary font-bold text-xs uppercase mb-8 self-start">
        <span className="material-symbols-outlined text-sm mr-1">arrow_back_ios</span> Quay lại
      </button>

      <div className="mb-10 text-center">
        <div className="size-20 bg-orange-50 text-secondary rounded-[2rem] flex items-center justify-center mx-auto mb-6">
          <span className="material-symbols-outlined text-4xl">key_off</span>
        </div>
        <h2 className="text-2xl font-bold text-textMain">Quên mật khẩu?</h2>
        <p className="text-textMuted text-sm mt-2 px-4 leading-relaxed">Đừng lo lắng! Nhập email hoặc số điện thoại để nhận hướng dẫn khôi phục.</p>
      </div>

      <form className="space-y-6">
        <AuthInput label="Email hoặc Số điện thoại" icon="send" placeholder="Nhập thông tin đã đăng ký..." />
        
        <button type="button" className="w-full bg-secondary text-white py-4 rounded-xl font-bold shadow-lg shadow-orange-500/20 active:scale-95 transition-all">
          Gửi yêu cầu khôi phục
        </button>
      </form>

      <div className="mt-10 p-4 bg-bgLight rounded-2xl border border-gray-100">
        <div className="flex gap-3">
          <span className="material-symbols-outlined text-primary text-xl">info</span>
          <p className="text-xs text-textMuted leading-relaxed italic">
            Hệ thống sẽ gửi mã xác thực (OTP) qua kênh bạn đã đăng ký. Vui lòng kiểm tra kỹ tin nhắn hoặc hộp thư đến.
          </p>
        </div>
      </div>
    </div>
  );
};

// --- AUTH HELPER COMPONENTS ---
const AuthInput = ({ label, icon, placeholder, isPassword }: any) => (
  <div className="space-y-1.5">
    <label className="text-[11px] font-bold text-textMuted uppercase tracking-wider ml-1">{label}</label>
    <div className="relative">
      <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-xl">{icon}</span>
      <input 
        type={isPassword ? "password" : "text"} 
        placeholder={placeholder}
        className="w-full pl-12 pr-4 py-3.5 bg-bgLight border-none rounded-xl text-sm font-medium focus:ring-2 focus:ring-primary/20 transition-all placeholder-gray-400"
      />
    </div>
  </div>
);

// --- HOME SCREEN ---
const HomeScreen = ({ onWarranty, onSupport }: any) => (
  <div className="px-4 space-y-6 page-transition">
    <div className="relative w-full rounded-2xl overflow-hidden shadow-soft group cursor-pointer transition-transform active:scale-[0.99]" onClick={onWarranty}>
      <div className="absolute inset-0 bg-primary/90 mix-blend-multiply z-10"></div>
      <div className="absolute inset-0 bg-gradient-to-r from-primary via-transparent to-transparent opacity-90 z-10"></div>
      <img src="https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&q=80&w=800" className="absolute inset-0 w-full h-full object-cover grayscale opacity-40 z-0" />
      <div className="relative z-20 p-6 flex flex-col gap-4">
        <div className="flex justify-between items-start">
          <div className="flex flex-col gap-1">
            <h2 className="text-white text-xl font-bold leading-tight">Quét mã thiết bị</h2>
            <p className="text-white/80 text-sm font-medium">Truy cập bảo hành & thông số</p>
          </div>
          <div className="bg-white/20 backdrop-blur-sm p-2 rounded-lg border border-white/10">
            <span className="material-symbols-outlined text-white text-[32px]">qr_code_scanner</span>
          </div>
        </div>
        <button className="mt-2 flex items-center justify-center gap-2 bg-secondary hover:bg-[#e08215] text-white px-5 py-3 rounded-xl w-full font-bold shadow-lg transition-colors">
          <span className="material-symbols-outlined text-[20px]">center_focus_strong</span>
          <span>Quét ngay</span>
        </button>
      </div>
    </div>

    <div className="grid grid-cols-2 gap-4">
      <button onClick={onSupport} className="bg-white p-5 rounded-2xl shadow-card flex flex-col items-center gap-3 border border-transparent hover:border-primary/10">
        <div className="size-12 rounded-xl bg-orange-50 text-secondary flex items-center justify-center"><span className="material-symbols-outlined text-3xl">home_repair_service</span></div>
        <span className="font-bold text-sm">Hỗ trợ kỹ thuật</span>
      </button>
      <button onClick={onWarranty} className="bg-white p-5 rounded-2xl shadow-card flex flex-col items-center gap-3 border border-transparent hover:border-primary/10">
        <div className="size-12 rounded-xl bg-green-50 text-primary flex items-center justify-center"><span className="material-symbols-outlined text-3xl">verified_user</span></div>
        <span className="font-bold text-sm">Tra cứu bảo hành</span>
      </button>
    </div>

    <div className="space-y-3">
      <h3 className="text-primary text-sm font-bold uppercase tracking-wider ml-1 opacity-80">Dự án nổi bật</h3>
      <div className="bg-white rounded-2xl overflow-hidden shadow-card border border-black/5">
        <img src="https://images.unsplash.com/photo-1497435334941-8c899ee9e8e9?auto=format&fit=crop&q=80&w=600" className="h-40 w-full object-cover" />
        <div className="p-4"><h4 className="font-bold text-textMain">Hệ thống 15kWp - Biệt thự Đà Nẵng</h4><p className="text-xs text-textMuted mt-1">Lắp đặt tháng 12/2023</p></div>
      </div>
    </div>
  </div>
);

// --- NOTIFICATIONS SCREEN ---
const NotificationsScreen = ({ notifications, onMarkAllRead, onReadSingle }: { notifications: AppNotification[], onMarkAllRead: () => void, onReadSingle: (id: string) => void }) => {
  const getIcon = (type: string) => {
    switch (type) {
      case 'warranty': return { icon: 'verified_user', color: 'bg-green-50 text-primary' };
      case 'system': return { icon: 'bolt', color: 'bg-orange-50 text-secondary' };
      case 'promotion': return { icon: 'shopping_bag', color: 'bg-blue-50 text-blue-500' };
      case 'service': return { icon: 'support_agent', color: 'bg-purple-50 text-purple-500' };
      default: return { icon: 'notifications', color: 'bg-gray-50 text-gray-400' };
    }
  };

  return (
    <div className="px-4 space-y-4 page-transition">
      <div className="flex justify-between items-center mb-2 px-1">
        <h3 className="text-primary text-sm font-bold uppercase tracking-wider opacity-80">Mới nhất</h3>
        <button 
          onClick={onMarkAllRead}
          className="text-xs text-primary font-bold hover:underline active:opacity-60 transition-all"
        >
          Đánh dấu tất cả đã đọc
        </button>
      </div>
      <div className="space-y-3">
        {notifications.map(n => {
          const { icon, color } = getIcon(n.type);
          return (
            <div 
              key={n.id} 
              onClick={() => onReadSingle(n.id)}
              className={`bg-white p-4 rounded-2xl shadow-card flex gap-4 border transition-all cursor-pointer ${n.isRead ? 'border-transparent opacity-80' : 'border-primary/10 bg-primary/[0.02]'}`}
            >
              <div className={`size-12 rounded-xl flex items-center justify-center shrink-0 transition-transform ${color} ${!n.isRead ? 'scale-105' : ''}`}>
                <span className="material-symbols-outlined text-[28px] filled-icon">{icon}</span>
              </div>
              <div className="flex-1 space-y-1">
                <div className="flex justify-between items-start gap-2">
                  <h4 className={`text-sm font-bold text-textMain leading-tight ${n.isRead ? '' : 'text-primary'}`}>{n.title}</h4>
                  {!n.isRead && <span className="size-2.5 bg-primary rounded-full shrink-0 mt-1.5 shadow-sm shadow-primary/40 animate-pulse"></span>}
                </div>
                <p className="text-xs text-textMuted leading-relaxed">{n.description}</p>
                <p className="text-[10px] text-gray-400 font-medium pt-1">{n.timestamp}</p>
              </div>
            </div>
          );
        })}
      </div>
      <div className="text-center py-10 opacity-40">
        <p className="text-xs font-medium">Bạn đã xem hết thông báo</p>
      </div>
    </div>
  );
};

// --- SUPPORT MENU ---
const SupportMenu = ({ onNavigate }: any) => (
  <div className="px-4 space-y-6 page-transition">
    <div className="flex flex-col gap-3">
      <h3 className="text-primary text-sm font-bold uppercase tracking-wider ml-1 opacity-80">Danh mục hỗ trợ</h3>
      <SupportItem label="Hướng dẫn sử dụng" sub="Tài liệu kỹ thuật & lắp đặt" icon="menu_book" />
      <SupportItem label="Câu hỏi thường gặp" sub="Giải đáp các vấn đề phổ biến" icon="help_center" />
      <SupportItem label="Gửi yêu cầu hỗ trợ" sub="Báo cáo sự cố hệ thống" icon="edit_document" />
      <SupportItem label="Kiểm tra bảo hành" sub="Tra cứu thời hạn & chính sách" icon="verified_user" onClick={() => onNavigate('warranty')} />
    </div>

    <div className="mt-2">
      <div className="bg-gradient-to-br from-[#1E7F43] to-[#14522d] rounded-2xl p-5 text-white shadow-soft relative overflow-hidden">
        <div className="absolute -right-4 -top-4 w-24 h-24 rounded-full bg-white/10 blur-xl"></div>
        <div className="flex items-center gap-4 relative z-10">
          <div className="size-12 rounded-full bg-white/20 flex items-center justify-center border border-white/30 backdrop-blur-sm shrink-0">
            <span className="material-symbols-outlined text-white text-[28px]">headset_mic</span>
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-lg">Liên hệ kỹ thuật</h4>
            <p className="text-white/80 text-sm">Trực tuyến 24/7</p>
          </div>
          <a className="bg-white text-primary px-4 py-2 rounded-lg text-sm font-bold shadow-sm" href="tel:19001080">1900-1080</a>
        </div>
      </div>
    </div>
  </div>
);

const SupportItem = ({ label, sub, icon, onClick }: any) => (
  <button onClick={onClick} className="group flex items-center gap-4 bg-surface p-4 rounded-xl shadow-card active:bg-gray-50 transition-colors border border-transparent hover:border-primary/10 w-full text-left">
    <div className="flex size-10 items-center justify-center rounded-lg bg-[#E8F5E9] text-primary shrink-0 group-hover:scale-110 transition-transform duration-300">
      <span className="material-symbols-outlined filled-icon">{icon}</span>
    </div>
    <div className="flex-1 flex flex-col">
      <span className="text-textMain font-semibold text-base">{label}</span>
      <span className="text-textMuted text-xs">{sub}</span>
    </div>
    <span className="material-symbols-outlined text-gray-300 group-hover:text-primary transition-colors">chevron_right</span>
  </button>
);

// --- ACCOUNT SCREEN ---
const AccountScreen = ({ onLogout, onEditProfile }: any) => (
  <div className="px-4 space-y-6 page-transition">
    <div className="bg-primary rounded-3xl p-6 text-white shadow-soft relative overflow-hidden">
      <div className="absolute -right-10 -top-10 size-40 bg-white/10 rounded-full blur-3xl"></div>
      <div className="flex items-center gap-5 relative z-10">
        <div className="size-16 rounded-2xl bg-white p-1">
          <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" className="size-full rounded-xl object-cover" />
        </div>
        <div>
          <h3 className="font-bold text-lg">Nguyễn Văn An</h3>
          <span className="inline-block mt-1 px-2 py-0.5 bg-white/20 rounded-full text-[10px] font-bold uppercase tracking-wider">Khách hàng VIP</span>
        </div>
      </div>
    </div>
    <div className="space-y-2">
      <AccountMenuItem label="Thông tin tài khoản" icon="person" onClick={onEditProfile} />
      <AccountMenuItem label="Sản phẩm của tôi" icon="solar_power" />
      <AccountMenuItem label="Lịch sử bảo hành" icon="history" />
      <AccountMenuItem label="Đăng xuất" icon="logout" color="text-red-500" onClick={onLogout} />
    </div>
  </div>
);

const AccountMenuItem = ({ label, icon, color, onClick }: any) => (
  <button onClick={onClick} className="w-full p-4 bg-white rounded-xl flex items-center justify-between hover:bg-gray-50 transition-colors shadow-card">
    <div className="flex items-center gap-4">
      <span className={`material-symbols-outlined text-xl ${color || 'text-primary'}`}>{icon}</span>
      <span className={`text-sm font-bold ${color || 'text-textMain'}`}>{label}</span>
    </div>
    <span className="material-symbols-outlined text-gray-300">chevron_right</span>
  </button>
);

const TicketSuccessScreen = ({ ticketId, onReset }: any) => (
  <div className="p-8 text-center flex flex-col items-center justify-center min-h-[60vh] page-transition">
    <div className="size-20 bg-primary text-white rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-primary/20 animate-bounce">
      <span className="material-symbols-outlined text-4xl">check_circle</span>
    </div>
    <h2 className="text-2xl font-bold mb-2">Thành công!</h2>
    <p className="text-textMuted text-sm mb-8">Yêu cầu của bạn đã được tiếp nhận.</p>
    <div className="bg-bgLight px-6 py-4 rounded-xl border-2 border-dashed border-primary/20 mb-10 font-mono text-xl font-bold text-primary">{ticketId}</div>
    <button onClick={onReset} className="w-full bg-primary text-white py-4 rounded-xl font-bold uppercase tracking-wider active:scale-95 transition-all">Quay lại</button>
  </div>
);

export default App;
