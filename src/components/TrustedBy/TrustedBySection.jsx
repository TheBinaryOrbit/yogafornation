import React from 'react';

// Testimonials data
const testimonials = [
  {
    name: 'Sangeeta Sharma',
    age: '45 yrs old',
    achievement: 'Reduced Stress',
    days: '105 Yoga Days',
    quote: 'I used to struggle with daily stress and anxiety. The breathing exercises in the free classes have helped me find inner peace. Now I feel calm and balanced every day, and it\'s all because of this movement.',
    avatar: 'https://t4.ftcdn.net/jpg/04/59/85/07/360_F_459850779_582p4mR7RTtvBFavIZlcpADdgLzeYlyo.jpg'
  },
  {
    name: 'Rohan Verma',
    age: '32 yrs old',
    achievement: 'Improved Mobility',
    days: '60 Yoga Days',
    quote: 'Chronic back pain was a major problem for me. After just two months of consistent practice, my mobility has significantly improved, and the pain is almost gone. These classes are truly transformative.',
    avatar: 'https://plus.unsplash.com/premium_photo-1671656349322-41de944d259b?fm=jpg&q=60&w=3000&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MXx8ZmFjZXN8ZW58MHx8MHx8fDA%3D'
  },
  {
    name: 'Priya Joshi',
    age: '38 yrs old',
    achievement: '8 kg Weight Loss',
    days: '120 Yoga Days',
    quote: 'I had always wanted to lose weight but lacked the motivation. Yoga for Nation gave me a supportive community and classes I love. I\'ve not only lost 8 kg but also built a habit that has changed my life for good.',
    avatar: 'https://thumbs.dreamstime.com/b/face-young-happy-indian-businesswoman-smiling-face-young-happy-indian-businesswoman-smiling-isolated-against-white-128979240.jpg'
  }
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
                <div className="text-3xl">
                  <img src={testimonial.avatar} alt={testimonial.name} className="w-16 h-16 rounded-2xl object-cover" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-gray-900">{testimonial.name}</h3>
                  </div>
                  <div className="text-sm text-gray-600">
                    <div>{testimonial.age} | {testimonial.days}</div>
                  </div>
                  <div className="text-sm text-gray-600 mb-4 font-medium">
                    <div>{testimonial.achievement}</div>
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

                <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="25" height="25" viewBox="0 0 48 48" className='ml-auto'>
                <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"></path><path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"></path><path fill="#4CAF50" d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"></path><path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"></path>
              </svg>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default TestimonialsSection;