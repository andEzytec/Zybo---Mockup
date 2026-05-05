import { Phone, Video, MoreVertical } from 'lucide-react';

export function WhatsAppHeader() {
  return (
    <div className="bg-[#075e54] text-white px-4 py-2 flex items-center justify-between shadow-md flex-shrink-0">
      <div className="flex items-center gap-2">
        <div className="w-9 h-9 rounded-full overflow-hidden">
          <img
            src="https://i.postimg.cc/wjQcWtMT/logo-Zybo-Whatsapp-jpg.jpg"
            alt="Zybo"
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <div className="font-semibold text-sm">Zybo</div>
          <div className="text-xs text-green-200">en línea</div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Video className="w-4 h-4 cursor-pointer hover:opacity-80" />
        <Phone className="w-4 h-4 cursor-pointer hover:opacity-80" />
        <MoreVertical className="w-4 h-4 cursor-pointer hover:opacity-80" />
      </div>
    </div>
  );
}
