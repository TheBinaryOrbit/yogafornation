import React from 'react';
import BenefitIcon1 from '../../assets/innerCalm.png';
import BenefitIcon2 from '../../assets/EmpowerYourBody.png';
import BenefitIcon3 from '../../assets/Connect&Grow.png';

// --- Data and Icon components are unchanged ---
const benefitsData = [
  {
    icon: BenefitIcon1,
    title: "Find Your Inner Calm",
    subtitle: "Calm Your Mind",
    features: [
      "Reduce Stress: Learn powerful breathing techniques to quiet your mind and ease daily tension.",
      "Improve Focus: Enhance concentration and mental clarity for a more productive day.",
      "Better Sleep Quality: Wind down effectively and enjoy a deeper, more restful sleep."
    ],
    bgColor: "bg-purple-50",
  },
  {
    icon: BenefitIcon2,
    title: "Empower Your Body",
    subtitle: "Feel Stronger & More Flexible",
    features: [
      "Increase Flexibility: Gently improve your body's range of motion and relieve stiffness.",
      "Boost Energy: Build stamina and feel more vibrant throughout your day.",
      "Enhance Mobility: Improve joint health and move with greater ease and confidence."
    ],
    bgColor: "bg-teal-50",
  },
  {
    icon: BenefitIcon3,
    title: "Connect & Grow",
    subtitle: "Join a Supportive Community",
    features: [
      "Practice Together: Be a part of a welcoming national movement, motivating each other.",
      "Stay Consistent: Our free, accessible classes make it easy to build a lasting yoga habit.",
      "Positive Mindset: Cultivate a positive outlook and find inspiration in shared wellness goals."
    ],
    bgColor: "bg-green-50",
  },
];
const CheckIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="flex-shrink-0 w-5 h-5 text-green-500"><path fillRule="evenodd" d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z" clipRule="evenodd" /></svg>
);
// --- End of unchanged data ---

const BenefitsSection = () => {
  return (
    <section className="pt-8 bg-white sm:pt-12 mb-10">
      <div className="px-6 mx-auto max-w-7xl lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-base font-semibold leading-7 text-[#1D6F42]">
            Why Join Our Movement?
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Your Daily Dose of Yoga, Made Simple.
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            We believe that a healthy nation starts with healthy people. Our mission is to bring the transformative power of yoga to every home in India, completely free of charge. By joining Yoga for Nation, you become a part of a collective mission to build a healthier society, one practice at a time.
          </p>
          <p className="mt-4 text-lg leading-8 text-gray-700 font-medium">
            Here's what you'll gain by joining our free yoga movement:
          </p>
        </div>
        <div className="grid grid-cols-1 gap-8 mt-12 sm:grid-cols-2 lg:grid-cols-3">
          {benefitsData.map((benefit, index) => (
            <div
              key={index}
              // HOVER EFFECT ADDED: Added transition, scale, and a light blue ring on hover.
              className={`rounded-2xl p-6 ${benefit.bgColor} flex flex-col items-center text-center shadow-sm transition-all duration-300 ease-in-out hover:scale-105 hover:shadow-xl hover:ring-2 hover:ring-blue-400`}
            >
              <div className="mb-4"><img src={benefit.icon} alt="" className='w-16 h-16'/></div>
              <h3 className="mb-2 text-xl font-semibold leading-7 text-gray-900">
                {benefit.title}
              </h3>
              <h4 className="mb-4 text-lg font-medium text-gray-700">
                {benefit.subtitle}
              </h4>
              <ul role="list" className="mt-auto space-y-3 text-sm text-gray-600 text-left">
                {benefit.features.map((feature, featureIndex) => (
                  <li key={featureIndex} className="flex items-start gap-x-3">
                    <CheckIcon />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BenefitsSection;