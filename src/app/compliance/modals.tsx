// Compliance Hub Modals

import { useState } from 'react';

export function DocumentUploadModal({ requirement, onSave, onClose }: any) {
  const [formData, setFormData] = useState({
    filename: '',
    fileType: 'application/pdf',
    expiryDate: '',
    notes: ''
  });

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    onSave({
      requirementKey: requirement.key,
      requirementTitle: requirement.title,
      ...formData,
      fileSize: 0 // In production, get from actual file
    });
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-lg w-full">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-emerald-900">Upload Document</h2>
          <p className="text-gray-600 text-sm mt-1">{requirement.title}</p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Document Name *</label>
            <input
              type="text"
              value={formData.filename}
              onChange={(e) => setFormData({ ...formData, filename: e.target.value })}
              required
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none"
              placeholder="e.g., Insurance_Policy_2024.pdf"
            />
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Document Type *</label>
            <select
              value={formData.fileType}
              onChange={(e) => setFormData({ ...formData, fileType: e.target.value })}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none"
            >
              <option value="application/pdf">PDF Document</option>
              <option value="image/jpeg">JPEG Image</option>
              <option value="image/png">PNG Image</option>
              <option value="application/msword">Word Document</option>
            </select>
          </div>

          {requirement.hasExpiry && (
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Expiry Date {requirement.required && '*'}
              </label>
              <input
                type="date"
                value={formData.expiryDate}
                onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                required={requirement.required}
                className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-semibold text-gray-700 mb-2">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="w-full px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-emerald-500 focus:outline-none resize-none"
              placeholder="Additional information about this document..."
            />
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-sm text-blue-900">
              <strong>Note:</strong> In production, this would integrate with file upload functionality 
              to securely store documents in cloud storage (AWS S3, Azure Blob, etc.).
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="submit"
              className="flex-1 px-6 py-3 bg-gradient-to-r from-yellow-500 to-yellow-600 text-white rounded-lg font-bold hover:shadow-lg transition-all"
              style={{ backgroundColor: '#D4AF37' }}
            >
              Upload Document
            </button>
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export function AIAssistantModal({ businessType, initialQuestion, onClose }: any) {
  const [question, setQuestion] = useState(initialQuestion || '');
  const [conversation, setConversation] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleAsk() {
    if (!question.trim()) return;

    setLoading(true);
    const userMessage = { type: 'user', text: question, timestamp: new Date() };
    setConversation([...conversation, userMessage]);

    try {
      const response = await fetch('/api/compliance/ai-assist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, businessType })
      });

      const data = await response.json();
      
      const aiMessage = {
        type: 'ai',
        text: data.answer,
        relatedDocs: data.relatedDocuments,
        nextSteps: data.suggestedNextSteps,
        timestamp: new Date()
      };

      setConversation([...conversation, userMessage, aiMessage]);
      setQuestion('');
    } catch (error) {
      console.error('Error asking AI:', error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-indigo-900">🤖 AI Compliance Assistant</h2>
          <p className="text-gray-600 text-sm mt-1">Ask me anything about compliance requirements for your {businessType} business</p>
        </div>

        {/* Conversation Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          {conversation.length === 0 && (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">💬</div>
              <h3 className="text-lg font-bold text-gray-900 mb-2">How can I help you today?</h3>
              <p className="text-gray-600 text-sm mb-4">Ask questions about:</p>
              <div className="flex flex-wrap gap-2 justify-center">
                <button
                  onClick={() => setQuestion('What food hygiene certificates do I need?')}
                  className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm"
                >
                  Food Hygiene Certificates
                </button>
                <button
                  onClick={() => setQuestion('What insurance do I need?')}
                  className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm"
                >
                  Insurance Requirements
                </button>
                <button
                  onClick={() => setQuestion('How do I register my business?')}
                  className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm"
                >
                  Business Registration
                </button>
                <button
                  onClick={() => setQuestion('What are allergen requirements?')}
                  className="px-3 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm"
                >
                  Allergen Information
                </button>
              </div>
            </div>
          )}

          {conversation.map((msg, idx) => (
            <div key={idx} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-lg p-4 ${
                msg.type === 'user' 
                  ? 'bg-indigo-600 text-white' 
                  : 'bg-gray-100 text-gray-900'
              }`}>
                <div className="text-sm">{msg.text}</div>
                
                {msg.type === 'ai' && msg.relatedDocs && msg.relatedDocs.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-300">
                    <div className="text-xs font-semibold mb-2">📄 Related Documents:</div>
                    <div className="space-y-1">
                      {msg.relatedDocs.map((doc: string, i: number) => (
                        <div key={i} className="text-xs">• {doc}</div>
                      ))}
                    </div>
                  </div>
                )}

                {msg.type === 'ai' && msg.nextSteps && msg.nextSteps.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-300">
                    <div className="text-xs font-semibold mb-2">✅ Suggested Next Steps:</div>
                    <div className="space-y-1">
                      {msg.nextSteps.map((step: string, i: number) => (
                        <div key={i} className="text-xs">
                          {i + 1}. {step}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="text-xs opacity-70 mt-2">
                  {new Date(msg.timestamp).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex justify-start">
              <div className="bg-gray-100 rounded-lg p-4">
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
                  <span className="text-sm text-gray-600">Thinking...</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="p-6 border-t">
          <div className="flex gap-2">
            <input
              type="text"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleAsk()}
              placeholder="Type your question here..."
              className="flex-1 px-4 py-3 border-2 border-gray-300 rounded-lg focus:border-indigo-500 focus:outline-none"
            />
            <button
              onClick={handleAsk}
              disabled={loading || !question.trim()}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Ask
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export function TemplateLibraryModal({ requirements, onClose }: any) {
  function handleDownloadTemplate(req: any) {
    // In production, download actual template files
    const templateContent = `
${req.title} - Template

Business: [Your Business Name]
Date: ${new Date().toLocaleDateString('en-GB')}

Description: ${req.description}

Instructions:
1. Complete all required fields
2. Ensure information is accurate and up-to-date
3. Upload the completed document to your Compliance Hub
4. Set renewal reminders if applicable

---

Generated by Aumvia Compliance Hub
`;

    const blob = new Blob([templateContent], { type: 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${req.key}_template.txt`;
    a.click();
    window.URL.revokeObjectURL(url);
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b">
          <h2 className="text-2xl font-bold text-blue-900">📚 Template Library</h2>
          <p className="text-gray-600 text-sm mt-1">Download pre-filled templates to speed up compliance</p>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {requirements.map((req: any) => (
              <div key={req._id} className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-all">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-900">{req.title}</h3>
                    <p className="text-sm text-gray-600 mt-1">{req.description}</p>
                    <span className="inline-block mt-2 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-semibold">
                      {req.category}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => handleDownloadTemplate(req)}
                  className="mt-3 w-full px-4 py-2 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-all"
                >
                  📥 Download Template
                </button>
              </div>
            ))}
          </div>

          {requirements.length === 0 && (
            <div className="text-center py-12">
              <div className="text-6xl mb-4">📄</div>
              <h3 className="text-xl font-bold text-gray-900 mb-2">No Templates Available</h3>
              <p className="text-gray-600">Templates will be available for applicable requirements</p>
            </div>
          )}
        </div>

        <div className="p-6 border-t">
          <button
            onClick={onClose}
            className="w-full px-6 py-3 bg-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-300 transition-all"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
