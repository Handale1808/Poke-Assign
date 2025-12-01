import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import { Submission, Analysis, Pokemon, Synonym, Log } from '@/lib/models';
import { randomUUID } from 'crypto';

export async function POST() {
  try {
    await dbConnect();
    
    const correlationId = randomUUID();
    
    await Submission.create({
      inputText: 'I stay up way too late scrolling memes and eating chips',
      correlationId,
      source: 'web',
      status: 'completed'
    });
    
    const submission2 = await Submission.create({
      inputText: 'I impulse buy plants then forget to water them',
      correlationId: randomUUID(),
      source: 'web',
      status: 'pending'
    });
    
    await Pokemon.create({
      pokeapiId: 143,
      name: 'snorlax',
      types: ['normal'],
      abilities: ['thick-fat', 'immunity'],
      flavorText: 'Very lazy. Just eats and sleeps. As its rotund bulk builds, it becomes steadily more slothful.',
      sprites: {
        front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/143.png'
      },
      embedding: Array(1536).fill(0).map(() => Math.random()),
      cachedAt: new Date()
    });
    
    await Pokemon.create({
      pokeapiId: 25,
      name: 'pikachu',
      types: ['electric'],
      abilities: ['static', 'lightning-rod'],
      flavorText: 'When several of these Pokémon gather, their electricity could build and cause lightning storms.',
      sprites: {
        front_default: 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png'
      },
      embedding: Array(1536).fill(0).map(() => Math.random()),
      cachedAt: new Date()
    });
    
    await Analysis.create({
      submissionId: submission2._id,
      correlationId: submission2.correlationId,
      topMatches: [
        {
          pokeapiId: 143,
          name: 'snorlax',
          similarity: 0.87,
          matchedSnippet: 'Very lazy. Just eats and sleeps.',
          pokeapiUrl: 'https://pokeapi.co/api/v2/pokemon/143'
        },
        {
          pokeapiId: 25,
          name: 'pikachu',
          similarity: 0.42,
          matchedSnippet: 'Their electricity could build',
          pokeapiUrl: 'https://pokeapi.co/api/v2/pokemon/25'
        }
      ],
      finalResult: {
        gremlinType: 'Sleepy Chaos Goblin',
        feralRating: 6.5,
        riskLevel: 'moderate',
        recommendedContainment: 'Provide snacks and comfortable nap zones',
        notes: 'This gremlin exhibits strong snorlax energy with bursts of chaotic plant-hoarding behavior.'
      },
      llmRawOutput: '{"gremlinType":"Sleepy Chaos Goblin","feralRating":6.5}',
      provenance: {
        embeddingProvider: 'openai',
        llmProvider: 'anthropic',
        llmModel: 'claude-sonnet-4',
        timestamp: new Date()
      },
      vectorScores: [0.87, 0.42, 0.31]
    });
    
    await Synonym.create({
      canonical: 'sleep',
      variants: ['sleep', 'sleepy', 'nap', 'doze', 'snooze', 'pass out']
    });
    
    await Synonym.create({
      canonical: 'eat',
      variants: ['eat', 'consume', 'dine', 'snack', 'chomp', 'munch']
    });
    
    await Log.create({
      correlationId,
      level: 'info',
      message: 'Submission processed successfully',
      meta: { duration: 234, status: 'completed' }
    });
    
    await Log.create({
      correlationId: randomUUID(),
      level: 'error',
      message: 'LLM timeout',
      meta: { provider: 'anthropic', retryCount: 3 }
    });
    
    const counts = {
      submissions: await Submission.countDocuments(),
      analyses: await Analysis.countDocuments(),
      pokemon: await Pokemon.countDocuments(),
      synonyms: await Synonym.countDocuments(),
      logs: await Log.countDocuments()
    };
    
    return NextResponse.json({ 
      success: true,
      message: 'Database seeded successfully',
      counts
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}

export async function DELETE() {
  try {
    await dbConnect();
    
    await Submission.deleteMany({});
    await Analysis.deleteMany({});
    await Pokemon.deleteMany({});
    await Synonym.deleteMany({});
    await Log.deleteMany({});
    
    return NextResponse.json({ 
      success: true,
      message: 'Database cleared successfully'
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: String(error) },
      { status: 500 }
    );
  }
}
