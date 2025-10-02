import React from 'react';

// Testimonials data
const testimonials = [
  {
    name: 'Sangeeta Sharma',
    age: '45 yrs old',
    achievement: 'Reduced Stress',
    days: '105 Yoga Days',
    quote: 'I used to struggle with daily stress and anxiety. The breathing exercises in the free classes have helped me find inner peace. Now I feel calm and balanced every day, and it\'s all because of this movement.',
    avatar: '👩‍💼'
  },
  {
    name: 'Rohan Verma',
    age: '32 yrs old',
    achievement: 'Improved Mobility',
    days: '60 Yoga Days',
    quote: 'Chronic back pain was a major problem for me. After just two months of consistent practice, my mobility has significantly improved, and the pain is almost gone. These classes are truly transformative.',
    avatar: '👨‍💼'
  },
  {
    name: 'Priya Joshi',
    age: '38 yrs old',
    achievement: '8 kg Weight Loss',
    days: '120 Yoga Days',
    quote: 'I had always wanted to lose weight but lacked the motivation. Yoga for Nation gave me a supportive community and classes I love. I\'ve not only lost 8 kg but also built a habit that has changed my life for good.',
    avatar: '👩‍🦱'
  },
  {
    name: 'Kavita Singh',
    age: '50 yrs old',
    achievement: 'Better Sleep',
    days: '90 Yoga Days',
    quote: 'Sleep had become a serious issue for me. Since joining the evening yoga sessions, I\'ve started sleeping much better. I feel so much more refreshed in the morning and have more energy throughout the day.',
    avatar: '👩‍🦳'
  },
  {
    name: 'Rajesh Kumar',
    age: '25 yrs old',
    achievement: 'More Energy',
    days: '50 Yoga Days',
    quote: 'As a student, I was always tired and lacked focus. This free movement has been a huge boost for my energy levels and mental clarity. I feel more vibrant and ready to take on any challenge.',
    avatar: '👨‍🎓'
  },
];

const TestimonialsSection = () => {
  return (
    <section className="py-16 bg-gray-50 sm:py-24">
      <div className="px-6 mx-auto max-w-7xl lg:px-8">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-base font-semibold leading-7 text-teal-600">
            Testimonials
          </h2>
          <p className="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">
            Your Journey, Our Inspiration
          </p>
        </div>
        
        <div className="grid grid-cols-1 gap-8 mt-16 sm:grid-cols-2 lg:grid-cols-3 lg:mt-20">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="bg-white rounded-2xl p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow duration-300"
            >
              <div className="flex items-start space-x-4">
                <div className="text-3xl">{testimonial.avatar}</div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{testimonial.name}</h3>
                  </div>
                  <div className="text-sm text-gray-600 mb-4">
                    <div>{testimonial.age} | {testimonial.achievement} | {testimonial.days}</div>
                  </div>
                </div>
              </div>
              
              <blockquote className="text-gray-700 leading-relaxed">
                "{testimonial.quote}"
              </blockquote>
              
              <div className="flex items-center mt-6">
                {[...Array(5)].map((_, i) => (
                  <svg
                    key={i}
                    className="w-4 h-4 text-yellow-400 fill-current"
                    viewBox="0 0 20 20"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;