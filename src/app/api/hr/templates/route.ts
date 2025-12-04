import { NextRequest, NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function GET(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db('aumvia');
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');

    const query: any = {};
    if (category) query.category = category;

    const templates = await db.collection('hr_templates')
      .find(query)
      .sort({ name: 1 })
      .toArray();

    if (templates.length === 0) {
      const defaultTemplates = [
        {
          name: 'Offer Letter',
          category: 'onboarding',
          description: 'Standard job offer letter template',
          content: `Dear {{employee_name}},

We are pleased to offer you the position of {{job_title}} at {{company_name}}.

Start Date: {{start_date}}
Salary: £{{salary}} per annum
Working Hours: {{working_hours}} per week

Please sign and return this letter to confirm your acceptance.

Regards,
{{manager_name}}
{{company_name}}`,
          fields: ['employee_name', 'job_title', 'company_name', 'start_date', 'salary', 'working_hours', 'manager_name'],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Employment Contract',
          category: 'contracts',
          description: 'Standard employment contract template',
          content: `EMPLOYMENT CONTRACT

This agreement is made between {{company_name}} (the "Employer") and {{employee_name}} (the "Employee").

Position: {{job_title}}
Department: {{department}}
Start Date: {{start_date}}
Salary: £{{salary}} per annum
Working Hours: {{working_hours}} hours per week
Notice Period: {{notice_period}}

Terms and Conditions apply as per company policy.

Signed: _______________
Date: _______________`,
          fields: ['company_name', 'employee_name', 'job_title', 'department', 'start_date', 'salary', 'working_hours', 'notice_period'],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Holiday Request Form',
          category: 'forms',
          description: 'Annual leave request form',
          content: `HOLIDAY REQUEST FORM

Employee Name: {{employee_name}}
Employee ID: {{employee_id}}
Department: {{department}}

Dates Requested:
From: {{start_date}}
To: {{end_date}}
Total Days: {{total_days}}

Reason (optional): {{reason}}

Employee Signature: _______________
Date: _______________

Manager Approval:
[ ] Approved  [ ] Denied

Manager Signature: _______________
Date: _______________`,
          fields: ['employee_name', 'employee_id', 'department', 'start_date', 'end_date', 'total_days', 'reason'],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Warning Letter',
          category: 'disciplinary',
          description: 'Formal warning letter template',
          content: `FORMAL WARNING

Date: {{date}}

To: {{employee_name}}
Employee ID: {{employee_id}}

This letter serves as a formal {{warning_level}} warning regarding {{issue_description}}.

Details:
{{issue_details}}

Required Actions:
{{required_actions}}

Failure to improve may result in further disciplinary action.

Manager: {{manager_name}}
Signature: _______________`,
          fields: ['date', 'employee_name', 'employee_id', 'warning_level', 'issue_description', 'issue_details', 'required_actions', 'manager_name'],
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'Right to Work Checklist',
          category: 'compliance',
          description: 'Right to work verification checklist',
          content: `RIGHT TO WORK VERIFICATION

Employee Name: {{employee_name}}
Date of Check: {{check_date}}

Documents Verified:
[ ] Passport
[ ] Birth Certificate
[ ] National Insurance Number
[ ] Work Visa (if applicable)

Document Details:
{{document_details}}

Verified By: {{verifier_name}}
Signature: _______________
Date: _______________`,
          fields: ['employee_name', 'check_date', 'document_details', 'verifier_name'],
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ];

      await db.collection('hr_templates').insertMany(defaultTemplates);
      return NextResponse.json(defaultTemplates);
    }

    return NextResponse.json(templates);
  } catch (error) {
    console.error('Error fetching templates:', error);
    return NextResponse.json({ error: 'Failed to fetch templates' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db('aumvia');
    const body = await request.json();

    const template = {
      ...body,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const result = await db.collection('hr_templates').insertOne(template);
    const newTemplate = await db.collection('hr_templates').findOne({ _id: result.insertedId });

    return NextResponse.json(newTemplate);
  } catch (error) {
    console.error('Error creating template:', error);
    return NextResponse.json({ error: 'Failed to create template' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db('aumvia');
    const body = await request.json();
    const { _id, ...updateData } = body;

    if (!_id) {
      return NextResponse.json({ error: 'Template ID required' }, { status: 400 });
    }

    updateData.updatedAt = new Date();

    await db.collection('hr_templates').updateOne(
      { _id: new ObjectId(_id) },
      { $set: updateData }
    );

    const updatedTemplate = await db.collection('hr_templates').findOne({ _id: new ObjectId(_id) });

    if (!updatedTemplate) {
      return NextResponse.json({ error: 'Template not found' }, { status: 404 });
    }

    return NextResponse.json(updatedTemplate);
  } catch (error) {
    console.error('Error updating template:', error);
    return NextResponse.json({ error: 'Failed to update template' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const client = await clientPromise;
    const db = client.db('aumvia');
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Template ID required' }, { status: 400 });
    }

    await db.collection('hr_templates').deleteOne({ _id: new ObjectId(id) });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting template:', error);
    return NextResponse.json({ error: 'Failed to delete template' }, { status: 500 });
  }
}
