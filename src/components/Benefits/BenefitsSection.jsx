import React from 'react';

// --- Data and Icon components are unchanged ---
const benefitsData = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-purple-600">
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 18v-5.25m0 0a6.01 6.01 0 001.5-.189m-1.5.189a6.01 6.01 0 01-1.5-.189m3.75 7.478a12.06 12.06 0 01-4.5 0m4.5 0a12.06 12.06 0 00-4.5 0m4.5 0V19.5a2.25 2.25 0 00-2.25-2.25H9.75a2.25 2.25 0 00-2.25 2.25v1.5m4.5-1.5h.008v.008H12v-.008z" />
      </svg>
    ),
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
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-teal-600">
        <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 15.182a4.5 4.5 0 01-6.364 0M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
      </svg>
    ),
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
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-10 h-10 text-green-600">
        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
      </svg>
    ),
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
    <section className="pt-8 bg-white sm:pt-12">
      <div className="px-6 mx-auto max-w-7xl lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-base font-semibold leading-7 text-teal-600">
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
              <div className="mb-4">{benefit.icon}</div>
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