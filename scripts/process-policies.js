import fs from 'fs';
import path from 'path';
import mammoth from 'mammoth';

const ROOT_DIR = process.cwd();
const SOURCE_DIR = path.join(ROOT_DIR, 'policies-source');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public', 'policies');
const DATA_FILE = path.join(ROOT_DIR, 'src', 'data', 'policies.js');

// Ensure directories exist
if (!fs.existsSync(SOURCE_DIR)) fs.mkdirSync(SOURCE_DIR, { recursive: true });
if (!fs.existsSync(PUBLIC_DIR)) fs.mkdirSync(PUBLIC_DIR, { recursive: true });

async function processPolicies() {
  console.log('📄 [Meridian Policy Sync] Checking for official .docx files in:', SOURCE_DIR);

  let docxFiles = [];
  if (fs.existsSync(SOURCE_DIR)) {
    docxFiles = fs.readdirSync(SOURCE_DIR).filter(f => f.toLowerCase().endsWith('.docx') && !f.startsWith('~$'));
  }

  // Also check if any were placed directly in public/policies
  if (docxFiles.length === 0 && fs.existsSync(PUBLIC_DIR)) {
    const publicFiles = fs.readdirSync(PUBLIC_DIR).filter(f => f.toLowerCase().endsWith('.docx') && !f.startsWith('~$'));
    if (publicFiles.length > 0) {
      console.log('ℹ️ Found .docx files in public/policies, processing from there...');
      for (const pf of publicFiles) {
        fs.copyFileSync(path.join(PUBLIC_DIR, pf), path.join(SOURCE_DIR, pf));
      }
      docxFiles = publicFiles;
    }
  }

  if (docxFiles.length === 0) {
    console.log('⚠️ No .docx policy files found.');
    console.log('👉 Place your official .docx files in: policies-source/');
    console.log('   Then run: npm run sync-policies');
    
    // Keep OFFICIAL_POLICIES as empty array so no fake content is shown
    const emptyFileContent = `/**
 * Official Meridian Policies (Awaiting .docx Documents)
 * Place your official .docx policy files in: policies-source/
 * Then run: npm run sync-policies
 */
export const OFFICIAL_POLICIES = [];
`;
    fs.writeFileSync(DATA_FILE, emptyFileContent, 'utf-8');
    return;
  }

  const policies = [];

  for (let i = 0; i < docxFiles.length; i++) {
    const filename = docxFiles[i];
    const filePath = path.join(SOURCE_DIR, filename);

    // 1. Convert DOCX to clean semantic HTML
    const htmlResult = await mammoth.convertToHtml({ path: filePath });
    const rawTextResult = await mammoth.extractRawText({ path: filePath });

    const htmlContent = htmlResult.value || '<p>Content unavailable.</p>';
    const rawText = rawTextResult.value || '';

    // 2. Derive Title (from first heading or clean filename)
    let title = '';
    const headingMatch = htmlContent.match(/<h[1-3][^>]*>(.*?)<\/h[1-3]>/i);
    if (headingMatch && headingMatch[1] && headingMatch[1].trim().length > 3) {
      title = headingMatch[1].replace(/<[^>]+>/g, '').trim();
    } else {
      title = filename
        .replace(/\.docx$/i, '')
        .replace(/[-_]+/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase())
        .trim();
    }

    // 3. Derive Category (HR Policies vs IT Policies)
    const lowerName = (filename + ' ' + title).toLowerCase();
    let category = 'hr';
    let categoryLabel = 'HR Policies';

    if (
      lowerName.includes('it ') ||
      lowerName.includes('it faq') ||
      lowerName.includes('laptop') ||
      lowerName.includes('password') ||
      lowerName.includes('software') ||
      lowerName.includes('hardware') ||
      lowerName.includes('security') ||
      lowerName.includes('network') ||
      lowerName.includes('vpn')
    ) {
      category = 'it';
      categoryLabel = 'IT Policies';
    } else {
      category = 'hr';
      categoryLabel = 'HR Policies';
    }

    // 4. Derive Summary directly from Section 1 (Purpose) of the document
    let summary = '';
    const purposeMatch = rawText.match(/1\.\s*Purpose\s*([\s\S]*?)(?=\n\s*2\.|\n\s*\[|$)/i);
    if (purposeMatch && purposeMatch[1] && purposeMatch[1].trim()) {
      summary = purposeMatch[1].trim().replace(/\s+/g, ' ');
    } else {
      const paragraphs = rawText
        .split(/\n+/)
        .map(p => p.trim())
        .filter(p => p.length > 30 && !p.includes('Document ID:') && !p.includes('Version:') && !p.includes('Classification:'));
      summary = paragraphs.length > 0 ? paragraphs[0] : filename.replace(/\.docx$/i, '');
    }
    if (summary.length > 220) {
      summary = summary.slice(0, 217) + '...';
    }

    // 5. Calculate Read Time & Date
    const wordCount = rawText.split(/\s+/).filter(Boolean).length;
    const readMinutes = Math.max(1, Math.ceil(wordCount / 200));
    const readTime = `${readMinutes} min read`;

    const stats = fs.statSync(filePath);
    const updatedDate = stats.mtime.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });

    // 6. Copy original DOCX to public/policies/ for employee download
    const publicFileName = filename;
    fs.copyFileSync(filePath, path.join(PUBLIC_DIR, publicFileName));

    policies.push({
      id: `DOC-${String(i + 1).padStart(2, '0')}`,
      filename,
      downloadUrl: `/policies/${encodeURIComponent(publicFileName)}`,
      category,
      categoryLabel,
      title,
      summary,
      readTime,
      updated: updatedDate,
      fullContent: htmlContent
    });

    console.log(`✓ Processed: "${filename}" -> "${title}" (${categoryLabel})`);
  }

  // 7. Write to src/data/policies.js
  const fileContent = `/**
 * Official Meridian Policies
 * Generated automatically from documents in policies-source/
 * Total documents: ${policies.length}
 */

export const OFFICIAL_POLICIES = ${JSON.stringify(policies, null, 2)};
`;

  fs.writeFileSync(DATA_FILE, fileContent, 'utf-8');
  console.log(`\n🎉 Successfully integrated ${policies.length} official policy document(s) into src/data/policies.js`);
}

processPolicies().catch(err => {
  console.error('❌ Error processing policy documents:', err);
  process.exit(1);
});
