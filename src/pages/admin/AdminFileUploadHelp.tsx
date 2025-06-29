import React, { useState } from 'react';
import { 
  HelpCircle, 
  Upload, 
  Eye, 
  Download, 
  ZoomIn, 
  RotateCw,
  FileText,
  Image as ImageIcon,
  CheckCircle,
  AlertTriangle,
  X,
  ChevronDown,
  ChevronRight
} from 'lucide-react';

interface HelpSection {
  id: string;
  title: string;
  content: React.ReactNode;
}

export default function AdminFileUploadHelp() {
  const [expandedSections, setExpandedSections] = useState<Set<string>>(new Set(['overview']));

  const toggleSection = (sectionId: string) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(sectionId)) {
      newExpanded.delete(sectionId);
    } else {
      newExpanded.add(sectionId);
    }
    setExpandedSections(newExpanded);
  };

  const helpSections: HelpSection[] = [
    {
      id: 'overview',
      title: 'Overview - File Upload & Preview System',
      content: (
        <div className="space-y-4">
          <p className="text-gray-700">
            The admin file upload and preview system allows you to view, manage, and download 
            user-uploaded receipts and documents with advanced preview capabilities.
          </p>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <CheckCircle className="h-5 w-5 text-blue-600" />
              <span className="font-semibold text-blue-800">Key Features</span>
            </div>
            <ul className="text-blue-700 text-sm space-y-1">
              <li>• Full-screen image preview with zoom and rotation</li>
              <li>• PDF document viewing in browser</li>
              <li>• Secure file download with authentication</li>
              <li>• Mobile-responsive design</li>
              <li>• Keyboard shortcuts for quick navigation</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'accessing',
      title: 'Accessing Transaction Files',
      content: (
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3">Step-by-Step Process:</h4>
            <ol className="space-y-3 text-gray-700">
              <li className="flex items-start space-x-3">
                <span className="bg-primary-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">1</span>
                <div>
                  <strong>Navigate to Transactions</strong>
                  <p className="text-sm text-gray-600">Go to Admin Dashboard → Transactions</p>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <span className="bg-primary-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">2</span>
                <div>
                  <strong>Find Target Transaction</strong>
                  <p className="text-sm text-gray-600">Use filters or search to locate the transaction</p>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <span className="bg-primary-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">3</span>
                <div>
                  <strong>Click View Button</strong>
                  <p className="text-sm text-gray-600">Click the "View" button in the Actions column</p>
                </div>
              </li>
              <li className="flex items-start space-x-3">
                <span className="bg-primary-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-sm font-semibold">4</span>
                <div>
                  <strong>Locate Receipt Section</strong>
                  <p className="text-sm text-gray-600">Scroll to the "Receipt" section on the right side</p>
                </div>
              </li>
            </ol>
          </div>
        </div>
      )
    },
    {
      id: 'file-types',
      title: 'Supported File Types',
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <span className="font-semibold text-green-800">Fully Supported</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <ImageIcon className="h-4 w-4 text-green-600" />
                  <span className="text-green-700 text-sm">Images: JPG, PNG, GIF, WebP, BMP</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4 text-green-600" />
                  <span className="text-green-700 text-sm">Documents: PDF</span>
                </div>
              </div>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-3">
                <AlertTriangle className="h-5 w-5 text-yellow-600" />
                <span className="font-semibold text-yellow-800">Download Only</span>
              </div>
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4 text-yellow-600" />
                  <span className="text-yellow-700 text-sm">Office: DOC, DOCX, XLS, XLSX</span>
                </div>
                <div className="flex items-center space-x-2">
                  <FileText className="h-4 w-4 text-yellow-600" />
                  <span className="text-yellow-700 text-sm">Archives: ZIP, RAR</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-semibold text-blue-800 mb-2">File Size Limits</h4>
            <ul className="text-blue-700 text-sm space-y-1">
              <li>• Maximum upload size: <strong>10MB</strong></li>
              <li>• Recommended size: <strong>5MB or less</strong> for optimal performance</li>
              <li>• Large files may take longer to load and preview</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'preview-controls',
      title: 'Image Preview Controls',
      content: (
        <div className="space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3">Opening Image Preview</h4>
            <p className="text-gray-700 text-sm mb-3">
              Click on any receipt thumbnail in the transaction details to open the full-screen preview.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">Control Buttons</h4>
              <div className="space-y-2">
                <div className="flex items-center space-x-3 p-2 bg-white rounded border">
                  <ZoomIn className="h-4 w-4 text-primary-600" />
                  <span className="text-sm">Zoom In/Out (25% - 500%)</span>
                </div>
                <div className="flex items-center space-x-3 p-2 bg-white rounded border">
                  <RotateCw className="h-4 w-4 text-primary-600" />
                  <span className="text-sm">Rotate 90° clockwise</span>
                </div>
                <div className="flex items-center space-x-3 p-2 bg-white rounded border">
                  <Eye className="h-4 w-4 text-primary-600" />
                  <span className="text-sm">Toggle fullscreen mode</span>
                </div>
                <div className="flex items-center space-x-3 p-2 bg-white rounded border">
                  <Download className="h-4 w-4 text-primary-600" />
                  <span className="text-sm">Download original file</span>
                </div>
              </div>
            </div>
            
            <div className="space-y-3">
              <h4 className="font-semibold text-gray-900">Keyboard Shortcuts</h4>
              <div className="space-y-2">
                <div className="flex justify-between items-center p-2 bg-white rounded border">
                  <span className="text-sm">Close preview</span>
                  <kbd className="bg-gray-200 px-2 py-1 rounded text-xs">ESC</kbd>
                </div>
                <div className="flex justify-between items-center p-2 bg-white rounded border">
                  <span className="text-sm">Zoom in</span>
                  <kbd className="bg-gray-200 px-2 py-1 rounded text-xs">+</kbd>
                </div>
                <div className="flex justify-between items-center p-2 bg-white rounded border">
                  <span className="text-sm">Zoom out</span>
                  <kbd className="bg-gray-200 px-2 py-1 rounded text-xs">-</kbd>
                </div>
                <div className="flex justify-between items-center p-2 bg-white rounded border">
                  <span className="text-sm">Rotate</span>
                  <kbd className="bg-gray-200 px-2 py-1 rounded text-xs">R</kbd>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h4 className="font-semibold text-purple-800 mb-2">Advanced Features</h4>
            <ul className="text-purple-700 text-sm space-y-1">
              <li>• <strong>Pan & Drag:</strong> When zoomed in, drag the image to move around</li>
              <li>• <strong>Reset View:</strong> Click "Reset View" to return to original state</li>
              <li>• <strong>Zoom Indicator:</strong> Current zoom level shown in top-left corner</li>
              <li>• <strong>Touch Support:</strong> Pinch to zoom and drag to pan on mobile devices</li>
            </ul>
          </div>
        </div>
      )
    },
    {
      id: 'download-options',
      title: 'Download Options',
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-3">
                <Download className="h-5 w-5 text-primary-600" />
                <span className="font-semibold text-gray-900">Preview Download</span>
              </div>
              <ol className="text-sm text-gray-700 space-y-1">
                <li>1. Open image preview</li>
                <li>2. Click Download button</li>
                <li>3. File saves automatically</li>
              </ol>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-3">
                <FileText className="h-5 w-5 text-primary-600" />
                <span className="font-semibold text-gray-900">Direct Download</span>
              </div>
              <ol className="text-sm text-gray-700 space-y-1">
                <li>1. Find Download link</li>
                <li>2. Click to download</li>
                <li>3. File downloads immediately</li>
              </ol>
            </div>
            
            <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex items-center space-x-2 mb-3">
                <Eye className="h-5 w-5 text-primary-600" />
                <span className="font-semibold text-gray-900">Right-Click Save</span>
              </div>
              <ol className="text-sm text-gray-700 space-y-1">
                <li>1. Right-click on image</li>
                <li>2. Select "Save Image As"</li>
                <li>3. Choose save location</li>
              </ol>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'troubleshooting',
      title: 'Troubleshooting Common Issues',
      content: (
        <div className="space-y-4">
          <div className="space-y-4">
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h4 className="font-semibold text-red-800 mb-2">Image Won't Load</h4>
              <ul className="text-red-700 text-sm space-y-1">
                <li>• Check your internet connection</li>
                <li>• Refresh the page (F5 or Ctrl+R)</li>
                <li>• Clear browser cache and cookies</li>
                <li>• Try a different browser (Chrome, Firefox, Edge)</li>
              </ul>
            </div>
            
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h4 className="font-semibold text-yellow-800 mb-2">Preview is Slow</h4>
              <ul className="text-yellow-700 text-sm space-y-1">
                <li>• Large files (&gt;5MB) may load slowly</li>
                <li>• Check your network speed</li>
                <li>• Close other browser tabs to free memory</li>
                <li>• Consider downloading for offline viewing</li>
              </ul>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-2">Can't Download Files</h4>
              <ul className="text-blue-700 text-sm space-y-1">
                <li>• Disable popup blocker for this site</li>
                <li>• Check browser download permissions</li>
                <li>• Temporarily disable antivirus if blocking</li>
                <li>• Try right-click "Save As" method</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <h4 className="font-semibold text-gray-900 mb-3">Browser Compatibility</h4>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2">Browser</th>
                    <th className="text-center py-2">Image Preview</th>
                    <th className="text-center py-2">PDF Preview</th>
                    <th className="text-center py-2">Download</th>
                  </tr>
                </thead>
                <tbody className="space-y-1">
                  <tr className="border-b border-gray-100">
                    <td className="py-2">Chrome 90+</td>
                    <td className="text-center py-2">✅</td>
                    <td className="text-center py-2">✅</td>
                    <td className="text-center py-2">✅</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2">Firefox 88+</td>
                    <td className="text-center py-2">✅</td>
                    <td className="text-center py-2">✅</td>
                    <td className="text-center py-2">✅</td>
                  </tr>
                  <tr className="border-b border-gray-100">
                    <td className="py-2">Safari 14+</td>
                    <td className="text-center py-2">✅</td>
                    <td className="text-center py-2">✅</td>
                    <td className="text-center py-2">✅</td>
                  </tr>
                  <tr>
                    <td className="py-2">Edge 90+</td>
                    <td className="text-center py-2">✅</td>
                    <td className="text-center py-2">✅</td>
                    <td className="text-center py-2">✅</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 'best-practices',
      title: 'Best Practices for Admins',
      content: (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h4 className="font-semibold text-green-800 mb-3">Reviewing Receipts</h4>
              <ul className="text-green-700 text-sm space-y-1">
                <li>• Always preview before approving</li>
                <li>• Verify receipt matches transaction amount</li>
                <li>• Check for signs of tampering or editing</li>
                <li>• Document issues in rejection reasons</li>
                <li>• Use zoom to read small text clearly</li>
              </ul>
            </div>
            
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-semibold text-blue-800 mb-3">File Management</h4>
              <ul className="text-blue-700 text-sm space-y-1">
                <li>• Download important receipts for records</li>
                <li>• Monitor server storage usage</li>
                <li>• Keep browser updated for best performance</li>
                <li>• Archive old transaction files periodically</li>
                <li>• Report technical issues promptly</li>
              </ul>
            </div>
          </div>
          
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
            <h4 className="font-semibold text-purple-800 mb-2">Security Reminders</h4>
            <ul className="text-purple-700 text-sm space-y-1">
              <li>• Files are only accessible to authenticated admins</li>
              <li>• All file access is logged for security auditing</li>
              <li>• Never share file URLs with unauthorized users</li>
              <li>• Report suspicious files or activities immediately</li>
            </ul>
          </div>
        </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <HelpCircle className="h-8 w-8 text-primary-600" />
            <h1 className="text-3xl font-bold text-gray-900">Admin File Upload & Preview Guide</h1>
          </div>
          <p className="text-gray-600">
            Complete guide for administrators on how to view, preview, and manage uploaded files and receipts.
          </p>
        </div>

        {/* Help Sections */}
        <div className="space-y-4">
          {helpSections.map((section) => (
            <div key={section.id} className="bg-white rounded-xl shadow-sm border border-gray-200">
              <button
                onClick={() => toggleSection(section.id)}
                className="w-full p-6 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <h2 className="text-xl font-semibold text-gray-900">{section.title}</h2>
                {expandedSections.has(section.id) ? (
                  <ChevronDown className="h-5 w-5 text-gray-500" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-gray-500" />
                )}
              </button>
              
              {expandedSections.has(section.id) && (
                <div className="px-6 pb-6 border-t border-gray-100">
                  {section.content}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Quick Reference Card */}
        <div className="mt-8 bg-gradient-to-r from-primary-50 to-primary-100 rounded-xl p-6 border border-primary-200">
          <h3 className="text-lg font-semibold text-primary-900 mb-4">Quick Reference</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-primary-800 mb-2">Essential Shortcuts</h4>
              <div className="space-y-1 text-sm text-primary-700">
                <div className="flex justify-between">
                  <span>Close preview</span>
                  <kbd className="bg-primary-200 px-2 py-1 rounded text-xs">ESC</kbd>
                </div>
                <div className="flex justify-between">
                  <span>Zoom in/out</span>
                  <kbd className="bg-primary-200 px-2 py-1 rounded text-xs">+/-</kbd>
                </div>
                <div className="flex justify-between">
                  <span>Rotate image</span>
                  <kbd className="bg-primary-200 px-2 py-1 rounded text-xs">R</kbd>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium text-primary-800 mb-2">File Limits</h4>
              <div className="space-y-1 text-sm text-primary-700">
                <div>Maximum size: <strong>10MB</strong></div>
                <div>Recommended: <strong>5MB or less</strong></div>
                <div>Supported: <strong>Images, PDFs</strong></div>
              </div>
            </div>
          </div>
        </div>

        {/* Support Contact */}
        <div className="mt-8 bg-gray-100 rounded-xl p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Need Additional Help?</h3>
          <p className="text-gray-600 mb-4">
            If you're experiencing issues not covered in this guide, please contact our support team.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex items-center space-x-2 text-sm text-gray-700">
              <span>📧</span>
              <span>admin-support@sahamtrading.com</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-700">
              <span>📞</span>
              <span>+251-XXX-XXX-XXX</span>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-700">
              <span>🕒</span>
              <span>Mon-Fri, 9 AM - 6 PM EAT</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}