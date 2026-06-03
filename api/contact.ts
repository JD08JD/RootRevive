export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const googleScriptUrl = process.env.GOOGLE_SCRIPT_URL;

  if (!googleScriptUrl) {
    console.error('GOOGLE_SCRIPT_URL is not defined');
    return res.status(500).json({ error: 'Server configuration error' });
  }

  try {
    console.log('Sending request to Google Script:', googleScriptUrl);
    
    // Google Apps Script requires a redirect to be followed.
    // Fetch in Node.js handles this, but we want to be explicit.
    const response = await fetch(googleScriptUrl, {
      method: 'POST',
      redirect: 'follow', // Ensure we follow the 302 redirect
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body),
    });

    console.log('Google Script Response Status:', response.status);
    const text = await response.text();
    console.log('Google Script Raw Response Body:', text);

    if (response.status === 405) {
      console.error('Received 405 Method Not Allowed. This often happens if the redirect switches POST to GET.');
      return res.status(500).json({ 
        error: 'Storage service configuration error (405)',
        details: 'The storage service is rejecting the request format.' 
      });
    }

    let result;
    try {
      result = JSON.parse(text);
    } catch (e) {
      console.error('Failed to parse Google Script response as JSON. Raw body:', text);
      return res.status(500).json({ 
        error: 'Invalid response from storage service',
        rawResponse: text.substring(0, 100) // Send a snippet to help debug
      });
    }
    
    if (result.status === 'success') {
      return res.status(200).json(result);
    } else {
      console.error('Google Script Error:', result);
      return res.status(500).json({ error: result.message || 'Failed to submit to Google Sheets' });
    }
  } catch (error: any) {
    console.error('Error sending to Google Sheets:', error);
    return res.status(500).json({ error: 'Failed to submit form' });
  }
}
