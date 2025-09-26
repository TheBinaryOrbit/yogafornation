import React, { useState, useEffect } from 'react'
import TrustedBySection from '../components/TrustedBy/TrustedBySection'
import BenefitsSection from '../components/Benefits/BenefitsSection'
import ExclusiveBenefits from '../components/MemberShip/ExclusiveBenefits'
import CallToActionSection from '../components/RegisterforFree/CallToActionSection'
import MeetYourTrainer from '../components/Trainer/MeetYourTrainer'
import FaqSection from '../components/FAQ/FaqSection'
import Footer from '../components/Footer/Footer'
import HeroSection from '../components/Hero/HeroSection'
import axios from 'axios'

const Home = () => {
  const [activeSections, setActiveSections] = useState([]);
  const [loading, setLoading] = useState(true);

  // Component mapping
  const sectionComponents = {
    hero_section: <HeroSection key="hero_section" />,
    trusted_by_section: <TrustedBySection key="trusted_by_section" />,
    benefits_section: <BenefitsSection key="benefits_section" />,
    exclusive_benefits: <ExclusiveBenefits key="exclusive_benefits" />,
    call_to_action_section: <CallToActionSection key="call_to_action_section" />,
    meet_your_trainer: <MeetYourTrainer key="meet_your_trainer" />,
    faq_section: <FaqSection key="faq_section" />,
    footer: <Footer key="footer" />
  };

  // Fetch active sections
  const fetchActiveSections = async () => {
    try {
      const response = await axios.get('https://lightsteelblue-woodcock-286554.hostingersite.com/api/homepage-sections/active');
      
      if (response.data.success) {
        // Sort by display_order
        const sortedSections = response.data.sections.sort((a, b) => a.display_order - b.display_order);
        setActiveSections(sortedSections);
      } else {
        console.error('Failed to fetch active sections');
        // Fallback to show all sections if API fails
        setActiveSections([
          { section_key: 'hero_section', display_order: 1 },
          { section_key: 'trusted_by_section', display_order: 2 },
          { section_key: 'benefits_section', display_order: 3 },
          { section_key: 'exclusive_benefits', display_order: 4 },
          { section_key: 'call_to_action_section', display_order: 5 },
          { section_key: 'meet_your_trainer', display_order: 6 },
          { section_key: 'faq_section', display_order: 7 },
          { section_key: 'footer', display_order: 8 }
        ]);
      }
    } catch (error) {
      console.error('Error fetching active sections:', error);
      // Fallback to show all sections if API fails
      setActiveSections([
        { section_key: 'hero_section', display_order: 1 },
        { section_key: 'trusted_by_section', display_order: 2 },
        { section_key: 'benefits_section', display_order: 3 },
        { section_key: 'exclusive_benefits', display_order: 4 },
        { section_key: 'call_to_action_section', display_order: 5 },
        { section_key: 'meet_your_trainer', display_order: 6 },
        { section_key: 'faq_section', display_order: 7 },
        { section_key: 'footer', display_order: 8 }
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchActiveSections();
  }, []);

  if (loading) {
    return (
      <div className="w-[100vw] overflow-x-hidden">
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-[100vw] overflow-x-hidden">
      {activeSections.map((section) => {
        const component = sectionComponents[section.section_key];
        return component || null;
      })}
    </div>
  )
}

export default Home
