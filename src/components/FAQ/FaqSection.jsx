import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FaqSection = () => {
  const [faqData, setFaqData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFAQs = async () => {
      try {
        setLoading(true);
        const response = await axios.get('https://api.yogafornation.com/api/faqs');
        
        if (response.data.success) {
          setFaqData(response.data.faqs);
        } else {
          setError('Failed to fetch FAQs');
        }
      } catch (err) {
        console.error('Error fetching FAQs:', err);
        setError('Failed to load FAQs. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchFAQs();
  }, []);
  if (loading) {
    return (
      <section className="bg-white py-14 sm:py-22">
        <div className="px-6 mx-auto max-w-7xl lg:px-8">
          <div className="w-full mx-auto">
            <h2 className="text-3xl font-bold leading-10 tracking-tight text-center text-gray-900">
              Frequently asked questions
            </h2>
            <div className="mt-10 text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-orange-500"></div>
              <p className="mt-4 text-gray-600">Loading FAQs...</p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="bg-white py-14 sm:py-22">
        <div className="px-6 mx-auto max-w-7xl lg:px-8">
          <div className="w-full mx-auto">
            <h2 className="text-3xl font-bold leading-10 tracking-tight text-center text-gray-900">
              Frequently asked questions
            </h2>
            <div className="mt-10 text-center">
              <p className="text-red-600">{error}</p>
              <button 
                onClick={() => window.location.reload()} 
                className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600"
              >
                Try Again
              </button>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white py-14 sm:py-22">
      <div className="px-6 mx-auto max-w-7xl lg:px-8">
        {/* CHANGED: Increased width from max-w-4xl to max-w-7xl */}
        <div className="w-full mx-auto"> 
          <h2 className="text-3xl font-bold leading-10 tracking-tight text-center text-gray-900">
            Frequently asked questions
          </h2>
          {faqData.length > 0 ? (
            <dl className="mt-10 space-y-6 divide-y divide-gray-900/10">
              {faqData.map((faq) => (
                <FaqItem key={faq.id} question={faq.question} answer={faq.answer} />
              ))}
            </dl>
          ) : (
            <div className="mt-10 text-center">
              <p className="text-gray-600">No FAQs available at the moment.</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

// This is the individual FAQ item component that manages its own open/close state
const FaqItem = ({ question, answer }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="pt-6">
      <dt>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex items-start justify-between w-full p-4 -m-4 text-left text-gray-900 transition-colors rounded-lg hover:bg-slate-50"
        >
          <span className="text-base font-semibold leading-7">{question}</span>
          <span className="flex items-center ml-6 h-7">
            {isOpen ? (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 12H6" />
              </svg>
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
              </svg>
            )}
          </span>
        </button>
      </dt>
      {/* This div handles the smooth open/close animation */}
      <dd
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96' : 'max-h-0'
        }`}
      >
        <div className="pr-12 mt-2">
          <p className="text-base leading-7 text-gray-600">{answer}</p>
        </div>
      </dd>
    </div>
  );
};

export default FaqSection;