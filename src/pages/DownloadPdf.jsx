import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Gift, Download, User, FileText } from 'lucide-react';
import axios from 'axios';
import { toast } from 'react-toastify';

const DownloadPdf = ({ userId }) => {
  const navigate = useNavigate();
  const [dietPlans, setDietPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
  console.log(storedUser);
  const primaryGoal = storedUser.primarygoal;

  console.log('DownloadPdf props:', { userId });
  console.log('Primary goal:', primaryGoal);


  useEffect(() => {
    if (userId) {
      fetchDietPlans();
    } else {
      setLoading(false);
    }
  }, [userId]);

  const fetchDietPlans = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      
      const response = await axios.get(
        `https://lightsteelblue-woodcock-286554.hostingersite.com/api/diet-plans/user?user_id=${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
          }
        }
      );

      if (response.data.success) {
        setDietPlans(response.data.diet_plans);
      }
    } catch (error) {
      console.error("Error fetching diet plans:", error);
      toast.error("Error loading diet plans");
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = async (mediaUrl, title) => {
    try {
      const link = document.createElement('a');
      link.href = mediaUrl;
      link.download = `${title}.pdf`;
      link.target = '_blank';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      toast.success(`Downloading ${title}...`);
    } catch (error) {
      console.error("Error downloading file:", error);
      toast.error("Failed to download file");
    }
  };

  const getMatchingPlan = () => {
    if (!primaryGoal || primaryGoal.trim() === "") return null;
    
    return dietPlans.find(plan => 
      plan.title.toLowerCase().includes(primaryGoal.toLowerCase()) ||
      plan.description.toLowerCase().includes(primaryGoal.toLowerCase())
    );
  };

  // Condition 1: No primary goal - Navigate to profile
  const renderCompleteProfileCard = () => (
    <div 
      className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
      onClick={() => navigate('/profile-edit')}
    >
      <div className="bg-green-200 text-green-600 p-2 rounded-lg">
        <User className="w-5 h-5" />
      </div>
      <div>
        <h3 className="text-sm font-bold text-green-700">
          Complete your profile
        </h3>
        <p className="text-xs text-green-500">
          Set your primary goal to unlock resources
        </p>
      </div>
    </div>
  );

  // Condition 2: Primary goal matches - Download PDF
  const renderDownloadCard = (plan) => (
    <div 
      className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
      onClick={() => handleDownload(plan.media_url, plan.title)}
    >
      <div className="bg-green-200 text-green-600 p-2 rounded-lg">
        <Download className="w-5 h-5" />
      </div>
      <div>
        <h3 className="text-sm font-bold text-green-700">
          {plan.title}
        </h3>
        <p className="text-xs text-green-500">
          Click to download your diet plan PDF
        </p>
      </div>
    </div>
  );

  // Condition 3: No match - Show diet plan creation message
  const renderNoDietPlanCard = () => (
    <div className="flex items-center gap-3">
      <div className="bg-green-200 text-green-600 p-2 rounded-lg">
        <FileText className="w-5 h-5" />
      </div>
      <div>
        <h3 className="text-sm font-bold text-green-700">
          No matching resources found yet for primaryGoal: "{primaryGoal}"
        </h3>
        {/* <p className="text-xs text-green-500">
          No matching resources found yet
        </p> */}
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  return (
    <div className="px-4">
      

      <div className="max-w-md mx-auto bg-green-100 p-3 rounded-xl border-2 border-green-300 py-4.5">
        {!primaryGoal || primaryGoal.trim() === "" ? (
          // Condition 1: No primary goal
          renderCompleteProfileCard()
        ) : (() => {
          const matchingPlan = getMatchingPlan();
          
          // Condition 2: Has matching plan
          if (matchingPlan) {
            return renderDownloadCard(matchingPlan);
          }
          
          // Condition 3: No matching plan
          return renderNoDietPlanCard();
        })()}
      </div>
    </div>
  );
};

export default DownloadPdf;