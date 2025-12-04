import { NextRequest, NextResponse } from 'next/server';

// Simulated AI Assistant (In production, integrate with OpenAI)
export async function POST(request: NextRequest) {
  try {
    const { question, businessType } = await request.json();

    // Simulated responses based on common questions
    const responses: any = {
      'food_hygiene': {
        answer: `For ${businessType} businesses, you need a Level 2 Food Hygiene Certificate for all food handlers and a Level 3 certificate for supervisors. The certificate must be from an accredited provider and is valid for 3 years. You can book training through local councils or approved online providers.`,
        relatedDocs: ['Food Hygiene Certificate', 'Food Safety Management System'],
        nextSteps: ['Book Level 2 training for staff', 'Complete HACCP documentation', 'Display certificates in kitchen']
      },
      'insurance': {
        answer: `You need Public Liability Insurance (minimum £5 million coverage) and Employer's Liability Insurance (£5 million minimum, legally required if you have employees). Product Liability Insurance is also recommended for food businesses.`,
        relatedDocs: ['Public Liability Insurance', 'Employer Liability Insurance'],
        nextSteps: ['Contact insurance broker', 'Compare quotes', 'Upload policy documents']
      },
      'license': {
        answer: `For a ${businessType}, you need to register with your local council at least 28 days before opening. You'll need a Food Business Registration (free) and potentially a premises license if serving alcohol. Some councils also require a Street Trading License.`,
        relatedDocs: ['Food Business Registration', 'Premises License'],
        nextSteps: ['Contact local council', 'Complete FBO registration form', 'Book food safety inspection']
      },
      'allergen': {
        answer: `You must provide allergen information for all 14 major allergens. Display this clearly on menus, labels, or ask-the-staff boards. Staff must be trained on allergen awareness. Keep records of allergen checks and supplier information.`,
        relatedDocs: ['Allergen Information Sheet', 'Staff Training Records'],
        nextSteps: ['Create allergen matrix', 'Train all staff', 'Update menu displays']
      },
      'default': {
        answer: `I can help you understand compliance requirements for your ${businessType} business. Common requirements include food hygiene certificates, business registration, insurance policies, and health & safety documentation. Could you be more specific about which requirement you need help with?`,
        relatedDocs: [],
        nextSteps: ['Review your compliance checklist', 'Identify missing documents', 'Contact relevant authorities']
      }
    };

    // Simple keyword matching
    let responseKey = 'default';
    const lowerQuestion = question.toLowerCase();
    
    if (lowerQuestion.includes('food') || lowerQuestion.includes('hygiene')) {
      responseKey = 'food_hygiene';
    } else if (lowerQuestion.includes('insurance') || lowerQuestion.includes('liability')) {
      responseKey = 'insurance';
    } else if (lowerQuestion.includes('license') || lowerQuestion.includes('registration')) {
      responseKey = 'license';
    } else if (lowerQuestion.includes('allergen')) {
      responseKey = 'allergen';
    }

    const response = responses[responseKey];

    return NextResponse.json({
      question,
      answer: response.answer,
      relatedDocuments: response.relatedDocs,
      suggestedNextSteps: response.nextSteps,
      confidence: responseKey === 'default' ? 'low' : 'high',
      timestamp: new Date()
    });
  } catch (error) {
    console.error('Error in AI assist:', error);
    return NextResponse.json({ error: 'Failed to process question' }, { status: 500 });
  }
}
