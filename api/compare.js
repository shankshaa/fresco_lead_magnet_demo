// Vercel Serverless Function for Document Comparison
// This securely calls the Anthropic Claude API

export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  // Handle OPTIONS request for CORS preflight
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  // Only allow POST requests
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { originalText, addendumText } = req.body;

    // Validate inputs
    if (!originalText || !addendumText) {
      return res.status(400).json({ 
        error: 'Missing required fields: originalText and addendumText' 
      });
    }

    // Get API key from environment variable
    const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY;
    console.log('ANTHROPIC_API_KEY set:', !!process.env.ANTHROPIC_API_KEY);
console.log('ANTHROPIC_API_KEY prefix:', process.env.ANTHROPIC_API_KEY ? process.env.ANTHROPIC_API_KEY.slice(0,8) + '...' : 'none');

    if (!ANTHROPIC_API_KEY) {
      console.error('ANTHROPIC_API_KEY not configured');
      return res.status(500).json({ 
        error: 'API key not configured. Please add ANTHROPIC_API_KEY to environment variables.' 
      });
    }

    console.log('Calling Claude API...');

    // Call Anthropic Claude API
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-5-sonnet-20241022',
        max_tokens_to_sample: 4000,
        messages: [{
          role: 'user',
          content: `You are analyzing construction document changes for a Division 8 (doors, frames, hardware) estimator.

Compare these two documents and identify what changed between the original specification and the addendum:

ORIGINAL DOCUMENT:
${originalText.slice(0, 15000)}

ADDENDUM/REVISED DOCUMENT:
${addendumText.slice(0, 15000)}

Provide a detailed analysis in JSON format with the following structure:
{
  "project_info": {
    "name": "Project name if found",
    "addendum_number": "Addendum number if specified"
  },
  "summary_stats": {
    "total_changes": number,
    "critical_changes": number,
    "moderate_changes": number,
    "minor_changes": number,
    "doors_affected": number,
    "estimated_cost_impact": "dollar amount or percentage"
  },
  "changes": [
    {
      "id": number,
      "priority": "critical" | "moderate" | "minor",
      "division": "Division number (e.g., 'Div 8')",
      "section": "Section number and name",
      "change_type": "Type of change",
      "was": "Original text/requirement",
      "now": "New text/requirement",
      "impact": "Description of impact",
      "doors_affected": "Number or description",
      "cost_impact": "Estimated cost impact",
      "location": "Page number or sheet reference",
      "actions": ["Action item 1", "Action item 2"]
    }
  ]
}

Focus on Division 8 related changes (doors, frames, hardware) and mark those as critical or moderate priority. Other division changes should be marked as minor.`
        }]
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Claude API error:', response.status, errorText);
      return res.status(response.status).json({ 
        error: `Claude API error: ${response.status}`,
        details: errorText
      });
    }

    const data = await response.json();
    console.log('Claude API response received');

    // Extract the text content from Claude's response
    const resultText = data.content[0].text;
    
    // Try to extract JSON from the response
    const jsonMatch = resultText.match(/\{[\s\S]*\}/);
    
    if (!jsonMatch) {
      console.error('No JSON found in Claude response');
      return res.status(500).json({ 
        error: 'Could not parse AI response',
        rawResponse: resultText.slice(0, 500)
      });
    }

    const analysisResults = JSON.parse(jsonMatch[0]);

    // Return the results
    return res.status(200).json({
      success: true,
      results: analysisResults
    });

  } catch (error) {
    console.error('Error in compare function:', error);
    return res.status(500).json({ 
      error: 'Internal server error',
      message: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
}
