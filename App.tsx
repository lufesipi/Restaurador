import React, { useState, useCallback, useEffect } from 'react';
import { analyzeImageForRestorationPrompt, restoreImage } from './services/geminiService';
import { ImageUploader } from './components/ImageUploader';
import { ImageCard } from './components/ImageCard';
import { Modal } from './components/Modal';
import { Spinner } from './components/Spinner';

type AppStep = 'upload' | 'analyzing' | 'edit_prompt' | 'restoring' | 'result';

const App: React.FC = () => {
  const [step, setStep] = useState<AppStep>('upload');
  const [originalFile, setOriginalFile] = useState<File | null>(null);
  const [originalImageUrl, setOriginalImageUrl] = useState<string | null>(null);
  const [prompt, setPrompt] = useState<string>('');
  const [restoredImageUrl, setRestoredImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    if (originalFile) {
      const url = URL.createObjectURL(originalFile);
      setOriginalImageUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    setOriginalImageUrl(null);
  }, [originalFile]);

  const handleFileSelect = (file: File | null) => {
    setOriginalFile(file);
    if (!file) {
      handleReset();
    }
  };

  const handleAnalyze = useCallback(async () => {
    if (!originalFile) {
      setError('Por favor, envie uma imagem primeiro.');
      return;
    }
    setError(null);
    setStep('analyzing');
    try {
      const generatedPrompt = await analyzeImageForRestorationPrompt(originalFile);
      setPrompt(generatedPrompt);
      setStep('edit_prompt');
    } catch (e) {
      setError((e as Error).message);
      setStep('upload');
    }
  }, [originalFile]);
  
  const handleRestore = useCallback(async () => {
    if (!originalFile || !prompt.trim()) {
        setError('Um prompt e uma imagem são necessários.');
        return;
    }
    setError(null);
    setStep('restoring');
    try {
        const image = await restoreImage(prompt, originalFile);
        setRestoredImageUrl(image);
        setStep('result');
    } catch (e) {
        setError((e as Error).message);
        setStep('edit_prompt');
    }
  }, [originalFile, prompt]);

  const handleDownload = () => {
    if (!restoredImageUrl) return;
    const link = document.createElement('a');
    link.href = restoredImageUrl;
    link.download = `restored-photo-${Date.now()}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleReset = () => {
    setStep('upload');
    setOriginalFile(null);
    setOriginalImageUrl(null);
    setPrompt('');
    setRestoredImageUrl(null);
    setError(null);
    setSelectedImage(null);
  };

  return (
    <div className="min-h-screen bg-dark-bg text-brand-light font-sans p-4 sm:p-6 lg:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="text-center mb-10">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-indigo-600">
            Restaurador de Fotos com IA
          </h1>
          <p className="text-gray-400 mt-2">Dê vida nova às suas memórias mais queridas.</p>
        </header>

        <main className="bg-dark-card p-6 rounded-xl shadow-2xl border border-dark-border min-h-[400px] flex flex-col justify-center items-center">
          {error && <p className="text-red-400 text-center mb-4">{error}</p>}

          {step === 'upload' && (
            <div className="w-full max-w-md flex flex-col items-center gap-4">
              <ImageUploader onFileSelect={handleFileSelect} />
              {originalFile && (
                <button onClick={handleAnalyze} className="w-full py-3 px-6 bg-brand-purple text-white font-semibold rounded-lg hover:bg-violet-700 transition-colors">
                  Analisar Foto
                </button>
              )}
            </div>
          )}

          {(step === 'analyzing' || step === 'restoring') && (
             <div className="flex flex-col items-center justify-center gap-4 text-center">
                <Spinner />
                <p className="text-gray-400">{step === 'analyzing' ? 'Analisando sua foto...' : 'Restaurando sua obra-prima...'}</p>
                <p className="text-sm text-gray-500">Isso pode levar alguns instantes.</p>
            </div>
          )}
          
          {step === 'edit_prompt' && originalImageUrl && (
            <div className="w-full flex flex-col md:flex-row gap-8">
                <div className="md:w-1/2">
                    <img src={originalImageUrl} alt="Original para restauração" className="rounded-lg object-contain w-full h-auto max-h-80" />
                </div>
                <div className="md:w-1/2 flex flex-col gap-4">
                    <label htmlFor="prompt" className="block text-sm font-medium text-gray-300">Prompt de Restauração Sugerido</label>
                    <textarea
                      id="prompt"
                      value={prompt}
                      onChange={(e) => setPrompt(e.target.value)}
                      className="w-full flex-grow p-3 bg-gray-900 border border-dark-border rounded-md focus:ring-2 focus:ring-brand-purple"
                      rows={8}
                    />
                    <button onClick={handleRestore} className="w-full py-3 px-6 bg-brand-purple text-white font-semibold rounded-lg hover:bg-violet-700 transition-colors">
                        Restaurar Foto
                    </button>
                </div>
            </div>
          )}

          {step === 'result' && originalImageUrl && restoredImageUrl && (
            <div className="w-full flex flex-col items-center gap-8">
                <div className="w-full grid grid-cols-1 md:grid-cols-2 gap-6">
                    <ImageCard src={originalImageUrl} title="Original" onView={() => setSelectedImage(originalImageUrl)} />
                    <ImageCard src={restoredImageUrl} title="Restaurada" onView={() => setSelectedImage(restoredImageUrl)} onDownload={handleDownload} />
                </div>
                <button onClick={handleReset} className="w-full max-w-sm py-3 px-6 bg-gray-600 text-white font-semibold rounded-lg hover:bg-gray-700 transition-colors">
                    Restaurar Outra Foto
                </button>
            </div>
          )}

        </main>
      </div>

      {selectedImage && (
        <Modal imageUrl={selectedImage} onClose={() => setSelectedImage(null)} />
      )}
    </div>
  );
};

export default App;
