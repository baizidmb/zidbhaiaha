import React, { useState } from 'react';
import { Hotel, UserPlus, Users, RotateCcw, Sparkles } from 'lucide-react';
import StatCard from './StatCard.jsx';
import ExplainerDrawer from './ExplainerDrawer.jsx';
import { playClickSound, playWinFanfare } from '../utils/sound.js';

export default function InfiniteHotel({ lang = 'bn' }) {
  const [rooms, setRooms] = useState([
    { id: 1, guest: 'Guest #1' },
    { id: 2, guest: 'Guest #2' },
    { id: 3, guest: 'Guest #3' },
    { id: 4, guest: 'Guest #4' },
    { id: 5, guest: 'Guest #5' },
    { id: 6, guest: 'Guest #6' },
  ]);
  const [statusMessage, setStatusMessage] = useState(null);
  const [shiftCount, setShiftCount] = useState(0);

  const isBn = lang === 'bn';

  // Add 1 New Guest: Move room n to n+1
  const handleAddOneGuest = () => {
    playClickSound();
    playWinFanfare();

    setRooms(prev => {
      const shifted = prev.map(r => ({
        id: r.id,
        guest: r.id === 1 ? 'NEW GUEST #1 🎉' : prev[r.id - 2]?.guest || `Guest #${r.id - 1}`
      }));
      return shifted;
    });

    setShiftCount(c => c + 1);
    setStatusMessage(
      isBn
        ? 'রুম ১-এর অতিথি রুম ২-এ, রুম ২-এর অতিথি রুম ৩-এ স্থানান্তরিত হয়েছেন! রুম ১ এখন নতুন অতিথির জন্য সম্পূর্ণ ফাঁকা!'
        : 'Guest in Room 1 moved to Room 2, Room 2 moved to Room 3... Room 1 is now FREE for the new guest!'
    );
  };

  // Add Infinity Guests: Move room n to 2n (odd rooms free)
  const handleAddInfiniteGuests = () => {
    playClickSound();
    playWinFanfare();

    setRooms(prev => {
      return prev.map(r => {
        if (r.id % 2 === 0) {
          return { id: r.id, guest: `Old Guest #${r.id / 2} (Shifted to 2n)` };
        } else {
          return { id: r.id, guest: `∞ New Infinite Guest #${r.id}` };
        }
      });
    });

    setShiftCount(c => c + 100);
    setStatusMessage(
      isBn
        ? 'সকল বিদ্যমান অতিথি রুম n থেকে ২n নম্বরে স্থানান্তরিত হয়েছেন! ফলে সকল বিজোড় রুম (১, ৩, ৫, ৭...) ফাঁকা হয়ে অসীম নতুন অতিথিদের আশ্রয় তৈরি হয়েছে!'
        : 'All existing guests moved from Room n to 2n! All odd-numbered rooms (1, 3, 5, 7...) are now FREE for infinitely many new guests!'
    );
  };

  const resetHotel = () => {
    playClickSound();
    setRooms([
      { id: 1, guest: 'Guest #1' },
      { id: 2, guest: 'Guest #2' },
      { id: 3, guest: 'Guest #3' },
      { id: 4, guest: 'Guest #4' },
      { id: 5, guest: 'Guest #5' },
      { id: 6, guest: 'Guest #6' },
    ]);
    setShiftCount(0);
    setStatusMessage(null);
  };

  return (
    <section id="hotel" className="py-6 sm:py-8 scroll-mt-24">
      <div className="glass-card rounded-3xl p-4 sm:p-8 border border-neutral-800 shadow-2xl relative overflow-hidden space-y-6">
        
        {/* Glow Accent */}
        <div className="absolute top-0 right-0 w-80 sm:w-96 h-80 sm:h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-400">
                <Hotel className="w-6 h-6" />
              </div>
              <h2 className="text-xl sm:text-3xl font-extrabold text-neutral-100 tracking-tight">
                {isBn ? '🏨 হিলবার্টের অসীম হোটেল (Hilbert\'s Infinite Hotel)' : '🏨 Hilbert\'s Infinite Hotel'}
              </h2>
            </div>
            <p className="text-neutral-400 text-xs sm:text-sm mt-1 font-medium">
              {isBn ? 'একটি সম্পূর্ণ পূর্ণ অসীম হোটেলে অসীম নতুন অতিথি আসলেও সকলকে ঘর দেওয়া সম্ভব!' : 'A fully booked infinite hotel can STILL accommodate infinitely many new guests!'}
            </p>
          </div>

          <button
            onClick={resetHotel}
            className="flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold text-xs sm:text-sm border border-neutral-700 transition-all touch-manipulation"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{isBn ? 'হোটেল রিসেট' : 'Reset Hotel'}</span>
          </button>
        </div>

        {/* Action Controls */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <button
            onClick={handleAddOneGuest}
            className="flex items-center justify-center space-x-2 p-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs sm:text-sm shadow-glow-purple transition-all touch-manipulation"
          >
            <UserPlus className="w-5 h-5" />
            <span>{isBn ? '+১ জন নতুন অতিথি আসলেন (Move n ➔ n+1)' : '+1 New Guest Arrives (Move n ➔ n+1)'}</span>
          </button>

          <button
            onClick={handleAddInfiniteGuests}
            className="flex items-center justify-center space-x-2 p-4 rounded-2xl bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-500 hover:to-purple-500 text-white font-black text-xs sm:text-sm shadow-glow-purple transition-all touch-manipulation"
          >
            <Users className="w-5 h-5" />
            <span>{isBn ? '∞ অসীম নতুন অতিথি আসলেন (Move n ➔ 2n)' : '∞ Infinitely Many Guests Arrive (Move n ➔ 2n)'}</span>
          </button>
        </div>

        {/* Status Banner */}
        {statusMessage && (
          <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center space-x-3 text-xs sm:text-sm text-purple-300 font-semibold animate-pulse-slow">
            <Sparkles className="w-5 h-5 flex-shrink-0" />
            <span>{statusMessage}</span>
          </div>
        )}

        {/* Visual Room Grid */}
        <div className="glass-card rounded-2xl p-4 sm:p-6 border border-neutral-800 space-y-3">
          <h3 className="text-xs font-bold text-neutral-300 uppercase tracking-wider">
            {isBn ? 'লাইভ হোটেল রুম গ্রিড (Rooms 1 to ∞)' : 'Live Hotel Room Grid (Rooms 1 to ∞)'}
          </h3>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {rooms.map(room => (
              <div
                key={room.id}
                className="p-4 rounded-2xl bg-neutral-900 border border-neutral-800 flex flex-col items-center justify-between min-h-[110px] shadow-lg transition-all duration-300 transform hover:scale-105 hover:border-purple-500"
              >
                <span className="text-[10px] font-mono font-bold text-purple-400 uppercase">ROOM #{room.id}</span>
                <span className="text-xs font-bold text-neutral-200 text-center my-2">{room.guest}</span>
                <span className="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">OCCUPIED</span>
              </div>
            ))}
          </div>

          <div className="text-center pt-2">
            <span className="text-xs font-mono text-neutral-500">
              ... ROOM #7 ➔ ROOM #8 ➔ ROOM #9 ... ➔ ROOM ∞ (Infinite Rooms)
            </span>
          </div>
        </div>

        {/* Stat Verdict */}
        <StatCard
          label={isBn ? "হোটেল ক্যাপাসিটি রায" : "Infinite Hotel Verdict"}
          value="100% Fully Occupied & Always Room for More!"
          subtext={isBn ? "অসীমের সাথে যেকোনো সংখ্যা যোগ করলেও ফলাফল অসীমই (∞ + 1 = ∞) থাকে!" : "Adding any number to infinity still equals infinity (∞ + 1 = ∞)!"}
          icon={Hotel}
          color="purple"
          highlight={true}
        />

        {/* Explainer Drawer */}
        <ExplainerDrawer
          title={isBn ? "হিলবার্টের অসীম হোটেল (Hilbert's Infinite Hotel)" : "Hilbert's Infinite Hotel"}
          eli5={isBn 
            ? "একটি সাধারণ হোটেল পূর্ণ থাকলে নতুন কোনো অতিথিকে ঘর দেওয়া যায় না। কিন্তু বিখ্যাত গণিতবিদ ডেভিড হিলবার্টের অসীম হোটেলে бесконечно বা অসীমসংখ্যক ঘর রয়েছে! হোটেল পূর্ণ থাকা সত্ত্বেও যদি ১ জন নতুন অতিথি আসেন, ম্যানেজার ১ নম্বর ঘরের অতিথিকে ২ নম্বরে, ২ নম্বরকে ৩ নম্বরে এবং n নম্বর ঘরের অতিথিকে (n+1) নম্বর ঘরে যেতে বলেন। ফলে ১ নম্বর ঘরটি একদম ফাঁকা হয়ে যায়!"
            : "A normal hotel with finite rooms turns away new guests when full. But David Hilbert's Infinite Hotel has infinitely many rooms! Even when fully occupied, the manager asks the guest in Room 1 to move to Room 2, Room 2 to Room 3, and Room n to Room (n+1)—freeing up Room 1 instantly!"}
          intuitionTrap={isBn 
            ? "আমরা অসীমকে বড় কোনো একটা সংখ্যা মনে করি। কিন্তু অসীম কোনো বড় সংখ্যা নয়, অসীম হলো গণিতের একটি প্রক্রিয়া! তাই অসীমের সাথে ১ যোগ করলেও তা অসীমই থাকে (∞ + 1 = ∞)।"
            : "We treat infinity like a very big number. But infinity isn't a number—it's a mathematical concept. Adding 1 or adding another infinity to infinity still leaves you with infinity!"}
          mathProof={`For 1 new guest: Move Room n ➔ Room (n+1). Room 1 is empty!
For ∞ new guests: Move Room n ➔ Room 2n. All odd rooms (1, 3, 5, 7...) are empty!
Cardinality of Countable Infinity: |ℵ₀| = |ℵ₀ + 1| = |2 * ℵ₀|`}
          realWorld={isBn 
            ? "কম্পিউটার সায়েন্সে ডেটা মেমরি ম্যানেজমেন্ট ও ফ্র্যাক্টাল জিওমেট্রি।"
            : "Computer Science Memory Allocation and Transfinite Set Theory."}
        />

      </div>
    </section>
  );
}
