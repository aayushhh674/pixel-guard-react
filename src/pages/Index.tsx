import React, { useState } from 'react';
import { ImageUpload } from '@/components/ImageUpload';
import { EncryptionForm } from '@/components/EncryptionForm';
import { ResultDisplay } from '@/components/ResultDisplay';
import { Card } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Shield, Lock, AlertTriangle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ProcessResult {
  success: boolean;
  compressedImageUrl?: string;
  encryptedImageUrl?: string;
  message: string;
  operation: 'encrypt' | 'decrypt';
}

const Index = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ProcessResult | null>(null);
  const { toast } = useToast();

  const handleImageSelect = (file: File) => {
    setSelectedImage(file);
    setResult(null); // Clear previous results
  };

  const handleImageRemove = () => {
    setSelectedImage(null);
    setResult(null);
  };

  const handleEncryption = async (key: string, operation: 'encrypt' | 'decrypt') => {
    if (!selectedImage) {
      toast({
        title: "Error",
        description: "Please select an image first",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Create FormData for file upload
      const formData = new FormData();
      formData.append('image', selectedImage);
      formData.append('key', key);
      formData.append('operation', operation);

      // Simulate API call (replace with your actual endpoint)
      const response = await fetch('/api/process-image', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server error: ${response.status}`);
      }

      const data = await response.json();
      
      if (data.success) {
        setResult({
          success: true,
          compressedImageUrl: data.compressedImageUrl,
          encryptedImageUrl: data.encryptedImageUrl || URL.createObjectURL(selectedImage), // Fallback for demo
          message: `Image ${operation}ed successfully!`,
          operation,
        });
        
        toast({
          title: "Success",
          description: `Image ${operation}ed successfully!`,
        });
      } else {
        throw new Error(data.message || 'Processing failed');
      }
      
    } catch (error) {
      console.error('Encryption error:', error);
      
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      
      setResult({
        success: false,
        message: errorMessage,
        operation,
      });
      
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setSelectedImage(null);
    setResult(null);
  };

  const handleDownload = (type: 'compressed' | 'encrypted') => {
    toast({
      title: "Download Started",
      description: `Your ${type} image download has begun`,
    });
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="border-b border-border/50 bg-gradient-secondary">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center space-x-4">
            <div className="p-3 rounded-xl bg-primary/10 border border-primary/20">
              <Shield className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">
                Image Encryption Tool
              </h1>
              <p className="text-muted-foreground mt-1">
                Secure your images with AES encryption
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          
          {/* Info Card */}
          <Card className="p-6 bg-gradient-accent border-primary/20">
            <div className="flex items-start space-x-4">
              <div className="p-2 rounded-lg bg-primary/10">
                <Lock className="h-5 w-5 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="font-semibold text-foreground">
                  AES Encryption Security
                </h3>
                <p className="text-sm text-muted-foreground">
                  This tool uses Advanced Encryption Standard (AES) to securely encrypt and decrypt your images. 
                  Your 16-character key is used to protect your data with military-grade encryption.
                </p>
              </div>
            </div>
          </Card>

          {/* Main Grid */}
          <div className="grid lg:grid-cols-2 gap-8">
            
            {/* Left Column */}
            <div className="space-y-6">
              <ImageUpload
                onImageSelect={handleImageSelect}
                selectedImage={selectedImage}
                onImageRemove={handleImageRemove}
              />
              
              <EncryptionForm
                onSubmit={handleEncryption}
                isLoading={isLoading}
                hasImage={!!selectedImage}
              />
            </div>

            {/* Right Column */}
            <div className="space-y-6">
              {result ? (
                <ResultDisplay
                  result={result}
                  onDownload={handleDownload}
                  onReset={handleReset}
                />
              ) : (
                <Card className="p-8 bg-gradient-secondary border-border/50">
                  <div className="text-center space-y-4">
                    <div className="p-4 rounded-full bg-muted/50 mx-auto w-fit">
                      <Shield className="h-12 w-12 text-muted-foreground" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="text-lg font-semibold text-foreground">
                        Ready to Process
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Upload an image and enter your encryption key to get started
                      </p>
                    </div>
                  </div>
                </Card>
              )}

              {/* Warning Alert */}
              <Alert className="border-warning/50 bg-warning/10">
                <AlertTriangle className="h-4 w-4 text-warning" />
                <AlertDescription className="text-warning-foreground">
                  <strong>Important:</strong> Keep your encryption key safe. 
                  You'll need the same key to decrypt your image later.
                </AlertDescription>
              </Alert>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;