'use client';

import { useState } from 'react';

export default function Home() {
  const [image, setImage] = useState<File | null>(null);
  const [style, setStyle] = useState('skandinavisk minimalism');
  const [budget, setBudget] = useState('20 000 kr');
  const [existing, setExisting] = useState('');
  const [dislikes, setDislikes] = useState('');
  const [result, setResult] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  const handleImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) setImage(e.target.files[0]);
  };

  const fileToBase64 = (file: File): Promise<string> =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve((reader.result as string).split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!image) return;

    setLoading(true);
    setResult('');
    setImages([]);

    try {
      const base64 = await fileToBase64(image);

      // 1. Analys med GPT-4o Vision
      const visionRes = await fetch('/api/analyze', {
        method: 'POST',
        body: JSON.stringify({
          image: `data:${image.type};base64,${base64}`,
          style,
          budget,
          existing,
          dislikes,
        }),
      });
      const { analysis } = await visionRes.json();

      // 2. Generera två efter-bilder med DALL·E 3
      const imgRes1 = await fetch('/api/generate', {
        method: 'POST',
        body: JSON.stringify({
          prompt: `${analysis}\n\nFotorealistisk bild av exakt samma rum i varm skandinavisk minimalism, ljusa naturmaterial, harmoniskt och inbjudande. Samma kameravinkel och perspektiv som originalbilden.`,
        }),
      });
      const imgRes2 = await fetch('/api/generate', {
        method: 'POST',
        body: JSON.stringify({
          prompt: `${analysis}\n\nSamma rum igen, men med lite mer färg i textilier och växter, fortfarande tydligt skandinaviskt men med personlig och ombonad känsla. Samma vinkel som originalet.`,
        }),
      });

      const img1 = await imgRes1.json();
      const img2 = await imgRes2.json();

      setResult(analysis);
      setImages([img1.url, img2.url]);
    } catch (err) {
      setResult('Något gick fel – dubbelkolla konsolen (F12) och att API-nyckeln ligger i .env.local');
      console.error(err);
    }
    setLoading(false);
  };

  return (
    <main className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-4xl mx-auto pt-12">
        <h1 className="text-5xl font-bold text-center text-gray-800 mb-2">Nordrum</h1>
        <p className="text-center text-gray-600 mb-12">AI-inredning för nordiska hem</p>

        <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-lg p-8 space-y-6">
          <div>
            <label className="block text-sm font-medium mb-2">Fotografera ditt rum</label>
            <input type="file" accept="image/*" onChange={handleImage} required
              className="w-full text-sm file:mr-4 file:py-3 file:px-6 file:rounded-full file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
            {image && <p className="text-sm text-green-600 mt-2">✓ {image.name}</p>}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium mb-1">Önskad stil</label>
              <input type="text" placeholder="t.ex. skandinavisk minimalism" value={style} onChange={e => setStyle(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Budget</label>
              <input type="text" placeholder="t.ex. 20 000 kr" value={budget} onChange={e => setBudget(e.target.value)}
                className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Möbler du vill behålla</label>
            <input type="text" placeholder="t.ex. vit soffa, orange fåtölj..." value={existing} onChange={e => setExisting(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Färger/stilar du ogillar</label>
            <input type="text" placeholder="t.ex. starka färger, för mycket mönster" value={dislikes} onChange={e => setDislikes(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg"
            />
          </div>

          <button type="submit" disabled={loading}
            className="w-full bg-gradient-to-r from-indigo-600 to-blue-600 text-white font-bold py-5 rounded-xl text-lg hover:from-indigo-700 hover:to-blue-700 disabled:opacity-70 transition"
          >
            {loading ? '♻ Analyserar & genererar bilder...' : 'Visa mig magin →'}
          </button>
        </form>

        {loading && <p className="text-center text-2xl mt-12 animate-pulse">Jobbar för fullt...</p>}

        {result && (
          <div className="mt-16 bg-white rounded-xl shadow-xl p-10">
            <h2 className="text-3xl font-bold mb-6">Din personliga analys</h2>
            <div className="prose prose-lg max-w-none whitespace-pre-wrap text-gray-700">{result}</div>
          </div>
        )}

        {images.length > 0 && (
          <div className="mt-16">
            <h2 className="text-4xl font-bold text-center mb-10">Så här kan ditt rum se ut</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
              {images.map((url, i) => (
                <div key={i} className="group relative">
                  <img src={url} alt={`Förslag ${i + 1}`} className="rounded-xl shadow-2xl w-full group-hover:scale-[1.02] transition duration-300" />
                  <p className="text-center mt-4 text-lg font-medium">Förslag {i + 1}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}