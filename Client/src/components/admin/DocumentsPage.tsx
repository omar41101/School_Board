import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import { 
  Plus, 
  Search,
  Filter,
  FileText,
  Download,
  Upload,
  Eye,
  Edit,
  Trash2,
  MoreVertical,
  Calendar,
  User,
  FolderOpen,
  File,
  Image,
  Video
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

interface Document {
  id: string;
  name: string;
  type: 'pdf' | 'doc' | 'image' | 'video' | 'excel' | 'other';
  category: 'academic' | 'administrative' | 'legal' | 'financial' | 'reports' | 'templates';
  size: string;
  uploadedBy: {
    id: string;
    name: string;
    role: string;
  };
  uploadDate: string;
  lastModified: string;
  description?: string;
  tags: string[];
  isPublic: boolean;
  downloadCount: number;
}

export function DocumentsPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');

  // Mock data
  const mockDocuments: Document[] = [
    {
      id: '1',
      name: 'Student Handbook 2024-2025.pdf',
      type: 'pdf',
      category: 'academic',
      size: '2.4 MB',
      uploadedBy: {
        id: '1',
        name: 'John Smith',
        role: 'Administrator'
      },
      uploadDate: '2024-08-15',
      lastModified: '2024-09-01',
      description: 'Complete student handbook for the academic year 2024-2025',
      tags: ['handbook', 'students', 'policies'],
      isPublic: true,
      downloadCount: 245
    },
    {
      id: '2',
      name: 'Financial Report Q3 2024.xlsx',
      type: 'excel',
      category: 'financial',
      size: '856 KB',
      uploadedBy: {
        id: '2',
        name: 'Sarah Davis',
        role: 'Finance Manager'
      },
      uploadDate: '2024-10-01',
      lastModified: '2024-10-05',
      description: 'Quarterly financial report for Q3 2024',
      tags: ['finance', 'quarterly', 'report'],
      isPublic: false,
      downloadCount: 12
    },
    {
      id: '3',
      name: 'Science Fair Photos 2024.zip',
      type: 'other',
      category: 'academic',
      size: '45.2 MB',
      uploadedBy: {
        id: '3',
        name: 'Mike Johnson',
        role: 'Teacher'
      },
      uploadDate: '2024-09-28',
      lastModified: '2024-09-28',
      description: 'Photo collection from the annual science fair',
      tags: ['science fair', 'photos', 'events'],
      isPublic: true,
      downloadCount: 89
    },
    {
      id: '4',
      name: 'Staff Meeting Minutes - October.docx',
      type: 'doc',
      category: 'administrative',
      size: '124 KB',
      uploadedBy: {
        id: '1',
        name: 'John Smith',
        role: 'Administrator'
      },
      uploadDate: '2024-10-07',
      lastModified: '2024-10-07',
      description: 'Meeting minutes from monthly staff meeting',
      tags: ['meeting', 'staff', 'minutes'],
      isPublic: false,
      downloadCount: 28
    },
    {
      id: '5',
      name: 'Emergency Procedures Guide.pdf',
      type: 'pdf',
      category: 'legal',
      size: '1.8 MB',
      uploadedBy: {
        id: '4',
        name: 'Lisa Wilson',
        role: 'Safety Coordinator'
      },
      uploadDate: '2024-09-15',
      lastModified: '2024-09-20',
      description: 'Comprehensive guide for emergency procedures',
      tags: ['emergency', 'safety', 'procedures'],
      isPublic: true,
      downloadCount: 156
    }
  ];

  const getTypeIcon = (type: Document['type']) => {
    switch (type) {
      case 'pdf':
        return <FileText className="h-5 w-5 text-red-500" />;
      case 'doc':
        return <FileText className="h-5 w-5 text-blue-500" />;
      case 'excel':
        return <FileText className="h-5 w-5 text-green-500" />;
      case 'image':
        return <Image className="h-5 w-5 text-purple-500" />;
      case 'video':
        return <Video className="h-5 w-5 text-pink-500" />;
      default:
        return <File className="h-5 w-5 text-gray-500" />;
    }
  };

  const getCategoryColor = (category: Document['category']) => {
    switch (category) {
      case 'academic':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'administrative':
        return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'legal':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'financial':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'reports':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'templates':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const filteredDocuments = mockDocuments.filter(doc => {
    const matchesSearch = doc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         doc.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesTab = activeTab === 'all' || 
                      (activeTab === 'public' && doc.isPublic) ||
                      (activeTab === 'private' && !doc.isPublic);
    
    const matchesCategory = selectedCategory === 'all' || doc.category === selectedCategory;
    
    return matchesSearch && matchesTab && matchesCategory;
  });

  const getDocumentStats = () => {
    return {
      total: mockDocuments.length,
      public: mockDocuments.filter(d => d.isPublic).length,
      private: mockDocuments.filter(d => !d.isPublic).length,
      academic: mockDocuments.filter(d => d.category === 'academic').length,
      administrative: mockDocuments.filter(d => d.category === 'administrative').length,
      totalDownloads: mockDocuments.reduce((sum, d) => sum + d.downloadCount, 0),
      totalSize: mockDocuments.reduce((sum, d) => {
        const size = parseFloat(d.size.split(' ')[0]);
        const unit = d.size.split(' ')[1];
        return sum + (unit === 'MB' ? size : size / 1024);
      }, 0).toFixed(1)
    };
  };

  const stats = getDocumentStats();

  const handleViewDocument = (doc: Document) => {
    console.log('View document:', doc.name);
  };

  const handleEditDocument = (doc: Document) => {
    console.log('Edit document:', doc.name);
  };

  const handleDeleteDocument = (doc: Document) => {
    console.log('Delete document:', doc.name);
  };

  const handleDownloadDocument = (doc: Document) => {
    console.log('Download document:', doc.name);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-[#0D1B2A] dark:text-white">Document Management</h1>
          <p className="text-gray-600 dark:text-gray-300">Organize and manage school documents</p>
        </div>
        <div className="flex items-center space-x-3">
          <Button variant="outline" size="sm">
            <Download className="mr-2 h-4 w-4" />
            Bulk Download
          </Button>
          <Button className="bg-[#0D1B2A] hover:bg-[#1B2B3A] dark:bg-[#3E92CC] dark:hover:bg-[#3E92CC]/80">
            <Upload className="mr-2 h-4 w-4" />
            Upload Document
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4">
        <Card className="border-0 shadow-md bg-white dark:bg-[#1B2B3A]">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-[#0D1B2A] dark:text-white">{stats.total}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Total Documents</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-white dark:bg-[#1B2B3A]">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">{stats.public}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Public</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-white dark:bg-[#1B2B3A]">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">{stats.private}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Private</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-white dark:bg-[#1B2B3A]">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{stats.academic}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Academic</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-white dark:bg-[#1B2B3A]">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-[#3E92CC]">{stats.totalDownloads}</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Downloads</p>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-md bg-white dark:bg-[#1B2B3A]">
          <CardContent className="p-4">
            <div className="text-center">
              <p className="text-2xl font-bold text-purple-600">{stats.totalSize} MB</p>
              <p className="text-sm text-gray-600 dark:text-gray-300">Total Size</p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center space-x-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <Input
            placeholder="Search documents by name, description, or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Filter className="h-4 w-4 text-gray-400" />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-[#3E92CC] focus:border-transparent"
          >
            <option value="all">All Categories</option>
            <option value="academic">Academic</option>
            <option value="administrative">Administrative</option>
            <option value="legal">Legal</option>
            <option value="financial">Financial</option>
            <option value="reports">Reports</option>
            <option value="templates">Templates</option>
          </select>
        </div>
      </div>

      {/* Documents List */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-3 max-w-md">
          <TabsTrigger value="all">All ({stats.total})</TabsTrigger>
          <TabsTrigger value="public">Public ({stats.public})</TabsTrigger>
          <TabsTrigger value="private">Private ({stats.private})</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-6">
          {filteredDocuments.length > 0 ? (
            <div className="space-y-4">
              {filteredDocuments.map((doc) => (
                <Card key={doc.id} className="border-0 shadow-md bg-white dark:bg-[#1B2B3A] hover:shadow-lg transition-shadow group">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-4 flex-1">
                        <div className="flex-shrink-0">
                          {getTypeIcon(doc.type)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-2">
                            <h3 className="font-semibold text-[#0D1B2A] dark:text-white truncate">{doc.name}</h3>
                            <Badge className={`text-xs px-2 py-1 ${getCategoryColor(doc.category)}`}>
                              {doc.category}
                            </Badge>
                            {doc.isPublic ? (
                              <Badge variant="outline" className="text-xs px-2 py-1 border-green-300 text-green-600">
                                Public
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="text-xs px-2 py-1 border-orange-300 text-orange-600">
                                Private
                              </Badge>
                            )}
                          </div>
                          
                          {doc.description && (
                            <p className="text-sm text-gray-600 dark:text-gray-300 mb-2 line-clamp-2">
                              {doc.description}
                            </p>
                          )}
                          
                          <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                            <div className="flex items-center space-x-1">
                              <User className="h-4 w-4" />
                              <span>{doc.uploadedBy.name}</span>
                            </div>
                            <div className="flex items-center space-x-1">
                              <Calendar className="h-4 w-4" />
                              <span>{doc.uploadDate}</span>
                            </div>
                            <span>{doc.size}</span>
                            <span>{doc.downloadCount} downloads</span>
                          </div>
                          
                          {doc.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-2">
                              {doc.tags.map((tag, index) => (
                                <Badge key={index} variant="outline" className="text-xs px-2 py-1">
                                  {tag}
                                </Badge>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2 ml-4">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDownloadDocument(doc)}
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => handleViewDocument(doc)}>
                              <Eye className="mr-2 h-4 w-4" />
                              View
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => handleEditDocument(doc)}>
                              <Edit className="mr-2 h-4 w-4" />
                              Edit Details
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDeleteDocument(doc)}
                              className="text-destructive focus:text-destructive"
                            >
                              <Trash2 className="mr-2 h-4 w-4" />
                              Delete
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border-0 shadow-md bg-white dark:bg-[#1B2B3A]">
              <CardContent className="p-12 text-center">
                <FolderOpen className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-[#0D1B2A] dark:text-white mb-2">
                  No documents found
                </h3>
                <p className="text-gray-600 dark:text-gray-300 mb-4">
                  {searchTerm ? 'Try adjusting your search criteria.' : 'Get started by uploading your first document.'}
                </p>
                {!searchTerm && (
                  <Button className="bg-[#0D1B2A] hover:bg-[#1B2B3A] dark:bg-[#3E92CC] dark:hover:bg-[#3E92CC]/80">
                    <Upload className="mr-2 h-4 w-4" />
                    Upload Document
                  </Button>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}