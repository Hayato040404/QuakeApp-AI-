import React from 'react';

const AboutPage: React.FC = () => {
  return (
    <div className="h-screen bg-gray-100 dark:bg-gray-900 text-gray-800 dark:text-white p-4 font-sans flex flex-col items-center">
      <div className="w-full max-w-3xl mx-auto flex-grow">
        <header className="flex justify-between items-center mb-6">
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tighter">
            このアプリについて
          </h1>
          <a href="#/" className="px-4 py-2 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 dark:bg-cyan-400/20 dark:hover:bg-cyan-400/30 text-cyan-800 dark:text-cyan-200 font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-cyan-500">
            戻る
          </a>
        </header>

        <div className="space-y-6 overflow-y-auto custom-scrollbar" style={{ height: 'calc(100vh - 120px)' }}>
          <section className="p-6 bg-white/50 dark:bg-gray-800/20 rounded-lg border border-gray-200 dark:border-gray-700/50 backdrop-blur-sm">
            <h2 className="text-xl font-semibold text-cyan-600 dark:text-cyan-400 mb-3">QuakeVision Japanへようこそ</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              QuakeVision Japanは、日本の最新の地震情報を視覚的に、そして直感的に把握するために設計されたWebアプリケーションです。インタラクティブな地図上で震度観測点を確認し、過去の地震データを素早く閲覧することができます。
            </p>
          </section>

          <section className="p-6 bg-white/50 dark:bg-gray-800/20 rounded-lg border border-gray-200 dark:border-gray-700/50 backdrop-blur-sm">
            <h2 className="text-xl font-semibold text-cyan-600 dark:text-cyan-400 mb-3">GeminiによるUI/UXデザイン</h2>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed mb-2">
              このアプリケーションのユーザーインターフェース（UI）とユーザーエクスペリエンス（UX）は、Googleの大規模言語モデルである <strong className="text-gray-900 dark:text-gray-100">Gemini</strong> によって設計・実装されました。
            </p>
            <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
              Geminiは、複雑な地震データを誰もが理解しやすい形で表示するという目標のもと、クリーンでモダンなデザインを生成しました。レスポンシブデザインにより、PCでもスマートフォンでも快適に利用できるほか、ライトモードとダークモードの切り替え、ドラッグ可能な情報シートなど、ユーザーの体験を第一に考えた機能が盛り込まれています。AIが生成するコードとデザインの可能性を示す一例です。
            </p>
          </section>

          <section className="p-6 bg-white/50 dark:bg-gray-800/20 rounded-lg border border-gray-200 dark:border-gray-700/50 backdrop-blur-sm">
            <h2 className="text-xl font-semibold text-cyan-600 dark:text-cyan-400 mb-3">主な機能と技術</h2>
            <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-300">
              <li><strong>リアルタイム地震情報:</strong> P2P地震情報APIから最新の地震データを取得して表示します。</li>
              <li><strong>インタラクティブ地図:</strong> D3.jsとTopoJSONを使用し、震源地や各地の震度を地図上にプロットします。ズームやパン操作もスムーズです。</li>
              <li><strong>PWA対応:</strong> プログレッシブウェブアプリとして、ホーム画面への追加やオフラインでの利用が可能です。最後に取得したデータはキャッシュされ、ネットワークがない環境でも閲覧できます。</li>
              <li><strong>レスポンシブデザイン:</strong> Tailwind CSSにより、あらゆる画面サイズに最適化されたレイアウトを提供します。</li>
            </ul>
          </section>

           <section className="p-6 bg-white/50 dark:bg-gray-800/20 rounded-lg border border-gray-200 dark:border-gray-700/50 backdrop-blur-sm">
            <h2 className="text-xl font-semibold text-cyan-600 dark:text-cyan-400 mb-3">データソース</h2>
            <p className="text-gray-600 dark:text-gray-300">
              地震情報は <a href="https://www.p2pquake.net/" target="_blank" rel="noopener noreferrer" className="text-cyan-600 dark:text-cyan-400 hover:underline">P2P地震情報</a> 様のAPIを利用しています。素晴らしいデータの提供に感謝いたします。
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
