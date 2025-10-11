import React from 'react';

// --- Data and Icon components are unchanged ---
const benefitsData = [
  {
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="w-10 h-10 text-purple-600" viewBox="0 0 16 16">
        <path d="M8 16a4 4 0 0 0 4-4 4 4 0 0 0 0-8 4 4 0 0 0-8 0 4 4 0 1 0 0 8 4 4 0 0 0 4 4m3-12q0 .11-.03.247c-.544.241-1.091.638-1.598 1.084A3 3 0 0 0 8 5c-.494 0-.96.12-1.372.331-.507-.446-1.054-.843-1.597-1.084A1 1 0 0 1 5 4a3 3 0 0 1 6 0m-.812 6.052A3 3 0 0 0 11 8a3 3 0 0 0-.812-2.052c.215-.18.432-.346.647-.487C11.34 5.131 11.732 5 12 5a3 3 0 1 1 0 6c-.268 0-.66-.13-1.165-.461a7 7 0 0 1-.647-.487m-3.56.617a3 3 0 0 0 2.744 0c.507.446 1.054.842 1.598 1.084q.03.137.03.247a3 3 0 1 1-6 0q0-.11.03-.247c.544-.242 1.091-.638 1.598-1.084m-.816-4.721A3 3 0 0 0 5 8c0 .794.308 1.516.812 2.052a7 7 0 0 1-.647.487C4.66 10.869 4.268 11 4 11a3 3 0 0 1 0-6c.268 0 .66.13 1.165.461.215.141.432.306.647.487M8 9a1 1 0 1 1 0-2 1 1 0 0 1 0 2" />
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
      <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" fill="currentColor" className="bi bi-person-arms-up text-teal-500" viewBox="0 0 16 16">
        <path d="M8 3a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3" />
        <path d="m5.93 6.704-.846 8.451a.768.768 0 0 0 1.523.203l.81-4.865a.59.59 0 0 1 1.165 0l.81 4.865a.768.768 0 0 0 1.523-.203l-.845-8.451A1.5 1.5 0 0 1 10.5 5.5L13 2.284a.796.796 0 0 0-1.239-.998L9.634 3.84a.7.7 0 0 1-.33.235c-.23.074-.665.176-1.304.176-.64 0-1.074-.102-1.305-.176a.7.7 0 0 1-.329-.235L4.239 1.286a.796.796 0 0 0-1.24.998l2.5 3.216c.317.316.475.758.43 1.204Z" />
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
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 21a9.004 9.004 0 008.716-6.747M12 21a9.004 9.004 0 01-8.716-6.747M12 21c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3m0 18c-2.485 0-4.5-4.03-4.5-9S9.515 3 12 3m0 0a8.997 8.997 0 017.843 4.582M12 3a8.997 8.997 0 00-7.843 4.582m15.686 0A11.953 11.953 0 0112 10.5c-2.998 0-5.74-1.1-7.843-2.918m15.686 0A8.959 8.959 0 0121 12c0 .778-.099 1.533-.284 2.253m0 0A17.919 17.919 0 0112 16.5c-3.162 0-6.133-.815-8.716-2.247m0 0A9.015 9.015 0 013 12c0-1.605.42-3.113 1.157-4.418" />
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
    <section className="pt-8 bg-white sm:pt-12 mb-10">
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