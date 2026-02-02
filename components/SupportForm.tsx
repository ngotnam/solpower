
import React, { useState } from 'react';
import { MOCK_WARRANTIES } from '../constants';
import { WarrantyStatus } from '../types';

interface SupportFormProps {
  onSuccess: (ticketId: string) => void;
  onBack: () => void;
}

const SupportForm: React.FC<SupportFormProps> = ({ onSuccess, onBack }) => {
  const [serial, setSerial] = useState('');
  const [found, setFound] = useState<WarrantyStatus | null>(null);

  const checkSerial = () => {
    const target = serial.toUpperCase().trim();
    if (MOCK_WARRANTIES[target]) {
      setFound(MOCK_WARRANTIES[target]);
    } else {
      setFound(null);
    }
  };

  return (
    <div className="px-6 page-transition">
      <button onClick={onBack} className="flex items-center text-primary font-bold text-xs uppercase mb-6 active:scale-90 transition-transform">
        <span className="material-symbols-outlined text-sm mr-1">arrow_back_ios</span> Quay lại
      </button>

      <div className="mb-8 mt-2">
        <h2 className="text-2xl font-bold text-textMain mb-2">Check Product<br/>Warranty</h2>
        <p className="text-sm text-textMuted font-medium leading-relaxed">Kiểm tra thông tin bảo hành thiết bị SOLPOWER nhanh chóng.</p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="relative group">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-gray-400 group-focus-within:text-primary transition-colors">
            <span className="material-symbols-outlined">qr_code_2</span>
          </div>
          <input 
            type="text" 
            placeholder="Nhập S/N hoặc SĐT..." 
            value={serial}
            onChange={(e) => setSerial(e.target.value.toUpperCase())}
            className="block w-full pl-12 pr-4 py-4 rounded-xl border-none bg-white shadow-sm text-textMain placeholder-gray-400 focus:ring-2 focus:ring-secondary transition-all font-medium"
          />
        </div>
        <button 
          onClick={checkSerial}
          className="w-full py-4 bg-secondary hover:bg-[#e08215] text-white rounded-xl font-bold text-base shadow-lg shadow-orange-500/20 active:scale-[0.98] transition-all flex items-center justify-center gap-2"
        >
          Kiểm tra
        </button>
      </div>

      <div className="flex items-center gap-4 my-8">
        <div className="h-px bg-gray-200 flex-1"></div>
        <span className="text-gray-400 text-sm font-medium">Hoặc</span>
        <div className="h-px bg-gray-200 flex-1"></div>
      </div>

      <button className="group w-full py-6 border-2 border-dashed border-secondary/30 hover:border-secondary bg-orange-50/50 rounded-2xl flex flex-col items-center justify-center gap-3 active:bg-orange-50 transition-all">
        <div className="w-14 h-14 rounded-full bg-secondary/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-300 text-secondary">
          <span className="material-symbols-outlined text-3xl">photo_camera</span>
        </div>
        <div className="text-center">
          <span className="block text-secondary font-bold text-base">Quét mã QR</span>
          <span className="block text-gray-400 text-xs mt-1">Tự động nhận diện thiết bị</span>
        </div>
      </button>

      {found && (
        <div className="mt-10 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between mb-4 px-1">
            <h3 className="text-xs font-bold text-textMain uppercase tracking-wider">Kết quả tra cứu</h3>
            <span className="text-[10px] text-gray-400">Vừa xong</span>
          </div>
          
          <div className="bg-white rounded-2xl p-5 shadow-soft border border-gray-100 relative overflow-hidden group">
            <div className="absolute top-0 right-0 -mt-8 -mr-8 w-32 h-32 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors"></div>
            
            <div className="flex items-start justify-between relative z-10">
              <div className="flex gap-4">
                <div className="w-16 h-16 rounded-xl bg-gray-50 flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-primary text-3xl filled-icon">solar_power</span>
                </div>
                <div>
                  <h4 className="text-lg font-bold text-textMain leading-tight">{found.productName}</h4>
                  <p className="text-xs text-textMuted mt-1">Model: {found.model}</p>
                </div>
              </div>
              <span className="inline-flex items-center gap-1 px-2 py-1 rounded-full bg-primary/10 text-primary text-[10px] font-bold whitespace-nowrap">
                <span className="material-symbols-outlined text-sm filled-icon">check_circle</span> Còn bảo hành
              </span>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-y-4 border-t border-gray-50 pt-4">
              <div><p className="text-[10px] text-gray-400 mb-0.5 font-bold uppercase">Số Serial</p><p className="text-sm font-bold text-textMain font-mono">{found.serial}</p></div>
              <div><p className="text-[10px] text-gray-400 mb-0.5 font-bold uppercase">Ngày kích hoạt</p><p className="text-sm font-bold text-textMain">{found.activationDate}</p></div>
              <div className="col-span-2"><p className="text-[10px] text-gray-400 mb-0.5 font-bold uppercase">Thời hạn đến</p><p className="text-sm font-bold text-primary">{found.expiryDate} (Còn 4 năm)</p></div>
            </div>

            <button 
              onClick={() => onSuccess(`TK-${Math.floor(Math.random()*90000)+10000}`)}
              className="mt-5 w-full text-xs font-bold text-secondary flex items-center justify-end gap-1 hover:underline transition-all"
            >
              Gửi yêu cầu hỗ trợ kỹ thuật <span className="material-symbols-outlined text-sm">arrow_forward</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupportForm;
