import React, { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  Filter,
  FileText,
  Calendar,
  Tag,
  Star,
  Archive,
  Trash2,
  Edit3,
  Eye,
  MoreHorizontal,
  FolderOpen,
  Hash,
  X
} from 'lucide-react';

interface Note {
  id: string;
  title: string;
  content: string;
  category: string;
  tags: string[];
  isPinned: boolean;
  isArchived: boolean;
  createdAt: Date;
  updatedAt: Date;
  wordCount: number;
}

const Notes: React.FC = () => {
  const [selectedNote, setSelectedNote] = useState<string | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterTag, setFilterTag] = useState<string>('all');
  const [showArchived, setShowArchived] = useState(false);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [showNewNote, setShowNewNote] = useState(false);
  const [newNote, setNewNote] = useState({
    title: '',
    content: '',
    category: 'General',
    tags: [] as string[]
  });

  // Mock notes data
  const [notes, setNotes] = useState<Note[]>([
    {
      id: '1',
      title: 'Project Ideas',
      content: `# Project Ideas for 2024

## Web Development
- Personal portfolio redesign
- Task management app with AI features
- Real-time collaboration tool

## Mobile Apps
- Habit tracker with gamification
- Expense tracker with receipt scanning
- Meditation app with custom sounds

## Learning Goals
- Master TypeScript advanced features
- Learn React Native
- Explore machine learning basics

## Notes
Remember to focus on user experience and accessibility in all projects.`,
      category: 'Ideas',
      tags: ['projects', 'planning', '2024'],
      isPinned: true,
      isArchived: false,
      createdAt: new Date(2024, 10, 1),
      updatedAt: new Date(2024, 11, 15),
      wordCount: 85
    },
    {
      id: '2',
      title: 'Meeting Notes - Team Sync',
      content: `# Team Sync Meeting - Dec 18, 2024

## Attendees
- Alice (PM)
- Bob (Dev)
- Charlie (Designer)
- Me

## Agenda
1. Sprint review
2. Upcoming deadlines
3. Resource allocation

## Key Points
- Sprint 12 completed successfully
- New feature requests from client
- Need to prioritize bug fixes
- Design system updates required

## Action Items
- [ ] Bob: Fix authentication bug by Friday
- [ ] Charlie: Update design tokens
- [ ] Alice: Schedule client review meeting
- [ ] Me: Update project documentation

## Next Meeting
December 25, 2024 at 10:00 AM`,
      category: 'Work',
      tags: ['meetings', 'team', 'action-items'],
      isPinned: false,
      isArchived: false,
      createdAt: new Date(2024, 11, 18),
      updatedAt: new Date(2024, 11, 18),
      wordCount: 142
    },
    {
      id: '3',
      title: 'Book Recommendations',
      content: `# Books to Read

## Technical Books
- "Clean Code" by Robert Martin
- "System Design Interview" by Alex Xu
- "Designing Data-Intensive Applications" by Martin Kleppmann

## Personal Development
- "Atomic Habits" by James Clear
- "Deep Work" by Cal Newport
- "The Pragmatic Programmer" by Andy Hunt

## Fiction
- "The Midnight Library" by Matt Haig
- "Project Hail Mary" by Andy Weir
- "Klara and the Sun" by Kazuo Ishiguro

## Currently Reading
"Atomic Habits" - Great insights on habit formation and breaking bad habits.`,
      category: 'Personal',
      tags: ['books', 'reading', 'recommendations'],
      isPinned: false,
      isArchived: false,
      createdAt: new Date(2024, 10, 20),
      updatedAt: new Date(2024, 11, 10),
      wordCount: 98
    },
    {
      id: '4',
      title: 'Recipe Collection',
      content: `# Favorite Recipes

## Breakfast
### Overnight Oats
- 1/2 cup rolled oats
- 1/2 cup milk
- 1 tbsp chia seeds
- 1 tbsp honey
- Fresh berries

Mix all ingredients, refrigerate overnight.

## Dinner
### Pasta Aglio e Olio
- 400g spaghetti
- 6 cloves garlic, sliced
- 1/4 cup olive oil
- Red pepper flakes
- Fresh parsley
- Parmesan cheese

Simple but delicious!`,
      category: 'Personal',
      tags: ['recipes', 'cooking', 'food'],
      isPinned: false,
      isArchived: true,
      createdAt: new Date(2024, 9, 15),
      updatedAt: new Date(2024, 10, 5),
      wordCount: 76
    }
  ]);

  const categories = ['Ideas', 'Work', 'Personal', 'Learning', 'Travel'];
  const allTags = useMemo(() => {
    const tagSet = new Set<string>();
    notes.forEach(note => note.tags.forEach(tag => tagSet.add(tag)));
    return Array.from(tagSet).sort();
  }, [notes]);

  // Filter notes based on search and filters
  const filteredNotes = useMemo(() => {
    return notes.filter(note => {
      // Archive filter
      if (!showArchived && note.isArchived) return false;
      if (showArchived && !note.isArchived) return false;

      // Search filter
      if (searchTerm && !note.title.toLowerCase().includes(searchTerm.toLowerCase()) && 
          !note.content.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }

      // Category filter
      if (filterCategory !== 'all' && note.category !== filterCategory) return false;

      // Tag filter
      if (filterTag !== 'all' && !note.tags.includes(filterTag)) return false;

      return true;
    });
  }, [notes, searchTerm, filterCategory, filterTag, showArchived]);

  // Sort notes (pinned first, then by updated date)
  const sortedNotes = useMemo(() => {
    return [...filteredNotes].sort((a, b) => {
      if (a.isPinned && !b.isPinned) return -1;
      if (!a.isPinned && b.isPinned) return 1;
      return b.updatedAt.getTime() - a.updatedAt.getTime();
    });
  }, [filteredNotes]);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
  };

  const getPreviewText = (content: string, maxLength: number = 150) => {
    // Remove markdown formatting for preview
    const plainText = content
      .replace(/#{1,6}\s+/g, '') // Remove headers
      .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
      .replace(/\*(.*?)\*/g, '$1') // Remove italic
      .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove links
      .replace(/`(.*?)`/g, '$1') // Remove inline code
      .replace(/\n+/g, ' ') // Replace newlines with spaces
      .trim();
    
    return plainText.length > maxLength 
      ? plainText.substring(0, maxLength) + '...'
      : plainText;
  };

  // Simple markdown renderer
  const renderMarkdown = (content: string) => {
    return content
      .replace(/^# (.*$)/gim, '<h1 class="text-2xl font-bold mb-4 mt-6 first:mt-0">$1</h1>')
      .replace(/^## (.*$)/gim, '<h2 class="text-xl font-semibold mb-3 mt-5">$1</h2>')
      .replace(/^### (.*$)/gim, '<h3 class="text-lg font-medium mb-2 mt-4">$1</h3>')
      .replace(/\*\*(.*?)\*\*/gim, '<strong class="font-semibold">$1</strong>')
      .replace(/\*(.*?)\*/gim, '<em class="italic">$1</em>')
      .replace(/`(.*?)`/gim, '<code class="bg-secondary px-1 py-0.5 rounded text-sm font-mono">$1</code>')
      .replace(/\[(.*?)\]\((.*?)\)/gim, '<a href="$2" class="text-primary hover:underline">$1</a>')
      .replace(/^- \[ \] (.*$)/gim, '<div class="flex items-center space-x-2 my-1"><input type="checkbox" disabled class="rounded"> <span>$1</span></div>')
      .replace(/^- \[x\] (.*$)/gim, '<div class="flex items-center space-x-2 my-1"><input type="checkbox" checked disabled class="rounded"> <span class="line-through text-muted-foreground">$1</span></div>')
      .replace(/^- (.*$)/gim, '<div class="flex items-start space-x-2 my-1"><span class="text-primary mt-1">•</span><span>$1</span></div>')
      .replace(/^\d+\. (.*$)/gim, '<div class="flex items-start space-x-2 my-1"><span class="text-primary font-medium">$1.</span><span>$2</span></div>')
      .replace(/\n\n/gim, '<br><br>')
      .replace(/\n/gim, '<br>');
  };

  // Note creation handler
  const handleCreateNote = () => {
    if (!newNote.title.trim() || !newNote.content.trim()) return;

    const note: Note = {
      id: `note_${Date.now()}`,
      title: newNote.title,
      content: newNote.content,
      category: newNote.category,
      tags: newNote.tags,
      isPinned: false,
      isArchived: false,
      wordCount: newNote.content.trim().split(/\s+/).length,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setNotes(prev => [note, ...prev]);
    setNewNote({
      title: '',
      content: '',
      category: 'General',
      tags: []
    });
    setShowNewNote(false);
  };

  const togglePin = (noteId: string) => {
    setNotes(notes.map(note => 
      note.id === noteId ? { ...note, isPinned: !note.isPinned } : note
    ));
  };

  const toggleArchive = (noteId: string) => {
    setNotes(notes.map(note => 
      note.id === noteId ? { ...note, isArchived: !note.isArchived } : note
    ));
  };

  const selectedNoteData = selectedNote ? notes.find(n => n.id === selectedNote) : null;

  // Note statistics
  const noteStats = useMemo(() => {
    const total = notes.filter(n => !n.isArchived).length;
    const archived = notes.filter(n => n.isArchived).length;
    const pinned = notes.filter(n => n.isPinned && !n.isArchived).length;
    const totalWords = notes.filter(n => !n.isArchived).reduce((sum, note) => sum + note.wordCount, 0);

    return { total, archived, pinned, totalWords };
  }, [notes]);

  if (selectedNote && selectedNoteData) {
    return (
      <div className="h-full overflow-y-auto pb-4">
        {/* Note Header */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setSelectedNote(null)}
                className="p-2 hover:bg-accent rounded-lg transition-colors"
              >
                ←
              </button>
              <div>
                <h2 className="text-2xl font-semibold text-foreground">{selectedNoteData.title}</h2>
                <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                  <span>Updated {formatDate(selectedNoteData.updatedAt)}</span>
                  <span>{selectedNoteData.wordCount} words</span>
                  <span className="px-2 py-1 bg-secondary text-secondary-foreground rounded-full">
                    {selectedNoteData.category}
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => togglePin(selectedNoteData.id)}
                className={`p-2 rounded-lg transition-colors ${
                  selectedNoteData.isPinned 
                    ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400' 
                    : 'hover:bg-accent'
                }`}
              >
                <Star className="w-4 h-4" />
              </button>
              <button
                onClick={() => setIsEditing(!isEditing)}
                className={`p-2 rounded-lg transition-colors ${
                  isEditing ? 'bg-primary text-primary-foreground' : 'hover:bg-accent'
                }`}
              >
                {isEditing ? <Eye className="w-4 h-4" /> : <Edit3 className="w-4 h-4" />}
              </button>
              <button className="p-2 hover:bg-accent rounded-lg transition-colors">
                <MoreHorizontal className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Tags */}
          {selectedNoteData.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {selectedNoteData.tags.map(tag => (
                <span key={tag} className="inline-flex items-center px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
                  <Hash className="w-3 h-3 mr-1" />
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>

        {/* Note Content */}
        <div className="bg-card border border-border rounded-lg p-6">
          {isEditing ? (
            <textarea
              value={selectedNoteData.content}
              onChange={(e) => {
                const wordCount = e.target.value.trim().split(/\s+/).length;
                setNotes(notes.map(note => 
                  note.id === selectedNote 
                    ? { ...note, content: e.target.value, wordCount, updatedAt: new Date() }
                    : note
                ));
              }}
              className="w-full h-96 bg-transparent text-foreground resize-none focus:outline-none font-mono text-sm leading-relaxed"
              placeholder="Start writing..."
            />
          ) : (
            <div
              className="prose prose-sm max-w-none dark:prose-invert text-foreground leading-relaxed"
              dangerouslySetInnerHTML={{ __html: renderMarkdown(selectedNoteData.content) }}
            />
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto pb-4">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-2xl font-semibold text-foreground">
            {showArchived ? 'Archived Notes' : 'Notes'}
          </h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowArchived(!showArchived)}
              className={`px-3 py-2 rounded-lg transition-colors ${
                showArchived 
                  ? 'bg-secondary text-secondary-foreground' 
                  : 'hover:bg-accent'
              }`}
            >
              <Archive className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowNewNote(true)}
              className="flex items-center space-x-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>New Note</span>
            </button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <FileText className="w-4 h-4 text-blue-500" />
              <span className="text-sm text-muted-foreground">Total Notes</span>
            </div>
            <p className="text-lg font-semibold text-foreground">{noteStats.total}</p>
          </div>
          
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="text-sm text-muted-foreground">Pinned</span>
            </div>
            <p className="text-lg font-semibold text-foreground">{noteStats.pinned}</p>
          </div>
          
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Archive className="w-4 h-4 text-gray-500" />
              <span className="text-sm text-muted-foreground">Archived</span>
            </div>
            <p className="text-lg font-semibold text-foreground">{noteStats.archived}</p>
          </div>
          
          <div className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center space-x-2 mb-2">
              <Hash className="w-4 h-4 text-green-500" />
              <span className="text-sm text-muted-foreground">Total Words</span>
            </div>
            <p className="text-lg font-semibold text-foreground">{noteStats.totalWords.toLocaleString()}</p>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search notes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 bg-input text-foreground rounded-lg w-full border border-border focus:ring-1 focus:ring-ring focus:outline-none"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4">
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 bg-input text-foreground rounded-lg border border-border focus:ring-1 focus:ring-ring focus:outline-none"
            >
              <option value="all">All Categories</option>
              {categories.map(category => (
                <option key={category} value={category}>{category}</option>
              ))}
            </select>

            <select
              value={filterTag}
              onChange={(e) => setFilterTag(e.target.value)}
              className="px-3 py-2 bg-input text-foreground rounded-lg border border-border focus:ring-1 focus:ring-ring focus:outline-none"
            >
              <option value="all">All Tags</option>
              {allTags.map(tag => (
                <option key={tag} value={tag}>#{tag}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Notes Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {sortedNotes.map((note) => (
          <div
            key={note.id}
            onClick={() => setSelectedNote(note.id)}
            className="bg-card border border-border rounded-lg p-4 hover:shadow-lg transition-all cursor-pointer group relative"
          >
            {/* Pin indicator */}
            {note.isPinned && (
              <Star className="absolute top-2 right-2 w-4 h-4 text-yellow-500 fill-current" />
            )}

            <div className="space-y-3">
              <div>
                <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
                  {note.title}
                </h3>
                <p className="text-sm text-muted-foreground mt-1 line-clamp-3">
                  {getPreviewText(note.content)}
                </p>
              </div>

              {/* Tags */}
              {note.tags.length > 0 && (
                <div className="flex flex-wrap gap-1">
                  {note.tags.slice(0, 3).map(tag => (
                    <span key={tag} className="inline-flex items-center px-2 py-1 bg-primary/10 text-primary rounded-full text-xs">
                      #{tag}
                    </span>
                  ))}
                  {note.tags.length > 3 && (
                    <span className="text-xs text-muted-foreground">+{note.tags.length - 3}</span>
                  )}
                </div>
              )}

              {/* Metadata */}
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-1 bg-secondary text-secondary-foreground rounded-full">
                    {note.category}
                  </span>
                  <span>{note.wordCount} words</span>
                </div>
                <span>{formatDate(note.updatedAt)}</span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity flex space-x-1">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  togglePin(note.id);
                }}
                className={`p-1 rounded transition-colors ${
                  note.isPinned 
                    ? 'bg-yellow-100 text-yellow-600 dark:bg-yellow-900/20 dark:text-yellow-400' 
                    : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                }`}
              >
                <Star className="w-3 h-3" />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  toggleArchive(note.id);
                }}
                className="p-1 bg-secondary text-secondary-foreground rounded hover:bg-secondary/80 transition-colors"
              >
                <Archive className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {sortedNotes.length === 0 && (
        <div className="text-center py-12">
          <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground mb-2">
            {showArchived ? 'No archived notes' : 'No notes yet'}
          </h3>
          <p className="text-muted-foreground mb-4">
            {showArchived 
              ? 'Your archived notes will appear here' 
              : 'Create your first note to get started'
            }
          </p>
          {!showArchived && (
            <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors">
              Create your first note
            </button>
          )}
        </div>
      )}

      {/* Note Creation Modal */}
      {showNewNote && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="bg-card border border-border rounded-lg p-6 w-full max-w-2xl mx-4 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-foreground">Create New Note</h3>
              <button
                onClick={() => setShowNewNote(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Title</label>
                <input
                  type="text"
                  value={newNote.title}
                  onChange={(e) => setNewNote({...newNote, title: e.target.value})}
                  className="w-full px-3 py-2 bg-input text-foreground rounded-lg border border-border focus:ring-1 focus:ring-ring focus:outline-none"
                  placeholder="Enter note title"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Category</label>
                <select
                  value={newNote.category}
                  onChange={(e) => setNewNote({...newNote, category: e.target.value})}
                  className="w-full px-3 py-2 bg-input text-foreground rounded-lg border border-border focus:ring-1 focus:ring-ring focus:outline-none"
                >
                  <option value="General">General</option>
                  <option value="Ideas">Ideas</option>
                  <option value="Work">Work</option>
                  <option value="Personal">Personal</option>
                  <option value="Learning">Learning</option>
                  <option value="Travel">Travel</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Tags</label>
                <div className="space-y-2">
                  <div className="flex flex-wrap gap-2 min-h-[40px] p-2 bg-input border border-border rounded-lg">
                    {newNote.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="inline-flex items-center px-2 py-1 bg-primary/10 text-primary rounded-full text-xs"
                      >
                        <Tag className="w-3 h-3 mr-1" />
                        {tag}
                        <button
                          onClick={() => {
                            const updatedTags = newNote.tags.filter((_, i) => i !== index);
                            setNewNote({...newNote, tags: updatedTags});
                          }}
                          className="ml-1 hover:text-red-500 transition-colors"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    ))}
                    <input
                      type="text"
                      placeholder="Add tags..."
                      className="flex-1 min-w-[120px] bg-transparent border-none outline-none text-sm"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ',') {
                          e.preventDefault();
                          const value = e.currentTarget.value.trim();
                          if (value && !newNote.tags.includes(value)) {
                            setNewNote({...newNote, tags: [...newNote.tags, value]});
                            e.currentTarget.value = '';
                          }
                        }
                      }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Press Enter or comma to add tags. Click the X to remove tags.
                  </p>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-foreground mb-1">Content</label>
                <textarea
                  value={newNote.content}
                  onChange={(e) => setNewNote({...newNote, content: e.target.value})}
                  className="w-full px-3 py-2 bg-input text-foreground rounded-lg border border-border focus:ring-1 focus:ring-ring focus:outline-none font-mono text-sm"
                  rows={12}
                  placeholder="Write your note here... You can use markdown formatting:&#10;# Heading&#10;**bold** *italic*&#10;- List item&#10;`code`"
                />
              </div>

              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowNewNote(false)}
                  className="flex-1 px-4 py-2 bg-secondary text-secondary-foreground rounded-lg hover:bg-secondary/80 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleCreateNote}
                  className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
                >
                  Create Note
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notes;
