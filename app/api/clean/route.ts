import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    const content = await file.text();
    const originalSize = Buffer.from(content).length;

    // Phân tích các yếu tố làm nặng file
    const analysis = analyzeMarkdown(content, originalSize);

    // Loại bỏ ảnh base64
    const cleanedContent = removeBase64Images(content);
    const cleanedSize = Buffer.from(cleanedContent).length;

    return NextResponse.json({
      analysis: {
        ...analysis,
        cleanedSize,
      },
      cleanedContent,
    });
  } catch (error) {
    console.error('Error processing file:', error);
    return NextResponse.json(
      { error: 'Error processing file' },
      { status: 500 }
    );
  }
}

function analyzeMarkdown(content: string, originalSize: number) {
  const issues: { type: string; count: number; size: number }[] = [];

  // 1. Phân tích ảnh base64
  const base64ImagePattern = /data:image\/[^;]+;base64,[A-Za-z0-9+/=]+/g;
  const base64Matches = content.match(base64ImagePattern) || [];
  const base64TotalSize = base64Matches.reduce(
    (sum, match) => sum + match.length,
    0
  );

  if (base64Matches.length > 0) {
    issues.push({
      type: 'Ảnh Base64',
      count: base64Matches.length,
      size: base64TotalSize,
    });
  }

  // 2. Phân tích link ảnh dài
  const imageLinkPattern = /!\[.*?\]\((https?:\/\/[^\s)]+)\)/g;
  const imageLinks = content.match(imageLinkPattern) || [];
  const imageLinkSize = imageLinks.reduce(
    (sum, match) => sum + match.length,
    0
  );

  if (imageLinks.length > 0) {
    issues.push({
      type: 'Link ảnh dài',
      count: imageLinks.length,
      size: imageLinkSize,
    });
  }

  // 3. Phân tích HTML tags
  const htmlTagPattern = /<[^>]+>/g;
  const htmlTags = content.match(htmlTagPattern) || [];
  const htmlTagSize = htmlTags.reduce((sum, match) => sum + match.length, 0);

  if (htmlTags.length > 0) {
    issues.push({
      type: 'HTML Tags',
      count: htmlTags.length,
      size: htmlTagSize,
    });
  }

  // 4. Phân tích khoảng trắng thừa
  const excessiveWhitespace = content.match(/\n{3,}/g) || [];
  const whitespaceSize = excessiveWhitespace.reduce(
    (sum, match) => sum + match.length,
    0
  );

  if (excessiveWhitespace.length > 0) {
    issues.push({
      type: 'Khoảng trắng thừa (3+ dòng trống)',
      count: excessiveWhitespace.length,
      size: whitespaceSize,
    });
  }

  // 5. Phân tích reference-style images
  const refStyleImages = content.match(/\[image\d+\]:\s*<data:image/g) || [];
  const refStyleSize = refStyleImages.reduce(
    (sum, match) => sum + match.length,
    0
  );

  if (refStyleImages.length > 0) {
    issues.push({
      type: 'Reference-style base64 images',
      count: refStyleImages.length,
      size: refStyleSize,
    });
  }

  // 6. Đếm số dòng
  const lineCount = content.split('\n').length;

  return {
    originalSize,
    base64Count: base64Matches.length,
    base64TotalSize,
    lineCount,
    issues: issues.sort((a, b) => b.size - a.size), // Sắp xếp theo kích thước giảm dần
  };
}

function removeBase64Images(content: string): string {
  let cleaned = content;

  // 1. Loại bỏ inline base64 images
  // Pattern: ![alt](data:image/...)
  cleaned = cleaned.replace(
    /!\[([^\]]*)\]\(data:image\/[^;]+;base64,[A-Za-z0-9+/=]+\)/g,
    '<!-- Ảnh base64 đã được loại bỏ: $1 -->'
  );

  // 2. Loại bỏ reference-style base64 images
  // Pattern: [image1]: <data:image/...>
  cleaned = cleaned.replace(
    /\[image\d+\]:\s*<data:image\/[^;]+;base64,[A-Za-z0-9+/=]+>/g,
    ''
  );

  // 3. Loại bỏ các dòng trống thừa sau khi xóa
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n');

  // 4. Loại bỏ các reference không sử dụng
  const usedRefs = new Set<string>();
  const refPattern = /!\[([^\]]*)\]\[([^\]]+)\]/g;
  let match;

  while ((match = refPattern.exec(cleaned)) !== null) {
    usedRefs.add(match[2]);
  }

  // Xóa các reference definition không được sử dụng
  cleaned = cleaned.replace(
    /^\[([^\]]+)\]:\s*(.+)$/gm,
    (match, refName, refValue) => {
      if (usedRefs.has(refName)) {
        return match;
      }
      return '';
    }
  );

  // 5. Dọn dẹp cuối cùng
  cleaned = cleaned.replace(/\n{3,}/g, '\n\n').trim();

  return cleaned;
}
