import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Create server-side Supabase client (untyped for flexibility)
const getSupabaseClient = () => {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return null;
  }

  return createClient(supabaseUrl, supabaseKey);
};

// GET - Retrieve questionnaire response for a client
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ clientId: string }> }
) {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return NextResponse.json(
      { error: 'Supabase not configured', fallback: true },
      { status: 200 }
    );
  }

  try {
    const { clientId } = await params;
    const questionnaireId = request.nextUrl.searchParams.get('questionnaireId') || 'discovery';

    const { data, error } = await supabase
      .from('questionnaire_responses')
      .select('*')
      .eq('client_id', clientId)
      .eq('questionnaire_id', questionnaireId)
      .single();

    if (error && error.code !== 'PGRST116') {
      // PGRST116 = no rows returned, which is fine for new users
      console.error('Supabase GET error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ data: data || null });
  } catch (error) {
    console.error('API GET error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create or update questionnaire response
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ clientId: string }> }
) {
  const supabase = getSupabaseClient();

  if (!supabase) {
    return NextResponse.json(
      { error: 'Supabase not configured', fallback: true },
      { status: 200 }
    );
  }

  try {
    const { clientId } = await params;
    const body = await request.json();
    const {
      questionnaireId = 'discovery',
      answers,
      currentQuestionIndex,
      currentModuleIndex,
      points,
      streak,
      combo,
      shownMilestones,
      completed,
    } = body;

    // Upsert - insert or update based on unique constraint
    const { data, error } = await supabase
      .from('questionnaire_responses')
      .upsert(
        {
          client_id: clientId,
          questionnaire_id: questionnaireId,
          answers: answers || {},
          current_question_index: currentQuestionIndex || 0,
          current_module_index: currentModuleIndex || 0,
          points: points || 0,
          streak: streak || 0,
          combo: combo || 0,
          shown_milestones: shownMilestones || [],
          completed: completed || false,
        },
        {
          onConflict: 'client_id,questionnaire_id',
        }
      )
      .select()
      .single();

    if (error) {
      console.error('Supabase POST error:', error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    // Save to history for audit trail (async, don't wait)
    if (data) {
      supabase
        .from('response_history')
        .insert({
          response_id: (data as { id: string }).id,
          snapshot: {
            answers,
            currentQuestionIndex,
            currentModuleIndex,
            points,
            streak,
            combo,
            shownMilestones,
            completed,
            timestamp: new Date().toISOString(),
          },
        })
        .then(({ error: historyError }) => {
          if (historyError) {
            console.warn('History save warning:', historyError);
          }
        });
    }

    return NextResponse.json({ data, success: true });
  } catch (error) {
    console.error('API POST error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
