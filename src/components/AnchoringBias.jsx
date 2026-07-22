import React, { useState } from 'react';
import { Anchor, RotateCw, CheckCircle2, Brain, Sparkles } from 'lucide-react';
import StatCard from './StatCard.jsx';
import ExplainerDrawer from './ExplainerDrawer.jsx';
import { playClickSound, playWinFanfare } from '../utils/sound.js';

export default function AnchoringBias({ lang = 'bn' }) {
  const [step, setStep] = useState(1); // 1: Spin anchor, 2: User estimate, 3: Reveal
  const [anchorNumber, setAnchorNumber] = useState(null);
  const [userEstimate, setUserEstimate] = useState(50);

  const isBn = lang === 'bn';

  const handleSpinAnchor = () => {
    playClickSound();
    // Generate high (85) or low (15) anchor randomly
    const anchor = Math.random() < 0.5 ? 85 : 15;
    setAnchorNumber(anchor);
    setStep(2);
  };

  const handleSubmitEstimate = () => {
    playClickSound();
    playWinFanfare();
    setStep(3);
  };

  const resetExperiment = () => {
    playClickSound();
    setStep(1);
    setAnchorNumber(null);
    setUserEstimate(50);
  };

  return (
    <section id="anchoring" className="py-6 sm:py-8 scroll-mt-24">
      <div className="glass-card rounded-3xl p-4 sm:p-8 border border-neutral-800 shadow-2xl relative overflow-hidden space-y-6">
        
        {/* Glow Accent */}
        <div className="absolute top-0 right-0 w-80 sm:w-96 h-80 sm:h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />

        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-3">
              <div className="p-2.5 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400">
                <Anchor className="w-6 h-6" />
              </div>
              <h2 className="text-xl sm:text-3xl font-extrabold text-neutral-100 tracking-tight">
                {isBn ? '⚓ অ্যাংকরিং ট্রিক (The Anchoring Trick)' : '⚓ The Anchoring Trick'}
              </h2>
            </div>
            <p className="text-neutral-400 text-xs sm:text-sm mt-1 font-medium">
              {isBn ? 'একটি সম্পূর্ণ অসংলগ্ন সংখ্যা আমাদের মস্তিষ্ককে না জেনেই প্রভাবিত করে!' : 'An irrelevant random number sub-consciously pulls your mental estimates!'}
            </p>
          </div>

          <button
            onClick={resetExperiment}
            className="flex items-center justify-center space-x-2 px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-semibold text-xs sm:text-sm border border-neutral-700 transition-all touch-manipulation"
          >
            <RotateCw className="w-4 h-4" />
            <span>{isBn ? 'পরীক্ষা রিসেট' : 'Reset Test'}</span>
          </button>
        </div>

        {/* Interactive 2-Step Experiment Stage */}
        <div className="glass-card rounded-2xl p-4 sm:p-6 border border-neutral-800 space-y-4">
          
          {step === 1 && (
            <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 text-center space-y-4">
              <span className="text-xs font-mono font-bold text-red-400 uppercase tracking-widest">
                {isBn ? 'ধাপ ১: স্পিন করে একটি র্যান্ডম সংখ্যা তৈরি করুন' : 'Step 1: Spin to generate a random number'}
              </span>
              <p className="text-xs sm:text-sm text-neutral-300">
                {isBn ? 'নিচের বাটনে চাপ দিয়ে একটি সম্পূর্ণ অসংলগ্ন র্যান্ডম সংখ্যা তৈরি করুন:' : 'Click the button to spin for a completely random number:'}
              </p>

              <button
                onClick={handleSpinAnchor}
                className="px-6 py-3 rounded-2xl bg-gradient-to-r from-red-600 to-purple-600 hover:from-red-500 hover:to-purple-500 text-white font-black text-xs sm:text-sm shadow-glow-purple transition-all touch-manipulation"
              >
                {isBn ? '🎰 হুইল স্পিন করুন' : '🎰 Spin the Wheel'}
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 space-y-4">
              <div className="flex justify-between items-center bg-neutral-950 p-3.5 rounded-xl border border-neutral-800">
                <span className="text-xs font-bold text-neutral-300">
                  {isBn ? 'তৈরি হওয়া র্যান্ডম সংখ্যা:' : 'Your Random Anchor Number:'}
                </span>
                <span className="text-2xl font-black font-mono text-red-400 bg-red-500/10 px-3 py-1 rounded-lg border border-red-500/30">
                  {anchorNumber}
                </span>
              </div>

              <div className="space-y-2 pt-2">
                <label className="text-xs sm:text-sm font-bold text-neutral-200 block">
                  {isBn 
                    ? 'প্রশ্ন: জাতিসংঘে (UN) আফ্রিকান দেশগুলোর শতকরা হার কত বলে আপনার অনুমান?' 
                    : 'Question: What percentage of African nations are members of the UN?'}
                </label>

                <div className="flex items-center space-x-4">
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={userEstimate}
                    onChange={(e) => setUserEstimate(parseInt(e.target.value))}
                    className="w-full h-3 bg-neutral-800 rounded-lg cursor-pointer accent-red-500"
                  />
                  <span className="text-lg font-black font-mono text-red-400 bg-neutral-950 px-3 py-1 rounded-lg border border-neutral-800">
                    {userEstimate}%
                  </span>
                </div>
              </div>

              <button
                onClick={handleSubmitEstimate}
                className="w-full py-3 rounded-xl bg-red-600 hover:bg-red-500 text-white font-black text-xs sm:text-sm shadow-glow-purple transition-all touch-manipulation"
              >
                {isBn ? 'অনুমান জমা দিন' : 'Submit Estimate'}
              </button>
            </div>
          )}

          {step === 3 && (
            <div className="p-6 rounded-2xl bg-neutral-900 border border-neutral-800 text-center space-y-4">
              <div className="flex items-center justify-center space-x-2 text-emerald-400 font-black text-base">
                <CheckCircle2 className="w-5 h-5" />
                <span>{isBn ? 'ফলাফল উন্মোচিত!' : 'Experiment Revealed!'}</span>
              </div>

              <div className="p-4 rounded-xl bg-neutral-950 border border-neutral-800 space-y-2 text-xs sm:text-sm text-neutral-300">
                <p>
                  {isBn ? (
                    <>আপনি প্রথমে র্যান্ডম সংখ্যা দেখেছিলেন <strong>{anchorNumber}</strong> এবং আপনার অনুমান হলো <strong>{userEstimate}%</strong>!</>
                  ) : (
                    <>You first saw random number <strong>{anchorNumber}</strong> and estimated <strong>{userEstimate}%</strong>!</>
                  )}
                </p>

                <p className="text-red-400 font-bold">
                  {anchorNumber > 50 ? (
                    isBn ? 'গবেষণায় দেখা গেছে, যারা ৮৫ সংখ্যাটি দেখে তাদের গড় অনুমান ছিল ৬৫%! র্যান্ডম সংখ্যাটি না জেনেই আপনার ব্রেনকে উপরের দিকে টেনেছে!' : 'Studies show people who saw 85 estimated an average of 65%! The random 85 pulled your estimate UPWARDS!'
                  ) : (
                    isBn ? 'গবেষণায় দেখা গেছে, যারা ১৫ সংখ্যাটি দেখে তাদের গড় অনুমান ছিল ২৫%! র্যান্ডম সংখ্যাটি আপনার ব্রেনকে নিচের দিকে টেনেছে!' : 'Studies show people who saw 15 estimated an average of 25%! The random 15 pulled your estimate DOWNWARDS!'
                  )}
                </p>
              </div>

              <button
                onClick={resetExperiment}
                className="px-6 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-bold text-xs border border-neutral-700"
              >
                {isBn ? 'আবার পরীক্ষা করুন' : 'Test Again'}
              </button>
            </div>
          )}

        </div>

        {/* Stat Verdict */}
        <StatCard
          label={isBn ? "অ্যাংকরিং এফেক্ট রায়" : "The Anchoring Verdict"}
          value={anchorNumber ? `Anchor: ${anchorNumber} ➔ Estimate: ${userEstimate}%` : "Cognitive Bias Unconscious Pull"}
          subtext={isBn ? "দোকানে 'ডিসকাউন্ট দাম' দেখানোর আসল রহস্য এই অ্যাংকরিং সাইকোলজি!" : "Retailers use Anchoring when showing strike-through original prices!"}
          icon={Brain}
          color="amber"
          highlight={true}
        />

        {/* Explainer Drawer */}
        <ExplainerDrawer
          title={isBn ? "অ্যাংকরিং ট্রিক (The Anchoring Trick)" : "The Anchoring Trick"}
          eli5={isBn 
            ? "আমোস ডাইভারস্কি এবং ড্যানিয়েল কাহনেম্যান ১৯৭৪ সালে একটি চাকা ঘুরিয়ে র্যান্ডম সংখ্যা (যেমন ১০ বা ৬৫) তৈরি করেন। তারপর মানুষদের জিজ্ঞেস করেন জাতিসংঘে আফ্রিকান দেশের হার কত। যারা চাকায় ৬৫ দেখেছিল তারা অনুমান করেছিল ৪৫%! আর যারা ১০ দেখেছিল তারা অনুমান করেছিল মাত্র ২৫%! চাকার অসংলগ্ন সংখ্যাটি মানুষের না জেনেই উত্তর বদলে দিয়েছিল!"
            : "In 1974, Kahneman & Tversky spun a roulette wheel marked 1 to 100. People who saw '65' estimated 45% of UN nations were African, while people who saw '10' estimated only 25%! The random wheel number unconsciously anchored their answers."}
          intuitionTrap={isBn 
            ? "আমাদের মস্তিষ্ক কোনো অজানা জিনিস অনুমান করার সময় প্রথম দেখা তথ্যটিকে লंगर বা 'Anchor' হিসেবে আঁকড়ে ধরে এবং সেখান থেকে অ্যাডজাস্ট করার চেষ্টা করে।"
            : "When estimating unknown values, the human brain grabs the first available number as an 'anchor' and adjusts around it."}
          mathProof={`Anchoring Index = (High Anchor Estimate - Low Anchor Estimate) / (High Anchor - Low Anchor)
Typical Anchoring Index in experiments = 55%!`}
          realWorld={isBn 
            ? "মার্কেটিং ও পেমেন্ট নেগোসিয়েশন! দোকানে কাপড়ের গায়ে ১,০০০ টাকার পাশে কেটে ৫০০ টাকা লেখা থাকে যাতে ৫০০ টাকা সস্তা মনে হয়!"
            : "Salary Negotiations & Retail Pricing! Strike-through MSRP prices set a high anchor."}
        />

      </div>
    </section>
  );
}
