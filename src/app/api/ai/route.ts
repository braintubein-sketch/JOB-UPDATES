import { NextRequest, NextResponse } from 'next/server';
import { getAIResponse, SYSTEM_PROMPTS } from '@/lib/ai';

export const dynamic = 'force-dynamic';

export async function POST(request: NextRequest) {
    try {
        if (!process.env.GEMINI_API_KEY) {
            return NextResponse.json(
                { success: false, error: 'AI service not configured' },
                { status: 503 }
            );
        }

        const body = await request.json();
        const { message, mode = 'chat', context = '' } = body;

        if (!message || typeof message !== 'string') {
            return NextResponse.json(
                { success: false, error: 'Message is required' },
                { status: 400 }
            );
        }

        if (message.length > 5000) {
            return NextResponse.json(
                { success: false, error: 'Message too long (max 5000 characters)' },
                { status: 400 }
            );
        }

        let systemPrompt: string;
        let userPrompt: string;

        switch (mode) {
            case 'resume':
                systemPrompt = SYSTEM_PROMPTS.resumeAnalyzer;
                userPrompt = `Please analyze this resume:\n\n${message}`;
                break;

            case 'cover-letter':
                systemPrompt = SYSTEM_PROMPTS.coverLetter;
                userPrompt = `Write a cover letter for:\n${message}\n\nAdditional context: ${context}`;
                break;

            case 'recommend':
                systemPrompt = SYSTEM_PROMPTS.jobRecommendation;
                userPrompt = `Based on this profile, recommend jobs:\n\n${message}`;
                break;

            case 'chat':
            default:
                systemPrompt = SYSTEM_PROMPTS.chatbot;
                userPrompt = message;
                break;
        }

        const response = await getAIResponse(userPrompt, systemPrompt);

        return NextResponse.json({
            success: true,
            response,
            mode,
        });
    } catch (error: any) {
        console.error('[AI API] Error:', error);
        return NextResponse.json(
            { success: false, error: error.message || 'AI service error' },
            { status: 500 }
        );
    }
}
