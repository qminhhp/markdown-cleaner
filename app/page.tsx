'use client';

import { useState } from 'react';

interface AnalysisResult {
  originalSize: number;
  cleanedSize: number;
  base64Count: number;
  base64TotalSize: number;
  lineCount: number;
  issues: {
    type: string;
    count: number;
    size: number;
  }[];
}

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [cleanedContent, setCleanedContent] = useState<string>('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setResult(null);
      setCleanedContent('');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/clean', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();
      setResult(data.analysis);
      setCleanedContent(data.cleanedContent);
    } catch (error) {
      console.error('Error:', error);
      alert('Có lỗi xảy ra khi xử lý file');
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    if (!cleanedContent || !file) return;

    const blob = new Blob([cleanedContent], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cleaned_${file.name}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            MD Base64 Image Cleaner
          </h1>
          <p className="text-gray-600">
            Loại bỏ ảnh base64 và phân tích các yếu tố làm nặng file Markdown
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-xl p-8 mb-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-indigo-500 transition-colors">
              <input
                type="file"
                accept=".md,.markdown"
                onChange={handleFileChange}
                className="hidden"
                id="file-upload"
              />
              <label
                htmlFor="file-upload"
                className="cursor-pointer flex flex-col items-center"
              >
                <svg
                  className="w-12 h-12 text-gray-400 mb-3"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <span className="text-sm text-gray-600">
                  {file ? file.name : 'Chọn file .md hoặc .markdown'}
                </span>
              </label>
            </div>

            <button
              type="submit"
              disabled={!file || loading}
              className="w-full bg-indigo-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-indigo-700 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Đang xử lý...' : 'Phân tích và Làm sạch'}
            </button>
          </form>
        </div>

        {result && (
          <div className="bg-white rounded-lg shadow-xl p-8 space-y-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">
              Kết quả phân tích
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-red-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Kích thước ban đầu</p>
                <p className="text-2xl font-bold text-red-600">
                  {formatBytes(result.originalSize)}
                </p>
              </div>

              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Kích thước sau khi làm sạch</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatBytes(result.cleanedSize)}
                </p>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Tiết kiệm được</p>
                <p className="text-2xl font-bold text-blue-600">
                  {formatBytes(result.originalSize - result.cleanedSize)}
                  <span className="text-sm ml-2">
                    ({Math.round((1 - result.cleanedSize / result.originalSize) * 100)}%)
                  </span>
                </p>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <p className="text-sm text-gray-600">Số dòng</p>
                <p className="text-2xl font-bold text-purple-600">
                  {result.lineCount}
                </p>
              </div>
            </div>

            <div className="border-t pt-6">
              <h3 className="text-xl font-semibold mb-4">
                Các yếu tố làm nặng file:
              </h3>
              <div className="space-y-3">
                {result.issues.map((issue, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-3 bg-gray-50 rounded-lg"
                  >
                    <div>
                      <p className="font-medium text-gray-800">{issue.type}</p>
                      <p className="text-sm text-gray-600">
                        Số lượng: {issue.count}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-gray-800">
                        {formatBytes(issue.size)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={handleDownload}
              className="w-full bg-green-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              Tải xuống file đã làm sạch
            </button>
          </div>
        )}
      </div>
    </main>
  );
}
