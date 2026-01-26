import { motion } from 'framer-motion';
import { Upload, FileText, Image, File, X } from 'lucide-react';
import { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';

interface UploadedFile {
  id: string;
  name: string;
  type: 'text' | 'image' | 'pdf';
  size: string;
}

interface UploadZoneProps {
  onFilesChange?: (files: UploadedFile[]) => void;
}

export function UploadZone({ onFilesChange }: UploadZoneProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [files, setFiles] = useState<UploadedFile[]>([]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    processFiles(droppedFiles);
  }, []);

  const processFiles = (rawFiles: File[]) => {
    const newFiles: UploadedFile[] = rawFiles.map(file => ({
      id: Math.random().toString(36).substr(2, 9),
      name: file.name,
      type: file.type.includes('image') ? 'image' : 
            file.type.includes('pdf') ? 'pdf' : 'text',
      size: formatFileSize(file.size),
    }));
    
    const updatedFiles = [...files, ...newFiles];
    setFiles(updatedFiles);
    onFilesChange?.(updatedFiles);
  };

  const removeFile = (id: string) => {
    const updatedFiles = files.filter(f => f.id !== id);
    setFiles(updatedFiles);
    onFilesChange?.(updatedFiles);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'image': return Image;
      case 'pdf': return File;
      default: return FileText;
    }
  };

  return (
    <div className="space-y-4">
      {/* Upload Area */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        className={cn(
          "relative border-2 border-dashed rounded-2xl p-8 transition-all duration-300 cursor-pointer",
          isDragging 
            ? "border-primary bg-primary/5" 
            : "border-border hover:border-primary/50 hover:bg-muted/30"
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById('file-input')?.click()}
      >
        <input
          id="file-input"
          type="file"
          className="hidden"
          multiple
          accept=".txt,.pdf,.png,.jpg,.jpeg,.webp"
          onChange={(e) => processFiles(Array.from(e.target.files || []))}
        />
        
        <div className="flex flex-col items-center justify-center gap-4">
          <div className={cn(
            "w-16 h-16 rounded-2xl flex items-center justify-center transition-all",
            isDragging ? "bg-primary/20" : "bg-muted"
          )}>
            <Upload className={cn(
              "w-7 h-7 transition-colors",
              isDragging ? "text-primary" : "text-muted-foreground"
            )} />
          </div>
          
          <div className="text-center">
            <p className="text-foreground font-medium mb-1">
              Drop files here or click to upload
            </p>
            <p className="text-sm text-muted-foreground">
              Text, Images, or PDF files • English, Hindi, Telugu
            </p>
          </div>

          {/* Input type icons */}
          <div className="flex items-center gap-6 mt-2">
            <InputTypeChip icon={FileText} label="Text" />
            <InputTypeChip icon={Image} label="Image" />
            <InputTypeChip icon={File} label="PDF" />
          </div>
        </div>
      </motion.div>

      {/* Uploaded Files */}
      {files.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-2"
        >
          {files.map((file, index) => {
            const Icon = getFileIcon(file.type);
            return (
              <motion.div
                key={file.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                className="glass-card p-4 flex items-center justify-between group"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <Icon className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm font-medium text-foreground truncate max-w-[200px]">
                      {file.name}
                    </p>
                    <p className="text-xs text-muted-foreground">{file.size}</p>
                  </div>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(file.id);
                  }}
                  className="p-2 rounded-lg hover:bg-destructive/10 text-muted-foreground hover:text-destructive transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </motion.div>
            );
          })}
        </motion.div>
      )}
    </div>
  );
}

function InputTypeChip({ icon: Icon, label }: { icon: React.ElementType; label: string }) {
  return (
    <div className="flex items-center gap-2 text-muted-foreground">
      <Icon className="w-4 h-4" />
      <span className="text-xs">{label}</span>
    </div>
  );
}
