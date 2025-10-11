import React from 'react';

// --- Data and Icon components are unchanged ---
const benefits = [
  {
    name: 'Guided Practice',
    description: 'Stay on the right path with clear, expert-led sessions. Our instructors provide personalized guidance, ensuring you practice safely and effectively from day one.',
    icon: (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-headphones" viewBox="0 0 16 16">
      <path d="M8 3a5 5 0 0 0-5 5v1h1a1 1 0 0 1 1 1v3a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V8a6 6 0 1 1 12 0v5a1 1 0 0 1-1 1h-1a1 1 0 0 1-1-1v-3a1 1 0 0 1 1-1h1V8a5 5 0 0 0-5-5" />
    </svg>),
    iconBgColor: 'bg-blue-100',
    iconTextColor: 'text-blue-600',
  },
  {
    name: 'Flexible Schedules',
    description: 'Your well-being should fit into your life, not the other way around. Choose from a range of live classes throughout the day, so you can practice when it suits you best.',
    icon: (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>),
    iconBgColor: 'bg-yellow-100',
    iconTextColor: 'text-yellow-700',
  },
  {
    name: 'Yoga, Anywhere',
    description: 'Your living room is now your studio. Our classes are easily accessible on any device, so you can start or end your day with a calm practice, no matter where you are.',
    icon: (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M10.5 1.5H8.25A2.25 2.25 0 006 3.75v16.5a2.25 2.25 0 002.25 2.25h7.5A2.25 2.25 0 0018 20.25V3.75a2.25 2.25 0 00-2.25-2.25H13.5m-3 0V3h3V1.5m-3 0h3m-3 18.75h3" /></svg>),
    iconBgColor: 'bg-green-100',
    iconTextColor: 'text-green-600',
  },
  {
    name: 'Collective Well-being',
    description: 'Be a part of something bigger. Join our group programs and community challenges designed to boost collective health and inspire a shared commitment to wellness.',
    icon: (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" /></svg>),
    iconBgColor: 'bg-pink-100',
    iconTextColor: 'text-pink-600',
  },
  {
    name: 'Build Your Habit',
    description: 'Make yoga a natural part of your routine. We provide encouraging reminders and tools to help you stay consistent and build a sustainable habit for life.',
    icon: (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L13.5 21.75 16.5 12h-8.25z" /></svg>),
    iconBgColor: 'bg-purple-100',
    iconTextColor: 'text-purple-600',
  },
  {
    name: 'Progress at Your Pace',
    description: 'Whether you\'re new to yoga or looking to deepen your poses, our classes are structured to help you grow steadily. There\'s a path for every person, every level.',
    icon: (<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941" /></svg>),
    iconBgColor: 'bg-red-100',
    iconTextColor: 'text-red-600',
  },
];
// --- End of unchanged data ---

const ExclusiveBenefits = () => {
  return (
    <div className="pb-8 bg-white pt- sm:pt-16 sm:pb-24">
      <div className="px-6 mx-auto max-w-7xl lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-base font-semibold leading-7 text-teal-600 mt-10">
            Our Features
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Unlock Your Journey to Wellness
          </p>
          <p className="mt-6 text-lg leading-8 text-gray-600">
            At Yoga for Nation, we are dedicated to making yoga accessible and enjoyable for everyone. Discover what makes our free yoga movement special:
          </p>
        </div>

        <div className="max-w-2xl mx-auto mt-16 sm:mt-20 lg:mt-24 lg:max-w-none">
          <dl className="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 md:grid-cols-2 lg:max-w-none lg:grid-cols-3 lg:gap-y-16">
            {benefits.map((feature) => (
              // HOVER EFFECT ADDED: Added padding, negative margin, transition, and a light blue background on hover.
              <div
                key={feature.name}
                className="relative flex items-start p-4 -m-4 transition-colors duration-300 ease-in-out rounded-xl hover:bg-sky-50"
              >
                <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg ${feature.iconBgColor}`}>
                  <div className={feature.iconTextColor}>{feature.icon}</div>
                </div>
                <div className="ml-5">
                  <dt className="text-base font-semibold leading-7 text-gray-900">
                    {feature.name}
                  </dt>
                  <dd className="mt-2 text-base leading-7 text-gray-600">
                    {feature.description}
                  </dd>
                </div>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
};

export default ExclusiveBenefits;