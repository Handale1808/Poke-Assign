import dbConnect from '@/lib/mongodb';
import { Submission, Analysis, Pokemon, Synonym, Log } from '@/lib/models';

export default async function DataPage() {
  await dbConnect();
  
  const submissions = await Submission.find().lean();
  const analyses = await Analysis.find().lean();
  const pokemon = await Pokemon.find().lean();
  const synonyms = await Synonym.find().lean();
  const logs = await Log.find().lean();
  
  const counts = {
    submissions: submissions.length,
    analyses: analyses.length,
    pokemon: pokemon.length,
    synonyms: synonyms.length,
    logs: logs.length
  };
  
  return (
    <div className="min-h-screen bg-gray-950 text-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8 text-purple-400">Database Overview</h1>
        
        <div className="grid grid-cols-5 gap-4 mb-8">
          {Object.entries(counts).map(([key, value]) => (
            <div key={key} className="bg-gray-900 rounded-lg p-4 border border-purple-500/20">
              <div className="text-2xl font-bold text-purple-400">{value}</div>
              <div className="text-sm text-gray-400 capitalize">{key}</div>
            </div>
          ))}
        </div>
        
        <div className="space-y-8">
          <Section title="Submissions" data={submissions} />
          <Section title="Analyses" data={analyses} />
          <Section title="Pokemon" data={pokemon} />
          <Section title="Synonyms" data={synonyms} />
          <Section title="Logs" data={logs} />
        </div>
      </div>
    </div>
  );
}

function Section({ title, data }: { title: string; data: any[] }) {
  return (
    <div className="bg-gray-900 rounded-lg p-6 border border-purple-500/20">
      <h2 className="text-2xl font-semibold mb-4 text-purple-300">{title}</h2>
      <pre className="bg-gray-950 p-4 rounded overflow-x-auto text-xs text-gray-300">
        {JSON.stringify(data, null, 2)}
      </pre>
    </div>
  );
}