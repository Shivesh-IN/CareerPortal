export async function POST(req){
  return new Response(JSON.stringify({
    atsScore: 72,
    skills: ['Python','SQL','Pandas'],
    summary: 'Detected analytics projects and internships.',
    gaps: ['Cloud experience', 'Advanced SQL']
  }), { status: 200, headers: { 'Content-Type': 'application/json' } })
}

