import React, { useState } from 'react';
import { getGeminiResponse } from '../utils/gemini';

// System instructions for the AI
const SYSTEM_INSTRUCTIONS = `
You are a specialized AI assistant focused on Indian medical budgeting.

ONLY answer questions related to:
- Medical expenses in India
- Insurance options in India
- Cost management for medical treatments in India
- Financial planning for healthcare in India
- Government healthcare schemes in India (like Ayushman Bharat, CGHS, etc.)

DO NOT answer questions about:
- Non-medical financial topics
- Medical topics unrelated to budgeting/finances
- Healthcare systems outside of India
- Medical advice or diagnoses
- Any topic not directly related to Indian medical budgeting

When providing budgeting advice, always consider the following factors that the user has provided:
- GDP OF STATE
- Population
- Emergency fund
- Current insurance coverage
- Location in India
- User's question

**OUTPUT FORMAT:**
- Present the information in structured **tables**.
- Ensure to include **presumptions** based on the user's inputs.
- Even in React JSX, output should be presented in **table format** with each key piece of advice in separate rows/columns.

Example (React JSX format):
`;

export default function Budget() {
  const [formData, setFormData] = useState({
    monthlyIncome: '',
    familySize: '',
    location: '',
    existingConditions: '',
    insuranceCoverage: '',
    ageGroups: {
      children: false,
      adults: false,
      seniors: false
    },
    emergencyFund: '',
    question: ''
  });

  const [response, setResponse] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showForm, setShowForm] = useState(true);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name.startsWith('ageGroups.')) {
      const ageGroup = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        ageGroups: {
          ...prev.ageGroups,
          [ageGroup]: checked
        }
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    // Format age groups
    const ageGroupsText = Object.entries(formData.ageGroups)
      .filter(([_, isSelected]) => isSelected)
      .map(([group]) => group)
      .join(', ');

    // Construct the prompt with system instructions and user data
    const prompt = `
${SYSTEM_INSTRUCTIONS}

USER INFORMATION:
- Monthly Income: ₹${formData.monthlyIncome}
- Family Size: ${formData.familySize} members
- Location in India: ${formData.location}
- Existing Medical Conditions: ${formData.existingConditions || 'None specified'}
- Current Insurance Coverage: ${formData.insuranceCoverage || 'None specified'}
- Age Groups in Family: ${ageGroupsText || 'Not specified'}
- Emergency Fund: ₹${formData.emergencyFund || 'Not specified'}

USER QUESTION: ${formData.question}

Please provide detailed budgeting advice specific to Indian medical context based on this information.
`;

    try {
      const aiResponse = await getGeminiResponse(prompt);
      setResponse(aiResponse);
      setShowForm(false);
    } catch (error) {
      console.error('Error getting response:', error);
      setResponse('Sorry, there was an error processing your request. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      monthlyIncome: '',
      familySize: '',
      location: '',
      existingConditions: '',
      insuranceCoverage: '',
      ageGroups: {
        children: false,
        adults: false,
        seniors: false
      },
      emergencyFund: '',
      question: ''
    });
    setResponse('');
    setShowForm(true);
  };

  return (
    <div className="max-w-4xl mx-auto p-6 bg-gray-900 text-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6 text-center text-purple-400">Indian HealthCare Budget Allocation</h1>

      {showForm ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-2">GDP of State</label>
              <input
                type="number"
                name="monthlyIncome"
                value={formData.monthlyIncome}
                onChange={handleChange}
                required
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                placeholder="e.g., 50000"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Population (in lakhs)</label>
              <input
                type="number"
                name="familySize"
                value={formData.familySize}
                onChange={handleChange}
                required
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                placeholder="e.g., 4"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Location in India</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                required
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                placeholder="e.g., Mumbai, Delhi, etc."
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Emergency Fund (₹)</label>
              <input
                type="number"
                name="emergencyFund"
                value={formData.emergencyFund}
                onChange={handleChange}
                className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
                placeholder="e.g., 100000"
              />
            </div>
          </div>

          {/* <div>
            <label className="block text-sm font-medium mb-2">Existing Medical Conditions (if any)</label>
            <textarea
              name="existingConditions"
              value={formData.existingConditions}
              onChange={handleChange}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
              placeholder="e.g., Diabetes, Hypertension, etc."
              rows="2"
            />
          </div> */}

          <div>
            <label className="block text-sm font-medium mb-2">Current Insurance Coverage</label>
            <textarea
              name="insuranceCoverage"
              value={formData.insuranceCoverage}
              onChange={handleChange}
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
              placeholder="e.g., Company provided health insurance of 5 lakhs, etc."
              rows="2"
            />
          </div>

          {/* <div>
            <label className="block text-sm font-medium mb-2">Age Groups in Family (Select all that apply)</label>
            <div className="flex flex-wrap gap-4">
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="ageGroups.children"
                  checked={formData.ageGroups.children}
                  onChange={handleChange}
                  className="rounded bg-gray-800 border-gray-700 text-purple-600 focus:ring-purple-500"
                />
                <span className="ml-2">Children (0-18)</span>
              </label>
              
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="ageGroups.adults"
                  checked={formData.ageGroups.adults}
                  onChange={handleChange}
                  className="rounded bg-gray-800 border-gray-700 text-purple-600 focus:ring-purple-500"
                />
                <span className="ml-2">Adults (19-59)</span>
              </label>
              
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="ageGroups.seniors"
                  checked={formData.ageGroups.seniors}
                  onChange={handleChange}
                  className="rounded bg-gray-800 border-gray-700 text-purple-600 focus:ring-purple-500"
                />
                <span className="ml-2">Seniors (60+)</span>
              </label>
            </div>
          </div> */}

          <div>
            <label className="block text-sm font-medium mb-2">Your Question About Medical Budgeting</label>
            <textarea
              name="question"
              value={formData.question}
              onChange={handleChange}
              required
              className="w-full p-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-purple-500 focus:outline-none"
              placeholder="e.g., How should I allocate my monthly budget for healthcare expenses? What insurance options should I consider?"
              rows="3"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-3 px-4 rounded-lg font-medium ${isLoading ? 'bg-gray-600' : 'bg-purple-600 hover:bg-purple-700'
              } transition-colors duration-200`}
          >
            {isLoading ? 'Processing...' : 'Get Budgeting Advice'}
          </button>
        </form>
      ) : (
        <div className="mt-6">
          <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
            <h2 className="text-xl font-semibold mb-4 text-purple-400">Your Personalized Budget Advice</h2>
            <div className="prose prose-invert max-w-none" dangerouslySetInnerHTML={{ __html: response }}>
            </div>
          </div>

          <button
            onClick={resetForm}
            className="mt-6 w-full py-3 px-4 bg-gray-700 hover:bg-gray-600 rounded-lg font-medium transition-colors duration-200"
          >
            Ask Another Question
          </button>
        </div>
      )}
    </div>
  );
}
