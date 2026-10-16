const http = require('http');

function request(url, method, data, token) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const bodyStr = data ? JSON.stringify(data) : null;
    const headers = {};
    if (bodyStr) {
      headers['Content-Type'] = 'application/json';
      headers['Content-Length'] = Buffer.byteLength(bodyStr);
    }
    if (token) headers['Authorization'] = `Bearer ${token}`;
    const req = http.request({
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname + (urlObj.search || ''),
      method,
      headers
    }, res => {
      let raw = '';
      res.on('data', chunk => raw += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(raw) });
        } catch (e) {
          resolve({ status: res.statusCode, raw });
        }
      });
    });
    req.on('error', reject);
    if (bodyStr) req.write(bodyStr);
    req.end();
  });
}

async function run() {
  console.log('=== 1. Health check ===');
  const h = await request('http://localhost:5173/health', 'GET');
  console.log('Health:', h.status, h.data);

  console.log('\n=== 2. Patient Auth ===');
  const pAuth = await request('http://localhost:5173/auth/login', 'POST', {
    email: 'patient@carebridge.com',
    password: 'password123'
  });
  console.log('Patient Login:', pAuth.status, pAuth.data?.user?.email);
  const pToken = pAuth.data?.token;

  console.log('\n=== 3. Documents listing ===');
  const docs = await request('http://localhost:5173/documents', 'GET', null, pToken);
  console.log('Docs:', docs.status, 'Count:', docs.data?.length, 'Doc IDs:', docs.data?.map(d => d.id));

  console.log('\n=== 4. Document Verification ===');
  const verifyRes = await request('http://localhost:5173/documents/doc-1/verify', 'POST', {
    status: 'confirmed',
    verifiedData: {
      medicines: [
        { name: 'Amoxicillin', dose_text: '500mg', frequency: 'Twice daily', timing: 'Morning and evening with meals' }
      ],
      appointments: [
        { date: '2026-10-22', department: 'Cardiology Follow-Up' }
      ],
      tests: [
        { test_name: 'Complete Blood Count (CBC)', due_date: '2026-10-18' }
      ],
      care_instructions: [
        { instruction: 'Keep surgical incision site dry.' }
      ]
    }
  }, pToken);
  console.log('Verify Status:', verifyRes.status, verifyRes.data?.message);

  console.log('\n=== 5. Medication Status Patch ===');
  const medRes = await request('http://localhost:5173/medications/med-1/status', 'PATCH', {
    status: 'TAKEN'
  }, pToken);
  console.log('Med Status:', medRes.status, 'Med status:', medRes.data?.status);

  console.log('\n=== 6. Care Plan with updated tasks & meds ===');
  const cp = await request('http://localhost:5173/patients/p-1/care-plan', 'GET', null, pToken);
  console.log('Care plan tasks:', cp.data?.care_tasks?.length, 'meds:', cp.data?.medications?.length);

  console.log('\n=== 7. Patient Follow-Up Summary Access (Role Restricted) ===');
  const pSummary = await request('http://localhost:5173/patients/p-1/follow-up-summary', 'GET', null, pToken);
  console.log('Patient view summary (expected 403):', pSummary.status, pSummary.data?.error || pSummary.data);

  console.log('\n=== 8. Clinician Follow-Up Summary Access ===');
  const cAuth = await request('http://localhost:5173/auth/login', 'POST', {
    email: 'clinician@carebridge.com',
    password: 'password123'
  });
  const cToken = cAuth.data?.token;
  const cSummary = await request('http://localhost:5173/patients/p-1/follow-up-summary', 'GET', null, cToken);
  console.log('Clinician view summary (200 OK):', cSummary.status, 'Completed tasks:', cSummary.data?.completedTasks, 'Adherence:', cSummary.data?.adherenceScore);
}

run().catch(console.error);
