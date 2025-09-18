import React, { useState, useEffect } from 'react';
import { Eye, EyeOff, Save, RefreshCw, AlertCircle, CheckCircle, Settings, Home } from 'lucide-react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useAdminAuth } from '../contexts/AdminAuthContext';

function Sections() {
  const { getToken } = useAdminAuth();
  const [sections, setSections] = useState([]);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [originalSections, setOriginalSections] = useState([]);

  // Fetch homepage sections
  const fetchSections = async () => {
    try {
      setLoading(true);
      
      // For admin, we can get all sections (active and inactive) from the admin endpoint
      // If admin endpoint is not available, we'll use the homepage-sections endpoint
      try {
        const adminResponse = await axios.get('http://localhost/yogabackend/api/admin/homepage-sections', {
          headers: {
            Authorization: `Bearer ${getToken()}`,
            'Content-Type': 'application/json'
          }
        });
        
        if (adminResponse.data.success) {
          setSections(adminResponse.data.sections);
          setOriginalSections(adminResponse.data.sections);
          return;
        }
      } catch (adminError) {
        console.log('Admin endpoint not available, using homepage-sections endpoint');
      }
      
      // Fallback to homepage-sections endpoint
      const response = await axios.get('http://localhost/yogabackend/api/homepage-sections/active');
      
      if (response.data.success) {
        // Map to include id field if not present
        const sectionsWithId = response.data.sections.map((section, index) => ({
          id: section.id || index + 1,
          section_key: section.section_key,
          section_name: section.section_name,
          is_active: section.is_active !== undefined ? section.is_active : true,
          display_order: section.display_order
        }));
        
        setSections(sectionsWithId);
        setOriginalSections(sectionsWithId);
      } else {
        toast.error('Failed to fetch sections');
      }
    } catch (error) {
      console.error('Error fetching sections:', error);
      toast.error('Failed to fetch sections. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Toggle section active status
  const toggleSection = (sectionId) => {
    const updatedSections = sections.map(section => 
      section.id === sectionId 
        ? { ...section, is_active: !section.is_active }
        : section
    );
    setSections(updatedSections);
    setHasChanges(true);
  };

  // Save changes
  const saveChanges = async () => {
    try {
      setSaving(true);
      const token = getToken();
      
      if (!token) {
        toast.error('Authentication required');
        return;
      }

      // Prepare updates array
      const updates = sections.map(section => ({
        id: section.id,
        is_active: section.is_active
      }));

      const response = await axios.put(
        'http://localhost/yogabackend/api/admin/homepage-sections/bulk',
        { updates },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }
      );

      if (response.data.success) {
        toast.success('Section settings updated successfully!');
        setHasChanges(false);
        setOriginalSections([...sections]);
        // Refresh data
        fetchSections();
      } else {
        toast.error(response.data.message || 'Failed to update sections');
      }
    } catch (error) {
      console.error('Error saving sections:', error);
      if (error.response?.status === 401) {
        toast.error('Session expired. Please login again.');
      } else {
        toast.error('Failed to save changes. Please try again.');
      }
    } finally {
      setSaving(false);
    }
  };

  // Reset changes
  const resetChanges = () => {
    setSections([...originalSections]);
    setHasChanges(false);
  };

  // Get section icon
  const getSectionIcon = (sectionKey) => {
    const iconMap = {
      hero_section: '🎯',
      trusted_by_section: '🤝',
      benefits_section: '✨',
      exclusive_benefits: '💎',
      call_to_action_section: '📢',
      meet_your_trainer: '�‍🏫',
      faq_section: '❓',
      footer: '📄'
    };
    return iconMap[sectionKey] || '📄';
  };

  // Get section description
  const getSectionDescription = (sectionKey) => {
    const descriptionMap = {
      hero_section: 'Main banner with call-to-action',
      trusted_by_section: 'Trusted by section with testimonials',
      benefits_section: 'Yoga benefits and features',
      exclusive_benefits: 'Exclusive membership benefits',
      call_to_action_section: 'Call-to-action for registration',
      meet_your_trainer: 'Meet your trainer section',
      faq_section: 'Frequently asked questions',
      footer: 'Footer with links and contact info'
    };
    return descriptionMap[sectionKey] || 'Website section component';
  };

  useEffect(() => {
    fetchSections();
  }, []);

  return (
    <div className="p-6 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        {/* <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Settings className="h-6 w-6 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Homepage Sections</h1>
          </div>
          <p className="text-gray-600">Manage which sections appear on your homepage and their visibility</p>
        </div> */}

        {/* Action Buttons */}
        {hasChanges && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-amber-800">
                <AlertCircle className="h-5 w-5" />
                <span className="font-medium">You have unsaved changes</span>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={resetChanges}
                  className="px-4 py-2 text-amber-700 bg-amber-100 hover:bg-amber-200 rounded-lg font-medium text-sm transition-colors"
                >
                  Reset
                </button>
                <button
                  onClick={saveChanges}
                  disabled={saving}
                  className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-lg font-medium text-sm transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                  {saving ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                      Saving...
                    </>
                  ) : (
                    <>
                      <Save className="h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Sections List */}
        <div className="bg-white rounded-lg shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Section Management</h2>
              <button
                onClick={fetchSections}
                disabled={loading}
                className="flex items-center gap-2 px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <RefreshCw className={`h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
            </div>
          </div>

          <div className="p-6">
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-600 mt-2">Loading sections...</p>
              </div>
            ) : sections.length === 0 ? (
              <div className="text-center py-12">
                <Home className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No sections found</p>
                <p className="text-sm text-gray-500 mt-1">Check your API connection</p>
              </div>
            ) : (
              <div className="space-y-4">
                {sections
                  .sort((a, b) => a.display_order - b.display_order)
                  .map((section) => (
                    <div 
                      key={section.id} 
                      className={`border rounded-lg p-4 transition-all ${
                        section.is_active 
                          ? 'border-green-200 bg-green-50' 
                          : 'border-gray-200 bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="text-2xl">
                            {getSectionIcon(section.section_key)}
                          </div>
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900">
                              {section.section_name}
                            </h3>
                            <p className="text-sm text-gray-600 mt-1">
                              {getSectionDescription(section.section_key)}
                            </p>
                            <div className="flex items-center gap-4 mt-2 text-xs text-gray-500">
                              <span>Order: {section.display_order}</span>
                              <span>Key: {section.section_key}</span>
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3">
                          <div className={`flex items-center gap-2 px-3 py-1 rounded-full text-xs font-medium ${
                            section.is_active
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {section.is_active ? (
                              <>
                                <CheckCircle className="h-3 w-3" />
                                Active
                              </>
                            ) : (
                              <>
                                <EyeOff className="h-3 w-3" />
                                Inactive
                              </>
                            )}
                          </div>

                          <button
                            onClick={() => toggleSection(section.id)}
                            className={`p-2 rounded-lg transition-colors ${
                              section.is_active
                                ? 'text-green-600 hover:bg-green-100'
                                : 'text-gray-400 hover:bg-gray-100'
                            }`}
                            title={section.is_active ? 'Hide section' : 'Show section'}
                          >
                            {section.is_active ? (
                              <Eye className="h-5 w-5" />
                            ) : (
                              <EyeOff className="h-5 w-5" />
                            )}
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>

          {/* Summary Stats */}
          {sections.length > 0 && (
            <div className="p-6 border-t border-gray-200 bg-gray-50">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">{sections.length}</div>
                  <div className="text-sm text-gray-600">Total Sections</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {sections.filter(s => s.is_active).length}
                  </div>
                  <div className="text-sm text-gray-600">Active Sections</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-600">
                    {sections.filter(s => !s.is_active).length}
                  </div>
                  <div className="text-sm text-gray-600">Inactive Sections</div>
                </div>
              </div>
            </div>
          )}
        </div>

        <ToastContainer
          position="top-right"
          autoClose={3000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
        />
      </div>
    </div>
  );
}

export default Sections;
