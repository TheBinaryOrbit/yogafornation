import React from 'react';
// Using your original logo import
import logoImage from '../../assets/logoBgRemove.png';
import { MapPin, Phone } from 'lucide-react';

// Using your original navigation data, restructured for the new layout
const navigation = {
  community: [
    { name: 'Testimonials', href: '#testimonials' },
    { name: 'Join Our Movement', href: '/register' },
    { name: 'FAQs', href: '#faq' },
  ],
  wellness: [
    { name: 'Yoga', href: '#' },
    { name: 'Meditation', href: '#' },
    { name: 'Healthy Habits', href: '#' },
    { name: 'Lifestyle', href: '#' },
  ],
  social: [
    { name: 'Facebook', href: 'https://www.facebook.com/YogaForNation/', icon: (props) => <svg fill="currentColor" viewBox="0 0 24 24" {...props}><path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" /></svg> },
    { name: 'Instagram', href: 'https://www.instagram.com/YogaForNation/', icon: (props) => <svg fill="currentColor" viewBox="0 0 24 24" {...props}><path fillRule="evenodd" d="M12.315 2c2.43 0 2.784.013 3.808.06 1.064.049 1.791.218 2.427.465a4.902 4.902 0 011.772 1.153 4.902 4.902 0 011.153 1.772c.247.636.416 1.363.465 2.427.048 1.024.06 1.378.06 3.808s-.012 2.784-.06 3.808c-.049 1.064-.218 1.791-.465 2.427a4.902 4.902 0 01-1.153 1.772 4.902 4.902 0 01-1.772 1.153c-.636.247-1.363.416-2.427.465-1.024.048-1.378.06-3.808.06s-2.784-.013-3.808-.06c-1.064-.049-1.791-.218-2.427-.465a4.902 4.902 0 01-1.772-1.153 4.902 4.902 0 01-1.153-1.772c-.247-.636-.416-1.363-.465-2.427-.048-1.024-.06-1.378-.06-3.808s.012-2.784.06-3.808c.049 1.064.218 1.791.465 2.427a4.902 4.902 0 011.153-1.772A4.902 4.902 0 016.08 2.525c.636-.247 1.363-.416 2.427-.465C9.53 2.013 9.884 2 12.315 2zM12 7a5 5 0 100 10 5 5 0 000-10zm0 8a3 3 0 110-6 3 3 0 010 6zm5.25-9.75a1.25 1.25 0 100-2.5 1.25 1.25 0 000 2.5z" clipRule="evenodd" /></svg> },
    { name: 'YouTube', href: 'https://www.youtube.com/@yogafornation9/', icon: (props) => <svg fill="currentColor" viewBox="0 0 24 24" {...props}><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" /></svg> },
    { name: 'LinkedIn', href: 'https://www.linkedin.com/yogafornation/', icon: (props) => <svg fill="currentColor" viewBox="0 0 24 24" {...props}><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.225 0z" /></svg> },
    {
      name: 'Twitter',
      href: 'https://www.twitter.com/YogaForNation/',
      icon: (props) => (
        <svg
          viewBox="0 0 24 24"
          fill="currentColor"
          aria-hidden="true"
          {...props}
        >
          <path d="M23 4.558a9.83 9.83 0 01-2.828.775 4.932 4.932 0 002.165-2.724 9.864 9.864 0 01-3.127 1.195 4.917 4.917 0 00-8.38 4.482A13.94 13.94 0 011.671 3.149a4.917 4.917 0 001.523 6.574 4.903 4.903 0 01-2.229-.616c-.054 2.281 1.581 4.415 3.949 4.89A4.935 4.935 0 01.96 14.09v.062a4.919 4.919 0 003.946 4.827 4.996 4.996 0 01-2.224.084 4.926 4.926 0 004.6 3.417A9.868 9.868 0 010 21.543a13.94 13.94 0 007.548 2.212c9.056 0 14.01-7.514 14.01-14.02 0-.213-.005-.425-.014-.636A10.012 10.012 0 0023 4.558z" />
        </svg>
      )
    }
  ],
};

const Footer = () => {
  return (
    // Replaced the gradient with a solid, calming dark teal color
    <footer className="bg-teal-700 text-white" aria-labelledby="footer-heading">
      <h2 id="footer-heading" className="sr-only">Footer</h2>
      <div className="mx-auto max-w-7xl px-6 py-16 sm:py-24 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">

          {/* Column 1: Logo, Mission, and Social Links */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center space-x-3">
              <img className="h-12 w-auto" src={logoImage} alt="Yoga For Nation" />
              <span className="text-2xl font-bold">Yoga For Nation</span>
            </div>
            <div className='flex flex-col justify-start items-start gap-2 text-lg text-teal-200'>
              <p className='flex justify-center items-center'><MapPin className="h-5 w-5 text-teal-300" />&nbsp;Address: Delhi, India</p>
              <p className='flex justify-center items-center'><Phone className="h-5 w-5 text-teal-300" />&nbsp;Phone: +91 12345 67890</p>
            </div>
            <div className="flex space-x-4 pt-2">
              {navigation.social.map((item) => (
                <a key={item.name} href={item.href} className="text-teal-200 hover:text-white transition-colors duration-200" target="_blank" rel="noopener noreferrer">
                  <span className="sr-only">{item.name}</span>
                  <item.icon className="h-6 w-6" aria-hidden="true" />
                </a>
              ))}
            </div>
          </div>

          {/* Column 2: Community Links */}
          <div>
            <h3 className="text-base font-semibold leading-6 text-white">Community</h3>
            <ul role="list" className="mt-6 space-y-4">
              {navigation.community.map((item) => (
                <li key={item.name}>
                  <a href={item.href} className="text-sm leading-6 text-teal-100 hover:text-white transition-colors duration-200">
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Wellness Links */}
          <div>
            <h3 className="text-base font-semibold leading-6 text-white">Wellness Topics</h3>
            <ul role="list" className="mt-6 space-y-4">
              {navigation.wellness.map((item) => (
                <li key={item.name}>
                  <a href={item.href} className="text-sm leading-6 text-teal-100 hover:text-white transition-colors duration-200">
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

        </div>

        {/* Bottom Footer Bar */}
        <div className="mt-16 border-t border-white/10 pt-8 flex flex-col sm:flex-row justify-between items-center">
          <p className="text-xs leading-5 text-teal-200">
            &copy; 2025 Yoga For Nation. Building a healthier India, one breath at a time.
          </p>
          <div className="mt-4 sm:mt-0 flex space-x-6">
            <a href="#" className="text-xs leading-5 text-teal-200 hover:text-white transition-colors duration-200">
              Privacy Policy
            </a>
            <a href="#" className="text-xs leading-5 text-teal-200 hover:text-white transition-colors duration-200">
              Terms of Service
            </a>
            <a href="#" className="text-xs leading-5 text-teal-200 hover:text-white transition-colors duration-200">
              Support
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;