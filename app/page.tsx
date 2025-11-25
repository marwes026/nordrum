'use client';

import { useState } from 'react';

export default function Home() {
  const [image, setImage] = useState<File | null>(null);
  const [style, setStyle] = useState('');
  const [budget, setBudget] = useState('');
  const [existing, setExisting] = useState('');
  const [dislikes, setDislikes] = useState('');
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setImage(e.target.files[0]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) return;

    setLoading(true);
    setResult('');

    const formData = new FormData();
    formData.append('image', image);
    formData.append('style', style || 'skandinavisk minimalism');
    formData.append('budget', budget || '15 000 kr');
    formData.append('existing', existing);
    formData.append('dislikes', dislikes);

    // Temporärt svar medan vi väntar på riktig API-nyckel
    setTimeout(() => {
      setResult(`
        Analys av ditt rum:
        • Ett ljust vardagsrum ca 18–20 m² med vita väggar och ekparkett
        • Nuvarande möbler: grå IKEA-soffa, vitt soffbord, en äldre bokhylla
        • Bra ljusinsläpp från två fönster

        Förslag i skandinavisk stil (totalt ${budget || '15 000 kr'}):
        1. Ny ullmatta i beige ton (Rum21) – 4 900 kr
        2. Grön växt + kruka (Plantagen) – 850 kr
        3. Ny golvlampa i svart metall (Svenssons i Lammhult) – 2 950 kr
        4. 3 st nya kuddar i linne – 1 200 kr
        5. Stor tavla i träram (Desenio) – 1 800 kr

        Totalt ca 11 700 kr – resten kan du spara till gardiner eller en ny pall.
      `);
      setLoading(false);
    }, 2500);
  };

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-2xl mx-auto pt-12">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-2">
          Nordrum
        </h1>
        <p className="text-center text-gray-600 mb-10">
          AI-inredning för nordiska hem
        </p>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Fotografera ditt rum</label>
            <input type="file" accept="image/*" onChange={handleImage} required
              className="w-full text-sm text-gray-700 file:mr-4 file:py-3 file:px-6 file:rounded-full file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {image && <p className="text-sm text-green-600 mt-2">✓ {image.name}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium mb-1">Önskad stil</label>
              <input type="text" placeholder="t.ex. skandinavisk minimalism" value={style} onChange={e => setStyle(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Budget</label>
              <input type="text" placeholder="t.ex. 15 000 kr" value={budget} onChange={e => setBudget(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Möbler du redan har och vill behålla</label>
            <input type="text" placeholder="t.ex. IKEA Malm säng, grå soffa..." value={existing} onChange={e => setExisting(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Färger eller stil du ogillar</label>
            <input type="text" placeholder="t.ex. gult, för mycket mönster..." value={dislikes} onChange={e => setDislikes(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold py-4 rounded-lg hover:from-blue-700 hover:to-indigo-700 disabled:opacity-70"
          >
            {loading ? 'Analyserar rummet...' : 'Ge mig inredningsförslag →'}
          </button>
        </form>

        {result && (
          <div className="mt-10 bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold mb-4">Ditt personliga inredningsförslag</h2>
            <pre className="whitespace-pre-wrap text-gray-700">{result}</pre>
          </div>
        )}
      </div>
    </main>
  );
}