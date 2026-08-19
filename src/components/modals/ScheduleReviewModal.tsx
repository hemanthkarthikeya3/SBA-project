import React, { useState } from 'react';
import { X, Calendar, CheckCircle2, Send, Sparkles } from 'lucide-react';
import { ClientProfile } from '../../types';

interface ScheduleReviewModalProps {
  client: ClientProfile;
  isOpen: boolean;
  onClose: () => void;
}

export const ScheduleReviewModal: React.FC<ScheduleReviewModalProps> = ({
  client,
  isOpen,
  onClose,
}) => {
  if (!isOpen) return null;

  const [date, setDate] = useState('2026-08-25');
  const [time, setTime] = useState('10:00 AM');
  const [meetingType, setMeetingType] = useState('In-Person at Client Headquarters');
  const [agenda, setAgenda] = useState(
    `1. Review Q3 Cash Flow Projections & Harvest Transition Liquidity
2. Discuss Whole Foods AR Acceleration Facility (₹10.25 Lakhs Pending Remittance)
3. Activate Automated Insured Cash Sweep for Excess Float (6.85% p.a. Overnight Yield)
4. Evaluate Fleet Card Diesel Rebate to offset EcoTransit freight surge (+12.0% YoY)`
  );
  const [isBooked, setIsBooked] = useState(false);

  const handleBook = (e: React.FormEvent) => {
    e.preventDefault();
    setIsBooked(true);
    setTimeout(() => {
      setIsBooked(false);
      onClose();
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
      <div className="bg-white rounded-lg max-w-xl w-full border border-[#c4c6cf] shadow-xl flex flex-col">
        {/* Header */}
        <div className="p-4 md:p-5 border-b border-gray-200 flex justify-between items-center bg-[#f7fafc] rounded-t-lg">
          <div className="flex items-center gap-2">
            <Calendar className="w-5 h-5 text-[#1960a3]" />
            <div>
              <h2 className="text-lg font-bold text-[#002045]">
                Schedule Client Advisory Review
              </h2>
              <p className="text-xs text-[#74777f]">
                {client.name} • {client.contactPerson.name} ({client.contactPerson.email})
              </p>
            </div>
          </div>
          <button onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-700 rounded-full hover:bg-gray-100">
            <X className="w-5 h-5" />
          </button>
        </div>

        {isBooked ? (
          <div className="p-8 text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-[#002045]">Review Session Scheduled!</h3>
            <p className="text-xs text-gray-600 max-w-md mx-auto">
              Calendar invitation and preliminary briefing pack sent to <strong>{client.contactPerson.email}</strong> and Relationship Manager <strong>{client.relationshipManager}</strong>.
            </p>
          </div>
        ) : (
          <form onSubmit={handleBook} className="p-4 md:p-6 space-y-4 text-xs">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="font-semibold text-gray-700 block mb-1">Meeting Date</label>
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#1960a3] outline-none"
                />
              </div>
              <div>
                <label className="font-semibold text-gray-700 block mb-1">Time (IST)</label>
                <select
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#1960a3] outline-none"
                >
                  <option>09:30 AM IST</option>
                  <option>11:00 AM IST</option>
                  <option>02:30 PM IST</option>
                  <option>04:00 PM IST</option>
                </select>
              </div>
            </div>

            <div>
              <label className="font-semibold text-gray-700 block mb-1">Meeting Format</label>
              <select
                value={meetingType}
                onChange={(e) => setMeetingType(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-[#1960a3] outline-none"
              >
                <option>In-Person at Client Headquarters</option>
                <option>Bank Commercial Banking Suite</option>
                <option>Secure Video Conference (Google Meet)</option>
              </select>
            </div>

            <div>
              <label className="font-semibold text-gray-700 block mb-1 flex items-center justify-between">
                <span>AI Pre-Populated Advisory Agenda (₹ INR)</span>
                <span className="text-[10px] text-[#1960a3] font-mono flex items-center gap-1">
                  <Sparkles className="w-3 h-3" />
                  Auto-grounded in risk flags
                </span>
              </label>
              <textarea
                rows={4}
                value={agenda}
                onChange={(e) => setAgenda(e.target.value)}
                className="w-full p-2.5 border border-gray-300 rounded focus:ring-2 focus:ring-[#1960a3] outline-none font-mono text-xs leading-relaxed"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 border border-gray-300 rounded text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 bg-[#002045] text-white rounded font-bold hover:bg-[#1a365d] flex items-center gap-1.5 shadow-2xs"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Confirm & Send Invite</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
